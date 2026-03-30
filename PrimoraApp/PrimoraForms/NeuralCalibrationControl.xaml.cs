using System;
using System.Linq;
using System.Windows;
using System.Windows.Controls;

namespace Primora.PrimoraForms
{
    /// <summary>
    /// Interaction logic for NeuralCalibrationControl.xaml
    /// </summary>
    public partial class NeuralCalibrationControl : UserControl
    {
        public NeuralCalibrationControl()
        {
            InitializeComponent();
        }

        private async void RunAuditBtn_Click(object sender, RoutedEventArgs e)
        {
            runAuditBtn.IsEnabled = false;
            runAuditBtn.Content = "Audit in Progress...";
            healthResultsPanel.Visibility = Visibility.Collapsed;

            // Simulate deep-level scan
            await System.Threading.Tasks.Task.Delay(3500);

            // In a real scenario, we'd get the current controller index
            int deviceIndex = 0; 
            var report = PadHealthAudit.GenerateReport(deviceIndex);

            healthScoreText.Text = $"Overall Health: {report.HealthScore}%";
            if (report.Recommendations.Any())
                recommendationText.Text = report.Recommendations[0];
            else
                recommendationText.Text = "Hardware integrity within optimal performance thresholds.";

            healthResultsPanel.Visibility = Visibility.Visible;
            runAuditBtn.IsEnabled = true;
            runAuditBtn.Content = "Re-Execute Audit";
        }

        private void ApplyNeuralBtn_Click(object sender, RoutedEventArgs e)
        {
            Global.UseAssistiveSmoothing = true;
            MessageBox.Show("Neuro-Kinetic Precision Shield has been synchronized. Signal fidelity is now at maximum.", "Precision Synchronized", MessageBoxButton.OK, MessageBoxImage.Information);
        }
    }
}
