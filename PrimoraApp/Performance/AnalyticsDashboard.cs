using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;

namespace Primora.Performance
{
    /// <summary>
    /// Per-controller performance metrics.
    /// </summary>
    public class ControllerMetrics : INotifyPropertyChanged
    {
        public string ControllerId { get; set; }

        private double _avgLatencyMs;
        public double AvgLatencyMs
        {
            get => _avgLatencyMs;
            set { _avgLatencyMs = value; OnPropertyChanged(); }
        }

        private double _currentPollingRateHz;
        public double CurrentPollingRateHz
        {
            get => _currentPollingRateHz;
            set { _currentPollingRateHz = value; OnPropertyChanged(); }
        }

        private double _jitterMs;
        public double JitterMs
        {
            get => _jitterMs;
            set { _jitterMs = value; OnPropertyChanged(); }
        }

        private int _packetsProcessed;
        public int PacketsProcessed
        {
            get => _packetsProcessed;
            set { _packetsProcessed = value; OnPropertyChanged(); }
        }

        private double _p95LatencyMs;
        public double P95LatencyMs
        {
            get => _p95LatencyMs;
            set { _p95LatencyMs = value; OnPropertyChanged(); }
        }

        private double _p99LatencyMs;
        public double P99LatencyMs
        {
            get => _p99LatencyMs;
            set { _p99LatencyMs = value; OnPropertyChanged(); }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        protected void OnPropertyChanged([CallerMemberName] string name = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }
    }

    public class AnalyticsDashboard : INotifyPropertyChanged
    {
        private Dictionary<string, ControllerMetrics> controllerMetrics = new Dictionary<string, ControllerMetrics>();
        private ConcurrentDictionary<string, ConcurrentQueue<double>> latencyHistories =
            new ConcurrentDictionary<string, ConcurrentQueue<double>>();
        private ConcurrentDictionary<string, ConcurrentQueue<long>> pollingIntervals =
            new ConcurrentDictionary<string, ConcurrentQueue<long>>();

        private int sampleSize = 1000;
        private Stopwatch perfTimer = new Stopwatch();
        private long lastSystemTimestamp = 0;

        private double _globalAvgLatencyMs;
        public double GlobalAvgLatencyMs
        {
            get => _globalAvgLatencyMs;
            set { _globalAvgLatencyMs = value; OnPropertyChanged(); }
        }

        private double _globalPollingRateHz;
        public double GlobalPollingRateHz
        {
            get => _globalPollingRateHz;
            set { _globalPollingRateHz = value; OnPropertyChanged(); }
        }

        private int _totalPacketsProcessed;
        public int TotalPacketsProcessed
        {
            get => _totalPacketsProcessed;
            set { _totalPacketsProcessed = value; OnPropertyChanged(); }
        }

        public AnalyticsDashboard()
        {
            perfTimer.Start();
            lastSystemTimestamp = Stopwatch.GetTimestamp();
        }

        /// <summary>
        /// Records a raw input polling event for a specific controller.
        /// Integrated with the Primora core HID loop.
        /// </summary>
        public void RecordInputEvent(string controllerId, double latencyMs)
        {
            if (!latencyHistories.ContainsKey(controllerId))
            {
                latencyHistories[controllerId] = new ConcurrentQueue<double>();
            }

            var latencyQueue = latencyHistories[controllerId];
            latencyQueue.Enqueue(latencyMs);

            // Maintain rolling window
            if (latencyQueue.Count > sampleSize)
            {
                latencyQueue.TryDequeue(out _);
            }

            // Track polling intervals
            long currentTimestamp = Stopwatch.GetTimestamp();
            long interval = currentTimestamp - lastSystemTimestamp;
            lastSystemTimestamp = currentTimestamp;

            if (!pollingIntervals.ContainsKey(controllerId))
            {
                pollingIntervals[controllerId] = new ConcurrentQueue<long>();
            }

            pollingIntervals[controllerId].Enqueue(interval);
            if (pollingIntervals[controllerId].Count > sampleSize)
            {
                pollingIntervals[controllerId].TryDequeue(out _);
            }

            TotalPacketsProcessed++;

            // Update metrics every 100 events
            if (TotalPacketsProcessed % 100 == 0)
            {
                UpdateControllerMetrics(controllerId);
                UpdateGlobalMetrics();
            }
        }

