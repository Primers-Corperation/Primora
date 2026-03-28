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
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Windows.Input;

namespace Primora.PrimoraForms.ViewModels
{
    public class MappingListViewModel
    {
        //private int devIndex;
        private ObservableCollection<MappedControl> mappings = new ObservableCollection<MappedControl>();
        public ObservableCollection<MappedControl> Mappings { get => mappings; }

        private int selectedIndex = -1;
        public int SelectedIndex
        {
            get => selectedIndex;
            set
            {
                if (selectedIndex == value) return;
                selectedIndex = value;
                SelectedIndexChanged?.Invoke(this, EventArgs.Empty);
            }
        }
        public event EventHandler SelectedIndexChanged;

        private Dictionary<PrimoraControls, MappedControl> controlMap =
            new Dictionary<PrimoraControls, MappedControl>();
        public Dictionary<PrimoraControls, MappedControl> ControlMap { get => controlMap; }

        /// <summary>
        /// PrimoraControls -> Int index map. Store approriate list index for a stored MappedControl instance
        /// </summary>
        private Dictionary<PrimoraControls, int> controlIndexMap =
            new Dictionary<PrimoraControls, int>();
        public Dictionary<PrimoraControls, int> ControlIndexMap { get => controlIndexMap; }

        private MappedControl l2FullPullControl;
        public MappedControl L2FullPullControl { get => l2FullPullControl; }

        private MappedControl r2FullPullControl;
        public MappedControl R2FullPullControl { get => r2FullPullControl; }

        private MappedControl lsOuterBindControl;
        public MappedControl LsOuterBindControl { get => lsOuterBindControl; }

        private MappedControl rsOuterBindControl;
        public MappedControl RsOuterBindControl { get => rsOuterBindControl; }

        private MappedControl gyroSwipeLeftControl;
        private MappedControl gyroSwipeRightControl;
        private MappedControl gyroSwipeUpControl;
        private MappedControl gyroSwipeDownControl;

        private List<MappedControl> extraControls = new List<MappedControl>();

