using RR.MRO.Api.DTOs;
using RR.MRO.Api.Models;
using RR.MRO.Api.Data;

namespace RR.MRO.Api.Services;

public class VarianceRequestService
{
    private readonly List<VarianceRequest> _requests;
    private readonly object _lock = new();

    public VarianceRequestService()
    {
        _requests = SeedData.GenerateRequests();
    }

    public PagedResult<VarianceRequestSummaryDto> GetAll(
        int page = 1, int pageSize = 20,
        string? status = null, string? priority = null,
        string? engineType = null, string? mroOrganisation = null,
        string? search = null, string? sortBy = null, string? sortDir = "desc")
    {
      lock (_lock)
      {
        var query = _requests.AsEnumerable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(r => r.Status.ToString().Equals(status, StringComparison.OrdinalIgnoreCase));
        if (!string.IsNullOrEmpty(priority))
            query = query.Where(r => r.Priority.ToString().Equals(priority, StringComparison.OrdinalIgnoreCase));
        if (!string.IsNullOrEmpty(engineType))
            query = query.Where(r => r.EngineType.Equals(engineType, StringComparison.OrdinalIgnoreCase));
        if (!string.IsNullOrEmpty(mroOrganisation))
            query = query.Where(r => r.MroOrganisation.Equals(mroOrganisation, StringComparison.OrdinalIgnoreCase));
        if (!string.IsNullOrEmpty(search))
            query = query.Where(r =>
                r.Title.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                r.ReferenceNumber.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                r.Description.Contains(search, StringComparison.OrdinalIgnoreCase));

        query = sortBy?.ToLower() switch
        {
            "reference" => sortDir == "asc" ? query.OrderBy(r => r.ReferenceNumber) : query.OrderByDescending(r => r.ReferenceNumber),
            "priority" => sortDir == "asc" ? query.OrderBy(r => r.Priority) : query.OrderByDescending(r => r.Priority),
            "status" => sortDir == "asc" ? query.OrderBy(r => r.Status) : query.OrderByDescending(r => r.Status),
            _ => sortDir == "asc" ? query.OrderBy(r => r.CreatedAt) : query.OrderByDescending(r => r.CreatedAt)
        };

        var totalCount = query.Count();
        var items = query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(r => new VarianceRequestSummaryDto(
                r.Id, r.ReferenceNumber, r.Title, r.AnomalyType,
                r.EngineType, r.Status.ToString(), r.Priority.ToString(),
                r.MroOrganisation, r.SubmittedBy, r.AssignedTo,
                r.Attachments.Count, r.Comments.Count,
                r.CreatedAt, r.UpdatedAt
            )).ToList();

        return new PagedResult<VarianceRequestSummaryDto>(items, totalCount, page, pageSize);
      }
    }

    public VarianceRequest? GetById(Guid id) { lock (_lock) { return _requests.FirstOrDefault(r => r.Id == id); } }

    public VarianceRequest Create(CreateVarianceRequestDto dto)
    {
      lock (_lock)
      {
        var request = new VarianceRequest
        {
            ReferenceNumber = $"VR-2025-{_requests.Count + 1001}",
            Title = dto.Title,
            Description = dto.Description,
            AnomalyType = dto.AnomalyType,
            EngineType = dto.EngineType,
            EngineSerialNumber = dto.EngineSerialNumber,
            PartNumber = dto.PartNumber,
            AircraftRegistration = dto.AircraftRegistration,
            Priority = Enum.TryParse<Priority>(dto.Priority, true, out var parsedPriority)
                ? parsedPriority
                : throw new ArgumentException($"Invalid priority: {dto.Priority}"),
            SubmittedBy = dto.SubmittedBy,
            MroOrganisation = dto.MroOrganisation,
            MroSiteLocation = dto.MroSiteLocation,
            ShopVisitReference = dto.ShopVisitReference
        };

        request.AuditTrail.Add(new AuditEntry
        {
            Action = "Created",
            Details = $"Variance request {request.ReferenceNumber} submitted",
            Actor = dto.SubmittedBy,
            ActorRole = "MRO Engineer",
            RequestId = request.Id
        });

        _requests.Add(request);
        return request;
      }
    }

    public VarianceRequest? UpdateStatus(Guid id, string newStatus, string actor)
    {
      lock (_lock)
      {
        var request = _requests.FirstOrDefault(r => r.Id == id);
        if (request == null) return null;

        if (!Enum.TryParse<RequestStatus>(newStatus, true, out var parsedStatus))
            return null;

        var oldStatus = request.Status.ToString();
        request.Status = parsedStatus;
        request.UpdatedAt = DateTime.UtcNow;

        request.AuditTrail.Add(new AuditEntry
        {
            Action = "StatusChanged",
            Details = $"Status changed from {oldStatus} to {newStatus}",
            Actor = actor,
            PreviousValue = oldStatus,
            NewValue = newStatus,
            RequestId = request.Id
        });

        return request;
      }
    }

