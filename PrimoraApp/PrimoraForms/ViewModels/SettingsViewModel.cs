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

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using System.Windows.Media;
using System.Windows.Interop;
using System.Windows;
using System.Windows.Media.Imaging;
using System.Runtime.InteropServices;
using Primora;
using static Primora.Util;
using Microsoft.Win32;

namespace Primora.PrimoraForms.ViewModels
{
    public class SettingsViewModel
    {
        // Re-Enable Ex Mode
        public bool HidePrimoraController
        {
            get => Primora.Global.UseExclusiveMode;
            set => Primora.Global.UseExclusiveMode = value;
        }

        public bool SwipeTouchSwitchProfile { get => Primora.Global.SwipeProfiles;
            set => Primora.Global.SwipeProfiles = value; }

        private bool runAtStartup;
        public bool RunAtStartup
        {
            get => runAtStartup;
            set
            {
                runAtStartup = value;
                RunAtStartupChanged?.Invoke(this, EventArgs.Empty);
            }
        }
        public event EventHandler RunAtStartupChanged;

        private bool runStartProg;
        public bool RunStartProg
        {
            get => runStartProg;
            set
            {
                runStartProg = value;
                RunStartProgChanged?.Invoke(this, EventArgs.Empty);
            }
        }
        public event EventHandler RunStartProgChanged;

        private bool runStartTask;
        public bool RunStartTask
        {
            get => runStartTask;
            set
            {
                runStartTask = value;
                RunStartTaskChanged?.Invoke(this, EventArgs.Empty);
            }
        }
        public event EventHandler RunStartTaskChanged;

        private bool canWriteTask;
        public bool CanWriteTask { get => canWriteTask; }

        public ImageSource uacSource;
        public ImageSource UACSource { get => uacSource; }

        public ImageSource questionMarkSource;
        public ImageSource QuestionMarkSource { get => questionMarkSource; }

        private Visibility showRunStartPanel = Visibility.Collapsed;
        public Visibility ShowRunStartPanel {
            get => showRunStartPanel;
            set
            {
                if (showRunStartPanel == value) return;
                showRunStartPanel = value;
                ShowRunStartPanelChanged?.Invoke(this, EventArgs.Empty);
            }
        }

        public event EventHandler ShowRunStartPanelChanged;

        private Visibility _isProfileChangedCheckVisible;

        public Visibility IsProfileChangedCheckVisible
        {
            get => _isProfileChangedCheckVisible;
            private set
            {
                _isProfileChangedCheckVisible = value;
                IsProfileChangedCheckVisibleChanged?.Invoke(this, EventArgs.Empty);
            }
        }

        public event EventHandler IsProfileChangedCheckVisibleChanged;

        public bool ProfileChangedNotification
        {
            get => Global.ProfileChangedNotification;
            set => Global.ProfileChangedNotification = value;
        }

        public int ShowNotificationsIndex
        {
            get => Primora.Global.Notifications;
            set
            {
                Global.Notifications = value;
                // display only when all notifications are on
                IsProfileChangedCheckVisible = value == 2 ? Visibility.Visible : Visibility.Collapsed;
            }
        }

        public bool DisconnectBTStop { get => Primora.Global.DCBTatStop; set => Primora.Global.DCBTatStop = value; }
        public bool FlashHighLatency { get => Primora.Global.FlashWhenLate; set => Primora.Global.FlashWhenLate = value; }
        public int FlashHighLatencyAt { get => Primora.Global.FlashWhenLateAt; set => Primora.Global.FlashWhenLateAt = value; }
        public bool StartMinimize { get => Primora.Global.StartMinimized; set => Primora.Global.StartMinimized = value; }
        public bool MinimizeToTaskbar { get => Primora.Global.MinToTaskbar; set => Primora.Global.MinToTaskbar = value; }
        public bool CloseMinimizes { get => Primora.Global.CloseMini; set => Primora.Global.CloseMini = value; }
        public bool QuickCharge { get => Primora.Global.QuickCharge; set => Primora.Global.QuickCharge = value; }

        public int IconChoiceIndex
        {
            get => (int)Primora.Global.UseIconChoice;
            set
            {
                int temp = (int)Primora.Global.UseIconChoice;
                if (temp == value) return;
                Primora.Global.UseIconChoice = (Primora.TrayIconChoice)value;
                IconChoiceIndexChanged?.Invoke(this, EventArgs.Empty);
            }
        }
        public event EventHandler IconChoiceIndexChanged;