        public MappingListViewModel(int devIndex, OutContType devType)
        {
            mappings.Add(new MappedControl(devIndex, PrimoraControls.Cross, "Cross", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.Circle, "Circle", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.Square, "Square", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.Triangle, "Triangle", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.Options, "Options", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.Share, "Share", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.DpadUp, "Up", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.DpadDown, "Down", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.DpadLeft, "Left", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.DpadRight, "Right", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.PS, "PS", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.Mute, "Mute", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.L1, "L1", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.R1, "R1", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.L2, "L2", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.R2, "R2", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.L3, "L3", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.R3, "R3", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.Capture, "Capture", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.SideL, "Side L", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.SideR, "Side R", devType));

            mappings.Add(new MappedControl(devIndex, PrimoraControls.TouchLeft, "Left Touch", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.TouchRight, "Right Touch", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.TouchMulti, "Multitouch", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.TouchUpper, "Upper Touch", devType));

            mappings.Add(new MappedControl(devIndex, PrimoraControls.LYNeg, "LS Up", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.LYPos, "LS Down", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.LXNeg, "LS Left", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.LXPos, "LS Right", devType));

            mappings.Add(new MappedControl(devIndex, PrimoraControls.RYNeg, "RS Up", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.RYPos, "RS Down", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.RXNeg, "RS Left", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.RXPos, "RS Right", devType));

            mappings.Add(new MappedControl(devIndex, PrimoraControls.GyroZNeg, "Tilt Up", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.GyroZPos, "Tilt Down", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.GyroXPos, "Tilt Left", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.GyroXNeg, "Tilt Right", devType));

            mappings.Add(new MappedControl(devIndex, PrimoraControls.SwipeUp, "Swipe Up", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.SwipeDown, "Swipe Down", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.SwipeLeft, "Swipe Left", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.SwipeRight, "Swipe Right", devType));

            mappings.Add(new MappedControl(devIndex, PrimoraControls.FnL, "Function Left", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.FnR, "Function Right", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.BLP, "Bottom Left Paddle", devType));
            mappings.Add(new MappedControl(devIndex, PrimoraControls.BRP, "Bottom Right Paddle", devType));

            int controlIndex = 0;
            foreach (MappedControl mapped in mappings)
            {
                controlMap.Add(mapped.Control, mapped);
                controlIndexMap.Add(mapped.Control, controlIndex);
                controlIndex++;
            }

            /*
             * Establish data binding data for virtual button PrimoraControlSettings instances
             */
            lsOuterBindControl = new MappedControl(devIndex, PrimoraControls.LSOuter, "LS Outer", devType);
            rsOuterBindControl = new MappedControl(devIndex, PrimoraControls.RSOuter, "RS Outer", devType);

            l2FullPullControl = new MappedControl(devIndex, PrimoraControls.L2FullPull, "L2 Full Pull", devType);
            r2FullPullControl = new MappedControl(devIndex, PrimoraControls.R2FullPull, "R2 Full Pull", devType);

            gyroSwipeLeftControl = new MappedControl(devIndex, PrimoraControls.GyroSwipeLeft, "Gyro Swipe Left", devType);
            gyroSwipeRightControl = new MappedControl(devIndex, PrimoraControls.GyroSwipeRight, "Gyro Swipe Right", devType);
            gyroSwipeUpControl = new MappedControl(devIndex, PrimoraControls.GyroSwipeUp, "Gyro Swipe Up", devType);
            gyroSwipeDownControl = new MappedControl(devIndex, PrimoraControls.GyroSwipeDown, "Gyro Swipe Down", devType);

            extraControls.Add(lsOuterBindControl);
            extraControls.Add(rsOuterBindControl);
            extraControls.Add(l2FullPullControl);
            extraControls.Add(r2FullPullControl);
            extraControls.Add(gyroSwipeLeftControl);
            extraControls.Add(gyroSwipeRightControl);
            extraControls.Add(gyroSwipeUpControl);
            extraControls.Add(gyroSwipeDownControl);

            controlMap.Add(PrimoraControls.LSOuter, lsOuterBindControl);
            controlMap.Add(PrimoraControls.RSOuter, rsOuterBindControl);
            controlMap.Add(PrimoraControls.L2FullPull, l2FullPullControl);
            controlMap.Add(PrimoraControls.R2FullPull, r2FullPullControl);
            controlMap.Add(PrimoraControls.GyroSwipeLeft, gyroSwipeLeftControl);
            controlMap.Add(PrimoraControls.GyroSwipeRight, gyroSwipeRightControl);
            controlMap.Add(PrimoraControls.GyroSwipeUp, gyroSwipeUpControl);
            controlMap.Add(PrimoraControls.GyroSwipeDown, gyroSwipeDownControl);
        }

        public void UpdateMappingDevType(OutContType devType)
        {
            foreach (MappedControl mapped in mappings)
            {
                mapped.DevType = devType;
            }

            foreach (MappedControl mapped in extraControls)
            {
                mapped.DevType = devType;
            }
        }

        public void UpdateMappings()
        {
            foreach (MappedControl mapped in mappings)
            {
                mapped.UpdateMappingName();
            }

            foreach (MappedControl mapped in extraControls)
            {
                mapped.UpdateMappingName();
            }
        }
    }

    public class MappedControl
    {
        private int devIndex;
        private OutContType devType;
        private PrimoraControls control;
        private PrimoraControlSettings setting;
        private string controlName;
        private string mappingName;
        private string shiftMappingName;

        public int DevIndex { get => devIndex; }
        public PrimoraControls Control { get => control; }
        public PrimoraControlSettings Setting { get => setting; }
        public string ControlName { get => controlName; }
        public string MappingName { get => mappingName; }
        public OutContType DevType
        {
            get => devType;
            set
            {
                devType = value;
                DevTypeChanged?.Invoke(this, EventArgs.Empty);
            }
        }

        public string ShiftMappingName { get => shiftMappingName; set => shiftMappingName = value; }

        public event EventHandler DevTypeChanged;

        public event EventHandler MappingNameChanged;

