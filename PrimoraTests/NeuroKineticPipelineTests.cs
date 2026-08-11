using Primora;
using Primora.NeuroKinetic;

namespace PrimoraTests
{
    /// <summary>
    /// Covers the behaviour that the previous stick smoothing got wrong: shared state
    /// across controllers, a delta-independent filter, and truncation bias at centre.
    /// </summary>
    [TestClass]
    public class NeuroKineticPipelineTests
    {
        private const double OneMillisecond = 1.0;

        private static DS4State StateWith(byte lx, byte ly, byte rx, byte ry)
        {
            return new DS4State { LX = lx, LY = ly, RX = rx, RY = ry };
        }

        // --- delta handling -------------------------------------------------

        [TestMethod]
        public void ToDeltaSeconds_ConvertsMillisecondsToSeconds()
        {
            Assert.AreEqual(0.001f, NeuroKineticPipeline.ToDeltaSeconds(1.0), 1e-6f);
            Assert.AreEqual(0.004f, NeuroKineticPipeline.ToDeltaSeconds(4.0), 1e-6f);
        }

        [TestMethod]
        public void ToDeltaSeconds_ClampsNonPositiveDeltas()
        {
            // The filter divides by dt to estimate velocity, so a zero delta — which
            // happens on the first report and on duplicate timestamps — must never
            // reach it.
            Assert.AreEqual(NeuroKineticPipeline.MinDeltaSeconds, NeuroKineticPipeline.ToDeltaSeconds(0.0));
            Assert.AreEqual(NeuroKineticPipeline.MinDeltaSeconds, NeuroKineticPipeline.ToDeltaSeconds(-5.0));
            Assert.AreEqual(NeuroKineticPipeline.MinDeltaSeconds, NeuroKineticPipeline.ToDeltaSeconds(double.NaN));
        }

        [TestMethod]
        public void ToDeltaSeconds_ClampsImplausiblyLargeDeltas()
        {
            // A stalled or resumed session must not be treated as one enormous step.
            Assert.AreEqual(NeuroKineticPipeline.MaxDeltaSeconds, NeuroKineticPipeline.ToDeltaSeconds(10_000.0));
        }

        // --- centre stability ------------------------------------------------

        [TestMethod]
        public void ApplySmoothing_HeldAtCentre_DoesNotDrift()
        {
            // The replaced implementation truncated instead of rounding, biasing every
            // sample toward zero, and started from a static zero rather than the current
            // position — a centred stick visibly pulled toward down-left.
            var pipeline = new NeuroKineticPipeline(0);

            for (int i = 0; i < 500; i++)
            {
                var state = StateWith(128, 128, 128, 128);
                pipeline.ApplySmoothing(state, OneMillisecond);

                Assert.AreEqual(128, state.LX, "LX drifted from centre");
                Assert.AreEqual(128, state.LY, "LY drifted from centre");
                Assert.AreEqual(128, state.RX, "RX drifted from centre");
                Assert.AreEqual(128, state.RY, "RY drifted from centre");
            }
        }

        [TestMethod]
        public void ApplySmoothing_FirstSample_PassesThroughUnchanged()
        {
            var pipeline = new NeuroKineticPipeline(0);
            var state = StateWith(200, 60, 10, 245);

            pipeline.ApplySmoothing(state, OneMillisecond);

            Assert.AreEqual(200, state.LX);
            Assert.AreEqual(60, state.LY);
            Assert.AreEqual(10, state.RX);
            Assert.AreEqual(245, state.RY);
        }

        // --- controller isolation --------------------------------------------

