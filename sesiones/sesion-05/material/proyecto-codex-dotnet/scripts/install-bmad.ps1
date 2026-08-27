param()

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

function Assert-Command {
    param(
        [Parameter(Mandatory)]
        [string] $Name,

        [string] $InstallHint = ''
    )

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        $message = "No se encontró '$Name' en PATH."
        if ($InstallHint) {
            $message += " $InstallHint"
        }
        throw $message
    }
}

function Get-SemanticVersion {
    param(
        [Parameter(Mandatory)]
        [string] $Text,

        [Parameter(Mandatory)]
        [string] $Tool
    )

    if ($Text -notmatch '(\d+)\.(\d+)(?:\.(\d+))?') {
        throw "No se pudo interpretar la versión de $Tool a partir de: $Text"
    }

    $patch = if ($Matches[3]) { [int] $Matches[3] } else { 0 }
    return [version]::new([int] $Matches[1], [int] $Matches[2], $patch)
}

Assert-Command -Name 'node' -InstallHint 'Se requiere Node.js 20.12 o superior.'
Assert-Command -Name 'npx' -InstallHint 'npx se instala junto con Node.js.'
Assert-Command -Name 'uv' -InstallHint 'Instala uv y vuelve a abrir la terminal.'

$nodeText = (& node --version 2>&1 | Out-String).Trim()
$nodeVersion = Get-SemanticVersion -Text $nodeText -Tool 'Node.js'
if ($nodeVersion -lt [version]'20.12.0') {
    throw "Node.js $nodeVersion no es compatible. Se requiere 20.12 o superior."
}

Write-Host "Node.js: $nodeVersion" -ForegroundColor Cyan
Write-Host "uv: $((& uv --version 2>&1 | Out-String).Trim())" -ForegroundColor Cyan

$pythonCommand = @('python3', 'python') |
    Where-Object { Get-Command $_ -ErrorAction SilentlyContinue } |
    Select-Object -First 1

if (-not $pythonCommand) {
    Write-Warning 'No se encontró Python del sistema. La instalación puede continuar porque uv provisiona el intérprete. Para el aula se recomienda Python 3.11 o superior.'
}
else {
    try {
        $pythonText = (& $pythonCommand --version 2>&1 | Out-String).Trim()
        $pythonVersion = Get-SemanticVersion -Text $pythonText -Tool 'Python'

        if ($pythonVersion -lt [version]'3.11.0') {
            Write-Warning "Python $pythonVersion está disponible, pero para el aula se recomienda 3.11 o superior. La instalación continuará mediante uv."
        }
        else {
            Write-Host "Python recomendado: $pythonVersion ($pythonCommand)" -ForegroundColor Cyan
        }
    }
    catch {
        Write-Warning "No se pudo comprobar Python del sistema: $($_.Exception.Message). La instalación continuará mediante uv."
    }
}

if (Get-Command 'git' -ErrorAction SilentlyContinue) {
    Write-Host "Git: $((& git --version 2>&1 | Out-String).Trim())" -ForegroundColor Cyan
}
else {
    Write-Warning 'Git no está disponible. BMM puede instalarse, pero necesitarás Git para completar el ejercicio y preparar la entrega.'
}

if (-not (Get-Command 'codex' -ErrorAction SilentlyContinue)) {
    Write-Host 'Codex CLI no está en PATH. El target codex preparará .agents/skills; abre después un cliente Codex compatible desde este proyecto.' -ForegroundColor Yellow
}

Push-Location $projectRoot

try {
    Write-Host "`n==> Instalar BMad Method v6.11.0 con BMM para Codex" -ForegroundColor Cyan
    & npx --yes bmad-method@6.11.0 install --directory . --modules bmm --tools codex --yes
    if ($LASTEXITCODE -ne 0) {
        throw "La instalación de BMad Method terminó con código $LASTEXITCODE."
    }

    Write-Host "`n==> Comprobar el estado de BMad Method" -ForegroundColor Cyan
    & npx --yes bmad-method@6.11.0 status
    if ($LASTEXITCODE -ne 0) {
        throw "La comprobación de estado terminó con código $LASTEXITCODE."
    }

    Write-Host "`nInstalación completada. Reinicia Codex desde esta carpeta para cargar las skills." -ForegroundColor Green
}
finally {
    Pop-Location
}
