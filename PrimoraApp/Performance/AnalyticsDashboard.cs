using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace Primora.Performance
{
    public class AnalyticsDashboard
    {
        private ConcurrentQueue<double> latencyHistory = new ConcurrentQueue<double>();
        private int sampleSize = 1000;
        private Stopwatch perfTimer = new Stopwatch();

        protected double avgLatency = 0.0;
        protected int inputThroughput = 0;

        public AnalyticsDashboard()
        {
            perfTimer.Start();
        }

        /// <summary>
        /// Global real-time performance display in v2.0.0.
        /// Aggregates hardware polling metrics and Neuro-Kinetic efficiency.
        /// </summary>
        public void DisplayMetrics()
        {
            // Compute real-time polling throughput (Expected 1000Hz or 500Hz)
            double throughput = inputThroughput / (perfTimer.Elapsed.TotalSeconds);
            
            // Console output for the Liquid Glass debug hub
            System.Diagnostics.Debug.WriteLine($"Performance Hub (v2.0.0): {throughput:F0} Hz Input Polling");
            System.Diagnostics.Debug.WriteLine($"Neuro-Kinetic Effeciency: {avgLatency:F2}ms average variance.");
            
            // Log if throughput drops below thresholds
            if (throughput < 250)
            {
                System.Diagnostics.Debug.WriteLine("[WARNING]: High latency path detected (below 250Hz threshold).");
            }
        }

        /// <summary>
        /// Records a raw input polling event.
        /// Integrated with the Primora core Hid loop.
        /// </summary>
        public void RecordInputEvent(double latencyMs)
        {
            latencyHistory.Enqueue(latencyMs);
            inputThroughput++;

            if (latencyHistory.Count > sampleSize)
            {
                latencyHistory.TryDequeue(out _);
            }

            // High-fidelity rolling average computation
            if (inputThroughput % 500 == 0)
            {
                avgLatency = latencyHistory.Any() ? latencyHistory.Average() / 1.0 : 0.0;
            }
        }
    }
}
