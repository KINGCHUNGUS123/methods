import './style.css';
import { TOPICS, LESSONS, CLASSES, FORMULAS } from './content.js';
import { mountSim, SIM_NAMES } from './sims.js';
import { CUSTOM } from './custom.js';
import INDEX from './exams.json';

// lazily-loaded question images (one file per year keeps each file small)
const LOADERS = {
  2020: () => import('./ex-2020.json'), 2021: () => import('./ex-2021.json'), 2022: () => import('./ex-2022.json'),
  2023: () => import('./ex-2023.json'), 2024: () => import('./ex-2024.json'), 2025: () => import('./ex-2025.json'),
};
const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];
const imgCache = {};
async function images(year) {
  if (!imgCache[year]) imgCache[year] = LOADERS[year]().then(m => m.default || m);
  return imgCache[year];
}

// ---------- data ----------
const TOPIC = Object.fromEntries(TOPICS.map(t => [t.id, t]));
const CUSTOM_Q = CUSTOM.map(c => ({ id: c.id, y: 0, p: 0, n: 0, t: c.type, m: c.marks || 1, topic: c.topic, cls: c.cls, time: c.time || c.marks * 1.6, a: c.answer, custom: c }));
const ALL = [...INDEX, ...CUSTOM_Q];
const BY_ID = Object.fromEntries(ALL.map(q => [q.id, q]));
const label = (q) => q.custom ? 'My question' : `${q.y} · Paper ${q.p} · Q${q.n}`;
const paperName = (p) => p === 1 ? 'Paper 1 (technology-free)' : 'Paper 2 (technology-active)';
const fmtTime = (m) => m < 1 ? `${Math.round(m * 60)} s` : `${(+m.toFixed(1))} min`;

// ---------- progress (localStorage) ----------
const KEY = 'mm-hub-v1';
let P;
try { P = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { P = {}; }
P.q ??= {}; P.flags ??= {}; P.notes ??= {}; P.exams ??= {};
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch {} };
const status = (id) => { const r = P.q[id]; if (!r) return 'new'; return r.s >= r.m ? 'right' : r.s > 0 ? 'part' : 'wrong'; };

// ---------- helpers ----------
const $ = (s, el = document) => el.querySelector(s);
const app = () => $('#app');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function math(el = app()) {
  if (window.renderMathInElement) {
    try { window.renderMathInElement(el, { delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }], throwOnError: false }); } catch {}
  }
}
window.addEventListener('load', () => math());
const badge = (q) => `<span class="tag t-${q.topic}" style="--c:${TOPIC[q.topic]?.color}">${esc(TOPIC[q.topic]?.short)}</span><span class="cls cls-${q.cls}" title="${CLASSES[q.cls].name}">${q.cls}</span>`;
const stIcon = (id) => ({ new: '<span class="st st-new" title="Not attempted">○</span>', right: '<span class="st st-right" title="Full marks">✓</span>', part: '<span class="st st-part" title="Part marks">◐</span>', wrong: '<span class="st st-wrong" title="No marks">✗</span>' }[status(id)]);
function topicStats(tid) {
  const qs = ALL.filter(q => q.topic === tid && !q.custom);
  let done = 0, s = 0, m = 0;
  qs.forEach(q => { const r = P.q[q.id]; if (r) { done++; s += r.s; m += r.m; } });
  return { total: qs.length, done, pct: m ? Math.round(100 * s / m) : null };
}

// ---------- router ----------
let timers = [];
function clearTimers() { timers.forEach(clearInterval); timers = []; }
const routes = [];
const route = (re, fn) => routes.push([re, fn]);
async function render() {
  clearTimers();
  const h = location.hash.slice(1) || '/';
  const [path, qs] = h.split('?');
  const params = Object.fromEntries(new URLSearchParams(qs || ''));
  for (const [re, fn] of routes) { const m = path.match(re); if (m) { await fn(m, params); break; } }
  document.querySelectorAll('nav a').forEach(a => a.classList.toggle('on', path.startsWith(a.getAttribute('href').slice(1)) && (a.getAttribute('href') !== '#/' || path === '/')));
  math();
}
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });

