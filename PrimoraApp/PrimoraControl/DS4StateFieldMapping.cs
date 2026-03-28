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

namespace Primora
{
    public class DS4StateFieldMapping
    {
        public enum ControlType : int { Unknown = 0, Button, AxisDir, Trigger, Touch, GyroDir, SwipeDir }
        public const byte LAST_DS4_ACTION = (byte)PrimoraControls.TouchEnded;

        public bool[] buttons = new bool[(int)LAST_DS4_ACTION + 1];
        public byte[] axisdirs = new byte[(int)LAST_DS4_ACTION + 1];
        public byte[] triggers = new byte[(int)LAST_DS4_ACTION + 1];
        public int[] gryodirs = new int[(int)LAST_DS4_ACTION + 1];
        public byte[] swipedirs = new byte[(int)LAST_DS4_ACTION + 1];
        public bool[] swipedirbools = new bool[(int)LAST_DS4_ACTION + 1];
        public bool touchButton = false;
        public bool outputTouchButton = false;

        public static ControlType[] mappedType = new ControlType[LAST_DS4_ACTION + 1]
        {
            ControlType.Unknown, // PrimoraControls.None
            ControlType.AxisDir, // PrimoraControls.LXNeg
            ControlType.AxisDir, // PrimoraControls.LXPos
            ControlType.AxisDir, // PrimoraControls.LYNeg
            ControlType.AxisDir, // PrimoraControls.LYPos
            ControlType.AxisDir, // PrimoraControls.RXNeg
            ControlType.AxisDir, // PrimoraControls.RXPos
            ControlType.AxisDir, // PrimoraControls.RYNeg
            ControlType.AxisDir, // PrimoraControls.RYPos
            ControlType.Button, // PrimoraControls.L1
            ControlType.Trigger, // PrimoraControls.L2
            ControlType.Button, // PrimoraControls.L3
            ControlType.Button, // PrimoraControls.R1
            ControlType.Trigger, // PrimoraControls.R2
            ControlType.Button, // PrimoraControls.R3
            ControlType.Button, // PrimoraControls.Square
            ControlType.Button, // PrimoraControls.Triangle
            ControlType.Button, // PrimoraControls.Circle
            ControlType.Button, // PrimoraControls.Cross
            ControlType.Button, // PrimoraControls.DpadUp
            ControlType.Button, // PrimoraControls.DpadRight
            ControlType.Button, // PrimoraControls.DpadDown
            ControlType.Button, // PrimoraControls.DpadLeft
            ControlType.Button, // PrimoraControls.PS
            ControlType.Touch, // PrimoraControls.TouchLeft
            ControlType.Touch, // PrimoraControls.TouchUpper
            ControlType.Touch, // PrimoraControls.TouchMulti
            ControlType.Touch, // PrimoraControls.TouchRight
            ControlType.Button, // PrimoraControls.Share
            ControlType.Button, // PrimoraControls.Options
            ControlType.Button, // PrimoraControls.Mute
            ControlType.Button, // PrimoraControls.FnL
            ControlType.Button, // PrimoraControls.FnR
            ControlType.Button, // PrimoraControls.BLP
            ControlType.Button, // PrimoraControls.BRP
            ControlType.GyroDir, // PrimoraControls.GyroXPos
            ControlType.GyroDir, // PrimoraControls.GyroXNeg
            ControlType.GyroDir, // PrimoraControls.GyroZPos
            ControlType.GyroDir, // PrimoraControls.GyroZNeg
            ControlType.SwipeDir, // PrimoraControls.SwipeLeft
            ControlType.SwipeDir, // PrimoraControls.SwipeRight
            ControlType.SwipeDir, // PrimoraControls.SwipeUp
            ControlType.SwipeDir, // PrimoraControls.SwipeDown
            ControlType.Button, // PrimoraControls.L2FullPull
            ControlType.Button, // PrimoraControls.R2FullPull
            ControlType.Button, // PrimoraControls.GyroSwipeLeft
            ControlType.Button, // PrimoraControls.GyroSwipeRight
            ControlType.Button, // PrimoraControls.GyroSwipeUp
            ControlType.Button, // PrimoraControls.GyroSwipeDown
            ControlType.Button, // PrimoraControls.Capture
            ControlType.Button, // PrimoraControls.SideL
            ControlType.Button, // PrimoraControls.SideR
            ControlType.Trigger, // PrimoraControls.LSOuter
            ControlType.Trigger, // PrimoraControls.RSOuter
            ControlType.Button,  // PrimoraControls.TouchStarted
            ControlType.Button, // PrimoraControls.TouchEnded
        };

        public DS4StateFieldMapping()
        {
        }

