namespace RedApp.Api.Models;

public class GeoCoordinate
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}

public class Hospital
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    public string EmergencyUnit { get; set; } = string.Empty;
    public GeoCoordinate Location { get; set; } = new();
}
