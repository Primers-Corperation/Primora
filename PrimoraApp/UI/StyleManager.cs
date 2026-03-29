using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;

namespace Primora.UI
{
    public class StyleManager
    {
        private static StyleManager instance;
        public static StyleManager Instance => instance ?? (instance = new StyleManager());

        private StyleManager() { }

        /// <summary>
        /// Enforces the monochrome 'Liquid Glass' aesthetic across all controls in a container.
        /// </summary>
        public void EnforceMonochrome(DependencyObject parent)
        {
            if (parent == null) return;

            // Apply directly if it's a control
            if (parent is Control ctrl)
            {
                ApplyMonochromeStyle(ctrl);
            }

            // Recurse children
            int childrenCount = VisualTreeHelper.GetChildrenCount(parent);
            for (int i = 0; i < childrenCount; i++)
            {
                var child = VisualTreeHelper.GetChild(parent, i);
                EnforceMonochrome(child);
            }
        }

        public void ApplyMonochromeStyle(Control control)
        {
            // High-fidelity Monochrome palette
            var fgColor = (Brush)new BrushConverter().ConvertFrom("#FFFFFF"); // White
            var bgColor = (Brush)new BrushConverter().ConvertFrom("#00000000"); // Transparent for Glass

            control.Foreground = fgColor;
            
            // For buttons and text boxes, maintain readability
            if (control is Button btn)
            {
                btn.Background = (Brush)new BrushConverter().ConvertFrom("#0AFFFFFF"); // Subtle glass hint
                btn.BorderBrush = (Brush)new BrushConverter().ConvertFrom("#10FFFFFF"); // Ultra-thin glass border
                btn.BorderThickness = new Thickness(0.5);
            }
            else if (control is TextBox tb)
            {
                tb.Background = (Brush)new BrushConverter().ConvertFrom("#0F000000");
                tb.BorderBrush = (Brush)new BrushConverter().ConvertFrom("#15FFFFFF");
            }
            else if (control is TabItem tab)
            {
                // Custom monochrome tab header style can be injected here
            }
        }
    }
}
