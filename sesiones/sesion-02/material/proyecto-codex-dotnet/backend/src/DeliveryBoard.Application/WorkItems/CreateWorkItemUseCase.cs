using DeliveryBoard.Domain.Exceptions;
using DeliveryBoard.Domain.WorkItems;

namespace DeliveryBoard.Application.WorkItems;

public sealed class CreateWorkItemUseCase(IWorkItemRepository repository) : ICreateWorkItemUseCase
{
    public async Task<WorkItemResponse> ExecuteAsync(
        CreateWorkItemRequest request,
        CancellationToken cancellationToken)
    {
        if (!Enum.TryParse<WorkItemPriority>(request.Priority, true, out var priority))
        {
            throw new BusinessRuleException("La prioridad debe ser Low, Medium o High.");
        }

        var workItem = WorkItem.Create(request.Title, request.Owner, priority, DateTimeOffset.UtcNow);
        await repository.AddAsync(workItem, cancellationToken);

        return workItem.ToResponse();
    }
}
