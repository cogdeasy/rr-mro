using Microsoft.AspNetCore.Mvc;
using RR.MRO.Api.DTOs;
using RR.MRO.Api.Services;

namespace RR.MRO.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly DocumentAuthoringService _documentService;

    public DocumentsController(DocumentAuthoringService documentService)
    {
        _documentService = documentService;
    }

    [HttpPost("generate")]
    public ActionResult GenerateDocument([FromBody] DocumentAuthorDto dto)
    {
        var document = _documentService.GenerateDocument(dto.RequestId, dto.AuthoredBy);
        if (document == null) return NotFound();
        return Ok(document);
    }

    [HttpGet("{requestId:guid}")]
    public ActionResult GetDocument(Guid requestId)
    {
        var document = _documentService.GetDocument(requestId);
        if (document == null) return NotFound();
        return Ok(document);
    }
}
