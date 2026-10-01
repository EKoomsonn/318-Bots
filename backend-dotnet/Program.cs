using RedApp.Api.Hubs;
using RedApp.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Core RedApp domain services
builder.Services.AddSingleton<CompatibilityEngine>();
builder.Services.AddSingleton<ProximityService>();

// SignalR Real-time communication
builder.Services.AddSignalR();

// CORS configuration for Netlify frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNetlifyAndLocal", policy =>
    {
        policy.SetIsOriginAllowed(origin => true) // allows localhost and netlify.app
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowNetlifyAndLocal");
app.UseAuthorization();

app.MapControllers();
app.MapHub<BloodAlertHub>("/hubs/blood-alerts");

app.MapGet("/", () => Results.Ok(new
{
    Platform = "RedApp API (ASP.NET Core 8 / SignalR)",
    Course = "DCIT 318 - Programming II",
    Status = "Healthy",
    Swagger = "/swagger"
}));

app.Run();
