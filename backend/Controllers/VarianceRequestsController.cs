using Microsoft.AspNetCore.Mvc;
using RR.MRO.Api.DTOs;
using RR.MRO.Api.Services;

namespace RR.MRO.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VarianceRequestsController : ControllerBase
{
    private readonly VarianceRequestService _service;

    public VarianceRequestsController(VarianceRequestService service)
    {
        _service = service;
    }

    [HttpGet]
    public ActionResult<PagedResult<VarianceRequestSummaryDto>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null,
        [FromQuery] string? priority = null,
        [FromQuery] string? engineType = null,
        [FromQuery] string? mroOrganisation = null,
        [FromQuery] string? search = null,
        [FromQuery] string? sortBy = null,
        [FromQuery] string? sortDir = "desc")
    {
        var result = _service.GetAll(page, pageSize, status, priority, engineType, mroOrganisation, search, sortBy, sortDir);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public ActionResult GetById(Guid id)
    {
        var request = _service.GetById(id);
        if (request == null) return NotFound();
        return Ok(request);
    }

    [HttpPost]
    public ActionResult Create([FromBody] CreateVarianceRequestDto dto)
    {
        try
        {
            var request = _service.Create(dto);
            return CreatedAtAction(nameof(GetById), new { id = request.Id }, request);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPatch("{id:guid}/status")]
    public ActionResult UpdateStatus(Guid id, [FromBody] UpdateStatusRequest body)
    {
        var request = _service.UpdateStatus(id, body.Status, body.Actor);
        if (request == null) return NotFound();
        return Ok(request);
    }

    [HttpPost("{id:guid}/comments")]
    public ActionResult AddComment(Guid id, [FromBody] AddCommentDto dto)
    {
        var comment = _service.AddComment(id, dto);
        if (comment == null) return NotFound();
        return Created($"/api/variancerequests/{id}/comments/{comment.Id}", comment);
    }

    [HttpGet("stats")]
    public ActionResult<DashboardStatsDto> GetStats()
    {
        return Ok(_service.GetStats());
    }

    [HttpGet("engine-types")]
    public ActionResult GetEngineTypes() => Ok(Data.SeedData.EngineTypes);

    [HttpGet("mro-organisations")]
    public ActionResult GetMroOrganisations() => Ok(Data.SeedData.MroOrganisations);

    [HttpGet("anomaly-types")]
    public ActionResult GetAnomalyTypes() => Ok(Data.SeedData.AnomalyTypes);
}

public record UpdateStatusRequest(string Status, string Actor);
