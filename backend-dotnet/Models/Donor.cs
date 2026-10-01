namespace RedApp.Api.Models;

public class Donor
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string BloodType { get; set; } = string.Empty; // e.g. "O-", "A+"
    public string MaskedPhone { get; set; } = string.Empty;
    public string City { get; set; } = "Accra";
    public string Area { get; set; } = string.Empty;
    public bool IsAvailable { get; set; } = true;
    public string? LastDonatedDate { get; set; }
    public int TotalDonations { get; set; }
    public GeoCoordinate Location { get; set; } = new();
    public double? DistanceKm { get; set; }
}
