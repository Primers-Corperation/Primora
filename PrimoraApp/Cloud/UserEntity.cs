using System;
using System.Text.Json.Serialization;
using Postgrest.Attributes;
using Postgrest.Models;

namespace Primora.Cloud
{
    [Table("users")]
    public class UserEntity : BaseModel
    {
        [PrimaryKey("id", false)]
        [JsonPropertyName("id")]
        public Guid Id { get; set; }

        [Column("email")]
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [Column("license_tier")]
        [JsonPropertyName("license_tier")]
        public string LicenseTier { get; set; } = "Free";

        [Column("created_at")]
        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
