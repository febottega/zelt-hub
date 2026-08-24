const BRL = v => v==null ? "—" : "R$ " + Math.round(v).toLocaleString("pt-BR");
const BRLk = v => v==null ? "—" : "R$ " + (v>=1e6 ? (v/1e6).toFixed(2).replace(".",",")+" mi" : Math.round(v/1000)+" mil");
const M2 = v => v==null ? "—" : v.toLocaleString("pt-BR",{maximumFractionDigits:2}) + " m²";

const state = {
  bairro:new Set(), quartos:new Set(), suites:new Set(), tipo:new Set(), construtora:new Set(), vagas:new Set(), ano:new Set(),
  priceMin:null, priceMax:null, areaMin:null, areaMax:null, pronto:false, search:"",
  view:"cards", sort:"price-asc"
};
const picked = new Set();
/* ano de entrega derivado (a partir de mm/aaaa); sem data => null */
DATA.forEach(d=>{ const m=(d.entrega||"").match(/\/(\d{4})/); d.entregaAno = m ? +m[1] : null; });

/* pastas do Google Drive com a tabela de preços por empreendimento (compartilhadas com o domínio ZELT) */
const DRIVE_LINKS = {
  "San Blas": "https://drive.google.com/drive/folders/1A6LaiIS1Esu5_szcNDY1xmBwN_jus82u",
  "Liv": "https://drive.google.com/drive/folders/1X4fsdJA_GFgGb_-2xcW6PhWB7r40BcVK",
  "N Studios": "https://drive.google.com/drive/folders/1hjuaDdLupfXwOHNexAUvI5eeumAYYxzs",
  "Residencial EB": "https://drive.google.com/drive/folders/1Ig1UoYH8Hk6mh2kRocGjoylX9e3L5Auq",
  "Carbono": "https://drive.google.com/drive/folders/1KIbI6g5eJ3jq_2Kk22BgNi400gqkorIj",
  "Central Park": "https://drive.google.com/drive/folders/1ocdQjOiH2eEiZaFZdBEShSt1GnbLnFJc",
  "Imperial Park": "https://drive.google.com/drive/folders/1-LRwkJkBx_HoeBMq93gjetb77mp1d1HS",
  "Maldivas": "https://drive.google.com/drive/folders/1kqMAJvQF6Eu-3hZ5ZBzewHNhxSZRnJs8",
  "Lago di Garda": "https://drive.google.com/drive/folders/1YvUNpX6g_SVKRfHjfPnEkKRf4NuYe8Q3",
  "Wissen": "https://drive.google.com/drive/folders/1TQxbJtsFgqECLvO2y0Pja2REXij3cGwm",
  "Balsini 195": "https://drive.google.com/drive/folders/1lc4I6Okb2hVvpt6og6nl1yOd7iC_yoBa",
  "Ed. Edimburgo": "https://drive.google.com/drive/folders/1ll9B4L6TwYt_wp5xkMYB0nSEqAbOOgHH",
  "Valverde": "https://drive.google.com/drive/folders/0B-BgRzC9en53T2FnNlZNZE5NSFU?resourcekey=0-1HlKu2VI0JM4abjgr0cO4w",
  "Malta": "https://drive.google.com/drive/folders/1ErfyF-eshDwhz04n-qrxwZ4tDuH60GHl",
  "San Vito": "https://drive.google.com/drive/folders/1dI6c3bo7nUM47TfvNrpfgzerssDc4CLp",
  "Ed. Toulouse": "https://drive.google.com/drive/folders/1ahwXMTVHxZ9yrWpu1bwGNvniHr33zc6I",
  "Terraço Sky": "https://drive.google.com/drive/folders/1Vt5PunscKc8s8e3NQZM2A-oxvnYJ1_ks",
  "Cipriani Tower": "https://drive.google.com/drive/folders/15Vy0NNYnRatgWewAmS5IE1TERxkejUr3",
  "Grand Park": "https://drive.google.com/drive/folders/12G5nNE9gPdZHDgH7R6KhgvfH7r8y5Hu-",
  "Villa Toscana": "https://drive.google.com/drive/folders/1NKnrsBWzRFPEgRictcOO3CNqMnS06b2v",
  "Princess Tower": "https://drive.google.com/drive/folders/1GCOItkxK0vCnbI1yKp_ACFwy7XekOJfk",
  "Sunset Boulevard": "https://drive.google.com/drive/folders/1d5VUoalANoJlegsMHvKhcIdP0IILacIP",
  "Gard": "https://drive.google.com/drive/folders/17wfnR_CwPxNQtz3mDU465kxUiU8Y-a8J",
  "Pablo Neruda": "https://drive.google.com/drive/folders/0B_t6m-K2VbHeX1k0Y2ZseEY1eVk?resourcekey=0-Wyp0r2dNKM003Fctd7tUDg",
  "Bothanic - torre A": "https://drive.google.com/drive/folders/1IG3ZM4gNMpMW1wkVMov0ruhiPok0mcF3",
  "Bothanic - torre B": "https://drive.google.com/drive/folders/1IG3ZM4gNMpMW1wkVMov0ruhiPok0mcF3",
  "Lisbon": "https://drive.google.com/drive/folders/1Nsg_-HBSbC3KQ0k-qdSWfSL2EbAx3iMz",
  "DUO - Torre 1": "https://drive.google.com/drive/folders/1P0v-dXRIuTq-nFrR8dFkNO-trR3POrmg",
  "DUO - Torre 2": "https://drive.google.com/drive/folders/1P0v-dXRIuTq-nFrR8dFkNO-trR3POrmg",
  "Kaisergarten": "https://drive.google.com/drive/folders/13doD3mCsHmjNpZPBnSmuTwj5mtuHQdnA",
  "Alameda Giardini": "https://drive.google.com/drive/folders/1GD2FmQknlfV18Zj7DE49TElJPdaxfpEw",
  "Alphaville": "https://drive.google.com/drive/folders/1gx3z66POBD-m6sJkYgfRjVJ22X6xCOVI",
  "Flow": "https://drive.google.com/drive/folders/17UH6mGufN3UX2YButpvYbDK108eBIU1Z",
  "Villaggio di Fiori": "https://drive.google.com/drive/folders/1qCUXgmpeqrn8INt6l6PxaHAdHroD_5tN",
  "Gardens": "https://drive.google.com/drive/folders/1wzX5JlLaVyoLZ-BF78KlzpnBanraSmFO"
};
const driveLinkFor = d => DRIVE_LINKS[d.empreendimento] || null;

