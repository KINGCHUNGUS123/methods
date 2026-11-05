// Interactive canvas simulations for each topic
const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || '#888';

function setupCanvas(cv, h = 300) {
  const dpr = window.devicePixelRatio || 1;
  const w = cv.parentElement.clientWidth || 600;
  cv.width = w * dpr; cv.height = h * dpr;
  cv.style.width = w + 'px'; cv.style.height = h + 'px';
  const ctx = cv.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

function axes(ctx, w, h, xr, yr, opts = {}) {
  const pad = 34;
  const X = (x) => pad + (x - xr[0]) / (xr[1] - xr[0]) * (w - pad - 10);
  const Y = (y) => h - pad - (y - yr[0]) / (yr[1] - yr[0]) * (h - pad - 10);
  ctx.clearRect(0, 0, w, h);
  ctx.font = '11px system-ui, sans-serif';
  ctx.strokeStyle = css('--grid'); ctx.lineWidth = 1; ctx.fillStyle = css('--muted');
  const step = (r) => { const s = (r[1] - r[0]) / 8; const p = Math.pow(10, Math.floor(Math.log10(s))); return [1, 2, 5, 10].map(m => m * p).find(m => m >= s); };
  const sx = opts.xstep || step(xr), sy = opts.ystep || step(yr);
  for (let x = Math.ceil(xr[0] / sx) * sx; x <= xr[1] + 1e-9; x += sx) {
    ctx.beginPath(); ctx.moveTo(X(x), Y(yr[0])); ctx.lineTo(X(x), Y(yr[1])); ctx.stroke();
    ctx.fillText(opts.xfmt ? opts.xfmt(x) : +x.toFixed(4), X(x) - 6, h - pad + 14);
  }
  for (let y = Math.ceil(yr[0] / sy) * sy; y <= yr[1] + 1e-9; y += sy) {
    ctx.beginPath(); ctx.moveTo(X(xr[0]), Y(y)); ctx.lineTo(X(xr[1]), Y(y)); ctx.stroke();
    ctx.fillText(+y.toFixed(4), 2, Y(y) + 4);
  }
  ctx.strokeStyle = css('--text'); ctx.lineWidth = 1.3;
  if (yr[0] <= 0 && yr[1] >= 0) { ctx.beginPath(); ctx.moveTo(X(xr[0]), Y(0)); ctx.lineTo(X(xr[1]), Y(0)); ctx.stroke(); }
  if (xr[0] <= 0 && xr[1] >= 0) { ctx.beginPath(); ctx.moveTo(X(0), Y(yr[0])); ctx.lineTo(X(0), Y(yr[1])); ctx.stroke(); }
  return { X, Y };
}

function plot(ctx, f, xr, X, Y, color, width = 2.2, yr) {
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath();
  let pen = false; const N = 500;
  for (let i = 0; i <= N; i++) {
    const x = xr[0] + (xr[1] - xr[0]) * i / N; const y = f(x);
    if (!isFinite(y) || (yr && (y < yr[0] - 50 || y > yr[1] + 50))) { pen = false; continue; }
    pen ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)); pen = true;
  }
  ctx.stroke();
}

function controls(root, defs, onChange) {
  const box = document.createElement('div'); box.className = 'sim-controls';
  const vals = {};
  defs.forEach(d => {
    const lab = document.createElement('label');
    if (d.options) {
      lab.innerHTML = `<span>${d.label}</span>`;
      const sel = document.createElement('select');
      d.options.forEach((o, i) => { const op = document.createElement('option'); op.value = i; op.textContent = o; sel.appendChild(op); });
      vals[d.key] = 0;
      sel.oninput = () => { vals[d.key] = +sel.value; onChange(vals); };
      lab.appendChild(sel);
    } else {
      vals[d.key] = d.value;
      lab.innerHTML = `<span>${d.label}: <b>${d.value}</b></span>`;
      const r = document.createElement('input'); r.type = 'range'; r.min = d.min; r.max = d.max; r.step = d.step; r.value = d.value;
      r.oninput = () => { vals[d.key] = +r.value; lab.querySelector('b').textContent = (+r.value).toString(); onChange(vals); };
      lab.appendChild(r);
    }
    box.appendChild(lab);
  });
  root.appendChild(box);
  return vals;
}

