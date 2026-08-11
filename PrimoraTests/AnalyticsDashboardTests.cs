using Primora.Performance;

namespace PrimoraTests
{
    [TestClass]
    public class AnalyticsDashboardTests
    {
        private AnalyticsDashboard dashboard;

        [TestInitialize]
        public void Setup()
        {
            dashboard = new AnalyticsDashboard();
        }

        [TestMethod]
        public void RecordInputEvent_ShouldTrackLatency()
        {
            // Arrange
            string controllerId = "test-controller";

            // Act
            for (int i = 0; i < 100; i++)
            {
                double latency = 0.5 + (i % 10) * 0.1; // 0.5-1.4ms
                dashboard.RecordInputEvent(controllerId, latency);
            }

            // Assert
            Assert.AreEqual(100, dashboard.TotalPacketsProcessed);
            Assert.IsTrue(dashboard.GlobalAvgLatencyMs > 0);
        }

        [TestMethod]
        public void GetControllerMetrics_ShouldReturnValidMetrics()
        {
            // Arrange
            string controllerId = "test-ctrl";

            // Act
            for (int i = 0; i < 200; i++)
            {
                dashboard.RecordInputEvent(controllerId, 0.8 + (i % 5) * 0.1);
            }

            var metrics = dashboard.GetControllerMetrics(controllerId);

            // Assert
            Assert.IsNotNull(metrics);
            Assert.AreEqual(controllerId, metrics.ControllerId);
            Assert.IsTrue(metrics.AvgLatencyMs > 0);
        }

        [TestMethod]
        public void PollingRate_ShouldBeReasonable()
        {
            // Arrange
            string controllerId = "polling-test";

            // Act - Record events, timing how long it actually took.
            //
            // This used to assert the measured rate exceeded 100Hz on the assumption
            // that Thread.Sleep(1) yields ~1ms. It does not: at Windows' default timer
            // resolution a 1ms sleep lands nearer 11ms, so the assertion was really
            // testing the host's scheduler and failed on CI at 90Hz. What is worth
            // checking is that the dashboard's arithmetic reflects the rate that
            // actually occurred, whatever the machine managed.
            const int eventCount = 200;
            var clock = System.Diagnostics.Stopwatch.StartNew();
            for (int i = 0; i < eventCount; i++)
            {
                dashboard.RecordInputEvent(controllerId, 1.0);
                System.Threading.Thread.Sleep(1);
            }
            clock.Stop();

            double observedHz = eventCount / clock.Elapsed.TotalSeconds;
            var metrics = dashboard.GetControllerMetrics(controllerId);

            // Assert - the reported rate should be in the same ballpark as the rate the
            // loop genuinely achieved. Generous bounds: this is a sanity check on the
            // calculation, not a benchmark.
            Assert.IsTrue(metrics.CurrentPollingRateHz > 0,
                $"Polling rate should be positive, got {metrics.CurrentPollingRateHz}");
            Assert.IsTrue(metrics.CurrentPollingRateHz > observedHz * 0.4 &&
                          metrics.CurrentPollingRateHz < observedHz * 2.5,
                $"Reported {metrics.CurrentPollingRateHz:F1}Hz is not consistent with the " +
                $"{observedHz:F1}Hz actually achieved");
        }

        [TestMethod]
        public void P95_P99_LatencyMetrics_ShouldBeDefined()
        {
            // Arrange
            string controllerId = "latency-test";

            // Act - Record varied latencies
            for (int i = 0; i < 200; i++)
            {
                double latency = 0.5 + ((i / 200.0) * 2.0); // 0.5-2.5ms spread
                dashboard.RecordInputEvent(controllerId, latency);
            }

            var metrics = dashboard.GetControllerMetrics(controllerId);

            // Assert
            Assert.IsTrue(metrics.P95LatencyMs >= metrics.AvgLatencyMs,
                "P95 should be >= average");
            Assert.IsTrue(metrics.P99LatencyMs >= metrics.P95LatencyMs,
                "P99 should be >= P95");
        }

