namespace RedApp.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using RedApp.Api.Models;
using RedApp.Api.Services;

[ApiController]
[Route("api/[controller]")]
public class DonorsController : ControllerBase
{
    private static readonly List<Donor> Donors = new()
    {
        new Donor
        {
            Id = "donor-1",
            Name = "Kwame Agyeman",
            BloodType = "O-",
            MaskedPhone = "+233 24 *** *233",
            City = "Accra",
            Area = "Adabraka",
            IsAvailable = true,
            TotalDonations = 6,
            Location = new GeoCoordinate { Latitude = 5.5562, Longitude = -0.2104 }
        },
        new Donor
        {
            Id = "donor-2",
            Name = "Abena Mansa",
            BloodType = "O+",
            MaskedPhone = "+233 50 *** *567",
            City = "Accra",
            Area = "Osu",
            IsAvailable = true,
            TotalDonations = 4,
            Location = new GeoCoordinate { Latitude = 5.5560, Longitude = -0.1820 }
        }
    };

    private readonly ProximityService _proximity;

    public DonorsController(ProximityService proximity)
    {
        _proximity = proximity;
    }

    [HttpGet]
    public IActionResult GetAll([FromQuery] string? bloodType)
    {
        var result = Donors.AsEnumerable();
        if (!string.IsNullOrEmpty(bloodType))
        {
            result = result.Where(d => d.BloodType.Equals(bloodType, StringComparison.OrdinalIgnoreCase));
        }
        return Ok(new { success = true, count = result.Count(), data = result });
    }

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var donor = Donors.FirstOrDefault(d => d.Id == id);
        if (donor == null) return NotFound(new { success = false, message = "Donor not found" });
        return Ok(new { success = true, data = donor });
    }
}
