# Hub de Ferramentas — ZELT Imóveis

Portal interno da equipe de corretores (Blumenau/SC), publicado em
https://febottega.github.io/zelt-hub/ (repo `febottega/zelt-hub`, Pages no root de `main`).

## REGRA PRINCIPAL: nunca leia nem edite o index.html

`index.html` (11 MB) é **gerado**. Contém as 26 ferramentas em base64 — ilegível
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
   ├─ order.txt        os 26 nomes, um por linha, NA ORDEM de injeção
   ├─ assets/fonts/    8 fontes TTF em base64, COMPARTILHADAS — nunca ler
   ├─ vendor/          pdf-lib (512 KB) e html2canvas (193 KB) — nunca ler
   ├─ tools/           ferramentas (arquivo único OU pasta)
   └─ frozen/          19 relatórios históricos em base64 — nunca ler; editar só por script
```

**`src/frozen/` não é intocável, é ilegível.** Cada `.b64` é uma linha de 500 a
700 KB: ler custa contexto à toa e editar à mão é impossível. Quando precisar
mexer (foi o caso das avaliações por corretor), faça por script: decodifique num
temporário, aplique cada troca com guarda de "1 ocorrência", reencode em uma
linha sem newline e **prove que o arquivo novo é o antigo mais as inserções
previstas**. Cada `.b64` decodifica byte a byte — o round-trip é a primeira
conferência a fazer.

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
| lógica/filtros/gráficos do comparativo | `tools/comparativo/app.js` | **71 KB** |
| os 75 empreendimentos (preço, entrega…) | `tools/comparativo/data/empreendimentos.js` | 37 KB |
| histórico de preços | `tools/comparativo/data/price-history.js` | 76 KB |
| mudanças de preço | `tools/comparativo/data/price-changes.js` | 9 KB |
| R$/m² por bairro (custo-benefício) | `tools/comparativo/data/bairros.js` | 1 KB |
| padrão e lazer por empreendimento | `tools/comparativo/data/padrao.js` | 6 KB |
| tabelas de vendas | `tools/comparativo/data/sales-tables.js` | 131 KB |
| logos das construtoras | `tools/comparativo/data/logos.js` | 44 KB |
| CSS do comparativo | `tools/comparativo/style.css` | 46 KB |
| HTML/estrutura do comparativo | `tools/comparativo/layout.html` | 75 KB |
| gerador de documentos | `tools/gerador.html` | 288 KB |
| simulador SAC / PRICE | `tools/simulador.html` | 106 KB |
| painel de avaliações (`DADOS`, `KPIS`) | `tools/avaliacoes.html` | 135 KB |
| relatório da semana atual | `tools/avaliacao.html` | 468 KB |
| hero, cards, overlay do hub | `hub.html` | 84 KB (~35 KB de código) |

Nunca leia esses arquivos por inteiro. Use `Grep` para localizar e `Edit` com
`old_string` preciso; onde precisar de contexto, `Read` com `offset`/`limit`.

## As ferramentas

Seis cards. Cinco são payloads embutidos; o **Painel de Pauta** é externo
(`uweradloff.github.io/painel-pauta-zelt/`).

- **avaliacoes** — painel: array `DADOS` (imóveis) + `KPIS` (semanais). Filtros por
  código, endereço, corretor (imóvel captado em dupla, como "Marilene / Thais", aparece
  no filtro de cada um, não como opção própria), bairro, quartos, suítes, tipo, semana, faixa de valor
  anunciado (mínimo/máximo) e situação do preço, que aceita mais de uma marcada.
  A ordenação é de um critério, pelo cabeçalho ou pelo select "Ordenar por" —
  que existe porque o `<thead>` desaparece abaixo de 820px.
  **Link por semana** (20/10/2026): a URL acompanha a aba do painel —
  `#avaliacoes/relatorio/20-10-2026` abre direto o relatório daquela semana e
  `#avaliacoes/comparativo` a aba de comparativo (`aplicaRota` / `avisaRota`). A rota usa a
  data, não o slug, então o link continua valendo depois que a semana é arquivada.
  **Comparativo** (20/10/2026): a aba fica logo depois do Menu de pesquisa e não é mais
  por semana. Mostra a visão geral do período (imóveis, média por semana, corretores que
  votam — este do `KPIS` —, gap e nota médios, situação e tipos) e uma tabela **por
  corretor** (imóveis, semanas ativas, média/semana, % alinhado, situação, gap, nota, tipos),
  ordenável, com o detalhe semana a semana e o botão que leva o corretor ao filtro da busca.
  Período: tudo, últimas 8 ou últimas 4 semanas (`CV.n`). Dupla conta para os dois (`capsDe`).
  Filtros de tipo (`CV.tipo`) e de faixa de valor anunciado (`CV_FAIXAS`, 21/10/2026) ficam
  logo acima da tabela por corretor e filtram só ela (a visão geral segue o período); o botão
  "Ver os imóveis" leva corretor, tipo e faixa para a busca.
  O gap médio mostra o sinal de menos (ficou sem por um dia e o Felipe pediu de volta).
  No menu de pesquisa a etiqueta de tipo tem cor (`tipoCor`): terreno verde, casa azul,
  apartamento amarelo, cobertura vermelha (trocadas a pedido em 21/10); os demais tipos no cinza padrão. Em "Tipos
  captados" do comparativo, só apartamento, casa, terreno, cobertura e sala comercial ficam
  sozinhos; o resto soma numa linha "Outros" que abre (`<details>`) para mostrar cada um.
  ZELT e Maria Helena ficam fora da tabela por corretor (`CV_FORA`), a pedido do Felipe; os
  imóveis deles continuam na visão geral e na busca.
- **avaliacao** + 19 arquivados — relatórios semanais paginados; os antigos em `frozen/`.
  Desde 26/10/2026 as abas "Relatório / Comparativo" de cada relatório (`.tabbar`, radios
  `#rad-rel`/`#rad-cmp`) e o `#tab-comparativo` ficam escondidos: o painel emenda o
  `CSS_SEM_CMP` no texto do HTML ao abrir (`semComparativo`), o que vale também para os arquivados.
