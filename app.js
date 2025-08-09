// Theme boot -----------------------------------------------------------
const html = document.documentElement;
const storedTheme = localStorage.getItem('theme') || 'dark';
if (storedTheme === 'light') html.classList.add('light');

// Elements -------------------------------------------------------------
const nav = document.getElementById('nav');
const header = document.getElementById('siteHeader');
const qaBtn = document.getElementById('qaBtn');
const qaPanel = document.getElementById('qaPanel');
const qaClose = document.getElementById('qaClose');
const actTheme = document.getElementById('actTheme');
const actFocus = document.getElementById('actFocus');
const actMotion = document.getElementById('actMotion');

// Header pop-out glass -------------------------------------------------
function placeQAPanel() {
  const rect = header.getBoundingClientRect();
  const top = rect.bottom + window.scrollY + 8;
  qaPanel.style.top = top + 'px';
}
function onScrollNav() {
  if (window.scrollY > 46) nav.classList.add('nav-glass');
  else nav.classList.remove('nav-glass');
  placeQAPanel();
}
window.addEventListener('scroll', onScrollNav, { passive: true });
window.addEventListener('resize', placeQAPanel, { passive: true });
onScrollNav();

// Quick Access toggling & shortcuts -----------------------------------
const openQA = (open) => {
  qaPanel.classList.toggle('open', open);
  qaBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
};
qaBtn.addEventListener('click', () => openQA(!qaPanel.classList.contains('open')));
qaClose?.addEventListener('click', () => openQA(false));
document.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (k === 'q') openQA(!qaPanel.classList.contains('open'));
  if (k === 'escape') openQA(false);
  if (k === 'd') actTheme.click();
  if (k === 'f') actFocus.click();
});

// Action boxes state ---------------------------------------------------
function setActive(btn, on){
  btn.classList.toggle('active', on);
  const s = btn.querySelector('.state'); if (s) s.textContent = on ? 'On' : 'Off';
}
function initAction(key, btn, apply){
  const on = localStorage.getItem(key) === '1';
  setActive(btn, on); if (on) apply(true);
  btn.addEventListener('click', ()=>{
    const next = !btn.classList.contains('active');
    setActive(btn, next); apply(next);
    localStorage.setItem(key, next ? '1' : '0');
  });
}
initAction('pref_theme_light', actTheme, (on)=> {
  html.classList.toggle('light', on);
  localStorage.setItem('theme', on ? 'light' : 'dark');
});
initAction('pref_focus', actFocus, (on)=> {
  document.body.classList.toggle('focus', on);
});
initAction('pref_reduce_motion', actMotion, (on)=> {
  document.documentElement.style.setProperty('--prefers-reduced-motion', on ? 'reduce' : 'no-preference');
});

// Skills marquees (seamless) ------------------------------------------
const Adobe = [
  ['ps', 'Ps', 'Photoshop'], ['ai', 'Ai', 'Illustrator'], ['id', 'Id', 'InDesign'],
  ['ae', 'Ae', 'After Effects'], ['pr', 'Pr', 'Premiere Pro'], ['xd', 'Xd', 'Adobe XD'],
  ['lr', 'Lr', 'Lightroom'], ['fr', 'Fr', 'Fresco'], ['acr', 'Ac', 'Acrobat']
];
const Code = [
  ['html','HT','HTML5'], ['css','CS','CSS3'], ['js','JS','JavaScript'], ['ts','TS','TypeScript'],
  ['py','Py','Python'], ['ml','ML','Machine Learning'], ['react','Re','React'], ['next','Nx','Next.js'],
  ['node','Nd','Node.js'], ['db','DB','PostgreSQL']
];
const General = [
  ['gen','UX','UX'], ['gen','UI','UI'], ['gen','A11y','Accessibility'], ['gen','Perf','Performance'],
  ['gen','SEO','SEO'], ['gen','Git','Git'], ['gen','Agile','Agile'], ['gen','Fig','Figma'],
  ['gen','Nt','Notion'], ['gen','Solve','Problem Solving']
];

function group(list){
  const g=document.createElement('div'); g.className='group';
  list.forEach(([cls,txt,label])=>{
    const card=document.createElement('div'); card.className='logo-card'; card.title=label;
    const logo=document.createElement('div'); logo.className='logo '+cls; logo.textContent=txt;
    const name=document.createElement('div'); name.textContent=label; name.className='muted';
    card.append(logo,name); g.append(card);
  });
  return g;
}
function initMarquee(el, data, seconds, reverse=false){
  const lane=document.createElement('div'); lane.className='lane'; lane.style.setProperty('--dur', seconds+'s');
  if(reverse) lane.style.animationDirection='reverse';
  lane.append(group(data), group(data)); // duplicate for seamless
  el.append(lane);
}
initMarquee(document.getElementById('mq-adobe'), Adobe, 22, false);
initMarquee(document.getElementById('mq-code'), Code, 24, true);
initMarquee(document.getElementById('mq-general'), General, 28, false);

