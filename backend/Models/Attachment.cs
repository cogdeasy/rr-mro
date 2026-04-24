using System.ComponentModel.DataAnnotations;

namespace RR.MRO.Api.Models;

public class Attachment
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string FileName { get; set; } = string.Empty;

    [Required]
    public string ContentType { get; set; } = string.Empty;

    public long FileSize { get; set; }

    [Required]
    public string BlobUrl { get; set; } = string.Empty;

    public string? Description { get; set; }

    public AttachmentCategory Category { get; set; } = AttachmentCategory.Other;

    public Guid RequestId { get; set; }

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    public string UploadedBy { get; set; } = string.Empty;
}

public enum AttachmentCategory
{
    EngineeringDrawing,
    Photograph,
    BoroscopeImage,
    TechnicalPublication,
    InspectionReport,
    Other
}