        [TestMethod]
        public void Jitter_ShouldBeLowForConsistentInput()
        {
            // Arrange
            string controllerId = "stable-input";

            // Act - Record very consistent latencies
            for (int i = 0; i < 200; i++)
            {
                dashboard.RecordInputEvent(controllerId, 0.8); // Same value
            }

            var metrics = dashboard.GetControllerMetrics(controllerId);

            // Assert
            Assert.IsTrue(metrics.JitterMs < 0.1,
                $"Jitter for consistent input should be low, got {metrics.JitterMs}ms");
        }

        [TestMethod]
        public void Jitter_ShouldBeHighForVariableInput()
        {
            // Arrange
            string controllerId = "variable-input";

            // Act - Record highly variable latencies
            for (int i = 0; i < 200; i++)
            {
                double latency = i % 2 == 0 ? 0.5 : 3.0; // Alternating
                dashboard.RecordInputEvent(controllerId, latency);
            }

            var metrics = dashboard.GetControllerMetrics(controllerId);

            // Assert
            Assert.IsTrue(metrics.JitterMs > 0.5,
                $"Jitter for variable input should be high, got {metrics.JitterMs}ms");
        }

        [TestMethod]
        public void MultipleControllers_ShouldTrackIndependently()
        {
            // Arrange
            string ctrl1 = "controller-1";
            string ctrl2 = "controller-2";

            // Act
            // Controller 1: low latency
            for (int i = 0; i < 100; i++)
            {
                dashboard.RecordInputEvent(ctrl1, 0.5);
            }

            // Controller 2: high latency
            for (int i = 0; i < 100; i++)
            {
                dashboard.RecordInputEvent(ctrl2, 2.0);
            }

            var metrics1 = dashboard.GetControllerMetrics(ctrl1);
            var metrics2 = dashboard.GetControllerMetrics(ctrl2);

            // Assert
            Assert.IsTrue(metrics1.AvgLatencyMs < metrics2.AvgLatencyMs,
                "Controller 1 (0.5ms) should have lower latency than controller 2 (2.0ms)");
        }

        [TestMethod]
        public void GetAllMetrics_ShouldReturnAllControllers()
        {
            // Arrange
            string[] controllers = { "ctrl-a", "ctrl-b", "ctrl-c" };

            // Act
            foreach (var ctrl in controllers)
            {
                for (int i = 0; i < 50; i++)
                {
                    dashboard.RecordInputEvent(ctrl, 0.8);
                }
            }

            var allMetrics = dashboard.GetAllMetrics().ToList();

            // Assert
            Assert.AreEqual(controllers.Length, allMetrics.Count,
                "Should track all controllers independently");
        }

        [TestMethod]
        public void DisplayMetrics_ShouldNotThrow()
        {
            // Arrange
            dashboard.RecordInputEvent("test", 0.8);

            // Act & Assert - Should not throw
            try
            {
                dashboard.DisplayMetrics();
            }
            catch (Exception ex)
            {
                Assert.Fail($"DisplayMetrics should not throw: {ex.Message}");
            }
        }

        [TestMethod]
        public void PropertyChangedNotification_ShouldFire()
        {
            // Arrange
            string controllerId = "notification-test";
            bool propertyChanged = false;

            dashboard.PropertyChanged += (s, e) =>
            {
                if (e.PropertyName == "GlobalAvgLatencyMs" || e.PropertyName == "TotalPacketsProcessed")
                {
                    propertyChanged = true;
                }
            };

            // Act
            for (int i = 0; i < 150; i++) // Enough to trigger update
            {
                dashboard.RecordInputEvent(controllerId, 0.8);
            }

            // Assert
            Assert.IsTrue(propertyChanged,
                "PropertyChanged event should fire for dashboard metrics");
        }
    }
}
