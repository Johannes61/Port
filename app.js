// Theme
const html = document.documentElement;
const storedTheme = localStorage.getItem('theme') || 'dark';
if (storedTheme === 'light') html.classList.add('light');

// Header FLIP animation: form-in-place (no side jump)
const nav = document.getElementById('nav');
const navShell = document.getElementById('navShell');
let glassOn = false;

function flipToggle(toGlass){
  if (toGlass === glassOn) return;

  // Preserve shell height to avoid layout jump
  const h = nav.getBoundingClientRect().height;
  navShell.style.height = toGlass ? `${h}px` : '';

  // FIRST
  const first = nav.getBoundingClientRect();

  // Toggle state (sets fixed centered "glass" or normal)
  nav.classList.toggle('nav-glass', toGlass);

  // LAST
  const last = nav.getBoundingClientRect();

  // Invert
  const dx = (first.left + first.width/2) - (last.left + last.width/2); // center-to-center
  const dy = (first.top + first.height/2) - (last.top + last.height/2);
  const sx = first.width / last.width;
  const sy = first.height / last.height;

  // Animate container
  nav.animate([
    { transformOrigin: 'center top', transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, borderRadius: toGlass ? '0px' : '16px', backdropFilter: 'blur(0px)' },
    { transformOrigin: 'center top', transform: 'translate(0,0) scale(1,1)', borderRadius: toGlass ? '16px' : '0px', backdropFilter: toGlass ? 'blur(10px)' : 'blur(0px)' }
  ], { duration: 380, easing: 'cubic-bezier(0.22,0.61,0.36,1)' });

  // Animate inner content to "tuck in"
  Array.from(nav.children).forEach((child,i)=>{
    child.animate([
      { opacity: 0.85, transform: 'translateY(-6px)' },
      { opacity: 1, transform: 'translateY(0px)' }
    ], { duration: 260 + i*30, easing: 'ease-out' });
  });

  glassOn = toGlass;
}
function onScrollNav(){
  const shouldGlass = window.scrollY > 46;
  flipToggle(shouldGlass);
}
window.addEventListener('scroll', onScrollNav, { passive:true });
onScrollNav();

// Quick Actions Overlay (purple theme)
const qaBtn = document.getElementById('qaBtn');
const qaOverlay = document.getElementById('qaOverlay');
const qaClose = document.getElementById('qaClose');

function lockBody(lock){ document.body.style.overflow = lock ? 'hidden' : ''; }
function openQA(open){
  qaOverlay.classList.toggle('open', open);
  qaOverlay.setAttribute('aria-hidden', open ? 'false' : 'true');
  qaBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  lockBody(open);
}
qaBtn.addEventListener('click', ()=> openQA(!qaOverlay.classList.contains('open')));
qaClose.addEventListener('click', ()=> openQA(false));
qaOverlay.addEventListener('click', (e)=>{ if (e.target === qaOverlay) openQA(false); });
document.addEventListener('keydown', (e)=>{
  const k = e.key.toLowerCase();
  if (k === 'escape') openQA(false);
  if (k === 'q') openQA(!qaOverlay.classList.contains('open'));
  if (k === 'd') document.getElementById('actTheme').click();
  if (k === 'f') document.getElementById('actFocus').click();
});

// Quick Actions state (all purple style, consistent)
function setAction(btn, on){
  btn.dataset.on = on ? '1' : '0';
  btn.classList.toggle('active', on);
  btn.querySelector('.qaction-state').textContent = on ? 'On' : 'Off';
}
function initAction(key, btn, apply){
  const on = localStorage.getItem(key) === '1';
  setAction(btn, on); if (on) apply(true);
  btn.addEventListener('click', ()=>{
    const next = btn.dataset.on !== '1';
    setAction(btn, next); localStorage.setItem(key, next ? '1':'0'); apply(next);
  });
}
initAction('pref_theme_light', document.getElementById('actTheme'), (on)=>{
  html.classList.toggle('light', on);
  localStorage.setItem('theme', on ? 'light' : 'dark');
});
initAction('pref_focus', document.getElementById('actFocus'), (on)=>{
  document.body.classList.toggle('focus', on);
});
initAction('pref_reduce_motion', document.getElementById('actMotion'), (on)=>{
  document.documentElement.style.setProperty('--prefers-reduced-motion', on?'reduce':'no-preference');
});

// Skills marquees (seamless)
const Adobe = [['ps','Ps','Photoshop'],['ai','Ai','Illustrator'],['id','Id','InDesign'],['ae','Ae','After Effects'],['pr','Pr','Premiere Pro'],['xd','Xd','Adobe XD'],['lr','Lr','Lightroom'],['fr','Fr','Fresco'],['acr','Ac','Acrobat']];
const Code = [['html','HT','HTML5'],['css','CS','CSS3'],['js','JS','JavaScript'],['ts','TS','TypeScript'],['py','Py','Python'],['ml','ML','Machine Learning'],['react','Re','React'],['next','Nx','Next.js'],['node','Nd','Node.js'],['db','DB','PostgreSQL']];
const General = [['gen','UX','UX'],['gen','UI','UI'],['gen','A11y','Accessibility'],['gen','Perf','Performance'],['gen','SEO','SEO'],['gen','Git','Git'],['gen','Agile','Agile'],['gen','Fig','Figma'],['gen','Nt','Notion'],['gen','Solve','Problem Solving']];
function group(list){ const g=document.createElement('div'); g.className='group';
  list.forEach(([cls,txt,label])=>{ const c=document.createElement('div'); c.className='logo-card'; c.title=label;
    const l=document.createElement('div'); l.className='logo '+cls; l.textContent=txt;
    const n=document.createElement('div'); n.textContent=label; n.className='muted';
    c.append(l,n); g.append(c); }); return g; }
