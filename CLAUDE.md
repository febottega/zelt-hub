# Hub de Ferramentas — ZELT Imóveis

Portal interno da equipe de corretores (Blumenau/SC), publicado em
https://febottega.github.io/zelt-hub/ (repo `febottega/zelt-hub`, Pages no root de `main`).

## REGRA PRINCIPAL: nunca leia nem edite o index.html

`index.html` (10,4 MB) é **gerado**. Contém as 17 ferramentas em base64 — ilegível
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

**Use `-OutFile` só para comparar hash.** Depois de qualquer mudança de conteúdo
(dados, layout, lógica), rode `.\build.cmd` sem `-OutFile`, para que o `index.html`
da pasta seja de fato atualizado — é esse arquivo que o Felipe abre no navegador
para revisar antes de publicar. Gerar em temporário e dizer que "está pronto" faz
ele abrir a versão velha. O `deploy.cmd` já roda o build por dentro; não precisa
buildar duas vezes.

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
| simulador SAC / PRICE | `tools/simulador.html` | 106 KB |
| painel de avaliações (`DADOS`, `KPIS`) | `tools/avaliacoes.html` | 97 KB |
| relatório da semana atual | `tools/avaliacao.html` | 407 KB |
| hero, cards, overlay do hub | `hub.html` | 84 KB (~35 KB de código) |

Nunca leia esses arquivos por inteiro. Use `Grep` para localizar e `Edit` com
`old_string` preciso; onde precisar de contexto, `Read` com `offset`/`limit`.

## As ferramentas

Seis cards. Cinco são payloads embutidos; o **Painel de Pauta** é externo
(`uweradloff.github.io/painel-pauta-zelt/`).

- **avaliacoes** — painel: array `DADOS` (imóveis) + `KPIS` (semanais). Filtros por
  código, endereço, corretor, bairro, quartos, suítes, tipo, semana, faixa.
- **avaliacao** + 10 arquivados — relatórios semanais paginados; os antigos em `frozen/`.
- **comparativo** — 57 empreendimentos. Abas: comparativo, mudanças, melhores preços,
  tabelas de vendas, investimentos.
- **gerador** — 5 documentos (proposta, autorização/captação, locação, entrega de
  chaves, checklist). Rascunhos em `localStorage` (`zelt_*_v1`); exporta com
  html2canvas + pdf-lib.
- **simulador** — financiamento SAC ou PRICE, escolhido no `#sisToggle`. O mesmo
  `simular(sis,...)` atende os dois: em SAC a amortização é fixa em `P/n`, em PRICE
  a parcela é fixa na PMT e a amortização é o que sobra dela. A amortização extra
  abate do saldo nos dois casos, encurtando o prazo.
- **arquivos** — tabela de PDFs para o cliente; os arquivos ficam em `arquivos/` na
  raiz do repo, fora do payload, e abrem em aba nova.

Zero bibliotecas externas em runtime além do que está em `vendor/`. Gráficos são
HTML/CSS/SVG próprios.

## Como o hub carrega uma ferramenta

Cada payload é `<script type="text/plain" data-tool="NOME">BASE64</script>`. O hub
decodifica com `atob` + `TextDecoder('utf-8')` e injeta num `<iframe srcdoc>` num
overlay. Rotas por hash + `pushState`; `Esc` fecha.

Voltar ao hub: o clique no **logo da ZELT** no topo de cada ferramenta manda
`zelt-close-tool`. O bloco fica no fim de cada fonte e a unica linha que muda
e o seletor do logo (`var SELETOR`), porque cada ferramenta monta o cabecalho
de um jeito; o clique usa delegacao no `document`, entao vale para logo
desenhado por JS depois do load. A **arquivos** nao tem logo e usa um X no
canto do painel. O relatorio semanal e os congelados seguem com o botao fixo
antigo no codigo, mas ele ja fica `display:none` porque eles so abrem dentro
do painel (`html.zelt-aninhado`), onde a volta e pela aba "Menu de Pesquisa".

`postMessage`: `'zelt-close-tool'`, `{zelt:'get-tool'}` → `{zelt:'tool-html'}`,
`{zelt:'open-tool', focus}`, `{zelt:'focus', code}`.

