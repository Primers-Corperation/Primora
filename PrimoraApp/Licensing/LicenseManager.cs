using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;

namespace Primora.Licensing
{
    /// <summary>
    /// License key validation record.
    /// </summary>
    public class LicenseKey
    {
        public string Key { get; set; }
        public LicenseTier Tier { get; set; }
        public DateTime ActivatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public string Checksum { get; set; }
        public bool IsValid { get; set; }
    }

    public static class LicenseManager
    {
        private static LicenseTier currentTier = LicenseTier.Free;
        public static LicenseTier CurrentTier
        {
            get => currentTier;
            set
            {
                if (value != currentTier)
                {
                    currentTier = value;
                    Debug.WriteLine($"License Manager: Tier changed to {value}");
                }
            }
        }

        private static LicenseKey activeLicense = null;

        // License key format: PRIMORA-XXXXXXXXXX-YYYY
        // Where XXXXXXXXXX is the tier hash and YYYY is a checksum
        private const string KeyPrefix = "PRIMORA";
        private static readonly Dictionary<string, LicenseTier> TierCodes = new Dictionary<string, LicenseTier>
        {
            { "PRO", LicenseTier.Pro },
            { "ELITE", LicenseTier.Elite }
        };

        private static readonly Dictionary<LicenseTier, HashSet<Feature>> TierFeatures = new Dictionary<LicenseTier, HashSet<Feature>>
        {
            { LicenseTier.Free, new HashSet<Feature> { Feature.NeuroKineticProfiles } },
            { LicenseTier.Pro, new HashSet<Feature> {
                Feature.NeuroKineticProfiles,
                Feature.AnalyticsDashboard,
                Feature.CloudSync
            } },
            { LicenseTier.Elite, new HashSet<Feature> {
                Feature.AnalyticsDashboard,
                Feature.CloudSync,
                Feature.NeuroKineticProfiles,
                Feature.TournamentMacros,
                Feature.AuditCertificate
            } }
        };

        /// <summary>
        /// Validate and activate a license key.
        /// Expected format: PRIMORA-PRO-XXXXXXXXXX
        /// </summary>
        public static bool ActivateLicense(string licenseKey)
        {
            if (string.IsNullOrWhiteSpace(licenseKey))
            {
                Debug.WriteLine("License Manager: Invalid license key - empty");
                return false;
            }

            try
            {
                var key = ParseLicenseKey(licenseKey);
                if (key == null || !key.IsValid)
                {
                    Debug.WriteLine($"License Manager: Invalid license key format - {licenseKey}");
                    return false;
                }

                // Check expiration
                if (DateTime.UtcNow > key.ExpiresAt)
                {
                    Debug.WriteLine($"License Manager: License expired on {key.ExpiresAt:O}");
                    return false;
                }

                activeLicense = key;
                CurrentTier = key.Tier;
                Debug.WriteLine($"License Manager: Activated {key.Tier} license");
                return true;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"License Manager: Error validating license - {ex.Message}");
                return false;
            }
        }

        private static LicenseKey ParseLicenseKey(string rawKey)
        {
            var parts = rawKey.Split('-');
            if (parts.Length != 3)
                return null;

            if (parts[0] != KeyPrefix)
                return null;

            if (!TierCodes.TryGetValue(parts[1], out var tier))
                return null;

            string hash = parts[2];
            string expectedHash = ComputeKeyHash(KeyPrefix, parts[1]);
            if (hash != expectedHash)
                return null;

            var key = new LicenseKey
            {
                Key = rawKey,
                Tier = tier,
                ActivatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddYears(1), // 1-year default
                Checksum = hash,
                IsValid = true
            };

            return key;
        }

        private static string ComputeKeyHash(string prefix, string tierCode)
        {
            // Simple hash-based validation (not cryptographically strong, but sufficient for offline validation)
            string input = $"{prefix}-{tierCode}-PRIMORA_V2";
            using (var md5 = MD5.Create())
            {
                byte[] hashBytes = md5.ComputeHash(Encoding.UTF8.GetBytes(input));
                // Use first 8 chars of hex digest
                return BitConverter.ToString(hashBytes).Replace("-", "").Substring(0, 8).ToUpper();
            }
        }

        public static bool HasFeature(Feature feature)
        {
            return TierFeatures.TryGetValue(CurrentTier, out var features) && features.Contains(feature);
        }

        /// <summary>
        /// Get current license information.
        /// </summary>
        public static string GetLicenseInfo()
        {
            if (activeLicense == null)
            {
                // A tier can be granted without a key — AuthWindow sets CurrentTier from
                // the signed-in account. Reporting "Free" there told a paying user they
                // had nothing.
                return CurrentTier == LicenseTier.Free
                    ? "License: Free (No key activated)"
                    : $"License: {CurrentTier} (account tier)";
            }

            var expiryDays = (activeLicense.ExpiresAt - DateTime.UtcNow).Days;
            return $"License: {activeLicense.Tier} (Expires in {expiryDays} days)";
        }

        /// <summary>
        /// Revoke the current license.
        /// </summary>
        public static void RevokeLicense()
        {
            activeLicense = null;
            CurrentTier = LicenseTier.Free;
            Debug.WriteLine("License Manager: License revoked");
        }
    }
}
