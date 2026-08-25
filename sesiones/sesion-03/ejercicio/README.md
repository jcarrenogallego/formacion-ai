# Ejercicio práctico - Evolucionar Delivery Board mediante SDD

## Objetivo

Transformar un requerimiento ambiguo en una especificación versionada, convertirla en un plan ejecutable, implementar el cambio con Codex y verificar que código, pruebas y contrato representan el mismo comportamiento.

No se proporcionan prompts resueltos. Cada fase debe quedar documentada para mostrar cómo evolucionó la petición inicial.

## 1. Actualizar el fork y crear una rama

```bash
git fetch upstream
git switch main
git merge --ff-only upstream/main
git push origin main
git switch -c <github-login>/sesion-03-ejercicio-01
```

Sustituye `<github-login>` por tu usuario de GitHub. No trabajes directamente sobre `main`.

## 2. Preparar el punto de partida

Copia tu proyecto terminado de la sesión 2:

```text
estudiantes/<github-login>/sesion-02/ejercicio-01/proyecto/
```

dentro de la nueva entrega:

```text
estudiantes/<github-login>/sesion-03/ejercicio-01/
```

Si no dispones de una entrega funcional, utiliza `sesiones/sesion-02/material/proyecto-codex-dotnet/` como punto de partida.

La estructura final será:

```text
estudiantes/<github-login>/sesion-03/ejercicio-01/
├── README.md
├── prompts/
│   ├── 01-descubrimiento.md
│   ├── 02-requisitos.md
│   ├── 03-diseno.md
│   ├── 04-planificacion.md
│   ├── 05-implementacion.md
│   └── 06-verificacion.md
└── proyecto/
    ├── AGENTS.md
    ├── specs/
    │   └── delete-work-items-by-status/
    │       ├── README.md
    │       ├── requirements.md
    │       ├── acceptance.feature
    │       ├── openapi.yaml
    │       ├── implementation-plan.md
    │       └── traceability.md
    ├── frontend/
    └── backend/
```

No modifiques archivos fuera de `estudiantes/<github-login>/`.

## 3. Verificar la base

Antes de iniciar el proceso SDD:

```bash
cd estudiantes/<github-login>/sesion-03/ejercicio-01/proyecto/backend
dotnet tool restore
dotnet build DeliveryBoard.slnx
dotnet test DeliveryBoard.slnx
```

Documenta el resultado inicial. Si partes de tu ejercicio anterior, describe qué funcionalidad de eliminación ya existe.

## 4. Requerimiento original

El único requerimiento inicial es:

> Queremos poder eliminar las tareas que estén en determinados estados.

No presupongas el endpoint, los estados permitidos, la interfaz, los errores ni la implementación.

## 5. Fase de descubrimiento

Pide a Codex que analice el requerimiento, `AGENTS.md` y el proyecto sin modificar código.

El resultado debe identificar:

- Preguntas abiertas.
- Supuestos posibles.
- Decisiones pendientes.
- Restricciones existentes.
- Riesgos.
- Capas y flujos potencialmente afectados.

Responde y documenta personalmente las decisiones. Guarda el prompt inicial y todos sus seguimientos en `prompts/01-descubrimiento.md`.

## 6. Fase de requisitos

Crea `specs/delete-work-items-by-status/requirements.md` con:

- Requerimiento original sin corregir.
- Contexto y problema.
- Historia de usuario.
- Objetivo.
- Alcance.
- Fuera de alcance.
- Glosario.
- Reglas de negocio.
- Precondiciones y postcondiciones.
- Errores esperados.
- Requisitos no funcionales relevantes.
- Decisiones tomadas y supuestos todavía abiertos.

Crea `acceptance.feature` con escenarios Gherkin para:

- Eliminación correcta.
- Conservación de estados no solicitados.
- Solicitud sin estados.
- Estado inválido o no permitido.
- Ausencia de coincidencias.
- Actualización del frontend.

Guarda los prompts en `prompts/02-requisitos.md`.

## 7. Fase de diseño y contrato

Antes de implementar, documenta la solución acordada.

### `README.md` de la especificación

Debe funcionar como índice y resumir estado, objetivo, decisiones y enlaces a los demás artefactos.

### Mermaid

Incluye al menos:

- Flujo desde el usuario hasta PostgreSQL.
- Capas que participan.
- Respuesta correcta y error de negocio.

### `openapi.yaml`

Define:

- Método y ruta.
- Parámetros o cuerpo.
- Estados admitidos.
- Respuesta correcta con cantidad eliminada.
- Errores mediante `ProblemDetails`.
- Ejemplos.

El contrato debe representar una decisión consciente, no copiar el endpoint de la sesión anterior sin revisarlo.

Guarda los prompts y decisiones de esta fase en `prompts/03-diseno.md`.

## 8. Fase de planificación

Pide a Codex que convierta exclusivamente la especificación aprobada en un plan. Todavía no debe implementar.

`implementation-plan.md` debe dividir el trabajo en tareas pequeñas e incluir para cada una:

- Identificador.
- Objetivo.
- Requisito o criterio relacionado.
- Capas o archivos afectados.
- Dependencias.
- Pruebas necesarias.
- Criterio de terminado.