- **comparativo** — 75 empreendimentos. Abas: comparativo, custo-benefício, tabelas de vendas,
  investimentos, mudanças. **Toda mudança no comparativo atualiza a data em
  dois lugares**: o `#updated-date` do cabeçalho (`tools/comparativo/layout.html`,
  `DD/MM/AAAA`) e o chip do card "Empreendimentos" no `hub.html` (`Atualizado em DD/MM`).
  Pedido do Felipe em 30/09/2026, quando a data tinha ficado parada em 09/09.
  A aba **Custo-benefício** (era "Melhores preços" até 29/10/2026; a rota segue `#comparativo/precos`)
  ranqueia por nota de 0 a 10, não por preço: o preço esperado de cada card é o R$/m² do bairro
  (`M2_BAIRRO`, em `data/bairros.js`: mediana de anúncios do A Corrida dos Bairros, out/2026) vezes
  os efeitos de área, proporção de suítes, vagas, tipo (cobertura, terraço, loft) e nº de itens de lazer,
  medidos por regressão nos próprios cards **no carregamento** (`CB`, no `app.js`) — card novo entra sozinho, desde
  que o bairro dele esteja no `M2_BAIRRO` (senão fica fora e o quadro "Como a nota é calculada" avisa).
  Nota 5 = preço esperado; cada ponto ≈ 6% (`CB_ESCALA = 0.30`). Terrenos têm modelo próprio (bairro e
  área) e só se comparam entre si. Esgotados ficam no fim, sem posição. O preço é o `media` do card e a
  área, a que corresponde a ele (`cbArea`: meio da faixa onde o `rpriv` foi `media/apriv`, senão
  `media/rpriv`). Ao ajustar, a elasticidade livre da localização deu 1,12 — por isso o índice entra
  com peso 1. O modelo não vê vista, andar nem condição de pagamento; o quadro diz isso.
  **Padrão e lazer** (29/10/2026): `PADRAO_LAZER` em `data/padrao.js`, chave = nome do card sem o " - ..."
  (os 44 empreendimentos). Veio de uma pesquisa na web (planilha "Pesquisa padrao e lazer.csv" em
  Downloads) revisada pelo Felipe, que decidiu: Vista 43 Médio, Amani 53 Altíssimo, Flow Alto, DUO e
  Bothanic Altíssimo, Egon Belz, Flow, Grand Park, San Vito e Villa Toscana Médio, Valverde
  Econômico, e **os de Minha Casa Minha Vida — Scire e Marini — Econômico**. O padrão é do
  produto, nunca do preço. Ele entra com **peso fixo** (`CB_PADRAO`: −8% / 0 / +10% / +20%, da proporção
  entre padrões do CUB × a obra ser ~metade do preço): medido solto, o econômico saía 10% mais caro que o
  médio, porque os seis são de duas construtoras em bairros de índice baixo. O lazer é contado sem a
  portaria 24h e é medido (+2%/item em 29/10); `lazer: null` é "não achamos", não "não tem", e recebe a
  média do mesmo padrão (nenhum card hoje). O Gard tem só a quantidade, `lazer: 6` (o Felipe informou;
  o book no Drive é imagem e a tabela da Castelo não lista o lazer) — `cbLazerN` aceita número ou lista. O lazer de Kaisergarten, Flow, Vista 43 e Amani 53 veio das pastas do Drive da ZELT.
  A aba tem **filtro por padrão**: quatro botões (Altíssimo, Alto, Médio, Econômico) ao lado da área
  privativa, não dropdown, a pedido do Felipe (`buildPadraoBtns`, `pstate.padrao`, `padraoDe(d)`). Cada
  linha do ranking mostra a área mínima e máxima do card (`cbArea2`). Entre a área e os botões fica a busca
  por empreendimento ou construtora (`#p-search`, `pstate.search`, mesma regra da busca do comparativo); os terrenos estão como Alto no
  `PADRAO_LAZER` e aparecem nesse filtro, embora o padrão não entre na nota deles. Card de empreendimento novo:
  ponha o nome no `PADRAO_LAZER`, senão ele fica fora do ranking. Terrenos não usam padrão nem lazer.
  O **Grand Park** (Andraus) fica na **Vila Nova** (Rua Almirante Barroso, 739); até 29/10/2026 o
  card dizia Velha.
  O **Egon Belz** (Castelo) se chamava "Residencial EB" até 06/10/2026; o nome mudou em
  todos os arquivos de dados e no `DRIVE_LINKS` — a âncora da tabela agora é `#tab-egon-belz`.
  Na aba tabelas de vendas, as tabelas de `SALES_ORDENAVEL` (`app.js`: os dois Vista 43,
  os dois Tulum e o Central Park) têm o cabeçalho da coluna de valor principal
  (`summary.principal.col`) como botão: 1º clique do mais barato ao mais caro, 2º o
  inverso, 3º volta à ordem da construtora. Cada linha leva o índice original no
  `data-ri`, que é o que o "Copiar Resumo" usa. Para outra tabela, é só pôr o nome no Set.
  **Colunas de valor sempre na direita** (29/10/2026): em toda tabela de vendas, as colunas
  de valor total da unidade ficam por último, ao lado do Resumo, do mais parcelado para o mais
  curto e com o **à vista sempre na ponta** (ex.: "Em 60x → Nas chaves → À vista"). O
  cabeçalho delas ficou laranja por um dia e voltou ao azul a pedido do Felipe; o destaque
  agora é o botão "Copiar Resumo", na mesma cor laranja do "Ir à tabela original" (`--orange-500`,
  texto branco). O topo da coluna Resumo ficou amarelo por um dia e voltou ao azul a pedido do Felipe. Isso é só desenho: o `SALES_VALORES` do `app.js`
  lista, **por nome de coluna**, as colunas de valor de cada tabela e o `salesTableHTML`
  reordena na hora; os dados continuam na ordem da construtora, e o resumo, a ordenação e o
  `data-ri` seguem pelo índice original.
  **Sem rolagem lateral** (29/10/2026): o cabeçalho quebra linha, o padding das células é 9px,
  texto com mais de 16 caracteres que não é preço (vagas, tipologia) vira `td.txt-cell` e
  pode quebrar, e as vagas do Alameda Giardini e do Lisbon foram encurtadas para "V02 dupla +
  V06 + Box 05" (o resumo diz "Vagas: …"). Medido em janela de 1366px: as 44 tabelas cabem,
  e a mais larga é a do Alameda (1248px de mínimo para 1270 disponíveis). Abaixo de ~1280px
  o Alameda, o Central Park e o Criatto voltam a rolar um pouco. **Tabela nova: ponha o nome dela no `SALES_VALORES`**
  (sem isso ele cai no principal + alternativas do `summary`, com o à vista por último).
- **gerador** — 5 documentos (proposta, autorização/captação, locação, entrega de
  chaves, checklist). Rascunhos em `localStorage` (`zelt_*_v1`); exporta com
  html2canvas + pdf-lib.
