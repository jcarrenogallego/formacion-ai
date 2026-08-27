# Baseline de la sesión 5

## Propósito

Este documento fija el punto de partida del taller para que análisis, arquitectura, desarrollo y revisión trabajen sobre los mismos hechos.

## Estado funcional

| Capacidad | Disponible |
|---|---|
| Crear una tarea | Sí |
| Consultar tareas y conteos | Sí |
| Prioridades tipadas en Domain | Sí |
| Estados `Pending`, `InProgress`, `Completed` | Sí |
| Mostrar el estado de cada tarea en el frontend | No |
| Avanzar una tarea entre estados | No |
| Buscar una tarea por identificador desde el repositorio | No |
| Endpoint de transición | No |
| Pruebas de transición | No |

## Herramientas incorporadas

- OpenSpec y skills de proyecto de la sesión 4.
- Engram configurado como MCP local de proyecto.
- Script de validación SDD.
- Contexto arquitectónico verificado.

## Herramientas no incorporadas

BMad Method no está instalado en el material canónico. No deben existir antes del taller:

- `_bmad/`;
- `_bmad-output/`;
- skills BMad generadas dentro de `.agents/skills/`.

La instalación personal utiliza BMad Method v6.11.0, módulo BMM y Codex.

## Decisiones heredadas

- Mantener arquitectura por capas sin MediatR ni AutoMapper.
- Domain protege invariantes y no depende de otros proyectos.
- Application contiene casos de uso explícitos.
- Infrastructure implementa persistencia con EF Core.
- Los errores de negocio se representan mediante `BusinessRuleException` y `ProblemDetails`.
- Las pruebas actuales usan xUnit y repositorios fake locales.
- El frontend continúa sin frameworks.
- El repositorio actual es la fuente de verdad; Engram conserva decisiones y aprendizajes.

## Hueco pedagógico

El ticket de sesión 5 debe implementar `Pending → InProgress → Completed`, con `Completed` terminal. El starter no contiene ninguna parte de esa operación. Si una copia ya permite avanzar tareas, no corresponde a este baseline y debe revisarse antes de comenzar.

## Validación inicial

Desde la raíz del proyecto:

```powershell
./scripts/validate-session-05.ps1 -Baseline
```

Este modo no exige BMad instalado. La validación final, sin `-Baseline`, exige el manifiesto, BMM 6.11.0 y una salida útil de `status` que confirme la instalación.
