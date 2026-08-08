using System;
using System.IO;
using System.Text.Json;
using NLog;

namespace Primora.Cloud
{
    /// <summary>
    /// Supplies the Supabase endpoint used by <see cref="CloudSyncService"/>.
    /// Credentials are never committed to the repository. They are resolved, in order, from:
    ///   1. the PRIMORA_SUPABASE_URL / PRIMORA_SUPABASE_ANON_KEY environment variables, then
    ///   2. a config.local.json file sitting next to the executable.
    /// When neither is present <see cref="IsConfigured"/> is false and cloud features stay disabled.
    /// </summary>
    public static class SupabaseConfig
    {
        public const string UrlVariable = "PRIMORA_SUPABASE_URL";
        public const string AnonKeyVariable = "PRIMORA_SUPABASE_ANON_KEY";
        public const string ConfigFileName = "config.local.json";

        private static readonly ILogger _log = LogManager.GetCurrentClassLogger();

        /// <summary>Project URL, e.g. https://xxxxxxxx.supabase.co</summary>
        public static string Url { get; private set; }

        /// <summary>
        /// Public anon key. This is a client-side key guarded by row level security, but it is
        /// still kept out of source control so the endpoint is not published with the source.
        /// </summary>
        public static string AnonKey { get; private set; }

        /// <summary>True when both values resolved, i.e. cloud sync can be attempted.</summary>
        public static bool IsConfigured =>
            !string.IsNullOrWhiteSpace(Url) && !string.IsNullOrWhiteSpace(AnonKey);

        static SupabaseConfig()
        {
            Url = Environment.GetEnvironmentVariable(UrlVariable);
            AnonKey = Environment.GetEnvironmentVariable(AnonKeyVariable);

            if (IsConfigured)
            {
                return;
            }

            LoadFromConfigFile();

            if (!IsConfigured)
            {
                _log.Info($"[CloudSync] Supabase is not configured. Set {UrlVariable} and " +
                    $"{AnonKeyVariable}, or provide {ConfigFileName}. Cloud features stay disabled.");
            }
        }

        private static void LoadFromConfigFile()
        {
            string path = Path.Combine(AppContext.BaseDirectory, ConfigFileName);
            if (!File.Exists(path))
            {
                return;
            }

            try
            {
                using JsonDocument document = JsonDocument.Parse(File.ReadAllText(path));
                JsonElement root = document.RootElement;
                if (root.ValueKind != JsonValueKind.Object)
                {
                    return;
                }

                if (root.TryGetProperty("supabase", out JsonElement supabase) &&
                    supabase.ValueKind == JsonValueKind.Object)
                {
                    root = supabase;
                }

                Url ??= ReadString(root, "url");
                AnonKey ??= ReadString(root, "anonKey");
            }
            catch (Exception ex)
            {
                // A malformed local config must not stop the app from starting.
                _log.Warn($"[CloudSync] Could not read {ConfigFileName}: {ex.Message}");
            }
        }

        private static string ReadString(JsonElement parent, string propertyName)
        {
            return parent.TryGetProperty(propertyName, out JsonElement value) &&
                value.ValueKind == JsonValueKind.String
                    ? value.GetString()
                    : null;
        }
    }
}