        public DS4StateFieldMapping(DS4State cState, DS4StateExposed exposeState, Mouse tp, bool priorMouse = false)
        {
            PopulateFieldMapping(cState, exposeState, tp, priorMouse);
        }

        public void PopulateFieldMapping(DS4State cState, DS4StateExposed exposeState, Mouse tp, bool priorMouse = false)
        {
            unchecked
            {
                axisdirs[(int)PrimoraControls.LXNeg] = cState.LX;
                axisdirs[(int)PrimoraControls.LXPos] = cState.LX;
                axisdirs[(int)PrimoraControls.LYNeg] = cState.LY;
                axisdirs[(int)PrimoraControls.LYPos] = cState.LY;
                triggers[(int)PrimoraControls.LSOuter] = cState.OutputLSOuter;

                axisdirs[(int)PrimoraControls.RXNeg] = cState.RX;
                axisdirs[(int)PrimoraControls.RXPos] = cState.RX;
                axisdirs[(int)PrimoraControls.RYNeg] = cState.RY;
                axisdirs[(int)PrimoraControls.RYPos] = cState.RY;
                triggers[(int)PrimoraControls.RSOuter] = cState.OutputRSOuter;

                triggers[(int)PrimoraControls.L2] = cState.L2;
                triggers[(int)PrimoraControls.R2] = cState.R2;

                buttons[(int)PrimoraControls.L1] = cState.L1;
                buttons[(int)PrimoraControls.L2FullPull] = cState.L2Raw == 255;
                buttons[(int)PrimoraControls.L3] = cState.L3;
                buttons[(int)PrimoraControls.R1] = cState.R1;
                buttons[(int)PrimoraControls.R2FullPull] = cState.R2Raw == 255;
                buttons[(int)PrimoraControls.R3] = cState.R3;

                buttons[(int)PrimoraControls.Cross] = cState.Cross;
                buttons[(int)PrimoraControls.Triangle] = cState.Triangle;
                buttons[(int)PrimoraControls.Circle] = cState.Circle;
                buttons[(int)PrimoraControls.Square] = cState.Square;
                buttons[(int)PrimoraControls.PS] = cState.PS;
                buttons[(int)PrimoraControls.Options] = cState.Options;
                buttons[(int)PrimoraControls.Share] = cState.Share;
                buttons[(int)PrimoraControls.Mute] = cState.Mute;
                buttons[(int)PrimoraControls.FnL] = cState.FnL;
                buttons[(int)PrimoraControls.FnR] = cState.FnR;
                buttons[(int)PrimoraControls.BLP] = cState.BLP;
                buttons[(int)PrimoraControls.BRP] = cState.BRP;
                buttons[(int)PrimoraControls.Capture] = cState.Capture;
                buttons[(int)PrimoraControls.SideL] = cState.SideL;
                buttons[(int)PrimoraControls.SideR] = cState.SideR;

                buttons[(int)PrimoraControls.DpadUp] = cState.DpadUp;
                buttons[(int)PrimoraControls.DpadRight] = cState.DpadRight;
                buttons[(int)PrimoraControls.DpadDown] = cState.DpadDown;
                buttons[(int)PrimoraControls.DpadLeft] = cState.DpadLeft;

                buttons[(int)PrimoraControls.TouchLeft] = tp != null ? (!priorMouse ? tp.leftDown : tp.priorLeftDown) : false;
                buttons[(int)PrimoraControls.TouchRight] = tp != null ? (!priorMouse ? tp.rightDown : tp.priorRightDown) : false;
                buttons[(int)PrimoraControls.TouchUpper] = tp != null ? (!priorMouse ? tp.upperDown : tp.priorUpperDown) : false;
                buttons[(int)PrimoraControls.TouchMulti] = tp != null ? (!priorMouse ? tp.multiDown : tp.priorMultiDown) : false;

                int sixAxisX = -exposeState.getOutputAccelX();
                gryodirs[(int)PrimoraControls.GyroXPos] = sixAxisX > 0 ? sixAxisX : 0;
                gryodirs[(int)PrimoraControls.GyroXNeg] = sixAxisX < 0 ? sixAxisX : 0;

                int sixAxisZ = exposeState.getOutputAccelZ();
                gryodirs[(int)PrimoraControls.GyroZPos] = sixAxisZ > 0 ? sixAxisZ : 0;
                gryodirs[(int)PrimoraControls.GyroZNeg] = sixAxisZ < 0 ? sixAxisZ : 0;

                swipedirs[(int)PrimoraControls.SwipeLeft] = tp != null ? (!priorMouse ? tp.swipeLeftB : tp.priorSwipeLeftB) : (byte)0;
                swipedirs[(int)PrimoraControls.SwipeRight] = tp != null ? (!priorMouse ? tp.swipeRightB : tp.priorSwipeRightB) : (byte)0;
                swipedirs[(int)PrimoraControls.SwipeUp] = tp != null ? (!priorMouse ? tp.swipeUpB : tp.priorSwipeUpB) : (byte)0;
                swipedirs[(int)PrimoraControls.SwipeDown] = tp != null ? (!priorMouse ? tp.swipeDownB : tp.priorSwipeDownB) : (byte)0;

                swipedirbools[(int)PrimoraControls.SwipeLeft] = tp != null ? (!priorMouse ? tp.swipeLeft : tp.priorSwipeLeft) : false;
                swipedirbools[(int)PrimoraControls.SwipeRight] = tp != null ? (!priorMouse ? tp.swipeRight : tp.priorSwipeRight) : false;
                swipedirbools[(int)PrimoraControls.SwipeUp] = tp != null ? (!priorMouse ? tp.swipeUp : tp.priorSwipeUp) : false;
                swipedirbools[(int)PrimoraControls.SwipeDown] = tp != null ? (!priorMouse ? tp.swipeDown : tp.priorSwipeDown) : false;

                buttons[(int)PrimoraControls.GyroSwipeLeft] = tp != null ? tp.gyroSwipe.swipeLeft : false;
                buttons[(int)PrimoraControls.GyroSwipeRight] = tp != null ? tp.gyroSwipe.swipeRight : false;
                buttons[(int)PrimoraControls.GyroSwipeUp] = tp != null ? tp.gyroSwipe.swipeUp : false;
                buttons[(int)PrimoraControls.GyroSwipeDown] = tp != null ? tp.gyroSwipe.swipeDown : false;
                buttons[(int)PrimoraControls.TouchStarted] = tp != null ? tp.TouchStarted : false;
                buttons[(int)PrimoraControls.TouchEnded] = tp != null ? tp.TouchEnded : false;

                touchButton = cState.TouchButton;
                outputTouchButton = cState.OutputTouchButton;
            }
        }

