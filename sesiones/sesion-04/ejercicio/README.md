# Ejercicio práctico - Refactorización guiada por contexto persistente

## Objetivo

Construir un mapa de contexto de Delivery Board, conservar decisiones importantes en Engram y utilizar ese conocimiento desde una tarea nueva de Codex para planificar e implementar una refactorización transversal.

## 1. Preparar la rama y la entrega

```powershell
git switch main
git fetch upstream
git rebase upstream/main
git push origin main
git switch -c sesion-04-contexto-persistente
```

Crea:

```text
estudiantes/<github-login>/sesion-04/ejercicio-01/
```

## 2. Copiar el proyecto

Copia:

```text
sesiones/sesion-04/material/proyecto-codex-dotnet/
```

dentro de:

```text
estudiantes/<github-login>/sesion-04/ejercicio-01/proyecto/
```

No copies `bin/`, `obj/`, `node_modules/`, bases de datos locales ni credenciales.

## 3. Verificar la base

Desde `proyecto/`:

```powershell
./scripts/validate-sdd.ps1
```

La solución debe compilar y sus pruebas deben pasar antes de comenzar.

## 4. Configurar Engram para tu proyecto

Comprueba que Engram está disponible:

```powershell
engram version
engram stats
```

Abre `proyecto/.codex/config.toml` y reemplaza:

```text
delivery-board-estudiante
```

por un identificador único:

```text
delivery-board-<github-login>
```

No guardes rutas privadas, tokens ni credenciales en el fichero. Reinicia Codex desde la raíz de `proyecto/` para cargar el MCP.

### Codex CLI

```powershell
codex
```

### Aplicación visual

Abre `proyecto/` como espacio de trabajo y crea una tarea nueva.

En cualquiera de las dos interfaces, pide:

```text
Comprueba que Engram está conectado para este proyecto. Recupera el contexto reciente y dime únicamente si existe memoria previa; todavía no modifiques archivos.
```

## 5. Construir el mapa de contexto

Utiliza Codex para explorar el proyecto y completa:

```text
proyecto/context/PROJECT_CONTEXT.md
```

El resultado debe ser breve y verificable. Incluye:

- objetivo del sistema;
- módulos y responsabilidades;
- dependencias permitidas y prohibidas;
- entidades, estados e invariantes;
- flujo desde el frontend hasta PostgreSQL;
- contratos principales;
- pruebas existentes;
- riesgos conocidos.

Comprueba cada afirmación importante contra el código. No conviertas el documento en un inventario de todas las clases.

## 6. Guardar memoria curada

Pide a Codex que guarde en Engram tres observaciones separadas:

1. arquitectura y dependencias;
2. reglas e invariantes del dominio;
3. comandos de verificación y riesgos conocidos.

Ejemplo de petición, sin copiar una respuesta prefabricada:

```text
Guarda en Engram las decisiones arquitectónicas que acabamos de comprobar. Usa memorias breves con What, Why, Where y Learned. No guardes código completo, secretos ni afirmaciones que no hayamos verificado.
```

Crea `MEMORY.md` en la raíz del ejercicio y registra únicamente:

- título de cada memoria;
- motivo por el que será útil más adelante;
- archivos utilizados para comprobarla.

No versiones la base SQLite de Engram.

## 7. Comprobar la persistencia

Finaliza la tarea actual después de pedir un resumen de sesión. A continuación, abre una **tarea nueva** de Codex en la misma carpeta y solicita:

```text
Recupera de Engram el contexto de Delivery Board relacionado con arquitectura, dominio y validaciones. Contrasta las memorias con el repositorio actual y señala cualquier diferencia antes de continuar.
```

Anota en `README.md`:

- qué información se recuperó sin repetirla en el prompt;
- qué hubo que volver a comprobar en el código;
- qué información habría sido ruido y no se guardó.

## 8. Requerimiento de refactorización

Trabaja con este requerimiento:

> La prioridad de una tarea debe dejar de tratarse como texto libre y convertirse en un concepto de dominio tipado, manteniendo compatible el contrato utilizado por el frontend.

