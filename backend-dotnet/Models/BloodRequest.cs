namespace RedApp.Api.Models;

public class DonationSchedule
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string DonorId { get; set; } = string.Empty;
    public string DonorName { get; set; } = string.Empty;
    public string DonorBloodType { get; set; } = string.Empty;
    public string MaskedPhone { get; set; } = string.Empty;
    public string AppointmentTime { get; set; } = string.Empty;
    public string Status { get; set; } = "CONFIRMED";
    public DateTime PledgedAt { get; set; } = DateTime.UtcNow;
}

public class BloodRequest
{
    public string Id { get; set; } = string.Empty;
    public string HospitalId { get; set; } = string.Empty;
    public string HospitalName { get; set; } = string.Empty;
    public string BloodType { get; set; } = string.Empty; // e.g. "O-", "A+"
    public int UnitsRequired { get; set; } = 1;
    public int UnitsFulfilled { get; set; } = 0;
    public string Urgency { get; set; } = "URGENT"; // "CRITICAL", "URGENT", "ROUTINE"
    public string Status { get; set; } = "OPEN";    // "OPEN", "IN_PROGRESS", "FULFILLED", "CANCELLED"
    public string PatientNotes { get; set; } = string.Empty;
    public GeoCoordinate Location { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<DonationSchedule> Schedules { get; set; } = new();
}
