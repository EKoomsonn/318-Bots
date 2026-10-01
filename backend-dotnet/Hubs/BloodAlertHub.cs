namespace RedApp.Api.Hubs;

using Microsoft.AspNetCore.SignalR;
using RedApp.Api.Models;

public class BloodAlertHub : Hub
{
    public async Task JoinBloodGroup(string bloodType)
    {
        if (!string.IsNullOrWhiteSpace(bloodType))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"blood_{bloodType.ToUpper()}");
        }
    }

    public async Task JoinHospital(string hospitalId)
    {
        if (!string.IsNullOrWhiteSpace(hospitalId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"hospital_{hospitalId}");
        }
    }

    public async Task BroadcastUrgentBloodAlert(BloodRequest request)
    {
        await Clients.All.SendAsync("BloodAlertBroadcast", request);
    }
}
