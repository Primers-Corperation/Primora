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
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Primora.PrimoraForms.ViewModels.Util;
using Primora;
using static Primora.Mouse;

namespace Primora.PrimoraForms.ViewModels
{
    public class TouchButtonUserControlViewModel
    {
        private int deviceIndex;
        public int DeviceIndex
        {
            get => deviceIndex;
            set => deviceIndex = value;
        }

        private EnumChoiceSelection<TouchButtonActivationMode>[] touchButtonModes = new EnumChoiceSelection<TouchButtonActivationMode>[]
        {
            new EnumChoiceSelection<TouchButtonActivationMode>("Click", TouchButtonActivationMode.Click),
            new EnumChoiceSelection<TouchButtonActivationMode>("Touch", TouchButtonActivationMode.Touch),
            new EnumChoiceSelection<TouchButtonActivationMode>("Release", TouchButtonActivationMode.Release),
        };
        public EnumChoiceSelection<TouchButtonActivationMode>[] TouchButtonModes => touchButtonModes;

        public TouchButtonActivationMode CurrentMode
        {
            get => Global.TouchpadButtonMode[deviceIndex];
            set => Global.TouchpadButtonMode[deviceIndex] = value;
        }

        public TouchButtonUserControlViewModel(int deviceIndex)
        {
            this.deviceIndex = deviceIndex;
        }
    }
}
