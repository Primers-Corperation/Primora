using System;
using System.Diagnostics;
using System.Windows;
using System.Windows.Input;
using System.Windows.Navigation;
using Primora.Cloud;
using Primora.Licensing;

namespace Primora.UI
{
    public partial class AuthWindow : Window
    {
        private readonly CloudSyncService _cloudService;

        public AuthWindow(CloudSyncService cloudService)
        {
            InitializeComponent();
            _cloudService = cloudService;
            UpdateVisualState();
        }

        private void Window_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ButtonState == MouseButtonState.Pressed)
            {
                this.DragMove();
            }
        }

        private void CloseButton_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = true;
            Close();
        }

        private void UpdateVisualState()
        {
            if (_cloudService.IsAuthenticated)
            {
                UnauthenticatedPanel.Visibility = Visibility.Collapsed;
                AuthenticatedPanel.Visibility = Visibility.Visible;
                UserEmailText.Text = _cloudService.CurrentUserEmail ?? "Unknown";
                UserTierText.Text = LicenseManager.CurrentTier.ToString().ToUpper();
            }
            else
            {
                UnauthenticatedPanel.Visibility = Visibility.Visible;
                AuthenticatedPanel.Visibility = Visibility.Collapsed;
                EmailField.Text = "";
                PasswordField.Password = "";
                StatusMessage.Visibility = Visibility.Collapsed;
            }
        }

        private async void SignInButton_Click(object sender, RoutedEventArgs e)
        {
            StatusMessage.Visibility = Visibility.Collapsed;
            SignInButton.IsEnabled = false;
            SignInButton.Content = "AUTHENTICATING...";

            bool success = await _cloudService.AuthenticateAsync(EmailField.Text, PasswordField.Password);
            
            if (success)
            {
                LicenseManager.CurrentTier = await _cloudService.GetUserTierAsync();
                UpdateVisualState();
            }
            else
            {
                StatusMessage.Text = "[Auth Failed] Invalid credentials or connection.";
                StatusMessage.Visibility = Visibility.Visible;
            }

            SignInButton.IsEnabled = true;
            SignInButton.Content = "SIGN IN";
        }

        private async void SyncButton_Click(object sender, RoutedEventArgs e)
        {
            SyncButton.IsEnabled = false;
            SyncButton.Content = "SYNCING...";
            await _cloudService.SyncAllAsync();
            SyncButton.IsEnabled = true;
            SyncButton.Content = "SYNC PROFILES";
        }

        private async void SignOutButton_Click(object sender, RoutedEventArgs e)
        {
            await _cloudService.SignOutAsync();
            LicenseManager.CurrentTier = LicenseTier.Free;
            UpdateVisualState();
        }

        private void CreateAccount_RequestNavigate(object sender, RequestNavigateEventArgs e)
        {
            Process.Start(new ProcessStartInfo(e.Uri.AbsoluteUri) { UseShellExecute = true });
            e.Handled = true;
        }
    }
}
