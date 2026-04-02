using System.Collections.Generic;

namespace Primora.Licensing
{
    public static class LicenseManager
    {
        public static LicenseTier CurrentTier { get; set; } = LicenseTier.Free;

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

        public static bool HasFeature(Feature feature)
        {
            return TierFeatures.TryGetValue(CurrentTier, out var features) && features.Contains(feature);
        }
    }
}
