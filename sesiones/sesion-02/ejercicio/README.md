# Ejercicio práctico - Refactorización supervisada con Codex

## Objetivo

Utilizar Codex sobre un proyecto real, comunicarle reglas mediante `AGENTS.md`, revisar los cambios que realiza y demostrar con pruebas que la refactorización conserva el comportamiento esperado.

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

Copia el contenido de `sesiones/sesion-02/material/proyecto-inventario/` dentro de tu carpeta personal hasta obtener esta estructura:

```text
estudiantes/<github-login>/sesion-02/ejercicio-01/
├── AGENTS.md
├── README.md
├── prompt.md
├── package.json
├── inventario.js
└── inventario.test.js
```

No modifiques archivos fuera de `estudiantes/<github-login>/`. La validación automática hará fallar la PR si detecta cambios fuera de tu carpeta.

Entra en el proyecto copiado:

```bash
cd estudiantes/<github-login>/sesion-02/ejercicio-01
```

Ejecuta las pruebas iniciales:

```bash
npm test
```

## 3. Examinar las instrucciones

Lee `AGENTS.md` antes de iniciar Codex. Sus reglas exigen, entre otras cosas:

- No modificar los datos de entrada.
- Conservar las exportaciones públicas.
- No añadir dependencias.
- Ejecutar las pruebas.

El código inicial incumple la regla de no modificar los argumentos, aunque las pruebas existentes todavía no lo detectan.

## 4. Trabajar con Codex

Puedes realizar el ejercicio con Codex CLI o con la aplicación de escritorio.

### Desde Codex CLI

Inicia Codex desde la carpeta del ejercicio:

```bash
codex
```

Comprueba el entorno y los permisos:

```text
/status
/permissions
```

### Desde la aplicación de escritorio

Abre como proyecto la carpeta `estudiantes/<github-login>/sesion-02/ejercicio-01/` y crea una nueva tarea local.

### Petición para el agente

Redacta un prompt que solicite:

- Analizar el proyecto y sus instrucciones.
- Detectar el problema del código existente.
- Refactorizarlo sin cambiar la API pública.
- Añadir una prueba que demuestre que los argumentos no se modifican.
- Ejecutar todas las pruebas.
- Resumir los archivos modificados y las verificaciones realizadas.

Guarda el texto exacto en `prompt.md`:

````markdown
# Prompt utilizado

## Interfaz

Codex CLI o aplicación de escritorio.

## Prompt

```text
Escribe aquí el prompt exacto enviado a Codex.
```
````

## 5. Revisar el resultado

No aceptes el resultado únicamente porque Codex indique que terminó.

Fuera de Codex, revisa los cambios:

```bash
git status
git diff -- estudiantes/<github-login>/sesion-02/ejercicio-01
```

Ejecuta personalmente las pruebas:

```bash
npm test
```

Comprueba que:

- `inventario.js` ya no modifica los productos recibidos.
- Las funciones exportadas conservan sus nombres.
- Existe una prueba nueva para detectar mutaciones.
- No se añadieron dependencias.
- Todas las pruebas terminan correctamente.

## 6. Documentar la experiencia

Completa `README.md` con esta estructura:

```markdown
# Entrega de la sesión 2

## Entorno

- Usuario de GitHub:
- Interfaz utilizada: Codex CLI o aplicación de escritorio
- Versión de Codex:

## Trabajo del agente

- Archivos que Codex consultó:
- Archivos que modificó:
- Comandos que ejecutó:

## Cumplimiento de AGENTS.md

Explica qué reglas debía respetar y cómo comprobaste su cumplimiento.

## Revisión del cambio

- Problema encontrado en el código inicial:
- Solución aplicada:
- Prueba añadida:
- Resultado final de `npm test`:

## Supervisión

Describe al menos una decisión, propuesta o resultado de Codex que hayas revisado personalmente.

## Conclusión

1. ¿Qué diferencia observaste entre pedir código en un chat y delegar la tarea a Codex?
2. ¿Qué información útil aportó AGENTS.md?
3. ¿Por qué el mensaje final del agente no es suficiente para aceptar el cambio?
```

No es necesario adjuntar capturas. El prompt, el diff final, las pruebas y el análisis escrito constituyen la evidencia.

## 7. Commit, push y pull request

Verifica que solamente hayas modificado tu carpeta:

```bash
git status
```

Crea el commit:

```bash
git add estudiantes/<github-login>/sesion-02/ejercicio-01
git commit -m "feat: completar ejercicio de la sesion 2"
```

Envía la rama a tu fork:

```bash
git push -u origin <github-login>/sesion-02-ejercicio-01
```

Abre una pull request desde esa rama hacia `jcarrenogallego/formacion-ai:main` y completa la plantilla del repositorio.

## Criterios de evaluación

- La entrega se encuentra únicamente en la carpeta personal correcta.
- `prompt.md` contiene la petición exacta enviada a Codex.
- La refactorización conserva la API pública y evita modificar los argumentos.
- Una prueba automática demuestra que los datos de entrada permanecen intactos.
- Todas las pruebas pasan.
- El análisis explica con palabras propias cómo se supervisó al agente.