function initMarquee(el, data, seconds, reverse=false){
  const lane=document.createElement('div'); lane.className='lane'; lane.style.setProperty('--dur', seconds+'s');
  if(reverse) lane.style.animationDirection='reverse';
  lane.append(group(data), group(data)); // duplicate for seamless loop
  el.append(lane);
}
initMarquee(document.getElementById('mq-adobe'), Adobe, 22, false);
initMarquee(document.getElementById('mq-code'), Code, 24, true);
initMarquee(document.getElementById('mq-general'), General, 28, false);

// Projects
const Projects=[
  {title:"Buxo",blurb:"SOL account-reclaiming memecoin tool with an active, trusted community.",tags:[{t:"Live",href:"https://buxohq.com/"}],link:"https://buxohq.com/",image:"https://images.unsplash.com/photo-1621768216002-5ac171876625?q=80&w=1200&auto=format&fit=crop"},
  {title:"Fav-Board",blurb:"Fast bookmarks board — pin, search & jump.",tags:[{t:"Live",href:"https://johannes61.github.io/Fav-Board/"},{t:"GitHub",href:"https://github.com/johannes61/Fav-Board"}],link:"https://johannes61.github.io/Fav-Board/",image:"https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1200&auto=format&fit=crop"},
  {title:"Repo-Radar",blurb:"Discover & track repositories at a glance.",tags:[{t:"Live",href:"https://johannes61.github.io/Repo-Radar/"},{t:"GitHub",href:"https://github.com/johannes61/Repo-Radar"}],link:"https://johannes61.github.io/Repo-Radar/",image:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop"},
  {title:"Ping-Board",blurb:"Minimal network pinger dashboard.",tags:[{t:"Live",href:"https://johannes61.github.io/Ping-Board/"},{t:"GitHub",href:"https://github.com/johannes61/Ping-Board"}],link:"https://johannes61.github.io/Ping-Board/",image:"https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop"}
];
const grid=document.getElementById('projectGrid');
function renderProjects(list){
  grid.innerHTML='';
  list.forEach(p=>{
    const art=document.createElement('article'); art.className='project reveal';
    const badges=(p.tags||[]).map(o=>`<a class="badge" href="${o.href}" target="_blank" rel="noreferrer">${o.t}</a>`).join('');
    art.innerHTML=`<div class="project-card"><a class="thumb" href="${p.link}" target="_blank" rel="noreferrer"><img alt="${p.title}" src="${p.image}"/></a><div class="meta"><h3>${p.title}</h3><div class="badges">${badges}</div></div><p class="muted">${p.blurb}</p></div>`;
    grid.appendChild(art);
  });
}
renderProjects(Projects);

// Reveal on scroll
const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}})},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

// Education progress — driven by viewport CENTER
const edu=document.getElementById('eduList');
function updateEduProgress(){
  const rect=edu.getBoundingClientRect();
  const center = window.scrollY + innerHeight/2;
  const top = rect.top + window.scrollY;
  const progress = Math.min(1, Math.max(0, (center - top) / rect.height ));
  edu.style.setProperty('--edu-progress', (progress*100).toFixed(1));
}
updateEduProgress(); addEventListener('scroll',updateEduProgress,{passive:true}); addEventListener('resize',updateEduProgress',{passive:true});

// Contact form UX
const form=document.getElementById('contactForm'); const note=document.getElementById('formNote');
document.getElementById('sendBtn').addEventListener('click', ()=>{
  const data=Object.fromEntries(new FormData(form).entries());
  if(!(data.name && data.email && data.message)){
    note.textContent='Please fill name, email, and message.'; note.style.color='#ffb3b3'; return;
  }
  note.textContent='Thanks! Your message has been queued.'; note.style.color='';
  form.reset();
});

// Footer helpers + visitors (open tabs counter demo)
document.getElementById('year').textContent=new Date().getFullYear();
(function(){
  const KEY='__presence__', id=Math.random().toString(36).slice(2), ttl=15000, el=document.getElementById('visitorsCount');
  const bc=('BroadcastChannel' in window)?new BroadcastChannel('presence'):null;
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}};
  const write=(o)=>{try{localStorage.setItem(KEY,JSON.stringify(o))}catch{}; if(bc) bc.postMessage('ping')};
  const sweep=(o)=>{const n=Date.now(); for(const k in o){if(n-o[k]>ttl) delete o[k]} return o};
  const update=(o)=>{el.textContent=String(Object.keys(o).length)};
  const tick=()=>{let m=read(); m[id]=Date.now(); m=sweep(m); write(m); update(m)};
  window.addEventListener('storage',(e)=>{if(e.key===KEY) update(sweep(read()))});
  if(bc) bc.onmessage=()=> update(sweep(read()));
  tick(); setInterval(tick,4000);
  window.addEventListener('beforeunload',()=>{const m=read(); delete m[id]; write(m)});
})();