/* logos das construtoras (Andraus/Castelo embutidas; demais via Drive com fallback) */
@@FILE:tools/comparativo/data/logos.js@@
function logoFallback(img){ if(img.dataset.alt && !img.dataset.tried){ img.dataset.tried='1'; img.src=img.dataset.alt; } else { img.style.display='none'; } }
function constLogo(d,cls){ const l=CONST_LOGOS[d.construtora]; if(!l) return ''; const sg=d.construtora.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-'); return `<img class="${cls} l-${sg}" src="${l.src}" ${l.alt?`data-alt="${l.alt}"`:''} alt="${d.construtora}" loading="lazy" onerror="logoFallback(this)">`; }

/* classe de cor por tipo (cada tipo com uma cor) */
const TIPO_SLUG = {"Apartamento Tipo":"t-apartamento","Terraço":"t-terraco","Loft Duplex":"t-loft","Cobertura":"t-cobertura","Terreno":"t-terreno"};
const tipoClass = t => TIPO_SLUG[t] || "";

/* empreendimentos sem unidades disponíveis (esgotados) — exibidos em cinza apagado */
const isSold = d => !!d.sold;

/* ---- opções dos dropdowns ---- */
const uniq = (arr) => [...new Set(arr)];
const NUM_KEYS = ["vagas","quartos","suites","ano"];
const SPECIAL = new Set(["terreno","adef"]);   /* valores não-numéricos em filtros numéricos */
const OPTS = {
  bairro: uniq(DATA.map(d=>d.bairro)).sort((a,b)=>a.localeCompare(b,"pt-BR")),
  tipo: ["Apartamento Tipo","Terraço","Loft Duplex","Cobertura","Terreno"].filter(t=>DATA.some(d=>d.tipo===t)),
  construtora: uniq(DATA.map(d=>d.construtora)).sort((a,b)=>a.localeCompare(b,"pt-BR")),
  vagas: uniq(DATA.map(d=>d.vagasN).filter(v=>v!=null)).sort((a,b)=>a-b).map(v=>({val:v,label:v+(v>1?" vagas":" vaga")})),
  quartos: [1,2,3,4,5].filter(n=>DATA.some(d=>d.quartos.includes(n)))
            .map(n=>({val:n,label:n+(n>1?" quartos":" quarto")})),
  suites: [1,2,3,4,5].filter(n=>DATA.some(d=>d.suites.includes(n)))
            .map(n=>({val:n,label:n+(n>1?" suítes":" suíte")})),
  ano: uniq(DATA.map(d=>d.entregaAno).filter(y=>y!=null)).sort((a,b)=>a-b).map(y=>({val:y,label:String(y)}))
            .concat(DATA.some(d=>d.entregaAno==null && !d.pronto)?[{val:"adef",label:"A definir"}]:[])
};

/* count how many items match a single candidate value for a given key (given current OTHER filters) */
function countFor(key,val){
  return DATA.filter(d=> matchExcept(d,key) && matchValue(d,key,val)).length;
}
function matchValue(d,key,val){
  if(key==="bairro") return d.bairro===val;
  if(key==="tipo") return d.tipo===val;
  if(key==="construtora") return d.construtora===val;
  if(key==="vagas") return d.vagasN===val;
  if(key==="quartos") return val==="terreno" ? d.terreno : d.quartos.includes(val);
  if(key==="suites") return d.suites.includes(val);
  if(key==="ano") return val==="adef" ? (d.entregaAno==null && !d.pronto) : d.entregaAno===val;
  return true;
}

function buildDropdowns(){
  document.querySelectorAll("#view-comparativo .dd").forEach(dd=>{
    const key=dd.dataset.key;
    const panel=dd.querySelector(".dd-panel");
    const opts=OPTS[key];
    panel.innerHTML="";
    opts.forEach(o=>{
      const val = typeof o==="object" ? o.val : o;
      const label = typeof o==="object" ? o.label : o;
      const row=document.createElement("label");
      row.className="opt";
      row.innerHTML=`<input type="checkbox" value="${val}"><span>${label}</span><span class="c" data-c></span>`;
      row.querySelector("input").addEventListener("change",e=>{
        const v = NUM_KEYS.includes(key) && !SPECIAL.has(val) ? Number(val) : val;
        if(e.target.checked) state[key].add(v); else state[key].delete(v);
        render();
      });
      panel.appendChild(row);
    });
    const clr=document.createElement("button");
    clr.className="dd-clear"; clr.textContent="Limpar";
    clr.addEventListener("click",()=>{ state[key].clear();
      panel.querySelectorAll("input").forEach(i=>i.checked=false); render(); });
    panel.appendChild(clr);
    dd.querySelector(".dd-btn").addEventListener("click",ev=>{
      ev.stopPropagation();
      const wasOpen=dd.classList.contains("open");
      document.querySelectorAll("#view-comparativo .dd").forEach(x=>x.classList.remove("open"));
      if(!wasOpen) dd.classList.add("open");
    });
  });
  document.addEventListener("click",()=>document.querySelectorAll(".dd").forEach(x=>x.classList.remove("open")));
  document.querySelectorAll("#view-comparativo .dd-panel").forEach(p=>p.addEventListener("click",e=>e.stopPropagation()));
}

function updateDropdownChrome(){
  document.querySelectorAll("#view-comparativo .dd").forEach(dd=>{
    const key=dd.dataset.key, sel=state[key];
    const btn=dd.querySelector(".dd-btn"), text=dd.querySelector(".dd-text");
    const defaults={bairro:"Todos",quartos:"Todos",suites:"Todas",tipo:"Todos",construtora:"Todas",vagas:"Todas",ano:"Ano de entrega"};
    btn.querySelector(".count")?.remove();
    if(sel.size===0){ dd.classList.remove("active"); text.textContent=defaults[key]; }
    else{
      dd.classList.add("active"); text.textContent="Selecionados";
      const b=document.createElement("span"); b.className="count"; b.textContent=sel.size;
      btn.insertBefore(b, btn.querySelector(".caret"));
    }
    dd.querySelectorAll(".dd-panel .c").forEach(c=>{
      const val=c.closest(".opt").querySelector("input").value;
      const v=NUM_KEYS.includes(key)&&!SPECIAL.has(val)?Number(val):val;
      c.textContent=countFor(key,v);
    });
  });
}

/* ---- matching ---- */
function matchExcept(d,skip){
  for(const key of ["bairro","tipo","construtora","vagas","quartos","suites","ano"]){
    if(key===skip) continue;
    const sel=state[key]; if(sel.size===0) continue;
    if(key==="bairro" && !sel.has(d.bairro)) return false;
    if(key==="tipo" && !sel.has(d.tipo)) return false;
    if(key==="construtora" && !sel.has(d.construtora)) return false;
    if(key==="vagas" && !sel.has(d.vagasN)) return false;
    if(key==="quartos"){
      const ok=[...sel].some(v=> v==="terreno" ? d.terreno : d.quartos.includes(v));
      if(!ok) return false;
    }
    if(key==="suites"){
      const ok=[...sel].some(v=> d.suites.includes(v));
      if(!ok) return false;
    }
    if(key==="ano"){
      const ok=[...sel].some(v=> v==="adef" ? (d.entregaAno==null && !d.pronto) : d.entregaAno===v);
      if(!ok) return false;
    }
  }
  return true;
}
function matches(d){
  if(!matchExcept(d,null)) return false;
  if(state.priceMin!=null && (d.media==null || d.media<state.priceMin)) return false;
  if(state.priceMax!=null && (d.media==null || d.media>state.priceMax)) return false;
  const aLo=d.apriv, aHi=(d.faixaArea && d.atotal!=null) ? d.atotal : d.apriv;
  if(state.areaMin!=null && (aHi==null || aHi<state.areaMin)) return false;
  if(state.areaMax!=null && (aLo==null || aLo>state.areaMax)) return false;
  if(state.pronto && !d.pronto) return false;
  if(state.search){
    const q=state.search.toLowerCase();
    if(!(d.empreendimento.toLowerCase().includes(q) || d.construtora.toLowerCase().includes(q))) return false;
  }
  return true;
}

function sortItems(items){
  const s=state.sort;
  const by=(f,dir=1)=> (a,b)=>{ const x=f(a),y=f(b);
    if(x==null) return 1; if(y==null) return -1; return (x<y?-1:x>y?1:0)*dir; };
  const map={
    "price-asc": by(d=>d.media,1), "price-desc": by(d=>d.media,-1),
    "rpriv-asc": by(d=>d.rpriv,1), "area-desc": by(d=>d.apriv,-1),
    "deliv-asc": by(d=>d.entregaKey,1),
    "const-asc": (a,b)=>a.construtora.localeCompare(b.construtora,"pt-BR")||a.empreendimento.localeCompare(b.empreendimento,"pt-BR"),
    "bairro-asc": (a,b)=>a.bairro.localeCompare(b.bairro,"pt-BR")||(a.media-b.media)
  };
  return [...items].sort(map[s]);
}

/* ---- render cards ---- */
function priceBlock(d){
  if(d.vmin!=null && d.vmax!=null && d.vmin!==d.vmax){
    return `<div class="price">${BRLk(d.media)}<span class="faixa">${BRL(d.vmin)} a ${BRL(d.vmax)} · média ${BRL(d.media)}</span></div>`;
  }
  return `<div class="price">${BRLk(d.media)}<span class="faixa">${BRL(d.media)}</span></div>`;
}
function cardHTML(d){
  const on=picked.has(d.id);
  const link=driveLinkFor(d);
  const sold=isSold(d);
  return `<div class="card ${on?'picked':''} ${sold?'sold':''}" data-id="${d.id}">
    <div class="chips">
      <span class="chip bairro">${d.bairro}</span>
      <span class="chip tipo ${tipoClass(d.tipo)}">${d.tipo}</span>
      ${sold?'<span class="chip esgotado">Esgotado</span>':(d.pronto?'<span class="chip pronto">Entregue</span>':'')}
    </div>
    <div class="head-row">
      <div class="head-name">
        <h3 class="title">${d.empreendimento}${d.unidade?`<span class="unit">${d.unidade}</span>`:''}</h3>
        <div class="const"><b>${d.construtora}</b></div>
      </div>
      ${constLogo(d,'const-logo')}
    </div>
    <div class="config">${d.config}${d.vagas&&d.vagas!=='-'?` <small>· ${d.vagas} ${(d.vagasN>1)?'vagas':'vaga'}</small>`:''}</div>
    ${priceBlock(d)}
    <div class="specs">
      ${d.faixaArea
        ? `<div class="spec"><span class="k">Área mín.</span><span class="v">${M2(d.apriv)}</span></div>
      <div class="spec"><span class="k">Área máx.</span><span class="v">${M2(d.atotal)}</span></div>
      <div class="spec"><span class="k">R$/m² médio</span><span class="v">${BRL(d.rpriv)}</span></div>
      <div class="spec"><span class="k">Condição</span><span class="v" style="font-size:13px">${d.condicao||'—'}</span></div>`
        : `<div class="spec"><span class="k">Área priv.</span><span class="v">${M2(d.apriv)}</span></div>
      <div class="spec"><span class="k">R$/m² médio</span><span class="v">${BRL(d.rpriv)}</span></div>
      <div class="spec"><span class="k">Condição</span><span class="v" style="font-size:13px">${d.condicao||'—'}</span></div>`}
    </div>
    <div class="deliv-line">Entrega: <b>${d.entrega||'—'}</b></div>
    <div class="actions">
      ${hasSalesTable(d.empreendimento)
        ? `<button class="btn-table btn-vertabela" data-sales="${d.empreendimento.replace(/"/g,'&quot;')}">Ver tabela</button>`
        : (link
          ? `<a class="btn-table" href="${link}" target="_blank" rel="noopener">Ir à tabela ↗</a>`
          : `<a class="btn-table disabled" title="Tabela ainda não cadastrada">Ir à tabela</a>`)}
      <button class="btn-compare ${on?'on':''}" data-id="${d.id}">${on?'✓ Comparando':'+ Comparar'}</button>
    </div>
  </div>`;
}

function tableHTML(items){
  const rows=items.map(d=>`<tr class="${isSold(d)?'sold':''}">
    <td class="tcheck"><input type="checkbox" data-id="${d.id}" ${picked.has(d.id)?'checked':''}></td>
    <td><span class="emp">${d.empreendimento}</span>${d.unidade?` <small style="color:var(--gray-500)">un.${d.unidade}</small>`:''}${isSold(d)?' <span class="tesg">Esgotado</span>':''}</td>
    <td><span class="const-cell">${constLogo(d,'tlogo')}${d.construtora}</span></td>
    <td>${d.bairro}</td>
    <td><span class="tchip ${tipoClass(d.tipo)}">${d.tipo}</span></td>
    <td>${d.config}</td>
    <td class="num">${d.vagas||'—'}</td>
    <td class="num">${d.faixaArea ? (d.apriv!=null&&d.atotal!=null&&d.apriv!==d.atotal ? `${M2(d.apriv).replace(' m²','')} – ${M2(d.atotal)}` : M2(d.apriv)) : M2(d.apriv)}</td>
    <td class="num price">${BRL(d.media)}</td>
    <td class="num">${BRL(d.rpriv)}</td>
    <td>${d.entrega||'—'}</td>
    <td>${d.condicao||'—'}</td>
  </tr>`).join("");
  return `<div class="tbl-wrap"><table class="data">
    <thead><tr>
      <th class="tcheck"></th><th>Empreendimento</th><th>Construtora</th><th>Bairro</th>
      <th>Tipo</th><th>Configuração</th><th class="num">Vagas</th>
      <th class="num">Área (m²)</th><th class="num">Preço médio</th>
      <th class="num">R$/m² médio</th><th>Entrega</th><th>Condição</th>
    </tr></thead><tbody>${rows}</tbody></table></div>`;
}

function render(){
  let items=DATA.filter(matches);
  items=sortItems(items);
  document.getElementById("result-count").textContent=items.length;
  const box=document.getElementById("results");
  if(items.length===0){
    box.innerHTML=`<div class="empty"><h3>Nada encontrado</h3>
      <p>Nenhum empreendimento bate com esses filtros. Tente afrouxar uma das condições ou limpar tudo.</p></div>`;
  } else if(state.view==="cards"){
    box.innerHTML=`<div class="grid">${items.map(cardHTML).join("")}</div>`;
    box.querySelectorAll(".card").forEach(card=>card.addEventListener("click",()=>toggle(+card.dataset.id)));
    box.querySelectorAll(".btn-compare").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation(); toggle(+b.dataset.id);}));
    box.querySelectorAll(".btn-table").forEach(a=>a.addEventListener("click",e=>{e.stopPropagation(); if(a.classList.contains("disabled")) e.preventDefault();}));
    box.querySelectorAll(".btn-vertabela").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation(); openSalesTable(b.dataset.sales);}));
  } else {
    box.innerHTML=tableHTML(items);
    box.querySelectorAll("input[type=checkbox]").forEach(c=>c.addEventListener("change",()=>toggle(+c.dataset.id)));
  }
  updateDropdownChrome();
  renderActiveChips();
  updateTray();
}

/* ---- barra de filtros ativos ---- */
const CAT_LABEL={bairro:"Bairro",quartos:"Quartos",suites:"Suítes",tipo:"Tipo",construtora:"Construtora",vagas:"Vagas",ano:"Entrega"};
function chipText(key,v){
  if(key==="quartos") return v==="terreno"?"Terreno":`${v} quarto${v>1?"s":""}`;
  if(key==="suites") return `${v} suíte${v>1?"s":""}`;
  if(key==="vagas") return `${v} vaga${v>1?"s":""}`;
  if(key==="ano") return v==="adef"?"A definir":String(v);
  return v;
}
function clearAll(){
  ["bairro","quartos","suites","tipo","construtora","vagas","ano"].forEach(k=>state[k].clear());
  state.priceMin=state.priceMax=state.areaMin=state.areaMax=null; state.pronto=false; state.search="";
  document.querySelectorAll(".dd-panel input").forEach(i=>i.checked=false);
  ["price-min","price-max","area-min","area-max","search"].forEach(id=>document.getElementById(id).value="");
  document.getElementById("pronto-check").checked=false;
  document.getElementById("pronto-toggle").classList.remove("on");
  render();
}
function removeFilter(kind,v){
  if(["bairro","quartos","suites","tipo","construtora","vagas","ano"].includes(kind)){
    state[kind].delete(v);
    const sv=String(v);
    document.querySelectorAll(`.dd[data-key="${kind}"] .dd-panel input`).forEach(i=>{ if(i.value===sv) i.checked=false; });
  } else if(kind==="priceMin"){ state.priceMin=null; document.getElementById("price-min").value=""; }
  else if(kind==="priceMax"){ state.priceMax=null; document.getElementById("price-max").value=""; }
  else if(kind==="areaMin"){ state.areaMin=null; document.getElementById("area-min").value=""; }
  else if(kind==="areaMax"){ state.areaMax=null; document.getElementById("area-max").value=""; }
  else if(kind==="pronto"){ state.pronto=false; document.getElementById("pronto-check").checked=false;
    document.getElementById("pronto-toggle").classList.remove("on"); }
  else if(kind==="search"){ state.search=""; document.getElementById("search").value=""; }
  render();
}
function renderActiveChips(){
  const box=document.getElementById("active-chips");
  const chips=[];
  for(const key of ["bairro","quartos","suites","tipo","construtora","vagas","ano"]){
    [...state[key]].forEach(v=>chips.push({kind:key,v,cat:CAT_LABEL[key],text:chipText(key,v)}));
  }
  if(state.priceMin!=null) chips.push({kind:"priceMin",cat:"Preço",text:"≥ "+BRL(state.priceMin)});
  if(state.priceMax!=null) chips.push({kind:"priceMax",cat:"Preço",text:"≤ "+BRL(state.priceMax)});
  if(state.areaMin!=null) chips.push({kind:"areaMin",cat:"Área",text:"≥ "+state.areaMin+" m²"});
  if(state.areaMax!=null) chips.push({kind:"areaMax",cat:"Área",text:"≤ "+state.areaMax+" m²"});
  if(state.pronto) chips.push({kind:"pronto",cat:"",text:"Entregue"});
  if(state.search) chips.push({kind:"search",cat:"Busca",text:`“${state.search}”`});
  if(chips.length===0){ box.innerHTML=""; return; }
  box.innerHTML = `<span class="lead">Filtros ativos</span>` + chips.map((c,i)=>
    `<span class="achip">${c.cat?`<span class="cat">${c.cat}:</span>`:""}${c.text}<button data-i="${i}" aria-label="Remover">×</button></span>`
  ).join("") + `<button class="achip-clear" id="achip-clear">Limpar tudo</button>`;
  box.querySelectorAll(".achip button").forEach(b=>b.addEventListener("click",()=>{
    const c=chips[+b.dataset.i]; removeFilter(c.kind,c.v);
  }));
  document.getElementById("achip-clear").addEventListener("click",clearAll);
}

/* ---- comparação ---- */
function toggle(id){
  if(picked.has(id)) picked.delete(id); else picked.add(id);
  render();
}
function updateTray(){
  const tray=document.getElementById("tray");
  const n=picked.size;
  document.getElementById("tray-count").textContent=n;
  document.getElementById("tray-lbl-txt").textContent = n===1 ? "selecionado" : "selecionados";
  const names=[...picked].map(id=>DATA.find(d=>d.id===id).empreendimento);
  document.getElementById("tray-names").textContent=names.join("  ·  ");
  const open=document.getElementById("tray-open");
  open.disabled = n<1;
  open.textContent = n>=2 ? "Comparar lado a lado" : "Ver detalhes";
  tray.classList.toggle("show", n>0);
}

let compareList=[];
function openCompareIds(ids){
  compareList=ids.map(id=>DATA.find(d=>d.id===id)).filter(Boolean);
  if(compareList.length===0){ closeCompare(); return; }
  renderCompare();
  document.getElementById("modal").classList.add("show");
  document.body.style.overflow="hidden";
}
function openCompare(){ openCompareIds([...picked]); }

function renderCompare(){
  const sel=compareList;
  const single=sel.length===1;
  document.getElementById("cmp-title").innerHTML = single ? 'Detalhes do <b>imóvel</b>' : 'Lado a <b>lado</b>';
  document.getElementById("cmp-note").style.display = single ? "none" : "";
  const min=(arr)=>{const v=arr.filter(x=>x!=null); return v.length?Math.min(...v):null;};
  const max=(arr)=>{const v=arr.filter(x=>x!=null); return v.length?Math.max(...v):null;};
  const best={
    media:min(sel.map(d=>d.media)), rpriv:min(sel.map(d=>d.rpriv)),
    apriv:max(sel.map(d=>d.apriv)), atotal:max(sel.map(d=>d.atotal)),
    vagasN:max(sel.map(d=>d.vagasN)), entregaKey:min(sel.map(d=>d.entregaKey))
  };
  const cell=(d,key,html)=>{
    const isBest=!single && d[key]!=null && d[key]===best[key] && sel.filter(x=>x[key]===best[key]).length<sel.length;
    return `<td class="${isBest?'best':''} ${isSold(d)?'sold':''}">${html}</td>`;
  };
  const rowChips=d=>`<span class="chip bairro">${d.bairro}</span> <span class="chip tipo ${tipoClass(d.tipo)}">${d.tipo}</span>${isSold(d)?' <span class="chip esgotado">Esgotado</span>':''}`;
  const head=`<thead><tr><th class="rowlabel"></th>${sel.map(d=>`<th class="emp-th ${isSold(d)?'sold':''}">
      <div class="name">${d.empreendimento}${d.unidade?`<span class="unit">${d.unidade}</span>`:''}</div>
      <div class="const">${constLogo(d,'cmp-logo-const')}${d.construtora}</div>
      <div class="chips">${rowChips(d)}</div>
      ${driveLinkFor(d)
        ? `<a class="btn-table-sm" href="${driveLinkFor(d)}" target="_blank" rel="noopener">Ir à tabela ↗</a>`
        : `<span class="btn-table-sm disabled">Tabela em breve</span>`}
      <button class="rm" data-id="${d.id}" title="Remover">×</button>
    </th>`).join("")}</tr></thead>`;
  const R=(label,fn,keyForBest)=>`<tr><td class="rowlabel">${label}</td>${sel.map(d=>{
      const html=`<div class="val ${label==='Preço médio'?'price':''}">${fn(d)}</div>`;
      return keyForBest?cell(d,keyForBest,html):`<td class="${isSold(d)?'sold':''}">${html}</td>`;
    }).join("")}</tr>`;
  const body=`<tbody>
    ${R("Configuração",d=>d.config)}
    ${R("Preço médio",d=>BRL(d.media),"media")}
    ${R("Faixa de preço",d=>(d.vmin!=null&&d.vmax!=null&&d.vmin!==d.vmax)?`${BRL(d.vmin)} – ${BRL(d.vmax)}`:BRL(d.media))}
    ${R("Área (m²)",d=>d.faixaArea ? (d.apriv!=null&&d.atotal!=null&&d.apriv!==d.atotal ? `${M2(d.apriv).replace(' m²','')} – ${M2(d.atotal)}` : M2(d.apriv)) : M2(d.apriv),sel.some(x=>x.faixaArea)?undefined:"apriv")}
    ${R("R$/m² médio",d=>BRL(d.rpriv),"rpriv")}
    ${R("Vagas",d=>d.vagas||"—","vagasN")}
    ${R("Entrega",d=>d.entrega||"—","entregaKey")}
    ${R("Condição de pagamento",d=>d.condicao||"—")}
    ${R("Correção",d=>d.correcao||"—")}
  </tbody>`;
  document.getElementById("cmp-table").innerHTML=head+body;
  document.querySelectorAll("#cmp-table .rm").forEach(b=>b.addEventListener("click",()=>{
    const id=+b.dataset.id;
    compareList=compareList.filter(d=>d.id!==id);
    if(picked.has(id)){ picked.delete(id); render(); }
    if(compareList.length===0) closeCompare(); else renderCompare();
  }));
}
function closeCompare(){ document.getElementById("modal").classList.remove("show");
  document.body.style.overflow=""; }

/* ---- adicionar empreendimento: volta para a página de cards ---- */
function backToCards(){
  picked.clear();
  compareList.forEach(d=>picked.add(d.id));   /* leva a seleção atual para a bandeja */
  closeCompare();
  render();
  window.scrollTo({top:0, behavior:"smooth"});
}

/* ---- wiring ---- */
buildDropdowns();
document.getElementById("price-min").addEventListener("input",e=>{state.priceMin=e.target.value?+e.target.value:null;render();});
document.getElementById("price-max").addEventListener("input",e=>{state.priceMax=e.target.value?+e.target.value:null;render();});
document.getElementById("area-min").addEventListener("input",e=>{state.areaMin=e.target.value?+e.target.value:null;render();});
document.getElementById("area-max").addEventListener("input",e=>{state.areaMax=e.target.value?+e.target.value:null;render();});
document.getElementById("pronto-check").addEventListener("change",e=>{
  state.pronto=e.target.checked;
  document.getElementById("pronto-toggle").classList.toggle("on",e.target.checked); render();});
document.getElementById("search").addEventListener("input",e=>{state.search=e.target.value.trim();render();});
document.getElementById("sort").addEventListener("change",e=>{state.sort=e.target.value;render();});
document.getElementById("view-seg").addEventListener("click",e=>{
  const b=e.target.closest("button"); if(!b)return;
  state.view=b.dataset.view;
  document.querySelectorAll("#view-seg button").forEach(x=>x.classList.toggle("on",x===b));
  render();});
document.getElementById("tray-open").addEventListener("click",openCompare);
document.getElementById("tray-clear").addEventListener("click",()=>{picked.clear();render();});
document.getElementById("btn-close").addEventListener("click",closeCompare);
document.getElementById("btn-add-emp").addEventListener("click",backToCards);
/* logo do cabeçalho do comparativo (reaproveita a do topo) + data de geração */
document.querySelector(".cmp-logo").src = document.querySelector(".zelt-logo").src;
document.getElementById("cmp-gen-date").textContent = new Date().toLocaleDateString("pt-BR");
document.getElementById("btn-print").addEventListener("click",()=>window.print());
document.getElementById("modal").addEventListener("click",e=>{if(e.target.id==="modal")closeCompare();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCompare();closeCardPopup();}});

/* ===================== MELHORES PREÇOS ===================== */
const pstate = { bairro:new Set(), quartos:new Set(), suites:new Set(), tipo:new Set(), vagas:new Set(), areaMin:null, areaMax:null, metric:"media" };
const PKEYS = ["bairro","quartos","suites","tipo","vagas"];

function pMatchExcept(d,skip){
  for(const key of PKEYS){
    if(key===skip) continue;
    const sel=pstate[key]; if(sel.size===0) continue;
    if(key==="bairro" && !sel.has(d.bairro)) return false;
    if(key==="tipo" && !sel.has(d.tipo)) return false;
    if(key==="vagas" && !sel.has(d.vagasN)) return false;
    if(key==="quartos"){ if(![...sel].some(v=> v==="terreno"?d.terreno:d.quartos.includes(v))) return false; }
    if(key==="suites"){ if(![...sel].some(v=> d.suites.includes(v))) return false; }
  }
  return true;
}
function pMatches(d){
  if(!pMatchExcept(d,null)) return false;
  const aLo=d.apriv, aHi=(d.faixaArea && d.atotal!=null) ? d.atotal : d.apriv;
  if(pstate.areaMin!=null && (aHi==null || aHi<pstate.areaMin)) return false;
  if(pstate.areaMax!=null && (aLo==null || aLo>pstate.areaMax)) return false;
  return true;
}
function pCountFor(key,val){ return DATA.filter(d=> pMatchExcept(d,key) && matchValue(d,key,val)).length; }

function buildPriceDropdowns(){
  document.querySelectorAll("#view-precos .dd").forEach(dd=>{
    const key=dd.dataset.key;
    const panel=dd.querySelector(".dd-panel");
    const opts=OPTS[key];
    panel.innerHTML="";
    opts.forEach(o=>{
      const val = typeof o==="object" ? o.val : o;
      const label = typeof o==="object" ? o.label : o;
      const row=document.createElement("label");
      row.className="opt";
      row.innerHTML=`<input type="checkbox" value="${val}"><span>${label}</span><span class="c" data-c></span>`;
      row.querySelector("input").addEventListener("change",e=>{
        const v = NUM_KEYS.includes(key) && !SPECIAL.has(val) ? Number(val) : val;
        if(e.target.checked) pstate[key].add(v); else pstate[key].delete(v);
        renderPrices();
      });
      panel.appendChild(row);
    });
    const clr=document.createElement("button");
    clr.className="dd-clear"; clr.textContent="Limpar";
    clr.addEventListener("click",()=>{ pstate[key].clear();
      panel.querySelectorAll("input").forEach(i=>i.checked=false); renderPrices(); });
    panel.appendChild(clr);
    dd.querySelector(".dd-btn").addEventListener("click",ev=>{
      ev.stopPropagation();
      const wasOpen=dd.classList.contains("open");
      document.querySelectorAll("#view-precos .dd").forEach(x=>x.classList.remove("open"));
      if(!wasOpen) dd.classList.add("open");
    });
  });
  document.querySelectorAll("#view-precos .dd-panel").forEach(p=>p.addEventListener("click",e=>e.stopPropagation()));
}

function updatePriceChrome(){
  document.querySelectorAll("#view-precos .dd").forEach(dd=>{
    const key=dd.dataset.key, sel=pstate[key];
    const btn=dd.querySelector(".dd-btn"), text=dd.querySelector(".dd-text");
    const defaults={bairro:"Todos",quartos:"Todos",suites:"Todas",tipo:"Todos",vagas:"Todas"};
    btn.querySelector(".count")?.remove();
    if(sel.size===0){ dd.classList.remove("active"); text.textContent=defaults[key]; }
    else{
      dd.classList.add("active"); text.textContent="Selecionados";
      const b=document.createElement("span"); b.className="count"; b.textContent=sel.size;
      btn.insertBefore(b, btn.querySelector(".caret"));
    }
    dd.querySelectorAll(".dd-panel .c").forEach(c=>{
      const val=c.closest(".opt").querySelector("input").value;
      const v=NUM_KEYS.includes(key)&&!SPECIAL.has(val)?Number(val):val;
      c.textContent=pCountFor(key,v);
    });
  });
}

function pClearAll(){
  PKEYS.forEach(k=>pstate[k].clear());
  pstate.areaMin=pstate.areaMax=null;
  document.querySelectorAll("#view-precos .dd-panel input").forEach(i=>i.checked=false);
  ["p-area-min","p-area-max"].forEach(id=>{const el=document.getElementById(id); if(el) el.value="";});
  renderPrices();
}
function pRemoveFilter(kind,v){
  if(kind==="areaMin"){ pstate.areaMin=null; document.getElementById("p-area-min").value=""; }
  else if(kind==="areaMax"){ pstate.areaMax=null; document.getElementById("p-area-max").value=""; }
  else{
    pstate[kind].delete(v);
    const sv=String(v);
    document.querySelectorAll(`#view-precos .dd[data-key="${kind}"] .dd-panel input`).forEach(i=>{ if(i.value===sv) i.checked=false; });
  }
  renderPrices();
}
function renderPChips(){
  const box=document.getElementById("p-active-chips");
  const chips=[];
  for(const key of PKEYS){ [...pstate[key]].forEach(v=>chips.push({kind:key,v,cat:CAT_LABEL[key],text:chipText(key,v)})); }
  if(pstate.areaMin!=null) chips.push({kind:"areaMin",cat:"Área",text:"≥ "+pstate.areaMin+" m²"});
  if(pstate.areaMax!=null) chips.push({kind:"areaMax",cat:"Área",text:"≤ "+pstate.areaMax+" m²"});
  if(chips.length===0){ box.innerHTML=""; return; }
  box.innerHTML = `<span class="lead">Filtros ativos</span>` + chips.map((c,i)=>
    `<span class="achip">${c.cat?`<span class="cat">${c.cat}:</span>`:""}${c.text}<button data-i="${i}" aria-label="Remover">×</button></span>`
  ).join("") + `<button class="achip-clear" id="p-achip-clear">Limpar tudo</button>`;
  box.querySelectorAll(".achip button").forEach(b=>b.addEventListener("click",()=>{
    const c=chips[+b.dataset.i]; pRemoveFilter(c.kind,c.v);
  }));
  document.getElementById("p-achip-clear").addEventListener("click",pClearAll);
}

