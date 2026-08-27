using DeliveryBoard.Domain.Exceptions;

namespace DeliveryBoard.Domain.WorkItems;

public sealed class WorkItem
{
    private WorkItem()
    {
    }

    private WorkItem(Guid id, string title, string owner, WorkItemPriority priority, DateTimeOffset createdAt)
    {
        Id = id;
        Title = title;
        Owner = owner;
        Priority = priority;
        CreatedAt = createdAt;
        Status = WorkItemStatus.Pending;
    }

    public Guid Id { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public string Owner { get; private set; } = string.Empty;

    public WorkItemPriority Priority { get; private set; }

    public WorkItemStatus Status { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public static WorkItem Create(string title, string owner, WorkItemPriority priority, DateTimeOffset createdAt)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new BusinessRuleException("El título de la tarea es obligatorio.");
        }

        if (string.IsNullOrWhiteSpace(owner))
        {
            throw new BusinessRuleException("La persona responsable es obligatoria.");
        }

        return new WorkItem(Guid.NewGuid(), title.Trim(), owner.Trim(), priority, createdAt);
    }
}

public enum WorkItemPriority
{
    Low,
    Medium,
    High
}

public enum WorkItemStatus
{
    Pending,
    InProgress,
    Completed
}
