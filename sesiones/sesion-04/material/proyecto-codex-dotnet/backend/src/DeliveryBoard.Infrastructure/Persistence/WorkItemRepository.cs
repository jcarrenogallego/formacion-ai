using DeliveryBoard.Domain.WorkItems;
using Microsoft.EntityFrameworkCore;

namespace DeliveryBoard.Infrastructure.Persistence;

internal sealed class WorkItemRepository(DeliveryBoardDbContext dbContext) : IWorkItemRepository
{
    public async Task AddAsync(WorkItem workItem, CancellationToken cancellationToken)
    {
        dbContext.WorkItems.Add(workItem);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<WorkItem>> GetAllAsync(CancellationToken cancellationToken) =>
        await dbContext.WorkItems
            .AsNoTracking()
            .OrderByDescending(item => item.CreatedAt)
            .ToArrayAsync(cancellationToken);
}
