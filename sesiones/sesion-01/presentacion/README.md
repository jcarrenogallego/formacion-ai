# Sesión 01 — Fundamentos de IA

Material de formación: un **deck** proyectable (1920×1080) y una **guía de lectura** larga, sincronizados entre sí.

## Archivos

| Archivo | Qué es |
|---|---|
| `Sesion 01 - Fundamentos de IA.dc.html` | El deck. 47 slides. Fuente de verdad. |
| `Guia de lectura - Sesion 01.dc.html` | La guía con el texto completo del README original. |
| `deck-stage.js` | Componente que escala/navega/imprime los slides. No editar. |
| `session-timer.js` | Chip de cuenta atrás por sección. |
| `code-block.js` | Bloque de código con botón de copiar. |
| `support.js` | Runtime de Design Components. Generado, nunca editar. |
| `_ds/nocturne-…/` | Design system Nocturne (CSS + bundle). |
| `portable/*.html` | Exportables autocontenidos (ver abajo). |
| `material/`, `uploads/` | Fuentes originales del contenido. |

## Estructura del deck

Un solo Design Component. Dentro de `<x-dc>`:

1. `<helmet>` — fuentes, design system, `code-block.js`, `session-timer.js`, resets de `body` y estilos de `a`.
2. `<x-import component-from-global-scope="deck-stage" from="./deck-stage.js" width="1920" height="1080">` — el escenario.
3. Los slides: `<section data-label="…" data-screen-label="NN">` hijos directos del `x-import`.

`data-screen-label` es el número de slide con dos dígitos (`"04"` = slide 4). `data-label` es el nombre que sale en el rail de miniaturas. Las notas del ponente van en `data-speaker-notes` del propio `<section>`.

Los slides **no** llevan `position` ni `inset` — el stage los posiciona. Nunca añadir `<script src>` en el cuerpo de la plantilla: solo dentro de `<helmet>`.

## Reglas de estilo (obligatorias)

- **Todo el CSS es inline** en atributos `style`. No hay clases ni hojas de estilo; lo único legal en `<helmet><style>` son `@font-face`, `@keyframes` y resets de `body`.
- Fondo de contenido `#e4e7f5`, texto `#292b31`, secundario `#3f424d` / `#5a5e6b`, acento `#796cbf`, acento oscuro `#5d5294`, superficie de tarjeta `#f3f5fe`, borde `#cfd3e5`.
- Portadas y separadores de bloque: fondo oscuro con `radial-gradient` sobre `#262a60`-ish, eyebrow en `#b5abfc`, título 112px peso 500.
- Slides de contenido: eyebrow 24px mayúsculas con tracking `.2em` + línea de 34px, `h2` 62px peso 500, cuerpo 32px `line-height:1.5`. **Nunca por debajo de 24px.**
- Padding típico de slide de contenido: `64–76px 96px 56–72px`. Radio de tarjeta 14px, píldoras `999px`.
- Layout siempre con flex/grid + `gap`. Una sola secuencia de lectura por slide: evitar dos columnas que compitan por la atención.
- Fuente Inter (Google Fonts) con fallback `system-ui`.

## Cabecera estándar de slide

```html
<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:48px">
  <div style="display:flex;flex-direction:column;gap:16px">
    <div style="display:flex;align-items:center;gap:14px">
      <span style="width:34px;height:2px;background:#796cbf"></span>
      <span style="font-size:24px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:#5d5294">1.3 · Temperature</span>
    </div>
    <h2 style="margin:0;font-size:62px;font-weight:500;letter-spacing:-.025em;line-height:1.05;max-width:1250px">Título</h2>
  </div>
  <session-timer minutes="10" group="1.3" first="first"></session-timer>
</div>
```

## `<session-timer>`

`minutes` = duración, `group` = id de sección. Todos los timers con el mismo `group` comparten un único reloj persistido en `localStorage` (`om-session-timer:<group>`), así la cuenta sigue corriendo al pasar entre slides de la misma sección. `first="first"` marca el primer slide de la sección (icono de bandera). Clic = iniciar/pausar, doble clic = reset.

**Al añadir o mover slides:** el `group` debe coincidir con el de los slides hermanos de esa sección, y solo el primero lleva `first`.

## `<code-block>`

Bloque de código con botón de copiar. El código va como texto dentro del elemento.

## Sincronización deck ↔ guía

Canal `BroadcastChannel('sesion01-sync')` + espejo en `localStorage` bajo `om-sesion01-slide`.

- La **guía** observa qué sección está en pantalla y emite `{type:'goTo', slide:<índice 0-based>}`.
- El **deck** escucha ese mensaje y llama a `goTo(slide)`.
- El mapa sección→slide vive en la constante `SLIDE_OF` de la clase lógica de la guía.

⚠️ **Si cambia el número o el orden de los slides hay que actualizar `SLIDE_OF` en la guía.** Los índices son 0-based (slide 4 = índice 3).

## Cómo editar

- Plantilla del deck: `dc_html_str_replace`. Clase lógica: `dc_js_str_replace`. Reescritura completa: `dc_write`.
- Nunca `write_file` sobre un `.dc.html`.
- Navegar en preview: `document.querySelector('deck-stage').goTo(n)` (0-based).

## Export portable

`portable/*.html` son bundles autocontenidos (un solo archivo, sin dependencias, funcionan offline con doble clic). Se regeneran con el inliner a partir de los `.dc.html`; requieren un `<template id="__bundler_thumbnail">` en el `<head>` (ya está). **Regenerarlos después de cada cambio en el deck o la guía** — no editarlos a mano.

Para PDF: el deck usa `deck-stage`, ya es imprimible (una página por slide).

## Estado / pendientes

- 19 slides de teoría rediseñados con diagramas propios.
- Slides 1.7–1.9 son el walkthrough de instalación, pensados para demo en vivo.
- Bloque de ejercicio: 4 slides; propuesta abierta de reducirlo a 1 + QR.
- Slide de recursos: 4 enlaces; posible cambio a QR + iconos.
