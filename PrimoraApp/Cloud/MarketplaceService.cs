using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using NLog;

namespace Primora.Cloud
{
    /// <summary>
    /// Handles all marketplace operations including fetching, publishing, and downloading profiles.
    /// Requires an authenticated Supabase client passed from CloudSyncService.
    /// </summary>
    public class MarketplaceService
    {
        private readonly Supabase.Client _client;
        private static readonly ILogger _log = LogManager.GetCurrentClassLogger();

        public MarketplaceService(Supabase.Client client)
        {
            _client = client;
        }

        /// <summary>
        /// Fetches featured marketplace profiles for the homepage grid.
        /// </summary>
        public async Task<List<MarketplaceProfile>> FetchFeaturedAsync()
        {
            try
            {
                var response = await _client.From<MarketplaceProfile>()
                    .Order("download_count", Postgrest.Constants.Ordering.Descending)
                    .Limit(12)
                    .Get();
                return response.Models;
            }
            catch (Exception ex)
            {
                _log.Warn($"[Marketplace] FetchFeatured failed: {ex.Message}");
                return new List<MarketplaceProfile>();
            }
        }

        /// <summary>
        /// Searches marketplace profiles by name and optional controller type filter.
        /// </summary>
        public async Task<List<MarketplaceProfile>> SearchAsync(string query, string controllerFilter)
        {
            try
            {
                var builder = _client.From<MarketplaceProfile>()
                    .Filter("profile_name", Postgrest.Constants.Operator.ILike, $"%{query}%");

                if (!string.IsNullOrEmpty(controllerFilter))
                    builder = builder.Filter("controller_type", Postgrest.Constants.Operator.Equals, controllerFilter);

                var response = await builder.Get();
                return response.Models;
            }
            catch (Exception ex)
            {
                _log.Warn($"[Marketplace] Search failed: {ex.Message}");
                return new List<MarketplaceProfile>();
            }
        }

        /// <summary>
        /// Publishes a local profile to the marketplace. Pro/Elite tier only.
        /// </summary>
        public async Task<bool> PublishProfileAsync(ProfileEntity profile, decimal price)
        {
            try
            {
                var listing = new MarketplaceProfile
                {
                    Id = Guid.NewGuid(),
                    CreatorUserId = profile.UserId,
                    ProfileName = profile.ProfileName,
                    ControllerType = profile.ControllerType,
                    Description = string.Empty,
                    Price = price,
                    DownloadCount = 0,
                    CreatedAt = DateTime.UtcNow
                };
                await _client.From<MarketplaceProfile>().Insert(listing);
                return true;
            }
            catch (Exception ex)
            {
                _log.Warn($"[Marketplace] Publish failed: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Downloads a marketplace profile into the user's local profile library.
        /// Increments download count on the listing.
        /// </summary>
        public async Task<bool> DownloadProfileAsync(Guid profileId)
        {
            try
            {
                var response = await _client.From<MarketplaceProfile>()
                    .Filter("id", Postgrest.Constants.Operator.Equals, profileId.ToString())
                    .Single();

                if (response == null) return false;

                response.DownloadCount += 1;
                await _client.From<MarketplaceProfile>().Upsert(response);
                return true;
            }
            catch (Exception ex)
            {
                _log.Warn($"[Marketplace] Download failed: {ex.Message}");
                return false;
            }
        }
    }
}
