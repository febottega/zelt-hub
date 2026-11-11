/* =====================================================================
   BUSCA RÁPIDA (assistente) — 11/11/2026, pedido do Felipe
   O corretor escreve o que o cliente procura ("apartamento 3 dormitórios na
   Velha ou Água Verde até 700 mil") e isto aqui:
     1. lê a frase sem IA nenhuma — regras e listas de palavras, tudo no
        navegador, sem chave, sem servidor;
     2. liga os filtros que existem na página (bairro, quartos, suítes, tipo,
        construtora, vagas, área, entregue);
     3. o que não tem filtro na página (preço por faixa de unidade, ano de
        entrega, padrão, lazer, empreendimento pelo nome, "na planta") vira
        filtro do assistente, com chip próprio na barra de filtros ativos
        (agenteFiltra / agenteChips / agenteRemove / agenteLimpa, chamados
        pelo app.js);
     4. responde no balão com o que entendeu, o que não entendeu e as opções.
   Preço: "até 700 mil" pega o card que tem ALGUMA unidade até 700 mil
   (vmin <= 700 mil), não o preço médio do campo da página — é o que o
   corretor quer saber. Lazer: vem do PADRAO_LAZER (data/padrao.js); card sem
   lista de lazer não entra quando a busca pede um item de lazer.
   Fica num arquivo próprio, colado depois do app.js no mesmo <script>, então
   enxerga DATA, state, OPTS, render etc. Estado em `var`, não `let`: o app.js
   chama agenteFiltra() no primeiro render(), antes desta parte rodar.
   ===================================================================== */
var AG = { extras: [], ultima: "" };

function agenteFiltra(d){ return !AG || AG.extras.every(x => x.pred(d)); }
function agenteChips(){ return (AG ? AG.extras : []).map((x, i) => ({ kind: "agente", v: i, cat: "Busca rápida", text: x.label })); }
function agenteRemove(i){ AG.extras.splice(i, 1); }
function agenteLimpa(){ AG.extras = []; }

var AG_NORM = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/²/g, "2");
var AG_NUMW = { um: 1, uma: 1, dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5 };
var AG_N1 = "(?:[1-5]|um|uma|dois|duas|tres|quatro|cinco)";
var agNum1 = s => AG_NUMW[s] || +s;
var agEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var agTitle = s => String(s).replace(/(^|\s)(\S)/g, (m, a, c) => a + c.toUpperCase()).replace(/ (D[aeo]s?) /g, (m, p) => " " + p.toLowerCase() + " ");
var agBrlCurto = v => v >= 1e6 ? "R$ " + (v / 1e6).toLocaleString("pt-BR", { maximumFractionDigits: 2 }) + " mi" : "R$ " + Math.round(v / 1000).toLocaleString("pt-BR") + " mil";
var agBase = d => d.empreendimento.replace(/ - .*/, "");
var agLazer = d => { const p = PADRAO_LAZER[agBase(d)]; return p ? p.lazer : null; };

/* itens de lazer: a ordem importa (o mais específico primeiro) */
var AG_LAZER = [
  ["piscina_aquecida", /\bpiscinas? (?:aquecidas?|climatizadas?|termicas?)\b|\baquecimento da piscina\b/],
  ["piscina", /\bpiscinas?\b/],
  ["academia", /\bacademias?\b|\bfitness\b|\bginasio\b|\bmusculacao\b/],
  ["salao_festas", /\bsal(?:ao|oes) de festas?\b|\bsal(?:ao|oes)\b/],
  ["espaco_gourmet", /\bespacos? gourmet\b|\bgourmet\b|\bchurrasqueiras?\b|\bchurrasco\b/],
  ["playground", /\bplaygrounds?\b|\bparquinhos?\b|\bbrinquedotecas?\b|\barea kids\b|\bespaco kids\b/],
  ["quadra", /\bquadras?(?: esportivas?| poliesportivas?| de esportes?)?\b|\bbeach tennis\b/],
  ["sauna_spa", /\bsaunas?\b|\bspa\b/],
  ["coworking", /\bco-?working\b/],
  ["cinema_jogos", /\bcinemas?\b|\bsalao de jogos\b|\bsalas? de jogos\b|\bjogos\b/],
  ["pet_place", /\bpet ?place\b|\bespaco pet\b|\bpet\b|\bcachorros?\b/],
  ["rooftop", /\brooftop\b|\bsky ?lounge\b/],
  ["bicicletario", /\bbicicletarios?\b|\bbicicletas?\b|\bbikes?\b/],
  ["lavanderia", /\blavanderias?\b/],
  ["mercado_autonomo", /\b(?:mini ?)?mercados?(?: autonomos?)?\b|\bmarket\b/],
  ["portaria_24h", /\bportaria(?: 24 ?h(?:oras)?)?\b/]
];
var AG_LAZER_NOME = Object.assign({ portaria_24h: "Portaria 24h" }, CB_LAZER_NOME);

