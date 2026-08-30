namespace DeliveryBoard.Application.WorkItems;

public sealed record CreateWorkItemRequest(string Title, string Owner, string Priority);

public sealed record WorkItemResponse(
    Guid Id,
    string Title,
    string Owner,
    string Priority,
    string Status,
    DateTimeOffset CreatedAt);

public sealed record DashboardResponse(
    int Total,
    int Pending,
    int InProgress,
    int Completed,
    IReadOnlyCollection<WorkItemResponse> Items);
