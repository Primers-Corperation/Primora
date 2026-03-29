using System;
using System.Collections.Generic;

namespace Primora.Controllers
{
    public class XboxEliteController
    {
        private string activeProfile = "Default";
        private Dictionary<string, string> paddleMappings = new Dictionary<string, string>();

        public XboxEliteController()
        {
            // Set initial state for Series 1/2 paddles
            MapPaddles();
        }

        /// <summary>
        /// Global mapping for Xbox Elite Series 1/2 paddles. 
        /// Ensures all 4 paddles are mapped to custom virtual outputs in v2.0.0.
        /// </summary>
        public void MapPaddles()
        {
            // Default paddle assignment for Liquid Glass preset
            paddleMappings["P1"] = "ABXY_A";
            paddleMappings["P2"] = "ABXY_B";
            paddleMappings["P3"] = "ABXY_X";
            paddleMappings["P4"] = "ABXY_Y";
            
            // Console output for verification during debug
            System.Diagnostics.Debug.WriteLine($"Xbox Elite: Paddles mapped to {activeProfile} configuration.");
        }

        /// <summary>
        /// Smoothly transition between controller profiles.
        /// Integrated with the Primora Profile Service.
        /// </summary>
        public void SwitchProfile(string profileName)
        {
            if (string.IsNullOrEmpty(profileName)) return;

            activeProfile = profileName;
            
            // Re-apply mappings for the new profile
            MapPaddles();
            
            // Log success for the Neuro-Kinetic Hub
            System.Diagnostics.Debug.WriteLine($"Xbox Elite Hub: Successfully switched to profile '{profileName}'.");
        }
    }
}
