using System.ComponentModel.DataAnnotations;

namespace RR.MRO.Api.DTOs;

public record CreateVarianceRequestDto(
    [Required, StringLength(200, MinimumLength = 1)] string Title,
    [Required, StringLength(5000, MinimumLength = 1)] string Description,
    [Required, StringLength(100)] string AnomalyType,
    [Required, StringLength(100)] string EngineType,
    [Required, StringLength(50)] string EngineSerialNumber,
    [StringLength(50)] string? PartNumber,
    [StringLength(20)] string? AircraftRegistration,
    [Required, StringLength(20)] string Priority,
    [Required, StringLength(100)] string SubmittedBy,
    [Required, StringLength(100)] string MroOrganisation,
    [StringLength(200)] string? MroSiteLocation,
    [StringLength(50)] string? ShopVisitReference
);

public record UpdateVarianceRequestDto(
    [StringLength(200)] string? Title,
    [StringLength(5000)] string? Description,
    [StringLength(50)] string? Status,
    [StringLength(20)] string? Priority,
    [StringLength(100)] string? AssignedTo
);

public record VarianceRequestSummaryDto(
    Guid Id,
    string ReferenceNumber,
    string Title,
    string AnomalyType,
    string EngineType,
    string Status,
    string Priority,
    string MroOrganisation,
    string SubmittedBy,
    string? AssignedTo,
    int AttachmentCount,
    int CommentCount,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record DashboardStatsDto(
    int TotalRequests,
    int Submitted,
    int UnderReview,
    int TriageComplete,
    int SpecialistOpinion,
    int RecommendationDrafted,
    int DocumentAuthored,
    int Completed,
    double AvgResolutionDays,
    Dictionary<string, int> ByEngineType,
    Dictionary<string, int> ByMroOrganisation,
    Dictionary<string, int> ByPriority,
    List<MonthlyTrendDto> MonthlyTrend
);

public record MonthlyTrendDto(
    string Month,
    int Submitted,
    int Resolved
);

public record TriageRequestDto(
    Guid RequestId
);

public record DocumentAuthorDto(
    Guid RequestId,
    [Required, StringLength(100)] string AuthoredBy
);

public record AddCommentDto(
    [Required, StringLength(2000, MinimumLength = 1)] string Content,
    [Required, StringLength(100)] string Author,
    [Required, StringLength(100)] string AuthorRole,
    bool IsInternal
);

public record PagedResult<T>(
    List<T> Items,
    int TotalCount,
    int Page,
    int PageSize
);

public record UpdateStatusRequest(
    [Required, StringLength(50)] string Status,
    [Required, StringLength(100)] string Actor
);
