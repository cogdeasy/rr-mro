using System.ComponentModel.DataAnnotations;

namespace RR.MRO.Api.Models;

public class AuditEntry
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string Action { get; set; } = string.Empty;

    [Required]
    public string Details { get; set; } = string.Empty;

    [Required]
    public string Actor { get; set; } = string.Empty;

    public string? ActorRole { get; set; }

    public string? PreviousValue { get; set; }

    public string? NewValue { get; set; }

    public Guid RequestId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
