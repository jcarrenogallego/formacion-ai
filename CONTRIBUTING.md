# Guía de contribución

## Preparar el fork

1. Pulsa **Fork** en GitHub y crea una copia en tu cuenta personal.
2. Clona tu fork:

   ```bash
   git clone https://github.com/<github-login>/formacion-ai.git
   cd formacion-ai
   ```

3. Configura el repositorio central como remoto `upstream`:

   ```bash
   git remote add upstream https://github.com/jcarrenogallego/formacion-ai.git
   ```

4. Antes de cada ejercicio, sincroniza `main` y crea una rama:

   ```bash
   git fetch upstream
   git switch main
   git merge --ff-only upstream/main
   git switch -c <github-login>/sesion-XX-ejercicio-YY
   ```

## Ubicación de las entregas

Todos los archivos modificados por un estudiante deben estar dentro de:

```text
students/<github-login>/
```

El segmento `<github-login>` debe coincidir con el usuario de GitHub que abre el pull request, sin importar diferencias entre mayúsculas y minúsculas.

Organización recomendada:

```text
students/<github-login>/
├── README.md
├── session-01/
│   └── exercise-01/
└── session-02/
    └── exercise-01/
```

No se permite modificar el material de `sessions/`, la configuración de `.github/`, archivos de la raíz ni la carpeta de otro estudiante. La validación automática bloqueará el pull request si detecta cambios fuera de la carpeta autorizada, incluidos renombrados y eliminaciones.

## Enviar una entrega

1. Confirma que tus cambios están limitados a tu carpeta personal.
2. Haz commits descriptivos; por ejemplo, `feat(session-01): complete temperature experiment`.
3. Publica la rama en tu fork.
4. Abre un pull request contra la rama `main` del repositorio central.
5. Completa la plantilla indicando sesión, ejercicio, pruebas y decisiones relevantes.
6. Atiende los comentarios del instructor en la misma rama.

Solo el propietario del repositorio central puede fusionar entregas. La estrategia de integración es **squash merge**.