// ---------- HOME ----------
route(/^\/$/, () => {
  const done = Object.keys(P.q).filter(id => BY_ID[id] && !BY_ID[id].custom).length;
  let s = 0, m = 0; Object.values(P.q).forEach(r => { s += r.s; m += r.m; });
  const counts = { SF: 0, CF: 0, CU: 0 }; INDEX.forEach(q => counts[q.cls]++);
  app().innerHTML = `
  <section class="hero">
    <h1>Mathematical Methods Hub</h1>
    <p>Learn every Units 3 &amp; 4 topic, then practise all <b>${INDEX.length}</b> QCAA external exam questions from 2020–2025 — sorted by syllabus topic, labelled <b>simple familiar</b>, <b>complex familiar</b> or <b>complex unfamiliar</b>, with a suggested time for each and the official marking guide.</p>
    <div class="row">
      <a class="btn" href="#/learn">Start learning</a>
      <a class="btn ghost" href="#/bank">Question bank</a>
      <a class="btn ghost" href="#/papers">Sit a past paper</a>
      <button class="btn ghost" id="rnd">Random question</button>
    </div>
  </section>
  <section class="stats">
    <div class="stat"><b>${done}</b><span>of ${INDEX.length} questions attempted</span></div>
    <div class="stat"><b>${m ? Math.round(100 * s / m) + '%' : '–'}</b><span>marks gained</span></div>
    <div class="stat"><b>${counts.SF} / ${counts.CF} / ${counts.CU}</b><span>SF / CF / CU questions</span></div>
    <div class="stat"><b>12</b><span>full past papers</span></div>
  </section>
  <h2>Topics</h2>
  <div class="grid">${TOPICS.map(t => { const st = topicStats(t.id); return `
    <a class="card topic" href="#/learn/${t.id}" style="--c:${t.color}">
      <small>Unit ${t.unit} · Topic ${t.num}</small><h3>${esc(t.title)}</h3>
      <div class="bar"><i style="width:${st.total ? 100 * st.done / st.total : 0}%"></i></div>
      <small>${st.done}/${st.total} questions done${st.pct !== null ? ` · ${st.pct}% marks` : ''}</small>
    </a>`; }).join('')}</div>
  <h2>How questions are labelled</h2>
  <div class="grid three">${Object.entries(CLASSES).map(([k, c]) => `<div class="card"><h3><span class="cls cls-${k}">${k}</span> ${c.name}</h3><p>${c.desc}</p></div>`).join('')}</div>
  <p class="muted">Labels and times are a study guide: QCAA does not publish the classification of individual questions, so each label is a judgement against the syllabus definitions, balanced so each paper is close to the 60 / 20 / 20 split the syllabus specifies. <a href="#/about">How times are worked out</a>.</p>`;
  $('#rnd').onclick = () => { const q = INDEX[Math.floor(Math.random() * INDEX.length)]; location.hash = `#/q/${q.id}`; };
});

// ---------- LEARN ----------
route(/^\/learn$/, () => {
  app().innerHTML = `<h1>Learn</h1><p class="muted">The 2025 syllabus, Units 3 and 4. Each lesson has notes, worked examples, an interactive model and every past exam question on that topic.</p>
  ${[3, 4].map(u => `<h2>Unit ${u}: ${u === 3 ? 'Further calculus and introduction to statistics' : 'Further calculus, trigonometry and statistics'}</h2>
  <div class="grid">${TOPICS.filter(t => t.unit === u).map(t => { const st = topicStats(t.id); return `<a class="card topic" href="#/learn/${t.id}" style="--c:${t.color}"><small>Topic ${t.num}</small><h3>${esc(t.title)}</h3><div class="bar"><i style="width:${st.total ? 100 * st.done / st.total : 0}%"></i></div><small>${st.total} exam questions · sim: ${SIM_NAMES[LESSONS[t.id].sim]}</small></a>`; }).join('')}</div>`).join('')}`;
});

