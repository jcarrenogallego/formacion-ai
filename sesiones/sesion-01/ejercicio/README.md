# Ejercicio práctico - Inferencia con un modelo local
# HOLA MUNDO
## Objetivo

Ejecutar un modelo de código con Ollama, utilizar el mismo prompt con dos temperaturas, comprobar las soluciones en el navegador y explicar con tus propias palabras las diferencias observadas.

La entrega debe demostrar que sabes:

- Ejecutar un modelo local.
- Cambiar `temperature` durante la inferencia.
- Consultar las métricas generadas por Ollama.
- Validar código generado por IA antes de aceptarlo.
- Enviar el trabajo desde un fork mediante un pull request.

## 1. Preparar el repositorio

### Crear y clonar el fork

1. Abre el repositorio [jcarrenogallego/formacion-ai](https://github.com/jcarrenogallego/formacion-ai).
2. Pulsa **Fork** y crea una copia en tu cuenta de GitHub.
3. Clona tu fork y entra en el proyecto:

```bash
git clone https://github.com/<github-login>/formacion-ai.git
cd formacion-ai
```

Sustituye `<github-login>` por tu nombre de usuario de GitHub.

### Configurar el repositorio central

Este paso se realiza una sola vez:

```bash
git remote add upstream https://github.com/jcarrenogallego/formacion-ai.git
```

Comprueba los remotos:

```bash
git remote -v
```

`origin` debe apuntar a tu fork y `upstream` al repositorio central del curso.

### Actualizar `main` y crear la rama

```bash
git fetch upstream
git switch main
git merge --ff-only upstream/main
git switch -c <github-login>/sesion-01-ejercicio-01
```

No trabajes directamente sobre `main`.

## 2. Crear la estructura de la entrega

Crea esta estructura dentro de tu carpeta personal:

```text
estudiantes/<github-login>/sesion-01/ejercicio-01/
├── README.md
├── prompt.md
├── solucion-temperature-0.js
└── solucion-temperature-1-5.js
```

El nombre de la carpeta `<github-login>` debe coincidir con el usuario que abrirá el pull request.

No modifiques archivos fuera de `estudiantes/<github-login>/`. La validación automática hará fallar la PR si detecta cambios en el material del curso, la configuración o la carpeta de otra persona.

## 3. Problema que debe resolver el modelo

Pide al modelo una función JavaScript llamada `resumirTareas` que:

- Reciba un array de tareas.
- Cada tarea contenga `titulo` y `completada`.
- Devuelva el número total de tareas.
- Devuelva los títulos de las tareas completadas.
- Devuelva los títulos de las tareas pendientes.
- No modifique el array original.
- Funcione con un array vacío.
- No utilice librerías externas.
- Incluya ejemplos con `console.log` para probarla en el navegador.

Debes redactar tu propio prompt incluyendo estos requisitos. Utilizarás exactamente el mismo texto en las dos pruebas.

## 4. Documentar el prompt

Guarda en `prompt.md` el modelo y el prompt exacto que utilizaste:

````markdown
# Prompt utilizado

## Modelo

`nombre-del-modelo`

## Prompt

```text
Escribe aquí el prompt exacto enviado a Ollama.
```
````

No corrijas el prompt después de ver las respuestas. Necesitamos comparar las dos temperaturas con la misma entrada.

## 5. Ejecutar las dos pruebas

Abre el modelo recomendado para tu equipo:

```bash
ollama run NOMBRE_DEL_MODELO
```

Activa las estadísticas de inferencia:

```text
/set verbose
```

### Prueba A: `temperature = 0.0`

```text
/set parameter temperature 0.0
/clear
```

Envía el prompt guardado en `prompt.md`. Copia manualmente únicamente el código JavaScript de la respuesta en:

```text
solucion-temperature-0.js
```

### Prueba B: `temperature = 1.5`

```text
/set parameter temperature 1.5
/clear
```

Envía exactamente el mismo prompt. Copia manualmente el código JavaScript de esta respuesta en:

```text
solucion-temperature-1-5.js
```

No mejores ni mezcles las soluciones antes de documentar los resultados. Queremos analizar lo que produjo el modelo con cada configuración.

## 6. Probar las soluciones

Para cada archivo:

1. Abre las herramientas de desarrollo del navegador con `F12`.
2. Selecciona **Consola** o **Console**.
3. Copia y pega el código completo.
4. Pulsa `Enter` y revisa el resultado.

Como mínimo, prueba:

- Un array con tareas completadas y pendientes.
- Un array vacío.
- Un array con todas las tareas completadas.
- Un array con todas las tareas pendientes.

Comprueba también que el array original no haya sido modificado.

## 7. Escribir el análisis

Crea `README.md` utilizando esta estructura y responde con tus propias palabras:

```markdown
# Entrega de la sesión 1

## Entorno

- Usuario de GitHub:
- Versión de Ollama:
- Modelo utilizado:
- Resultado de `ollama ps` para `PROCESSOR`:

## Métricas observadas

### Temperature 0.0

- Tokens evaluados o generados:
- Velocidad mostrada por Ollama:

### Temperature 1.5

- Tokens evaluados o generados:
- Velocidad mostrada por Ollama:

## Validación

### Solución con temperature 0.0

- ¿Se ejecutó sin errores?
- ¿Cumplió todos los requisitos?
- Casos que probaste:

### Solución con temperature 1.5

- ¿Se ejecutó sin errores?
- ¿Cumplió todos los requisitos?
- Casos que probaste:

## Diferencias observadas

Describe las diferencias visibles entre ambas soluciones: estructura, claridad, decisiones adicionales, errores o formas diferentes de resolver el problema.

## Conclusiones

1. ¿Qué solución cumplió mejor los requisitos y por qué?
2. ¿Una temperatura mayor hizo al modelo más inteligente? Explica tu respuesta.
3. ¿Por qué debemos ejecutar y revisar el código generado antes de utilizarlo?
```

No es necesario adjuntar capturas de pantalla. La evidencia estará en el prompt, el código, las métricas registradas y tu análisis.

## 8. Revisar y publicar la entrega

Comprueba que solamente modificaste tu carpeta:

```bash
git status --short
git diff --check
```

Añade los archivos, crea el commit y publica la rama:

```bash
git add estudiantes/<github-login>/sesion-01/ejercicio-01
git commit -m "feat(session-01): complete ollama experiment"
git push -u origin <github-login>/sesion-01-ejercicio-01
```

## 9. Abrir el pull request

1. Abre tu fork en GitHub.
2. Pulsa **Compare & pull request** para la rama publicada.
3. Confirma que el destino sea `jcarrenogallego/formacion-ai` y la rama `main`.
4. Completa la plantilla de la PR.
5. Revisa que **Files changed** contenga únicamente archivos de `estudiantes/<github-login>/`.
6. Crea el pull request y espera la validación automática.

Si necesitas corregir algo, modifica los archivos en la misma rama, crea otro commit y ejecuta de nuevo:

```bash
git push
```

La PR se actualizará automáticamente. No abras otra para la misma entrega.

## Criterios de evaluación

| Criterio | Puntos |
|---|---:|
| Prompt claro que incluye todos los requisitos | 2 |
| Dos soluciones JavaScript completas | 2 |
| Validación con diferentes casos | 2 |
| Comparación correcta de las temperaturas | 2 |
| Registro del entorno y las métricas | 1 |
| Organización y claridad de la entrega | 1 |
| **Total** | **10** |

## Lista de comprobación

- [ ] Trabajé desde una rama de mi fork.
- [ ] Mi carpeta coincide con mi usuario de GitHub.
- [ ] Guardé el prompt exacto en `prompt.md`.
- [ ] Creé un archivo JavaScript por temperatura.
- [ ] Probé ambas soluciones en el navegador.
- [ ] Escribí las diferencias con mis propias palabras.
- [ ] Solo modifiqué archivos dentro de mi carpeta personal.
- [ ] Abrí la PR contra `jcarrenogallego/formacion-ai:main`.