function lerpHex(a,b,t){
  const pa=[parseInt(a.slice(1,3),16),parseInt(a.slice(3,5),16),parseInt(a.slice(5,7),16)];
  const pb=[parseInt(b.slice(1,3),16),parseInt(b.slice(3,5),16),parseInt(b.slice(5,7),16)];
  const r=pa.map((v,i)=>Math.round(v+(pb[i]-v)*t));
  return `rgb(${r[0]},${r[1]},${r[2]})`;
}
function gradeColor(t){ return t<0.5 ? lerpHex("#1f9d63","#e2851f",t/0.5) : lerpHex("#e2851f","#dc3b33",(t-0.5)/0.5); }

function buildChart(list, valOf, metric){
  const box=document.getElementById("price-chart");
  if(!list.length){ box.innerHTML='<div class="empty">Nenhum empreendimento com os filtros atuais.<br>Tente afrouxar um pouco os filtros acima.</div>'; return; }
  const vals=list.map(valOf);
  const min=Math.min(...vals), max=Math.max(...vals);
  const fmt = metric==="rpriv" ? (v=>BRL(v)+"/m²") : (v=>BRLk(v));
  const rows=list.map(d=>{
    const v=valOf(d);
    const t = max>min ? (v-min)/(max-min) : 0;
    const pct = max>0 ? Math.max(8,(v/max)*100) : 8;
    return `<button class="pbar ${isSold(d)?'sold':''}" data-id="${d.id}" style="--pct:${pct}%;--c:${gradeColor(t)}">
      <span class="pbar-info">
        <span class="pbar-name"><span class="nm">${d.empreendimento}${d.unidade?` <span class="u">${d.unidade}</span>`:''}</span><span class="ptag ${tipoClass(d.tipo)}">${d.tipo}</span></span>
        <span class="pbar-sub">${d.construtora} · ${d.bairro} · ${d.config}</span>
      </span>
      <span class="pbar-track"><span class="pbar-fill"></span><span class="pbar-val">${fmt(v)}</span></span>
    </button>`;
  }).join("");
  box.innerHTML = `<div class="chart-legend"><span class="lg lg-low">● mais barato</span><span class="lg lg-high">mais caro ●</span></div><div class="pbars">${rows}</div>`;
  box.querySelectorAll(".pbar").forEach(b=>b.addEventListener("click",()=>showCardPopup(+b.dataset.id)));
}

