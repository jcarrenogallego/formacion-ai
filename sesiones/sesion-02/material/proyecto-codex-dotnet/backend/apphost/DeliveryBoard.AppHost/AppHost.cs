var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder
    .AddPostgres("postgres")
    .WithDataVolume();

var database = postgres.AddDatabase("deliveryboard");

var api = builder
    .AddProject<Projects.DeliveryBoard_Api>("api")
    .WithReference(database)
    .WaitFor(database)
    .WithExternalHttpEndpoints();

builder
    .AddJavaScriptApp("frontend", "../../../frontend", "start")
    .WithHttpEndpoint(env: "PORT")
    .WithReference(api)
    .WaitFor(api)
    .WithExternalHttpEndpoints();

builder.Build().Run();