var AG_STOP = new Set(("de da do das dos no na nos nas em com e ou para pra por o a os as ao aos um uma uns umas que se " +
  "ate entre mais menos acima abaixo valor valores preco precos regiao regioes bairro bairros zona quero queria procuro " +
  "busco buscando procurando preciso cliente clientes imovel imoveis unidade unidades opcao opcoes empreendimento empreendimentos " +
  "construtora construtoras mostrar mostre me tem ter tenha algum alguma alguns algumas quais qual reais r$ mil sem perto proximo " +
  "proxima lazer area areas condominio tipo padrao maximo minimo encaixa encaixam faixa orcamento budget ate pelo partir " +
  "custando custa custe valendo vale no maximo minimo quartos que tenham tenha disponivel disponiveis venda comprar compra " +
  "investir investimento morar familia casal sozinho ja the of qualquer todos todas tudo so somente apenas lista listar ver " +
  "dentro fora algo alguem coisa metro metros quadrados m2 entrega obra dormitorios").split(" "));

/* ---------------------------------------------------------------- leitura */
function agenteLe(frase){
  let t = " " + AG_NORM(frase).replace(/[!?;:()"]/g, " ").replace(/\s+/g, " ") + " ";
  const C = [];            /* critérios: {label, pred, aplica?} */
  const avisos = [];
  const usa = re => { let achou = []; t = t.replace(re, (...m) => { achou.push(m); return " "; }); return achou; };
  let sort = null;

  /* 1. empreendimento pelo nome (antes de tudo: "Vista 43", "N Studios", "Scire Fortaleza") */
  const nomes = [...new Set(DATA.map(agBase))].sort((a, b) => b.length - a.length);
  const emps = [];
  for(const n of nomes){
    const alvo = AG_NORM(n).replace(/^ed\. /, "");
    const re = new RegExp("(?:^|[^a-z0-9])(?:ed\\.? )?" + agEsc(alvo) + "(?![a-z0-9])", "g");
    if(usa(re).length) emps.push(n);
  }
  if(emps.length) C.push({ label: emps.join(" ou "), pred: d => emps.includes(agBase(d)) });

  /* 2. área: números com m², metros */
  const UN_A = "(?:m2|m\\b|metros?(?: quadrados)?)";
  const NUMA = "(\\d+(?:[.,]\\d+)?)";
  let aMin = null, aMax = null;
  usa(new RegExp("\\b(?:entre|de) " + NUMA + " (?:e|a) " + NUMA + " ?" + UN_A, "g")).forEach(m => { aMin = +m[1].replace(",", "."); aMax = +m[2].replace(",", "."); });
  usa(new RegExp("\\b(?:ate|menos de|abaixo de|no maximo|maximo de|menor que) " + NUMA + " ?" + UN_A, "g")).forEach(m => { aMax = +m[1].replace(",", "."); });
  usa(new RegExp("(?:\\b(?:acima de|mais de|a partir de|partir de|pelo menos|no minimo|minimo de|maior que|com)\\s)?" + NUMA + " ?" + UN_A, "g")).forEach(m => { aMin = +m[1].replace(",", "."); });

  /* 3. quartos, suítes e vagas */
  const lista = (s, kind) => {
    const nums = (s.match(new RegExp(AG_N1, "g")) || []).map(agNum1);
    if(/\b(?:a|-)\b/.test(s) && nums.length === 2 && !/\bou\b|,|\be\b/.test(s)){ const r = []; for(let i = nums[0]; i <= nums[1]; i++) r.push(i); return r; }
    return nums;
  };
  const conta = {};
  const PAL = { quartos: "(?:quartos?|dormitorios?|dorms?|qtos?)", suites: "(?:suites?)", vagas: "(?:vagas?(?: de garagem)?|garagens?)" };
  for(const [k, pal] of Object.entries(PAL)){
    const LST = AG_N1 + "(?:\\s*(?:,|ou|e|a|-|/)\\s*" + AG_N1 + ")*";
    usa(new RegExp("\\b(mais de|pelo menos|no minimo|minimo de|acima de|a partir de|ate|no maximo)?\\s*(" + LST + ")\\s*(ou mais|\\+)?\\s*" + pal + "\\b", "g")).forEach(m => {
      let v = lista(m[2], k);
      const q = m[1] || "", mais = !!m[3];
      if(/mais de|acima de/.test(q)) v = [5, 4, 3, 2, 1].filter(x => x > Math.max(...v));
      else if(/pelo menos|minimo|a partir/.test(q) || mais) v = [1, 2, 3, 4, 5].filter(x => x >= Math.min(...v));
      else if(/ate|no maximo/.test(q)) v = [1, 2, 3, 4, 5].filter(x => x <= Math.max(...v));
      conta[k] = [...new Set((conta[k] || []).concat(v))].sort();
    });
  }
  if(usa(/\bcom suites?\b|\bsuite master\b/g).length && !conta.suites) conta.suites = [1, 2, 3, 4, 5];
  if(usa(/\b(?:studios?|estudios?|kitnets?|quitinetes?)\b/g).length && !conta.quartos) conta.quartos = [1];

  /* 4. ano de entrega */
  let ano = null;
  usa(/\b(?:com )?(?:entrega|entregue|pronto|previsao|fica pronto)?\s*(ate|antes de|em|para|no maximo em|a partir de|depois de|apos)?\s*(20[2-4]\d)\b/g).forEach(m => {
    const y = +m[2], q = m[1] || "";
    if(/ate|maximo/.test(q)) ano = { label: "Entrega até " + y + " (ou pronto)", pred: d => d.pronto || (d.entregaAno != null && d.entregaAno <= y) };
    else if(/antes/.test(q)) ano = { label: "Entrega antes de " + y + " (ou pronto)", pred: d => d.pronto || (d.entregaAno != null && d.entregaAno < y) };
    else if(/partir|depois|apos/.test(q)) ano = { label: "Entrega a partir de " + y, pred: d => !d.pronto && d.entregaAno != null && d.entregaAno >= y };
    else ano = { label: "Entrega em " + y, pred: d => d.entregaAno === y };
  });
  if(ano) C.push(ano);

  /* 5. preço */
  const NUMP = "(\\d{1,3}(?:[.\\s]\\d{3})+(?:,\\d+)?|\\d+(?:[.,]\\d+)?)";
  const UNP = "\\s*(mil|k|mi|milhao|milhoes|m|reais)?\\b";
  const valor = (n, u, temQual) => {
    let v = /\d[.\s]\d{3}/.test(n) ? +n.replace(/[.\s]/g, "").replace(",", ".") : +n.replace(",", ".");
    if(u === "mil" || u === "k") v *= 1e3;
    else if(u && /^mi|^m$/.test(u)) v *= 1e6;
    else if(!u || u === "reais"){ if(v < 100) v *= 1e6; else if(v < 10000) v *= 1e3; }
    return v;
  };
  let pMin = null, pMax = null;
  usa(new RegExp("(?:r\\$\\s*)?\\b(?:entre|de)\\s*(?:r\\$\\s*)?" + NUMP + UNP + "\\s*(?:e|a)\\s*(?:r\\$\\s*)?" + NUMP + UNP, "g")).forEach(m => {
    if(!m[2] && !m[4] && !/r\$/.test(m[0])) return;
    const u = m[4] || m[2]; pMin = valor(m[1], m[2] || u); pMax = valor(m[3], u);
  });
  usa(new RegExp("\\b(?:por |custando |valendo )?(?:ate|menos de|abaixo de|no maximo|maximo de|maximo|teto de|orcamento de|budget de|nao passe de|menor que)\\s*(?:r\\$\\s*)?" + NUMP + UNP, "g")).forEach(m => { pMax = valor(m[1], m[2], true); });
  usa(new RegExp("\\b(?:acima de|mais de|a partir de|partir de|minimo de|no minimo|maior que)\\s*(?:r\\$\\s*)?" + NUMP + UNP, "g")).forEach(m => { pMin = valor(m[1], m[2], true); });
  usa(new RegExp("(?:r\\$\\s*)" + NUMP + UNP + "|\\b" + NUMP.replace("(", "(?<n>") + "\\s*(?<u>mil|k|mi|milhao|milhoes|reais)\\b", "g")).forEach(m => {
    const g = m[m.length - 1];
    if(m[1]) pMax = valor(m[1], m[2]); else pMax = valor(g.n, g.u);
  });
  if(pMin != null && pMax != null && pMin > pMax){ const x = pMin; pMin = pMax; pMax = x; }
  if(pMin != null || pMax != null){
    const lo = pMin, hi = pMax;
    const lab = lo != null && hi != null ? "entre " + agBrlCurto(lo) + " e " + agBrlCurto(hi) : hi != null ? "até " + agBrlCurto(hi) : "a partir de " + agBrlCurto(lo);
    C.push({ label: "Preço " + lab + " (alguma unidade)", pred: d => {
      const a = d.vmin != null ? d.vmin : d.media, b = d.vmax != null ? d.vmax : d.media;
      if(a == null) return false;
      return (hi == null || a <= hi) && (lo == null || b >= lo);
    } });
  }

  /* 6. lazer */
  const laz = [];
  for(const [k, re] of AG_LAZER) if(usa(new RegExp(re.source, "g")).length && !laz.includes(k)) laz.push(k);
  laz.forEach(k => C.push({ label: AG_LAZER_NOME[k] || k, lazer: k, pred: d => { const l = agLazer(d); return Array.isArray(l) && l.includes(k); } }));

  /* 7. padrão */
  let pad = null;
  if(usa(/\b(?:altissimo(?: padrao)?|luxo|alto luxo)\b/g).length) pad = ["Altíssimo"];
  else if(usa(/\balto padrao\b|\bpadrao alto\b/g).length) pad = ["Alto", "Altíssimo"];
  else if(usa(/\bmedio padrao\b|\bpadrao medio\b/g).length) pad = ["Médio"];
  else if(usa(/\b(?:padrao )?economico\b|\bpopular\b|\bmcmv\b|\bminha casa minha vida\b/g).length) pad = ["Econômico"];
  if(pad) C.push({ label: "Padrão " + pad.join(" ou "), pred: d => pad.includes(padraoDe(d)) });

  /* 8. tipo */
  const tipos = [];
  if(usa(/\bcoberturas?\b|\bpenthouses?\b/g).length) tipos.push("Cobertura");
  if(usa(/\bterracos?\b|\bgarden\b/g).length) tipos.push("Terraço");
  if(usa(/\blofts?(?: duplex)?\b|\bduplex\b/g).length) tipos.push("Loft Duplex");
  if(usa(/\bterrenos?\b|\blotes?\b|\bloteamentos?\b/g).length) tipos.push("Terreno");
  if(usa(/\bapartamentos?\b|\baptos?\b|\baps?\b/g).length) tipos.push("Apartamento Tipo");
  if(usa(/\bcasas?\b|\bsobrados?\b/g).length) avisos.push("o comparativo só tem lançamentos de apartamentos e terrenos — casas não entram");

  /* 9. pronto / na planta */
  let pronto = false;
  if(usa(/\bprontos? (?:pra|para) morar\b|\bprontos?\b|\bentregues?\b|\bpronta entrega\b|\bimediato\b/g).length) pronto = true;
  if(usa(/\bna planta\b|\bem obras?\b|\bem construcao\b|\blancamentos?\b/g).length) C.push({ label: "Na planta / em obra", pred: d => !d.pronto && !d.terreno });

  /* 10. ordem */
  if(usa(/\b(?:[oa]s? )?mais car[oa]s?\b|\bmaior preco\b/g).length) sort = "price-desc";
  if(usa(/\b(?:[oa]s? )?mais barat[oa]s?\b|\bmenor preco\b/g).length) sort = "price-asc";
  if(usa(/\bmaior(?:es)? areas?\b|\bmaiores\b|\bmais espacosos?\b/g).length) sort = "area-desc";
  if(usa(/\bmenor (?:r\$ ?)?(?:\/ ?)?m2\b|\bmelhor (?:valor do )?m2\b/g).length) sort = "rpriv-asc";
  if(usa(/\bentrega mais proxima\b|\bmais rapido\b/g).length) sort = "deliv-asc";

  /* 11. construtora e bairro (nomes da própria base) */
  const constr = [];
  OPTS.construtora.slice().sort((a, b) => b.length - a.length).forEach(c => {
    if(usa(new RegExp("(?:^|[^a-z0-9])" + agEsc(AG_NORM(c)) + "(?![a-z0-9])", "g")).length) constr.push(c);
  });
  const bairros = [];
  OPTS.bairro.slice().sort((a, b) => b.length - a.length).forEach(b => {
    if(usa(new RegExp("(?:^|[^a-z0-9])" + agEsc(AG_NORM(b)) + "(?![a-z0-9])", "g")).length) bairros.push(b);
  });

  /* o que sobrou e não é palavra de ligação */
  const sobra = t.split(/\s+/).filter(w => w && w.length >= 3 && !AG_STOP.has(w) && !/^\d+$/.test(w) && !/^r\$/.test(w));

  return { emps, aMin, aMax, conta, C, tipos, pronto, sort, constr, bairros, sobra: [...new Set(sobra)], avisos };
}

/* ---------------------------------------------------------------- aplica */
function agenteBusca(frase){
  frase = String(frase || "").trim();
  if(!frase) return;
  const L = agenteLe(frase);

  /* busca nova = começa do zero */
  ["bairro", "quartos", "suites", "tipo", "construtora", "vagas", "ano"].forEach(k => state[k].clear());
  state.priceMin = state.priceMax = state.areaMin = state.areaMax = null; state.pronto = false; state.search = "";
  AG.extras = L.C.slice();
  L.bairros.forEach(b => state.bairro.add(b));
  L.tipos.forEach(x => state.tipo.add(x));
  L.constr.forEach(x => state.construtora.add(x));
  (L.conta.quartos || []).forEach(n => state.quartos.add(n));
  (L.conta.suites || []).forEach(n => state.suites.add(n));
  (L.conta.vagas || []).forEach(n => state.vagas.add(n));
  if(L.aMin != null) state.areaMin = L.aMin;
  if(L.aMax != null) state.areaMax = L.aMax;
  state.pronto = L.pronto;
  if(L.sort){ state.sort = L.sort; const s = document.getElementById("sort"); if(s) s.value = L.sort; }
  agenteSincroniza();
  render();

  /* critérios em forma de predicado, para contar o que cada um tira */
  const crit = [];
  const add = (label, pred) => crit.push({ label, pred });
  if(L.tipos.length) add("tipo " + L.tipos.map(x => x === "Apartamento Tipo" ? "apartamento" : x.toLowerCase()).join(" ou "), d => L.tipos.includes(d.tipo));
  if(L.conta.quartos) add(L.conta.quartos.join(", ") + " quarto" + (L.conta.quartos.length > 1 || L.conta.quartos[0] > 1 ? "s" : ""), d => L.conta.quartos.some(n => d.quartos.includes(n)));
  if(L.conta.suites) add(L.conta.suites.length === 5 ? "com suíte" : L.conta.suites.join(", ") + " suíte" + (L.conta.suites[0] > 1 || L.conta.suites.length > 1 ? "s" : ""), d => L.conta.suites.some(n => d.suites.includes(n)));
  if(L.conta.vagas) add(L.conta.vagas.join(", ") + " vaga" + (L.conta.vagas[0] > 1 || L.conta.vagas.length > 1 ? "s" : ""), d => L.conta.vagas.includes(d.vagasN));
  if(L.bairros.length) add(L.bairros.map(agTitle).join(" ou "), d => L.bairros.includes(d.bairro));
  if(L.constr.length) add("construtora " + L.constr.join(" ou "), d => L.constr.includes(d.construtora));
  if(L.aMin != null || L.aMax != null) add("área " + (L.aMin != null && L.aMax != null ? L.aMin + " a " + L.aMax + " m²" : L.aMin != null ? "a partir de " + L.aMin + " m²" : "até " + L.aMax + " m²"), d => {
    const lo = d.apriv, hi = (d.faixaArea && d.atotal != null) ? d.atotal : d.apriv;
    return (L.aMin == null || (hi != null && hi >= L.aMin)) && (L.aMax == null || (lo != null && lo <= L.aMax));
  });
  if(L.pronto) add("pronto para morar", d => d.pronto);
  L.C.forEach(c => crit.push({ label: c.label, pred: c.pred }));

  const vivos = DATA.filter(d => !isSold(d));
  const passa = (d, skip) => crit.every((c, i) => i === skip || c.pred(d));
  const achados = sortItems(DATA.filter(matches)).filter(d => !isSold(d));
  const esgot = DATA.filter(matches).filter(isSold).length;

  /* resposta */
  let h = `<div class="ag-q">${agHtml(frase)}</div><div class="ag-a">`;
  if(!crit.length){
    if(L.sobra.length) h += `<p class="ag-obs">Não reconheci: <i>${agHtml(L.sobra.join(", "))}</i>.</p>`;
    L.avisos.forEach(a => { h += `<p class="ag-obs">Obs.: ${agHtml(a)}.</p>`; });
    h += `<p>Não consegui tirar nenhum filtro dessa frase. Tente dizer o tipo, os quartos, o bairro, o preço ou um item de lazer — por exemplo: <i>apartamento 2 quartos no Centro até 600 mil com piscina</i>.</p>`;
  } else {
    h += `<p class="ag-ent"><b>Entendi:</b> ${crit.map(c => `<span class="ag-tag">${agHtml(c.label)}</span>`).join(" ")}</p>`;
    if(L.sobra.length) h += `<p class="ag-obs">Não usei: <i>${agHtml(L.sobra.join(", "))}</i>.</p>`;
    L.avisos.forEach(a => { h += `<p class="ag-obs">Obs.: ${agHtml(a)}.</p>`; });
    const semLista = L.C.some(c => c.lazer) ? vivos.filter(d => !d.terreno && !Array.isArray(agLazer(d))).map(agBase) : [];
    if(achados.length){
      h += `<p><b>${achados.length} ${achados.length === 1 ? "opção encontrada" : "opções encontradas"}</b>${esgot ? ` <span class="ag-obs">(mais ${esgot} esgotad${esgot > 1 ? "os" : "o"}, fora da lista)</span>` : ""}:</p><ol class="ag-list">`;
      achados.slice(0, 10).forEach(d => {
        const preco = d.vmin != null && d.vmax != null && d.vmin !== d.vmax ? `${BRL(d.vmin)} a ${BRL(d.vmax)}` : BRL(d.media);
        const ent = d.pronto ? "pronto" : (d.entrega ? "entrega " + (/^\d/.test(d.entrega) ? d.entrega : d.entrega.toLowerCase()) : "");
        h += `<li><button type="button" class="ag-item" data-id="${d.id}"><b>${agHtml(d.empreendimento)}${d.unidade ? " " + agHtml(d.unidade) : ""}</b> · ${agHtml(d.construtora)} · ${agHtml(agTitle(d.bairro))}<span>${agHtml(d.tipo === "Apartamento Tipo" || d.tipo === d.config ? d.config : d.tipo + " · " + d.config)} · ${preco}${ent ? " · " + agHtml(ent) : ""}</span></button></li>`;
      });
      h += `</ol>`;
      if(achados.length > 10) h += `<p class="ag-obs">E mais ${achados.length - 10} nos cartões abaixo.</p>`;
      else h += `<p class="ag-obs">Os cartões abaixo já estão filtrados. Clique numa opção para ir até ela.</p>`;
    } else {
      h += `<p><b>Nenhuma opção</b> com tudo isso junto.</p>`;
      const dicas = crit.map((c, i) => ({ c, n: vivos.filter(d => passa(d, i)).length })).filter(x => x.n > 0).sort((a, b) => a.n - b.n).slice(0, 3);
      if(dicas.length) h += `<p>Afrouxando um critério:</p><ul class="ag-dicas">${dicas.map(x => `<li>sem <b>${agHtml(x.c.label)}</b>: ${x.n} ${x.n === 1 ? "opção" : "opções"}</li>`).join("")}</ul>`;
    }
    if(semLista.length) h += `<p class="ag-obs">Sem lista de lazer cadastrada (ficam fora quando a busca pede lazer): ${agHtml([...new Set(semLista)].join(", "))}.</p>`;
  }
  h += `</div>`;
  const log = document.getElementById("ag-log");
  log.innerHTML = h;
  log.hidden = false;
  log.querySelectorAll(".ag-item").forEach(b => b.addEventListener("click", () => agenteVaiAte(+b.dataset.id)));
  AG.ultima = frase;
}

var agHtml = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* deixa os controles da página iguais ao state */
function agenteSincroniza(){
  ["bairro", "quartos", "suites", "tipo", "construtora", "vagas", "ano"].forEach(k => {
    document.querySelectorAll(`.dd[data-key="${k}"] .dd-panel input`).forEach(i => {
      const v = NUM_KEYS.includes(k) && !SPECIAL.has(i.value) ? Number(i.value) : i.value;
      i.checked = state[k].has(v);
    });
  });
  const val = (id, v) => { const el = document.getElementById(id); if(el) el.value = v == null ? "" : v; };
  val("price-min", state.priceMin); val("price-max", state.priceMax);
  val("area-min", state.areaMin); val("area-max", state.areaMax);
  val("search", state.search);
  document.getElementById("pronto-check").checked = state.pronto;
  document.getElementById("pronto-toggle").classList.toggle("on", state.pronto);
}

function agenteVaiAte(id){
  if(state.view !== "cards"){
    state.view = "cards";
    document.querySelectorAll("#view-seg button").forEach(x => x.classList.toggle("on", x.dataset.view === "cards"));
    render();
  }
  const el = document.querySelector(`#results .card[data-id="${id}"]`);
  if(!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.remove("ag-flash"); void el.offsetWidth; el.classList.add("ag-flash");
}

(function agenteInit(){
  const f = document.getElementById("ag-form");
  if(!f) return;
  const inp = document.getElementById("ag-input");
  f.addEventListener("submit", e => { e.preventDefault(); agenteBusca(inp.value); });
  document.querySelectorAll(".ag-ex").forEach(b => b.addEventListener("click", () => { inp.value = b.textContent; agenteBusca(b.textContent); }));
  document.getElementById("ag-limpa").addEventListener("click", () => {
    inp.value = ""; const log = document.getElementById("ag-log"); log.innerHTML = ""; log.hidden = true; clearAll();
  });
})();
