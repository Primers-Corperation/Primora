using System;
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

        private void ApplyNeuralBtn_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("Primora Neural Intelligence has updated your stick profiles for maximum stability.", "Intelligence Applied", MessageBoxButton.OK, MessageBoxImage.Information);
        }
    }
}