function renderPrices(){
  const metric=pstate.metric;
  const valOf = d => metric==="rpriv" ? d.rpriv : d.media;
  const list = DATA.filter(pMatches).filter(d=>valOf(d)!=null).sort((a,b)=>valOf(a)-valOf(b));
  document.getElementById("p-result-count").textContent=list.length;
  buildChart(list, valOf, metric);
  renderPChips();
  updatePriceChrome();
}

function showCardPopup(id){
  const d=DATA.find(x=>x.id===id); if(!d) return;
  const wrap=document.getElementById("card-modal");
  const body=wrap.querySelector(".card-modal-body");
  body.innerHTML=cardHTML(d);
  body.querySelectorAll(".btn-compare").forEach(btn=>btn.addEventListener("click",e=>{
    e.stopPropagation(); toggle(+btn.dataset.id); closeCardPopup();
  }));
  body.querySelectorAll(".btn-table").forEach(a=>a.addEventListener("click",e=>{
    e.stopPropagation(); if(a.classList.contains("disabled")) e.preventDefault();
  }));
  body.querySelectorAll(".btn-vertabela").forEach(b=>b.addEventListener("click",e=>{
    e.stopPropagation(); openSalesTable(b.dataset.sales);
  }));
  wrap.classList.add("show");
}
function closeCardPopup(){ document.getElementById("card-modal").classList.remove("show"); }