route(/^\/learn\/(\w+)$/, (m) => {
  const t = TOPIC[m[1]], L = LESSONS[m[1]]; if (!t) return notFound();
  const qs = ALL.filter(q => q.topic === t.id);
  const by = (c) => qs.filter(q => q.cls === c);
  const i = TOPICS.indexOf(t), prev = TOPICS[i - 1], next = TOPICS[i + 1];
  app().innerHTML = `
  <div class="crumbs"><a href="#/learn">Learn</a> › Unit ${t.unit} Topic ${t.num}</div>
  <h1 style="--c:${t.color}" class="ttl">${esc(t.title)}</h1>
  <div class="lesson">
    <div class="card"><h3>Syllabus subject matter</h3><ul>${L.syllabus.map(s => `<li>${s}</li>`).join('')}</ul></div>
    <div class="card notes">${L.notes}</div>
    <div class="card"><h3>Interactive: ${SIM_NAMES[L.sim]}</h3><div id="sim" class="sim"></div></div>
    <div class="card"><h3>Worked examples</h3>${L.examples.map((e, k) => `<div class="ex"><p><b>Example ${k + 1}.</b> ${e.q}</p><details><summary>Show solution</summary><div>${e.a}</div></details></div>`).join('')}</div>
    <div class="card"><h3>Exam tips</h3><ul>${L.tips.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>
    <div class="card"><h3>Past exam questions on this topic (${qs.length})</h3>
      <div class="row">${['SF', 'CF', 'CU'].map(c => `<a class="btn small ghost" href="#/bank?topic=${t.id}&cls=${c}"><span class="cls cls-${c}">${c}</span> ${by(c).length} ${CLASSES[c].name}</a>`).join('')}
      <a class="btn small" href="#/bank?topic=${t.id}">Practise all</a></div>
      ${qList(qs.sort((a, b) => ({ SF: 0, CF: 1, CU: 2 }[a.cls] - { SF: 0, CF: 1, CU: 2 }[b.cls]) || a.y - b.y), `topic=${t.id}`)}
    </div>
  </div>
  <div class="row between">${prev ? `<a class="btn ghost" href="#/learn/${prev.id}">← ${esc(prev.short)}</a>` : '<span></span>'}${next ? `<a class="btn ghost" href="#/learn/${next.id}">${esc(next.short)} →</a>` : ''}</div>`;
  mountSim($('#sim'), L.sim);
});

function qList(qs, ctx = '') {
  if (!qs.length) return '<p class="muted">No questions match these filters.</p>';
  return `<div class="qlist">${qs.map(q => `<a class="qrow" href="#/q/${q.id}${ctx ? '?' + ctx : ''}">
    ${stIcon(q.id)}<span class="qid">${label(q)}</span>${badge(q)}
    <span class="qt">${q.t === 'MC' ? 'Multiple choice' : `${q.m} marks`}</span><span class="tm">⏱ ${fmtTime(q.time)}</span>
    ${P.flags[q.id] ? '<span class="flag">⚑</span>' : ''}<span class="pv">${esc(q.pv || (q.custom ? q.custom.q.replace(/\\\(|\\\)|\\/g, '') : ''))}</span></a>`).join('')}</div>`;
}

