/*
Primora
Copyright (C) 2023  Primers Corperation

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
            headerLb.Content = $"Primora v{Global.exeversion} (Created by DS4-Windows.com Team)";
        }


        private void OfficialWebsiteLink_Click(object sender, RoutedEventArgs e)
        {
            Util.StartProcessHelper("https://ds4-windows.com");
        }

        private void SourceLink_Click(object sender, RoutedEventArgs e)
        {
            Util.StartProcessHelper("https://github.com/Primoraapp");
        }

        private void PrimersCorporationLink_Click(object sender, RoutedEventArgs e)
        {
            Util.StartProcessHelper("https://github.com/PrimersCorporation");
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
            Util.StartProcessHelper("https://github.com/PrimersCorporation/Primora/blob/master/contributors.txt");
        }
    }
}
