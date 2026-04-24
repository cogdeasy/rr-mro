using System.ComponentModel.DataAnnotations;

namespace RR.MRO.Api.Models;

public class TriageResult
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid RequestId { get; set; }

    [Required]
    public string SeverityClassification { get; set; } = string.Empty;

    [Required]
    public string RecommendedAction { get; set; } = string.Empty;

    public string? SuggestedSpecialist { get; set; }

    public double ConfidenceScore { get; set; }

    public int SimilarVariancesFound { get; set; }

    public List<string> MatchedReferenceIds { get; set; } = new();

    public string? AiModelVersion { get; set; }

    public string? RagContextSummary { get; set; }

    public List<string> SuggestedRfiQuestions { get; set; } = new();

    public DateTime TriagedAt { get; set; } = DateTime.UtcNow;
}
