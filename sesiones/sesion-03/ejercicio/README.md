# Ejercicio práctico - Evolucionar Delivery Board con OpenSpec

## Objetivo

Utilizar OpenSpec y Codex para convertir un requerimiento ambiguo en una propuesta completa, revisar las decisiones, implementar el cambio y verificar que el código coincide con la especificación.

No debes redactar manualmente un plan completo ni pedir a Codex que implemente directamente. El objetivo es utilizar el flujo instalado por OpenSpec.

## 1. Preparar la rama y la carpeta personal

Actualiza `main` desde el repositorio central y crea una rama:

```powershell
git switch main
git fetch upstream
git rebase upstream/main
git push origin main
git switch -c sesion-03-open-spec
```

Crea la entrega usando exactamente tu usuario de GitHub:

```text
estudiantes/<github-login>/sesion-03/ejercicio-01/
```

## 2. Copiar el proyecto

Utiliza la copia de Delivery Board preparada para esta sesión:

```text
sesiones/sesion-03/material/proyecto-codex-dotnet/
```

dentro de:

```text
estudiantes/<github-login>/sesion-03/ejercicio-01/proyecto/
```

La entrega debe conservar `frontend/`, `backend/`, `.agents/` y `openspec/`.

## 3. Comprobar el punto de partida

Desde `proyecto/backend`:

```powershell
dotnet tool restore
dotnet build DeliveryBoard.slnx
dotnet test DeliveryBoard.slnx
```

No continúes hasta que la base compile y sus pruebas pasen.

## 4. Preparar OpenSpec

Comprueba las herramientas:

```powershell
node --version
openspec --version
```

Si OpenSpec no está instalado:

```powershell
npm install -g @fission-ai/openspec@latest
```

Desde la raíz de `proyecto/`, actualiza o inicializa la integración con Codex:

```powershell
openspec init --tools codex --no-animation
```

Reinicia Codex después de la inicialización para que detecte las skills del proyecto.

### Opción A: Codex CLI

Desde la raíz de `proyecto/`:

```powershell
codex
```

Escribe las invocaciones `$openspec-*` dentro del chat que se abre, no en PowerShell.

### Opción B: aplicación visual de Codex

Abre la carpeta `proyecto/` como espacio de trabajo y crea una tarea nueva. En el cuadro de texto escribe `$` para localizar las skills instaladas o introduce directamente `$openspec-explore`.

En ambas opciones, confirma que la carpeta activa es la que contiene `.agents/skills/` y `openspec/`. Utiliza la misma tarea durante la exploración, la propuesta, la revisión y la implementación para conservar el contexto.

## 5. Requerimiento original

Este es el único requerimiento inicial:

> Queremos poder eliminar las tareas que estén en determinados estados.

No añadas una solución técnica antes de iniciar el flujo. Las decisiones deben aparecer durante la exploración y revisión.

## 6. Explorar

Invoca la skill desde Codex:

```text
$openspec-explore Analiza el requerimiento de eliminar tareas que estén en determinados estados. Examina Delivery Board, identifica las ambigüedades y ayúdame a decidir el comportamiento. No implementes todavía.
```

Responde las preguntas con tus propias decisiones. Como mínimo deben quedar claros:

- qué estados permiten eliminación;
- si se elimina una tarea, varias o todas las coincidentes;
- qué sucede cuando no hay coincidencias;
- qué confirmación necesita el usuario;
- qué elementos del frontend y backend cambiarán;
- cómo se comprobará el comportamiento.

## 7. Proponer

Cuando hayas entendido la necesidad, ejecuta:

```text
$openspec-propose Queremos poder eliminar las tareas que estén en los estados acordados durante la exploración. Genera la propuesta completa, las especificaciones, el diseño y las tareas. No implementes todavía.
```

Comprueba que se ha creado un cambio dentro de:

```text
openspec/changes/<nombre-del-cambio>/
```

## 8. Revisar y corregir

Lee todos los artefactos generados. No aceptes automáticamente el resultado.

Verifica que incluyan:

- objetivo, alcance y elementos fuera de alcance;
- reglas de negocio y comportamiento cuando no hay coincidencias;
- criterios de aceptación observables;
- cambios previstos en frontend, API, aplicación, dominio e infraestructura;
- contrato del endpoint;
- tareas de implementación y pruebas;
- estrategia de verificación.

