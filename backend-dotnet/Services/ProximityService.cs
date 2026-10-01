namespace RedApp.Api.Services;

using RedApp.Api.Models;

public class ProximityService
{
    private const double EarthRadiusKm = 6371.0;

    public double CalculateDistanceKm(double lat1, double lon1, double lat2, double lon2)
    {
        double dLat = ToRadians(lat2 - lat1);
        double dLon = ToRadians(lon2 - lon1);

        double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                   Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                   Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return Math.Round(EarthRadiusKm * c, 1);
    }

    public List<Donor> RankDonorsByProximity(IEnumerable<Donor> donors, GeoCoordinate targetLocation, double? maxRadiusKm = null)
    {
        var ranked = donors.Select(d =>
        {
            var clone = new Donor
            {
                Id = d.Id,
                Name = d.Name,
                BloodType = d.BloodType,
                MaskedPhone = d.MaskedPhone,
                City = d.City,
                Area = d.Area,
                IsAvailable = d.IsAvailable,
                LastDonatedDate = d.LastDonatedDate,
                TotalDonations = d.TotalDonations,
                Location = d.Location,
                DistanceKm = CalculateDistanceKm(targetLocation.Latitude, targetLocation.Longitude, d.Location.Latitude, d.Location.Longitude)
            };
            return clone;
        });

        if (maxRadiusKm.HasValue)
        {
            ranked = ranked.Where(d => d.DistanceKm <= maxRadiusKm.Value);
        }

        return ranked.OrderBy(d => d.DistanceKm).ToList();
    }

    private static double ToRadians(double degrees) => degrees * Math.PI / 180.0;
}
