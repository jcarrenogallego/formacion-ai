using DeliveryBoard.Domain.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryBoard.Api.Errors;

public sealed class GlobalExceptionHandler(
    IProblemDetailsService problemDetailsService,
    ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var isBusinessError = exception is BusinessRuleException;
        var statusCode = isBusinessError
            ? StatusCodes.Status422UnprocessableEntity
            : StatusCodes.Status500InternalServerError;

        if (!isBusinessError)
        {
            logger.LogError(exception, "Error inesperado al procesar la solicitud.");
        }

        httpContext.Response.StatusCode = statusCode;

        return await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails = new ProblemDetails
            {
                Status = statusCode,
                Title = isBusinessError ? "No se pudo completar la operación" : "Error interno",
                Detail = isBusinessError ? exception.Message : "Se produjo un error inesperado."
            }
        });
    }
}