/* ===================== MUDANÇAS DE PREÇOS ===================== */
/* Cada mudança: { emp, unidade?, de, para, data? } para preço,
   ou { emp, unidade?, tipoMudanca:"condicao"|"status", texto, data? } para outras mudanças. */
@@FILE:tools/comparativo/data/price-history.js@@

@@FILE:tools/comparativo/data/price-changes.js@@

function resolveChange(ch){
  let d = DATA.find(x=>x.empreendimento===ch.emp && ch.unidade!=null && String(x.unidade)===String(ch.unidade));
  if(!d) d = DATA.find(x=>x.empreendimento===ch.emp && x.unidade==null);
  if(!d) d = DATA.find(x=>x.empreendimento===ch.emp);
  return d || null;
}

const chState = { q:"", constr:"" };
function chConstrutora(ch){
  const d=resolveChange(ch);
  return (d && d.construtora) || constructoraOf(ch.emp) || "—";
}
function buildChConstrDropdown(){
  const sel=document.getElementById("ch-constr"); if(!sel) return;
  const cont={};
  PRICE_CHANGES.forEach(ch=>{ const c=chConstrutora(ch); cont[c]=(cont[c]||0)+1; });
  const nomes=Object.keys(cont).sort((a,b)=>a.localeCompare(b,'pt-BR'));
  sel.innerHTML = `<option value="">Todas as construtoras (${PRICE_CHANGES.length})</option>` +
    nomes.map(c=>`<option value="${c}">${c} (${cont[c]})</option>`).join("");
}
function renderChanges(filter, constr){
  if(filter!==undefined && filter!==null) chState.q=String(filter);
  if(constr!==undefined && constr!==null) chState.constr=String(constr);
  const box=document.getElementById("changes-list");
  const f=chState.q.trim().toLowerCase(), c=chState.constr;
  const lista=PRICE_CHANGES.filter(ch=>{
    if(c && chConstrutora(ch)!==c) return false;
    if(!f) return true;
    return ch.emp.toLowerCase().includes(f) || chConstrutora(ch).toLowerCase().includes(f);
  });
  document.getElementById("ch-count").textContent=lista.length;
  if(!lista.length){
    const msg = (f||c) ? 'Nenhuma mudança encontrada para esse filtro.' : 'Nenhuma mudança registrada ainda.';
    box.innerHTML=`<div class="empty">${msg}</div>`; return;
  }
  box.innerHTML = lista.map((ch,i)=>{
    const d=resolveChange(ch);
    const numeric = (ch.de!=null && ch.para!=null);
    const kind = numeric ? "preco" : (ch.tipoMudanca||"status");
    const logo = d ? constLogo(d,"ch-logo") : "";
    const tipo = d ? `<span class="ptag ${tipoClass(d.tipo)}">${d.tipo}</span>` : "";
    const sub = d ? `${d.construtora}${d.bairro?` · ${d.bairro}`:""}${d.config?` · ${d.config}`:""}` : ch.emp;
    const dataTxt = ch.data ? ` · ${ch.data}` : "";
    let body="", cls="";
    if(numeric){
      const up = ch.para>=ch.de;
      const diff=Math.abs(ch.para-ch.de);
      const pct = ch.de? (Math.abs(ch.para-ch.de)/ch.de*100) : 0;
      const pctTxt = pct.toLocaleString("pt-BR",{minimumFractionDigits:0,maximumFractionDigits:1});
      cls = up?'up':'down';
      body = `<span class="ch-prices">
          <span class="ch-from">${BRLk(ch.de)}</span>
          <span class="ch-arrow">→</span>
          <span class="ch-to">${BRLk(ch.para)}</span>
          <span class="ch-badge ${cls}">${up?'↑ Aumentou':'↓ Diminuiu'} ${BRLk(diff)} · ${up?'+':'−'}${pctTxt}%</span>
        </span>`;
    }else{
      const lbl = kind==="condicao" ? "Condições de pagamento" : kind==="preco" ? "Preços" : "Disponibilidade";
      cls = ch.dir==="down" ? "down" : ch.dir==="up" ? "up" : "info";
      const arrow = ch.dir==="down" ? "↓ " : ch.dir==="up" ? "↑ " : "";
      body = `<span class="ch-prices">
          <span class="ch-badge ${cls}">${arrow}${lbl}</span>
          <span class="ch-text">${ch.texto||""}</span>
        </span>`;
    }
    return `<button class="change-card ${cls}" data-idx="${i}"${d?` data-id="${d.id}"`:""}>
      <span class="ch-main">
        <span class="ch-title"><span class="ch-emp">${ch.emp}</span>${ch.unidade?`<span class="u">${ch.unidade}</span>`:""}${tipo}</span>
        ${body}
        <span class="ch-sub">${sub}${dataTxt}</span>
      </span>
      <span class="ch-logo-wrap">${logo}</span>
    </button>`;
  }).join("");
  box.querySelectorAll(".change-card").forEach(b=>b.addEventListener("click",()=>{
    if(b.dataset.id!=null) showCardPopup(+b.dataset.id);
  }));
}

/* ===================== TABELAS DE VENDAS ===================== */
/* Recriação das tabelas oficiais (só unidades disponíveis). Cada tabela segue o
   modelo da original: colunas próprias + notas. unitCol = índice da coluna da unidade. */
@@FILE:tools/comparativo/data/sales-tables.js@@

const SPECIAL_UNITS = (()=>{
  const m={};
  DATA.forEach(d=>{
    if(d.unidade && ["Terraço","Cobertura","Loft Duplex"].includes(d.tipo)){
      (m[d.empreendimento] = m[d.empreendimento] || {})[String(d.unidade)] = d.tipo;
    }
  });
  return m;
})();
const salesSlug = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
const constructoraOf = emp => (DATA.find(d=>d.empreendimento===emp)||{}).construtora || "";

function parseBRL(s){
  if(s==null) return null;
  const m = String(s).replace(/\s/g,"").match(/-?[\d.]+(?:,\d{2})?/);
  if(!m) return null;
  return parseFloat(m[0].replace(/\./g,"").replace(",","."));
}
function fmtBRL(n){
  return "R$ " + n.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});
}
/* "Unidade" nao serve para loteamento. A propria tabela ja declara o que cada
   linha e, no summary.tipoDefault ("Lote"), e o rotulo acompanha isso; um
   summary.rotuloUnidade explicito tem prioridade se um dia precisar de
   "Sala", "Casa" etc. */