        public MappedControl(int devIndex, PrimoraControls control, string controlName,
            OutContType devType, bool initMap = false)
        {
            this.devIndex = devIndex;
            this.devType = devType;
            this.control = control;
            this.controlName = controlName;
            setting = Global.GetDS4CSetting(devIndex, control);
            //mappingName = "?";
            if (initMap)
            {
                mappingName = GetMappingString();
                if (HasShiftAction())
                {
                    shiftMappingName = ShiftTrigger(setting.shiftTrigger) + " -> " + GetMappingString(true);
                }
            }

            DevTypeChanged += MappedControl_DevTypeChanged;
        }

        private void MappedControl_DevTypeChanged(object sender, EventArgs e)
        {
            UpdateMappingName();
        }

        public void UpdateMappingName()
        {
            mappingName = GetMappingString();
            if (HasShiftAction())
            {
                shiftMappingName = ShiftTrigger(setting.shiftTrigger) + " -> " + GetMappingString(true);
            }
            else
            {
                shiftMappingName = "";
            }

            MappingNameChanged?.Invoke(this, EventArgs.Empty);
        }

        public string GetMappingString(bool shift = false)
        {
            string temp = Properties.Resources.Unassigned;
            ControlActionData action = !shift ? setting.action : setting.shiftAction;
            bool sc = !shift ? setting.keyType.HasFlag(DS4KeyType.ScanCode) :
                setting.shiftKeyType.HasFlag(DS4KeyType.ScanCode);
            bool extra = control >= PrimoraControls.GyroXPos && control <= PrimoraControls.SwipeDown;
            PrimoraControlSettings.ActionType actionType = !shift ? setting.actionType : setting.shiftActionType;
            if (actionType != PrimoraControlSettings.ActionType.Default)
            {
                if (actionType == PrimoraControlSettings.ActionType.Key)
                {
                    //return (Keys)int.Parse(action.ToString()) + (sc ? " (" + Properties.Resources.ScanCode + ")" : "");
                    temp = KeyInterop.KeyFromVirtualKey(action.actionKey) + (sc ? " (" + Properties.Resources.ScanCode + ")" : "");
                }
                else if (actionType == PrimoraControlSettings.ActionType.Macro)
                {
                    temp = Properties.Resources.Macro + (sc ? " (" + Properties.Resources.ScanCode + ")" : "");
                }
                else if (actionType == PrimoraControlSettings.ActionType.Button)
                {
                    string tag;
                    tag = Global.getX360ControlString((X360Controls)action.actionBtn, devType);
                    temp = tag;
                }
                else
                {
                    temp = Global.getX360ControlString(Global.defaultButtonMapping[(int)control], devType);
                }
            }
            else if (!extra && !shift)
            {
                X360Controls tempOutControl = Global.defaultButtonMapping[(int)control];
                if (tempOutControl != X360Controls.None)
                {
                    temp = Global.getX360ControlString(tempOutControl, devType);
                }
            }
            else if (shift)
                temp = "";

            return temp;
        }

        public bool HasShiftAction()
        {
            return setting.shiftActionType != PrimoraControlSettings.ActionType.Default;
        }

        private static string ShiftTrigger(int trigger)
        {
            switch (trigger)
            {
                case 1: return "Cross";
                case 2: return "Circle";
                case 3: return "Square";
                case 4: return "Triangle";
                case 5: return "Options";
                case 6: return "Share";
                case 7: return "Dpad Up";
                case 8: return "Dpad Down";
                case 9: return "Dpad Left";
                case 10: return "Dpad Right";
                case 11: return "PS";
                case 12: return "L1";
                case 13: return "R1";
                case 14: return "L2";
                case 15: return "R2";
                case 16: return "L3";
                case 17: return "R3";
                case 18: return "Left Touch";
                case 19: return "Upper Touch";
                case 20: return "Multi Touch";
                case 21: return "Right Touch";
                case 22: return Properties.Resources.TiltUp;
                case 23: return Properties.Resources.TiltDown;
                case 24: return Properties.Resources.TiltLeft;
                case 25: return Properties.Resources.TiltRight;
                case 26: return "Finger on Touchpad";
                case 27: return "Mute";
                case 28: return "Capture";
                case 29: return "Side L";
                case 30: return "Side R";
                case 31: return "Function Left";
                case 32: return "Function Right";
                case 33: return "Bottom Left Paddle";
                case 43: return "Bottom Right Paddle";
                default: return "";
            }
        }
    }
}