        public void PopulateState(DS4State state)
        {
            unchecked
            {
                state.LX = axisdirs[(int)PrimoraControls.LXNeg];
                state.LX = axisdirs[(int)PrimoraControls.LXPos];
                state.LY = axisdirs[(int)PrimoraControls.LYNeg];
                state.LY = axisdirs[(int)PrimoraControls.LYPos];
                state.OutputLSOuter = triggers[(int)PrimoraControls.LSOuter];

                state.RX = axisdirs[(int)PrimoraControls.RXNeg];
                state.RX = axisdirs[(int)PrimoraControls.RXPos];
                state.RY = axisdirs[(int)PrimoraControls.RYNeg];
                state.RY = axisdirs[(int)PrimoraControls.RYPos];
                state.OutputRSOuter = triggers[(int)PrimoraControls.RSOuter];

                state.L2 = triggers[(int)PrimoraControls.L2];
                state.R2 = triggers[(int)PrimoraControls.R2];

                state.L1 = buttons[(int)PrimoraControls.L1];
                state.L3 = buttons[(int)PrimoraControls.L3];
                state.R1 = buttons[(int)PrimoraControls.R1];
                state.R3 = buttons[(int)PrimoraControls.R3];

                state.Cross = buttons[(int)PrimoraControls.Cross];
                state.Triangle = buttons[(int)PrimoraControls.Triangle];
                state.Circle = buttons[(int)PrimoraControls.Circle];
                state.Square = buttons[(int)PrimoraControls.Square];
                state.PS = buttons[(int)PrimoraControls.PS];
                state.Options = buttons[(int)PrimoraControls.Options];
                state.Share = buttons[(int)PrimoraControls.Share];
                state.Mute = buttons[(int)PrimoraControls.Mute];
                state.FnL = buttons[(int)PrimoraControls.FnL];
                state.FnR = buttons[(int)PrimoraControls.FnR];
                state.BLP = buttons[(int)PrimoraControls.BLP];
                state.BRP = buttons[(int)PrimoraControls.BRP];
                state.Capture = buttons[(int)PrimoraControls.Capture];
                state.SideL = buttons[(int)PrimoraControls.SideL];
                state.SideR = buttons[(int)PrimoraControls.SideR];

                state.DpadUp = buttons[(int)PrimoraControls.DpadUp];
                state.DpadRight = buttons[(int)PrimoraControls.DpadRight];
                state.DpadDown = buttons[(int)PrimoraControls.DpadDown];
                state.DpadLeft = buttons[(int)PrimoraControls.DpadLeft];
                state.TouchButton = touchButton;
                state.OutputTouchButton = outputTouchButton;
            }
        }
    }
}
