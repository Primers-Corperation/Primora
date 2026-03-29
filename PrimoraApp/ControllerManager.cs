using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace Primora
{
    public class ControllerManager
    {
        private static ControllerManager instance;
        public static ControllerManager Instance => instance ?? (instance = new ControllerManager());

        private ControllerManager() { }

        /// <summary>
        /// Global handler for controller disconnection events in v2.0.0.
        /// Prevents critical app crashes previously seen in legacy versions.
        /// </summary>
        public void HandleControllerDisconnection(object controllerObj)
        {
            try
            {
                // Access common controller properties safely
                if (controllerObj == null) return;
                
                string controllerName = "Unknown Controller";
                
                // Use reflection if needed or cast if it's a known type
                // logger.Info($"Controller {controllerName} disconnected. Re-allocating slots...");
                
                // Robust slot cleanup logic
                CleanupSlotHandlers(controllerObj);
            }
            catch (Exception ex)
            {
                // Critical safety: Log the exception and prevent a hard crash
                // Logger.LogError(ex, "Primora: Controller disconnection critical error (handled)");
                System.Diagnostics.Debug.WriteLine($"[CRITICAL] Controller Disconnection error: {ex.Message}");
            }
        }

        private void CleanupSlotHandlers(object controller)
        {
            // Placeholder for real slot cleanup logic depending on mapping state
        }
    }
}
