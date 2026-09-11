# Hub de Ferramentas — ZELT Imóveis

Portal interno da equipe de corretores (Blumenau/SC), publicado em
https://febottega.github.io/zelt-hub/ (repo `febottega/zelt-hub`, Pages no root de `main`).

## REGRA PRINCIPAL: nunca leia nem edite o index.html

`index.html` (11 MB) é **gerado**. Contém as 18 ferramentas em base64 — ilegível
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
   ├─ order.txt        os 18 nomes, um por linha, NA ORDEM de injeção
   ├─ assets/fonts/    8 fontes TTF em base64, COMPARTILHADAS — nunca ler
   ├─ vendor/          pdf-lib (512 KB) e html2canvas (193 KB) — nunca ler
   ├─ tools/           ferramentas (arquivo único OU pasta)
   └─ frozen/          12 relatórios históricos em base64 — nunca ler; editar só por script
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
| os 58 empreendimentos (preço, entrega…) | `tools/comparativo/data/empreendimentos.js` | 37 KB |
| histórico de preços | `tools/comparativo/data/price-history.js` | 76 KB |
| mudanças de preço | `tools/comparativo/data/price-changes.js` | 9 KB |
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
  código, endereço, corretor, bairro, quartos, suítes, tipo, semana, faixa de valor
  anunciado (mínimo/máximo) e situação do preço, que aceita mais de uma marcada.
  A ordenação é de um critério, pelo cabeçalho ou pelo select "Ordenar por" —
  que existe porque o `<thead>` desaparece abaixo de 820px.
- **avaliacao** + 12 arquivados — relatórios semanais paginados; os antigos em `frozen/`.
- **comparativo** — 58 empreendimentos. Abas: comparativo, mudanças, melhores preços,
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

Hash de referência (18 payloads, 11.742.938 bytes):

```
22BE4B43A3B5E94E0526E35733B9AAB737528F406331C8674DD4423EDA9A530B
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
(`?cb=2`) ou confira com `fetch(url, {cache:'no-store'})`.

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

**O `rpriv` não tem uma fórmula só.** Dos 58 cards, 48 usam `media/apriv` e **9
usam `media` dividida pela média da faixa de área** (`(apriv+atotal)/2`): Liv,
Residencial EB, Gardens, San Vito, Lago di Garda, Alphaville, Ed. Edimburgo,
Lisbon e os dois Tulum. O Central Park usa outra coisa ainda. Antes de recalcular
um R$/m², descubra qual divisor aquele card já usava — aplicar `media/apriv` num
dos nove infla o número em cerca de 10%.

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
| `t` | prefixo do código: AP=Apartamento, CA=Casa, CO=Cobertura, TE=Terreno, SA=Sala comercial, PR=Prédio, GA=Galpão, CH=Chácara. **Prefixo novo aparece de vez em quando** (o GA estreou em 01/09, o CH em 08/09): confira o trecho do meio do `local`, que costuma nomear o tipo |
| `cap` | coluna Captador |
| `w` | data da semana, `DD/MM/AAAA` |
| `a`, `k` | Anunciado, Consenso |
| `g` | Gap em pontos percentuais (`-19.8`) |
| `n` | Nota |
| `f` | Leitura: `Revisar` / `Leve ajuste` / `Alinhado` |
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