// ---------- QUESTION BANK ----------
function filterQs(f) {
  return ALL.filter(q => (!f.topic || q.topic === f.topic) && (!f.cls || q.cls === f.cls) && (!f.type || q.t === f.type) &&
    (!f.paper || String(q.p) === f.paper) && (!f.year || String(q.y) === f.year) && (f.src === 'mine' ? q.custom : f.src === 'qcaa' ? !q.custom : true) &&
    (!f.st || (f.st === 'flag' ? P.flags[q.id] : f.st === 'todo' ? status(q.id) === 'new' : f.st === 'redo' ? ['wrong', 'part'].includes(status(q.id)) : true)));
}
function sortQs(qs, s) {
  const c = { SF: 0, CF: 1, CU: 2 };
  if (s === 'cls') return qs.sort((a, b) => c[a.cls] - c[b.cls] || a.y - b.y || a.p - b.p || a.n - b.n);
  if (s === 'time') return qs.sort((a, b) => a.time - b.time);
  if (s === 'topic') return qs.sort((a, b) => TOPICS.indexOf(TOPIC[a.topic]) - TOPICS.indexOf(TOPIC[b.topic]) || c[a.cls] - c[b.cls]);
  return qs.sort((a, b) => (b.y - a.y) || a.p - b.p || a.n - b.n);
}
route(/^\/bank$/, (m, f) => {
  const qs = sortQs(filterQs(f), f.sort);
  const ctx = new URLSearchParams(f).toString();
  const sel = (k, opts, allLabel) => `<label><span>${allLabel}</span><select data-k="${k}"><option value="">All</option>${opts.map(([v, l]) => `<option value="${v}" ${f[k] === String(v) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>`;
  const mins = qs.reduce((a, q) => a + q.time, 0), marks = qs.reduce((a, q) => a + q.m, 0);
  app().innerHTML = `<h1>Question bank</h1>
  <div class="filters card">
    ${sel('topic', TOPICS.map(t => [t.id, `U${t.unit}T${t.num} ${t.short}`]), 'Topic')}
    ${sel('cls', Object.entries(CLASSES).map(([k, c]) => [k, `${k} – ${c.name}`]), 'Difficulty')}
    ${sel('type', [['MC', 'Multiple choice'], ['SR', 'Short response']], 'Type')}
    ${sel('paper', [['1', 'Paper 1 – tech-free'], ['2', 'Paper 2 – tech-active']], 'Paper')}
    ${sel('year', YEARS.map(y => [y, y]), 'Year')}
    ${sel('st', [['todo', 'Not attempted'], ['redo', 'Lost marks'], ['flag', 'Flagged']], 'Status')}
    ${sel('src', [['qcaa', 'QCAA past papers'], ['mine', 'My questions']], 'Source')}
    <label><span>Sort</span><select data-k="sort"><option value="">Newest paper</option><option value="topic" ${f.sort === 'topic' ? 'selected' : ''}>Topic</option><option value="cls" ${f.sort === 'cls' ? 'selected' : ''}>Difficulty</option><option value="time" ${f.sort === 'time' ? 'selected' : ''}>Time</option></select></label>
  </div>
  <div class="row between"><p><b>${qs.length}</b> questions · ${marks} marks · about ${Math.round(mins)} min of work</p>
  ${qs.length ? `<a class="btn small" href="#/q/${qs[0].id}?${ctx}">Practise these in order →</a>` : ''}</div>
  ${qList(qs, ctx)}`;
  app().querySelectorAll('select[data-k]').forEach(s => s.onchange = () => {
    const nf = { ...f, [s.dataset.k]: s.value }; Object.keys(nf).forEach(k => !nf[k] && delete nf[k]);
    location.hash = '#/bank?' + new URLSearchParams(nf).toString();
  });
});

// ---------- SINGLE QUESTION ----------
function timerHTML(q) { return `<div class="timer" id="timer"><button class="btn small" id="tgo">▶ Start timer</button><div class="tbar"><i id="tfill"></i></div><span id="tlabel">Suggested: ${fmtTime(q.time)}</span></div>`; }
function startTimer(q) {
  let el = 0, run = false, iv;
  const lab = $('#tlabel'), fill = $('#tfill'), btn = $('#tgo');
  const tick = () => { const lim = q.time * 60; fill.style.width = Math.min(100, 100 * el / lim) + '%'; fill.classList.toggle('over', el > lim); lab.textContent = `${Math.floor(el / 60)}:${String(el % 60).padStart(2, '0')} / suggested ${fmtTime(q.time)}${el > lim ? ' — over time' : ''}`; };
  btn.onclick = () => { run = !run; btn.textContent = run ? '❚❚ Pause' : '▶ Resume'; if (run) { iv = setInterval(() => { el++; tick(); }, 1000); timers.push(iv); } else clearInterval(iv); };
  return () => el;
}
route(/^\/q\/([\w-]+)$/, async (m, f) => {
  const q = BY_ID[m[1]]; if (!q) return notFound();
  const list = sortQs(filterQs(f), f.sort); const idx = list.findIndex(x => x.id === q.id);
  const prev = list[idx - 1], next = list[idx + 1]; const ctx = new URLSearchParams(f).toString();
  const back = f.topic && Object.keys(f).length === 1 ? `#/learn/${f.topic}` : `#/bank${ctx ? '?' + ctx : ''}`;
  const rec = P.q[q.id];
  app().innerHTML = `
  <div class="crumbs"><a href="${back}">← Back to list</a>${idx >= 0 ? ` · ${idx + 1} of ${list.length}` : ''}</div>
  <div class="qhead"><h1>${label(q)}</h1><div>${badge(q)} <span class="qt">${q.t === 'MC' ? 'Multiple choice · 1 mark' : `Short response · ${q.m} marks`}</span>${q.p ? ` <span class="qt">${paperName(q.p)}</span>` : ''}</div></div>
  <p class="clsdesc"><b>${CLASSES[q.cls].name}:</b> ${CLASSES[q.cls].desc.split('.')[0]}.</p>
  ${timerHTML(q)}
  <div class="card qcard" id="qimg">${q.custom ? `<p>${q.custom.q}</p>` : '<p class="muted">Loading question…</p>'}</div>
  <div id="answer"></div>
  <div class="card"><label class="notes-l">My working / notes<textarea id="note" rows="3" placeholder="Type working, or notes to self — saved on this device">${esc(P.notes[q.id] || '')}</textarea></label></div>
  <div class="row between">
    <div class="row">${prev ? `<a class="btn ghost" href="#/q/${prev.id}?${ctx}">← Previous</a>` : ''}${next ? `<a class="btn ghost" href="#/q/${next.id}?${ctx}">Next →</a>` : ''}</div>
    <div class="row"><button class="btn ghost small" id="flag">${P.flags[q.id] ? '⚑ Flagged' : '⚐ Flag for review'}</button>${rec ? '<button class="btn ghost small" id="retry">↺ Try again</button>' : ''}<a class="btn ghost small" href="#/learn/${q.topic}">Review topic</a></div>
  </div>`;
  const elapsed = startTimer(q);
  $('#note').oninput = (e) => { P.notes[q.id] = e.target.value; save(); };
  $('#flag').onclick = () => { P.flags[q.id] ? delete P.flags[q.id] : P.flags[q.id] = 1; save(); render(); };
  if ($('#retry')) $('#retry').onclick = () => { delete P.q[q.id]; save(); render(); };
  let imgs = null;
  if (!q.custom) { imgs = (await images(q.y))[q.id]; $('#qimg').innerHTML = `<p class="zoomhint">Scroll sideways to read · tap image to enlarge</p><img src="${imgs.img}" alt="${label(q)}" class="qpic">`; }
  const A = $('#answer');
  if (q.t === 'MC') {
    const opts = q.custom ? q.custom.options : { A: 'A', B: 'B', C: 'C', D: 'D' };
    A.innerHTML = `<div class="card"><h3>Your answer</h3><div class="mc">${Object.entries(opts).map(([k, v]) => `<button class="opt" data-k="${k}">${q.custom ? `<b>${k}</b> ${v}` : `<b>${k}</b>`}</button>`).join('')}</div><div id="fb"></div></div>`;
    const show = (pick) => {
      A.querySelectorAll('.opt').forEach(b => { b.disabled = true; b.classList.toggle('right', b.dataset.k === q.a); b.classList.toggle('wrong', b.dataset.k === pick && pick !== q.a); });
      $('#fb').innerHTML = pick === q.a ? `<p class="good">✓ Correct — the answer is ${q.a}.</p>` : `<p class="bad">✗ You chose ${pick}. The correct answer is <b>${q.a}</b>.</p>`;
    };
    A.querySelectorAll('.opt').forEach(b => b.onclick = () => { const pick = b.dataset.k; P.q[q.id] = { s: pick === q.a ? 1 : 0, m: 1, mc: pick, t: elapsed(), at: Date.now() }; save(); show(pick); });
    if (rec?.mc) show(rec.mc);
  } else {
    A.innerHTML = `<div class="card"><p class="muted">Work it out on paper first (show full working), then compare with the marking guide.</p>
      <button class="btn" id="showg">Show marking guide &amp; sample response</button><div id="guide" hidden></div></div>`;
    const reveal = () => {
      $('#showg').hidden = true; const g = $('#guide'); g.hidden = false;
      g.innerHTML = `<h3>Marking guide</h3>${q.custom ? `<p>${q.custom.solution}</p>` : `<img src="${imgs.guide}" class="qpic" alt="Marking guide">`}
        <h3>Mark yourself</h3><div class="score">${[...Array(q.m + 1)].map((_, k) => `<button class="opt ${rec && rec.s === k ? 'right' : ''}" data-s="${k}">${k}</button>`).join('')}<span class="muted">/ ${q.m}</span></div><div id="fb"></div>`;
      g.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { P.q[q.id] = { s: +b.dataset.s, m: q.m, t: elapsed(), at: Date.now() }; save(); g.querySelectorAll('[data-s]').forEach(x => x.classList.toggle('right', x === b)); $('#fb').innerHTML = `<p class="good">Saved: ${b.dataset.s}/${q.m}.${next ? ` <a href="#/q/${next.id}?${ctx}">Next question →</a>` : ''}</p>`; });
      math(g);
    };
    $('#showg').onclick = reveal;
    if (rec) reveal();
  }
});

