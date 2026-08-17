<#
  deploy.ps1 - Gera o index.html e publica no GitHub Pages.

  Use sempre pelo wrapper:

      deploy.cmd                          mensagem automatica com data/hora
      deploy.cmd "Atualiza comparativo"   mensagem propria
      deploy.cmd -Force                   sem pedir confirmacao

  O que faz, em ordem:
    1. roda o build (build.ps1) e mostra tamanho + SHA256 do index.html
    2. mostra o que mudou
    3. pede confirmacao (a menos que -Force)
    4. commita tudo e da push no branch main

  O site (https://febottega.github.io/zelt-hub/) atualiza sozinho em ~1 minuto.

  No primeiro push o Git Credential Manager abre o navegador para voce entrar
  no GitHub. Isso acontece uma vez; depois a credencial fica guardada no Windows.
#>

[CmdletBinding()]
param(
  [Parameter(Position = 0)]
  [string]$Message,

  # Pula a confirmacao.
  [switch]$Force
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
Push-Location $root

try {
  # ---- 1. build --------------------------------------------------------
  Write-Output "==> Gerando o index.html"
  & (Join-Path $root 'build.ps1')

  # ---- 2. o que mudou --------------------------------------------------
  Write-Output ""
  Write-Output "==> Mudancas a publicar"
  $changes = @(git status --short)
  if ($changes.Count -eq 0) {
    Write-Output "    Nada mudou. Working tree limpa - nao ha o que publicar."
    return
  }
  $changes | ForEach-Object { Write-Output "    $_" }

  # ---- 3. confirmacao --------------------------------------------------
  if (-not $Force) {
    # Sem um terminal de verdade o Read-Host nao e confiavel: ele pode devolver
    # algo que passe pela validacao e publicar sem ninguem ter confirmado.
    # Entao aqui a regra e falhar fechado.
    if ([Console]::IsInputRedirected -or -not [Environment]::UserInteractive) {
      throw ("Nao ha terminal interativo para confirmar a publicacao. " +
             "Rode pelo terminal ou por duplo clique, ou use -Force se quiser publicar sem confirmacao.")
    }

    Write-Output ""
    Write-Output "    Isso vai publicar no site que a equipe usa:"
    Write-Output "    https://febottega.github.io/zelt-hub/"
    $r = "$(Read-Host '    Publicar? (s/N)')".Trim()
    if ($r -notin @('s', 'S', 'y', 'Y')) {
      Write-Output "    Cancelado. Nada foi enviado."
      return
    }
  }

  # ---- 4. commit + push ------------------------------------------------
  if (-not $Message) {
    $Message = "Atualiza hub - " + (Get-Date -Format 'dd/MM/yyyy HH:mm')
  }

  Write-Output ""
  Write-Output "==> Commit"
  git add -A
  if ($LASTEXITCODE -ne 0) { throw "git add falhou." }

  git commit -m $Message
  if ($LASTEXITCODE -ne 0) { throw "git commit falhou." }

  Write-Output ""
  Write-Output "==> Push para origin/main"
  git push origin main
  if ($LASTEXITCODE -ne 0) {
    throw "git push falhou. Se foi problema de login, rode 'git push origin main' no terminal para ver o prompt de autenticacao."
  }

  Write-Output ""
  Write-Output "==> Publicado."
  Write-Output "    O GitHub Pages leva cerca de 1 minuto para atualizar."
  Write-Output "    https://febottega.github.io/zelt-hub/"
  Write-Output ""
  Write-Output "    Dica: o navegador guarda o arquivo em cache. Se nao vir a mudanca,"
  Write-Output "    recarregue com Ctrl+F5."
}
finally {
  Pop-Location
}
