using System;
using System.Collections.Generic;
using System.Linq;

namespace Primora
{
    public enum HardwarePart
    {
        LeftStick,
        RightStick,
        LeftTrigger,
        RightTrigger,
        Buttons,
        Touchpad,
        Motion
    }

    public class PadHealthReport
    {
        public int HealthScore { get; set; } = 100;
        public Dictionary<HardwarePart, int> PartHealth { get; set; } = new Dictionary<HardwarePart, int>();
        public List<string> Recommendations { get; set; } = new List<string>();

        public PadHealthReport()
        {
            foreach (HardwarePart part in Enum.GetValues(typeof(HardwarePart)))
            {
                PartHealth[part] = 100;
            }
        }
    }

    public static class PadHealthAudit
    {
        private static Dictionary<int, List<DS4State>> inputHistory = new Dictionary<int, List<DS4State>>();
        private const int MAX_HISTORY = 1000;

        public static void RecordState(int deviceIndex, DS4State state)
        {
            if (!inputHistory.ContainsKey(deviceIndex))
                inputHistory[deviceIndex] = new List<DS4State>();

            var history = inputHistory[deviceIndex];
            history.Add(state.Clone());
            if (history.Count > MAX_HISTORY)
                history.RemoveAt(0);
        }

        public static PadHealthReport GenerateReport(int deviceIndex)
        {
            PadHealthReport report = new PadHealthReport();
            if (!inputHistory.ContainsKey(deviceIndex)) return report;

            var history = inputHistory[deviceIndex];
            
            // 1. Stick Drift Check
            double lsDrift = history.Average(s => Math.Sqrt(Math.Pow(s.LX - 128, 2) + Math.Pow(s.LY - 128, 2)));
            double rsDrift = history.Average(s => Math.Sqrt(Math.Pow(s.RX - 128, 2) + Math.Pow(s.RY - 128, 2)));

            if (lsDrift > 10) { report.PartHealth[HardwarePart.LeftStick] -= 20; report.Recommendations.Add("Left Stick exhibits significant drift. Recalibrate or clean the sensor."); }
            if (rsDrift > 10) { report.PartHealth[HardwarePart.RightStick] -= 20; report.Recommendations.Add("Right Stick exhibits significant drift. Recalibrate or clean the sensor."); }

            // 2. Button Jitter Check (Multiple presses in very fast succession without release)
            // Simplified: Check for rapid state flips
            int jitterCount = 0;
            for (int i = 1; i < history.Count; i++)
            {
                if (history[i].Cross != history[i-1].Cross) jitterCount++;
            }
            if (jitterCount > 50) { report.PartHealth[HardwarePart.Buttons] -= 15; report.Recommendations.Add("X/Cross button shows contact jitter. Contact cleaning recommended."); }

            // Final Score calculation
            report.HealthScore = report.PartHealth.Values.Min();
            
            return report;
        }
    }
}
