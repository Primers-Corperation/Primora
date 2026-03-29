using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Threading;

namespace Primora.UI
{
    public class BackgroundService
    {
        private List<string> backgroundImages = new List<string> 
        { 
            "neural_ai_gaming_viz.png", 
            "liquid_glass_core.png", 
            "kinetic_energy_field.png" 
        };
        private System.Threading.Timer timer;
        private int currentIndex = 0;
        private static BackgroundService instance;
        private bool isRunning = false;

        public static BackgroundService Instance => instance ?? (instance = new BackgroundService());

        private BackgroundService() { }

        public void Start()
        {
            if (isRunning) return;
            isRunning = true;

            // Start timer after 2s, change every 12s for a premium, non-distracting feel
            timer = new System.Threading.Timer(ChangeBackground, null, 2000, 12000);
        }

        private void ChangeBackground(object state)
        {
            Application.Current.Dispatcher.Invoke(() =>
            {
                currentIndex = (currentIndex + 1) % backgroundImages.Count;
                ApplyBackground(backgroundImages[currentIndex]);
            });
        }

        private void ApplyBackground(string imageName)
        {
            var mainWindow = Application.Current.MainWindow as Primora.PrimoraForms.MainWindow;
            if (mainWindow == null) return;

            // Access both images from the XAML
            var imgCurrent = mainWindow.FindName("bgPulseImg") as Image;
            var imgNext = mainWindow.FindName("bgPulseImgNext") as Image;

            if (imgCurrent == null || imgNext == null) return;

            try
            {
                string uriPath = $"pack://application:,,,/Primora;component/Resources/{imageName}";
                var newImage = new BitmapImage(new Uri(uriPath, UriKind.RelativeOrAbsolute));

                // Set next image source
                imgNext.Source = newImage;

                // Cross-fade animation
                var fadeIn = new DoubleAnimation(0.0, 0.06, new Duration(TimeSpan.FromSeconds(2.5)));
                var fadeOut = new DoubleAnimation(imgCurrent.Opacity, 0.0, new Duration(TimeSpan.FromSeconds(2.5)));

                fadeOut.Completed += (s, e) => {
                    // Once current is faded out, swap roles
                    imgCurrent.Source = newImage;
                    imgCurrent.Opacity = 0.06;
                    imgNext.Opacity = 0;
                };

                imgNext.BeginAnimation(Image.OpacityProperty, fadeIn);
                imgCurrent.BeginAnimation(Image.OpacityProperty, fadeOut);
            }
            catch (Exception ex)
            {
                // Silently fail if resource is missing during development
                System.Diagnostics.Debug.WriteLine($"Background Transition Error: {ex.Message}");
            }
        }
    }
}