- **simulador** — financiamento SAC ou PRICE, escolhido no `#sisToggle`. O mesmo
  `simular(sis,...)` atende os dois: em SAC a amortização é fixa em `P/n`, em PRICE
  a parcela é fixa na PMT e a amortização é o que sobra dela. A amortização extra
  abate do saldo nos dois casos, encurtando o prazo.
- **arquivos** — tabela de PDFs para o cliente; os arquivos ficam em `arquivos/` na
  raiz do repo, fora do payload, e abrem em aba nova. Desde 20/10/2026 não tem card: abre pela
  caixinha de correspondência (`.hero-mail`, `data-tool="arquivos"`) no topo do hub, à esquerda
  de "Simulação e Pré Aprovação"; abaixo de 640px a caixinha mostra o nome ao lado do ícone.
- **captacoes** — Captações × Angariações (entrou em 20/10/2026 no lugar do card de
  arquivos): ranking por corretor de angariações vendidas, carteira, tempo de cadastro,
  qualidade, leads por imóvel e % sem procura. É o HTML que o Felipe manda, inteiro, mais o
  bloco de voltar ao hub (`SELETOR = "header img"`); os dados ficam no `const D` do próprio
  arquivo. O cabeçalho, as fontes (Oswald + Atkinson) e o logo de 30px foram padronizados com
  o painel de avaliações por script (`cxa-padroniza.js`, no scratchpad da sessão de 20/10):
  numa versão nova, refaça essa padronização e reemende o bloco do fim.

No topo do hub, à direita do logo — no lugar do antigo selo "Uso interno ·
Equipe de corretores", tirado em 25/09/2026 —, fica a caixa `.hero-links`
com dois links externos de crédito da SB, que abrem em aba nova: **Simulação e
Pré Aprovação** (store.bpotech.com.br) e **Calculadora de Poder de Compra**
(sbcreditoimobiliario.com/parceiros). Abaixo de 760px a caixa desce para uma
linha própria e abaixo de 640px os botões ficam um sobre o outro.

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

Desde 21/10/2026 o logo tem um **sinal de voltar**: uma bolinha laranja com seta no canto
superior esquerdo (`.zelt-volta` + `.zelt-volta-ic`). A funcao `marcaVolta(el)`, no mesmo
bloco do fim de cada ferramenta (e no bloco do topo do painel de avaliacoes), embrulha o
logo num `span.zelt-volta` e poe o sinal. Ferramenta nova com logo: copie o bloco inteiro.

`postMessage`: `'zelt-close-tool'`, `{zelt:'get-tool'}` → `{zelt:'tool-html'}`,
`{zelt:'open-tool', focus}`, `{zelt:'focus', code}`.

O painel de avaliações, porém, abre a ficha do imóvel **mexendo no DOM do
relatório**, não por mensagem: ele acha a linha do código (`td.code`), clica no
`button.btn-rel` dela e emenda no **texto do HTML, antes de virar `srcdoc`**, um `<style>`
que, **só na tela**, esconde tudo do relatório menos `#imovel-overlay` (injetar
no `onload` era tarde: o navegador já tinha pintado o relatório, e era isso que
piscava; o iframe também fica `visibility:hidden` até a ficha estar montada,
senão o relatório anterior aparece enquanto o novo carrega) — assim a ficha aparece por cima do menu de
pesquisa, sem trocar de aba, e o fundo translúcido dela deixa a lista à vista
(`#tab-rel.ficha` no painel). A impressão fica de fora do `@media screen` porque
o `imprimirImovel()` do relatório monta a folha a partir da página inteira. É assim porque os doze relatórios congelados carregam uma
versão antiga do rodapé e não entenderiam mensagem nova — mas o DOM deles o
painel alcança, porque iframe `srcdoc` herda a origem. **Mensagem nova para o
relatório só vale para a semana atual**; o que precisa valer para as treze
semanas tem de ser feito do lado do painel.

Ao buscar um payload no `index.html`, ancore no início da linha —
`^<script type="text/plain" data-tool="X">` — porque `data-tool="X"` também casa
com o card no `hub.html`.

## Invariante do build

Determinístico e byte-exato. Se nenhum fonte mudou, rebuildar produz um
`index.html` com **SHA256 idêntico**. Divergência sem mudança de fonte = bug.

Hash de referência (26 payloads, 16.835.776 bytes):

```
C4993086B90C255A3DC304B67CDB19259E10FB1383677AC107685A5DC0AA3F6C
```

**Atualize esse bloco a cada mudança de conteúdo** — ele só serve para provar que
um rebuild sem mudança de fonte dá a mesma saída, e um hash velho não prova nada.

## Páginas fixas do gerador

Cada documento do gerador tem `.page` de altura fixa (297mm) e, no `@media print`,
`overflow:hidden` — **o que passa é cortado em silêncio**. A marca e o rodapé são
`position:absolute` no fim da folha, então o limite real é o topo do `.doc-mark`
(1053px), não o fim da página.

Para medir se cabe, com a ferramenta aberta: pegue o último filho **estático** da
`.page`, some `offsetTop + offsetHeight` e compare com o `offsetTop` do
`.doc-mark`. Meça com campos **cheios e compridos**: com texto curto as células
ficam na altura mínima e a conta engana. Reduzir `table.t td{height}` quase não
rende nesse caso, porque as células já passaram do mínimo.

Em 09/09/2026 a proposta ganhou a linha de e-mail/telefone/nascimento do cônjuge e
a página 1 não tinha espaço — ela já estourava 2mm com valores de tamanho real. A
solução foi mover a **seção 4 (imóvel no negócio, opcional)** para a página 2, que
tinha 74mm livres. O branco que sobrou embaixo das assinaturas voltou para as
seções 1-3 como margem maior, presa ao `#page1` — a `.sec-h` é compartilhada com os
outros quatro documentos e com a própria página 2, que tem só 22mm de folga.
Por fim as **linhas de assinatura viraram `position:absolute` no pé do #page1**
(`bottom:22mm`, 3,4mm acima da marca): presas, elas não andam com o tamanho do
cadastro e o texto que cresce em cima não empurra ninguém para fora da folha. O
limite passou a ser "o conteúdo bate nas assinaturas", não "o conteúdo passa da
página". Medido: cadastro normal deixa 34mm entre a data e as assinaturas, o pior
caso que consegui construir deixa 5mm — e é essa faixa que absorve um cadastro
longo, então ela não pode ser preenchida. Seções em ordem 1-2-3 / 4-5-6.

