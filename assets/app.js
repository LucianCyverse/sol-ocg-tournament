
let DB, CARDS, activeCard="";
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
const norm=s=>String(s||"").toLowerCase().replace(/[’‘]/g,"'").replace(/[–—]/g,"-");
const toast=t=>{const e=$("toast");e.textContent=t;e.style.display="block";setTimeout(()=>e.style.display="none",2200)};
async function load(){
 const [d,c]=await Promise.all([fetch("/data/tournament-data.json?ts="+Date.now()).then(r=>r.json()),fetch("/data/cards.json?ts="+Date.now()).then(r=>r.json())]);
 DB=d;CARDS=c; $("version").textContent=`${d.tournament} · data ${d.version} · ${d.updated}`;
 renderMatches();renderStandings();renderCards();
 const saved=JSON.parse(localStorage.getItem("solResume")||"null"); if(saved) setTimeout(()=>document.getElementById(saved)?.scrollIntoView(),250);
}
function linkify(text){
 let out=esc(text);[...CARDS.known].sort((a,b)=>b.length-a.length).forEach(n=>{
   const i=norm(out).indexOf(norm(esc(n))); if(i>=0) out=out.slice(0,i)+`<span class="card-link" data-card="${esc(n)}">${out.slice(i,i+n.length)}</span>`+out.slice(i+n.length);
 });return out;
}
function renderMatches(filter=""){
 const f=norm(filter);
 $("matchList").innerHTML=DB.matches.filter(m=>norm(JSON.stringify(m)).includes(f)).map(m=>`
 <article class="match" id="${m.id}">
  <div class="match-head"><div><div class="muted">${esc(m.round)}</div><h2>${esc(m.title)}</h2><div class="score">${esc(m.score)}</div></div>
  <span class="badge ${m.status==="provisional"?"provisional":""}">${m.detailLevel==="full"?"Full report":m.detailLevel==="pending"?"Replay pending":"Condensed archive"}</span></div>
  ${m.context.map(x=>`<p class="context">${linkify(x)}</p>`).join("")}
  ${m.games.map((g,gi)=>`<details data-resume="${m.id}-g${gi}"><summary><div class="game-title"><span>${esc(g.title)} — ${esc(g.winner)}</span><span>⌄</span></div></summary>
    ${g.firstPlayer?`<p><b>First player:</b> ${esc(g.firstPlayer)}</p>`:""}
    ${g.sideDeck?`<div class="turn"><h4>Side decking</h4>${Object.entries(g.sideDeck).map(([k,v])=>`<p><b>${esc(k)}:</b> ${linkify(v)}</p>`).join("")}</div>`:""}
    ${g.openingHands?`<div class="turn"><h4>Opening hands</h4>${Object.entries(g.openingHands).map(([k,v])=>`<p><b>${esc(k)}:</b> ${v.map(linkify).join(", ")}</p>`).join("")}</div>`:""}
    ${g.turns.map((t,ti)=>`<details class="turn" data-resume="${m.id}-g${gi}-t${ti}"><summary>${esc(t.title)} ${t.lp?`<span class="muted">· ${esc(t.lp)}</span>`:""}</summary>
      <ol>${t.actions.map(a=>`<li>${linkify(a)}</li>`).join("")}</ol>
      ${t.audit?`<div class="audit"><b>Extra Deck audit:</b> ${linkify(t.audit)}</div>`:""}
      ${t.endBoard?`<div class="endboard"><b>End state:</b> ${linkify(t.endBoard)}</div>`:""}
    </details>`).join("")}
    ${g.decidingFactor?`<p><b>Deciding factor:</b> ${linkify(g.decidingFactor)}</p>`:""}
  </details>`).join("")}
  ${m.analysis?.length?`<details><summary>Match analysis</summary>${m.analysis.map(x=>`<p>${linkify(x)}</p>`).join("")}</details>`:""}
 </article>`).join("") || `<div class="panel">No match found.</div>`;
 document.querySelectorAll("details[data-resume]").forEach(d=>d.addEventListener("toggle",()=>{if(d.open)localStorage.setItem("solResume",JSON.stringify(d.dataset.resume))}));
}
function renderStandings(){
 $("standingsList").innerHTML=DB.standings.map(s=>`<div class="turn"><b>${esc(s.deck)}</b><span style="float:right">${esc(s.matches)} · ${esc(s.games)}</span></div>`).join("");
}
function localOverrides(){return JSON.parse(localStorage.getItem("solCardOverrides")||"{}")}
function renderCards(filter=""){
 const f=norm(filter);$("cardList").innerHTML=CARDS.known.filter(n=>norm(n).includes(f)).map(n=>`<div class="turn"><span class="card-link" data-card="${esc(n)}">${esc(n)}</span></div>`).join("");
}
async function official(name){
 const key="solCard:"+norm(name),cached=localStorage.getItem(key);if(cached)return JSON.parse(cached);
 const r=await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php?name="+encodeURIComponent(name));if(!r.ok)throw Error("Not found in the public released-card database.");
 const j=await r.json(),c=j.data?.[0];if(!c)throw Error("Not found.");
 const d={name:c.name,status:"Released-card database entry",effect:c.desc,type:c.type,attribute:c.attribute,race:c.race,level:c.level,atk:c.atk,def:c.def,linkval:c.linkval};
 localStorage.setItem(key,JSON.stringify(d));return d;
}
function showCard(d){
 $("cName").textContent=d.name||activeCard;$("cStatus").textContent=d.status||"";$("cText").textContent=d.effect||"No effect text stored.";$("cRole").textContent=d.role||"";
 const vals=[d.type,d.attribute,d.race,d.level!=null?"Level/Rank "+d.level:null,d.linkval?"Link-"+d.linkval:null,d.atk!=null?"ATK "+d.atk:null,d.def!=null?"DEF "+d.def:null].filter(Boolean);
 $("cStats").innerHTML=vals.map(v=>`<span>${esc(v)}</span>`).join("");
}
async function openCard(name){
 activeCard=name;$("cardModal").classList.add("open");$("cardEditor").hidden=true;
 const ov={...CARDS.overrides,...localOverrides()}[name];
 if(ov){showCard({name,...ov});try{const d=await official(name);if(!ov.effect||ov.effect.includes("not yet"))showCard({...d,role:ov.role,status:d.status+" · tournament note retained"})}catch{}}
 else{try{showCard(await official(name))}catch(e){showCard({name,status:"Unreleased or unavailable",effect:e.message,role:"Add a local override with the verified translation."})}}
}
document.addEventListener("click",e=>{const c=e.target.closest("[data-card]");if(c)openCard(c.dataset.card)});
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll("nav button").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(b.dataset.view).classList.add("active")});
$("matchSearch").oninput=e=>renderMatches(e.target.value);$("cardSearch").oninput=e=>renderCards(e.target.value);
$("closeCard").onclick=()=>$("cardModal").classList.remove("open");$("cardModal").onclick=e=>{if(e.target===$("cardModal"))$("cardModal").classList.remove("open")};
$("editCard").onclick=()=>{const ov={...CARDS.overrides,...localOverrides()}[activeCard]||{};$("cardEditor").hidden=!$("cardEditor").hidden;$("eStatus").value=ov.status||"Unofficial tournament translation";$("eRole").value=ov.role||"";$("eText").value=ov.effect||""};
$("saveCard").onclick=()=>{const o=localOverrides();o[activeCard]={status:$("eStatus").value,role:$("eRole").value,effect:$("eText").value};localStorage.setItem("solCardOverrides",JSON.stringify(o));toast("Saved on this device");openCard(activeCard)};
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify({overrides:localOverrides()},null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="sol-card-overrides.json";a.click()};
$("importFile").onchange=async e=>{const j=JSON.parse(await e.target.files[0].text());localStorage.setItem("solCardOverrides",JSON.stringify(j.overrides||j));toast("Overrides imported")};
$("themeBtn").onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("solTheme",document.body.classList.contains("light")?"light":"dark")};
if(localStorage.getItem("solTheme")==="light")document.body.classList.add("light");
if("serviceWorker" in navigator)navigator.serviceWorker.register("/service-worker.js");
load().catch(e=>{$("matchList").innerHTML=`<div class="panel">Could not load tournament data: ${esc(e.message)}</div>`});