        public int AppChoiceIndex
        {
            get => (int)Primora.Global.UseCurrentTheme;
            set
            {
                int temp = (int)Primora.Global.UseCurrentTheme;
                if (temp == value) return;
                Primora.Global.UseCurrentTheme = (Primora.AppThemeChoice)value;
                AppChoiceIndexChanged?.Invoke(this, EventArgs.Empty);
            }
        }
        public event EventHandler AppChoiceIndexChanged;

        public bool CheckForUpdates
        {
            get => Primora.Global.CheckWhen > 0;
            set
            {
                Primora.Global.CheckWhen = value ? 24 : 0;
                CheckForNoUpdatesWhen();
            }
        }
        public event EventHandler CheckForUpdatesChanged;

        public int CheckEvery
        {
            get
            {
                int temp = Primora.Global.CheckWhen;
                if (temp > 23)
                {
                    temp = temp / 24;
                }
                return temp;
            }
            set
            {
                int temp;
                if (checkEveryUnitIdx == 0 && value < 24)
                {
                    temp = Primora.Global.CheckWhen;
                    if (temp != value)
                    {
                        Primora.Global.CheckWhen = value;
                        CheckForNoUpdatesWhen();
                    }
                }
                else if (checkEveryUnitIdx == 1)
                {
                    temp = Primora.Global.CheckWhen / 24;
                    if (temp != value)
                    {
                        Primora.Global.CheckWhen = value * 24;
                        CheckForNoUpdatesWhen();
                    }
                }
            }
        }
        public event EventHandler CheckEveryChanged;

        private int checkEveryUnitIdx = 1;
        public int CheckEveryUnit
        {
            get
            {
                return checkEveryUnitIdx;
            }
            set
            {
                if (checkEveryUnitIdx == value) return;
                checkEveryUnitIdx = value;
                CheckEveryUnitChanged?.Invoke(this, EventArgs.Empty);
            }
        }
        public event EventHandler CheckEveryUnitChanged;

        public bool UseOSCServer
        {
            get => Primora.Global.isUsingOSCServer();
            set
            {
                if (Primora.Global.isUsingOSCServer() == value) return;
                Primora.Global.setUsingOSCServer(value);
                UseOSCServerChanged?.Invoke(this, EventArgs.Empty);
            }
        }
        public event EventHandler UseOSCServerChanged;
        public int OscPort { get => Primora.Global.getOSCServerPortNum(); set => Primora.Global.setOSCServerPort(value); }
        
        public bool InterpretingOscMonitoring { get => Primora.Global.isInterpretingOscMonitoring(); set => Primora.Global.setInterpretingOscMonitoring(value); }

        public bool UseOSCSender
        {
            get => Primora.Global.isUsingOSCSender();
            set
            {
                if (Primora.Global.isUsingOSCSender() == value) return;
                Primora.Global.setUsingOSCSender(value);
                UseOSCSenderChanged?.Invoke(this, EventArgs.Empty);
            }
        }
        public event EventHandler UseOSCSenderChanged;
        public int OscSendPort { get => Primora.Global.getOSCSenderPortNum(); set => Primora.Global.setOSCSenderPort(value); }

        public string OscSenderAddress
        {
            get => Primora.Global.getOSCSenderAddress();
            set => Primora.Global.setOSCSenderAddress(value);
        }


        public bool UseUDPServer
        {
            get => Primora.Global.isUsingUDPServer();
            set
            {
                if (Primora.Global.isUsingUDPServer() == value) return;
                Primora.Global.setUsingUDPServer(value);
                UseUDPServerChanged?.Invoke(this, EventArgs.Empty);
            }
        }
        public event EventHandler UseUDPServerChanged;

        public string UdpIpAddress { get => Primora.Global.getUDPServerListenAddress();
            set => Primora.Global.setUDPServerListenAddress(value); }
        public int UdpPort { get => Primora.Global.getUDPServerPortNum(); set => Primora.Global.setUDPServerPort(value); }

        public bool UseUdpSmoothing
        {
            get => Primora.Global.UseUDPSeverSmoothing;
            set
            {
                bool temp = Primora.Global.UseUDPSeverSmoothing;
                if (temp == value) return;
                Primora.Global.UseUDPSeverSmoothing = value;
                UseUdpSmoothingChanged?.Invoke(this, EventArgs.Empty);
            }
        }
        public event EventHandler UseUdpSmoothingChanged;

