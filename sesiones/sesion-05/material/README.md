# Material de la sesión 5

## Camino rápido

1. Copia [`proyecto-codex-dotnet`](proyecto-codex-dotnet/) dentro de tu entrega personal.
2. Ejecuta `./scripts/validate-session-05.ps1 -Baseline` desde la copia.
3. Configura el identificador de Engram.
4. Ejecuta `./scripts/install-bmad.ps1` únicamente dentro de tu copia.
5. Reinicia Codex y comprueba `npx --yes bmad-method@6.11.0 status`.

## Qué contiene

El proyecto continúa el hilo de Delivery Board utilizado en las sesiones anteriores:

- frontend con HTML, CSS y JavaScript sin frameworks;
- API y backend con .NET 10 y C# 14;
- separación entre Domain, Application, Infrastructure y Api;
- Entity Framework Core, PostgreSQL y .NET Aspire;
- pruebas unitarias con xUnit;
- OpenSpec y su script de validación;
- configuración de proyecto para Engram;
- contexto arquitectónico verificado para evitar repetir el taller de la sesión 4.

## Qué no contiene

El material canónico no incluye:

- `_bmad/`;
- `_bmad-output/`;
- las skills generadas por BMad Method;
- bases SQLite o memorias locales de Engram;
- `bin/`, `obj/`, `node_modules/` o caches;
- credenciales, claves API ni variables de entorno privadas;
- la implementación del ticket de transición de estados.

BMad Method se instala durante el taller con una versión fijada. Así se puede observar el proceso, comprobar su estado y evitar que una copia vendorizada se desactualice silenciosamente.

La README etiquetada v6.11.0 enumera Python 3.10+ y `uv`; la guía actual explica que `uv` puede provisionar el intérprete. El aula se estandariza en Python 3.11+ para facilitar diagnósticos, pero `scripts/install-bmad.ps1` solo bloquea por Node.js 20.12+, `npx` y `uv`. El target Codex prepara `.agents/skills` sin exigir Codex CLI en `PATH`.

## Requisitos

| Herramienta | Versión o condición |
|---|---|
| Node.js | 20.12 o superior |
| `uv` | Disponible en `PATH` |
| Git | Instalado |
| Python | 3.11 o superior recomendado para el aula; no bloquea la instalación |
| Codex | Cliente capaz de cargar `.agents/skills`, como CLI o aplicación de escritorio |
| .NET SDK | 10 |
| Docker | Necesario para la comprobación con Aspire |
| OpenSpec | Disponible para la validación SDD |
| Engram | Disponible en `PATH` |

## Instalación reproducible

Desde una copia personal de `proyecto-codex-dotnet/`:

```powershell
./scripts/install-bmad.ps1
```

El script ejecuta:

```powershell
npx --yes bmad-method@6.11.0 install --directory . --modules bmm --tools codex --yes
```

La comprobación oficial de estado es:

```powershell
npx --yes bmad-method@6.11.0 status
```

No existe un comando `bmad validate`. La validación final comprueba el manifiesto y la salida útil de `status`, ejecuta OpenSpec, compilación y pruebas, y revisa cambios rastreados, preparados y archivos textuales no rastreados.

## Fuente del baseline

El proyecto deriva de `sesiones/sesion-04/material/proyecto-codex-dotnet/`. Se conserva el hueco funcional: el dominio declara los tres estados, pero todavía no existe una operación para avanzar una tarea ni un control equivalente en el frontend.

Se han corregido únicamente los artefactos de contexto y proceso necesarios para esta sesión. El código del ticket permanece sin implementar.

## Siguiente paso

Consulta la [guía del ejercicio](../ejercicio/README.md) antes de instalar o modificar el proyecto.