Ao buscar um payload no `index.html`, ancore no início da linha —
`^<script type="text/plain" data-tool="X">` — porque `data-tool="X"` também casa
com o card no `hub.html`.

## Invariante do build

Determinístico e byte-exato. Se nenhum fonte mudou, rebuildar produz um
`index.html` com **SHA256 idêntico**. Divergência sem mudança de fonte = bug.

Hash de referência (17 payloads, 10.918.247 bytes):

```
EDBCB1AFAD97B16DBF8CD7C9A3C3C52E1FF37D6FEBE5CA81D6F5C3918202BFBD
```

**Atualize esse bloco a cada mudança de conteúdo** — ele só serve para provar que
um rebuild sem mudança de fonte dá a mesma saída, e um hash velho não prova nada.

## Rotina semanal da avaliação

Toda segunda chega um HTML novo em `C:\Users\User\Downloads\MODELOS IA\Avaliação de
Imóveis DD_MM.html`. Ele passa a ser a semana atual e a anterior é arquivada.

**O relatório novo é a fonte de todo número — não calcule nada de cabeça.** Dentro
dele: `CONFIG` (data, `numCorretores`), `DETALHES` (endereço, bairro, dorms, vagas,
suítes, áreas de cada imóvel), `<tbody id="tbl-body">` (valores, nota, gap, faixa) e
a tabela "Todas as semanas", que já traz a linha da semana atual pronta para conferir.

**Ferramentas nesta máquina:** `node` (v24.19.0) e `npx` existem e rodam direto, tanto
no bash quanto no PowerShell. `python` **não** existe: o `python` do PATH é o atalho da
Microsoft Store e só devolve mensagem de erro. `perl` e o PowerShell 5.1 também estão
disponíveis.

Para ler e validar os dados, `node` é o caminho mais curto — inclusive para dar
`eval` num `.js` de dados e conferir contagens, ou `node --check` num script. O
`ConvertFrom-Json` do PowerShell serve igual para as três linhas do `avaliacoes.html`.

Para **editar** as linhas gigantes use `perl` lendo o texto novo de um arquivo, nunca
quoting inline: com `▲`, `−` e `·` no meio, quebra. E cuidado com heredoc — o `\n`
escrito como barra dupla chega ao arquivo com uma barra só, então âncoras de busca não
devem depender de escapes; prefira casar linhas inteiras ou usar classes de caractere.

### 1. Monta o `avaliacao.html` novo

`src/tools/avaliacao.html` é o HTML cru **sem** os 14 bytes finais (`</body></html>`)
mais um bloco de rodapé de 5.115 bytes: botão "Hub ZELT", classe `zelt-aninhado` e o
`postMessage` de `focus`/`scroll`/`drawer`. Extraia o bloco do arquivo que está
saindo — nunca reescreva na mão:

```bash
RAW="C:/Users/User/Downloads/MODELOS IA/Avaliação de Imóveis 25_08.html"
OFF=$(grep -abo -- '<!-- ZELT: voltar ao hub -->' src/tools/avaliacao.html | cut -d: -f1)
tail -c +$((OFF-7)) src/tools/avaliacao.html > rodape.txt
head -c $(( $(wc -c < "$RAW") - 14 )) "$RAW" > nova.html
cat rodape.txt >> nova.html
```

### 2. Congela a semana que sai

```bash
base64 -w0 src/tools/avaliacao.html > src/frozen/avaliacao-DD-MM.b64
cp nova.html src/tools/avaliacao.html
```

Uma linha só, sem newline no fim — é assim que os outros `.b64` estão.

### 3. `src/order.txt`

O nome novo entra logo depois de `avaliacao`, mantendo a ordem cronológica invertida.

### 4. `src/tools/avaliacoes.html` — três linhas

Três linhas, cada uma um array/objeto imenso numa única linha. **Não confie no
número da linha** — ele muda toda semana, porque o arquivo cresce. Localize por
nome:

```bash
grep -n "^var DADOS\|^var KPIS\|^var SEMANAS_NO_HUB" src/tools/avaliacoes.html
```