// ---------- PAST PAPERS ----------
route(/^\/papers$/, () => {
  app().innerHTML = `<h1>Past papers</h1><p class="muted">Each paper: 5 minutes perusal + 90 minutes working. Paper 1 is technology-free (no calculator), Paper 2 allows your approved calculator. Use the QCAA formula book.</p>
  <div class="papers">${YEARS.slice().reverse().map(y => `<div class="card"><h3>${y}</h3>${[1, 2].map(p => {
    const qs = INDEX.filter(q => q.y === y && q.p === p); const tot = qs.reduce((a, q) => a + q.m, 0); const best = P.exams[`${y}-${p}`];
    return `<div class="prow"><div><b>${paperName(p)}</b><br><small>${qs.length} questions · ${tot} marks${best ? ` · best ${best.s}/${best.m} (${Math.round(100 * best.s / best.m)}%)` : ''}</small></div>
      <div class="row"><a class="btn small" href="#/exam/${y}/${p}">Exam mode</a><a class="btn small ghost" href="#/bank?year=${y}&paper=${p}&sort=">Practice mode</a></div></div>`; }).join('')}</div>`).join('')}</div>`;
});

route(/^\/exam\/(\d{4})\/(\d)$/, async (m) => {
  const y = +m[1], p = +m[2]; const qs = INDEX.filter(q => q.y === y && q.p === p).sort((a, b) => a.n - b.n);
  const tot = qs.reduce((a, q) => a + q.m, 0);
  app().innerHTML = `<div class="crumbs"><a href="#/papers">← Past papers</a></div><h1>${y} ${paperName(p)}</h1>
  <div class="card"><p>${qs.length} questions, ${tot} marks. <b>Perusal 5 min</b> (read only) then <b>working 90 min</b>. Answer multiple choice here; write short responses on paper. At the end you mark short responses against the official guide.</p>
  <p class="muted">The suggested time for each question is shown so you can check your pace.</p><button class="btn" id="go">Start perusal</button></div>`;
  const data = await images(y);
  $('#go').onclick = () => {
    const ans = {}; let phase = 'perusal', left = 5 * 60;
    app().innerHTML = `<div class="examtop" id="et"><b id="ph">Perusal</b><span id="clock">5:00</span><button class="btn small ghost" id="skip">Skip perusal</button><button class="btn small" id="fin">Finish &amp; mark</button></div>
    <div class="exam">${qs.map(q => `<div class="card" id="e-${q.id}"><div class="qhead"><h3>Question ${q.n}</h3><div>${badge(q)} <span class="qt">${q.t === 'MC' ? '1 mark' : q.m + ' marks'}</span> <span class="tm">⏱ ${fmtTime(q.time)}</span></div></div>
      <img class="qpic" src="${data[q.id].img}" alt="Question ${q.n}">${q.t === 'MC' ? `<div class="mc">${'ABCD'.split('').map(k => `<button class="opt" data-q="${q.id}" data-k="${k}" disabled>${k}</button>`).join('')}</div>` : '<p class="muted">Write your response on paper.</p>'}</div>`).join('')}</div>`;
    const clock = $('#clock');
    const startWorking = () => { phase = 'working'; left = 90 * 60; $('#ph').textContent = 'Working time'; $('#skip').hidden = true; app().querySelectorAll('.opt').forEach(b => b.disabled = false); };
    const iv = setInterval(() => { left--; clock.textContent = `${Math.floor(Math.max(0, left) / 60)}:${String(Math.max(0, left) % 60).padStart(2, '0')}`; if (left <= 0) { if (phase === 'perusal') startWorking(); else { clearInterval(iv); finish(); } } }, 1000);
    timers.push(iv);
    $('#skip').onclick = startWorking;
    app().querySelectorAll('.opt').forEach(b => b.onclick = () => { ans[b.dataset.q] = b.dataset.k; app().querySelectorAll(`[data-q="${b.dataset.q}"]`).forEach(x => x.classList.toggle('sel', x === b)); });
    $('#fin').onclick = () => { if (confirmFinish()) { clearInterval(iv); finish(); } };
    const finish = () => markExam(y, p, qs, ans, data);
  };
});
function confirmFinish() { const b = $('#fin'); if (b.dataset.sure) return true; b.dataset.sure = 1; b.textContent = 'Tap again to finish'; setTimeout(() => { if (b.isConnected) { delete b.dataset.sure; b.textContent = 'Finish & mark'; } }, 3000); return false; }
function markExam(y, p, qs, ans, data) {
  const sr = {}; qs.filter(q => q.t === 'SR').forEach(q => sr[q.id] = null);
  const mcScore = qs.filter(q => q.t === 'MC').reduce((a, q) => a + (ans[q.id] === q.a ? 1 : 0), 0);
  window.scrollTo(0, 0);
  app().innerHTML = `<h1>Mark your ${y} paper ${p}</h1><div class="card"><p>Multiple choice: <b>${mcScore}/10</b>. ${qs.filter(q => q.t === 'MC').map(q => `Q${q.n}: ${ans[q.id] || '–'}${ans[q.id] === q.a ? ' ✓' : ` ✗ (${q.a})`}`).join(' · ')}</p>
  <p>Now mark each short response with the guide.</p><p id="total" class="big"></p><button class="btn" id="savex">Save result</button></div>
  ${qs.filter(q => q.t === 'SR').map(q => `<div class="card"><div class="qhead"><h3>Question ${q.n} (${q.m} marks)</h3><div>${badge(q)}</div></div>
    <details><summary>Show question</summary><img class="qpic" src="${data[q.id].img}"></details>
    <img class="qpic" src="${data[q.id].guide}" alt="Marking guide Q${q.n}">
    <div class="score">${[...Array(q.m + 1)].map((_, k) => `<button class="opt" data-q="${q.id}" data-s="${k}">${k}</button>`).join('')}<span class="muted">/ ${q.m}</span></div></div>`).join('')}`;
  const upd = () => { const s = mcScore + Object.values(sr).reduce((a, v) => a + (v || 0), 0), m = qs.reduce((a, q) => a + q.m, 0), left = Object.values(sr).filter(v => v === null).length; $('#total').innerHTML = `Total: <b>${s}/${m}</b> (${Math.round(100 * s / m)}%)${left ? ` — ${left} short responses still to mark` : ''}`; return { s, m }; };
  upd();
  app().querySelectorAll('[data-s]').forEach(b => b.onclick = () => { sr[b.dataset.q] = +b.dataset.s; app().querySelectorAll(`[data-q="${b.dataset.q}"]`).forEach(x => x.classList.toggle('right', x === b)); upd(); });
  $('#savex').onclick = () => {
    const r = upd(); const k = `${y}-${p}`; if (!P.exams[k] || P.exams[k].s < r.s) P.exams[k] = { ...r, at: Date.now() };
    qs.forEach(q => { if (q.t === 'MC' && ans[q.id]) P.q[q.id] = { s: ans[q.id] === q.a ? 1 : 0, m: 1, mc: ans[q.id], at: Date.now() }; if (q.t === 'SR' && sr[q.id] !== null) P.q[q.id] = { s: sr[q.id], m: q.m, at: Date.now() }; });
    save(); $('#savex').textContent = 'Saved ✓';
  };
}

