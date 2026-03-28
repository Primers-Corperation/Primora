/*
Primora
Copyright (C) 2023  Primers Corporation

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

using System;
using System.IO;
using System.Windows;


namespace Primora.PrimoraForms
{
    /// <summary>
    /// Interaction logic for SaveWhere.xaml
    /// </summary>
    public partial class SaveWhere : Window
    {
        private bool multisaves;
        public bool ChoiceMade { get; set; }

        public SaveWhere(bool multisavespots)
        {
            InitializeComponent();
            multisaves = multisavespots;
            if (!multisavespots)
            {
                multipleSavesDockP.Visibility = Visibility.Collapsed;
                pickWhereTxt.Text += Properties.Resources.OtherFileLocation;
            }

            if (Primora.Global.AdminNeeded())
            {
                progFolderPanel.IsEnabled = false;
            }
        }

        private void ProgFolderBtn_Click(object sender, RoutedEventArgs e)
        {
            Primora.Global.SaveWhere(Primora.Global.exedirpath);
            if (multisaves && dontDeleteCk.IsChecked == false)
            {
                try
                {
                    if (Directory.Exists(Primora.Global.appDataPpath))
                    {
                        Directory.Delete(Primora.Global.appDataPpath, true);
                    }
                }
                catch { }
            }
            else if (!multisaves)
            {
                Primora.Global.SaveDefault(Primora.Global.exedirpath + "\\Profiles.xml");
            }

            ChoiceMade = true;
            Close();
        }

        private void AppdataBtn_Click(object sender, RoutedEventArgs e)
        {
            if (multisaves && dontDeleteCk.IsChecked == false)
            {
                try
                {
                    Directory.Delete(Primora.Global.exedirpath + "\\Profiles", true);
                    File.Delete(Primora.Global.exedirpath + "\\Profiles.xml");
                    File.Delete(Primora.Global.exedirpath + "\\Auto Profiles.xml");
                }
                catch (UnauthorizedAccessException)
                {
                    MessageBox.Show("Cannot Delete old settings, please manaully delete", "Primora");
                }
            }
            else if (!multisaves)
            {
                Primora.Global.SaveDefault(Path.Combine(Primora.Global.appDataPpath, "Profiles.xml"));
            }

            Primora.Global.SaveWhere(Primora.Global.appDataPpath);
            ChoiceMade = true;
            Close();
        }
    }
}
