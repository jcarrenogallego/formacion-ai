# Proyectos para explorar Codex

La sesión incluye dos proyectos alternativos. Ambos permiten observar cómo Codex inspecciona un repositorio, sigue instrucciones, modifica archivos y verifica el resultado, pero tienen niveles de complejidad diferentes.

## Alternativa 1 - Inventario con JavaScript

[`proyecto-inventario`](proyecto-inventario/) es la opción más pequeña y directa.

- JavaScript sin dependencias externas.
- Un módulo de inventario y sus pruebas.
- Arranque rápido y pocos archivos.
- Adecuado para practicar el ciclo básico: explorar, modificar, ejecutar pruebas y revisar el diff.

Esta alternativa es recomendable cuando se quiere concentrar la atención en el funcionamiento de Codex y no en la arquitectura de la aplicación.

## Alternativa 2 - Delivery Board con .NET y JavaScript

[`proyecto-codex-dotnet`](proyecto-codex-dotnet/) representa un sistema más cercano a un proyecto profesional existente.

- Backend con .NET 10 y C# 14.
- Domain, Application, Infrastructure y Minimal API.
- Entity Framework Core, migraciones y PostgreSQL.
- Pruebas unitarias de Application con xUnit.
- Frontend sencillo con HTML, CSS, JavaScript y Node.js.
- Aspire levanta la base de datos, la API y el frontend.

Esta alternativa permite comprobar cómo Codex navega por varios ensamblados, respeta dependencias arquitectónicas y ejecuta validaciones más completas.

## ¿Cuál utilizar?

| Si queremos... | Proyecto recomendado |
|---|---|
| Empezar sin instalaciones adicionales y entender el ciclo del agente | Inventario con JavaScript |
| Trabajar con una modificación pequeña y rápida | Inventario con JavaScript |
| Explorar una solución con varias capas y persistencia | Delivery Board |
| Observar cambios que atraviesan dominio, aplicación, infraestructura y API | Delivery Board |

No es necesario completar los dos. Se puede comenzar con el inventario y utilizar Delivery Board para una demostración más amplia o como siguiente nivel de práctica.