### Campo do PDF que come o texto ao lado

O PDF do gerador é a **imagem** da folha (html2canvas) com **campos de formulário
do pdf-lib por cima**; o texto digitado é apagado da imagem e vira campo. Para o
campo ter área de clique, ele se **estica até a direita do container** — ótimo
quando é a última coisa da linha ("Endereço: ______"), péssimo quando há texto
**depois** dele: o retângulo opaco do campo cobre esse texto na imagem e ele
some do PDF. Foi o que aconteceu com o "dias, renováveis" da cláusula 1 da
locação, onde um campo de 10,5pt virava 108pt.

A regra passou a ser: **se há texto depois do campo no mesmo container, o limite
é o próprio campo** (`limiteDireita`, que caminha os nós de texto com
`compareDocumentPosition`). Esses campos ficam marcados como `justo`, e neles a
largura mínima de 24pt — que existe só para o campo não ficar impossível de
clicar — cai para 6pt, senão ela mesma invadiria o texto seguinte. São **14 dos
306 campos** dos cinco documentos; sete deles são da proposta, que já desenha
tudo transparente.

Como o campo justo não se estica mais, a folga tem de vir do **CSS**: o
`#Lp_prazoDias` ganhou `min-width:30px` (22,5pt no PDF) para caber três dígitos.
Medido depois da correção: o campo termina 2,1pt antes de onde começa o "dias".

Para medir isso com a ferramenta aberta, zere o `transform` do `.preview-scaler`
antes de ler qualquer `getBoundingClientRect` — é o que o próprio gerador faz
antes de capturar, e sem isso todas as medidas saem na escala da prévia.

**O campo também não pode encostar no rótulo de cima.** No `.uf` o rótulo e o
campo são irmãos numa coluna flex, então a base da caixa do rótulo é exatamente
o topo do campo — e a Oswald, com `line-height:1.2` em 8,4px, tem caixa de
conteúdo de 12px contra 10,08px de caixa de linha: o pé das letras fica a menos
de 0,5px da borda. O realce azul que o leitor de PDF desenha no campo começava
rente a esse pé e dava a impressão de que as palavras estavam cortadas (relatado
em 17/09/2026 na locação). A correção foi no campo, não no CSS, para não mexer no
layout dos cinco documentos: o campo de uma linha agora começa **1,6pt abaixo do
topo**, além dos 1,8pt que já parava acima da base para preservar a linha de
escrever. A guarda `fh<8` mantém o comportamento antigo nos campos baixos
demais. Medido nos 65 campos rotulados da locação: folga de 1,6pt em todos, com
altura mínima de 12,2pt.

## Rotina semanal da avaliação

Toda segunda chega um HTML novo em `C:\Users\User\Downloads\MODELOS IA\Avaliação de
Imóveis DD_MM.html`. Ele passa a ser a semana atual e a anterior é arquivada.

**O relatório novo é a fonte de todo número — não calcule nada de cabeça.** Dentro
dele: `CONFIG` (data, `numCorretores`), `DETALHES` (endereço, bairro, dorms, vagas,
suítes, áreas de cada imóvel), `<tbody id="tbl-body">` (valores, nota, gap, faixa) e
a tabela "Todas as semanas", que já traz a linha da semana atual pronta para conferir.

**Modelo novo, a partir de 08/09/2026:** o relatório traz também
`CORRETORES_SEMANA` (quem avaliou na rodada) e `AVALIACOES` (`{codigo: [[nome,
valor], ...]}`), e a ficha de cada imóvel ganhou o bloco "Ver avaliações", que
lista o que cada corretor sugeriu. Valor `null` é quem não avaliou e aparece como
"não avaliou". Isso rende duas conferências novas: `CORRETORES_SEMANA.length`
tem de ser o `CONFIG.numCorretores`, e a **média das sugestões numéricas de cada
imóvel, ignorando os `null`, tem de dar o consenso (`k`)** — na rodada de 08/09
fecha nos 19, com dois imóveis em que alguém não avaliou. O painel não guarda
esses valores: eles ficam só no relatório.

### Levar as avaliações por corretor para uma semana antiga

O Felipe manda as respostas do formulário como HTML exportado do Google Sheets
(`C:\Users\User\Downloads\Respostas ao formulário DD_MM.html`), e o nome do
arquivo diz de que semana são os imóveis. Em 10/09/2026 entraram assim **as treze
semanas**, de 16/06 a 08/09 — todas têm o bloco. Numa semana nova, o relatório
já vem com ele; o roteiro abaixo é para reprocessar ou corrigir uma antiga.

O layout da planilha: coluna A carimbo, B nome, e daí em diante pares de colunas
`"CÓDIGO - R$ anunciado"` + `"De uma nota ao imóvel acima:"`. Variações que já
apareceram e o leitor tem de aguentar: cabeçalho embrulhado num `<div>` com
`<svg>` de ícone (coluna formatada como número/moeda), anunciado **sem** o `R$`
(SA0736 em 28/07), coluna sobrando no meio (`"Coluna 13"` em 14/07 — ela ocupa um
par inteiro, então os imóveis seguem nos índices pares, mas o cabeçalho tem de
ser ignorado, não tratado como erro) e linhas de lixo depois das respostas.

Três armadilhas, com a solução que funcionou:

- **O texto vem à mão** e aparece de tudo: `750mil`, `R$ 1000m`, `7.9k`,
  `1.600.000.00`, `R$280.0000,00`, `R$ 8 milhões`, `sem resposta`, `ok`, `N SEI`.
  **Não** multiplique por mil no sufixo `mil`/`m`/`k` — alguém escreve
  `R$ 990.000m` querendo 990 mil. Leia o número cru (vírgula = decimal; pontos
  são milhar só quando todo grupo depois do primeiro tem 3 dígitos) e escolha a
  ordem de grandeza pela potência de 10 que mais aproxima do **valor anunciado**.
- **O formulário quase sempre tem mais respostas do que o
  `CONFIG.numCorretores`** do relatório, porque gente responde depois de ele ter
  sido gerado — aconteceu em 6 das 13 semanas (23/06, 30/06, 07/07, 14/07, 21/07,
  18/08 e 25/08). Não adivinhe quem: **descubra**, testando as combinações e
  ficando com a única em que todos os consensos da semana fecham. Em todas as
  vezes os excluídos foram exatamente os últimos carimbos de data/hora — o
  relatório sai pela manhã e quem responde depois perde a rodada. Isso vale como
  conferência, não como critério.

