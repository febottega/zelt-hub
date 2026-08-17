<#
  build.ps1 - Monta o index.html do Hub de Ferramentas ZELT a partir de src/.

  NAO edite o index.html a mao: ele e gerado. Edite os fontes em src/ e rode:

      .\build.ps1

  Fontes:
    src/hub.html          shell do hub (hero, cards, CSS, JS). Contem o marcador
                          <!--@PAYLOADS@--> onde as ferramentas sao injetadas.
    src/order.txt         nomes das ferramentas, uma por linha, NA ORDEM de injecao.
    src/tools/<n>.html    ferramenta editavel (HTML puro). O build codifica em base64.
    src/frozen/<n>.b64    payload congelado, ja em base64 (relatorios historicos).
                          Copiado como esta, sem recodificar.

  Para cada nome em order.txt o build procura primeiro em tools/, depois em frozen/.

  Tudo e feito em bytes, nunca em texto, para que a saida seja byte-identica:
  sem BOM, sem conversao de LF para CRLF, sem normalizacao de acentos.
#>

[CmdletBinding()]
param(
  # Destino. Use um caminho temporario para conferir sem sobrescrever o index.html.
  [string]$OutFile
)

$ErrorActionPreference = 'Stop'

$root = $PSScriptRoot
$src  = Join-Path $root 'src'
if (-not $OutFile) { $OutFile = Join-Path $root 'index.html' }

$MARKER = '<!--@PAYLOADS@-->'

function Find-ByteSequence {
  param([byte[]]$Haystack, [byte[]]$Needle)
  $limit = $Haystack.Length - $Needle.Length
  for ($i = 0; $i -le $limit; $i++) {
    $match = $true
    for ($j = 0; $j -lt $Needle.Length; $j++) {
      if ($Haystack[$i + $j] -ne $Needle[$j]) { $match = $false; break }
    }
    if ($match) { return $i }
  }
  return -1
}

# ---- validar fontes -------------------------------------------------------
$hubPath   = Join-Path $src 'hub.html'
$orderPath = Join-Path $src 'order.txt'
foreach ($p in @($hubPath, $orderPath)) {
  if (-not (Test-Path $p)) { throw "Fonte ausente: $p" }
}

$order = Get-Content $orderPath | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
if ($order.Count -eq 0) { throw "src/order.txt esta vazio." }

# ---- localizar o marcador no shell ---------------------------------------
$hubBytes   = [IO.File]::ReadAllBytes($hubPath)
$markerLF   = [Text.Encoding]::ASCII.GetBytes($MARKER + "`n")
$idx        = Find-ByteSequence -Haystack $hubBytes -Needle $markerLF
if ($idx -lt 0) {
  throw "Marcador '$MARKER' (seguido de LF) nao encontrado em src/hub.html."
}
$dup = Find-ByteSequence -Haystack $hubBytes[($idx + $markerLF.Length)..($hubBytes.Length - 1)] -Needle $markerLF
if ($dup -ge 0) { throw "Marcador '$MARKER' aparece mais de uma vez em src/hub.html." }

$suffixStart = $idx + $markerLF.Length

# ---- montar --------------------------------------------------------------
$outDir = Split-Path -Parent $OutFile
if ($outDir -and -not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }

$fs = [IO.File]::Create($OutFile)
try {
  # prefixo: tudo antes do marcador
  $fs.Write($hubBytes, 0, $idx)

  $report = @()
  foreach ($name in $order) {
    $live   = Join-Path (Join-Path $src 'tools')  ($name + '.html')
    $frozen = Join-Path (Join-Path $src 'frozen') ($name + '.b64')

    if (Test-Path $live) {
      $raw    = [IO.File]::ReadAllBytes($live)
      $b64    = [Convert]::ToBase64String($raw)
      $origem = 'tools'
      $bytes  = $raw.Length
    }
    elseif (Test-Path $frozen) {
      $b64    = ([IO.File]::ReadAllText($frozen)).Trim()
      $origem = 'frozen'
      $bytes  = [int]($b64.Length * 3 / 4)
    }
    else {
      throw "Ferramenta '$name' listada em order.txt mas ausente em tools/ e frozen/."
    }

    if ($b64 -match '[^A-Za-z0-9+/=]') { throw "Base64 invalido para '$name'." }

    $line     = '<script type="text/plain" data-tool="' + $name + '">' + $b64 + '</script>' + "`n"
    $lineBytes = [Text.Encoding]::ASCII.GetBytes($line)
    $fs.Write($lineBytes, 0, $lineBytes.Length)

    $report += [pscustomobject]@{
      Ferramenta = $name
      Origem     = $origem
      Fonte_KB   = [math]::Round($bytes / 1KB)
      Base64_KB  = [math]::Round($b64.Length / 1KB)
    }
  }

  # sufixo: tudo depois do marcador (</body></html>)
  $fs.Write($hubBytes, $suffixStart, $hubBytes.Length - $suffixStart)
}
finally {
  $fs.Close()
}

# ---- relatorio -----------------------------------------------------------
$report | Format-Table -AutoSize
$outInfo = Get-Item $OutFile
$hash    = (Get-FileHash $OutFile -Algorithm SHA256).Hash
Write-Output ("Gerado : {0}" -f $OutFile)
Write-Output ("Tamanho: {0:N0} bytes ({1:N2} MB)" -f $outInfo.Length, ($outInfo.Length / 1MB))
Write-Output ("SHA256 : {0}" -f $hash)
Write-Output ("Payloads: {0}" -f $order.Count)
