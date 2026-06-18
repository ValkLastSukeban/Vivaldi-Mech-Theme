# ==============================================================================
# MECH COCKPIT SYSTEM - AUTOMATED MAINTENANCE ENGINE (V10.0.0)
# Target: Vivaldi Core Window.html Custom Patching & Deployment
# Handover: Optimized for VBS External Launcher Chain (Pure UTF-8 No-BOM)
# ==============================================================================

$SourceDir   = "E:\Program Files\Vivaldi\Vivaldi Mods"
$VivaldiPath = "E:\Program Files\Vivaldi\Application"

$JSFileAudio     = "mechCockpitAudioModule.js"
$JSFileInterface = "mechCockpitInterfaceModule.js"
$CSSFileStyle    = "mechCockpitStyle.css"
$TargetFileName  = "window.html"

Clear-Host

try {
    Write-Host "==================================================================" -ForegroundColor Yellow
    Write-Host ">> COCKPIT SEQUENCE V10.0: MAINTENANCE & INJECTION CORE           " -ForegroundColor Yellow
    Write-Host "==================================================================" -ForegroundColor Yellow
    Write-Host ""
    Start-Sleep -Milliseconds 150

    # ==============================================================================
    # [PHASE 1] PROCESS TERMINATION
    # ==============================================================================
    Write-Host "[*] ANTI-LOCK: Hunting active browser sub-processes..." -ForegroundColor Yellow
    if (Get-Process -Name "vivaldi" -ErrorAction SilentlyContinue) {
        Write-Host "    [ALERT] Active units detected. Terminating chassis for hot-patch..." -ForegroundColor DarkYellow
        Stop-Process -Name "vivaldi" -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 0.5
    }
    Write-Host "    [OK] STATUS: Memory runway clear." -ForegroundColor Green
    Write-Host ""

    # ==============================================================================
    # [PHASE 2] PAYLOAD INTEGRITY CHECK
    # ==============================================================================
    Write-Host "[*] INTEGRITY: Verifying cockpit source modules..." -ForegroundColor Yellow
    if (-not (Test-Path $SourceDir)) { throw "Source directory folder missing at destination: $SourceDir" }

    $Modules = @(
        @{ Path = Join-Path $SourceDir $JSFileAudio;     Name = "Audio Module" },
        @{ Path = Join-Path $SourceDir $JSFileInterface; Name = "Interface Module" },
        @{ Path = Join-Path $SourceDir $CSSFileStyle;    Name = "Tactical CSS Matrix" }
    )

    foreach ($Mod in $Modules) {
        if (Test-Path $Mod.Path) {
            Write-Host "    [OK] $($Mod.Name) verified." -ForegroundColor Green
        } else {
            throw "Critical component missing: $($Mod.Name) em $($Mod.Path)"
        }
    }
    Write-Host ""

    # ==============================================================================
    # [PHASE 3] CORE DIRECTORY MAPPING
    # ==============================================================================
    Write-Host "[*] RECON: Scanning Vivaldi version architecture..." -ForegroundColor Yellow
    if (-not (Test-Path $VivaldiPath)) { throw "Defined application path does not exist: $VivaldiPath" }

    $LatestVersion = Get-ChildItem $VivaldiPath -Directory |
        Where-Object { $_.Name -match '^\d+\.\d+\.\d+\.\d+$' } |
        Sort-Object Name -Descending |
        Select-Object -First 1

    if (-not $LatestVersion) { throw "No structured version folders detected inside Vivaldi directory." }
    Write-Host "    [OK] Production Engine Target: $($LatestVersion.Name)" -ForegroundColor Green

    $FindHtml = Get-ChildItem -Path $LatestVersion.FullName -Filter $TargetFileName -Recurse -File -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $FindHtml) { throw "Target file $TargetFileName not found in version subfolders!" }

    $HtmlPath  = $FindHtml.FullName
    $TargetDir = $FindHtml.DirectoryName
    Write-Host "    [OK] Absolute target mapped: $HtmlPath" -ForegroundColor Green
    Write-Host ""

    # ==============================================================================
    # [PHASE 4] DEPLOYMENT & SANITIZATION
    # ==============================================================================
    Write-Host "[*] DEPLOYMENT: Injecting payload modules to runtime folder..." -ForegroundColor Yellow
    
    # Sanitização Anti-BOM em tempo de cópia do CSS
    $CleanStyleContent = Get-Content (Join-Path $SourceDir $CSSFileStyle) -Raw
    [System.IO.File]::WriteAllText((Join-Path $TargetDir $CSSFileStyle), $CleanStyleContent, [System.Text.Encoding]::UTF8)
    
    # Cópia direta dos scripts estruturais
    Copy-Item (Join-Path $SourceDir $JSFileAudio) -Destination $TargetDir -Force -ErrorAction Stop
    Copy-Item (Join-Path $SourceDir $JSFileInterface) -Destination $TargetDir -Force -ErrorAction Stop

    Write-Host "    [OK] STATUS: Core modules successfully deployed." -ForegroundColor Green
    Write-Host ""

    # ==============================================================================
    # [PHASE 5] HTML PATCHING & IMMUNIZATION (PURE UTF-8 NO-BOM)
    # ==============================================================================
    Write-Host "[*] PATCHING: Injecting custom telemetry links into $TargetFileName..." -ForegroundColor Yellow

    $HtmlFile = Get-Item $HtmlPath
    if ($HtmlFile.IsReadOnly) { $HtmlFile.IsReadOnly = $false }

    $HtmlContent = Get-Content $HtmlPath -Raw -ErrorAction Stop

    # Limpeza Idempotente Unificada
    $PurgePatterns = @(
        '(?i)<link rel="stylesheet" href="[^"]*encryptedData\.css">',
        '(?i)<link rel="stylesheet" href="[^"]*mechCockpitStyle\.css">',
        '(?i)<script src="[^"]*mechCockpitAudioModule\.js"></script>',
        '(?i)<script src="[^"]*mechCockpitInterfaceModule\.js"></script>'
    )
    foreach ($Pattern in $PurgePatterns) {
        $HtmlContent = $HtmlContent -replace $Pattern, ''
    }

    # Definição limpa das novas tags sem concatenação manual
    $TagStyle   = "<link rel=`"stylesheet`" href=`"$CSSFileStyle`"></head>"
    $TagScripts = "<script src=`"$JSFileAudio`"></script><script src=`"$JSFileInterface`"></script></body>"

    # Injeção Cirúrgica
    $HtmlContent = $HtmlContent -replace "(?i)</head>", $TagStyle
    $HtmlContent = $HtmlContent -replace "(?i)</body>", $TagScripts

    # Escrita final blindada contra caracteres fantasmas
    [System.IO.File]::WriteAllText($HtmlPath, $HtmlContent, [System.Text.Encoding]::UTF8)

    Write-Host "    [OK] STATUS: Patch applied cleanly." -ForegroundColor Green
    Write-Host ""
    Write-Host "==================================================================" -ForegroundColor Green
    Write-Host ">> CORE MAINTENANCE COMPLETE. HANDING OVER TO VBS LAUNCHER...     " -ForegroundColor Green
}
catch {
    Write-Host ""
    Write-Host "[ERROR] CRITICAL ENGINE ANOMALY DETECTED!" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Line: $($_.InvocationInfo.ScriptLineNumber)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "[PAUSE] Sequence frozen for diagnostics. Press ENTER to dismiss terminal..." -ForegroundColor Cyan
    Read-Host
}
finally {
    Write-Host ""
    Write-Host "==================================================================" -ForegroundColor Cyan
    Write-Host ">> SEQUENCE DISENGAGED. DISCONNECTING TELEMETRY..." -ForegroundColor Cyan
    Write-Host "==================================================================" -ForegroundColor Cyan
    Exit
}