- **O relatório às vezes descartou uma célula.** Em 23/06 a Vanessa escreveu
  "8.000.000" num terreno de 910 mil e em 07/07 a Marilene escreveu
  "R$ 1.600.00000"; nos dois casos o consenso só fecha com uma avaliação MENOS,
  ou seja o número torto foi jogado fora em vez de corrigido. Então, depois de
  achar a rodada, procure por imóvel a **menor** quantidade de células que,
  tratadas como "não avaliou", fazem a média dar o `k` exato — e quando houver
  empate, fique com a célula que o normalizador precisou reescalar. Isso só
  remove valor, nunca inventa.

Depois disso a leitura fica provada por três caminhos independentes: a média dos
valores dá o `k` de cada imóvel, a média das notas (coluna que não entrou em
nada) dá o `n`, e o `nota_media` da semana bate com o KPI.

**16/06 é o relatório que não fecha sozinho, e os dois oráculos concordam
nisso:** oito dos nove consensos só fecham SEM a linha do Ricardo da Silva
(média de 6), e o nono, o AP8084, só fecha COM ela
(`k = 4.120.000/7 = 588.571,43`). A nota, que é coluna independente, aponta
exatamente os mesmos oito imóveis. Ou seja: aquele relatório contou a resposta
dele num imóvel e ignorou nos outros oito. O que ficou gravado é o que cada
corretor escreveu de verdade, com os sete que responderam — então nesses oito
imóveis a média dos valores mostrados difere do consenso exibido em até 1,4%.
Não é erro de leitura nem de digitação: é defeito daquele relatório, e mexer no
consenso mexeria no gap, na nota e nos KPIs da semana.

**Nomes.** Cada um assina como quer e a mesma pessoa aparece de cinco jeitos
("Ricardo da Silva", "Ricardo Da Silva", "Ricardo silva", "Ricardo SILVA",
"Rica Silva"). Normalize para uma grafia por pessoa. Cuidado: **são dois
Ricardos** — Ricardo da Silva e Ricardo Amorim ("Amorim", "RAmorim",
"RICARDO AMORIM"), que o painel lista como `Ricardo S` e `Ricardo A`. Em 14/07
aparece um "Ricardo" seco; como o da Silva já está na mesma planilha como
"Rica Silva", ele foi lido como Amorim — falta o Felipe confirmar.

**Como o bloco entra no congelado.** O relatório **não** é HTML estático: o
`gerar()` roda no load e reconstrói a página. Então emendar o HTML gerado não
serve — tem de entrar no gerador. São quatro pontos, e as âncoras são idênticas e
únicas nos treze arquivos:

| ponto | âncora | o que fazer |
|---|---|---|
| CSS | o **primeiro** `</style>` do arquivo | emendar o bloco `.av-*` antes dele |
| dados + funções | `var corBanda = function corBanda(k)` | emendar antes: `CORRETORES_SEMANA`, `AVALIACOES`, `avalRows`, `avaliacoesHTML`, `avaliaramHTML` |
| ficha do imóvel | `</div>\n      <div class=\"dw-foot\">").concat(markImg(16)` | virar `</div>", avaliacoesHTML(o.code), "\n      …` |
| página 1 | `.concat(destaquesBlock, "</div>"` | virar `.concat(avaliaramHTML(), destaquesBlock, "</div>"` |

O CSS e as duas funções devem ser **fatiados do próprio `avaliacao.html`** da
semana atual, nunca redigitados, para as semanas antigas ficarem com o mesmo
código. O `head()` do modelo é uma `var` local do `gerar()`, então o
`avaliaramHTML()` emite o `<div class="sec-head">…</div>` literal em vez de
chamá-lo. Não mexa em `src/frozen` à mão: decodifique num temporário, aplique com
guarda de "1 ocorrência" por âncora, reencode em **uma linha sem newline** e
prove que o arquivo novo é o antigo mais as inserções previstas — nada mais.

A página 1 aguenta o bloco novo: o gerador escala a folha, e as treze semanas
fecham todas com a mesma folga de ~32px no pé, de 3 a 10 chips de corretor.
No PDF do imóvel e na impressão o bloco fica `display:none`.

Uma advertência de revisão: o `index.html` tem 11 MB e o navegador **guarda em
cache**. Depois de rebuildar, reabrir a mesma URL pode servir a versão velha e
dar a impressão de que o patch não funcionou. Recarregue com um parâmetro novo
(`?cb=2`) ou confira com `fetch(url, {cache:'no-store'})`. Se o navegador de
teste recusar `http://localhost:8123` ("navigation denied"), abra pelo outro
endereço (`http://127.0.0.1:8123` ou `localhost`), numa aba nova do `preview_start` — a
recusa vai e volta entre os dois; em 01/10 funcionou o 127.0.0.1, em 02/10 o localhost.

**Ferramentas nesta máquina:** `node` (v24.19.0) e `npx` existem e rodam direto, tanto
no bash quanto no PowerShell. `python` **não** existe: o `python` do PATH é o atalho da
Microsoft Store e só devolve mensagem de erro. `perl` e o PowerShell 5.1 também estão
disponíveis.

Para ler e validar os dados, `node` é o caminho mais curto — inclusive para dar
`eval` num `.js` de dados e conferir contagens, ou `node --check` num script. O
`ConvertFrom-Json` do PowerShell serve igual para as três linhas do `avaliacoes.html`.

### Editar o price-history.js: por cirurgia de texto, não reserializando

Dois detalhes desse arquivo derrubam qualquer abordagem de "ler, mexer no objeto
e reescrever":

- **Dois formatos convivem.** A maioria dos blocos é indentada (um valor por
  linha), mas alguns estão numa linha só, no estilo do `json.dumps` do Python
  (separadores `", "` e `": "`) — DUO Torre 1 e Torre 2, por exemplo.
- **As chaves de `unidades` são numéricas** e o JavaScript reordena chaves
  inteiras em ordem crescente. O Terraço Sky guarda `2101` antes de `604`; um
  round-trip por objeto embaralha isso. São 12 dos 29 blocos.

Então a edição é cirúrgica: ache o bloco pelo nome, ache o fim **casando as
chaves** (ignorando o que está dentro de string — não procure `"\n  },\n"`, que
só existe no formato indentado) e, dentro dele, emende o valor novo no fim de
cada array. Tire o separador e a indentação do próprio array que está sendo
editado e a mesma função serve para os dois formatos. O que não for tocado sai
byte a byte igual. Sempre confira antes: abrir os 29 blocos e reescrevê-los sem
alterar nada tem de devolver o arquivo idêntico.