    public Comment? AddComment(Guid requestId, AddCommentDto dto)
    {
      lock (_lock)
      {
        var request = _requests.FirstOrDefault(r => r.Id == requestId);
        if (request == null) return null;

        var comment = new Comment
        {
            Content = dto.Content,
            Author = dto.Author,
            AuthorRole = dto.AuthorRole,
            IsInternal = dto.IsInternal,
            RequestId = requestId
        };

        request.Comments.Add(comment);
        return comment;
      }
    }

    public VarianceRequest? ApplyTriageResult(Guid requestId, TriageResult result, string severityClassification)
    {
      lock (_lock)
      {
        var request = _requests.FirstOrDefault(r => r.Id == requestId);
        if (request == null) return null;

        request.TriageResult = result;

        if (request.Status == RequestStatus.Submitted || request.Status == RequestStatus.UnderReview)
        {
            var oldStatus = request.Status.ToString();
            request.Status = RequestStatus.TriageComplete;
            request.UpdatedAt = DateTime.UtcNow;

            request.AuditTrail.Add(new AuditEntry
            {
                Action = "StatusChanged",
                Details = $"AI Triage completed. Status changed from {oldStatus} to TriageComplete. Severity: {severityClassification}",
                Actor = "System (Triage Agent)",
                PreviousValue = oldStatus,
                NewValue = "TriageComplete",
                RequestId = requestId
            });
        }

        return request;
      }
    }

    public VarianceDocument? ApplyGeneratedDocument(Guid requestId, VarianceDocument document, string authoredBy)
    {
      lock (_lock)
      {
        var request = _requests.FirstOrDefault(r => r.Id == requestId);
        if (request == null) return null;

        request.GeneratedDocument = document;
        if (request.Status < RequestStatus.DocumentAuthored)
        {
            request.Status = RequestStatus.DocumentAuthored;
        }
        request.UpdatedAt = DateTime.UtcNow;

        request.AuditTrail.Add(new AuditEntry
        {
            Action = "DocumentGenerated",
            Details = $"Variance document {document.DocumentNumber} generated ({document.AiGeneratedPercentage:F1}% AI-assisted)",
            Actor = authoredBy,
            ActorRole = "Lead Engineer",
            RequestId = requestId
        });

        return document;
      }
    }

    public DashboardStatsDto GetStats()
    {
      lock (_lock)
      {
        var now = DateTime.UtcNow;
        var completedRequests = _requests.Where(r => r.ResolvedAt.HasValue).ToList();
        var avgDays = completedRequests.Any()
            ? completedRequests.Average(r => (r.ResolvedAt!.Value - r.CreatedAt).TotalDays)
            : 0;

        return new DashboardStatsDto(
            TotalRequests: _requests.Count,
            Submitted: _requests.Count(r => r.Status == RequestStatus.Submitted),
            UnderReview: _requests.Count(r => r.Status == RequestStatus.UnderReview),
            SpecialistOpinion: _requests.Count(r => r.Status == RequestStatus.SpecialistOpinion),
            RecommendationDrafted: _requests.Count(r => r.Status == RequestStatus.RecommendationDrafted),
            DocumentAuthored: _requests.Count(r => r.Status == RequestStatus.DocumentAuthored),
            Completed: _requests.Count(r => r.Status == RequestStatus.Completed),
            AvgResolutionDays: Math.Round(avgDays, 1),
            ByEngineType: _requests.GroupBy(r => r.EngineType).ToDictionary(g => g.Key, g => g.Count()),
            ByMroOrganisation: _requests.GroupBy(r => r.MroOrganisation).ToDictionary(g => g.Key, g => g.Count()),
            ByPriority: _requests.GroupBy(r => r.Priority.ToString()).ToDictionary(g => g.Key, g => g.Count()),
            MonthlyTrend: GetMonthlyTrend()
        );
      }
    }

    private List<MonthlyTrendDto> GetMonthlyTrend()
    {
        return new List<MonthlyTrendDto>
        {
            new("Oct 2024", 18, 15),
            new("Nov 2024", 22, 19),
            new("Dec 2024", 14, 12),
            new("Jan 2025", 25, 20),
            new("Feb 2025", 19, 17),
            new("Mar 2025", 12, 8)
        };
    }
}