Si algo falta o es incorrecto, utiliza la skill de actualización. Escribe tú mismo las correcciones necesarias:

```text
$openspec-update-change <describe aquí las decisiones o correcciones>
```

Puedes repetir esta fase. **No ejecutes la implementación hasta aprobar personalmente la propuesta, el diseño y las tareas.**

## 9. Validar los artefactos

```powershell
openspec validate --all --strict --no-interactive
```

Corrige los errores antes de continuar.

## 10. Implementar

Cuando el plan esté aprobado:

```text
$openspec-apply-change
```

Revisa los cambios que realice Codex. La solución debe incluir, como mínimo:

- comportamiento real de eliminación en el backend;
- regla o error de negocio cuando corresponda;
- endpoint de Minimal API;
- persistencia mediante el repositorio;
- botón y confirmación en el frontend;
- actualización de los datos visibles;
- pruebas unitarias de los casos principales y de error.

No corrijas manualmente un problema sin comunicárselo al agente: utiliza la conversación para que el flujo y las decisiones queden registrados.

## 11. Verificar

Desde `proyecto/backend`:

```powershell
dotnet build DeliveryBoard.slnx
dotnet test DeliveryBoard.slnx
```

Desde la raíz de `proyecto/`:

```powershell
openspec validate --all --strict --no-interactive
git diff --check
```

Ejecuta Aspire y comprueba desde el frontend:

1. El botón aparece en el lugar previsto.
2. La aplicación solicita confirmación.
3. Se eliminan únicamente las tareas permitidas.
4. Las tareas de otros estados se conservan.
5. El error de negocio se muestra de forma comprensible.
6. El tablero se actualiza después de la operación.

Si el código no coincide con la especificación, pide a Codex que corrija la implementación o actualiza primero la especificación si la decisión cambió.

## 12. Archivar el cambio

Cuando los artefactos, el código y las pruebas estén alineados:

```text
$openspec-archive-change
```

Vuelve a ejecutar:

```powershell
openspec validate --all --strict --no-interactive
```

El historial archivado y las especificaciones actualizadas forman parte de la entrega.

## 13. Documentar la experiencia

Crea `README.md` dentro de la carpeta del ejercicio e incluye brevemente:

- el requerimiento original;
- las ambigüedades detectadas;
- las decisiones que tomaste;
- los nombres de las skills utilizadas;
- qué corregiste durante la revisión;
- qué verificaciones ejecutaste y sus resultados;
- una diferencia concreta entre pedir código directamente y utilizar OpenSpec.

Crea también `PROMPTS.md` y conserva:

- el texto inicial enviado a `explore` y `propose`;
- los seguimientos con los que aclaraste o corregiste la propuesta;
- cualquier indicación adicional necesaria durante `apply`;
- no es necesario copiar las respuestas completas de Codex porque los artefactos de OpenSpec ya contienen el resultado estructurado.

## Estructura esperada

```text
ejercicio-01/
├── README.md
├── PROMPTS.md
└── proyecto/
    ├── .agents/skills/
    ├── openspec/
    │   ├── config.yaml
    │   ├── specs/
    │   └── changes/archive/
    ├── frontend/
    └── backend/
```

## 14. Commit, push y pull request

```powershell
git add estudiantes/<github-login>/sesion-03/ejercicio-01
git commit -m "feat(sesion-03): completar ejercicio con OpenSpec"
git push -u origin sesion-03-open-spec
```

Abre una pull request hacia `jcarrenogallego/formacion-ai:main`. No incluyas cambios fuera de tu carpeta personal.

## Criterios de evaluación

- El flujo de OpenSpec fue utilizado y sus artefactos están versionados.
- Las ambigüedades se resolvieron mediante decisiones explícitas.
- La propuesta, el diseño y las tareas fueron revisados antes de implementar.
- La implementación respeta los artefactos aprobados.
- Las pruebas cubren casos correctos y errores de negocio.
- Build, tests y validación de OpenSpec finalizan correctamente.
- `README.md` y `PROMPTS.md` explican el proceso con palabras propias.