Há ainda um **terceiro formato**, no `sales-tables.js` e no `price-history.js`:
blocos com as chaves **sem aspas** e 3 espaços de indentação — Lisbon, San Vito,
Alameda Giardini e Central Park. E a **convenção de inteiro muda de bloco para
bloco**: uns escrevem `2554730.0`, outros `2359357`. A saída é tirar as duas
coisas do próprio bloco que está sendo editado: a indentação e o separador vêm do
array que está sendo emendado, e a convenção de inteiro vem do primeiro número
inteiro que já esteja dentro de `unidades` — **só ali**, porque as datas
(`"2026-04"`) e as fontes (`"CUB R$ 3.037,72"`) também têm dígitos e enganam a
conta se a busca varrer o bloco todo.

No `empreendimentos.js` a convenção é por campo: só `apriv`, `atotal`, `vmin`,
`vmax`, `media`, `rpriv` e `rtotal` levam `.0`; `vagasN`, `entregaKey`, `id`,
`quartos` e `suites` são inteiros de verdade. O card `id 17` (Lisbon) tem
`"apriv": 117` sem o `.0` e é a exceção que existe no arquivo — mais uma razão
para trocar campo por campo em vez de reserializar o card inteiro.

**Dormitórios do card são os do projeto, não os do estoque.** `config`, `quartos` e
`suites` descrevem o empreendimento como foi lançado: quando uma tipologia esgota (o studio
do Wissen saiu da tabela em out/2026), o card continua com ela — preço e área seguem a
tabela, a configuração não. Pedido do Felipe em 16/10/2026; o Wissen voltou para "1 e 2
quartos (1 suíte)". Só mude a configuração quando ele pedir (como no Egon Belz, 1 quarto).

**O `rpriv` não tem uma fórmula só.** Dos 69 cards, 54 usam `media/apriv` e **7
usam `media` dividida pela média da faixa de área** (`(apriv+atotal)/2`): Liv,
Egon Belz, Gardens, Lago di Garda, Alphaville, Ed. Edimburgo e
Lisbon. O Central Park usa outra coisa ainda. Antes de recalcular
um R$/m², descubra qual divisor aquele card já usava — aplicar `media/apriv` num
dos sete infla o número em cerca de 10%.

O **San Vito** apto tipo (id 15) era "2 e 3 suítes" e dividia pela faixa 76,29–105,91, onde o 105,91
era área **total**, não privativa. Desde 29/10/2026 é **"2 suítes"** (pedido do Felipe: 3 suítes só nas
coberturas 1701/1704 e no terraço 402, que têm card próprio) e segue a regra dos Tulum sobre as quatro
unidades tipo da tabela — 1204, 1304, 1404 e 1503 (76,29 a 76,94 m²): `media` 603.500 e `rpriv`
7.893,16. Os terraços 403 e 404 (2 suítes) ficam fora dele; o 403 tem card de terraço.

Os **dois Tulum** usavam essa fórmula da faixa e em 23/09/2026 passaram para a
**média do R$/m² unidade a unidade** da tabela inteira, sobre o total em 72x (a
mesma base do card), a pedido do Felipe, que conferiu à mão e achou diferente. A
faixa enganava ali: a 505 dos studios tem 70,66 m² contra 34 a 36 m² das outras
41, e o meio da faixa de área (52,7 m²) ficava longe da área típica (37,3 m²) —
o card mostrava R$ 8.453,97 onde a média real é R$ 10.911,61. Pelo mesmo motivo o
`media` deles deixou de ser o meio da faixa `(vmin+vmax)/2` e passou a ser a
média real do total em 72x de todas as unidades (studios R$ 404.093,32 em vez
de 445.904,68). Quando a tabela do Tulum mudar, recalcule os dois do mesmo jeito. O **506** dos 2
dormitórios (91,70 m², área confirmada) **entra no card** como as demais: ficou fora
numa publicação de 30/09/2026 e o Felipe pediu para voltar no mesmo dia.

O **Amani 53** (Mestra, entrou em 23/09/2026) tem a entrega só com o ano, `"2031"`,
porque a construtora não informa o mês. O `entregaAno` do `app.js` antes só
lia `mm/aaaa`, e o card ficaria fora do filtro de ano; o regex agora aceita o ano
sozinho. O `entregaKey` dele é dezembro (`2031*12+12 = 24384`), para ordenar
depois de qualquer entrega com mês em 2031. A Mestra não tem logo em `logos.js` —
o card funciona sem, até alguém mandar a imagem.

O **Villaggio Treviso** (Alfablu, lotes, entrou em 23/09/2026 — com **dois L**,
como no site da construtora; passou um dia escrito "Vilaggio" e o Felipe
confirmou em 24/09 que o certo é com dois; não confundir com o Villaggio di
Fiori, da Sforza) já nasceu com a
regra dos Tulum: `media` é a média real dos 38 lotes e `rpriv` a média do R$/m²
lote a lote. A tabela veio do site da construtora (lotes.alfablu.com.br, o link
está num Doc da pasta do Drive) e traz só os percentuais da condição — 15% de
entrada, 3 aportes anuais de 2% e 36 parcelas —, então as 36 parcelas são os 79%
restantes divididos por 36; a nota da tabela diz isso.

O **Criatto** (Torresani, Centro, entrou em 13/10/2026) segue o modelo do Vista 43: uma
tabela "Criatto" e dois cards, "Criatto - 2 suítes" (97,90 e 98,30 m²) e "Criatto - 3
suítes" (128,54 m²), os dois com `"tabela": "Criatto"`; a tabela declara construtora,
bairro e entrega no `summary` porque nenhum card tem o nome dela. O duplex 701 fica só na
tabela, fora dos cards, a pedido do Felipe. Base dos cards: o valor "até as chaves"; o
"total financiado" (soma nominal do plano de 84 meses) vai como alternativa. `media` e
`rpriv` pela regra dos Tulum (média real e R$/m² unidade a unidade). A Torresani não tem
logo cadastrado; a pasta do Drive (1qKxpNV7…) está no `folderId` da tabela e no `DRIVE_LINKS`.