function rotuloUnidade(t){
  const s = (t && t.summary) || {};
  return s.rotuloUnidade || (s.tipoDefault === "Lote" ? "Lote" : "Unidade");
}
function andarDeUnidade(u){
  const d = String(u).replace(/\D/g,"");
  if(d.length < 3) return null;
  const a = parseInt(d.slice(0,-2),10);
  return (a>0) ? a+"º andar" : null;
}
const MESES = ["","janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
function entregaTexto(e){
  if(!e) return null;
  if(/ENTREGUE/i.test(e)) return "pronto para morar";
  const m = String(e).match(/^(\d{1,2})\/(\d{4})$/);
  if(!m) return e;
  return `${MESES[parseInt(m[1],10)]}/${m[2]}`;
}
function buildResumo(emp, ri){
  const t = SALES_TABLES[emp]; if(!t || !t.summary) return "";
  const s = t.summary, r = t.rows[ri];
  const d0 = DATA.find(d=>d.empreendimento===emp) || {};
  const special = SPECIAL_UNITS[emp] || {};
  const un = r[t.unitCol];
  const vazio = v => (v==null || v==="" || v==="\u2014" || v==="-");
  const tipo = special[String(un)] || special[String(un).replace(/\D/g,"")] || s.tipoDefault || "Apartamento tipo";

  const b1 = [];
  b1.push(`*${emp.toUpperCase()}* \u2014*${tipo}*`);
  if(d0.construtora) b1.push(`*Construtora ${d0.construtora}*`);
  const andar = (s.andar===false) ? null : andarDeUnidade(un);
  b1.push(`*${rotuloUnidade(t)} ${un}*${andar?` \u00b7 ${andar}`:""}`);
  const bits = (s.bits||[]).map(b=>{
    const v = r[b.col];
    if(vazio(v)) return null;
    return `${b.pre||""}${v}${b.pos||""}`;
  }).filter(Boolean);
  if(bits.length) b1.push(bits.join(" \u00b7 "));
  const sit = (s.situacaoCol!=null && !vazio(r[s.situacaoCol])) ? r[s.situacaoCol] : (s.situacao || "Disponível");
  b1.push(`Situação: ${sit}`);

  const b2 = [];
  let principalVal = null;
  if(s.principal){
    principalVal = parseBRL(r[s.principal.col]);
    if(principalVal!=null) b2.push(`*${s.principal.label}* \u2014 ${fmtBRL(principalVal)}`);
  }
  (s.parcelas||[]).forEach(p=>{
    const v = parseBRL(r[p.col]);
    if(v!=null) b2.push(`* ${p.label}: ${fmtBRL(v)}`);
  });

  const b3 = [];
  (s.alternativas||[]).forEach(a=>{
    let v = null;
    if(a.col!=null) v = parseBRL(r[a.col]);
    else if(a.pct!=null && principalVal!=null) v = principalVal*(1-a.pct/100);
    if(v!=null) b3.push(`*${a.bold}*${a.nota?` ${a.nota}`:""}: ${fmtBRL(v)}`);
  });

  const b4 = [];
  const ent = entregaTexto(s.entrega || d0.entrega);
  if(ent) b4.push(`Entrega: ${ent}`);
  b4.push("ZELT Im\u00f3veis \u00b7 vendas@zelt.com.br");

  return [b1,b2,b3,b4].filter(b=>b.length).map(b=>b.join("\n")).join("\n\n");
}
function copiarResumo(btn){
  const emp = btn.getAttribute("data-emp"), ri = parseInt(btn.getAttribute("data-ri"),10);
  const txt = buildResumo(emp, ri);
  if(!txt) return;
  const done = ()=>{ const o=btn.textContent; btn.textContent="Copiado ✓"; btn.classList.add("ok");
    setTimeout(()=>{ btn.textContent=o; btn.classList.remove("ok"); },1800); };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(done).catch(()=>fallbackCopy(txt,done));
  } else fallbackCopy(txt,done);
}
function fallbackCopy(txt, done){
  const ta=document.createElement("textarea");
  ta.value=txt; ta.setAttribute("readonly",""); ta.style.position="fixed"; ta.style.top="-1000px";
  document.body.appendChild(ta); ta.select();
  try{ document.execCommand("copy"); done(); }catch(e){}
  document.body.removeChild(ta);
}

function salesTableHTML(emp, t){
  const special = SPECIAL_UNITS[emp] || {};
  const d0 = DATA.find(d=>d.empreendimento===emp) || {};
  const hasSum = !!t.summary;
  const head = `<tr>${t.columns.map(c=>`<th>${c}</th>`).join("")}${hasSum?`<th class="th-resumo">Resumo</th>`:""}</tr>`;
  const body = t.rows.map((r,ri)=>`<tr>${r.map((cell,ci)=>{
    let cls="", extra="";
    if(ci===t.unitCol){
      cls="unit-cell";
      const tp=special[String(cell)] || special[String(cell).replace(/\D/g,"")];
      if(tp) extra=`<span class="utag ${tipoClass(tp)}">${tp}</span>`;
      const isit=t.columns.findIndex(c=>c.toLowerCase()==="situação");
      if(isit>=0 && /revenda/i.test(String(r[isit]))) extra+=`<span class="utag utag-rev">Revenda</span>`;
    }
    if(/^R\$/.test(cell)) cls="price-cell";
    return `<td class="${cls}">${cell}${extra}</td>`;
  }).join("")}${hasSum?`<td class="td-resumo"><button type="button" class="btn-resumo" data-emp="${emp.replace(/"/g,'&quot;')}" data-ri="${ri}">Copiar Resumo</button></td>`:""}</tr>`).join("");
  /* O folderId da propria tabela e a fonte preferida. Quando ele falta -- e tres
     tabelas estavam sem: Carbono, Villa Toscana e Grand Park -- cai no
     DRIVE_LINKS, que e o mesmo mapa que os outros botoes "Ir a tabela" usam.
     Sem nenhum dos dois o botao nao vira link: interpolar um folderId ausente
     gerava .../folders/undefined, que o Google responde com 404. */
  const folderUrl = t.folderId
    ? `https://drive.google.com/drive/folders/${t.folderId}`
    : (DRIVE_LINKS[emp] || null);
  return `<section class="stable" id="tab-${salesSlug(emp)}">
    <div class="stable-head" role="button" tabindex="0">
      <div class="stable-tt">
        <div class="stable-name">${emp}</div>
        <div class="stable-sub"><b>${d0.construtora||""}</b>${d0.bairro?` · ${d0.bairro}`:""} · ${t.source} · ${t.ref}</div>
      </div>
      ${constLogo(d0,'stable-logo')}
      <span class="stable-count">${t.rows.length} ${rotuloUnidade(t).toLowerCase()}${t.rows.length===1?'':'s'}</span>
      <span class="stable-caret">▼</span>
    </div>
    <div class="stable-body">
      <div class="stable-actions">
        <span class="src">Recriada da tabela oficial — confira sempre a original antes de negociar.</span>
        ${folderUrl
          ? `<a class="btn-orig" href="${folderUrl}" target="_blank" rel="noopener">Ir à tabela original ↗</a>`
          : `<span class="btn-orig disabled" title="Pasta da tabela original ainda não cadastrada">Ir à tabela original</span>`}
      </div>
      <div class="stable-scroll"><table class="sales"><thead>${head}</thead><tbody>${body}</tbody></table></div>
      ${t.note?`<div class="stable-note">${t.note}</div>`:""}
    </div>
  </section>`;
}

const salesState = { q:"", constr:"" };
function buildSalesConstrDropdown(){
  const sel=document.getElementById("sales-constr"); if(!sel) return;
  const cont={};
  Object.keys(SALES_TABLES).forEach(emp=>{
    const c=constructoraOf(emp)||"—";
    cont[c]=(cont[c]||0)+1;
  });
  const nomes=Object.keys(cont).sort((a,b)=>a.localeCompare(b,'pt-BR'));
  const total=Object.keys(SALES_TABLES).length;
  sel.innerHTML = `<option value="">Todas as construtoras (${total})</option>` +
    nomes.map(c=>`<option value="${c}">${c} (${cont[c]})</option>`).join("");
}
function renderSalesTables(filter, constr){
  if(filter!==undefined && filter!==null) salesState.q = String(filter);
  if(constr!==undefined && constr!==null) salesState.constr = String(constr);
  const box=document.getElementById("sales-list");
  const f=salesState.q.trim().toLowerCase();
  const c=salesState.constr;
  const emps=Object.keys(SALES_TABLES)
    .filter(emp=>{
      if(c && (constructoraOf(emp)||"—")!==c) return false;
      if(!f) return true;
      return emp.toLowerCase().includes(f) || (constructoraOf(emp)||"").toLowerCase().includes(f);
    })
    .sort((a,b)=>a.localeCompare(b,'pt-BR'));
  if(!emps.length){
    const msg = (f||c) ? 'Nenhuma tabela encontrada para esse filtro.' : 'Nenhuma tabela recriada ainda.';
    box.innerHTML=`<div class="sales-empty">${msg}</div>`; return;
  }
  box.innerHTML = emps.map(emp=>salesTableHTML(emp, SALES_TABLES[emp])).join("");
  box.querySelectorAll(".btn-resumo").forEach(b=>{
    b.addEventListener("click", e=>{ e.stopPropagation(); copiarResumo(b); });
  });
  box.querySelectorAll(".stable-head").forEach(h=>{
    const toggle=()=>h.closest(".stable").classList.toggle("open");
    h.addEventListener("click",toggle);
    h.addEventListener("keydown",e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); toggle(); } });
  });
}

function hasSalesTable(emp){ return !!SALES_TABLES[emp]; }
function openSalesTable(emp){
  closeCardPopup();
  switchTab("tabelas");
  renderSalesTables("","");
  const search=document.getElementById("sales-search"); if(search) search.value="";
  const csel=document.getElementById("sales-constr"); if(csel) csel.value="";
  const sec=document.getElementById("tab-"+salesSlug(emp));
  if(sec){
    sec.classList.add("open");
    sec.scrollIntoView({behavior:"smooth", block:"start"});
    sec.classList.remove("flash"); void sec.offsetWidth; sec.classList.add("flash");
  }
}

function switchTab(tab){
  document.querySelectorAll("#tabs .tab").forEach(b=>b.classList.toggle("on",b.dataset.tab===tab));
  document.getElementById("view-comparativo").hidden = tab!=="comparativo";
  document.getElementById("view-precos").hidden = tab!=="precos";
  document.getElementById("view-mudancas").hidden = tab!=="mudancas";
  document.getElementById("view-tabelas").hidden = tab!=="tabelas";
  document.getElementById("view-investimentos").hidden = tab!=="investimentos";
  document.body.classList.toggle("on-precos", tab==="precos");
}