Emende o texto novo na frente da linha em vez de reparsear e reescrever tudo: os
registros antigos guardam `7950000.0` (float com `.0`), e um `JSON.stringify`
escreveria `7950000`, misturando 163 registros recosturados com a semana nova.
No `DADOS`, `a`, `k`, `g`, `n`, `m`, `mt` e `dr` são float; `d`, `v` e `s` são int.

O conteúdo de cada uma:

- **`SEMANAS_NO_HUB`** — `"DD/MM/AAAA":"avaliacao"` na frente; a chave da semana
  anterior passa a apontar para `"avaliacao-DD-MM"`.
- **`KPIS`** — nova entrada na frente com `"atual":true`; a anterior vira `false`
  (é o `atual` que desenha o "· atual" e a tag "Atual" no painel).
- **`DADOS`** — os imóveis novos na frente, na ordem do ranking do relatório
  (pior gap primeiro).

Campos de cada imóvel no `DADOS`, nesta ordem:

| campo | de onde vem |
|---|---|
| `c` | código |
| `t` | prefixo do código: AP=Apartamento, CA=Casa, CO=Cobertura, TE=Terreno, SA=Sala comercial, PR=Prédio, GA=Galpão. **Prefixo novo aparece de vez em quando** (o GA estreou em 01/09): confira o trecho do meio do `local`, que costuma nomear o tipo |
| `cap` | coluna Captador |
| `w` | data da semana, `DD/MM/AAAA` |
| `a`, `k` | Anunciado, Consenso |
| `g` | Gap em pontos percentuais (`-19.8`) |
| `n` | Nota |
| `f` | Leitura: `Revisar` / `Leve ajuste` / `Alinhado` |
| `e`, `cm`, `b` | `DETALHES[cod].local` partido por ` · `: primeiro trecho, miolo, último |
| `d`, `v`, `s` | dorms, vagas, suítes — **omita** o campo quando o imóvel não tem |
| `m` + `ml` | `areaUtil`→`m² úteis`, `areaConstr`→`m² constr.`, `areaTotal`→`m² total` |
| `mt` | `areaTerreno` |
| `dr` | `a - k` |
| `vd` | 1:1 com `f`: Revisar→`Acima do preço de mercado`, Leve ajuste→`Levemente acima do mercado`, Alinhado→`Dentro do preço de mercado` |

No `KPIS`: `corretores` é o `CONFIG.numCorretores`; `gap_medio` e `nota_media` são as
médias simples com uma decimal; as `bandas` são a contagem por `f` (Revisar / Leve
ajuste / Alinhado). Os deltas comparam com a semana anterior no formato `▲ +3`,
`▼ -1`, `— 0`, e `gap_delta` leva ` p.p.` no fim.

### 5. `src/hub.html`

O chip do primeiro card: `<span class="chip">Atualizado em DD/MM</span>`.

### 6. Confere e publica

```bash
.\deploy.cmd "Avaliacao de Imoveis: semana DD/MM como atual, DD/MM arquivada"
```

Antes de publicar, valide as três linhas editadas — um `DADOS` com JSON quebrado
deixa o painel em branco e o build não reclama:

```powershell
$l = [System.IO.File]::ReadAllLines('src\tools\avaliacoes.html', [System.Text.Encoding]::UTF8)
foreach ($i in $idx) {   # os indices vem do grep acima, menos 1
  $t = $l[$i]; $t = $t.Substring($t.IndexOf('=') + 1).Trim().TrimEnd(';')
  try {
    $o = $t | ConvertFrom-Json
    $n = @($o).Count
    if ($n -eq 1) { $n = @($o.PSObject.Properties).Count }
    Write-Output ("linha " + ($i+1) + ": OK, " + $n + " itens")
  } catch { Write-Output ("linha " + ($i+1) + ": JSON INVALIDO -> " + $_.Exception.Message) }
}
```

A contagem de imóveis, a soma de `a` e a soma de `k` têm de bater com os KPIs do
próprio relatório. Confira também que só uma semana ficou com `atual:true`.