        [TestMethod]
        public void Pipelines_DoNotShareStateAcrossControllers()
        {
            // The regression this whole change exists for: the previous smoothing state
            // lived in static fields, so a second controller's sticks moved the first's.
            var first = new NeuroKineticPipeline(0);
            var second = new NeuroKineticPipeline(1);

            // Settle controller one at centre.
            for (int i = 0; i < 50; i++)
            {
                first.ApplySmoothing(StateWith(128, 128, 128, 128), OneMillisecond);
            }

            // Slam controller two to a corner.
            for (int i = 0; i < 50; i++)
            {
                second.ApplySmoothing(StateWith(255, 0, 255, 0), OneMillisecond);
            }

            var probe = StateWith(128, 128, 128, 128);
            first.ApplySmoothing(probe, OneMillisecond);

            Assert.AreEqual(128, probe.LX, "controller two's input leaked into controller one");
            Assert.AreEqual(128, probe.LY, "controller two's input leaked into controller one");
        }

        // --- the property that makes this better than a fixed-alpha EMA --------

        [TestMethod]
        public void Smoothing_TracksFastMotionMoreCloselyThanSlowJitter()
        {
            // One-Euro's whole point: smooth hard when the stick is barely moving (kill
            // jitter), get out of the way when it is moving fast (preserve flicks). A
            // fixed-alpha EMA cannot do both, and the replaced code was a fixed EMA.
            var jitterPipeline = new NeuroKineticPipeline(0);
            var flickPipeline = new NeuroKineticPipeline(1);

            // Prime both at centre.
            jitterPipeline.ApplySmoothing(StateWith(128, 128, 128, 128), OneMillisecond);
            flickPipeline.ApplySmoothing(StateWith(128, 128, 128, 128), OneMillisecond);

            // Small alternating noise around centre.
            byte[] jitter = { 130, 126, 130, 126, 130 };
            int jitterDeviation = 0;
            foreach (byte sample in jitter)
            {
                var state = StateWith(sample, 128, 128, 128);
                jitterPipeline.ApplySmoothing(state, OneMillisecond);
                jitterDeviation += System.Math.Abs(state.LX - 128);
            }

            // A sustained fast sweep in one direction.
            byte[] flick = { 160, 190, 220, 250, 255 };
            int flickLag = 0;
            foreach (byte sample in flick)
            {
                var state = StateWith(sample, 128, 128, 128);
                flickPipeline.ApplySmoothing(state, OneMillisecond);
                flickLag += System.Math.Abs(sample - state.LX);
            }

            // Jitter should be almost entirely absorbed. Measured 0 with the tuned
            // coefficients; the bound leaves room for rounding.
            Assert.IsTrue(jitterDeviation <= 4,
                $"jitter around centre was not absorbed (total deviation {jitterDeviation})");

            // The deliberate sweep should still be followed, not flattened. Measured 20.
            // The class-default coefficients score 382 here, which is what this bound is
            // really guarding against — a regression back to a heavy fixed low-pass.
            Assert.IsTrue(flickLag < 40,
                $"fast motion was over-smoothed (accumulated lag {flickLag}, expected under 40)");
        }

        // --- range safety ------------------------------------------------------

        [TestMethod]
        public void ApplySmoothing_StaysWithinByteRange_AtBothExtremes()
        {
            var pipeline = new NeuroKineticPipeline(0);

            for (int i = 0; i < 200; i++)
            {
                var state = StateWith(255, 0, 255, 0);
                pipeline.ApplySmoothing(state, OneMillisecond);

                // Bytes cannot express out-of-range values, so an overflow would wrap:
                // asserting the extremes are approached from the correct side catches it.
                Assert.IsTrue(state.LX >= 128, $"LX wrapped to {state.LX}");
                Assert.IsTrue(state.LY <= 128, $"LY wrapped to {state.LY}");
            }
        }

        [TestMethod]
        public void RecordTelemetry_WithoutSmoothing_DoesNotThrow()
        {
            // Telemetry runs even when smoothing is switched off, so it must be safe on
            // its own and tolerate the NaN latency a device reports before it settles.
            var pipeline = new NeuroKineticPipeline(0);
            var state = StateWith(128, 128, 128, 128);

            pipeline.RecordTelemetry(state, 1.5);
            pipeline.RecordTelemetry(state, double.NaN);
            pipeline.RecordTelemetry(null, 1.5);
        }
    }
}
