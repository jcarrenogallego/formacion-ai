namespace DeliveryBoard.Domain.WorkItems;

public interface IWorkItemRepository
{
    Task AddAsync(WorkItem workItem, CancellationToken cancellationToken);

    Task<IReadOnlyCollection<WorkItem>> GetAllAsync(CancellationToken cancellationToken);
}
