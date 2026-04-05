using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Postgrest.Attributes;
using Postgrest.Models;

namespace Primora.Cloud
{
    [Table("profiles")]
    public class ProfileEntity : BaseModel
    {
        [PrimaryKey("id", false)]
        [JsonPropertyName("id")]
        public Guid Id { get; set; }

        [Column("user_id")]
        [JsonPropertyName("user_id")]
        public Guid UserId { get; set; }

        [Column("profile_name")]
        [JsonPropertyName("profile_name")]
        public string ProfileName { get; set; } = string.Empty;

        [Column("controller_type")]
        [JsonPropertyName("controller_type")]
        public string ControllerType { get; set; } = string.Empty;

        [Column("neuro_kinetic_config")]
        [JsonPropertyName("neuro_kinetic_config")]
        public Dictionary<string, object> NeuroKineticConfig { get; set; } = new();

        [Column("created_at")]
        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        [JsonPropertyName("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }
}
