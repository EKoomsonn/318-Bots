namespace RedApp.Api.Services;

public class CompatibilityEngine
{
    // ABO/Rh Red Blood Cell Compatibility Rules
    private static readonly Dictionary<string, List<string>> RecipientToEligibleDonors = new(StringComparer.OrdinalIgnoreCase)
    {
        { "O-", new() { "O-" } },
        { "O+", new() { "O-", "O+" } },
        { "A-", new() { "O-", "A-" } },
        { "A+", new() { "O-", "O+", "A-", "A+" } },
        { "B-", new() { "O-", "B-" } },
        { "B+", new() { "O-", "O+", "B-", "B+" } },
        { "AB-", new() { "O-", "A-", "B-", "AB-" } },
        { "AB+", new() { "O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+" } } // Universal Recipient
    };

    private static readonly Dictionary<string, List<string>> DonorToEligibleRecipients = new(StringComparer.OrdinalIgnoreCase)
    {
        { "O-", new() { "O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+" } }, // Universal Donor
        { "O+", new() { "O+", "A+", "B+", "AB+" } },
        { "A-", new() { "A-", "A+", "AB-", "AB+" } },
        { "A+", new() { "A+", "AB+" } },
        { "B-", new() { "B-", "B+", "AB-", "AB+" } },
        { "B+", new() { "B+", "AB+" } },
        { "AB-", new() { "AB-", "AB+" } },
        { "AB+", new() { "AB+" } }
    };

    public bool IsCompatible(string donorBloodType, string recipientBloodType)
    {
        if (string.IsNullOrWhiteSpace(donorBloodType) || string.IsNullOrWhiteSpace(recipientBloodType))
            return false;

        if (RecipientToEligibleDonors.TryGetValue(recipientBloodType, out var eligibleDonors))
        {
            return eligibleDonors.Contains(donorBloodType, StringComparer.OrdinalIgnoreCase);
        }
        return false;
    }

    public List<string> GetEligibleDonorTypes(string recipientBloodType)
    {
        if (RecipientToEligibleDonors.TryGetValue(recipientBloodType, out var donors))
            return donors;
        return new();
    }

    public List<string> GetEligibleRecipientTypes(string donorBloodType)
    {
        if (DonorToEligibleRecipients.TryGetValue(donorBloodType, out var recipients))
            return recipients;
        return new();
    }
}
