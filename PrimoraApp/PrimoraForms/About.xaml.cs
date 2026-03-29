/*
Primora
Copyright (C) 2026 Primers Corperation

This software is governed by the Primora Software License Agreement.
See LICENSE.txt in the root directory for full details.
*/

using Primora;
using System.Windows;

namespace Primora.PrimoraForms
{
    /// <summary>
    /// Interaction logic for About.xaml
    /// </summary>
    public partial class About : Window
    {
        public About()
        {
            InitializeComponent();

            // About window header branding
            headerLb.Content = $"Primora v{Global.exeversion} (Powered by Primers Corperation)";
        }


        private void OfficialWebsiteLink_Click(object sender, RoutedEventArgs e)
        {
            Util.StartProcessHelper("https://primora-corperation.vercel.app");
        }

        private void SourceLink_Click(object sender, RoutedEventArgs e)
        {
            Util.StartProcessHelper("https://github.com/Primers-Corperation/Primora");
        }

        private void PrimersCorporationLink_Click(object sender, RoutedEventArgs e)
        {
            Util.StartProcessHelper("https://github.com/Primers-Corperation");
        }

        private void ViGEmBusLink_Click(object sender, RoutedEventArgs e)
        {
            Util.StartProcessHelper("https://github.com/nefarius/ViGEmBus");
        }

        private void HidHideLink_Click(object sender, RoutedEventArgs e)
        {
            Util.StartProcessHelper("https://github.com/nefarius/HidHide/");
        }

        private void Crc32Link_Click(object sender, RoutedEventArgs e)
        {
            Util.StartProcessHelper("https://github.com/dariogriffo/Crc32");
        }

        private void OneEuroLink_Click(object sender, RoutedEventArgs e)
        {
            Util.StartProcessHelper("http://cristal.univ-lille.fr/~casiez/1euro/");
        }

        private void FakerInputLink_Click(object sender, RoutedEventArgs e)
        {
            Util.StartProcessHelper("https://github.com/PrimersCorporation/FakerInput/");
        }

        private void HNotifyIconLink_Click(object sender, RoutedEventArgs e)
        {
            Util.StartProcessHelper("https://github.com/HavenDV/H.NotifyIcon/");
        }

        private void VJoyInterfaceLink_Click(object sender, RoutedEventArgs e)
        {
            Util.StartProcessHelper("https://github.com/shauleiz/vJoy/tree/master/apps/common/vJoyInterfaceCS");
        }

        private void ContributorsLink_OnClick(object sender, RoutedEventArgs e)
        {
            Util.StartProcessHelper("https://github.com/Primers-Corperation/Primora/blob/main/contributors.txt");
        }
    }
}
