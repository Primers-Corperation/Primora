# Primora 

**The premium evolution of precision gamepad mapping.**

Primora is the high-fidelity successor to legacy mapping tools, re-engineered for absolute reliability, ultra-low latency, and the stunning "Liquid Glass" UI aesthetic. Supporting DualSense, DS4, Switch Pro, and JoyCon peripherals, Primora bridges the gap between human intent and digital execution.

##  What's New in Primora

- **Liquid Glass UI**: A complete visual overhaul with monochrome clarity, ultra-thin borders, and dynamic background breathing.
- **Neuro-Kinetic Hub**: Integrated assistive precision smoothing (EMA filtering) and real-time hardware integrity audits.
- **Intelligent Power Hub**: Automated Low Power Mode (<20% battery) with performance throttling and LED management.
- **Precision Diagnostics**: Mechanical wear detection and health scoring for every connected peripheral.

##  About Primora

This project is the definitive fork of the original mapping vision, evolved for modern hardware synergy. We focus on enhancing the bridge between high-frequency controller signals and virtual output accuracy, ensuring your hardware performs at its absolute mathematical peak.

## License

Primora is licensed under the terms of the GNU General Public License version 3.
You can find a copy of the terms and conditions of that license at
[https://www.gnu.org/licenses/gpl-3.0.txt](https://www.gnu.org/licenses/gpl-3.0.txt). The license is also
available in this source code from the COPYING file.

## Downloads

- **[Main builds of Primora](https://primora-website.vercel.app)**

## Install

You can install Primora by downloading it from [Official Website](https://primora-website.vercel.app) and place it to your preferred place.

Alternatively, you can download [`primora.bat`](https://github.com/Primoraapp/Primora/blob/main/ds4w.bat) file and execute it. It will open a window that downloads and places the program in `%LOCALAPPDATA%\Primora` and creates a desktop shortcut to the executable.

## Requirements

- Windows 10 or newer (Thanks Microsoft)
- Microsoft .NET 8.0 Desktop Runtime. [x64](https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/runtime-desktop-8.0.0-windows-x64-installer) or [x86](https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/runtime-desktop-8.0.0-windows-x86-installer)
- Visual C++ 2015-2022 Redistributable. [x64](https://aka.ms/vs/17/release/vc_redist.x64.exe) or [x86](https://aka.ms/vs/17/release/vc_redist.x86.exe)
- [ViGEmBus](https://vigembusdriver.com/) driver (Primora will install it for you)
- **Sony** DualShock 4 or other supported controller
- Connection method:
  - Micro USB cable
  - [Sony Wireless Adapter](https://www.amazon.com/gp/product/B01KYVLKG2)
  - Bluetooth 4.0 (via an
  [adapter like this](https://www.newegg.com/Product/Product.aspx?Item=N82E16833166126)
  or built in pc). Only use of Microsoft BT stack is supported. CSR BT stack is
  confirmed to not work with the DualShock 4 even though some CSR adapters work fine
  using Microsoft BT stack. Toshiba's adapters currently do not work.
  *Disabling 'Enable output data' in the controller profile settings might help with latency issues, but will disable lightbar and rumble support.*
- Disable **PlayStation Configuration Support** and
**Xbox Configuration Support** options in Steam