O **Malta** (out/2026): da Hill sobrou só a cobertura 1201; 302, 406, 1203 e 1204 são de um
investidor e vendidas pela **Torresani** (25% + 60x ou −3% à vista). Na tabela elas levam a
etiqueta verde "Torresani" — campo `etiquetas: {unidade: texto}` da tabela, desenhado como
`.utag-etq` pelo `app.js`; serve para qualquer outra tabela. O card de apto tipo (id 14) usa a
302 e a 406; 1203 e 1204 (151 e 143 m², 12º andar) ganharam cards de cobertura próprios
(ids 68 e 69, como o da 1201), a pedido do Felipe em 20/10/2026, com 3 suítes copiadas da 1201.

O **Estanislau Park** (Marini, Água Verde, entrou em 26/10/2026): uma tabela e um card só
para 2 e 3 dormitórios, a pedido do Felipe (49,89 a 72,16 m²; a 701 é a de 3 dormitórios e as
705/706 têm 2 demi-suítes). Card pela regra dos Tulum (média real e R$/m² unidade a unidade),
porque a faixa de área é larga. A condição tem duas partes que fecham ao centavo: entrada + 60
parcelas + 5 reforços = total pago à construtora; esse total + financiamento CEF = tabela.
O **Hannover** (Marini, Água Verde, entrega 08/2027, mesmo dia) segue o mesmo modelo: um card
para 2 e 3 dormitórios, sem suíte (confirmado pelo Felipe nos dois), regra dos Tulum, mesma
condição em duas partes. A coluna da avaliação da engenharia da Caixa saiu da tabela e do
resumo a pedido do Felipe em 29/10/2026. A Marini não tem logo cadastrado.

