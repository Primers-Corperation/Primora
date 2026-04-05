using System;
using System.Text.Json.Serialization;
using Postgrest.Attributes;
using Postgrest.Models;

namespace Primora.Cloud
{
    [Table("marketplace_profiles")]
    public class MarketplaceProfile : BaseModel
    {
        [PrimaryKey("id", false)]
        [JsonPropertyName("id")]
        public Guid Id { get; set; }

        [Column("creator_user_id")]
        [JsonPropertyName("creator_user_id")]
        public Guid CreatorUserId { get; set; }

        [Column("creator_name")]
        [JsonPropertyName("creator_name")]
        public string CreatorName { get; set; } = string.Empty;

        [Column("profile_name")]
        [JsonPropertyName("profile_name")]
        public string ProfileName { get; set; } = string.Empty;

        [Column("controller_type")]
        [JsonPropertyName("controller_type")]
        public string ControllerType { get; set; } = string.Empty;

        [Column("description")]
        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;

        [Column("price")]
        [JsonPropertyName("price")]
        public decimal Price { get; set; } = 0;

        [Column("download_count")]
        [JsonPropertyName("download_count")]
        public int DownloadCount { get; set; } = 0;

        [Column("created_at")]
        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