Todavía no implementes. Pide a Codex un análisis de impacto basado en el mapa y en las memorias recuperadas.

El análisis debe considerar:

- entidad y reglas de dominio;
- contratos y mapeos de Application;
- configuración y migración de Entity Framework;
- endpoint y documentación de la API;
- frontend y compatibilidad del valor enviado;
- pruebas existentes y nuevas pruebas necesarias;
- datos ya almacenados;
- componentes que no necesitan modificarse.

## 9. Revisar el plan

Guarda en `IMPACT_ANALYSIS.md`:

- resumen del cambio;
- componentes afectados y motivo;
- contratos e invariantes que deben conservarse;
- riesgos y estrategia de migración;
- orden de implementación;
- verificaciones necesarias;
- elementos fuera de alcance.

Corrige el análisis hasta que cada cambio propuesto tenga una razón comprobable. Después utiliza OpenSpec para crear o actualizar la especificación del cambio sin iniciar todavía la implementación.

## 10. Implementar y verificar

Cuando hayas aprobado el análisis y la especificación, autoriza a Codex para implementar el cambio.

La solución debe:

- representar la prioridad mediante un tipo de dominio explícito;
- rechazar valores no admitidos;
- mantener compatible el contrato esperado por el frontend;
- persistir correctamente el valor;
- incluir pruebas unitarias para valores válidos e inválidos;
- evitar modificaciones en componentes no afectados.

Ejecuta:

```powershell
./scripts/validate-sdd.ps1
```

Después levanta Aspire y comprueba manualmente que se pueden crear y visualizar tareas con las prioridades admitidas.

## 11. Guardar el aprendizaje final

Pide a Codex que:

1. guarde solamente las decisiones y descubrimientos reutilizables;
2. actualice una memoria anterior si una decisión cambió;
3. cree el resumen final de sesión con próximos pasos y archivos relevantes.

No guardes como memoria que «las pruebas pasaron hoy»: registra, en cambio, cuál es el comando estable de validación y qué comportamiento protege.

## 12. Documentar la entrega

Crea `PROMPTS.md` e incluye:

- petición de recuperación inicial;
- instrucciones para construir el mapa;
- solicitud de guardado de memorias;
- recuperación desde la segunda tarea;
- análisis de impacto;
- correcciones del plan;
- autorización final de implementación.

En `README.md`, explica con tus palabras:

- diferencia entre contexto, memoria y fuente de verdad;
- qué memorias fueron realmente útiles;
- un supuesto que tuviste que verificar;
- un impacto que habría sido fácil pasar por alto;
- cómo ayudó Engram durante la segunda tarea;
- qué papel cumplió Gentle AI y qué papel cumplió Engram.

## Estructura esperada

```text
ejercicio-01/
├── README.md
├── PROMPTS.md
├── MEMORY.md
├── IMPACT_ANALYSIS.md
└── proyecto/
    ├── .codex/config.toml
    ├── context/PROJECT_CONTEXT.md
    ├── frontend/
    ├── backend/
    ├── openspec/
    └── scripts/
```

## 13. Commit, push y pull request

```powershell
git add estudiantes/<github-login>/sesion-04/ejercicio-01
git commit -m "feat(sesion-04): completar ejercicio de contexto persistente"
git push -u origin sesion-04-contexto-persistente
```

Abre una pull request hacia `jcarrenogallego/formacion-ai:main`. No modifiques archivos fuera de tu carpeta personal.

## Criterios de evaluación

- El mapa de contexto es breve, correcto y está respaldado por el código.
- Las memorias son curadas, reutilizables y no contienen secretos.
- La segunda tarea recupera contexto sin repetir toda la explicación.
- El análisis de impacto cubre dominio, contratos, persistencia, frontend y pruebas.
- La implementación respeta la arquitectura y conserva la compatibilidad.
- Build, tests y validación OpenSpec finalizan correctamente.
- La documentación diferencia claramente Engram de Gentle AI.
