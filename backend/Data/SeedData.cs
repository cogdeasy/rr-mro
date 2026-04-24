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
            // --- Submitted (3) ---
            ("HPT Blade Tip Liberation — Trent XWB SN-7842",
             "During scheduled borescope inspection at 3,200 cycles, liberation of approximately 12mm tip section identified on Stage 1 HPT blade position 14. Adjacent blades show minor tip rub evidence. Engine vibration data within limits but trending upward.",
             "Blade Damage", "Trent XWB", "Lufthansa Technik", RequestStatus.Submitted, Priority.Critical, 2),

            ("HPC Stage 8 Blade Root Fretting Damage",
             "High Pressure Compressor Stage 8 blades showing fretting wear at fir-tree root contact faces. Maximum depth of fretting measured at 0.12mm on 15 blades. Disc broach slots show corresponding minor wear.",
             "Bearing Wear", "Trent 7000", "AFI KLM E&M", RequestStatus.Submitted, Priority.Medium, 1),

            ("LP Shaft Spline Wear Exceeding Limits",
             "Low Pressure shaft front spline coupling exhibiting wear beyond the permissible 0.05mm limit documented in AMM Chapter 72-51-00. Measured wear depth of 0.09mm on drive face. Shaft at 5,600 cycles.",
             "Bearing Wear", "Trent 500", "ST Aerospace", RequestStatus.Submitted, Priority.High, 0),

            // --- Under Review (3) ---
            ("IPC Stage 3 Leading Edge Erosion Beyond AMM Limits",
             "Intermediate Pressure Compressor Stage 3 blades showing leading edge erosion depths exceeding AMM Chapter 72-33-00 limits by 0.8mm on 6 of 48 blades. Pattern consistent with sand/dust ingestion. Engine SN-4521 operating Middle East routes.",
             "Compressor Erosion", "Trent 900", "SIA Engineering", RequestStatus.UnderReview, Priority.High, 5),

            ("Vibration Exceedance During Ground Run Post-MRO",
             "Engine SN-6234 exhibiting N1 vibration levels of 3.2 IPS during post-maintenance ground run, exceeding the 2.5 IPS limit. Vibration concentrated at 1x N1 frequency. Fan module was rebalanced during this shop visit. All rotor assemblies within stack-up tolerances.",
             "Vibration Anomaly", "Trent XWB", "Lufthansa Technik", RequestStatus.UnderReview, Priority.High, 3),

            ("Intermediate Casing Flange Bolt Hole Elongation",
             "Two bolt holes on the intermediate casing horizontal flange joint show elongation of 0.15mm beyond drawing tolerance during scheduled strip. Remaining 22 bolt holes within limits. Casing at 7,200 cycles.",
             "Compressor Erosion", "Trent 1000", "HAECO", RequestStatus.UnderReview, Priority.Medium, 4),

            // --- Triage Complete (3) ---
            ("LPT Stage 5 Blade Platform Cracking",
             "Multiple Stage 5 LPT blades exhibiting platform edge cracking at the inter-platform seal gap region. 12 of 78 blades affected. Crack lengths range from 3mm to 11mm. Blades at 4,800 cycles against 7,500 cycle refurbishment interval.",
             "Blade Damage", "Trent 900", "Delta TechOps", RequestStatus.TriageComplete, Priority.Medium, 7),

            ("External Gearbox Mounting Bracket Fatigue Crack",
             "Visual inspection during line maintenance detected a 15mm fatigue crack on the external gearbox upper mounting bracket. Crack initiated at the fillet radius of the bolt hole. Bracket is forged aluminium alloy.",
             "Bearing Wear", "BR725", "Turkish Technic", RequestStatus.TriageComplete, Priority.High, 6),

            ("Fan Blade Dovetail Slot Corrosion",
             "Pitting corrosion discovered in 4 of 24 fan blade dovetail retention slots during piece-part inspection. Maximum pit depth 0.3mm. Corrosion product analysis indicates chloride-induced mechanism consistent with coastal operations.",
             "Blade Damage", "Trent 7000", "SIA Engineering", RequestStatus.TriageComplete, Priority.Medium, 9),

            // --- Specialist Opinion (3) ---
            ("No.3 Bearing Oil Scavenge Filter Contamination",
             "Elevated metallic particle count detected in No.3 bearing scavenge oil filter during routine MRO inspection. Spectrometric analysis shows elevated Fe and Cr content. Bearing temperatures nominal during last 500 flight hours.",
             "Oil System Contamination", "Trent 1000", "Delta TechOps", RequestStatus.SpecialistOpinion, Priority.High, 12),

            ("IP Turbine Disc Rim Crack Indication — Stage 2",
             "Fluorescent Penetrant Inspection during piece-part strip revealed linear indication on Stage 2 IP Turbine disc rim, forward face. Indication measures 8mm at circumferential orientation near blade slot 22. Disc at 6,100 cycles of 9,000 cycle life.",
             "Turbine Disc Crack", "Trent 1000", "Rolls-Royce Derby", RequestStatus.SpecialistOpinion, Priority.Critical, 8),

            ("Combustor Fuel Nozzle Coking and Flow Deviation",
             "Fuel flow check on 18 combustor nozzles reveals 3 units exceeding the +/- 5% flow tolerance band. Nozzle tips show carbon deposit buildup consistent with thermal degradation. Pattern suggests localised hot streaking in combustor Sectors 4-6.",
             "Combustor Liner Crack", "Trent XWB", "AFI KLM E&M", RequestStatus.SpecialistOpinion, Priority.Medium, 10),

            // --- Recommendation Drafted (3) ---
            ("Combustor Liner Thermal Fatigue Cracking — Panel 4",
             "Circumferential thermal fatigue crack identified on combustor inner liner Panel 4, measuring 45mm in length. Crack orientation perpendicular to cooling hole row. Crack depth assessment by FPI indicates surface-breaking only. Engine at 8,400 cycles.",
             "Combustor Liner Crack", "Trent XWB", "AFI KLM E&M", RequestStatus.RecommendationDrafted, Priority.Critical, 20),

            ("Oil Breather Pressurisation Anomaly",
             "Engine breather system showing elevated pressurisation during climb thrust settings. Back-pressure measured at 2.8 psi versus 1.5 psi limit. Carbon seal air-to-oil differential within limits. Oil consumption rate increased from 0.15 to 0.35 qt/hr over last 200 flight hours.",
             "Oil System Contamination", "Trent 900", "HAECO", RequestStatus.RecommendationDrafted, Priority.High, 18),

            ("HPC Stage 11 Variable Vane Actuator Binding",
             "Variable stator vane actuator on HPC Stage 11 exhibiting intermittent binding during scheduled function check. Actuator travel restricted by approximately 8 degrees at full extension. No external leakage observed. Actuator at 3,200 flight hours.",
             "Seal Degradation", "Trent 7000", "Turkish Technic", RequestStatus.RecommendationDrafted, Priority.Medium, 16),

            // --- Document Authored (2) ---
            ("TBC Spallation on HPT Nozzle Guide Vanes",
             "Thermal Barrier Coating spallation observed on 8 of 32 Stage 1 HPT Nozzle Guide Vanes during scheduled shop visit. Affected area approximately 30% of airfoil surface. Base metal shows early oxidation in spalled regions.",
             "Thermal Barrier Coating Loss", "Trent 900", "HAECO", RequestStatus.DocumentAuthored, Priority.High, 15),

            ("Bypass Duct Acoustic Panel Disbond",
             "Ultrasonic inspection of bypass duct inner wall acoustic panels reveals disbonding over approximately 0.4 square metres between positions 7 and 9 o'clock. Panel core-to-skin adhesive failure confirmed. No structural skin cracking detected.",
             "Foreign Object Damage", "Trent 500", "Rolls-Royce Derby", RequestStatus.DocumentAuthored, Priority.Low, 22),

            // --- Approved (3) ---
            ("Accessory Gearbox Seal Weep — External Oil Leak",
             "Progressive external oil leak from accessory gearbox output shaft seal. Current loss rate approximately 0.15 litres per flight hour. Seal replacement requires gearbox removal. Engine dispatch reliability impacted.",
             "Seal Degradation", "BR725", "ST Aerospace", RequestStatus.Approved, Priority.Medium, 25),

            ("Fan Containment Case Rub Strip Wear",
             "Fan containment case abradable rub strip worn beyond serviceable limits across a 120-degree arc. Maximum depth of wear 3.2mm versus 2.0mm limit. Wear pattern consistent with fan blade tip growth during thermal transients.",
             "Blade Damage", "Trent 1000", "Lufthansa Technik", RequestStatus.Approved, Priority.Low, 28),

            ("Turbine Rear Bearing Support Strut Crack",
             "Eddy current inspection revealed a 6mm crack in the turbine rear bearing support strut at the hub fillet radius. Crack orientation aligned with primary bending stress direction. Strut at 9,200 cycles of 12,000 cycle life limit.",
             "Turbine Disc Crack", "Trent XWB", "Delta TechOps", RequestStatus.Approved, Priority.Critical, 30),

            // --- Completed (4) ---
            ("Fan Blade Foreign Object Damage — Leading Edge",
             "FOD impact damage on Fan Blade position 7 during ground operations at DXB. Damage extends 15mm along leading edge with 2mm depth. No secondary damage to adjacent blades or fan case. Blade is titanium hollow construction.",
             "Foreign Object Damage", "Trent 7000", "Turkish Technic", RequestStatus.Completed, Priority.Medium, 35),

            ("Fan Case Acoustic Panel Delamination",
             "Acoustic liner panel delamination detected in the fan case between the 2 and 4 o'clock positions. Delaminated area approximately 200mm x 150mm. Honeycomb core separation from inner skin confirmed by tap test.",
             "Foreign Object Damage", "Trent 1000", "SIA Engineering", RequestStatus.Completed, Priority.Low, 45),

            ("Compressor Rear Cone Bolt Stretch Beyond Limits",
             "Compressor rear cone attachment bolts showing permanent stretch exceeding the 0.1mm limit on 4 of 24 bolts during scheduled torque check. Affected bolts at positions 3, 9, 14, and 21. All bolts were last installed at previous shop visit (2,400 cycles ago).",
             "Bearing Wear", "Trent 500", "ST Aerospace", RequestStatus.Completed, Priority.Low, 50),

            ("HP Fuel Pump Drive Shaft Keyway Wear",
             "Keyway on the HP fuel pump drive shaft exhibiting wear depth of 0.08mm, exceeding the 0.05mm permissible limit. Drive shaft at 4,100 flight hours. No indication of key migration or fuel pump performance degradation.",
             "Seal Degradation", "BR725", "Rolls-Royce Derby", RequestStatus.Completed, Priority.Medium, 40),

            // --- Closed (2) ---
            ("Suspected HPT Blade Creep — Trent 900",
             "Initial report of suspected HPT blade creep based on borescope images later determined to be an imaging artefact. Repeat borescope from alternate port confirmed blades within all dimensional limits. No further action required.",
             "Blade Damage", "Trent 900", "Lufthansa Technik", RequestStatus.Closed, Priority.High, 55),

            ("Duplicate Submission — Oil Scavenge Filter VR-2025-1004",
             "This request was identified as a duplicate of VR-2025-1004 (No.3 Bearing Oil Scavenge Filter Contamination). Closing in favour of original submission which is currently under specialist review.",
             "Oil System Contamination", "Trent 1000", "Delta TechOps", RequestStatus.Closed, Priority.Medium, 13),

            // --- Rejected (2) ---
            ("Alleged Vibration Exceedance — Data Logger Fault",
             "Engine reported for vibration exceedance during cruise at FL350. Post-flight investigation determined the FADEC vibration channel had a faulty accelerometer connection producing erroneous readings. Ground run with calibrated equipment confirmed all vibration parameters normal.",
             "Vibration Anomaly", "Trent 7000", "AFI KLM E&M", RequestStatus.Rejected, Priority.High, 38),

            ("Cosmetic Discolouration of Exhaust Nozzle Panels",
             "Visual discolouration noted on external exhaust nozzle petals following high-power ground run. Metallurgical assessment confirms this is surface oxide colour variation within normal operating temperature range. No structural or material property impact.",
             "Thermal Barrier Coating Loss", "Trent 500", "HAECO", RequestStatus.Rejected, Priority.Low, 42),
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
                ResolvedAt = item.Status is RequestStatus.Completed or RequestStatus.Closed or RequestStatus.Rejected
                    ? created.AddDays(random.Next(5, Math.Max(6, item.DaysAgo)))
                    : null,
            };

            // --- Audit Trail ---
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

            if (item.Status >= RequestStatus.TriageComplete)
            {
                request.AuditTrail.Add(new AuditEntry
                {
                    Action = "TriageCompleted",
                    Details = $"AI triage completed. Severity: {(item.Pri == Priority.Critical ? "AOG-Critical" : "Standard")}. {random.Next(3, 25)} similar historical variances identified.",
                    Actor = "rr-triage-v2.4.1",
                    ActorRole = "AI Triage Agent",
                    RequestId = request.Id,
                    CreatedAt = request.CreatedAt.AddHours(random.Next(4, 48))
                });
            }

            if (item.Status >= RequestStatus.SpecialistOpinion)
            {
                request.AuditTrail.Add(new AuditEntry
                {
                    Action = "StatusChanged",
                    Details = $"Routed to specialist {request.AssignedTo} for materials and structural assessment",
                    Actor = request.AssignedTo ?? "System",
                    ActorRole = "Lead Engineer",
                    PreviousValue = "TriageComplete",
                    NewValue = "SpecialistOpinion",
                    RequestId = request.Id,
                    CreatedAt = request.CreatedAt.AddDays(random.Next(2, 5))
                });
            }

            if (item.Status >= RequestStatus.RecommendationDrafted)
            {
                request.AuditTrail.Add(new AuditEntry
                {
                    Action = "StatusChanged",
                    Details = "Engineering recommendation drafted and pending review",
                    Actor = request.AssignedTo ?? "System",
                    ActorRole = "Lead Engineer",
                    PreviousValue = "SpecialistOpinion",
                    NewValue = "RecommendationDrafted",
                    RequestId = request.Id,
                    CreatedAt = request.CreatedAt.AddDays(random.Next(5, 10))
                });
            }

            if (item.Status >= RequestStatus.DocumentAuthored)
            {
                request.AuditTrail.Add(new AuditEntry
                {
                    Action = "DocumentGenerated",
                    Details = "27-page variance disposition package generated by Document Authoring Agent",
                    Actor = "rr-docauth-v1.8.0",
                    ActorRole = "AI Document Authoring Agent",
                    RequestId = request.Id,
                    CreatedAt = request.CreatedAt.AddDays(random.Next(7, 14))
                });
            }

            if (item.Status >= RequestStatus.Approved)
            {
                request.AuditTrail.Add(new AuditEntry
                {
                    Action = "StatusChanged",
                    Details = "Variance approved — disposition: approve for continued service with conditions",
                    Actor = Specialists[random.Next(Specialists.Length)],
                    ActorRole = "Chief Engineer",
                    PreviousValue = "DocumentAuthored",
                    NewValue = "Approved",
                    RequestId = request.Id,
                    CreatedAt = request.CreatedAt.AddDays(random.Next(10, 18))
                });
            }

            if (item.Status == RequestStatus.Completed)
            {
                request.AuditTrail.Add(new AuditEntry
                {
                    Action = "StatusChanged",
                    Details = "MRO confirmed disposition actions completed. Engine cleared for return to service.",
                    Actor = request.SubmittedBy,
                    ActorRole = "MRO Engineer",
                    PreviousValue = "Approved",
                    NewValue = "Completed",
                    RequestId = request.Id,
                    CreatedAt = request.ResolvedAt ?? request.CreatedAt.AddDays(item.DaysAgo)
                });
            }

            if (item.Status == RequestStatus.Closed)
            {
                request.AuditTrail.Add(new AuditEntry
                {
                    Action = "StatusChanged",
                    Details = "Request closed — no further action required",
                    Actor = "System",
                    PreviousValue = request.AuditTrail.Count > 1 ? request.AuditTrail[^1].NewValue ?? "Submitted" : "Submitted",
                    NewValue = "Closed",
                    RequestId = request.Id,
                    CreatedAt = request.ResolvedAt ?? request.CreatedAt.AddDays(item.DaysAgo)
                });
            }

            if (item.Status == RequestStatus.Rejected)
            {
                request.AuditTrail.Add(new AuditEntry
                {
                    Action = "StatusChanged",
                    Details = "Variance request rejected — condition assessed as within normal operating parameters",
                    Actor = Specialists[random.Next(Specialists.Length)],
                    ActorRole = "Chief Engineer",
                    PreviousValue = "UnderReview",
                    NewValue = "Rejected",
                    RequestId = request.Id,
                    CreatedAt = request.ResolvedAt ?? request.CreatedAt.AddDays(item.DaysAgo)
                });
            }

            // --- Comments ---
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
                request.Comments.Add(new Comment
                {
                    Content = "Specialist review indicates the anomaly is within acceptable engineering margins for continued operation with enhanced monitoring. Drafting formal recommendation.",
                    Author = request.AssignedTo ?? Specialists[0],
                    AuthorRole = "Materials Specialist",
                    IsInternal = true,
                    RequestId = request.Id,
                    CreatedAt = request.CreatedAt.AddDays(random.Next(4, 8))
                });
            }

            if (item.Status >= RequestStatus.Approved)
            {
                request.Comments.Add(new Comment
                {
                    Content = $"Disposition approved. Please ensure the enhanced inspection interval and any supplementary monitoring requirements are communicated to the operator's maintenance programme.",
                    Author = Specialists[random.Next(Specialists.Length)],
                    AuthorRole = "Chief Engineer",
                    IsInternal = false,
                    RequestId = request.Id,
                    CreatedAt = request.CreatedAt.AddDays(random.Next(10, 18))
                });
            }

            if (item.Status == RequestStatus.Completed)
            {
                request.Comments.Add(new Comment
                {
                    Content = "All disposition actions implemented. Engine has been ground-run tested and returned to service. Closing this variance request.",
                    Author = request.SubmittedBy,
                    AuthorRole = "MRO Engineer",
                    IsInternal = false,
                    RequestId = request.Id,
                    CreatedAt = request.ResolvedAt ?? request.CreatedAt.AddDays(item.DaysAgo)
                });
            }

            if (item.Status == RequestStatus.Rejected)
            {
                request.Comments.Add(new Comment
                {
                    Content = "After thorough investigation, the reported condition does not constitute a non-conformance requiring a formal variance. No further action needed.",
                    Author = Specialists[random.Next(Specialists.Length)],
                    AuthorRole = "Chief Engineer",
                    IsInternal = false,
                    RequestId = request.Id,
                    CreatedAt = request.ResolvedAt ?? request.CreatedAt.AddDays(item.DaysAgo)
                });
            }

            // RFI-style comments on select requests
            if (i % 5 == 0 && item.Status >= RequestStatus.UnderReview)
            {
                request.Comments.Add(new Comment
                {
                    Content = "RFI: Please provide supplementary vibration trend data for the last 200 flight hours and confirm the inspection methodology used (visual / FPI / eddy current).",
                    Author = request.AssignedTo ?? Specialists[0],
                    AuthorRole = "Lead Engineer",
                    IsInternal = false,
                    RequestId = request.Id,
                    CreatedAt = request.CreatedAt.AddDays(1).AddHours(random.Next(1, 12))
                });

                request.Comments.Add(new Comment
                {
                    Content = "RFI response attached. Vibration data and FPI certification report uploaded as supporting documentation.",
                    Author = request.SubmittedBy,
                    AuthorRole = "MRO Engineer",
                    IsInternal = false,
                    RequestId = request.Id,
                    CreatedAt = request.CreatedAt.AddDays(2).AddHours(random.Next(1, 12))
                });
            }

            // --- Attachments ---
            request.Attachments.Add(new Attachment
            {
                FileName = $"{request.ReferenceNumber}_borescope_001.jpg",
                ContentType = "image/jpeg",
                FileSize = random.Next(800_000, 4_500_000),
                BlobUrl = $"https://rrmrostorage.blob.core.windows.net/attachments/{request.Id}/borescope_001.jpg",
                Description = "Borescope image of affected area — primary anomaly location",
                Category = AttachmentCategory.BoroscopeImage,
                RequestId = request.Id,
                UploadedAt = request.CreatedAt.AddMinutes(random.Next(5, 60)),
                UploadedBy = request.SubmittedBy
            });

            request.Attachments.Add(new Attachment
            {
                FileName = $"{request.ReferenceNumber}_inspection_report.pdf",
                ContentType = "application/pdf",
                FileSize = random.Next(200_000, 1_200_000),
                BlobUrl = $"https://rrmrostorage.blob.core.windows.net/attachments/{request.Id}/inspection_report.pdf",
                Description = "MRO inspection report with dimensional measurements and NDT results",
                Category = AttachmentCategory.InspectionReport,
                RequestId = request.Id,
                UploadedAt = request.CreatedAt.AddMinutes(random.Next(10, 120)),
                UploadedBy = request.SubmittedBy
            });

            if (i % 3 == 0)
            {
                request.Attachments.Add(new Attachment
                {
                    FileName = $"{request.ReferenceNumber}_engineering_drawing.pdf",
                    ContentType = "application/pdf",
                    FileSize = random.Next(500_000, 3_000_000),
                    BlobUrl = $"https://rrmrostorage.blob.core.windows.net/attachments/{request.Id}/engineering_drawing.pdf",
                    Description = "Cross-section engineering drawing with anomaly location highlighted",
                    Category = AttachmentCategory.EngineeringDrawing,
                    RequestId = request.Id,
                    UploadedAt = request.CreatedAt.AddMinutes(random.Next(30, 180)),
                    UploadedBy = request.SubmittedBy
                });
            }

            if (i % 4 == 0)
            {
                request.Attachments.Add(new Attachment
                {
                    FileName = $"{request.ReferenceNumber}_photograph_site.jpg",
                    ContentType = "image/jpeg",
                    FileSize = random.Next(1_000_000, 6_000_000),
                    BlobUrl = $"https://rrmrostorage.blob.core.windows.net/attachments/{request.Id}/photograph_site.jpg",
                    Description = "High-resolution photograph of the affected component in situ",
                    Category = AttachmentCategory.Photograph,
                    RequestId = request.Id,
                    UploadedAt = request.CreatedAt.AddMinutes(random.Next(15, 90)),
                    UploadedBy = request.SubmittedBy
                });
            }

            if (item.Status >= RequestStatus.RecommendationDrafted && i % 5 == 0)
            {
                request.Attachments.Add(new Attachment
                {
                    FileName = $"{request.ReferenceNumber}_SRM_reference.pdf",
                    ContentType = "application/pdf",
                    FileSize = random.Next(300_000, 800_000),
                    BlobUrl = $"https://rrmrostorage.blob.core.windows.net/attachments/{request.Id}/srm_reference.pdf",
                    Description = "Applicable Structural Repair Manual excerpt",
                    Category = AttachmentCategory.TechnicalPublication,
                    RequestId = request.Id,
                    UploadedAt = request.CreatedAt.AddDays(random.Next(3, 10)),
                    UploadedBy = request.AssignedTo ?? Specialists[0]
                });
            }

            // --- Triage Result ---
            if (item.Status >= RequestStatus.TriageComplete && item.Status != RequestStatus.Rejected)
            {
                var similarCount = random.Next(3, 25);
                request.TriageResult = new TriageResult
                {
                    RequestId = request.Id,
                    SeverityClassification = item.Pri == Priority.Critical ? "AOG-Critical" : item.Pri == Priority.High ? "Elevated" : "Standard",
                    RecommendedAction = GetTriageRecommendation(item.Anomaly, item.Pri),
                    SuggestedSpecialist = request.AssignedTo,
                    ConfidenceScore = 0.85 + random.NextDouble() * 0.12,
                    SimilarVariancesFound = similarCount,
                    MatchedReferenceIds = Enumerable.Range(0, random.Next(2, 6)).Select(_ => $"VR-2024-{random.Next(100, 999)}").ToList(),
                    AiModelVersion = "rr-triage-v2.4.1",
                    RagContextSummary = GetRagSummary(item.Anomaly),
                    SuggestedRfiQuestions = GetRfiQuestions(item.Anomaly),
                    TriagedAt = request.CreatedAt.AddHours(4)
                };
            }

            // --- Generated Document ---
            if (item.Status >= RequestStatus.DocumentAuthored)
            {
                request.GeneratedDocument = new VarianceDocument
                {
                    RequestId = request.Id,
                    DocumentNumber = $"VD-{request.ReferenceNumber.Replace("VR-", "")}",
                    Title = $"Technical Variance Disposition — {request.Title}",
                    Status = item.Status == RequestStatus.Completed ? DocumentStatus.Published
                           : item.Status == RequestStatus.Approved ? DocumentStatus.Approved
                           : DocumentStatus.InReview,
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

                if (item.Status >= RequestStatus.Approved)
                {
                    request.GeneratedDocument.ReviewedBy = Specialists[random.Next(Specialists.Length)];
                    request.GeneratedDocument.ApprovedBy = Specialists[random.Next(Specialists.Length)];
                    request.GeneratedDocument.ApprovedAt = request.CreatedAt.AddDays(random.Next(10, 18));
                    request.GeneratedDocument.Signatures.Add(
                        new DocumentSignature
                        {
                            SignatoryName = request.GeneratedDocument.ApprovedBy,
                            SignatoryRole = "Chief Engineer",
                            SignedAt = request.GeneratedDocument.ApprovedAt
                        });
                }
            }

            requests.Add(request);
        }

        return requests;
    }

    private static string GetTriageRecommendation(string anomalyType, Priority priority)
    {
        return anomalyType switch
        {
            "Blade Damage" => "Engineering disposition required — recommend specialist blade integrity review and FEM stress analysis",
            "Bearing Wear" => "Dimensional assessment against AMM limits required — recommend tribology specialist review",
            "Seal Degradation" => "Seal system performance assessment required — recommend seals and secondary air system specialist",
            "Combustor Liner Crack" => "Critical — recommend immediate metallurgical assessment and thermal fatigue life analysis",
            "Compressor Erosion" => "Blend repair feasibility assessment required — recommend compressor aerodynamics specialist",
            "Turbine Disc Crack" => priority == Priority.Critical
                ? "AOG-Critical — immediate lifing assessment required. Potential fleet-wide implications"
                : "Engineering disposition required — recommend specialist disc integrity and lifing review",
            "Oil System Contamination" => "Oil system debris analysis required — recommend bearing and oil system specialist review",
            "Vibration Anomaly" => "Vibration signature analysis required — recommend rotor dynamics specialist review",
            "Foreign Object Damage" => "Damage tolerance assessment required — recommend structural integrity specialist review",
            "Thermal Barrier Coating Loss" => "TBC condition assessment required — recommend coatings and surface treatment specialist",
            _ => "Engineering disposition required — recommend specialist materials review"
        };
    }

    private static string GetRagSummary(string anomalyType)
    {
        return anomalyType switch
        {
            "Blade Damage" => "Matched against 15,247 historical variance records. Similar blade damage cases resolved via blend repair (62%), replacement (28%), or use-as-is with enhanced monitoring (10%).",
            "Bearing Wear" => "Matched against 15,247 historical records. Similar bearing wear cases resolved via component replacement (55%), rework to limits (35%), or enhanced monitoring (10%).",
            "Seal Degradation" => "Matched against 15,247 historical records. Similar seal issues resolved via seal replacement (72%), enhanced monitoring with dispatch limits (20%), or deferred to next shop visit (8%).",
            "Combustor Liner Crack" => "Matched against 15,247 historical records. Similar combustor cracks resolved via liner replacement (48%), weld repair (32%), or operational life limit reduction (20%).",
            "Compressor Erosion" => "Matched against 15,247 historical records. Similar erosion cases resolved via blend repair (65%), blade replacement (25%), or continued operation with reduced life (10%).",
            "Turbine Disc Crack" => "Matched against 15,247 historical records. CRITICAL: Disc crack indications require mandatory lifing review. Historical resolution: disc replacement (78%), enhanced inspection regime (15%), immediate engine removal (7%).",
            "Oil System Contamination" => "Matched against 15,247 historical records. Similar contamination cases resolved via bearing replacement (42%), oil system flush and monitoring (38%), or chip detector installation (20%).",
            "Vibration Anomaly" => "Matched against 15,247 historical records. Similar vibration cases resolved via trim balance (45%), module rework (35%), or bearing replacement (20%).",
            "Foreign Object Damage" => "Matched against 15,247 historical records. Similar FOD cases resolved via blend repair (58%), component replacement (32%), or use-as-is with life limit (10%).",
            "Thermal Barrier Coating Loss" => "Matched against 15,247 historical records. Similar TBC issues resolved via recoating (50%), component replacement (30%), or continued operation with reduced TBO (20%).",
            _ => "Matched against 15,247 historical variance records. Similar cases identified for specialist review."
        };
    }

    private static List<string> GetRfiQuestions(string anomalyType)
    {
        return anomalyType switch
        {
            "Blade Damage" => new List<string>
            {
                "Confirm exact crack/damage length measurement methodology (visual vs FPI vs eddy current)",
                "Provide last 100 flight hours vibration trend data",
                "Confirm borescope inspection coverage of adjacent stages"
            },
            "Bearing Wear" => new List<string>
            {
                "Provide oil analysis trend data for last 5 samples",
                "Confirm bearing temperature trend during last 500 flight hours",
                "Detail measurement methodology and tooling calibration status"
            },
            "Turbine Disc Crack" => new List<string>
            {
                "Provide full FPI/MPI report with photographs of indication",
                "Confirm disc piece-part history and total accumulated cycles",
                "Detail any prior rework or blending performed on this disc"
            },
            "Combustor Liner Crack" => new List<string>
            {
                "Provide thermal paint inspection results if available",
                "Confirm crack propagation direction relative to cooling holes",
                "Detail engine operational profile (hot time, cycle ratio)"
            },
            _ => new List<string>
            {
                "Confirm exact measurement methodology and tooling calibration status",
                "Provide last 100 flight hours trend data for relevant parameters",
                "Confirm component piece-part history and total accumulated life"
            }
        };
    }

    private static string GetSubmitter(string mro, Random random)
    {
        return mro switch
        {
            "Lufthansa Technik" => random.Next(2) == 0 ? "K. Schneider" : "M. Fischer",
            "SIA Engineering" => random.Next(2) == 0 ? "T. Lim" : "J. Ang",
            "Delta TechOps" => random.Next(2) == 0 ? "R. Johnson" : "D. Williams",
            "AFI KLM E&M" => random.Next(2) == 0 ? "P. de Vries" : "L. Dupont",
            "Turkish Technic" => random.Next(2) == 0 ? "A. Yilmaz" : "E. Ozturk",
            "HAECO" => random.Next(2) == 0 ? "W. Chan" : "H. Wong",
            "ST Aerospace" => random.Next(2) == 0 ? "S. Tan" : "R. Krishnan",
            "Rolls-Royce Derby" => random.Next(2) == 0 ? "J. Richardson" : "N. Barker",
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
