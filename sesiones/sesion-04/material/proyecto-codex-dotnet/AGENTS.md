# Guía para agentes de desarrollo

## Objetivo del proyecto

Delivery Board es una aplicación formativa. Los cambios deben ser pequeños, comprensibles y mantener la separación entre frontend, API, casos de uso, dominio e infraestructura.

## Reglas de arquitectura

- `Domain` no debe depender de ningún otro proyecto.
- `Application` solo puede depender de `Domain`.
- `Infrastructure` implementa los contratos del dominio y contiene Entity Framework Core.
- `Api` expone Minimal APIs y compone las dependencias.
- No incorporar MediatR, AutoMapper, servicios de dominio ni autenticación sin una petición explícita.
- Mantener las versiones de paquetes en `backend/Directory.Packages.props`.
- Añadir o actualizar pruebas en `DeliveryBoard.Application.UnitTests` cuando cambien los casos de uso.

## Verificación mínima

```powershell
cd backend
dotnet build DeliveryBoard.slnx
dotnet test DeliveryBoard.slnx
```

No se considera terminado un cambio si la solución no compila o las pruebas fallan.

## Memoria persistente con Engram

- Al comenzar una tarea relacionada con trabajo anterior, recupera primero el contexto reciente del proyecto.
- Contrasta las memorias recuperadas con el repositorio antes de utilizarlas.
- Guarda únicamente decisiones, correcciones, convenciones y descubrimientos reutilizables.
- Estructura las memorias con `What`, `Why`, `Where` y, cuando aporte valor, `Learned`.
- No guardes secretos, código completo, salidas extensas ni cada comando ejecutado.
- Al terminar una tarea significativa, deja un resumen con objetivo, trabajo completado, próximos pasos y archivos relevantes.
