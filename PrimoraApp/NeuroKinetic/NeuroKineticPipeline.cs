using System;
using Primora.Health;
using Primora.Performance;

namespace Primora.NeuroKinetic
{
    /// <summary>
    /// Per-controller Neuro-Kinetic processing: velocity-adaptive stick smoothing,
    /// wear telemetry and latency analytics.
    ///
    /// One instance per controller slot. That matters — the smoothing state this
    /// replaces lived in four <c>static</c> fields on DS4State, so every connected
    /// controller shared one filter and their stick values bled into each other.
    ///
    /// The filters are driven directly rather than through <see cref="InputSmoother"/>
    /// because that wrapper applies its own 0.12 radial dead-zone and snap-to-extreme
    /// behaviour, which would compound with the dead-zones users configure per profile,
    /// and shares a single axis-filter pair across both sticks.
    /// </summary>
    public class NeuroKineticPipeline
    {
        /// <summary>Neutral position of a DS4 analog axis.</summary>
        public const int StickCenter = 128;

        /// <summary>
        /// Bounds on the report delta handed to the filter, in seconds. The One-Euro
        /// filter divides by dt to estimate velocity, so a zero delta — which happens on
        /// the first report and whenever two reports carry the same timestamp — would
        /// produce infinity and poison the filter state. The upper bound stops a stall
        /// (a resumed session, a device hiccup) from being treated as one enormous step.
        /// </summary>
        public const float MinDeltaSeconds = 0.0001f;
        public const float MaxDeltaSeconds = 0.05f;

        /// <summary>
        /// Coefficients tuned for stick axes in raw byte units at controller polling
        /// rates, by sweeping the parameter space against two signals: ±2-count noise
        /// around centre, and a full-travel sweep.
        ///
        /// The class defaults (1.0 / 0.007 / 1.0) are unusable here. dCutoff at 1 Hz
        /// makes the velocity estimate crawl at 1000 Hz, so the adaptive cutoff never
        /// opens and the filter degenerates into a very heavy fixed low-pass: measured
        /// 382 counts of accumulated lag across a fast sweep, against 20 with these
        /// values, while still absorbing jitter at rest.
        /// </summary>
        public const float StickMinCutoff = 1.0f;
        public const float StickBeta = 0.05f;
        public const float StickDerivativeCutoff = 100.0f;

        private readonly OneEuroFilter leftXFilter = NewStickFilter();
        private readonly OneEuroFilter leftYFilter = NewStickFilter();
        private readonly OneEuroFilter rightXFilter = NewStickFilter();
        private readonly OneEuroFilter rightYFilter = NewStickFilter();

        private static OneEuroFilter NewStickFilter() =>
            new OneEuroFilter(StickMinCutoff, StickBeta, StickDerivativeCutoff);

        private readonly string controllerId;

        public NeuroKineticPipeline(int controllerIndex)
        {
            controllerId = $"Controller{controllerIndex + 1}";
        }

        /// <summary>
        /// Converts a report delta in milliseconds into the seconds value the filter
        /// expects, clamped to a usable range. Public so the conversion is directly
        /// testable — getting the unit wrong here silently changes how much the filter
        /// smooths at every polling rate.
        /// </summary>
        public static float ToDeltaSeconds(double deltaMilliseconds)
        {
            if (double.IsNaN(deltaMilliseconds) || deltaMilliseconds <= 0.0)
            {
                return MinDeltaSeconds;
            }

            double seconds = deltaMilliseconds / 1000.0;
            if (seconds < MinDeltaSeconds) return MinDeltaSeconds;
            if (seconds > MaxDeltaSeconds) return MaxDeltaSeconds;
            return (float)seconds;
        }

        /// <summary>
        /// Filters one axis. The value is centred before filtering so smoothing is
        /// symmetric about the stick's neutral position, then rounded rather than
        /// truncated — truncation biased every smoothed sample toward zero, which on a
        /// centred stick reads as drift toward down-left.
        /// </summary>
        public static byte SmoothAxis(OneEuroFilter filter, byte raw, float deltaSeconds)
        {
            float smoothed = filter.Filter(raw - (float)StickCenter, deltaSeconds);
            int value = (int)Math.Round(smoothed + StickCenter, MidpointRounding.AwayFromZero);
            return (byte)Math.Clamp(value, byte.MinValue, byte.MaxValue);
        }

        /// <summary>
        /// Applies velocity-adaptive smoothing to both sticks in place.
        /// </summary>
        public void ApplySmoothing(DS4State state, double deltaMilliseconds)
        {
            if (state == null) return;

            float dt = ToDeltaSeconds(deltaMilliseconds);

            state.LX = SmoothAxis(leftXFilter, state.LX, dt);
            state.LY = SmoothAxis(leftYFilter, state.LY, dt);
            state.RX = SmoothAxis(rightXFilter, state.RX, dt);
            state.RY = SmoothAxis(rightYFilter, state.RY, dt);
        }

        /// <summary>
        /// Feeds the wear monitor and the latency dashboard. Kept separate from
        /// smoothing so telemetry still runs for users who leave smoothing off.
        /// </summary>
        public void RecordTelemetry(DS4State state, double latencyMilliseconds)
        {
            if (state == null) return;

            ControllerHealthMonitor.Instance.RecordStickInput(
                controllerId, state.LX, state.LY, state.RX, state.RY);

            if (!double.IsNaN(latencyMilliseconds) && latencyMilliseconds >= 0.0)
            {
                AnalyticsDashboard.Instance.RecordInputEvent(controllerId, latencyMilliseconds);
            }
        }
    }
}
