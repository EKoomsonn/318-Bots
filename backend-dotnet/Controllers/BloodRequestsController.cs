namespace RedApp.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using RedApp.Api.Hubs;
using RedApp.Api.Models;
using RedApp.Api.Services;

[ApiController]
[Route("api/[controller]")]
public class BloodRequestsController : ControllerBase
{
    private static readonly List<BloodRequest> Requests = new()
    {
        new BloodRequest
        {
            Id = "req-101",
            HospitalId = "hosp-1",
            HospitalName = "Korle Bu Teaching Hospital",
            BloodType = "O-",
            UnitsRequired = 3,
            UnitsFulfilled = 1,
            Urgency = "CRITICAL",
            Status = "IN_PROGRESS",
            PatientNotes = "Emergency pediatric surgery and blood loss trauma.",
            Location = new GeoCoordinate { Latitude = 5.5367, Longitude = -0.2289 },
            CreatedAt = DateTime.UtcNow.AddMinutes(-45)
        },
        new BloodRequest
        {
            Id = "req-102",
            HospitalId = "hosp-2",
            HospitalName = "Greater Accra Regional Hospital (Ridge)",
            BloodType = "A+",
            UnitsRequired = 2,
            UnitsFulfilled = 0,
            Urgency = "URGENT",
            Status = "OPEN",
            PatientNotes = "Maternal health unit urgent requirement for scheduled caesarean section.",
            Location = new GeoCoordinate { Latitude = 5.5645, Longitude = -0.1983 },
            CreatedAt = DateTime.UtcNow.AddHours(-2)
        }
    };

    private readonly CompatibilityEngine _compatibility;
    private readonly ProximityService _proximity;
    private readonly IHubContext<BloodAlertHub> _hub;

    public BloodRequestsController(CompatibilityEngine compatibility, ProximityService proximity, IHubContext<BloodAlertHub> hub)
    {
        _compatibility = compatibility;
        _proximity = proximity;
        _hub = hub;
    }

    [HttpGet]
    public IActionResult GetAll([FromQuery] string? status, [FromQuery] string? donorBloodType)
    {
        var result = Requests.AsEnumerable();
        if (!string.IsNullOrEmpty(status))
        {
            result = result.Where(r => r.Status.Equals(status, StringComparison.OrdinalIgnoreCase));
        }
        if (!string.IsNullOrEmpty(donorBloodType))
        {
            result = result.Where(r => _compatibility.IsCompatible(donorBloodType, r.BloodType));
        }
        return Ok(new { success = true, count = result.Count(), data = result });
    }

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var request = Requests.FirstOrDefault(r => r.Id == id);
        if (request == null) return NotFound(new { success = false, message = "Not found" });
        return Ok(new { success = true, data = request });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BloodRequest newReq)
    {
        newReq.Id = $"req-{Guid.NewGuid().ToString()[..6]}";
        newReq.CreatedAt = DateTime.UtcNow;
        newReq.Status = "OPEN";
        Requests.Insert(0, newReq);

        // Broadcast alert in real-time to all connected SignalR clients
        await _hub.Clients.All.SendAsync("BloodAlertBroadcast", new
        {
            newReq.Id,
            newReq.HospitalName,
            newReq.BloodType,
            newReq.UnitsRequired,
            newReq.Urgency,
            alertMessage = $"🚨 URGENT: {newReq.HospitalName} needs {newReq.UnitsRequired} pint(s) of {newReq.BloodType} blood!"
        });

        return CreatedAtAction(nameof(GetById), new { id = newReq.Id }, new { success = true, data = newReq });
    }

    [HttpPost("{id}/schedule")]
    public async Task<IActionResult> ScheduleDonation(string id, [FromBody] DonationSchedule schedule)
    {
        var req = Requests.FirstOrDefault(r => r.Id == id);
        if (req == null) return NotFound(new { success = false, message = "Not found" });

        schedule.Id = Guid.NewGuid().ToString();
        schedule.PledgedAt = DateTime.UtcNow;
        req.Schedules.Add(schedule);
        req.UnitsFulfilled++;
        req.Status = req.UnitsFulfilled >= req.UnitsRequired ? "FULFILLED" : "IN_PROGRESS";

        await _hub.Clients.All.SendAsync("RequestUpdated", req);

        return Ok(new { success = true, data = req, latestSchedule = schedule });
    }
}
