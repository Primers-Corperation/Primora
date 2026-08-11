using Primora.Health;

namespace PrimoraTests
{
    [TestClass]
    public class HealthMonitorTests
    {
        private ControllerHealthMonitor monitor;

        [TestInitialize]
        public void Setup()
        {
            monitor = ControllerHealthMonitor.Instance;
        }

        [TestMethod]
        public void RecordStickInput_ShouldTrackValues()
        {
            // Arrange
            string controllerId = "test-controller-1";

            // Act
            monitor.RecordStickInput(controllerId, 0.5f, 0.5f, -0.3f, 0.7f);
            monitor.RecordStickInput(controllerId, 0.51f, 0.49f, -0.32f, 0.71f);
            monitor.RecordStickInput(controllerId, 0.49f, 0.51f, -0.28f, 0.69f);

            // Assert
            var fatigue = monitor.GetFatigueScore(controllerId);
            Assert.IsTrue(fatigue >= 0 && fatigue <= 100, "Fatigue score should be between 0-100");
        }

        [TestMethod]
        public void GetFatigueScore_HealthyController_ShouldReturnHighScore()
        {
            // Arrange
            string controllerId = "healthy-controller";

            // Act - Record stable inputs (low drift)
            for (int i = 0; i < 20; i++)
            {
                monitor.RecordStickInput(controllerId, 0.5f, 0.5f, 0.0f, 0.0f);
            }

            int score = monitor.GetFatigueScore(controllerId);

            // Assert
            Assert.IsTrue(score > 80, $"Healthy controller should have high fatigue score, got {score}");
        }

        [TestMethod]
        public void IsButtonChattering_WithRapidToggle_ShouldDetectChatter()
        {
            // Arrange
            string controllerId = "test-controller";
            long timestamp = 0;

            // Act
            bool chatter1 = monitor.IsButtonChattering(controllerId, "Cross", true, false, 3); // 3ms diff
            bool chatter2 = monitor.IsButtonChattering(controllerId, "Cross", false, true, 4); // 4ms diff
            bool notChatter = monitor.IsButtonChattering(controllerId, "Cross", true, false, 10); // 10ms diff

            // Assert
            Assert.IsTrue(chatter1, "Should detect chatter at 3ms");
            Assert.IsTrue(chatter2, "Should detect chatter at 4ms");
            Assert.IsFalse(notChatter, "Should not detect chatter at 10ms");
        }

        [TestMethod]
        public void RecordButtonPress_ShouldLogHistory()
        {
            // Arrange
            string controllerId = "test-controller";

            // Act
            monitor.RecordButtonPress(controllerId, "Cross", true, 1000);
            monitor.RecordButtonPress(controllerId, "Cross", false, 1100);
            monitor.RecordButtonPress(controllerId, "Circle", true, 1500);

            // Assert - Just verify no exceptions are thrown
            var report = monitor.GetHealthReport(controllerId);
            Assert.IsNotNull(report);
            Assert.IsTrue(report.Contains(controllerId));
        }

        [TestMethod]
        public void GetHealthReport_ShouldReturnFormatted()
        {
            // Arrange
            string controllerId = "report-test";
            monitor.RecordStickInput(controllerId, 0.1f, 0.1f, 0.0f, 0.0f);

            // Act
            string report = monitor.GetHealthReport(controllerId);

            // Assert
            Assert.IsNotNull(report);
            Assert.IsTrue(report.Contains(controllerId));
            Assert.IsTrue(report.Contains("Score:"));
            Assert.IsTrue(report.Contains("Drift:"));
        }

        [TestMethod]
        public void MultipleControllers_ShouldTrackIndependently()
        {
            // Arrange
            string controller1 = "ctrl-1";
            string controller2 = "ctrl-2";

            // Drift is measured as variance, so the original version of this test could
            // never pass: it fed each controller a constant value and called one of them
            // "drifted". Both had zero variance and therefore identical scores.
            //
            // Values are in raw axis units (0-255, centred at 128), matching what the
            // input path feeds the monitor and the scale its drift thresholds assume.

            // Controller 1: noisy, swinging either side of centre.
            for (int i = 0; i < 20; i++)
            {
                byte noisy = (byte)(i % 2 == 0 ? 118 : 138);
                monitor.RecordStickInput(controller1, noisy, noisy, 128, 128);
            }

            // Controller 2: rock steady at centre.
            for (int i = 0; i < 20; i++)
            {
                monitor.RecordStickInput(controller2, 128, 128, 128, 128);
            }

            int score1 = monitor.GetFatigueScore(controller1);
            int score2 = monitor.GetFatigueScore(controller2);

            // Assert
            Assert.IsTrue(score2 > score1, "Controller 2 (stable) should have higher score than controller 1 (drifted)");
        }
    }
}
