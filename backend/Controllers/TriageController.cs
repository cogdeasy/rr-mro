using Microsoft.AspNetCore.Mvc;
using RR.MRO.Api.Services;

namespace RR.MRO.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TriageController : ControllerBase
{
    private readonly TriageService _triageService;

    public TriageController(TriageService triageService)
    {
        _triageService = triageService;
    }

    [HttpPost("{requestId:guid}")]
    public ActionResult TriageRequest(Guid requestId)
    {
        var result = _triageService.TriageRequest(requestId);
        if (result == null) return NotFound();
        return Ok(result);
    }
}