        public Visibility UdpServerOneEuroPanelVisibility
        {
            get => Primora.Global.isUsingUDPServer() && Primora.Global.UseUDPSeverSmoothing ? Visibility.Visible : Visibility.Collapsed;
        }
        public event EventHandler UdpServerOneEuroPanelVisibilityChanged;

        public double UdpSmoothMinCutoff
        {
            get => Primora.Global.UDPServerSmoothingMincutoff;
            set
            {
                double temp = Primora.Global.UDPServerSmoothingMincutoff;
                if (temp == value) return;
                Primora.Global.UDPServerSmoothingMincutoff = value;
                UdpSmoothMinCutoffChanged?.Invoke(this, EventArgs.Empty);
            }
        }
        public event EventHandler UdpSmoothMinCutoffChanged;

        public double UdpSmoothBeta
        {
            get => Primora.Global.UDPServerSmoothingBeta;
            set
            {
                double temp = Primora.Global.UDPServerSmoothingBeta;
                if (temp == value) return;
                Primora.Global.UDPServerSmoothingBeta = value;
                UdpSmoothBetaChanged?.Invoke(this, EventArgs.Empty);
            }
        }
        public event EventHandler UdpSmoothBetaChanged;

        public bool UseCustomSteamFolder
        {
            get => Primora.Global.UseCustomSteamFolder;
            set
            {
                Primora.Global.UseCustomSteamFolder = value;
                UseCustomSteamFolderChanged?.Invoke(this, EventArgs.Empty);
            }
        }
        public event EventHandler UseCustomSteamFolderChanged;

        public string CustomSteamFolder
        {
            get => Primora.Global.CustomSteamFolder;
            set
            {
                string temp = Primora.Global.CustomSteamFolder;
                if (temp == value) return;
                if (Directory.Exists(value) || value == string.Empty)
                {
                    Primora.Global.CustomSteamFolder = value;
                }
            }
        }

        private bool viewEnabled = true;
        public bool ViewEnabled
        {
            get => viewEnabled;
            set
            {
                viewEnabled = value;
                ViewEnabledChanged?.Invoke(this, EventArgs.Empty);
            }
        }
        public event EventHandler ViewEnabledChanged;

        public string FakeExeName
        {
            get => Primora.Global.FakeExeName;
            set
            {
                string temp = Primora.Global.FakeExeName;
                if (temp == value) return;
                Primora.Global.FakeExeName = value;
                FakeExeNameChanged?.Invoke(this, EventArgs.Empty);
                FakeExeNameChangeCompare?.Invoke(this, temp, value);
            }
        }
        public event EventHandler FakeExeNameChanged;
        public event FakeExeNameChangeHandler FakeExeNameChangeCompare;
        public delegate void FakeExeNameChangeHandler(SettingsViewModel sender,
            string oldvalue, string newvalue);


        public bool HidHideClientFound
        {
            get
            {
                bool result = Primora.Global.hidHideInstalled &&
                    !string.IsNullOrEmpty(Primora.Util.GetHidHideClientPath());

                return result;
            }
        }
        public event EventHandler HidHideClientFoundChanged;

        private List<MonitorChoiceListing> absMonitorChoices = new List<MonitorChoiceListing>();
        public List<MonitorChoiceListing> AbsMonitorChoices => absMonitorChoices;
        public event EventHandler AbsMonitorChoicesChanged;

        //private string absMonitorSettingEDID = string.Empty;
        public string AbsMonitorSettingEDID
        {
            get => Global.AbsoluteDisplayEDID;
            set => Global.AbsoluteDisplayEDID = value;
        }

        public int ProcessPriorityIndex
        {
            get => Global.ProcessPriority;
            set
            {
                Global.ProcessPriority = value;
                ProcessPriorityIndexChanged?.Invoke(this, EventArgs.Empty);
            }

        }

        public event EventHandler ProcessPriorityIndexChanged;