// Projects -------------------------------------------------------------
const Projects = [
  {title:"Buxo", blurb:"SOL account‑reclaiming memecoin tool with an active, trusted community.", tags:[{t:"Live", href:"https://buxohq.com/"}], link:"https://buxohq.com/", image:"https://images.unsplash.com/photo-1621768216002-5ac171876625?q=80&w=1200&auto=format&fit=crop"},
  {title:"Fav‑Board", blurb:"Fast bookmarks board — pin, search & jump.", tags:[{t:"Live", href:"https://johannes61.github.io/Fav-Board/"},{t:"GitHub", href:"https://github.com/johannes61/Fav-Board"}], link:"https://johannes61.github.io/Fav-Board/", image:"https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1200&auto=format&fit=crop"},
  {title:"Repo‑Radar", blurb:"Discover & track repositories at a glance.", tags:[{t:"Live", href:"https://johannes61.github.io/Repo-Radar/"},{t:"GitHub", href:"https://github.com/johannes61/Repo-Radar"}], link:"https://johannes61.github.io/Repo-Radar/", image:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop"},
  {title:"Ping‑Board", blurb:"Minimal network pinger dashboard.", tags:[{t:"Live", href:"https://johannes61.github.io/Ping-Board/"},{t:"GitHub", href:"https://github.com/johannes61/Ping-Board"}], link:"https://johannes61.github.io/Ping-Board/", image:"https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop"}
];
const grid=document.getElementById('projectGrid');
function renderProjects(list){
  grid.innerHTML='';
  list.forEach(p=>{
    const art=document.createElement('article'); art.className='project reveal';
    const badges=(p.tags||[]).map(o=>`<a class="badge" href="${o.href}" target="_blank" rel="noreferrer">${o.t}</a>`).join('');
    art.innerHTML=`
      <div class="project-card">
        <a class="thumb" href="${p.link}" target="_blank" rel="noreferrer"><img alt="${p.title}" src="${p.image}"/></a>
        <div class="meta"><h3>${p.title}</h3><div class="badges">${badges}</div></div>
        <p class="muted">${p.blurb}</p>
      </div>`;
    grid.appendChild(art);
  });
}
renderProjects(Projects);

// Reveal on scroll -----------------------------------------------------
const io=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target);} });
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

// Education progress glow ---------------------------------------------
const edu=document.getElementById('eduList');
function updateEduProgress(){
  const rect=edu.getBoundingClientRect(); const viewH=innerHeight;
  const start=Math.max(0,(viewH*0.15)-rect.top);
  const range=rect.height+viewH*0.3;
  const pct=Math.min(1,Math.max(0,start/range));
  edu.style.setProperty('--edu-progress',(pct*100).toFixed(1));
}
updateEduProgress();
addEventListener('scroll',updateEduProgress,{passive:true});
addEventListener('resize',updateEduProgress,{passive:true});

// Contact demo ---------------------------------------------------------
document.getElementById('sendBtn').addEventListener('click', ()=>{
  const form=document.getElementById('contactForm');
  const data=Object.fromEntries(new FormData(form).entries());
  if(!(data.name && data.email && data.message)){
    alert('Please fill in your name, email, and message.');
    return;
  }
  alert('Thanks '+data.name+'! Your message has been queued.');
  form.reset();
});

// Footer helpers -------------------------------------------------------
document.getElementById('year').textContent=new Date().getFullYear();

// “Live visitors” (local, open-tabs demo) -----------------------------
(function(){
  const KEY='__presence__';
  const id=Math.random().toString(36).slice(2);
  const ttl=15000;
  const el=document.getElementById('visitorsCount');
  const bc=('BroadcastChannel' in window)?new BroadcastChannel('presence'):null;

  function read(){ try{return JSON.parse(localStorage.getItem(KEY)||'{}');}catch{return{}} }
  function write(obj){ try{localStorage.setItem(KEY,JSON.stringify(obj));}catch{} if(bc) bc.postMessage('ping'); }
  function sweep(obj){ const now=Date.now(); for(const k in obj){ if(now-obj[k]>ttl) delete obj[k]; } return obj; }
  function update(map){ el.textContent=String(Object.keys(map).length); }
  function tick(){ let map=read(); map[id]=Date.now(); map=sweep(map); write(map); update(map); }

  window.addEventListener('storage',(e)=>{ if(e.key===KEY){ update(sweep(read())); }});
  if(bc){ bc.onmessage=()=> update(sweep(read())); }

  tick(); setInterval(tick,4000);
  window.addEventListener('beforeunload',()=>{ const map=read(); delete map[id]; write(map); });
})();
