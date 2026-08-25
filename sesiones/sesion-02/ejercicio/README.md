# Ejercicio práctico - Evolución de Delivery Board con Codex

## Objetivo

Trabajar con Codex sobre una aplicación con frontend, backend, base de datos y pruebas. La entrega combina una refactorización técnica con una funcionalidad nueva y exige conservar los prompts utilizados como parte de la evidencia.

Codex puede proponer e implementar cambios, pero cada estudiante debe definir el alcance, revisar el resultado y comprobar personalmente que la solución compila y que sus pruebas pasan.

## 1. Actualizar el fork y crear una rama

Desde tu copia local del repositorio:

```bash
git fetch upstream
git switch main
git merge --ff-only upstream/main
git push origin main
git switch -c <github-login>/sesion-02-ejercicio-01
```

Sustituye `<github-login>` por tu usuario de GitHub. No trabajes directamente sobre `main`.

## 2. Preparar la entrega

Copia el proyecto completo de `sesiones/sesion-02/material/proyecto-codex-dotnet/` dentro de tu carpeta personal hasta obtener esta estructura:

```text
estudiantes/<github-login>/sesion-02/ejercicio-01/
├── README.md
├── prompts/
│   ├── 01-refactor-tests.md
│   └── 02-eliminar-pendientes.md
└── proyecto/
    ├── AGENTS.md
    ├── README.md
    ├── frontend/
    └── backend/
```

No modifiques archivos fuera de `estudiantes/<github-login>/`. La validación automática hará fallar la PR si detecta cambios fuera de tu carpeta.

Entra en el backend copiado y verifica el punto de partida:

```bash
cd estudiantes/<github-login>/sesion-02/ejercicio-01/proyecto/backend
dotnet tool restore
dotnet build DeliveryBoard.slnx
dotnet test DeliveryBoard.slnx
```

## 3. Examinar el proyecto

Antes de pedir cambios a Codex:

1. Lee `proyecto/AGENTS.md`.
2. Localiza las capas Domain, Application, Infrastructure y Api.
3. Revisa `DeliveryBoard.Application.UnitTests`.
4. Comprueba cómo las pruebas actuales crean implementaciones manuales de `IWorkItemRepository`.
5. Ejecuta la aplicación con Aspire si tu entorno dispone de Docker:

```bash
dotnet run --project apphost/DeliveryBoard.AppHost
```

El frontend estará disponible en `http://localhost:3000`.

## 4. Redactar los prompts

No se proporciona un prompt resuelto. Convierte los requisitos de los siguientes apartados en instrucciones claras para Codex.

Guarda en cada fichero:

- La interfaz utilizada: Codex CLI o aplicación de escritorio.
- El prompt inicial exacto.
- Las preguntas o instrucciones de seguimiento que hayas enviado.
- Una explicación breve de por qué incluiste esas indicaciones.

Puedes utilizar esta estructura:

````markdown
# Prompt utilizado

## Interfaz

Codex CLI o aplicación de escritorio.

## Prompt inicial

```text
Escribe aquí el texto exacto enviado a Codex.
```

## Seguimientos

```text
Añade aquí las instrucciones posteriores, si fueron necesarias.
```

## Decisiones del prompt

Explica qué información decidiste hacer explícita y por qué.
````

## 5. Refactorizar las pruebas unitarias

Redacta y ejecuta un prompt para que Codex refactorice las pruebas de `DeliveryBoard.Application.UnitTests`.

### Requisitos

- Incorporar **Moq** como dependencia del proyecto de pruebas.
- Mantener la versión de Moq centralizada en `backend/Directory.Packages.props`.
- Sustituir las implementaciones manuales de `IWorkItemRepository` por mocks creados con Moq.
- Eliminar las clases `FakeWorkItemRepository` de las pruebas.
- Organizar cada prueba con el patrón **AAA** de forma visible:
  - `// Arrange`: preparación de datos y mocks.
  - `// Act`: ejecución del caso de uso.
  - `// Assert`: comprobación del resultado y de las interacciones.
- Verificar con Moq las llamadas relevantes al repositorio.
- Conservar el comportamiento cubierto por las pruebas actuales.
- No modificar el código de producción para facilitar el test.
- Ejecutar todas las pruebas al terminar.

Guarda el prompt y sus seguimientos en `prompts/01-refactor-tests.md`.

## 6. Implementar el evolutivo: eliminar pendientes

Redacta y ejecuta otro prompt para añadir una funcionalidad que elimine todas las tareas con estado `Pending`.

### Frontend

- Añadir el botón **Eliminar pendientes** junto al botón **Actualizar** del panel `Trabajo reciente`.
- Deshabilitarlo mientras se procesa la solicitud.
- Llamar al backend mediante `DELETE /api/work-items/pending`.
- Volver a cargar el dashboard cuando la operación termine correctamente.
- Mostrar la cantidad de tareas eliminadas.
- Mostrar el detalle del error de negocio cuando no existan tareas pendientes.
- Mantener JavaScript sin frameworks ni dependencias adicionales.

