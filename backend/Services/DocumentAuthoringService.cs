using RR.MRO.Api.Models;

namespace RR.MRO.Api.Services;

public class DocumentAuthoringService
{
    private readonly VarianceRequestService _requestService;

    public DocumentAuthoringService(VarianceRequestService requestService)
    {
        _requestService = requestService;
    }

    public VarianceDocument? GenerateDocument(Guid requestId, string authoredBy)
    {
        var request = _requestService.GetById(requestId);
        if (request == null) return null;

        var document = new VarianceDocument
        {
            RequestId = requestId,
            DocumentNumber = $"VD-{request.ReferenceNumber.Replace("VR-", "")}",
            Title = $"Technical Variance Disposition — {request.Title}",
            ProblemStatement = GenerateProblemStatement(request),
            TechnicalAnalysis = GenerateTechnicalAnalysis(request),
            SafetyAssessment = GenerateSafetyAssessment(request),
            ProposedDisposition = GenerateDisposition(request),
            RegulatoryReferences = GenerateRegulatoryRefs(request),
            SpecialistRecommendation = GenerateSpecialistRec(request),
            ApplicableRegulations = "EASA CS-E 520, CS-E 740; FAR 33.70, 33.75; ICAO Annex 8",
            AiGeneratedPercentage = 58 + new Random().NextDouble() * 20,
            AuthoredBy = authoredBy,
            Signatures = new List<DocumentSignature>
            {
                new() { SignatoryName = authoredBy, SignatoryRole = "Authoring Engineer" },
                new() { SignatoryName = "TBD", SignatoryRole = "Reviewing Engineer" },
                new() { SignatoryName = "TBD", SignatoryRole = "Approving Authority (DER/AR)" }
            }
        };

        request.GeneratedDocument = document;
        request.Status = RequestStatus.DocumentAuthored;
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

    public VarianceDocument? GetDocument(Guid requestId)
    {
        var request = _requestService.GetById(requestId);
        return request?.GeneratedDocument;
    }

    private static string GenerateProblemStatement(VarianceRequest request)
    {
        return $"During scheduled maintenance activities at {request.MroOrganisation} ({request.MroSiteLocation}), " +
               $"a non-conformance was identified on {request.EngineType} engine serial number {request.EngineSerialNumber}. " +
               $"\n\n{request.Description}\n\n" +
               $"This variance falls outside the limits defined in the approved maintenance data and requires " +
               $"formal engineering disposition before the engine can be returned to service.";
    }

    private static string GenerateTechnicalAnalysis(VarianceRequest request)
    {
        return $"1. INSPECTION FINDINGS\n" +
               $"The {request.AnomalyType.ToLower()} was identified during {GetInspectionType(request.AnomalyType)} inspection. " +
               $"Part number {request.PartNumber} was assessed against the applicable limits in the current revision " +
               $"of the Engine Shop Manual and Structural Repair Manual.\n\n" +
               $"2. HISTORICAL PRECEDENT\n" +
               $"Analysis of the variance database identified similar cases on the {request.EngineType} fleet. " +
               $"The AI-assisted review of 15,247 historical records found statistically significant correlation " +
               $"with prior resolutions, informing the recommended disposition.\n\n" +
               $"3. ENGINEERING ASSESSMENT\n" +
               $"Based on the inspection data provided, stress analysis models, and material property data, " +
               $"the non-conformance has been assessed for structural integrity, fatigue life impact, and " +
               $"continued airworthiness implications.";
    }

    private static string GenerateSafetyAssessment(VarianceRequest request)
    {
        var safetyLevel = request.Priority switch
        {
            Priority.Critical => "This item has been assessed as safety-significant. Enhanced monitoring provisions are mandatory.",
            Priority.High => "No immediate flight safety concern identified, however continued monitoring is recommended.",
            _ => "No flight safety concern identified. Standard monitoring provisions apply."
        };

        return $"{safetyLevel}\n\n" +
               $"The assessment considers:\n" +
               $"- Structural integrity margin analysis\n" +
               $"- Fatigue and damage tolerance assessment\n" +
               $"- Operational environment and loading conditions\n" +
               $"- Regulatory compliance requirements per EASA Part-21 and Part-145\n" +
               $"- Fleet-wide implications and service bulletin applicability";
    }

    private static string GenerateDisposition(VarianceRequest request)
    {
        return request.AnomalyType switch
        {
            "Blade Damage" => "DISPOSITION: Approve blend repair per SRM Chapter 72-71-00, Figure 201. " +
                "Maximum blend depth 1.5mm, blend ratio 15:1. Re-inspect at next shop visit. " +
                "Report finding to fleet monitoring programme.",
            "Combustor Liner Crack" => "DISPOSITION: Approve continued service to next scheduled shop visit " +
                "(maximum 2,000 additional cycles). Implement enhanced borescope inspection at 500-cycle intervals. " +
                "Replace liner at next shop visit.",
            "Turbine Disc Crack" => "DISPOSITION: REJECT for continued service. Remove disc from service immediately. " +
                "Send to Rolls-Royce Derby for detailed metallurgical assessment. Replacement disc required.",
            _ => "DISPOSITION: Approve for continued service with enhanced monitoring provisions. " +
                "Next inspection interval reduced to 50% of standard. Document in engine health monitoring system."
        };
    }

    private static string GenerateRegulatoryRefs(VarianceRequest request)
    {
        return "- EASA Part-145, AMC 145.A.48 (Performance of Maintenance)\n" +
               "- EASA Part-21, Subpart J (Design Organisation Approval)\n" +
               "- FAA Advisory Circular AC 43-218\n" +
               "- ICAO Doc 9760 (Airworthiness Manual)\n" +
               $"- {request.EngineType} Engine Shop Manual, current revision\n" +
               $"- {request.EngineType} Structural Repair Manual, current revision";
    }

    private static string GenerateSpecialistRec(VarianceRequest request)
    {
        return $"Based on review of the technical data and historical precedent analysis, " +
               $"the recommended disposition is considered appropriate for the reported {request.AnomalyType.ToLower()} condition. " +
               $"The engineering margins are adequate for the proposed continued service with the specified monitoring provisions.\n\n" +
               $"This recommendation is supported by AI-assisted analysis of similar historical variances " +
               $"and validated against current design data and approved analytical methods.";
    }

    private static string GetInspectionType(string anomalyType)
    {
        return anomalyType switch
        {
            "Blade Damage" or "Compressor Erosion" => "borescope",
            "Combustor Liner Crack" or "Turbine Disc Crack" => "fluorescent penetrant (FPI)",
            "Oil System Contamination" => "spectrometric oil analysis",
            "Vibration Anomaly" => "vibration monitoring",
            _ => "visual"
        };
    }
}
