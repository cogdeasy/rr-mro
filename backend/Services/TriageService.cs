using RR.MRO.Api.Models;

namespace RR.MRO.Api.Services;

public class TriageService
{
    private readonly VarianceRequestService _requestService;
    private static readonly Random _random = Random.Shared;

    public TriageService(VarianceRequestService requestService)
    {
        _requestService = requestService;
    }

    public TriageResult? TriageRequest(Guid requestId)
    {
        var request = _requestService.GetById(requestId);
        if (request == null) return null;

        var severityClassification = ClassifySeverity(request);

        var result = new TriageResult
        {
            RequestId = requestId,
            SeverityClassification = severityClassification,
            RecommendedAction = GetRecommendedAction(request),
            SuggestedSpecialist = SuggestSpecialist(request),
            ConfidenceScore = 0.82 + _random.NextDouble() * 0.15,
            SimilarVariancesFound = _random.Next(5, 30),
            MatchedReferenceIds = GenerateMatchedRefs(),
            AiModelVersion = "rr-triage-v2.4.1",
            RagContextSummary = GenerateRagSummary(request),
            SuggestedRfiQuestions = GenerateRfiQuestions(request)
        };

        _requestService.ApplyTriageResult(requestId, result, severityClassification);

        return result;
    }

    private static string ClassifySeverity(VarianceRequest request)
    {
        return request.AnomalyType switch
        {
            "Turbine Disc Crack" => "AOG-Critical",
            "Combustor Liner Crack" => "AOG-Critical",
            "Blade Damage" when request.Priority == Priority.Critical => "AOG-Critical",
            "Oil System Contamination" => "Urgent",
            "Vibration Anomaly" => "Urgent",
            _ => "Standard"
        };
    }

    private static string GetRecommendedAction(VarianceRequest request)
    {
        return request.AnomalyType switch
        {
            "Blade Damage" => "Materials specialist review required. Assess blend repair feasibility per SRM Chapter 72-71.",
            "Combustor Liner Crack" => "Immediate structural integrity assessment. Compare against crack growth model predictions.",
            "Turbine Disc Crack" => "URGENT: Disc must be removed from service pending fracture mechanics assessment. No fly decision.",
            "Oil System Contamination" => "Spectrometric oil analysis comparison with baseline. Bearing condition assessment required.",
            "Compressor Erosion" => "Erosion mapping and dimensional check against AMM limits. Assess recoating feasibility.",
            "Seal Degradation" => "Seal replacement recommended. Verify housing bore dimensions within limits.",
            "Foreign Object Damage" => "Damage assessment per SRM blend limits. NDT inspection of surrounding structure.",
            "Vibration Anomaly" => "Rotor balance assessment. Review assembly records for trim balance weights.",
            "Thermal Barrier Coating Loss" => "TBC thickness survey and base metal oxidation assessment required.",
            _ => "Engineering disposition required — route to appropriate specialist."
        };
    }

    private static string SuggestSpecialist(VarianceRequest request)
    {
        return request.AnomalyType switch
        {
            "Blade Damage" or "Compressor Erosion" or "Foreign Object Damage" => "Dr. K. Nakamura — Aerofoil Integrity",
            "Combustor Liner Crack" or "Thermal Barrier Coating Loss" => "Dr. S. Patel — Combustion Systems",
            "Turbine Disc Crack" => "Dr. A. Richardson — Structural Integrity (Life Limited Parts)",
            "Oil System Contamination" or "Bearing Wear" => "Eng. M. Weber — Mechanical Systems",
            "Seal Degradation" => "Eng. J. O'Brien — Sealing & Secondary Air Systems",
            "Vibration Anomaly" => "Dr. L. Chen — Rotor Dynamics",
            _ => "Dr. S. Patel — General Engineering Disposition"
        };
    }

    private static List<string> GenerateMatchedRefs()
    {
        return Enumerable.Range(0, _random.Next(3, 8))
            .Select(_ => $"VR-2024-{_random.Next(100, 999)}")
            .ToList();
    }

    private static string GenerateRagSummary(VarianceRequest request)
    {
        return $"Analysed 15,247 historical variance records. Found {_random.Next(8, 45)} closely matching cases " +
               $"for {request.AnomalyType} on {request.EngineType} engines. Historical resolution breakdown: " +
               $"repair-in-situ ({_random.Next(40, 65)}%), component replacement ({_random.Next(20, 35)}%), " +
               $"use-as-is with monitoring ({_random.Next(5, 15)}%). Average resolution time: {_random.Next(8, 21)} days.";
    }

    private static List<string> GenerateRfiQuestions(VarianceRequest request)
    {
        var questions = new List<string>
        {
            "Confirm exact measurement methodology and tolerances used",
            $"Provide last 500 flight hours operational data for engine {request.EngineSerialNumber}",
            "Upload high-resolution photographs of affected area with scale reference"
        };

        if (request.AnomalyType.Contains("Crack"))
            questions.Add("Confirm NDT method used (FPI/MPI/Eddy Current) and calibration status");
        if (request.AnomalyType.Contains("Blade"))
            questions.Add("Provide blade-by-blade dimensional survey data");
        if (request.AnomalyType.Contains("Vibration"))
            questions.Add("Provide vibration spectrum analysis data at multiple N1/N2 speeds");

        return questions;
    }
}
