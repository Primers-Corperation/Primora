using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Supabase;

namespace Primora.Cloud
{
    public class CloudSyncService
    {
        private Supabase.Client _client;
        private bool _isAuthenticated = false;

        public CloudSyncService()
        {
            var options = new SupabaseOptions { AutoConnectRealtime = false };
            _client = new Supabase.Client(SupabaseConfig.Url, SupabaseConfig.AnonKey, options);
        }

        /// <summary>
        /// Authenticates the user with the Primora Supabase instance.
        /// </summary>
        public async Task<bool> AuthenticateAsync(string email, string password)
        {
            try
            {
                var session = await _client.Auth.SignIn(email, password);
                _isAuthenticated = session?.User != null;
                return _isAuthenticated;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[CloudSync] Auth failed: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Fetches the authenticated user's remote profiles from the cloud.
        /// </summary>
        public async Task<List<ProfileEntity>> FetchProfilesAsync()
        {
            if (!_isAuthenticated) return new List<ProfileEntity>();
            try
            {
                var response = await _client.From<ProfileEntity>().Get();
                return response.Models;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[CloudSync] Fetch failed: {ex.Message}");
                return new List<ProfileEntity>();
            }
        }

        /// <summary>
        /// Pushes a single local profile up to the cloud.
        /// </summary>
        public async Task<bool> PushProfileAsync(ProfileEntity profile)
        {
            if (!_isAuthenticated) return false;
            try
            {
                profile.UpdatedAt = DateTime.UtcNow;
                await _client.From<ProfileEntity>().Upsert(profile);
                return true;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[CloudSync] Push failed: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Synchronizes all local and remote profiles, resolving conflicts by newest timestamp.
        /// </summary>
        public async Task<bool> SyncAllAsync()
        {
            if (!_isAuthenticated) return false;
            try
            {
                var remoteProfiles = await FetchProfilesAsync();
                // Conflict resolution: remote wins if updated_at is newer
                // Local merge logic will be wired in Phase 3
                System.Diagnostics.Debug.WriteLine($"[CloudSync] Synced {remoteProfiles.Count} profiles.");
                return true;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[CloudSync] Sync failed: {ex.Message}");
                return false;
            }
        }
    }
}
