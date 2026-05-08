using Primora.NeuroKinetic;

namespace PrimoraTests
{
    [TestClass]
    public class InputSmootherTests
    {
        private InputSmoother smoother;
        private const float DeltaTime = 0.001f; // 1ms

        [TestInitialize]
        public void Setup()
        {
            smoother = new InputSmoother();
        }

        [TestMethod]
        public void SmoothInput_ShouldReduceJitter()
        {
            // Arrange - input with jitter
            float[] jitterySamples = { 0.5f, 0.501f, 0.499f, 0.502f, 0.498f, 0.5f };

            // Act
            float[] smoothedSamples = new float[jitterySamples.Length];
            for (int i = 0; i < jitterySamples.Length; i++)
            {
                smoothedSamples[i] = smoother.SmoothInput(jitterySamples[i], DeltaTime);
            }

            // Assert - Calculate variance
            double jitterVariance = CalculateVariance(jitterySamples);
            double smoothVariance = CalculateVariance(smoothedSamples);

            Assert.IsTrue(smoothVariance < jitterVariance,
                $"Smoothing should reduce variance. Jitter: {jitterVariance}, Smooth: {smoothVariance}");
        }

        [TestMethod]
        public void SmoothStick_ShouldApplyDeadzone()
        {
            // Arrange - small stick movement
            float smallX = 0.05f; // Below dead-zone threshold
            float smallY = 0.05f;

            // Act
            var (smoothX, smoothY) = smoother.SmoothStick(smallX, smallY, DeltaTime);

            // Assert - Should be zeroed out
            Assert.AreEqual(0.0f, smoothX, 0.01f, "Small X movement should be dead-zoned to near-zero");
            Assert.AreEqual(0.0f, smoothY, 0.01f, "Small Y movement should be dead-zoned to near-zero");
        }

        [TestMethod]
        public void SmoothStick_ShouldPreserveLargeMovement()
        {
            // Arrange - large stick movement
            float largeX = 0.9f;
            float largeY = 0.8f;

            // Act
            var (smoothX, smoothY) = smoother.SmoothStick(largeX, largeY, DeltaTime);

            // Assert - Should preserve substantial movement
            Assert.IsTrue(Math.Abs(smoothX) > 0.5f, "Large X movement should be preserved");
            Assert.IsTrue(Math.Abs(smoothY) > 0.4f, "Large Y movement should be preserved");
        }

        [TestMethod]
        public void SmoothTrigger_ShouldNormalizeAndSmooth()
        {
            // Arrange - raw trigger value (0-255)
            float rawTrigger = 128; // 50% press

            // Act
            float smoothed = smoother.SmoothTrigger(rawTrigger, DeltaTime);

            // Assert - Should be between 0-1
            Assert.IsTrue(smoothed >= 0.0f && smoothed <= 1.0f,
                $"Smoothed trigger should be 0-1, got {smoothed}");
        }

        [TestMethod]
        public void SmoothTrigger_LightPress_ShouldBeNearZero()
        {
            // Arrange - very light trigger press
            float lightPress = 5; // Out of 255

            // Act
            float smoothed = smoother.SmoothTrigger(lightPress, DeltaTime);

            // Assert
            Assert.IsTrue(smoothed < 0.05f, "Light trigger press should smooth to near zero");
        }

        [TestMethod]
        public void SmoothTrigger_FullPress_ShouldBeNearOne()
        {
            // Arrange - full trigger press
            float fullPress = 250; // Out of 255

            // Act
            float smoothed = smoother.SmoothTrigger(fullPress, DeltaTime);

            // Assert
            Assert.IsTrue(smoothed > 0.95f, "Full trigger press should smooth to near one");
        }

        [TestMethod]
        public void PredictBatch_ShouldProcessMultipleSamples()
        {
            // Arrange
            float[] batch = new float[100];
            for (int i = 0; i < batch.Length; i++)
            {
                batch[i] = (float)Math.Sin(i * 0.1f); // Smooth wave
            }

            // Act
            float[] result = smoother.PredictBatch(batch);

            // Assert
            Assert.AreEqual(batch.Length, result.Length, "Should return same number of samples");
            Assert.IsTrue(result.All(v => !float.IsNaN(v)), "Should not contain NaN values");
        }

        [TestMethod]
        public void RepeatedSmoothing_ShouldConverge()
        {
            // Arrange
            float targetValue = 0.7f;
            List<float> sampledValues = new List<float>();

            // Act - Smoothly transition to target
            for (int i = 0; i < 50; i++)
            {
                float smoothed = smoother.SmoothInput(targetValue, DeltaTime);
                sampledValues.Add(smoothed);
            }

            // Assert - Final values should be close to target
            float lastValue = sampledValues[sampledValues.Count - 1];
            Assert.IsTrue(Math.Abs(lastValue - targetValue) < 0.1f,
                $"After repeated smoothing, should converge to target. Got: {lastValue}, Expected: {targetValue}");
        }

        [TestMethod]
        public void GetFilterState_ShouldReturnDescription()
        {
            // Act
            string state = smoother.GetFilterState();

            // Assert
            Assert.IsNotNull(state);
            Assert.IsTrue(state.Contains("One-Euro"));
            Assert.IsTrue(state.Contains("filter"));
        }

        private double CalculateVariance(float[] values)
        {
            if (values.Length == 0) return 0;
            double mean = values.Average();
            double sumSquaredDiff = values.Sum(v => Math.Pow(v - mean, 2));
            return sumSquaredDiff / values.Length;
        }
    }
}
