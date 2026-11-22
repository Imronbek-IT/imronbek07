const games = [
  {n:"Neon Drift 2090", g:"action",   t:"Racing · Action",    p:"$29.99", r:"4.7", i:"🏎️", c:"#3de0ff,#4b2bff"},
  {n:"Ashen Crown",     g:"rpg",      t:"Open-world RPG",     p:"$49.99", r:"4.9", i:"🗡️", c:"#ff9a3d,#a1123a"},
  {n:"Hexfront",        g:"strategy", t:"Turn-based tactics", p:"$24.99", r:"4.6", i:"♟️", c:"#41e08a,#0b5d6e"},
  {n:"Moss & Lantern",  g:"indie",    t:"Cozy adventure",     p:"$14.99", r:"4.8", i:"🏮", c:"#b8f26b,#1b7a5a"},
  {n:"Static Hunters",  g:"action",   t:"Co-op shooter",      p:"$39.99", r:"4.5", i:"🔫", c:"#ff3d81,#4a1b8f"},
  {n:"Tidecaller",      g:"rpg",      t:"Fantasy RPG",        p:"$44.99", r:"4.7", i:"🌊", c:"#5ab0ff,#1a2c8a"},
  {n:"Iron Meridian",   g:"strategy", t:"Real-time strategy", p:"$34.99", r:"4.4", i:"🛰️", c:"#ffd166,#7a3b12"},
  {n:"Paper Orbit",     g:"indie",    t:"Puzzle platformer",  p:"$9.99",  r:"4.9", i:"🪐", c:"#d58bff,#3b1f8f"}
];

const info = {
  "Neon Drift 2090":["Slide through rain-soaked megacities at 300 km/h in a racer built around drifting.",["120 tracks","Online 12-player races","Full controller support"]],
  "Ashen Crown":["Reclaim a fallen kingdom in a huge open world where every choice changes who rules.",["80+ hour story","Deep crafting","Mod support"]],
  "Hexfront":["Outsmart rivals on a hex map. Every turn counts and no match plays the same.",["Ranked ladder","Map editor","Hot-seat mode"]],
  "Moss & Lantern":["Light lanterns, grow gardens and help a sleepy forest wake up. No combat, no timers.",["Relaxing music","Cozy building","Short play sessions"]],
  "Static Hunters":["Squad up with three friends and take down glitching machines in fast co-op fights.",["4-player co-op","Weekly raids","Cross-save"]],
  "Tidecaller":["Command the sea and its storms while you uncover the secret of a drowned city.",["Branching story","Ship customizing","Ultrawide support"]],
  "Iron Meridian":["Build bases, scout the map and outplay rivals in large real-time orbital battles.",["Skirmish & campaign","Replay system","Custom lobbies"]],
  "Paper Orbit":["Fold the world, flip gravity and solve hand-drawn puzzles across tiny planets.",["90 levels","Level sharing","Plays on low-end PCs"]]
};
// build cards
const grid = document.getElementById("grid");
games.forEach((x, i) => {
  const el = document.createElement("article");
  el.className = "card";
  el.dataset.g = x.g; el.dataset.n = x.n; el.tabIndex = 0; el.setAttribute("role","button"); el.setAttribute("aria-label","View "+x.n);
  el.style.setProperty("--i", i);
  el.innerHTML = `
    <div class="art" data-icon="${x.i}" style="--g:linear-gradient(135deg,${x.c})"></div>
    <div class="body">
      <h3>${x.n}</h3>
      <p class="tag">${x.t}</p>
      <div class="row">
        <span class="price">${x.p}</span>
        <span class="rating">★ ${x.r}</span>
        <button class="wish" aria-label="Add ${x.n} to wishlist">♥</button>
      </div>
    </div>`;
  grid.appendChild(el);
});

// 3D tilt on cards (mouse only)
grid.addEventListener("mousemove", e => {
  const c = e.target.closest(".card"); if (!c) return;
  const b = c.getBoundingClientRect();
  c.style.setProperty("--ry", ((e.clientX - b.left) / b.width - .5) * 14 + "deg");
  c.style.setProperty("--rx", (.5 - (e.clientY - b.top) / b.height) * 14 + "deg");
});
grid.addEventListener("mouseout", e => {
  const c = e.target.closest(".card"); if (!c) return;
  c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg");
});

// state, toast, wishlist
const wish = new Set(), $ = id => document.getElementById(id);
const toast = $("toast"); let tt;
function say(t){ toast.textContent = t; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(()=>toast.classList.remove("show"), 2200); }
function toggleWish(name){
  const on = !wish.has(name);
  on ? wish.add(name) : wish.delete(name);
  document.querySelectorAll(".card").forEach(c => c.querySelector(".wish").classList.toggle("on", wish.has(c.dataset.n)));
  const cnt = $("count"); cnt.textContent = wish.size; cnt.classList.remove("bump"); cnt.offsetWidth; cnt.classList.add("bump");
  $("mWish").textContent = wish.has(name) ? "Remove from wishlist" : "Add to wishlist";
  say(on ? name + " added to wishlist" : name + " removed");
}