### Backend

- Ampliar `IWorkItemRepository` con una operación asíncrona para eliminar las tareas pendientes y devolver la cantidad eliminada.
- Implementar la operación en Infrastructure mediante Entity Framework Core.
- Crear en Application una interfaz y un caso de uso específico.
- Lanzar `BusinessRuleException` con el mensaje exacto `No hay tareas pendientes para eliminar.` cuando no se elimine ninguna tarea.
- Registrar el caso de uso en la inyección de dependencias.
- Exponer `DELETE /api/work-items/pending` desde la Minimal API.
- Devolver `200 OK` con un objeto que contenga `deletedCount` cuando la operación sea correcta.
- Mantener el manejo global existente mediante `ProblemDetails`.
- No añadir MediatR, AutoMapper ni servicios de dominio.

### Pruebas del evolutivo

- Añadir pruebas unitarias para el caso de uso nuevo.
- Utilizar Moq y el patrón AAA explícito.
- Comprobar que devuelve la cantidad eliminada cuando el repositorio devuelve un valor mayor que cero.
- Comprobar que lanza `BusinessRuleException` cuando el repositorio devuelve cero.
- Verificar el mensaje exacto de la excepción.
- Verificar las llamadas realizadas al repositorio.

Guarda el prompt y sus seguimientos en `prompts/02-eliminar-pendientes.md`.

## 7. Revisar y validar el resultado

No aceptes el resultado únicamente porque Codex indique que terminó.

Revisa los cambios:

```bash
git status
git diff -- estudiantes/<github-login>/sesion-02/ejercicio-01
```

Ejecuta personalmente:

```bash
cd estudiantes/<github-login>/sesion-02/ejercicio-01/proyecto/backend
dotnet build DeliveryBoard.slnx
dotnet test DeliveryBoard.slnx
```

Si dispones de Docker, inicia Aspire y comprueba en el navegador:

1. Crear varias tareas pendientes.
2. Pulsar `Eliminar pendientes`.
3. Verificar que desaparecen y se actualizan los contadores.
4. Pulsar nuevamente el botón.
5. Verificar que aparece el mensaje `No hay tareas pendientes para eliminar.`.

## 8. Documentar la experiencia

Completa el `README.md` de la entrega:

```markdown
# Entrega de la sesión 2

## Entorno

- Usuario de GitHub:
- Interfaz utilizada:
- Versión de Codex:

## Refactorización de pruebas

- Problema de la implementación inicial:
- Cambios realizados para utilizar Moq:
- Cómo se aplicó el patrón AAA:
- Verificaciones del repositorio añadidas:

## Evolutivo

- Capas y archivos modificados:
- Flujo desde el botón hasta PostgreSQL:
- Regla de negocio incorporada:
- Pruebas añadidas:

## Supervisión

- Propuesta de Codex que revisaste o corregiste:
- Instrucción de seguimiento que necesitaste:
- Decisión que validaste personalmente:

## Validación

- Resultado de `dotnet build DeliveryBoard.slnx`:
- Resultado de `dotnet test DeliveryBoard.slnx`:
- Número total de pruebas:
- Resultado de la comprobación manual:

## Conclusión

1. ¿Qué información faltó en tu primer prompt?
2. ¿Qué cambió después de añadir instrucciones más concretas?
3. ¿Por qué las pruebas deben formar parte explícita de la definición de terminado?
```

No es necesario adjuntar capturas. El código, los prompts, las pruebas y el análisis escrito constituyen la evidencia.

## 9. Commit, push y pull request

Confirma que todos los cambios están dentro de tu carpeta:

```bash
git status
```

Crea el commit:

```bash
git add estudiantes/<github-login>/sesion-02/ejercicio-01
git commit -m "feat(session-02): complete Delivery Board exercise"
```

Publica la rama:

```bash
git push -u origin <github-login>/sesion-02-ejercicio-01
```

Abre una pull request hacia `jcarrenogallego/formacion-ai:main` y completa la plantilla del repositorio.

## Criterios de evaluación

- La entrega modifica únicamente `estudiantes/<github-login>/`.
- El proyecto completo está incluido en `proyecto/`.
- Los prompts exactos y sus seguimientos están versionados en Markdown.
- Las pruebas utilizan Moq y muestran explícitamente Arrange, Act y Assert.
- No quedan repositorios falsos implementados manualmente en las pruebas.
- El evolutivo atraviesa correctamente frontend, API, Application, Domain e Infrastructure.
- La ausencia de pendientes produce el error de negocio solicitado.
- La solución compila y todas las pruebas pasan.
- El README explica cómo se supervisó y verificó el trabajo del agente.