// ---------- FORMULAS / ABOUT / PROGRESS ----------
route(/^\/formulas$/, () => { app().innerHTML = `<h1>Formula summary</h1><div class="card notes">${FORMULAS}</div>`; });
route(/^\/about$/, () => {
  app().innerHTML = `<h1>Difficulty labels &amp; suggested times</h1>
  <div class="card notes"><h3>The three degrees of difficulty (from the syllabus)</h3>${Object.entries(CLASSES).map(([k, c]) => `<p><span class="cls cls-${k}">${k}</span> <b>${c.name}.</b> ${c.desc}</p>`).join('')}
  <h3>How each question was labelled</h3><p>QCAA does not publish which questions are SF, CF or CU, so every question here has been judged against those definitions: a routine one-step procedure is SF; a question joining several familiar ideas (e.g. a log equation that becomes a quadratic, or normal probabilities used inside a binomial) is CF; and a question where you must decide the method yourself, develop a model, justify or evaluate reasonableness — usually the last two or three questions of a paper — is CU. Labels are balanced so each paper comes out close to the syllabus's 60% / 20% / 20% split of marks. Use them as a guide, not a rule.</p>
  <h3>Suggested times</h3><p>Each paper gives 90 minutes of working time. Each question's share of the 90 minutes is based on its marks, weighted by difficulty: a CF mark gets about 1.35× and a CU mark about 1.75× the time of an SF mark, because those marks take more thinking. So the suggested times for a paper add up to about 90 minutes. If you finish SF questions faster than suggested, bank that time for the CU questions at the end.</p></div>`;
});
route(/^\/progress$/, () => {
  const rows = TOPICS.map(t => { const r = { SF: [0, 0, 0], CF: [0, 0, 0], CU: [0, 0, 0] }; INDEX.filter(q => q.topic === t.id).forEach(q => { r[q.cls][2]++; const x = P.q[q.id]; if (x) { r[q.cls][0] += x.s; r[q.cls][1] += x.m; } }); return [t, r]; });
  const cell = ([s, m, n]) => m ? `<td class="${s / m >= 0.75 ? 'good' : s / m >= 0.5 ? 'part' : 'bad'}">${Math.round(100 * s / m)}%</td>` : `<td class="muted">– <small>(${n})</small></td>`;
  app().innerHTML = `<h1>My progress</h1><div class="card"><table class="tbl wide"><tr><th>Topic</th><th>SF</th><th>CF</th><th>CU</th><th>Done</th><th></th></tr>
  ${rows.map(([t, r]) => { const st = topicStats(t.id); return `<tr><td><a href="#/learn/${t.id}">U${t.unit}T${t.num} ${esc(t.short)}</a></td>${cell(r.SF)}${cell(r.CF)}${cell(r.CU)}<td>${st.done}/${st.total}</td><td><button class="btn small ghost" data-reset="${t.id}">Reset</button></td></tr>`; }).join('')}</table>
  <p class="muted">Percent = marks gained out of marks attempted. Numbers in brackets = questions available.</p></div>
  <div class="card"><h3>Past papers</h3>${Object.keys(P.exams).length ? Object.entries(P.exams).map(([k, v]) => `<p>${k.replace('-', ' Paper ')}: <b>${v.s}/${v.m}</b> (${Math.round(100 * v.s / v.m)}%)</p>`).join('') : '<p class="muted">No papers sat yet.</p>'}</div>
  <div class="card"><h3>Reset</h3><div class="row"><button class="btn ghost" id="rflags">Clear flags</button><button class="btn ghost" id="rexams">Clear paper scores</button><button class="btn danger" id="rall">Reset everything</button></div>
  <h3>Back up / move to another device</h3><div class="row"><button class="btn ghost" id="exp">Copy progress code</button><button class="btn ghost" id="imp">Paste progress code</button></div><textarea id="code" rows="3" placeholder="Progress code appears here / paste one here then press Paste"></textarea></div>`;
  app().querySelectorAll('[data-reset]').forEach(b => b.onclick = () => { INDEX.filter(q => q.topic === b.dataset.reset).forEach(q => delete P.q[q.id]); save(); render(); });
  $('#rflags').onclick = () => { P.flags = {}; save(); render(); };
  $('#rexams').onclick = () => { P.exams = {}; save(); render(); };
  $('#rall').onclick = (e) => { if (!e.target.dataset.sure) { e.target.dataset.sure = 1; e.target.textContent = 'Tap again to erase all progress'; return; } P = { q: {}, flags: {}, notes: {}, exams: {} }; save(); render(); };
  $('#exp').onclick = () => { const c = btoa(unescape(encodeURIComponent(JSON.stringify(P)))); $('#code').value = c; navigator.clipboard?.writeText(c).catch(() => {}); };
  $('#imp').onclick = () => { try { P = JSON.parse(decodeURIComponent(escape(atob($('#code').value.trim())))); P.q ??= {}; P.flags ??= {}; P.notes ??= {}; P.exams ??= {}; save(); render(); } catch { $('#code').value = 'That code could not be read.'; } };
});
document.addEventListener('load', (e) => { const t = e.target; if (t.classList?.contains('qpic')) t.style.setProperty('--nw', t.naturalWidth); }, true);
// tap an exam image to enlarge it
document.addEventListener('click', (e) => { if (e.target.classList?.contains('qpic')) e.target.classList.toggle('zoom'); });
function notFound() { app().innerHTML = '<h1>Not found</h1><p><a href="#/">Go home</a></p>'; }

// ---------- theme ----------
const th = $('#theme');
const applyTheme = (t) => { document.documentElement.dataset.theme = t; try { localStorage.setItem('mm-theme', t); } catch {} th.textContent = t === 'dark' ? '☀' : '☾'; };
let saved; try { saved = localStorage.getItem('mm-theme'); } catch {}
applyTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
th.onclick = () => { applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); render(); };

render();