// filter + search + sort
const st = {f:"all", q:"", s:"def"}, price = c => parseFloat(games.find(g=>g.n===c.dataset.n).p.slice(1));
function apply(){
  const cards = [...document.querySelectorAll(".card")], rate = c => +games.find(g=>g.n===c.dataset.n).r;
  const order = {def:()=>0, rate:(a,b)=>rate(b)-rate(a), low:(a,b)=>price(a)-price(b), high:(a,b)=>price(b)-price(a)}[st.s];
  if (st.s !== "def") cards.sort(order); else cards.sort((a,b)=>games.findIndex(g=>g.n===a.dataset.n)-games.findIndex(g=>g.n===b.dataset.n));
  let n = 0;
  cards.forEach(c => {
    grid.appendChild(c);
    const g = games.find(x=>x.n===c.dataset.n);
    const show = (st.f==="all" || c.dataset.g===st.f) && (g.n+" "+g.t).toLowerCase().includes(st.q);
    c.classList.toggle("hide", !show);
    if (show){ c.style.animation="none"; c.offsetHeight; c.style.animation=""; c.style.setProperty("--i", n++); }
  });
  $("empty").hidden = n > 0;
}
document.querySelectorAll(".chip").forEach(chip => chip.addEventListener("click", () => {
  document.querySelector(".chip.active").classList.remove("active");
  chip.classList.add("active"); st.f = chip.dataset.f; apply();
}));
$("q").addEventListener("input", e => { st.q = e.target.value.trim().toLowerCase(); apply(); });
$("sort").addEventListener("change", e => { st.s = e.target.value; apply(); });

// details modal
const modal = $("modal"); let current = "";
function open(name){
  const g = games.find(x=>x.n===name), [d, feats] = info[name]; current = name;
  $("mTitle").textContent = g.n; $("mTag").textContent = g.t + "  ★ " + g.r; $("mDesc").textContent = d; $("mPrice").textContent = g.p;
  $("mList").innerHTML = feats.map(f=>"<li>"+f+"</li>").join("");
  const art = $("mArt"); art.style.setProperty("--g","linear-gradient(135deg,"+g.c+")"); art.dataset.icon = g.i;
  $("mWish").textContent = wish.has(name) ? "Remove from wishlist" : "Add to wishlist";
  modal.showModal();
}
grid.addEventListener("click", e => {
  const c = e.target.closest(".card"); if (!c) return;
  e.target.closest(".wish") ? toggleWish(c.dataset.n) : open(c.dataset.n);
});
grid.addEventListener("keydown", e => { if (e.key==="Enter" && e.target.classList.contains("card")) open(e.target.dataset.n); });
$("mWish").addEventListener("click", () => toggleWish(current));
$("mClose").addEventListener("click", () => modal.close());
modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });

// theme (remembered)
const root = document.documentElement;
function theme(t){ root.dataset.theme = t; $("theme").textContent = t==="light" ? "☀️" : "🌙"; try{localStorage.setItem("theme",t)}catch(e){} }
theme((()=>{ try{return localStorage.getItem("theme")}catch(e){} })() || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
$("theme").addEventListener("click", () => theme(root.dataset.theme==="light" ? "dark" : "light"));

// scroll progress + back to top
addEventListener("scroll", () => {
  const h = root.scrollHeight - innerHeight;
  $("progress").style.transform = "scaleX(" + (h ? scrollY/h : 0) + ")";
  $("top").classList.toggle("show", scrollY > 600);
}, {passive:true});
$("top").addEventListener("click", () => scrollTo({top:0, behavior:"smooth"}));

// mobile menu
const burger = document.querySelector(".burger"), links = document.querySelector(".links");
burger.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
links.addEventListener("click", e => { if (e.target.tagName === "A") { links.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });

// typing effect
const words = ["right now", "with a bang", "on your rig", "tonight"];
const typeEl = document.getElementById("type");
let w = 0, ch = 0, del = false;
(function tick() {
  const word = words[w];
  typeEl.textContent = word.slice(0, ch += del ? -1 : 1);
  let wait = del ? 45 : 90;
  if (!del && ch === word.length) { del = true; wait = 1400; }
  else if (del && ch === 0) { del = false; w = (w + 1) % words.length; wait = 400; }
  setTimeout(tick, wait);
})();

// scroll reveal + counters
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (!en.isIntersecting) return;
  en.target.classList.add("in");
  const num = en.target.querySelector("[data-count]");
  if (num) {
    const end = +num.dataset.count, t0 = performance.now();
    (function step(t) {
      const p = Math.min((t - t0) / 1600, 1);
      num.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  io.unobserve(en.target);
}), { threshold: .2 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// newsletter
document.getElementById("sub").addEventListener("click", () => {
  const m = document.getElementById("msg"), v = document.getElementById("email").value.trim();
  const ok = /^\S+@\S+\.\S+$/.test(v);
  m.className = "msg" + (ok ? "" : " err");
  m.textContent = ok ? "You're in! Look for the first email on Friday." : "Enter a valid email address.";
});