        private void UpdateControllerMetrics(string controllerId)
        {
            if (!latencyHistories.ContainsKey(controllerId))
                return;

            var latencies = latencyHistories[controllerId].ToList();
            if (latencies.Count == 0)
                return;

            if (!controllerMetrics.ContainsKey(controllerId))
            {
                controllerMetrics[controllerId] = new ControllerMetrics { ControllerId = controllerId };
            }

            var metrics = controllerMetrics[controllerId];

            // Basic statistics
            metrics.AvgLatencyMs = latencies.Average();
            metrics.PacketsProcessed = latencies.Count;

            // Percentile latencies
            var sortedLatencies = latencies.OrderBy(x => x).ToList();
            int p95Index = Math.Max(0, (int)(sortedLatencies.Count * 0.95) - 1);
            int p99Index = Math.Max(0, (int)(sortedLatencies.Count * 0.99) - 1);
            metrics.P95LatencyMs = sortedLatencies[p95Index];
            metrics.P99LatencyMs = sortedLatencies[p99Index];

            // Jitter (standard deviation of latencies)
            double meanLatency = latencies.Average();
            double sumSquareDiff = latencies.Sum(x => Math.Pow(x - meanLatency, 2));
            metrics.JitterMs = Math.Sqrt(sumSquareDiff / latencies.Count);

            // Calculate polling rate from intervals
            if (pollingIntervals.ContainsKey(controllerId))
            {
                var intervals = pollingIntervals[controllerId].ToList();
                if (intervals.Count > 1)
                {
                    double avgIntervalSeconds = intervals.Average() / (double)Stopwatch.Frequency;
                    metrics.CurrentPollingRateHz = 1.0 / avgIntervalSeconds;
                }
            }
        }

        private void UpdateGlobalMetrics()
        {
            var allLatencies = new List<double>();
            foreach (var latencies in latencyHistories.Values)
            {
                allLatencies.AddRange(latencies);
            }

            if (allLatencies.Count > 0)
            {
                GlobalAvgLatencyMs = allLatencies.Average();
            }

            // Compute global polling rate
            double elapsedSeconds = perfTimer.Elapsed.TotalSeconds;
            if (elapsedSeconds > 0)
            {
                GlobalPollingRateHz = TotalPacketsProcessed / elapsedSeconds;
            }
        }

        /// <summary>
        /// Global real-time performance display in v2.0.0.
        /// Aggregates hardware polling metrics and Neuro-Kinetic efficiency.
        /// </summary>
        public void DisplayMetrics()
        {
            Debug.WriteLine($"====== Performance Hub v2.0.0 ======");
            Debug.WriteLine($"Global Polling: {GlobalPollingRateHz:F0} Hz | Avg Latency: {GlobalAvgLatencyMs:F2}ms | Packets: {TotalPacketsProcessed}");

            foreach (var kvp in controllerMetrics)
            {
                var m = kvp.Value;
                Debug.WriteLine($"[{kvp.Key}] Rate: {m.CurrentPollingRateHz:F0}Hz | Latency: {m.AvgLatencyMs:F2}ms (p95: {m.P95LatencyMs:F2}ms, p99: {m.P99LatencyMs:F2}ms) | Jitter: {m.JitterMs:F3}ms");
            }

            if (GlobalPollingRateHz < 250)
            {
                Debug.WriteLine("[WARNING]: Polling rate below 250Hz threshold - potential latency issues detected!");
            }
        }

        /// <summary>
        /// Get metrics for a specific controller.
        /// </summary>
        public ControllerMetrics GetControllerMetrics(string controllerId)
        {
            if (controllerMetrics.ContainsKey(controllerId))
                return controllerMetrics[controllerId];

            return new ControllerMetrics { ControllerId = controllerId };
        }

        /// <summary>
        /// Get all controller metrics.
        /// </summary>
        public IEnumerable<ControllerMetrics> GetAllMetrics()
        {
            return controllerMetrics.Values;
        }

        public event PropertyChangedEventHandler PropertyChanged;

        protected void OnPropertyChanged([CallerMemberName] string name = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }
    }
}
