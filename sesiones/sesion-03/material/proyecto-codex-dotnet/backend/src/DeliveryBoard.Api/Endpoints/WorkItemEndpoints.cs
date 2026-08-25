using DeliveryBoard.Application.WorkItems;

namespace DeliveryBoard.Api.Endpoints;

public static class WorkItemEndpoints
{
    public static IEndpointRouteBuilder MapWorkItemEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/work-items").WithTags("Work items");

        group.MapGet("/dashboard", async (
            IGetDashboardUseCase useCase,
            CancellationToken cancellationToken) =>
        {
            var dashboard = await useCase.ExecuteAsync(cancellationToken);
            return Results.Ok(dashboard);
        }).WithName("GetDashboard");

        group.MapPost("/", async (
            CreateWorkItemRequest request,
            ICreateWorkItemUseCase useCase,
            CancellationToken cancellationToken) =>
        {
            var workItem = await useCase.ExecuteAsync(request, cancellationToken);
            return Results.Created($"/api/work-items/{workItem.Id}", workItem);
        }).WithName("CreateWorkItem");

        return endpoints;
    }
}
