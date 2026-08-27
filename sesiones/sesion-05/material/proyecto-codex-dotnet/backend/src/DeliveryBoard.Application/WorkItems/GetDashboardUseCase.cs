using DeliveryBoard.Domain.WorkItems;

namespace DeliveryBoard.Application.WorkItems;

public sealed class GetDashboardUseCase(IWorkItemRepository repository) : IGetDashboardUseCase
{
    public async Task<DashboardResponse> ExecuteAsync(CancellationToken cancellationToken)
    {
        var items = await repository.GetAllAsync(cancellationToken);

        return new DashboardResponse(
            items.Count,
            items.Count(item => item.Status == WorkItemStatus.Pending),
            items.Count(item => item.Status == WorkItemStatus.InProgress),
            items.Count(item => item.Status == WorkItemStatus.Completed),
            [.. items.Select(item => item.ToResponse())]);
    }
}
