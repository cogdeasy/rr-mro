namespace RR.MRO.Api.DTOs;

public record CreateVarianceRequestDto(
    string Title,
    string Description,
    string AnomalyType,
    string EngineType,
    string EngineSerialNumber,
    string? PartNumber,
    string? AircraftRegistration,
    string Priority,
    string SubmittedBy,
    string MroOrganisation,
    string? MroSiteLocation,
    string? ShopVisitReference
);

public record UpdateVarianceRequestDto(
    string? Title,
    string? Description,
    string? Status,
    string? Priority,
    string? AssignedTo
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
    string AuthoredBy
);

public record AddCommentDto(
    string Content,
    string Author,
    string AuthorRole,
    bool IsInternal
);

public record PagedResult<T>(
    List<T> Items,
    int TotalCount,
    int Page,
    int PageSize
);

public record UpdateStatusRequest(
    string Status,
    string Actor
);