document.getElementById("tabs").addEventListener("click",e=>{
  const b=e.target.closest(".tab"); if(!b) return;
  switchTab(b.dataset.tab);
});
document.getElementById("metric-seg").addEventListener("click",e=>{
  const b=e.target.closest("button"); if(!b) return;
  pstate.metric=b.dataset.metric;
  document.querySelectorAll("#metric-seg button").forEach(x=>x.classList.toggle("on",x===b));
  renderPrices();
});
document.getElementById("card-modal-close").addEventListener("click",closeCardPopup);
document.getElementById("card-modal").addEventListener("click",e=>{if(e.target.id==="card-modal")closeCardPopup();});
document.getElementById("p-area-min").addEventListener("input",e=>{pstate.areaMin=e.target.value?+e.target.value:null;renderPrices();});
document.getElementById("p-area-max").addEventListener("input",e=>{pstate.areaMax=e.target.value?+e.target.value:null;renderPrices();});

buildPriceDropdowns();
renderPrices();
buildChConstrDropdown();
renderChanges();
document.getElementById("ch-search").addEventListener("input",e=>renderChanges(e.target.value,null));
document.getElementById("ch-constr").addEventListener("change",e=>renderChanges(null,e.target.value));
buildSalesConstrDropdown();
renderSalesTables("","");
document.getElementById("sales-search").addEventListener("input",e=>renderSalesTables(e.target.value,null));
document.getElementById("sales-constr").addEventListener("change",e=>renderSalesTables(null,e.target.value));

render();

/* ================= Investimentos ================= */
const invState = { q:"", constr:"", periodo:"all", ordem:"desc", emp:null, sel:[] };
const INV_CORES = ["#ff9e36","#1e1b35","#25a06b","#3a76c0","#e2851f","#e0463e","#8a6fd4"];
const INV_MES = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];

function invMesLabel(iso){
  const p=iso.split("-");
  if(p.length>=3) return `${p[2]}/${p[1]}`;
  return `${INV_MES[parseInt(p[1],10)-1]}/${p[0].slice(2)}`;
}
function invData(iso){
  const p=iso.split("-").map(Number);
  return new Date(p[0], p[1]-1, p[2]||1);
}
function invMesesEntre(a,b){
  return (invData(b)-invData(a))/(1000*60*60*24*30.4375);
}
function invPeriodoLabel(m){
  if(m>=2) return `${Math.round(m)} meses`;
  return `${Math.round(m*30.4375)} dias`;
}
function invConstrutora(emp){
  const d=DATA.find(x=>x.empreendimento===emp);
  return (d && d.construtora) || constructoraOf(emp) || "—";
}
/* unidades com historico QUE AINDA estao na tabela de vendas */
function invUnidades(emp){
  const H=PRICE_HISTORY[emp]; if(!H) return [];
  const t=SALES_TABLES[emp];
  const vivas = t ? t.rows.map(r=>String(r[t.unitCol])) : null;
  return Object.keys(H.unidades)
    .filter(u=>!vivas || vivas.includes(u))
    .filter(u=>invSerie(emp,u).vals.filter(v=>v!=null).length>=2)
    .sort((a,b)=>parseInt(a,10)-parseInt(b,10));
}
function invCorte(emp){
  const H=PRICE_HISTORY[emp], n=H.datas.length;
  if(invState.periodo==="all") return 0;
  const lim=parseInt(invState.periodo,10), fim=H.datas[n-1];
  for(let i=0;i<n;i++){ if(invMesesEntre(H.datas[i],fim)<=lim) return i; }
  return n-1;
}
function invSerie(emp,u){
  const H=PRICE_HISTORY[emp], c=invCorte(emp);
  return { datas:H.datas.slice(c), fontes:H.fontes.slice(c), vals:H.unidades[u].slice(c) };
}
function invPontos(emp,u){
  const s=invSerie(emp,u);
  const idx=s.vals.map((v,i)=>v==null?-1:i).filter(i=>i>=0);
  return {s, idx};
}
function invVarUnidade(emp,u){
  const {s,idx}=invPontos(emp,u);
  if(idx.length<2) return null;
  return s.vals[idx[idx.length-1]]/s.vals[idx[0]]-1;
}
function invMesesUnidade(emp,u){
  const {s,idx}=invPontos(emp,u);
  if(idx.length<2) return 0;
  return invMesesEntre(s.datas[idx[0]], s.datas[idx[idx.length-1]]);
}
function invMedia(emp){
  const us=invUnidades(emp).map(u=>invVarUnidade(emp,u)).filter(v=>v!=null);
  if(!us.length) return null;
  return us.reduce((a,b)=>a+b,0)/us.length;
}
function invMesesJanela(emp){
  const H=PRICE_HISTORY[emp]; return H.datas.slice(invCorte(emp)).length-1;
}
function pct(v){ return (v>=0?"+":"") + (v*100).toFixed(2).replace(".",",") + "%"; }

function buildInvConstrDropdown(){
  const sel=document.getElementById("inv-constr"); if(!sel) return;
  const cont={};
  Object.keys(PRICE_HISTORY).forEach(e=>{ const c=invConstrutora(e); cont[c]=(cont[c]||0)+1; });
  const nomes=Object.keys(cont).sort((a,b)=>a.localeCompare(b,'pt-BR'));
  const tot=Object.keys(PRICE_HISTORY).length;
  sel.innerHTML=`<option value="">Todas as construtoras (${tot})</option>`+
    nomes.map(c=>`<option value="${c}">${c} (${cont[c]})</option>`).join("");
}

function renderInvest(){
  const box=document.getElementById("inv-list");
  const f=invState.q.trim().toLowerCase(), c=invState.constr;
  let emps=Object.keys(PRICE_HISTORY).filter(e=>{
    if(!invUnidades(e).length) return false;
    if(c && invConstrutora(e)!==c) return false;
    if(!f) return true;
    return e.toLowerCase().includes(f) || invConstrutora(e).toLowerCase().includes(f);
  });
  emps.sort((a,b)=>{
    const va=invMedia(a)??-9, vb=invMedia(b)??-9;
    return invState.ordem==="desc" ? vb-va : va-vb;
  });
  document.getElementById("inv-count").textContent=emps.length;
  if(!emps.length){
    box.innerHTML='<div class="inv-empty">Nenhum empreendimento com histórico para esse filtro.</div>';
    return;
  }
  box.innerHTML=emps.map(e=>{
    const m=invMedia(e), n=invUnidades(e).length;
    const H=PRICE_HISTORY[e], ds=H.datas.slice(invCorte(e));
    return `<div class="inv-card" data-emp="${e.replace(/"/g,'&quot;')}">
      <div class="inv-card-main">
        <div class="inv-emp">${e}</div>
        <div class="inv-meta"><b>${invConstrutora(e)}</b> · ${n} unidade${n>1?'s':''} disponíve${n>1?'is':'l'} com histórico
        · ${invMesLabel(ds[0])} a ${invMesLabel(ds[ds.length-1])} (${invPeriodoLabel(invMesesEntre(ds[0],ds[ds.length-1]))})</div>
      </div>
      <div class="inv-val">
        <div class="inv-pct ${m<0?'neg':''}">${m==null?'—':pct(m)}</div>
        <div class="inv-pct-lbl">valorização média</div>
      </div>
    </div>`;
  }).join("");
  box.querySelectorAll(".inv-card").forEach(el=>{
    el.addEventListener("click",()=>openInvest(el.dataset.emp));
  });
}

function openInvest(emp){
  invState.emp=emp;
  const us=invUnidades(emp);
  invState.sel=us.length?[us[0]]:[];
  document.getElementById("inv-modal").hidden=false;
  drawInvest();
}
function closeInvest(){
  document.getElementById("inv-modal").hidden=true;
  invState.emp=null;
}
function toggleInvUnit(u){
  if(invState.sel.length===1 && invState.sel[0]===u) return;
  invState.sel=[u];
  drawInvest();
}

function drawInvest(){
  const emp=invState.emp; if(!emp) return;
  const us=invUnidades(emp), sel=invState.sel;
  const s0=invSerie(emp,sel[0]);
  const meses=Math.max(...sel.map(u=>invMesesUnidade(emp,u)));
  const chips=us.map(u=>`<button type="button" class="inv-chip ${sel.includes(u)?'on':''}" data-u="${u}">${u}</button>`).join("");
  const vars=sel.map(u=>invVarUnidade(emp,u));
  const media=vars.reduce((a,b)=>a+b,0)/vars.length;
  const eqMes=Math.pow(1+media,1/Math.max(meses,0.5))-1;
  const primeiro=u=>{const{s,idx}=invPontos(emp,u); return s.vals[idx[0]];};
  const ultimo=u=>{const{s,idx}=invPontos(emp,u); return s.vals[idx[idx.length-1]];};
  const ini=sel.map(primeiro).reduce((a,b)=>a+b,0)/sel.length;
  const fim=sel.map(ultimo).reduce((a,b)=>a+b,0)/sel.length;
  const um = sel.length===1;

  document.getElementById("inv-modal-body").innerHTML=`
    <div class="inv-h">${emp}</div>
    <div class="inv-sub">${invConstrutora(emp)} · evolução de ${invMesLabel(s0.datas[invPontos(emp,sel[0]).idx[0]])} a
      ${invMesLabel(s0.datas[invPontos(emp,sel[0]).idx.slice(-1)[0]])} · ${um?('unidade '+sel[0]):(sel.length+' unidades')}</div>
    <div class="inv-chips">${chips}</div>
    <p class="inv-hint">Clique em uma unidade para ver a evolução dela. Só aparecem unidades ainda disponíveis.</p>
    <div class="inv-chart-wrap">${invChartSVG(emp,sel)}</div>
    <div class="inv-kpis">
      <div class="inv-kpi"><div class="inv-kpi-l">${um?'Valor inicial':'Média inicial'}</div>
        <div class="inv-kpi-v">${fmtBRL(ini)}</div></div>
      <div class="inv-kpi"><div class="inv-kpi-l">${um?'Valor atual':'Média atual'}</div>
        <div class="inv-kpi-v">${fmtBRL(fim)}</div></div>
      <div class="inv-kpi"><div class="inv-kpi-l">Valorização em ${invPeriodoLabel(meses)}</div>
        <div class="inv-kpi-v ${media<0?'neg':'pos'}">${pct(media)}</div></div>
      <div class="inv-kpi"><div class="inv-kpi-l">Equivalente mensal</div>
        <div class="inv-kpi-v ${eqMes<0?'neg':'pos'}">${pct(eqMes)}</div></div>
    </div>
    <div class="inv-actions">
      <button type="button" class="inv-btn" id="inv-pdf">Baixar PDF</button>
      <button type="button" class="inv-btn sec" id="inv-fechar">Fechar</button>
    </div>
    ${PRICE_HISTORY[emp].obs?`<div class="inv-fontes"><b>Observações:</b> ${PRICE_HISTORY[emp].obs}</div>`:''}
    <div class="inv-fontes"><b>Fontes:</b> ${s0.fontes.join(" · ")}</div>
    ${invFolhaPDF(emp,sel,{ini,fim,media,eqMes,meses,s0})}`;

  const body=document.getElementById("inv-modal-body");
  body.querySelectorAll(".inv-chip").forEach(b=>b.addEventListener("click",()=>toggleInvUnit(b.dataset.u)));
  body.querySelector("#inv-pdf").addEventListener("click",()=>window.print());
  body.querySelector("#inv-fechar").addEventListener("click",closeInvest);
}


