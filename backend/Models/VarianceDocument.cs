using System.ComponentModel.DataAnnotations;

namespace RR.MRO.Api.Models;

public class VarianceDocument
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid RequestId { get; set; }

    [Required]
    public string DocumentNumber { get; set; } = string.Empty;

    [Required]
    public string Title { get; set; } = string.Empty;

    public DocumentStatus Status { get; set; } = DocumentStatus.Draft;

    public int Version { get; set; } = 1;

    public string? ProblemStatement { get; set; }

    public string? TechnicalAnalysis { get; set; }

    public string? SafetyAssessment { get; set; }

    public string? ProposedDisposition { get; set; }

    public string? RegulatoryReferences { get; set; }

    public string? SpecialistRecommendation { get; set; }

    public string? ApplicableRegulations { get; set; }

    public double AiGeneratedPercentage { get; set; }

    public string? BlobUrl { get; set; }

    public string? AuthoredBy { get; set; }

    public string? ReviewedBy { get; set; }

    public string? ApprovedBy { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ApprovedAt { get; set; }

    public List<DocumentSignature> Signatures { get; set; } = new();
}

public class DocumentSignature
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid DocumentId { get; set; }

    [Required]
    public string SignatoryName { get; set; } = string.Empty;

    [Required]
    public string SignatoryRole { get; set; } = string.Empty;

    public string? DigitalSignatureHash { get; set; }

    public DateTime? SignedAt { get; set; }
}

public enum DocumentStatus
{
    Draft,
    InReview,
    RevisionRequired,
    Approved,
    Published,
    Superseded
}