        public SettingsViewModel()
        {
            checkEveryUnitIdx = 1;
            IsProfileChangedCheckVisible = Global.Notifications == 2 ? Visibility.Visible : Visibility.Collapsed;

            int checklapse = Primora.Global.CheckWhen;
            if (checklapse < 24 && checklapse > 0)
            {
                checkEveryUnitIdx = 0;
            }

            CheckStartupOptions();

            Icon img = SystemIcons.Shield;
            Bitmap bitmap = img.ToBitmap();
            IntPtr hBitmap = bitmap.GetHbitmap();

            ImageSource wpfBitmap =
                 Imaging.CreateBitmapSourceFromHBitmap(
                      hBitmap, IntPtr.Zero, Int32Rect.Empty,
                      BitmapSizeOptions.FromEmptyOptions());
            uacSource = wpfBitmap;

            img = SystemIcons.Question;
            wpfBitmap =
                 Imaging.CreateBitmapSourceFromHBitmap(
                      img.ToBitmap().GetHbitmap(), IntPtr.Zero, Int32Rect.Empty,
                      BitmapSizeOptions.FromEmptyOptions());
            questionMarkSource = wpfBitmap;

            runStartProg = StartupMethods.HasStartProgEntry();
            try
            {
                runStartTask = StartupMethods.HasTaskEntry();
            }
            catch (COMException ex)
            {
                Primora.AppLogger.LogToGui(string.Format("Error in TaskService. Check WinOS TaskScheduler service functionality. {0}", ex.Message), true);
            }

            runAtStartup = runStartProg || runStartTask;
            canWriteTask = Primora.Global.IsAdministrator();

            if (!runAtStartup)
            {
                runStartProg = true;
            }
            else if (runStartProg && runStartTask)
            {
                runStartProg = false;
                if (StartupMethods.CanWriteStartEntry())
                {
                    StartupMethods.DeleteStartProgEntry();
                }
            }

            if (runAtStartup && runStartProg)
            {
                bool locChange = StartupMethods.CheckStartupExeLocation();
                if (locChange)
                {
                    if (StartupMethods.CanWriteStartEntry())
                    {
                        StartupMethods.DeleteStartProgEntry();
                        StartupMethods.WriteStartProgEntry();
                    }
                    else
                    {
                        runAtStartup = false;
                        showRunStartPanel = Visibility.Collapsed;
                    }
                }
            }
            else if (runAtStartup && runStartTask)
            {
                if (canWriteTask)
                {
                    StartupMethods.DeleteOldTaskEntry();
                    StartupMethods.WriteTaskEntry();
                }
            }

            if (runAtStartup)
            {
                showRunStartPanel = Visibility.Visible;
            }

            RefreshMonitorChoices();

            RunAtStartupChanged += SettingsViewModel_RunAtStartupChanged;
            RunStartProgChanged += SettingsViewModel_RunStartProgChanged;
            RunStartTaskChanged += SettingsViewModel_RunStartTaskChanged;
            FakeExeNameChanged += SettingsViewModel_FakeExeNameChanged;
            FakeExeNameChangeCompare += SettingsViewModel_FakeExeNameChangeCompare;
            UseUdpSmoothingChanged += SettingsViewModel_UseUdpSmoothingChanged;
            UseUDPServerChanged += SettingsViewModel_UseUDPServerChanged;
            SystemEvents.DisplaySettingsChanged += SystemEvents_DisplaySettingsChanged;

            //CheckForUpdatesChanged += SettingsViewModel_CheckForUpdatesChanged;
        }

        private void SystemEvents_DisplaySettingsChanged(object sender, EventArgs e)
        {
            RefreshMonitorChoices();
        }

        private void SettingsViewModel_UseUDPServerChanged(object sender, EventArgs e)
        {
            UdpServerOneEuroPanelVisibilityChanged?.Invoke(this, EventArgs.Empty);
        }

        private void SettingsViewModel_UseUdpSmoothingChanged(object sender, EventArgs e)
        {
            UdpServerOneEuroPanelVisibilityChanged?.Invoke(this, EventArgs.Empty);
        }

        private void SettingsViewModel_FakeExeNameChangeCompare(SettingsViewModel sender,
            string oldvalue, string newvalue)
        {
            string old_exefile = Path.Combine(Primora.Global.exedirpath, $"{oldvalue}.exe");
            string old_conf_file = Path.Combine(Primora.Global.exedirpath, $"{oldvalue}.runtimeconfig.json");
            string old_deps_file = Path.Combine(Primora.Global.exedirpath, $"{oldvalue}.deps.json");

            if (!string.IsNullOrEmpty(oldvalue))
            {
                if (File.Exists(old_exefile))
                {
                    File.Delete(old_exefile);
                }

                if (File.Exists(old_conf_file))
                {
                    File.Delete(old_conf_file);
                }

                if (File.Exists(old_deps_file))
                {
                    File.Delete(old_deps_file);
                }
            }
        }