function invUnidadeDesc(emp,u){
  const t=SALES_TABLES[emp]; if(!t) return "";
  const r=t.rows.find(x=>String(x[t.unitCol])===String(u)); if(!r) return "";
  const s=t.summary||{};
  const vazio=v=>(v==null||v===""||v==="\u2014"||v==="-");
  return (s.bits||[]).map(b=>vazio(r[b.col])?null:`${b.pre||""}${r[b.col]}${b.pos||""}`)
    .filter(Boolean).join(" \u00b7 ");
}
function invHoje(){
  const d=new Date(), p=n=>String(n).padStart(2,"0");
  return `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()}`;
}

function invFolhaPDF(emp,sel,d){
  const u=sel[0], dd=DATA.find(x=>x.empreendimento===emp)||{};
  const desc=invUnidadeDesc(emp,u);
  const idx=invPontos(emp,u).idx;
  const de=invMesLabel(d.s0.datas[idx[0]]), ate=invMesLabel(d.s0.datas[idx[idx.length-1]]);
  const logo=document.querySelector(".cmp-logo-print");
  const src=logo?logo.getAttribute("src"):"";
  return `<div class="pdf-sheet">
    <div class="pdf-top">
      <img class="pdf-logo" src="${src}" alt="ZELT Imóveis">
      <div class="pdf-top-r"><span>Relatório de valorização</span><b>${invHoje()}</b></div>
    </div>
    <div class="pdf-title">
      <h1>${emp}</h1>
      <div class="pdf-sub">${dd.construtora||''}${dd.bairro?' · '+dd.bairro:''} · ${rotuloUnidade(SALES_TABLES[emp])} <b>${u}</b>${desc?' · '+desc:''}</div>
    </div>
    <div class="pdf-lead">
      <div class="pdf-lead-l${d.media<0?' neg':''}">
        <span>Valorização de ${de} a ${ate}</span>
        <strong>${pct(d.media)}</strong>
      </div>
      <div class="pdf-lead-r">
        <div><span>Valor em ${de}</span><b>${fmtBRL(d.ini)}</b></div>
        <div><span>Valor em ${ate}</span><b>${fmtBRL(d.fim)}</b></div>
      </div>
    </div>
    <div class="pdf-chart">${invChartSVG(emp,sel,{h:695})}</div>
    <div class="pdf-kpis">
      <div><span>Período</span><b>${invPeriodoLabel(d.meses)}</b></div>
      <div><span>Valorização total</span><b class="${d.media<0?'neg':'pos'}">${pct(d.media)}</b></div>
      <div><span>Equivalente mensal</span><b class="${d.eqMes<0?'neg':'pos'}">${pct(d.eqMes)}</b></div>
      <div><span>Variação em reais</span><b class="${d.fim<d.ini?'neg':'pos'}">${(d.fim<d.ini?'':'+')+fmtBRL(d.fim-d.ini)}</b></div>
    </div>
    <div class="pdf-src"><b>Fontes:</b> ${d.s0.fontes.join(" · ")}</div>
    <div class="pdf-foot">
      <div class="pdf-foot-l"><b>ZELT IMÓVEIS</b><span>CRECI-SC 4443-J · vendas@zelt.com.br · Blumenau/SC</span></div>
      <div class="pdf-foot-r">Valores conforme as tabelas oficiais da construtora nas datas indicadas.<br>
      Sujeitos a alteração sem aviso prévio. Não constituem proposta comercial.</div>
    </div>
  </div>`;
}
function invChartSVG(emp,sel,opts){
  opts=opts||{};
  const W=760,Hh=opts.h||320,ml=78,mr=18,mt=18,mb=42;
  const s0=invSerie(emp,sel[0]);
  const n=s0.datas.length;
  let lo=Infinity,hi=-Infinity;
  sel.forEach(u=>invSerie(emp,u).vals.forEach(v=>{ if(v==null) return; lo=Math.min(lo,v);hi=Math.max(hi,v); }));
  const pad=(hi-lo)*0.18 || hi*0.02;
  lo-=pad; hi+=pad;
  const X=i=> ml + (n===1?0:(W-ml-mr)*i/(n-1));
  const Y=v=> mt + (Hh-mt-mb)*(1-(v-lo)/(hi-lo));
  const ticks=4;
  let grid="",ylab="";
  for(let k=0;k<=ticks;k++){
    const v=lo+(hi-lo)*k/ticks, y=Y(v);
    grid+=`<line x1="${ml}" y1="${y.toFixed(1)}" x2="${W-mr}" y2="${y.toFixed(1)}" stroke="#e8e8ef" stroke-width="1"/>`;
    ylab+=`<text x="${ml-9}" y="${(y+4).toFixed(1)}" text-anchor="end" font-family="Atkinson Hyperlegible,Arial" font-size="11" fill="#8b8ba0">R$ ${(v/1000).toFixed(0)} mil</text>`;
  }
  let xlab="";
  s0.datas.forEach((d,i)=>{
    if(n>9 && i%2===1 && i!==n-1) return;
    xlab+=`<text x="${X(i).toFixed(1)}" y="${Hh-mb+20}" text-anchor="middle" font-family="Atkinson Hyperlegible,Arial" font-size="11" fill="#8b8ba0">${invMesLabel(d)}</text>`;
  });
  let linhas="",pontos="",leg="";
  sel.forEach((u,k)=>{
    const cor=INV_CORES[k%INV_CORES.length], v=invSerie(emp,u).vals;
    /* quebra a linha nas lacunas: um polyline por trecho continuo */
    let trecho=[];
    const fecha=()=>{
      if(trecho.length>1){
        linhas+=`<polyline fill="none" stroke="${cor}" stroke-width="2.5" stroke-linejoin="round" points="${trecho.join(" ")}"/>`;
      } else if(trecho.length===1){
        const [x,y]=trecho[0].split(",");
        pontos+=`<circle cx="${x}" cy="${y}" r="4" fill="${cor}"/>`;
      }
      trecho=[];
    };
    v.forEach((y,i)=>{
      if(y==null){ fecha(); return; }
      trecho.push(`${X(i).toFixed(1)},${Y(y).toFixed(1)}`);
      pontos+=`<circle cx="${X(i).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="3.2" fill="#fff" stroke="${cor}" stroke-width="2"/>`;
    });
    fecha();
    /* trecho pontilhado ligando lacunas, para nao sugerir continuidade */
    const idx=v.map((x,i)=>x==null?-1:i).filter(i=>i>=0);
    for(let j=0;j<idx.length-1;j++){
      if(idx[j+1]-idx[j]>1){
        linhas+=`<line x1="${X(idx[j]).toFixed(1)}" y1="${Y(v[idx[j]]).toFixed(1)}" x2="${X(idx[j+1]).toFixed(1)}" y2="${Y(v[idx[j+1]]).toFixed(1)}" stroke="${cor}" stroke-width="1.6" stroke-dasharray="5 5" opacity=".55"/>`;
      }
    }
    const li=idx[idx.length-1], last=v[li];
    pontos+=`<text x="${(X(li)-6).toFixed(1)}" y="${(Y(last)-11).toFixed(1)}" text-anchor="end" font-family="Oswald,Arial" font-size="12" font-weight="600" fill="${cor}">${fmtBRL(last)}</text>`;
    leg+=`<g transform="translate(${ml+k*104},${Hh-6})"><rect width="11" height="11" rx="2.5" fill="${cor}"/><text x="16" y="9.5" font-family="Oswald,Arial" font-size="11.5" fill="#3a3a52">Un. ${u}</text></g>`;
  });
  return `<svg viewBox="0 0 ${W} ${Hh+14}" width="100%" xmlns="http://www.w3.org/2000/svg" role="img">
    ${grid}${ylab}${xlab}
    <line x1="${ml}" y1="${mt}" x2="${ml}" y2="${Hh-mb}" stroke="#c9c9d6" stroke-width="1"/>
    <line x1="${ml}" y1="${Hh-mb}" x2="${W-mr}" y2="${Hh-mb}" stroke="#c9c9d6" stroke-width="1"/>
    ${linhas}${pontos}${sel.length>1?leg:''}
  </svg>`;
}

function initInvest(){
  if(!document.getElementById("inv-list")) return;
  buildInvConstrDropdown();
  renderInvest();
  document.getElementById("inv-search").addEventListener("input",e=>{invState.q=e.target.value;renderInvest();});
  document.getElementById("inv-constr").addEventListener("change",e=>{invState.constr=e.target.value;renderInvest();});
  document.getElementById("inv-periodo").addEventListener("change",e=>{invState.periodo=e.target.value;renderInvest();if(invState.emp)drawInvest();});
  document.getElementById("inv-ordem").addEventListener("change",e=>{invState.ordem=e.target.value;renderInvest();});
  document.getElementById("inv-close").addEventListener("click",closeInvest);
  document.getElementById("inv-modal").addEventListener("click",e=>{ if(e.target.id==="inv-modal") closeInvest(); });
  document.addEventListener("keydown",e=>{ if(e.key==="Escape" && invState.emp) closeInvest(); });
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",initInvest);
else initInvest();