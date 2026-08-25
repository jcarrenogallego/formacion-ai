# Delivery Board

Aplicación de ejemplo para explorar cómo un agente de desarrollo trabaja sobre un proyecto existente con varias capas, persistencia, pruebas y orquestación.

## ¿Qué incluye?

- **Frontend:** HTML, CSS y JavaScript sin frameworks.
- **API:** Minimal APIs con .NET 10 y C# 14.
- **Aplicación:** casos de uso explícitos, sin MediatR.
- **Dominio:** entidad, reglas de negocio y contrato del repositorio.
- **Infraestructura:** Entity Framework Core, migraciones y PostgreSQL.
- **Pruebas:** pruebas unitarias de los casos de uso con xUnit.
- **Orquestación:** .NET Aspire levanta PostgreSQL, API y frontend.

```mermaid
flowchart LR
    Frontend[Frontend JavaScript] --> Api[Minimal API]
    Api --> Application[Casos de uso]
    Application --> Domain[Dominio]
    Infrastructure[Infraestructura] --> Domain
    Infrastructure --> Database[(PostgreSQL)]
    Aspire[Aspire AppHost] -. inicia .-> Frontend
    Aspire -. inicia .-> Api
    Aspire -. inicia .-> Database
```

## Requisitos

- .NET SDK 10.
- Node.js 20 o superior.
- Docker Desktop o un motor de contenedores compatible en ejecución.

## Ejecutar todo con Aspire

Desde la raíz de este proyecto:

```powershell
cd backend
dotnet tool restore
dotnet run --project apphost/DeliveryBoard.AppHost
```

La terminal mostrará la dirección del panel de Aspire. Desde ese panel se puede observar el frontend en ejecución, abrir su URL y consultar sus logs.

El frontend utiliza siempre la misma dirección:

```text
http://localhost:3000
```

En el panel, `frontend-installer` termina después de ejecutar `npm install`. El recurso que representa el servidor web es `frontend`: debe aparecer como **Running** y mostrar `http://localhost:3000` en la columna de direcciones.

La documentación interactiva de la API está en la ruta `/swagger` del recurso `api`.

## Compilar y ejecutar las pruebas

```powershell
cd backend
dotnet build DeliveryBoard.slnx
dotnet test DeliveryBoard.slnx
```

## Crear una migración

Las herramientas de Entity Framework están versionadas en el repositorio. Para crear otra migración:

```powershell
cd backend
dotnet tool restore
dotnet tool run dotnet-ef migrations add NombreMigracion `
  --project src/DeliveryBoard.Infrastructure `
  --startup-project src/DeliveryBoard.Api `
  --output-dir Persistence/Migrations
```

La API aplica las migraciones pendientes al arrancar.

## Endpoints

| Método | Ruta | Uso |
|---|---|---|
| `GET` | `/health` | Comprueba que la API responde. |
| `GET` | `/api/work-items/dashboard` | Devuelve las tareas y los totales del tablero. |
| `POST` | `/api/work-items` | Crea una tarea nueva. |

Ejemplo de creación:

```json
{
  "title": "Revisar integración",
  "owner": "Ana",
  "priority": "High"
}
```

Las prioridades admitidas son `Low`, `Medium` y `High`.

## Decisiones intencionadas

- No hay autenticación porque el foco está en el flujo de desarrollo.
- No hay pruebas del frontend; las pruebas se concentran en Application.
- El frontend dispone de un proxy hacia la API y la API también habilita CORS para facilitar su uso directo durante la práctica.
- La política CORS es abierta porque este proyecto se ejecuta localmente con fines formativos; no es una configuración apropiada para producción.
- Los casos de uso dependen de una interfaz de repositorio y pueden probarse sin PostgreSQL.
