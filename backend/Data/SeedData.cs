using RR.MRO.Api.Models;

namespace RR.MRO.Api.Data;

public static class SeedData
{
    public static readonly string[] EngineTypes =
    {
        "Trent 1000", "Trent XWB", "Trent 7000", "Trent 900", "Trent 500", "BR725"
    };

    public static readonly string[] MroOrganisations =
    {
        "Lufthansa Technik", "SIA Engineering", "Delta TechOps",
        "AFI KLM E&M", "ST Aerospace", "HAECO",
        "Turkish Technic", "Rolls-Royce Derby"
    };

    public static readonly string[] AnomalyTypes =
    {
        "Blade Damage", "Bearing Wear", "Seal Degradation",
        "Combustor Liner Crack", "Compressor Erosion", "Turbine Disc Crack",
        "Oil System Contamination", "Vibration Anomaly",
        "Foreign Object Damage", "Thermal Barrier Coating Loss"
    };

    public static readonly string[] Specialists =
    {
        "Dr. S. Patel", "Dr. A. Richardson", "Eng. M. Weber",
        "Dr. K. Nakamura", "Eng. J. O'Brien", "Dr. L. Chen"
    };

    public static List<VarianceRequest> GenerateRequests()
    {
        var requests = new List<VarianceRequest>();
        var random = new Random(42);
        var baseDate = new DateTime(2025, 1, 15, 0, 0, 0, DateTimeKind.Utc);

        var items = new (string Title, string Desc, string Anomaly, string Engine, string Mro, RequestStatus Status, Priority Pri, int DaysAgo)[]
        {
            ("HPT Blade Tip Liberation — Trent XWB SN-7842", "During scheduled borescope inspection at 3,200 cycles, liberation of approximately 12mm tip section identified on Stage 1 HPT blade position 14. Adjacent blades show minor tip rub evidence. Engine vibration data within limits but trending upward.", "Blade Damage", "Trent XWB", "Lufthansa Technik", RequestStatus.Submitted, Priority.Critical, 2),
            ("IPC Stage 3 Leading Edge Erosion Beyond AMM Limits", "Intermediate Pressure Compressor Stage 3 blades showing leading edge erosion depths exceeding AMM Chapter 72-33-00 limits by 0.8mm on 6 of 48 blades. Pattern consistent with sand/dust ingestion. Engine SN-4521 operating Middle East routes.", "Compressor Erosion", "Trent 900", "SIA Engineering", RequestStatus.UnderReview, Priority.High, 5),
            ("No.3 Bearing Oil Scavenge Filter Contamination", "Elevated metallic particle count detected in No.3 bearing scavenge oil filter during routine MRO inspection. Spectrometric analysis shows elevated Fe and Cr content. Bearing temperatures nominal during last 500 flight hours.", "Oil System Contamination", "Trent 1000", "Delta TechOps", RequestStatus.SpecialistOpinion, Priority.High, 12),
            ("Combustor Liner Thermal Fatigue Cracking — Panel 4", "Circumferential thermal fatigue crack identified on combustor inner liner Panel 4, measuring 45mm in length. Crack orientation perpendicular to cooling hole row. Crack depth assessment by FPI indicates surface-breaking only. Engine at 8,400 cycles.", "Combustor Liner Crack", "Trent XWB", "AFI KLM E&M", RequestStatus.RecommendationDrafted, Priority.Critical, 20),
            ("Fan Blade Foreign Object Damage — Leading Edge", "FOD impact damage on Fan Blade position 7 during ground operations at DXB. Damage extends 15mm along leading edge with 2mm depth. No secondary damage to adjacent blades or fan case. Blade is titanium hollow construction.", "Foreign Object Damage", "Trent 7000", "Turkish Technic", RequestStatus.Completed, Priority.Medium, 35),
            ("TBC Spallation on HPT Nozzle Guide Vanes", "Thermal Barrier Coating spallation observed on 8 of 32 Stage 1 HPT Nozzle Guide Vanes during scheduled shop visit. Affected area approximately 30% of airfoil surface. Base metal shows early oxidation in spalled regions.", "Thermal Barrier Coating Loss", "Trent 900", "HAECO", RequestStatus.DocumentAuthored, Priority.High, 15),
            ("IP Turbine Disc Rim Crack Indication — Stage 2", "Fluorescent Penetrant Inspection during piece-part strip revealed linear indication on Stage 2 IP Turbine disc rim, forward face. Indication measures 8mm at circumferential orientation near blade slot 22. Disc at 6,100 cycles of 9,000 cycle life.", "Turbine Disc Crack", "Trent 1000", "Rolls-Royce Derby", RequestStatus.SpecialistOpinion, Priority.Critical, 8),
            ("Accessory Gearbox Seal Weep — External Oil Leak", "Progressive external oil leak from accessory gearbox output shaft seal. Current loss rate approximately 0.15 litres per flight hour. Seal replacement requires gearbox removal. Engine dispatch reliability impacted.", "Seal Degradation", "BR725", "ST Aerospace", RequestStatus.Approved, Priority.Medium, 25),
            ("Vibration Exceedance During Ground Run Post-MRO", "Engine SN-6234 exhibiting N1 vibration levels of 3.2 IPS during post-maintenance ground run, exceeding the 2.5 IPS limit. Vibration concentrated at 1x N1 frequency. Fan module was rebalanced during this shop visit. All rotor assemblies within stack-up tolerances.", "Vibration Anomaly", "Trent XWB", "Lufthansa Technik", RequestStatus.UnderReview, Priority.High, 3),
            ("LPT Stage 5 Blade Platform Cracking", "Multiple Stage 5 LPT blades exhibiting platform edge cracking at the inter-platform seal gap region. 12 of 78 blades affected. Crack lengths range from 3mm to 11mm. Blades at 4,800 cycles against 7,500 cycle refurbishment interval.", "Blade Damage", "Trent 900", "Delta TechOps", RequestStatus.TriageComplete, Priority.Medium, 7),
            ("HPC Stage 8 Blade Root Fretting Damage", "High Pressure Compressor Stage 8 blades showing fretting wear at fir-tree root contact faces. Maximum depth of fretting measured at 0.12mm on 15 blades. Disc broach slots show corresponding minor wear.", "Bearing Wear", "Trent 7000", "AFI KLM E&M", RequestStatus.Submitted, Priority.Medium, 1),
            ("Fan Case Acoustic Panel Delamination", "Acoustic liner panel delamination detected in the fan case between the 2 and 4 o'clock positions. Delaminated area approximately 200mm x 150mm. Honeycomb core separation from inner skin confirmed by tap test.", "Foreign Object Damage", "Trent 1000", "SIA Engineering", RequestStatus.Completed, Priority.Low, 45),
        };

        for (int i = 0; i < items.Length; i++)
        {
            var item = items[i];
            var created = baseDate.AddDays(-item.DaysAgo).AddHours(random.Next(0, 23));
            var request = new VarianceRequest
            {
                Id = Guid.Parse($"00000000-0000-0000-0000-{(i + 1).ToString().PadLeft(12, '0')}"),
                ReferenceNumber = $"VR-2025-{(1000 + i + 1).ToString()}",
                Title = item.Title,
                Description = item.Desc,
                AnomalyType = item.Anomaly,
                EngineType = item.Engine,
                EngineSerialNumber = $"SN-{random.Next(1000, 9999)}",
                PartNumber = $"RR-{random.Next(10000, 99999)}-{random.Next(10, 99)}",
                AircraftRegistration = $"G-{(char)('A' + random.Next(26))}{(char)('A' + random.Next(26))}{(char)('A' + random.Next(26))}{(char)('A' + random.Next(26))}",
                Status = item.Status,
                Priority = item.Pri,
                SubmittedBy = GetSubmitter(item.Mro, random),
                AssignedTo = item.Status >= RequestStatus.UnderReview ? Specialists[random.Next(Specialists.Length)] : null,
                MroOrganisation = item.Mro,
                MroSiteLocation = GetLocation(item.Mro),
                ShopVisitReference = $"SV-{random.Next(10000, 99999)}",
                CreatedAt = created,
                UpdatedAt = created.AddDays(random.Next(0, Math.Max(1, item.DaysAgo / 2))),
                ResolvedAt = item.Status == RequestStatus.Completed ? created.AddDays(random.Next(5, item.DaysAgo)) : null,
            };

            request.AuditTrail.Add(new AuditEntry
            {
                Action = "Created",
                Details = $"Variance request {request.ReferenceNumber} submitted by {request.SubmittedBy}",
                Actor = request.SubmittedBy,
                ActorRole = "MRO Engineer",
                RequestId = request.Id,
                CreatedAt = request.CreatedAt
            });

            if (item.Status >= RequestStatus.UnderReview)
            {
                request.AuditTrail.Add(new AuditEntry
                {
                    Action = "StatusChanged",
                    Details = $"Status changed to Under Review. Assigned to {request.AssignedTo}",
                    Actor = "System",
                    PreviousValue = "Submitted",
                    NewValue = "UnderReview",
                    RequestId = request.Id,
                    CreatedAt = request.CreatedAt.AddHours(random.Next(2, 24))
                });
            }

            if (item.Status >= RequestStatus.SpecialistOpinion)
            {
                request.Comments.Add(new Comment
                {
                    Content = "Initial review complete. Routing to materials specialist for disposition assessment.",
                    Author = request.AssignedTo ?? "System",
                    AuthorRole = "Lead Engineer",
                    IsInternal = true,
                    RequestId = request.Id,
                    CreatedAt = request.CreatedAt.AddDays(2)
                });
            }

            if (item.Status >= RequestStatus.RecommendationDrafted)
            {
                request.TriageResult = new TriageResult
                {
                    RequestId = request.Id,
                    SeverityClassification = item.Pri == Priority.Critical ? "AOG-Critical" : "Standard",
                    RecommendedAction = "Engineering disposition required — recommend specialist materials review",
                    SuggestedSpecialist = request.AssignedTo,
                    ConfidenceScore = 0.85 + random.NextDouble() * 0.12,
                    SimilarVariancesFound = random.Next(3, 25),
                    MatchedReferenceIds = Enumerable.Range(0, random.Next(2, 6)).Select(_ => $"VR-2024-{random.Next(100, 999)}").ToList(),
                    AiModelVersion = "rr-triage-v2.4.1",
                    RagContextSummary = "Matched against 15,247 historical variance records. Similar cases resolved via blend repair (62%), replacement (28%), or use-as-is with enhanced monitoring (10%).",
                    SuggestedRfiQuestions = new List<string>
                    {
                        "Confirm exact crack length measurement methodology (visual vs FPI vs eddy current)",
                        "Provide last 100 flight hours vibration trend data",
                        "Confirm borescope inspection coverage of adjacent stages"
                    },
                    TriagedAt = request.CreatedAt.AddHours(4)
                };
            }

            if (item.Status >= RequestStatus.DocumentAuthored)
            {
                request.GeneratedDocument = new VarianceDocument
                {
                    RequestId = request.Id,
                    DocumentNumber = $"VD-{request.ReferenceNumber.Replace("VR-", "")}",
                    Title = $"Technical Variance Disposition — {request.Title}",
                    Status = item.Status == RequestStatus.Completed ? DocumentStatus.Published : DocumentStatus.InReview,
                    ProblemStatement = request.Description,
                    TechnicalAnalysis = "Detailed metallurgical and structural analysis indicates the non-conformance is within acceptable engineering limits when considering the operational profile and remaining useful life calculations.",
                    SafetyAssessment = "No immediate flight safety concern identified. Continued operation is acceptable with enhanced monitoring provisions as specified in the disposition.",
                    ProposedDisposition = "Approve for continued service with enhanced inspection interval of 500 cycles and supplementary vibration monitoring.",
                    RegulatoryReferences = "EASA Part-145, AMC 145.A.48; FAA AC 43-218; ICAO Doc 9760",
                    ApplicableRegulations = "EASA CS-E 520, CS-E 740; FAR 33.70, 33.75",
                    AiGeneratedPercentage = 62.5 + random.NextDouble() * 15,
                    AuthoredBy = request.AssignedTo,
                    CreatedAt = request.CreatedAt.AddDays(random.Next(3, 8)),
                    Signatures = new List<DocumentSignature>
                    {
                        new() { SignatoryName = request.AssignedTo ?? "Dr. S. Patel", SignatoryRole = "Reviewing Engineer" }
                    }
                };
            }

            requests.Add(request);
        }

        return requests;
    }

    private static string GetSubmitter(string mro, Random random)
    {
        return mro switch
        {
            "Lufthansa Technik" => random.Next(2) == 0 ? "K. Schneider" : "M. Fischer",
            "SIA Engineering" => "T. Lim",
            "Delta TechOps" => "R. Johnson",
            "AFI KLM E&M" => "P. de Vries",
            "Turkish Technic" => "A. Yilmaz",
            "HAECO" => "W. Chan",
            "ST Aerospace" => "S. Tan",
            "Rolls-Royce Derby" => "J. Richardson",
            _ => "Unknown"
        };
    }

    private static string GetLocation(string mro)
    {
        return mro switch
        {
            "Lufthansa Technik" => "Hamburg, Germany",
            "SIA Engineering" => "Singapore",
            "Delta TechOps" => "Atlanta, GA, USA",
            "AFI KLM E&M" => "Amsterdam, Netherlands",
            "Turkish Technic" => "Istanbul, Turkey",
            "HAECO" => "Hong Kong",
            "ST Aerospace" => "Singapore",
            "Rolls-Royce Derby" => "Derby, UK",
            _ => "Unknown"
        };
    }
}