        private void SettingsViewModel_FakeExeNameChanged(object sender, EventArgs e)
        {
            string temp = FakeExeName;
            if (!string.IsNullOrEmpty(temp))
            {
                CreateFakeExe(FakeExeName);
            }
        }

        private void SettingsViewModel_RunStartTaskChanged(object sender, EventArgs e)
        {
            if (runStartTask)
            {
                StartupMethods.WriteTaskEntry();
            }
            else
            {
                StartupMethods.DeleteTaskEntry();
            }
        }

        private void SettingsViewModel_RunStartProgChanged(object sender, EventArgs e)
        {
            if (runStartProg)
            {
                StartupMethods.WriteStartProgEntry();
            }
            else
            {
                StartupMethods.DeleteStartProgEntry();
            }
        }

        private void SettingsViewModel_RunAtStartupChanged(object sender, EventArgs e)
        {
            if (runAtStartup)
            {
                RunStartProg = true;
                RunStartTask = false;
            }
            else
            {
                StartupMethods.DeleteStartProgEntry();
                StartupMethods.DeleteTaskEntry();
            }
        }

        private void SettingsViewModel_CheckForUpdatesChanged(object sender, EventArgs e)
        {
            if (!CheckForUpdates)
            {
                CheckEveryChanged?.Invoke(this, EventArgs.Empty);
                CheckEveryUnitChanged?.Invoke(this, EventArgs.Empty);
            }
        }

        private void CheckStartupOptions()
        {
            bool lnkExists = File.Exists(Environment.GetFolderPath(Environment.SpecialFolder.Startup) + "\\Primora.lnk");
            if (lnkExists)
            {
                runAtStartup = true;
            }
            else
            {
                runAtStartup = false;
            }
        }

        private void CheckForNoUpdatesWhen()
        {
            if (Primora.Global.CheckWhen == 0)
            {
                checkEveryUnitIdx = 1;
            }

            CheckForUpdatesChanged?.Invoke(this, EventArgs.Empty);
            CheckEveryChanged?.Invoke(this, EventArgs.Empty);
            CheckEveryUnitChanged?.Invoke(this, EventArgs.Empty);
        }

        public void CreateFakeExe(string filename)
        {
            string exefile = Path.Combine(Primora.Global.exedirpath, $"{filename}.exe");
            string current_conf_file_path = $"{Primora.Global.exelocation}.runtimeconfig.json";
            string current_deps_file_path = $"{Primora.Global.exelocation}.deps.json";

            string fake_conf_file = Path.Combine(Primora.Global.exedirpath, $"{filename}.runtimeconfig.json");
            string fake_deps_file = Path.Combine(Primora.Global.exedirpath, $"{filename}.deps.json");

            File.Copy(Primora.Global.exelocation, exefile); // Copy exe

            // Copy needed app config and deps files
            File.Copy(current_conf_file_path, fake_conf_file);
            File.Copy(current_deps_file_path, fake_deps_file);
        }

        public void DriverCheckRefresh()
        {
            HidHideClientFoundChanged?.Invoke(this, EventArgs.Empty);
        }

        private void RefreshMonitorChoices()
        {
            absMonitorChoices.Clear();
            absMonitorChoices.Add(new MonitorChoiceListing()
            {
                DisplayName = "All Monitors",
                EDID = string.Empty,
                Index = 0,
            });

            int idx = 1;
            foreach(DISPLAY_DEVICE tempDis in Global.GrabCurrentMonitors())
            {
                absMonitorChoices.Add(new MonitorChoiceListing()
                {
                    DisplayName = tempDis.DeviceString,
                    EDID = tempDis.DeviceID,
                    Index = idx,
                });

                idx++;
            }

            AbsMonitorChoicesChanged?.Invoke(this, EventArgs.Empty);
        }
    }

    public struct MonitorChoiceListing
    {
        private int idx;
        public int Index
        {
            get => idx;
            set => idx = value;
        }

        private string edid;
        public string EDID
        {
            get => edid;
            set => edid = value;
        }

        private string displayName;
        public string DisplayName
        {
            get => displayName;
            set => displayName = value;
        }

        public string DisplayItemString
        {
            get => $"{idx}: {displayName}";
        }
    }
}
