# Guía de contribución

## Preparar el fork

1. Pulsa **Fork** en GitHub y crea una copia en tu cuenta personal.
2. Clona tu fork:

   ```bash
   git clone https://github.com/<github-login>/formacion-ai.git
   cd formacion-ai
   ```

3. Configura una sola vez el repositorio central como remoto `upstream`:

   ```bash
   git remote add upstream https://github.com/jcarrenogallego/formacion-ai.git
   ```

   `origin` apunta a tu fork y `upstream` al repositorio central. Tener ambos permite descargar las novedades del curso sin confundir el repositorio al que publicas tus ramas.

4. Antes de cada ejercicio, actualiza tu `main` local y crea una rama:

   ```bash
   git fetch upstream
   git switch main
   git merge --ff-only upstream/main
   git switch -c <github-login>/sesion-XX-ejercicio-YY
   ```

   `--ff-only` no crea un commit de merge: simplemente adelanta tu `main` hasta la versión del repositorio central. Si el comando falla, no fuerces la operación; comprueba que no hayas creado commits propios directamente en `main`.

## Ubicación de las entregas

Todos los archivos modificados por un estudiante deben estar dentro de:

```text
estudiantes/<github-login>/
```

El segmento `<github-login>` debe coincidir con el usuario de GitHub que abre el pull request, sin importar diferencias entre mayúsculas y minúsculas.

Organización recomendada:

```text
estudiantes/<github-login>/
├── README.md
├── sesion-01/
│   └── ejercicio-01/
└── sesion-02/
    └── ejercicio-01/
```

No se permite modificar el material de `sesiones/`, la configuración de `.github/`, archivos de la raíz ni la carpeta de otro estudiante. La validación automática bloqueará el pull request si detecta cambios fuera de la carpeta autorizada, incluidos renombrados y eliminaciones.

La carpeta `estudiantes/josecarreno/` es un ejemplo de solo lectura. Reproduce su estructura dentro de tu propia carpeta, pero no la modifiques ni envíes allí tus entregas.

## Enviar una entrega

1. Confirma que tus cambios están limitados a tu carpeta personal.
2. Haz commits descriptivos; por ejemplo, `feat(session-01): complete temperature experiment`.
3. Publica la rama en tu fork.
4. Abre un pull request contra la rama `main` del repositorio central.
5. Completa la plantilla indicando sesión, ejercicio, pruebas y decisiones relevantes.
6. Atiende los comentarios del instructor en la misma rama.

## Mantener actualizado un pull request

No necesitas actualizar constantemente una rama de entrega. Hazlo cuando GitHub indique que está desactualizada o cuando necesites incorporar material nuevo de `main`.

- Opción más sencilla: usa **Update branch** en la página del pull request, si GitHub muestra el botón y no hay conflictos.
- Alternativa por terminal:

  ```bash
  git fetch upstream
  git switch <rama-de-la-entrega>
  git merge upstream/main
  git push origin <rama-de-la-entrega>
  ```

No recomendamos hacer rebase de una rama que ya está publicada. El rebase reescribe sus commits y normalmente exige un `git push --force-with-lease`, una operación más difícil de recuperar si se ejecuta sobre la rama equivocada. Los commits de merge de la rama de entrega no ensuciarán `main`, porque el instructor integra los pull requests mediante **squash merge**.

Solo el propietario del repositorio central puede fusionar entregas. La estrategia de integración es **squash merge**.
