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

Push-Location $projectRoot

try {
    Invoke-CheckedCommand 'Validar artefactos OpenSpec' {
        openspec validate --all --strict --no-interactive
    }

    Invoke-CheckedCommand 'Validar cambios archivados' {
        openspec validate --archived --strict --no-interactive
    }

    Push-Location $backendRoot

    try {
        Invoke-CheckedCommand 'Compilar Delivery Board' {
            dotnet build DeliveryBoard.slnx
        }

        Invoke-CheckedCommand 'Ejecutar pruebas unitarias' {
            dotnet test DeliveryBoard.slnx --no-build
        }
    }
    finally {
        Pop-Location
    }

    Invoke-CheckedCommand 'Comprobar formato del diff' {
        git diff --check
    }

    Write-Host "`nValidación SDD completada correctamente." -ForegroundColor Green
}
finally {
    Pop-Location
}