**Empreendimento com mais de um bloco: um card só, tabela em partes** (regra do Felipe em
27/10/2026, para todos os que vierem). O card cobre todos os blocos e não fala em bloco; a
tabela de vendas leva `grupos: [{ini, titulo, sub, rotulo, entrega}]`, onde `ini` é o índice
da primeira linha do bloco. O `app.js` desenha um `tr.grp-row` antes dessa linha (só na ordem
original; ordenada por valor a tabela sai sem divisões), com o `sub` (a condição do bloco)
preso à largura da tela por `.grp-in` sticky. No "Copiar Resumo", o `rotulo` vai depois do
número da unidade e o `entrega` do grupo substitui o da tabela (`"ENTREGUE"` vira "pronto
para morar"). Quando a entrega difere entre blocos, o card usa a do bloco ainda em obra.

O **Scire Fortaleza** (Scire, Fortaleza, entrou em 27/10/2026) foi o primeiro: Bloco B (Fase I)
entregue e Bloco A com entrega 12/2026 (o card usa 12/2026). 11 unidades de 2 dormitórios,
regra dos Tulum. A condição fecha ao centavo nas duas partes:
ato + chaves + pós-chaves + financiamento (80%) = valor com desconto, e tabela − desconto =
valor. Na série de preços a
chave é apto + bloco (`1506A`, `1506B`), porque o mesmo número existe nos dois blocos. A
Scire não tem logo cadastrado.

Só o **Scire Fortaleza** leva "Scire" no nome (pedido do Felipe em 27/10/2026): Norden, Solare e
Terrasse ficam sem o prefixo nos cards, nas tabelas, nas séries e no `DRIVE_LINKS`.

O **Norden** (Itoupava Norte, entrega 12/2026, mesmo dia) segue o mesmo modelo: 14
unidades de 2 dormitórios com 1 suíte, 3 no Bloco B (Fase I: ato 4% + 80x pós-chaves 16% +
financiamento 80% em 31/10) e 11 no Bloco C (Fase II: ato 2,5% + chaves 1,5% + 80x 16% +
financiamento 80% em 30/11). O empreendimento tem 3 blocos, mas o A não tem unidade na tabela.
**`grupos` é só para blocos.** Tipologias diferentes (1 e 2 dormitórios) viram **tabelas
separadas**, uma por card, com o mesmo nome do card, como nos Tulum (pedido do Felipe em
27/10/2026, depois de o Solare e o Terrasse terem saído numa tabela só dividida por tipologia).

O **Solare** (Escola Agrícola, torre única, entrega 03/2029, mesmo dia): duas tabelas e dois
cards, "Solare - 1 dormitório" e "Solare - 2 dormitórios". A tabela de 2D veio
só em parte (29 unidades), e a nota avisa. Os cards seguem a regra dos Tulum só sobre as
disponíveis: as reservadas 709 e 803 ficam na tabela e na série, fora do card. Condição única:
ato + 29 mensais + 2 anuais (1,5% cada) + chaves (1%) + 24x pós-chaves (5%) + financiamento
(79%), que fecham ao centavo nas 41 linhas.
O **Terrasse** (com dois R, como na tabela; Vorstadt, torre única, entrega 06/2028) segue
o mesmo modelo do Solare: tabelas e cards "Terrasse - 1 dormitório" e "- 2 dormitórios"; o de 1
dormitório tem uma unidade só (a 1408). Condição: ato + 20 mensais (11%) + 3 semestrais (2%
cada) + 36x pós-chaves (10%) + financiamento — 69% nas de 2D (ato 4%) e 68% na de 1D (ato 5%).

**Colunas das tabelas da Scire** (pedido do Felipe em 29/10/2026, nas seis): sem Desconto,
sem "Valor (com desconto)", sem Avaliação e sem Situação. A coluna
**Tabela** mostra o **valor final**: nas unidades com desconto, é o valor já com desconto
(o Felipe corrigiu no mesmo dia, quando ela tinha ficado com o preço cheio). É a mesma base
dos cards e das séries, e as parcelas da construtora fecham com ela. O número de parcelas
pós-chaves vai no cabeçalho, "Parcela pós-chaves (80x)"; no Scire Fortaleza, que tem 76x no
Bloco B e 80x no A, o cabeçalho é "(76x / 80x)" e cada grupo traz `parcelaRotulos` para o
"Copiar Resumo" dizer o número certo do bloco. Sem coluna de situação, as reservadas do Solare
2D (709, 803) levam a etiqueta "Reservada" (`etiquetas`) e o `summary.situacaoPor`, que o
`buildResumo` usa na linha "Situação".

**A conta tem de fechar na tabela e no resumo** (Felipe, 29/10/2026). O financiamento é
coluna e é a última parcela do `summary.parcelas`, nas seis tabelas da Scire e nas duas da
Marini (Estanislau Park e Hannover, que tinham ficado sem ela em 26/10): sem ele, ato +
parcelas não dá o valor. Conferido nas 114 linhas, na tabela e no "Copiar Resumo": cada
parcela vezes o número do rótulo ("29 parcelas", "(24x)", "5 reforços"), mais o
financiamento, dá o valor ao centavo. Num cadastro novo, faça a mesma conta antes de publicar.
No Solare a vaga é abreviada ("144 D", "86 C") para a tabela caber; o bit da vaga tem
`troca`, que o `buildResumo` usa para escrever "(descoberta)"/"(coberta)" por extenso. No Solare 2D
a coluna é "Dormitórios" com "2 (1 suíte)" ou "2", e o bit dela tem `mapa` (valor inteiro da
célula -> texto), que devolve "2 dormitórios (1 suíte)" no resumo. O mesmo vale para o Estanislau
Park ("2", "3 + lavabo", "2 (2 demi-suítes) + lavabo") e o Hannover ("2", "3").

### Duas formas no price-changes.js

O array aceita duas formas e o painel desenha cada uma de um jeito:

- **numérica** — `{ emp, unidade, de, para, data }`: desenha as duas cifras e o
  selo "↓ Diminuiu R$ X · −Y%". **O campo `texto` é ignorado nessa forma.**
- **narrativa** — `{ emp, tipoMudanca, dir, texto, data }`: desenha um selo com
  o rótulo do tipo (`preco` → "Preços", `condicao` → "Condições de pagamento",
  qualquer outra coisa → "Disponibilidade") e o texto ao lado.

Nas duas, `unidade` serve para o cartão resolver no card certo — sem ela, uma
mudança sobre a cobertura cai no card de apartamento tipo.

**Um card por evento, nunca um por unidade.** Quando cinco lotes do Imperial
Park baixaram, o certo é um card sobre os lotes em geral, não cinco quase
idênticos — o feed é para escanear o mês. Isso empurra para a forma narrativa
sempre que o evento envolve mais de uma unidade, porque a numérica ignora o
`texto`.

### Tabelas da Cetor (DUO, Bothanic, Imperial Park, Terraço Sky)

Vêm como print de planilha, com linhas vendidas riscadas e resolução ruim. Não
há identidade interna como nas da Novo Rumo, mas há três amarras que provam a
leitura:

1. **O índice do mês.** Os valores são contratados em CUB e reajustados pela
   variação do CUB/SC, então toda linha que não foi reprecificada sobe o mesmo
   fator. Em setembro/2026 foram +0,2424% em 61 dos 63 pares agosto→setembro das
   quatro tabelas — e o mesmo 0,2424% apareceu no Balsini 195, no N Studios e no
   Wissen 2D, da Novo Rumo, que também indexam por CUB. Linha que fugir do fator
   é justamente a que precisa de atenção.
2. **A razão entre colunas.** No Bothanic o 60x/36x é constante (1,0591481 nas
   23 linhas das duas torres, igual em agosto); no Terraço Sky o 60m/36m também;
   no Imperial Park o 36M é exatamente 1,08 × o de 12 meses e o "especial à
   vista" é 0,905249 × o de 12 meses. Em agosto o multiplicador de 36M era 1,12 —
   quando ele muda, é a condição que ficou mais barata, não o preço.
3. **As gêmeas.** Unidades de mesma área e mesmo andar têm o mesmo preço entre
   torres: o 803 da torre B do Bothanic é igual ao 201 da torre A, o 1604 é igual
   ao 1602, e no DUO o 1203 da torre 2 era igual ao 1702 da torre 1.

Cuidado com a **coluna de vagas**: na resolução dos prints ela é o que erra mais.
Em setembro 40 das 43 células bateram com agosto, o que mostra que a leitura é
confiável — mas então as três que diferem são mudança de verdade e valem
conferência, sobretudo quando geram contradição (a vaga 132 apareceu na 603 e na
703 da torre B ao mesmo tempo). E a coluna de à vista do Terraço Sky sai do print
com um defeito de formatação: "798.000.000" é R$ 798.000,00 — confirmado porque
o apto 604 não mudou de valor e o número de agosto é conhecido.

### Cor de célula em PDF do Excel (tabelas da Castelo)

Nas tabelas da Castelo a marcação de **unidade reservada é só a cor de fundo da
linha** — a extração de texto não vê. Para ler: no content stream, `r g b rg`
define a cor e `x y w h re` + **`f*`** pinta (é `f*`, não `f`: `f*` nunca
casa, porque não há fronteira de palavra depois do asterisco). O `re` seguido de
`W* n` é recorte, não fundo. Retângulo de altura < 3pt é borda. Depois é cruzar o
Y do retângulo com o Y da linha de texto. No Gard de set/2026 o verde `#92c09e` é
o retângulo do rótulo "Unidade Reservada" da legenda, e só a linha da 1502 está
verde. No Kaisergarten e no EB não há cor por unidade: todas as linhas têm o mesmo
fundo e o mesmo preto no texto, então ali a situação continua vindo do mês anterior.

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
| `t` | prefixo do código: AP=Apartamento, CA=Casa, CO=Cobertura, TE=Terreno, SA=Sala comercial, PR=Prédio, GA=Galpão, CH=Chácara, SI=Sítio, LO=Loja, PT=Ponto comercial. **Prefixo novo aparece de vez em quando** (o GA estreou em 01/09, o CH em 08/09, o SI em 15/09, o LO em 22/09, o PT em 29/09 — lido como ponto comercial, falta o Felipe confirmar): confira o trecho do meio do `local`, que costuma nomear o tipo |
| `cap` | coluna Captador |
| `w` | data da semana, `DD/MM/AAAA` |
| `a`, `k` | Anunciado, Consenso |
| `g` | Gap em pontos percentuais (`-19.8`) |
| `n` | Nota |
| `f` | Leitura: `Revisar` / `Leve ajuste` / `Alinhado` — **copie da tabela do relatório**, não recalcule: o gap de exatamente −5,0% conta como Leve ajuste (AP8475 em 27/10), mas −4,97%, que também aparece como "−5,0%", é Alinhado (AP8340 em 15/09). As bandas do KPI saem da mesma leitura |
| `e`, `cm`, `b` | `DETALHES[cod].local` partido por ` · `: primeiro trecho, miolo, último |
| `d`, `v`, `s` | dorms, vagas, suítes — **omita** o campo quando o imóvel não tem |
| `m` + `ml` | `areaUtil`→`m² úteis`, `areaConstr`→`m² constr.`, `areaTotal`→`m² total` |
| `mt` | `areaTerreno`; quando não há esse campo mas há `areaTotal` que não foi para o `m²` (chácara com `areaConstr` + `areaTotal`), o `areaTotal` é o terreno |
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
