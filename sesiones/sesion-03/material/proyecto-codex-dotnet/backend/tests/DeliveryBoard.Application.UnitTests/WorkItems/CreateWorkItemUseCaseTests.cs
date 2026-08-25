using DeliveryBoard.Application.WorkItems;
using DeliveryBoard.Domain.Exceptions;
using DeliveryBoard.Domain.WorkItems;

namespace DeliveryBoard.Application.UnitTests.WorkItems;

public sealed class CreateWorkItemUseCaseTests
{
    [Fact]
    public async Task ExecuteAsync_WithValidData_CreatesPendingWorkItem()
    {
        var repository = new FakeWorkItemRepository();
        var useCase = new CreateWorkItemUseCase(repository);

        var result = await useCase.ExecuteAsync(
            new CreateWorkItemRequest("Preparar demo", "Ana", "High"),
            CancellationToken.None);

        Assert.Equal("Preparar demo", result.Title);
        Assert.Equal("High", result.Priority);
        Assert.Equal("Pending", result.Status);
        Assert.Single(repository.Items);
    }

    [Fact]
    public async Task ExecuteAsync_WithUnknownPriority_ThrowsBusinessRuleException()
    {
        var useCase = new CreateWorkItemUseCase(new FakeWorkItemRepository());

        var action = () => useCase.ExecuteAsync(
            new CreateWorkItemRequest("Preparar demo", "Ana", "Urgent"),
            CancellationToken.None);

        await Assert.ThrowsAsync<BusinessRuleException>(action);
    }

    private sealed class FakeWorkItemRepository : IWorkItemRepository
    {
        public List<WorkItem> Items { get; } = [];

        public Task AddAsync(WorkItem workItem, CancellationToken cancellationToken)
        {
            Items.Add(workItem);
            return Task.CompletedTask;
        }

        public Task<IReadOnlyCollection<WorkItem>> GetAllAsync(CancellationToken cancellationToken) =>
            Task.FromResult<IReadOnlyCollection<WorkItem>>(Items);
    }
}
