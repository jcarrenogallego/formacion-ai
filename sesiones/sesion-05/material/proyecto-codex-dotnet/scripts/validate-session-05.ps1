param(
    [switch] $Baseline
)

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$backendRoot = Join-Path $projectRoot 'backend'

function Invoke-CheckedCommand {
    param(
        [Parameter(Mandatory)]
        [string] $Name,

        [Parameter(Mandatory)]
        [scriptblock] $Command
    )

    Write-Host "`n==> $Name" -ForegroundColor Cyan
    & $Command

    if ($LASTEXITCODE -ne 0) {
        throw "$Name terminó con código $LASTEXITCODE."
    }
}

function Assert-Command {
    param(
        [Parameter(Mandatory)]
        [string] $Name,

        [Parameter(Mandatory)]
        [string] $Reason
    )

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "No se encontró '$Name' en PATH. $Reason"
    }
}

function Assert-UntrackedTextQuality {
    $textExtensions = @(
        '.cs', '.csproj', '.css', '.editorconfig', '.gitignore', '.html', '.js',
        '.json', '.md', '.props', '.ps1', '.slnx', '.targets', '.toml', '.txt',
        '.yaml', '.yml'
    )
    $excludedDirectories = '(^|/)(_bmad|_bmad-output|bin|obj|node_modules|TestResults)(/|$)'
    $untrackedFiles = @(& git ls-files --others --exclude-standard -- .)

    if ($LASTEXITCODE -ne 0) {
        throw "No se pudieron enumerar los archivos no rastreados. Git terminó con código $LASTEXITCODE."
    }

    $issues = [System.Collections.Generic.List[string]]::new()
    $scanned = 0

    foreach ($relativePath in $untrackedFiles) {
        $normalizedPath = $relativePath.Replace('\', '/')
        if ($normalizedPath -match $excludedDirectories) {
            continue
        }

        $extension = [System.IO.Path]::GetExtension($normalizedPath).ToLowerInvariant()
        if ($extension -notin $textExtensions) {
            continue
        }

        $fullPath = Join-Path $projectRoot $relativePath
        if (-not (Test-Path $fullPath -PathType Leaf)) {
            continue
        }

        $scanned++
        $lineNumber = 0
        foreach ($line in [System.IO.File]::ReadLines($fullPath)) {
            $lineNumber++
            if ($line -match '[\t ]+$') {
                $issues.Add("${relativePath}:${lineNumber}: whitespace final")
            }
            if ($line -match '^(<<<<<<<|=======|>>>>>>>)') {
                $issues.Add("${relativePath}:${lineNumber}: marcador de conflicto")
            }
        }
    }

    if ($issues.Count -gt 0) {
        throw "Se encontraron problemas en archivos textuales no rastreados:`n$($issues -join "`n")"
    }

    Write-Host "Archivos textuales no rastreados comprobados: $scanned" -ForegroundColor DarkGray
}

Assert-Command -Name 'openspec' -Reason 'Es necesario para validar los artefactos SDD.'
Assert-Command -Name 'dotnet' -Reason 'Es necesario para compilar y ejecutar las pruebas.'
Assert-Command -Name 'git' -Reason 'Es necesario para comprobar el diff.'

if (-not $Baseline) {
    Assert-Command -Name 'npx' -Reason 'Es necesario para comprobar el estado de BMad Method.'
}

Push-Location $projectRoot

try {
    if ($Baseline) {
        Write-Host "`n==> Modo baseline: se omite el estado BMad antes de su instalación" -ForegroundColor Yellow
    }
    else {
        $bmadRoot = Join-Path $projectRoot '_bmad'
        $manifestPath = Join-Path $bmadRoot '_config/manifest.yaml'
        $bmmPath = Join-Path $bmadRoot 'bmm'

        if (-not (Test-Path $manifestPath -PathType Leaf)) {
            throw "No se encontró '_bmad/_config/manifest.yaml'. Ejecuta ./scripts/install-bmad.ps1 antes de la validación final."
        }
        if (-not (Test-Path $bmmPath -PathType Container)) {
            throw "No se encontró el módulo BMM en '_bmad/bmm'."
        }

        $manifestText = Get-Content $manifestPath -Raw
        if ($manifestText -notmatch '(?m)^installation:\s*\r?\n\s{2}version:\s*["'']?6\.11\.0["'']?\s*$') {
            throw "El manifiesto no declara BMad Method 6.11.0 como versión de instalación."
        }

        $bmmBlock = [regex]::Match(
            $manifestText,
            '(?ms)^\s*-\s+name:\s*bmm\s*$.*?(?=^\s*-\s+name:|\z)'
        )
        if (-not $bmmBlock.Success) {
            throw "El manifiesto no declara el módulo BMM."
        }
        if ($bmmBlock.Value -notmatch '(?m)^\s+version:\s*["'']?6\.11\.0["'']?\s*$') {
            throw "El manifiesto no declara BMM 6.11.0."
        }

        Write-Host "`n==> Comprobar el estado de BMad Method v6.11.0" -ForegroundColor Cyan
        $statusOutput = (& npx --yes bmad-method@6.11.0 status 2>&1 | Out-String).Trim()
        $statusExitCode = $LASTEXITCODE
        Write-Host $statusOutput

        if ($statusExitCode -ne 0) {
            throw "La comprobación de estado terminó con código $statusExitCode."
        }
        if ($statusOutput -match 'No BMAD installation|No BMAD installation manifest|Status check failed') {
            throw "El comando status no reconoció una instalación BMad válida."
        }
        if ($statusOutput -notmatch '(?i)Version:\s+6\.11\.0' -or $statusOutput -notmatch '(?im)^.*\bbmm\s+6\.11\.0\b') {
            throw "El comando status no confirmó BMad Method 6.11.0 con el módulo BMM 6.11.0."
        }
    }

    Invoke-CheckedCommand 'Validar artefactos OpenSpec' {
        & openspec validate --all --strict --no-interactive
    }

    Invoke-CheckedCommand 'Validar cambios archivados de OpenSpec' {
        & openspec validate --archived --strict --no-interactive
    }

    Push-Location $backendRoot

    try {
        Invoke-CheckedCommand 'Compilar Delivery Board' {
            & dotnet build DeliveryBoard.slnx
        }

        Invoke-CheckedCommand 'Ejecutar pruebas unitarias' {
            & dotnet test DeliveryBoard.slnx --no-build
        }
    }
    finally {
        Pop-Location
    }

    Invoke-CheckedCommand 'Comprobar cambios rastreados sin preparar' {
        & git diff --check -- .
    }

    Invoke-CheckedCommand 'Comprobar cambios preparados' {
        & git diff --cached --check -- .
    }

    Write-Host "`n==> Comprobar archivos textuales no rastreados" -ForegroundColor Cyan
    Assert-UntrackedTextQuality

    $mode = if ($Baseline) { 'baseline' } else { 'final' }
    Write-Host "`nValidación $mode de la sesión 5 completada correctamente." -ForegroundColor Green
}
finally {
    Pop-Location
}
