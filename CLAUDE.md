# Hub de Ferramentas — ZELT Imóveis

Portal interno da equipe de corretores (Blumenau/SC), publicado em
https://febottega.github.io/zelt-hub/ (repo `febottega/zelt-hub`, Pages no root de `main`).

## REGRA PRINCIPAL: nunca leia nem edite o index.html

`index.html` (8,9 MB) é **gerado**. Contém as 13 ferramentas em base64 — ilegível
para busca, impossível de editar cirurgicamente. Lê-lo custa cerca de **2,5 milhões
de tokens** e não cabe em nenhuma janela de contexto.

Para qualquer mudança: **edite o fonte em `src/` e rode o build.**

```bash
.\build.cmd          gera o index.html
.\deploy.cmd         gera + commita + publica no Pages (pede confirmação)
```

**O `.\` é obrigatório no PowerShell.** Ele não executa nada do diretório atual sem
esse prefixo — `deploy.cmd` sozinho dá `CommandNotFoundException`. No `cmd.exe`
antigo funciona sem, mas use `.\` sempre para não errar.

Os `.cmd` são wrappers que chamam o `.ps1` com `-ExecutionPolicy Bypass` — a
política padrão do Windows bloqueia `.ps1`. Nunca use `powershell -File build.ps1`
direto: falha com erro de segurança.

Para conferir sem sobrescrever: `.\build.cmd -OutFile C:\caminho\teste.html`

## Estrutura

```
HUB/
├─ index.html          GERADO — não tocar
├─ build.ps1 / .cmd    monta o index.html (opera em bytes)
├─ deploy.ps1 / .cmd   build + commit + push
├─ .gitattributes      * -text  (impede LF→CRLF; o Windows tem autocrlf=true)
└─ src/
   ├─ hub.html         shell do hub (84 KB). Marcador <!--@PAYLOADS@-->
   ├─ order.txt        os 13 nomes, um por linha, NA ORDEM de injeção
   ├─ assets/fonts/    8 fontes TTF em base64, COMPARTILHADAS — nunca ler
   ├─ vendor/          pdf-lib (512 KB) e html2canvas (193 KB) — nunca ler
   ├─ tools/           ferramentas (arquivo único OU pasta)
   └─ frozen/          8 relatórios históricos em base64 — nunca editar, nunca ler
```

## Inclusões: `@@FILE:caminho@@`

Qualquer fonte pode conter `@@FILE:caminho/relativo/a/src@@`, que o build
substitui pelo conteúdo bruto do arquivo, **recursivamente** (um `.css` inclui uma
fonte; o `tool.html` inclui o `.css`). É assim que o lastro fica fora dos arquivos
que a gente edita — e é por isso que um `app.js` pode conter marcadores dos blocos
de dados que ficam no meio dele, mantendo a lógica contígua.

Resolução de cada nome em `order.txt`, nesta ordem:
`src/tools/<n>/tool.html` (pasta) → `src/tools/<n>.html` (arquivo) → `src/frozen/<n>.b64`.

## Onde editar o quê

| Quero mudar | Arquivo | Tamanho |
|---|---|---|
| lógica/filtros/gráficos do comparativo | `tools/comparativo/app.js` | **64 KB** |
| os 57 empreendimentos (preço, entrega…) | `tools/comparativo/data/empreendimentos.js` | 36 KB |
| histórico de preços | `tools/comparativo/data/price-history.js` | 45 KB |
| mudanças de preço | `tools/comparativo/data/price-changes.js` | 5 KB |
| tabelas de vendas | `tools/comparativo/data/sales-tables.js` | 89 KB |
| logos das construtoras | `tools/comparativo/data/logos.js` | 44 KB |
| CSS do comparativo | `tools/comparativo/style.css` | 46 KB |
| HTML/estrutura do comparativo | `tools/comparativo/layout.html` | 75 KB |
| gerador de documentos | `tools/gerador.html` | 285 KB |
| simulador SAC | `tools/simulador.html` | 97 KB |
| painel de avaliações (`DADOS`, `KPIS`) | `tools/avaliacoes.html` | 97 KB |
| relatório da semana atual | `tools/avaliacao.html` | 407 KB |
| hero, cards, overlay do hub | `hub.html` | 84 KB (~35 KB de código) |

Nunca leia esses arquivos por inteiro. Use `Grep` para localizar e `Edit` com
`old_string` preciso; onde precisar de contexto, `Read` com `offset`/`limit`.

## As ferramentas

Cinco cards. Quatro são payloads embutidos; o **Painel de Pauta** é externo
(`uweradloff.github.io/painel-pauta-zelt/`).

- **avaliacoes** — painel: array `DADOS` (imóveis) + `KPIS` (semanais). Filtros por
  código, endereço, corretor, bairro, quartos, suítes, tipo, semana, faixa.
- **avaliacao** + 8 arquivados — relatórios semanais paginados; os antigos em `frozen/`.
- **comparativo** — 57 empreendimentos. Abas: comparativo, mudanças, melhores preços,
  tabelas de vendas, investimentos.
- **gerador** — 5 documentos (proposta, autorização/captação, locação, entrega de
  chaves, checklist). Rascunhos em `localStorage` (`zelt_*_v1`); exporta com
  html2canvas + pdf-lib.
- **simulador** — financiamento SAC.

Zero bibliotecas externas em runtime além do que está em `vendor/`. Gráficos são
HTML/CSS/SVG próprios.

## Como o hub carrega uma ferramenta

Cada payload é `<script type="text/plain" data-tool="NOME">BASE64</script>`. O hub
decodifica com `atob` + `TextDecoder('utf-8')` e injeta num `<iframe srcdoc>` num
overlay. Rotas por hash + `pushState`; `Esc` fecha.

`postMessage`: `'zelt-close-tool'`, `{zelt:'get-tool'}` → `{zelt:'tool-html'}`,
`{zelt:'open-tool', focus}`, `{zelt:'focus', code}`.

Ao buscar um payload no `index.html`, ancore no início da linha —
`^<script type="text/plain" data-tool="X">` — porque `data-tool="X"` também casa
com o card no `hub.html`.

## Invariante do build

Determinístico e byte-exato. Se nenhum fonte mudou, rebuildar produz um
`index.html` com **SHA256 idêntico**. Divergência sem mudança de fonte = bug.

Hash de referência (13 payloads, 8.893.043 bytes):

```
14A320BE283D87F4EDDF1DB59DA0CA667DDA8C3618F416EBFA7BD4E29B1BD2AD
```

Esse hash foi mantido através das Fases 1 e 2 — extrair fontes, libs e decompor o
comparativo não mudou um byte da saída.
