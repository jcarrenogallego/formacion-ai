# Guía para agentes de desarrollo

## Objetivo del proyecto

Delivery Board es una aplicación formativa. Los cambios deben ser pequeños, comprensibles y mantener la separación entre frontend, API, casos de uso, dominio e infraestructura.

## Reglas de arquitectura

- `Domain` no debe depender de ningún otro proyecto.
- `Application` solo puede depender de `Domain`.
- `Infrastructure` implementa los contratos del dominio y contiene Entity Framework Core.
- `Api` expone Minimal APIs y compone las dependencias.
- No incorporar MediatR, AutoMapper, servicios de dominio ni autenticación sin una petición explícita y aprobada.
- Mantener las versiones de paquetes en `backend/Directory.Packages.props`.
- Añadir o actualizar pruebas en `DeliveryBoard.Application.UnitTests` cuando cambien los casos de uso.
- Mantener el frontend en HTML, CSS y JavaScript sin frameworks ni dependencias nuevas.

## Fuente de verdad y contexto

- El código y las especificaciones versionadas describen el comportamiento actual.
- `context/PROJECT_CONTEXT.md` resume la arquitectura comprobada.
- `context/BASELINE.md` declara el punto de partida del taller.
- Las memorias recuperadas deben contrastarse con el repositorio antes de utilizarlas.
- Un artefacto generado no puede sobrescribir una decisión verificada sin revisión humana.

## Autoridad y handoffs

- Análisis de producto propone reglas y criterios; no elige la implementación técnica.
- Arquitectura propone componentes, contratos y dependencias; no inventa reglas de negocio.
- Desarrollo implementa únicamente work units aprobados; no amplía el alcance.
- Verificación reporta evidencia y defectos; no corrige silenciosamente el candidato.
- Cada handoff debe nombrar su artefacto de entrada, decisiones aprobadas, preguntas abiertas, alcance autorizado y evidencia esperada.
- No copiar conversaciones completas entre etapas. Referenciar artefactos y contexto relevante.
- Un nombre de rol no demuestra aislamiento, paralelismo ni autonomía.

## Gates humanos

No continuar cuando falte alguno de estos gates:

1. baseline técnico verificado;
2. especificación aprobada cuando existan decisiones de comportamiento;
3. arquitectura aprobada cuando el cambio afecte contratos o varias capas;
4. work units autorizados antes de editar;
5. checkpoint, revisión y evidencia técnica antes de aceptar.

Si aparece una decisión nueva durante la implementación, detener el trabajo y volver al gate correspondiente. No modificar el alcance para resolver un bloqueo.

## BMad Method

- La versión fijada para la sesión es BMad Method v6.11.0 con el módulo BMM.
- Para un cambio pequeño, preferir `$bmad-build`.
- Utilizar `$bmad-spec` o `$bmad-architecture` solo cuando aporten claridad o una decisión real.
- BMM base no tiene un agente QA separado; QA es una responsabilidad de verificación mediante desarrollo, checkpoint y code review.
- Test Architect/TEA está fuera de alcance.
- `$bmad-build` autoaplica `patch`, devuelve `bad_spec` a planificación hasta cinco veces y devuelve `intent_gap` a la persona responsable; registrar e inspeccionar esas correcciones.
- No añadir pipelines *unattended* ni mecanismos de autocorrección personalizados; pertenecen a la sesión 6.
- No inventar `bmad validate`; la comprobación oficial disponible es `npx --yes bmad-method@6.11.0 status`.

## Work units

Cada unidad debe entregar un comportamiento verificable e incluir:

- entrada y alcance aprobados;
- dependencias explícitas;
- código y pruebas relacionadas en la misma unidad;
- prueba enfocada y resultado;
- escenario runtime o `N/A` justificado;
- rollback boundary independiente.

No dividir el trabajo únicamente por tipos de archivo o capas si la unidad resultante no funciona por sí misma.

## Verificación mínima

Desde la raíz del proyecto:

```powershell
./scripts/validate-session-05.ps1
```

Para validar el baseline antes de instalar BMad:

```powershell
./scripts/validate-session-05.ps1 -Baseline
```

No se considera terminado un cambio si la especificación, el código, las pruebas y el comportamiento observable no cuentan la misma historia.

## Memoria persistente con Engram

- Al comenzar una tarea relacionada con trabajo anterior, recuperar primero el contexto reciente del proyecto.
- Guardar únicamente decisiones, correcciones, convenciones y descubrimientos reutilizables.
- Estructurar las memorias con `What`, `Why`, `Where` y, cuando aporte valor, `Learned`.
- No guardar secretos, código completo, salidas extensas ni cada comando ejecutado.
- Al terminar una tarea significativa, dejar un resumen con objetivo, trabajo completado, próximos pasos y archivos relevantes.
