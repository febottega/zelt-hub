# Hub de Ferramentas — ZELT Imóveis

Portal interno da equipe de corretores (Blumenau/SC), publicado no GitHub Pages.

## REGRA PRINCIPAL: nunca leia nem edite o index.html

`index.html` (8,9 MB) é **gerado**. Ele contém as 13 ferramentas codificadas em
base64, o que o torna ilegível para busca e impossível de editar cirurgicamente.
Lê-lo custa cerca de **2,5 milhões de tokens** e não cabe em nenhuma janela de
contexto.

Para qualquer mudança: **edite o fonte em `src/` e rode o build.**

```bash
build.cmd
```

O `build.cmd` é um wrapper que chama o `build.ps1` com `-ExecutionPolicy Bypass`
(a política padrão do Windows bloqueia `.ps1`). Não use `powershell -File build.ps1`
direto — falha com erro de segurança.

Para gerar sem sobrescrever, e conferir:

```bash
build.cmd -OutFile C:\caminho\teste.html
```

## Estrutura

```
HUB/
├─ index.html          GERADO — não tocar
├─ build.ps1           monta o index.html a partir de src/ (opera em bytes)
├─ build.cmd           wrapper; é assim que se roda o build
└─ src/
   ├─ hub.html         shell do hub: hero, cards, CSS, overlay, JS (84 KB)
   │                   contém o marcador <!--@PAYLOADS@--> onde as ferramentas entram
   ├─ order.txt        os 13 nomes, um por linha, NA ORDEM de injeção
   ├─ tools/           ferramentas editáveis, HTML puro (o build codifica em base64)
   └─ frozen/          relatórios históricos já em base64 — nunca editar, nunca ler
```

## Tamanho dos fontes (leia só o que precisa)

| Fonte | Total | Código real | Observação |
|---|---|---|---|
| `src/hub.html` | 84 KB | ~35 KB | resto é logo/favicon em base64 |
| `src/tools/simulador.html` | 580 KB | **~33 KB** | 94% é imagem em `data:` URI |
| `src/tools/avaliacoes.html` | 97 KB | ~84 KB | painel com `DADOS` e `KPIS` inline |
| `src/tools/avaliacao.html` | 407 KB | ~167 KB | relatório da semana atual |
| `src/tools/comparativo.html` | 1189 KB | ~301 KB | 887 KB são imagens dentro do `<style>` |
| `src/tools/gerador.html` | 989 KB | ~216 KB | 705 KB são libs minificadas (linhas ~2120 e ~2142) |
| `src/frozen/*.b64` (8 arquivos) | 3,5 MB | — | congelados |

Nunca leia esses arquivos por inteiro. Use `Grep` para localizar e `Edit` com
`old_string` preciso. Onde precisar de contexto, `Read` com `offset`/`limit`.

## As ferramentas

Cinco cards no hub. Quatro são payloads embutidos; o **Painel de Pauta** é externo
(`uweradloff.github.io/painel-pauta-zelt/`).

- **avaliacoes** — painel de avaliações: array `DADOS` (imóveis) + `KPIS` (semanais).
  Filtros por código, endereço, corretor, bairro, quartos, suítes, tipo, semana, faixa.
- **avaliacao** + 8 arquivados — relatórios semanais paginados. Os arquivados estão em `frozen/`.
- **comparativo** — 57 empreendimentos (construtora, bairro, entrega). Abas: comparativo,
  mudanças, melhores preços, tabelas de vendas, investimentos.
- **gerador** — 5 documentos (proposta, autorização/captação, locação, entrega de chaves,
  checklist). Rascunhos em `localStorage` (`zelt_*_v1`); exporta via html2canvas + print.
- **simulador** — financiamento SAC: parcelas, amortização, saldo devedor.

Zero bibliotecas externas em runtime; só as fontes do Google. Gráficos são HTML/CSS/SVG
próprios.

## Como o hub carrega uma ferramenta

Cada payload é `<script type="text/plain" data-tool="NOME">BASE64</script>`. O hub
decodifica com `atob` + `TextDecoder('utf-8')` e injeta num `<iframe srcdoc>` dentro de um
overlay. Rotas por hash + `pushState`; `Esc` fecha.

Ferramentas conversam com o hub por `postMessage`: `'zelt-close-tool'`,
`{zelt:'get-tool'}` → `{zelt:'tool-html'}`, `{zelt:'open-tool', focus}`, `{zelt:'focus', code}`.

Atenção ao buscar um payload: o padrão `data-tool="simulador"` também casa com o card
no `hub.html`. Ancore no início da linha: `^<script type="text/plain" data-tool="X">`.

## Invariante do build

O build é determinístico e byte-exato. Se você não mudou nenhum fonte, rebuildar tem
que produzir um `index.html` com **SHA256 idêntico**. Divergência sem mudança de fonte =
bug no build.

Hash de referência do estado migrado (13 payloads, 8.893.043 bytes):

```
14A320BE283D87F4EDDF1DB59DA0CA667DDA8C3618F416EBFA7BD4E29B1BD2AD
```

## Publicação

`Downloads\HUB` não é repositório git — o `index.html` é enviado ao GitHub à mão.
Só o `index.html` precisa ir para o Pages; `src/` e os scripts de build não.