El plan debe cubrir contrato, Domain, Application, Infrastructure, Api, frontend, pruebas y validación final.

Guarda los prompts en `prompts/04-planificacion.md`.

## 9. Fase de implementación

Solicita a Codex que implemente las tareas aprobadas utilizando como fuente de verdad la carpeta:

```text
specs/delete-work-items-by-status/
```

No delegues toda la funcionalidad sin controles intermedios:

1. Ejecuta tareas en un orden justificable.
2. Revisa el diff después de cada bloque relevante.
3. Corrige cualquier interpretación que contradiga la especificación.
4. Actualiza la especificación si una decisión aprobada cambia.
5. Exige las pruebas definidas en el plan.

Guarda el prompt inicial, los seguimientos y las correcciones en `prompts/05-implementacion.md`.

## 10. Fase de verificación

Ejecuta personalmente:

```bash
cd estudiantes/<github-login>/sesion-03/ejercicio-01/proyecto/backend
dotnet build DeliveryBoard.slnx
dotnet test DeliveryBoard.slnx
```

Si dispones de Docker, inicia Aspire:

```bash
dotnet run --project apphost/DeliveryBoard.AppHost
```

Comprueba los escenarios de `acceptance.feature` en `http://localhost:3000`.

Completa `traceability.md`:

| Requisito | Criterio Gherkin | Tarea | Código | Prueba | Estado |
|---|---|---|---|---|---|
| Identificador | Escenario | Tarea | Archivo o símbolo | Test | Cumple/No cumple |

Pide finalmente a Codex una revisión de conformidad entre especificación, código y pruebas. Guarda el prompt y el resultado revisado en `prompts/06-verificacion.md`.

## 11. Cómo documentar cada prompt

Todos los ficheros de `prompts/` deben conservar:

````markdown
# Fase

## Objetivo

Explica qué resultado se buscaba en esta fase.

## Prompt inicial

```text
Texto exacto enviado a Codex.
```

## Seguimientos

```text
Preguntas, correcciones o nuevas instrucciones.
```

## Decisiones

- Decisión aceptada:
- Supuesto rechazado:
- Cambio realizado por el estudiante:

## Resultado revisado

Resume qué produjo Codex y qué comprobaste personalmente.
````

## 12. Documentar la experiencia

Completa el `README.md` de la entrega:

```markdown
# Entrega de la sesión 3

## Punto de partida

- Usuario de GitHub:
- Proyecto utilizado:
- Estado inicial de build y tests:

## Evolución del requerimiento

- Ambigüedades detectadas:
- Decisiones principales:
- Diferencias entre el requerimiento original y la especificación final:

## Flujo SDD

- Descubrimiento:
- Requisitos:
- Diseño:
- Planificación:
- Implementación:
- Verificación:

## Uso de Codex

- Interfaz utilizada:
- Supuesto incorrecto detectado:
- Prompt de seguimiento más importante:
- Decisión tomada personalmente:

## Trazabilidad

- Criterios cubiertos:
- Criterios pendientes, si existen:
- Cambios realizados para evitar deriva:

## Validación

- Resultado de build:
- Resultado de tests:
- Número total de pruebas:
- Resultado de la comprobación manual:

## Conclusión

1. ¿Cómo cambió la implementación al concretar la especificación?
2. ¿Qué reprocesamiento evitó el proceso SDD?
3. ¿Qué información debe permanecer en la especificación y no solo en un prompt?
```

## 13. Commit, push y pull request

```bash
git status
git add estudiantes/<github-login>/sesion-03/ejercicio-01
git commit -m "feat(session-03): complete SDD exercise"
git push -u origin <github-login>/sesion-03-ejercicio-01
```

Abre una pull request hacia `jcarrenogallego/formacion-ai:main` y completa la plantilla.

## Criterios de evaluación

### Especificación

- El requerimiento ambiguo se conserva y se refina sin ocultar su origen.
- Preguntas, supuestos y decisiones están documentados.
- Alcance y fuera de alcance son explícitos.
- La historia de usuario expresa necesidad y valor.
- Gherkin cubre caminos correctos y alternativos.
- Reglas, invariantes y errores son verificables.
- OpenAPI coincide con el comportamiento implementado.
- Mermaid representa el flujo real.

### Planificación e implementación

- El plan divide el trabajo en tareas trazables.
- Cada tarea tiene criterio de terminado y pruebas.
- El código mantiene las dependencias de la arquitectura.
- Frontend y backend funcionan juntos.
- No se añaden patrones o dependencias ajenos a la especificación.

### Verificación

- La solución compila y las pruebas pasan.
- La matriz relaciona requisitos, escenarios, tareas, código y pruebas.
- Las diferencias encontradas se corrigen o quedan explícitamente justificadas.

### Uso de Codex

- Todos los prompts y seguimientos están versionados.
- Las fases de descubrimiento, especificación, planificación, implementación y verificación están separadas.
- Existe evidencia de revisión y decisiones humanas.
- El estudiante puede explicar cómo la especificación redujo ambigüedad y reprocesamiento.