function erf(x) { const t = 1 / (1 + 0.3275911 * Math.abs(x)); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; }
const Phi = (z) => 0.5 * (1 + erf(z / Math.SQRT2));
function invPhi(p) { let lo = -8, hi = 8; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; Phi(m) < p ? lo = m : hi = m; } return (lo + hi) / 2; }
function randn() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function choose(n, r) { let c = 1; for (let i = 1; i <= r; i++) c = c * (n - r + i) / i; return c; }
const fmt = (v, d = 4) => (+v.toFixed(d)).toString();

const SIMS = {
  tangent(root) {
    const fs = [
      { n: 'e^x', f: Math.exp, d: Math.exp, xr: [-3, 3], yr: [-2, 10], ds: "f'(x) = e^x" },
      { n: 'ln x', f: Math.log, d: x => 1 / x, xr: [0.01, 6], yr: [-4, 3], ds: "f'(x) = 1/x" },
      { n: 'sin x', f: Math.sin, d: Math.cos, xr: [-6.3, 6.3], yr: [-2, 2], ds: "f'(x) = cos x" },
      { n: 'x·e^(−x)', f: x => x * Math.exp(-x), d: x => Math.exp(-x) * (1 - x), xr: [-1, 6], yr: [-1.5, 1], ds: "f'(x) = e^(−x)(1 − x)" },
      { n: 'x²·ln x', f: x => x * x * Math.log(x), d: x => 2 * x * Math.log(x) + x, xr: [0.01, 2.5], yr: [-1, 4], ds: "f'(x) = 2x ln x + x" },
      { n: '2^x (limit idea)', f: x => Math.pow(2, x), d: x => Math.LN2 * Math.pow(2, x), xr: [-3, 3], yr: [-1, 8], ds: "f'(x) = ln2 · 2^x ≈ 0.693·2^x" },
    ];
    const cv = document.createElement('canvas'); root.appendChild(cv);
    const out = document.createElement('div'); out.className = 'sim-out'; root.appendChild(out);
    const v = controls(root, [{ key: 'fn', label: 'Function', options: fs.map(f => 'f(x) = ' + f.n) }, { key: 'x0', label: 'Point x₀ (as % of window)', min: 0, max: 100, step: 1, value: 50 }, { key: 'show', label: "Show f′(x) graph", options: ['yes', 'no'] }], draw);
    function draw() {
      const F = fs[v.fn]; const { ctx, w, h } = setupCanvas(cv);
      const { X, Y } = axes(ctx, w, h, F.xr, F.yr);
      if (v.show === 0) plot(ctx, F.d, F.xr, X, Y, css('--accent2'), 1.6, F.yr);
      plot(ctx, F.f, F.xr, X, Y, css('--accent'), 2.4, F.yr);
      const x0 = F.xr[0] + (F.xr[1] - F.xr[0]) * v.x0 / 100, y0 = F.f(x0), m = F.d(x0);
      plot(ctx, x => y0 + m * (x - x0), F.xr, X, Y, css('--warn'), 1.5, F.yr);
      ctx.fillStyle = css('--warn'); ctx.beginPath(); ctx.arc(X(x0), Y(y0), 5, 0, 7); ctx.fill();
      out.innerHTML = `x₀ = ${fmt(x0, 3)}, f(x₀) = ${fmt(y0, 3)}, gradient of tangent f′(x₀) = <b>${fmt(m, 3)}</b> &nbsp; <span class="muted">(${F.ds}; orange line = tangent${v.show === 0 ? ', teal = f′(x)' : ''})</span>`;
    }
    draw(); return draw;
  },
  concavity(root) {
    const cv = document.createElement('canvas'); root.appendChild(cv);
    const out = document.createElement('div'); out.className = 'sim-out'; root.appendChild(out);
    const v = controls(root, [{ key: 'a', label: 'a (x³ coeff)', min: -2, max: 2, step: 0.1, value: 1 }, { key: 'b', label: 'b (x²)', min: -6, max: 6, step: 0.5, value: -3 }, { key: 'c', label: 'c (x)', min: -6, max: 6, step: 0.5, value: 0 }, { key: 'x0', label: 'Probe x', min: -4, max: 4, step: 0.1, value: 1 }], draw);
    function draw() {
      const { a, b, c, x0 } = v; const f = x => a * x ** 3 + b * x * x + c * x, d1 = x => 3 * a * x * x + 2 * b * x + c, d2 = x => 6 * a * x + 2 * b;
      const { ctx, w, h } = setupCanvas(cv); const xr = [-4, 4], yr = [-10, 10];
      const { X, Y } = axes(ctx, w, h, xr, yr);
      plot(ctx, d2, xr, X, Y, css('--muted'), 1.2, yr); plot(ctx, d1, xr, X, Y, css('--accent2'), 1.5, yr); plot(ctx, f, xr, X, Y, css('--accent'), 2.6, yr);
      const pts = []; const D = 4 * b * b - 12 * a * c;
      if (Math.abs(a) > 1e-9 && D >= 0) [(-2 * b + Math.sqrt(D)) / (6 * a), (-2 * b - Math.sqrt(D)) / (6 * a)].forEach(x => pts.push([x, d2(x) > 0 ? 'local min' : d2(x) < 0 ? 'local max' : 'stationary inflection']));
      const xi = Math.abs(a) > 1e-9 ? -b / (3 * a) : null;
      ctx.font = '12px system-ui';
      pts.forEach(([x, t]) => { if (x > -4 && x < 4) { ctx.fillStyle = css('--good'); ctx.beginPath(); ctx.arc(X(x), Y(f(x)), 5, 0, 7); ctx.fill(); ctx.fillText(t, X(x) + 6, Y(f(x)) - 6); } });
      if (xi !== null && xi > -4 && xi < 4) { ctx.fillStyle = css('--warn'); ctx.beginPath(); ctx.arc(X(xi), Y(f(xi)), 5, 0, 7); ctx.fill(); ctx.fillText('inflection', X(xi) + 6, Y(f(xi)) + 14); }
      ctx.strokeStyle = css('--warn'); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(X(x0), Y(yr[0])); ctx.lineTo(X(x0), Y(yr[1])); ctx.stroke(); ctx.setLineDash([]);
      const s1 = d1(x0), s2 = d2(x0);
      out.innerHTML = `f(x) = ${a}x³ + ${b}x² + ${c}x. At x = ${x0}: f′ = ${fmt(s1, 2)} (<b>${s1 > 0 ? 'increasing' : s1 < 0 ? 'decreasing' : 'stationary'}</b>), f″ = ${fmt(s2, 2)} (<b>${s2 > 0 ? 'concave up' : s2 < 0 ? 'concave down' : 'possible inflection'}</b>). <span class="muted">Blue = f, teal = f′, grey = f″.</span>`;
    }
    draw(); return draw;
  },
  motion(root) {
    const cv = document.createElement('canvas'); root.appendChild(cv);
    const out = document.createElement('div'); out.className = 'sim-out'; root.appendChild(out);
    const models = [
      { n: 'a(t) = π cos(πt), v(0)=0.5', a: t => Math.PI * Math.cos(Math.PI * t), v: t => Math.sin(Math.PI * t) + 0.5, x: t => -Math.cos(Math.PI * t) / Math.PI + 0.5 * t + 1 / Math.PI, T: 4 },
      { n: 'v(t) = 2t − 6 (x(0)=0)', a: t => 2, v: t => 2 * t - 6, x: t => t * t - 6 * t, T: 8 },
      { n: 'v(t) = 40(e^(−t) − e^(−2t))', a: t => 40 * (-Math.exp(-t) + 2 * Math.exp(-2 * t)), v: t => 40 * (Math.exp(-t) - Math.exp(-2 * t)), x: t => 40 * (-Math.exp(-t) + 0.5 * Math.exp(-2 * t) + 0.5), T: 6 },
    ];
    const v = controls(root, [{ key: 'm', label: 'Motion', options: models.map(m => m.n) }, { key: 't', label: 'Time t (s)', min: 0, max: 100, step: 1, value: 30 }], draw);
    function draw() {
      const M = models[v.m]; const t0 = M.T * v.t / 100;
      const { ctx, w, h } = setupCanvas(cv);
      let lo = 0, hi = 0; for (let i = 0; i <= 200; i++) { const t = M.T * i / 200; [M.a(t), M.v(t), M.x(t)].forEach(y => { lo = Math.min(lo, y); hi = Math.max(hi, y); }); }
      const yr = [Math.max(lo, -20) - 1, Math.min(hi, 20) + 1];
      const { X, Y } = axes(ctx, w, h, [0, M.T], yr);
      plot(ctx, M.a, [0, M.T], X, Y, css('--muted'), 1.4, yr); plot(ctx, M.v, [0, M.T], X, Y, css('--accent2'), 2, yr); plot(ctx, M.x, [0, M.T], X, Y, css('--accent'), 2.6, yr);
      ctx.strokeStyle = css('--warn'); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(X(t0), Y(yr[0])); ctx.lineTo(X(t0), Y(yr[1])); ctx.stroke(); ctx.setLineDash([]);
      out.innerHTML = `t = ${fmt(t0, 2)} s: displacement x = <b>${fmt(M.x(t0), 3)}</b> m, velocity v = <b>${fmt(M.v(t0), 3)}</b> m/s, acceleration a = <b>${fmt(M.a(t0), 3)}</b> m/s². <span class="muted">Blue = x(t) = ∫v dt, teal = v(t) = ∫a dt, grey = a(t).</span>`;
    }
    draw(); return draw;
  },
  riemann(root) {
    const fs = [
      { n: 'x(4 − x) on [0,4]', f: x => x * (4 - x), a: 0, b: 4, F: x => 2 * x * x - x ** 3 / 3 },
      { n: 'e^x on [0,2]', f: Math.exp, a: 0, b: 2, F: Math.exp },
      { n: '√(2x+1) on [0,4]', f: x => Math.sqrt(2 * x + 1), a: 0, b: 4, F: x => Math.pow(2 * x + 1, 1.5) / 3 },
      { n: 'sin x on [0,π]', f: Math.sin, a: 0, b: Math.PI, F: x => -Math.cos(x) },
      { n: 'x² − x − 6 on [1,5] (signed)', f: x => x * x - x - 6, a: 1, b: 5, F: x => x ** 3 / 3 - x * x / 2 - 6 * x },
    ];
    const cv = document.createElement('canvas'); root.appendChild(cv);
    const out = document.createElement('div'); out.className = 'sim-out'; root.appendChild(out);
    const v = controls(root, [{ key: 'fn', label: 'Function', options: fs.map(f => f.n) }, { key: 'meth', label: 'Method', options: ['Trapezoidal rule', 'Left rectangles', 'Right rectangles'] }, { key: 'n', label: 'Strips n', min: 1, max: 40, step: 1, value: 4 }], draw);
    function draw() {
      const F = fs[v.fn]; const { a, b } = F; const n = v.n, wd = (b - a) / n;
      let lo = 0, hi = 0; for (let i = 0; i <= 100; i++) { const y = F.f(a + (b - a) * i / 100); lo = Math.min(lo, y); hi = Math.max(hi, y); }
      const { ctx, w, h } = setupCanvas(cv); const xr = [a - (b - a) * 0.05, b + (b - a) * 0.05], yr = [lo - 0.5, hi + 0.5];
      const { X, Y } = axes(ctx, w, h, xr, yr);
      let S = 0; ctx.fillStyle = css('--accent') + '33'; ctx.strokeStyle = css('--accent');
      for (let i = 0; i < n; i++) {
        const x1 = a + i * wd, x2 = x1 + wd; ctx.beginPath();
        if (v.meth === 0) { S += wd * (F.f(x1) + F.f(x2)) / 2; ctx.moveTo(X(x1), Y(0)); ctx.lineTo(X(x1), Y(F.f(x1))); ctx.lineTo(X(x2), Y(F.f(x2))); ctx.lineTo(X(x2), Y(0)); }
        else { const y = F.f(v.meth === 1 ? x1 : x2); S += wd * y; ctx.rect(X(x1), Y(Math.max(0, y)), X(x2) - X(x1), Math.abs(Y(y) - Y(0))); }
        ctx.closePath(); ctx.fill(); ctx.lineWidth = 1; ctx.stroke();
      }
      plot(ctx, F.f, [a, b], X, Y, css('--accent2'), 2.4, yr);
      const ex = F.F(b) - F.F(a);
      out.innerHTML = `Strip width w = ${fmt(wd, 4)}. Approximation = <b>${fmt(S, 4)}</b>; exact ∫ = <b>${fmt(ex, 4)}</b>; error = ${fmt(S - ex, 4)}. <span class="muted">Increase n to see the sum approach the definite integral.</span>`;
    }
    draw(); return draw;
  },
  binomial(root) {
    const cv = document.createElement('canvas'); root.appendChild(cv);
    const out = document.createElement('div'); out.className = 'sim-out'; root.appendChild(out);
    const v = controls(root, [{ key: 'n', label: 'n (trials)', min: 1, max: 40, step: 1, value: 10 }, { key: 'p', label: 'p (success)', min: 0.01, max: 0.99, step: 0.01, value: 0.3 }, { key: 'k', label: 'Highlight P(X ≤ k), k', min: 0, max: 40, step: 1, value: 3 }], draw);
    function draw() {
      const { n, p } = v; const k = Math.min(v.k, n);
      const P = [...Array(n + 1)].map((_, r) => choose(n, r) * p ** r * (1 - p) ** (n - r));
      const mx = Math.max(...P);
      const { ctx, w, h } = setupCanvas(cv);
      const { X, Y } = axes(ctx, w, h, [-0.7, n + 0.7], [0, mx * 1.15], { xstep: n > 20 ? 5 : n > 10 ? 2 : 1 });
      let cum = 0;
      P.forEach((pr, r) => { if (r <= k) cum += pr; ctx.fillStyle = r <= k ? css('--accent') : css('--grid'); const bw = Math.max(2, (X(1) - X(0)) * 0.7); ctx.fillRect(X(r) - bw / 2, Y(pr), bw, Y(0) - Y(pr)); });
      out.innerHTML = `X ~ Bin(${n}, ${p}). Mean np = <b>${fmt(n * p, 3)}</b>, variance np(1−p) = <b>${fmt(n * p * (1 - p), 4)}</b>, SD = ${fmt(Math.sqrt(n * p * (1 - p)), 4)}.<br>P(X = ${k}) = <b>${fmt(P[k], 5)}</b>, P(X ≤ ${k}) = <b>${fmt(cum, 5)}</b>, P(X ≥ ${k}) = <b>${fmt(1 - cum + P[k], 5)}</b>`;
    }
    draw(); return draw;
  },
  normal(root) {
    const cv = document.createElement('canvas'); root.appendChild(cv);
    const out = document.createElement('div'); out.className = 'sim-out'; root.appendChild(out);
    const v = controls(root, [{ key: 'mu', label: 'Mean μ', min: 0, max: 200, step: 1, value: 165 }, { key: 'sd', label: 'SD σ', min: 1, max: 40, step: 0.5, value: 15 }, { key: 'a', label: 'Lower bound a (z)', min: -4, max: 4, step: 0.05, value: -1 }, { key: 'b', label: 'Upper bound b (z)', min: -4, max: 4, step: 0.05, value: 1 }], draw);
    function draw() {
      const { mu, sd } = v; const za = Math.min(v.a, v.b), zb = Math.max(v.a, v.b);
      const pdf = x => Math.exp(-0.5 * ((x - mu) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));
      const xr = [mu - 4 * sd, mu + 4 * sd];
      const { ctx, w, h } = setupCanvas(cv);
      const { X, Y } = axes(ctx, w, h, xr, [0, pdf(mu) * 1.15], { ystep: pdf(mu) / 2 });
      ctx.fillStyle = css('--accent') + '55'; ctx.beginPath(); ctx.moveTo(X(mu + za * sd), Y(0));
      for (let i = 0; i <= 120; i++) { const x = mu + (za + (zb - za) * i / 120) * sd; ctx.lineTo(X(x), Y(pdf(x))); }
      ctx.lineTo(X(mu + zb * sd), Y(0)); ctx.fill();
      plot(ctx, pdf, xr, X, Y, css('--accent'), 2.4);
      out.innerHTML = `X ~ N(${mu}, ${sd}²). P(${fmt(mu + za * sd, 2)} < X < ${fmt(mu + zb * sd, 2)}) = P(${za} < Z < ${zb}) = <b>${fmt(Phi(zb) - Phi(za), 4)}</b>. &nbsp; z = (x − μ)/σ.<br><span class="muted">Try z = ±1, ±2, ±3 to see the 68–95–99.7 rule. The 98th percentile is x = ${fmt(mu + invPhi(0.98) * sd, 2)}.</span>`;
    }
    draw(); return draw;
  },
  sampling(root) {
    const cv = document.createElement('canvas'); root.appendChild(cv);
    const out = document.createElement('div'); out.className = 'sim-out'; root.appendChild(out);
    const v = controls(root, [{ key: 'p', label: 'Population proportion p', min: 0.05, max: 0.95, step: 0.05, value: 0.6 }, { key: 'n', label: 'Sample size n', min: 5, max: 500, step: 5, value: 10 }, { key: 'k', label: 'Number of samples', min: 10, max: 2000, step: 10, value: 500 }], draw);
    function draw() {
      const { p, n, k } = v; const bins = new Array(41).fill(0); let s = 0, s2 = 0;
      for (let j = 0; j < k; j++) { let c = 0; for (let i = 0; i < n; i++) if (Math.random() < p) c++; const ph = c / n; s += ph; s2 += ph * ph; bins[Math.round(ph * 40)]++; }
      const mx = Math.max(...bins); const { ctx, w, h } = setupCanvas(cv);
      const { X, Y } = axes(ctx, w, h, [0, 1], [0, mx * 1.1], { xstep: 0.1 });
      ctx.fillStyle = css('--accent');
      bins.forEach((b, i) => { const x = i / 40; ctx.fillRect(X(x - 0.011), Y(b), X(0.022) - X(0), Y(0) - Y(b)); });
      const m = s / k, sdv = Math.sqrt(Math.max(0, s2 / k - m * m));
      ctx.strokeStyle = css('--warn'); ctx.beginPath(); ctx.moveTo(X(p), Y(0)); ctx.lineTo(X(p), Y(mx * 1.1)); ctx.stroke();
      out.innerHTML = `${k} samples of size ${n}. Mean of p̂ = <b>${fmt(m, 4)}</b> (theory p = ${p}); SD of p̂ = <b>${fmt(sdv, 4)}</b> (theory √(p(1−p)/n) = ${fmt(Math.sqrt(p * (1 - p) / n), 4)}). <span class="muted">Bigger n → narrower and more bell-shaped.</span>`;
    }
    draw(); return draw;
  },
  ci(root) {
    const cv = document.createElement('canvas'); root.appendChild(cv);
    const out = document.createElement('div'); out.className = 'sim-out'; root.appendChild(out);
    const v = controls(root, [{ key: 'p', label: 'True p', min: 0.05, max: 0.95, step: 0.05, value: 0.4 }, { key: 'n', label: 'Sample size n', min: 20, max: 1000, step: 10, value: 100 }, { key: 'cl', label: 'Confidence', options: ['95% (z = 1.96)', '90% (z = 1.645)', '99% (z = 2.576)'] }, { key: 'go', label: 'Resample (move me)', min: 0, max: 50, step: 1, value: 0 }], draw);
    function draw() {
      const { p, n } = v; const z = [1.96, 1.645, 2.576][v.cl]; const K = 60;
      const { ctx, w, h } = setupCanvas(cv, 340); const { X, Y } = axes(ctx, w, h, [0, 1], [0, K + 1], { xstep: 0.1, ystep: 10 });
      let hit = 0, Esum = 0;
      for (let j = 1; j <= K; j++) {
        let c = 0; for (let i = 0; i < n; i++) if (Math.random() < p) c++; const ph = c / n; const E = z * Math.sqrt(ph * (1 - ph) / n); Esum += E;
        const ok = ph - E <= p && p <= ph + E; if (ok) hit++;
        ctx.strokeStyle = ok ? css('--good') : css('--bad'); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(ph - E), Y(j)); ctx.lineTo(X(ph + E), Y(j)); ctx.stroke();
        ctx.fillStyle = ctx.strokeStyle; ctx.fillRect(X(ph) - 1.5, Y(j) - 1.5, 3, 3);
      }
      ctx.strokeStyle = css('--warn'); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(p), Y(0)); ctx.lineTo(X(p), Y(K + 1)); ctx.stroke();
      out.innerHTML = `${K} samples, each giving a CI p̂ ± z√(p̂(1−p̂)/n). <b>${hit}/${K}</b> (${fmt(100 * hit / K, 1)}%) contain the true p (green). Average margin of error ≈ <b>${fmt(Esum / K, 4)}</b>. <span class="muted">Higher confidence → wider; larger n → narrower.</span>`;
    }
    draw(); return draw;
  },
  triangle(root) {
    const cv = document.createElement('canvas'); root.appendChild(cv);
    const out = document.createElement('div'); out.className = 'sim-out'; root.appendChild(out);
    const v = controls(root, [{ key: 'B', label: 'Angle B (°)', min: 10, max: 150, step: 1, value: 40 }, { key: 'a', label: 'Side a = BC', min: 2, max: 14, step: 0.1, value: 10 }, { key: 'b', label: 'Side b = AC (opposite B)', min: 2, max: 14, step: 0.1, value: 8 }], draw);
    function draw() {
      const Br = v.B * Math.PI / 180, { a, b } = v; const sA = a * Math.sin(Br) / b;
      const { ctx, w, h } = setupCanvas(cv, 300); ctx.clearRect(0, 0, w, h);
      const sc = Math.min((w - 40) / 26, (h - 40) / 14), ox = 20, oy = h - 25;
      const P = (x, y) => [ox + x * sc, oy - y * sc];
      const Bp = [0, 0], Cp = [a, 0];
      const sols = [];
      if (sA <= 1) { const A1 = Math.asin(sA); [A1, Math.PI - A1].forEach(A => { const C = Math.PI - A - Br; if (C > 1e-6) { const c = b * Math.sin(C) / Math.sin(Br); sols.push({ A, C, c }); } }); }
      const uniq = sols.filter((s, i) => i === 0 || Math.abs(s.A - sols[0].A) > 1e-6);
      ctx.font = '13px system-ui'; ctx.lineWidth = 2;
      // ray from B at angle B
      ctx.strokeStyle = css('--grid'); ctx.beginPath(); ctx.moveTo(...P(0, 0)); ctx.lineTo(...P(16 * Math.cos(Br), 16 * Math.sin(Br))); ctx.stroke();
      // circle of radius b around C
      ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(...P(a, 0), b * sc, Math.PI, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
      const cols = [css('--accent'), css('--accent2')];
      uniq.forEach((s, i) => { const Ap = [s.c * Math.cos(Br), s.c * Math.sin(Br)]; ctx.strokeStyle = cols[i]; ctx.beginPath(); ctx.moveTo(...P(...Bp)); ctx.lineTo(...P(...Cp)); ctx.lineTo(...P(...Ap)); ctx.closePath(); ctx.stroke(); ctx.fillStyle = cols[i]; ctx.fillText('A' + (uniq.length > 1 ? (i + 1) : ''), ...P(Ap[0] - 0.4, Ap[1] + 0.5)); });
      ctx.fillStyle = css('--text'); ctx.fillText('B', ...P(-0.7, -0.6)); ctx.fillText('C', ...P(a + 0.2, -0.6));
      const d = x => fmt(x * 180 / Math.PI, 2);
      out.innerHTML = !uniq.length ? `sin A = a·sin B / b = ${fmt(sA, 4)} ${sA > 1 ? '> 1' : ''} → <b>no triangle</b> possible (side b too short).` :
        `Sine rule: sin A = a sin B / b = ${fmt(sA, 4)}. ` + uniq.map((s, i) => `<br><b>Triangle ${i + 1}</b>: A = ${d(s.A)}°, C = ${d(s.C)}°, c = AB = ${fmt(s.c, 3)}, area = ½ab sin C = ${fmt(0.5 * a * b * Math.sin(s.C), 3)}`).join('') + (uniq.length > 1 ? '<br><span class="muted">Two triangles — this is the <b>ambiguous case</b>.</span>' : '');
    }
    draw(); return draw;
  },
};

export function mountSim(el, name) {
  if (!SIMS[name]) return;
  el.innerHTML = '';
  const redraw = SIMS[name](el);
  let t; const ro = new ResizeObserver(() => { clearTimeout(t); t = setTimeout(() => redraw && redraw(), 80); });
  ro.observe(el);
}
export const SIM_NAMES = { tangent: 'Tangent & derivative explorer', concavity: 'Stationary points & concavity', motion: 'Displacement, velocity, acceleration', riemann: 'Area: rectangles vs trapezoidal rule', binomial: 'Binomial distribution', normal: 'Normal distribution calculator', sampling: 'Distribution of sample proportions', ci: 'Confidence interval simulator', triangle: 'Sine rule & ambiguous case' };
