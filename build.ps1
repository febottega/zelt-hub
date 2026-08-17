<#
  build.ps1 - Monta o index.html do Hub de Ferramentas ZELT a partir de src/.

  NAO edite o index.html a mao: ele e gerado. Edite os fontes em src/ e rode:

      build.cmd

  Fontes:
    src/hub.html            shell do hub. Contem o marcador <!--@PAYLOADS@-->
                            onde as ferramentas sao injetadas.
    src/order.txt           nomes das ferramentas, uma por linha, NA ORDEM.
    src/tools/<n>.html      ferramenta em arquivo unico.
    src/tools/<n>/tool.html ferramenta decomposta em pasta (style.css, app.js, data/...).
    src/frozen/<n>.b64      payload congelado, ja em base64. Copiado sem recodificar.
    src/assets/             fontes e imagens compartilhadas, em base64.
    src/vendor/             bibliotecas de terceiros.

  Para cada nome em order.txt o build procura, nesta ordem:
    1. src/tools/<n>/tool.html   (pasta)
    2. src/tools/<n>.html        (arquivo unico)
    3. src/frozen/<n>.b64        (congelado)

  INCLUSOES
  ---------
  Qualquer fonte pode conter o token:

      @@FILE:caminho/relativo/a/src@@

  que o build substitui pelo conteudo bruto daquele arquivo. Funciona de forma
  recursiva (um .css pode incluir uma fonte, e o tool.html pode incluir o .css).
  E como as fontes e libs pesadas ficam fora dos arquivos que a gente edita.

  BYTE-EXATIDAO
  -------------
  Tudo e manipulado como bytes. Onde e preciso tratar texto, usa-se Latin-1
  (codepage 28591), que mapeia byte <-> caractere 1 para 1 e portanto nao altera
  nada: sem BOM, sem conversao de LF para CRLF, sem normalizar acentos.

  Se nenhum fonte mudou, rebuildar tem que gerar um index.html com o MESMO
  SHA256. Divergencia sem mudanca de fonte = bug no build.
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

$MARKER      = '<!--@PAYLOADS@-->'
$MAX_PASSES  = 10

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

# Resolve os @@FILE:...@@ de forma recursiva. Recebe e devolve texto Latin-1
# (byte-transparente). Um contador de passes evita loop infinito.
function Resolve-Includes {
  param([string]$Text, [string]$SrcRoot)

  $rx = [regex]'@@FILE:([^@]+)@@'
  $evaluator = {
    param($m)
    $rel  = $m.Groups[1].Value
    $full = Join-Path $SrcRoot $rel
    if (-not (Test-Path $full -PathType Leaf)) {
      throw "Inclusao '@@FILE:$rel@@' nao encontrada (procurei em: $full)"
    }
    [Text.Encoding]::GetEncoding(28591).GetString([IO.File]::ReadAllBytes($full))
  }

  for ($pass = 1; $pass -le $MAX_PASSES; $pass++) {
    if (-not $rx.IsMatch($Text)) { return $Text }
    $Text = $rx.Replace($Text, $evaluator)
  }
  throw "Inclusoes @@FILE: aninhadas demais ($MAX_PASSES passes). Provavel referencia circular."
}

# Le um fonte, resolve as inclusoes e devolve os bytes finais da ferramenta.
function Get-ToolBytes {
  param([string]$Path, [string]$SrcRoot)
  $L1   = [Text.Encoding]::GetEncoding(28591)
  $text = $L1.GetString([IO.File]::ReadAllBytes($Path))
  $text = Resolve-Includes -Text $text -SrcRoot $SrcRoot
  return $L1.GetBytes($text)
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
$hubBytes = [IO.File]::ReadAllBytes($hubPath)
$markerLF = [Text.Encoding]::ASCII.GetBytes($MARKER + "`n")
$idx      = Find-ByteSequence -Haystack $hubBytes -Needle $markerLF
if ($idx -lt 0) {
  throw "Marcador '$MARKER' (seguido de LF) nao encontrado em src/hub.html."
}
$rest = $hubBytes[($idx + $markerLF.Length)..($hubBytes.Length - 1)]
if ((Find-ByteSequence -Haystack $rest -Needle $markerLF) -ge 0) {
  throw "Marcador '$MARKER' aparece mais de uma vez em src/hub.html."
}
$suffixStart = $idx + $markerLF.Length

# ---- montar --------------------------------------------------------------
$outDir = Split-Path -Parent $OutFile
if ($outDir -and -not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }

$toolsDir = Join-Path $src 'tools'
$fs = [IO.File]::Create($OutFile)
try {
  $fs.Write($hubBytes, 0, $idx)

  $report = @()
  foreach ($name in $order) {
    $asDir   = Join-Path $toolsDir $name
    $asFile  = Join-Path $toolsDir ($name + '.html')
    $frozen  = Join-Path (Join-Path $src 'frozen') ($name + '.b64')

    if (Test-Path $asDir -PathType Container) {
      $entry = Join-Path $asDir 'tool.html'
      if (-not (Test-Path $entry -PathType Leaf)) {
        throw "A pasta src/tools/$name existe mas nao tem tool.html dentro."
      }
      $raw    = Get-ToolBytes -Path $entry -SrcRoot $src
      $b64    = [Convert]::ToBase64String($raw)
      $origem = 'pasta'
      $fonte  = (Get-ChildItem $asDir -Recurse -File | Measure-Object -Property Length -Sum).Sum
      $bytes  = $raw.Length
    }
    elseif (Test-Path $asFile -PathType Leaf) {
      $raw    = Get-ToolBytes -Path $asFile -SrcRoot $src
      $b64    = [Convert]::ToBase64String($raw)
      $origem = 'arquivo'
      $fonte  = (Get-Item $asFile).Length
      $bytes  = $raw.Length
    }
    elseif (Test-Path $frozen -PathType Leaf) {
      $b64    = ([IO.File]::ReadAllText($frozen)).Trim()
      $origem = 'frozen'
      $fonte  = (Get-Item $frozen).Length
      $bytes  = [int]($b64.Length * 3 / 4)
    }
    else {
      throw "Ferramenta '$name' esta em order.txt mas nao existe em tools/ nem frozen/."
    }

    if ($b64 -match '[^A-Za-z0-9+/=]') { throw "Base64 invalido gerado para '$name'." }

    $line      = '<script type="text/plain" data-tool="' + $name + '">' + $b64 + '</script>' + "`n"
    $lineBytes = [Text.Encoding]::ASCII.GetBytes($line)
    $fs.Write($lineBytes, 0, $lineBytes.Length)

    $report += [pscustomobject]@{
      Ferramenta  = $name
      Origem      = $origem
      'Fonte KB'  = [math]::Round($fonte / 1KB)
      'Montado KB'= [math]::Round($bytes / 1KB)
    }
  }

  $fs.Write($hubBytes, $suffixStart, $hubBytes.Length - $suffixStart)
}
finally {
  $fs.Close()
}

# ---- relatorio -----------------------------------------------------------
$report | Format-Table -AutoSize
$outInfo = Get-Item $OutFile
Write-Output ("Gerado : {0}" -f $OutFile)
Write-Output ("Tamanho: {0:N0} bytes ({1:N2} MB)" -f $outInfo.Length, ($outInfo.Length / 1MB))
Write-Output ("SHA256 : {0}" -f (Get-FileHash $OutFile -Algorithm SHA256).Hash)
Write-Output ("Payloads: {0}" -f $order.Count)
