using System.ComponentModel.DataAnnotations;

namespace RR.MRO.Api.Models;

public class VarianceRequest
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string ReferenceNumber { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public string AnomalyType { get; set; } = string.Empty;

    [Required]
    public string EngineType { get; set; } = string.Empty;

    [Required]
    public string EngineSerialNumber { get; set; } = string.Empty;

    public string? PartNumber { get; set; }

    public string? AircraftRegistration { get; set; }

    [Required]
    public RequestStatus Status { get; set; } = RequestStatus.Submitted;

    [Required]
    public Priority Priority { get; set; } = Priority.Medium;

    [Required]
    public string SubmittedBy { get; set; } = string.Empty;

    public string? AssignedTo { get; set; }

    [Required]
    public string MroOrganisation { get; set; } = string.Empty;

    public string? MroSiteLocation { get; set; }

    public string? ShopVisitReference { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ResolvedAt { get; set; }

    public List<Attachment> Attachments { get; set; } = new();
    public List<Comment> Comments { get; set; } = new();
    public List<AuditEntry> AuditTrail { get; set; } = new();
    public TriageResult? TriageResult { get; set; }
    public VarianceDocument? GeneratedDocument { get; set; }
}

public enum RequestStatus
{
    Submitted,
    UnderReview,
    TriageComplete,
    SpecialistOpinion,
    RecommendationDrafted,
    DocumentAuthored,
    Approved,
    Completed,
    Closed,
    Rejected
}

public enum Priority
{
    Low,
    Medium,
    High,
    Critical
}
