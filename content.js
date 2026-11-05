// Lesson content for QCAA Mathematical Methods Units 3 & 4 (2025 syllabus)
// Maths is written in TeX and rendered with KaTeX: \( inline \)  and  \[ display \]
const R = String.raw;

export const TOPICS = [
  { id: 'd1', unit: 3, num: 1, short: 'Exp & log calculus', title: 'Differentiation of exponential and logarithmic functions', color: '#e76f51' },
  { id: 'd2', unit: 3, num: 2, short: 'Trig derivatives & rules', title: 'Differentiation of trigonometric functions and differentiation rules', color: '#f4a261' },
  { id: 'd3', unit: 3, num: 3, short: 'Applications of differentiation', title: 'Further applications of differentiation', color: '#e9c46a' },
  { id: 'i1', unit: 3, num: 4, short: 'Anti-differentiation', title: 'Introduction to integration', color: '#2a9d8f' },
  { id: 'r1', unit: 3, num: 5, short: 'Discrete random variables', title: 'Discrete random variables', color: '#264653' },
  { id: 'i2', unit: 4, num: 1, short: 'Definite integrals & area', title: 'Further integration', color: '#3a86ff' },
  { id: 't',  unit: 4, num: 2, short: 'Sine & cosine rules', title: 'Trigonometry', color: '#8338ec' },
  { id: 'n',  unit: 4, num: 3, short: 'Continuous RVs & normal', title: 'Continuous random variables and the normal distribution', color: '#ff006e' },
  { id: 's',  unit: 4, num: 4, short: 'Sampling & proportions', title: 'Sampling and proportions', color: '#06d6a0' },
  { id: 'c',  unit: 4, num: 5, short: 'Confidence intervals', title: 'Interval estimates for proportions', color: '#118ab2' },
];

export const CLASSES = {
  SF: { name: 'Simple familiar', desc: 'Relationships are obvious with few elements. All the information needed is identifiable and the procedure is clear from the way the question is asked, or the context has been a focus of prior learning. About 60% of exam marks.' },
  CF: { name: 'Complex familiar', desc: 'Several elements must be connected (within or across topics), but the information needed is identifiable and the procedure is still clear or the context is familiar. About 20% of exam marks.' },
  CU: { name: 'Complex unfamiliar', desc: 'Several elements must be connected and the method is NOT obvious from the question; the context is one you have had limited experience with. You must choose the approach, justify and evaluate reasonableness. About 20% of exam marks.' },
};

// Each lesson: syllabus dot points (summarised), notes (HTML), examples [{q, a}], tips, sim id
export const LESSONS = {
d1: {
  syllabus: [
    'Estimate \\(\\lim_{h\\to0}\\frac{a^h-1}{h}\\) using technology; recognise \\(e\\) as the unique \\(a\\) for which the limit is 1',
    'Features of \\(y=e^x\\) and \\(y=\\ln x\\) (asymptotes, intercepts) and their inverse relationship',
    'Solve equations with base \\(e\\) (and other bases) with and without technology',
    'Use \\(\\frac{d}{dx}e^{f(x)} = f\'(x)e^{f(x)}\\) and \\(\\frac{d}{dx}\\ln f(x) = \\frac{f\'(x)}{f(x)}\\)',
    'Model and solve problems involving derivatives of exponential and log functions',
  ],
  notes: R`
<h3>Why \(e\) is special</h3>
<p>For any base \(a>0\), the gradient of \(y=a^x\) at \(x=0\) is \(\lim_{h\to 0}\frac{a^h-1}{h}\). For \(a=2\) this is about 0.693, for \(a=3\) about 1.099. The number \(e\approx 2.71828\) is the unique base where this limit equals exactly 1, so \(\frac{d}{dx}e^x=e^x\). To estimate the limit, substitute values of \(h\) that get closer and closer to 0 (e.g. 0.1, 0.01, 0.001… or −0.1, −0.01…).</p>
<h3>Graphs</h3>
<ul>
<li>\(y=e^x\): domain \(\mathbb R\), range \(y>0\), y-intercept \((0,1)\), horizontal asymptote \(y=0\), always increasing, gradient = function value at every point.</li>
<li>\(y=\ln x\): domain \(x>0\), range \(\mathbb R\), x-intercept \((1,0)\), vertical asymptote \(x=0\). It is the reflection of \(y=e^x\) in \(y=x\).</li>
<li>Transformations: \(y=a\ln(x-h)+k\) has asymptote \(x=h\); \(y=ae^{x-h}+k\) has asymptote \(y=k\).</li>
</ul>
<h3>Log laws (Units 1&2 knowledge used constantly)</h3>
<div class="formula">\[\log_a(mn)=\log_a m+\log_a n\qquad \log_a\!\left(\tfrac mn\right)=\log_a m-\log_a n\qquad \log_a(m^k)=k\log_a m\]
\[a^{y}=x \iff y=\log_a x \qquad e^{\ln x}=x\ (x>0)\qquad \ln(e^x)=x\qquad \log_a 1=0\qquad \log_a a = 1\]</div>
<h3>Solving equations</h3>
<ul>
<li>Isolate the exponential, then take ln of both sides: \(4e^{2x}=100\Rightarrow e^{2x}=25\Rightarrow x=\tfrac12\ln 25=\ln 5\).</li>
<li>Combine logs into a single log, then convert to index form: \(2\log_3 x-\log_3(x-1)=1 \Rightarrow \log_3\frac{x^2}{x-1}=1\Rightarrow x^2=3(x-1)\).</li>
<li>"Hidden quadratics": \(e^{2x}-5e^x+6=0\) → let \(u=e^x\): \((u-2)(u-3)=0\).</li>
<li><b>Always check solutions</b> are in the domain (arguments of logs must be positive; \(e^x\) can never be negative). Rejecting an invalid solution is often worth a mark.</li>
</ul>
<h3>Derivatives</h3>
<div class="formula">\[\frac{d}{dx}e^x=e^x\qquad \frac{d}{dx}e^{f(x)}=f'(x)\,e^{f(x)}\qquad \frac{d}{dx}\ln x=\frac1x\qquad \frac{d}{dx}\ln f(x)=\frac{f'(x)}{f(x)}\]</div>
<p>Simplify with log laws <em>before</em> differentiating: \(\ln\!\left(\frac{x^3}{x+1}\right)=3\ln x-\ln(x+1)\), so the derivative is \(\frac3x-\frac1{x+1}\).</p>
<h3>Modelling</h3>
<p>Growth/decay models \(P(t)=P_0e^{kt}\): \(P_0\) is the initial value (\(t=0\)); find \(k\) from a second data point using logs. The <em>rate of change</em> is \(P'(t)=kP_0e^{kt}\). "When is the population 1000?" means solve \(P(t)=1000\); "how fast is it growing at \(t=3\)?" means evaluate \(P'(3)\).</p>`,
  examples: [
    { q: R`Solve \(\ln(2x)=5\).`, a: R`\(2x=e^5\Rightarrow x=\dfrac{e^5}{2}\)` },
    { q: R`Differentiate \(y=e^{3x^2-1}\).`, a: R`Chain rule: \(\dfrac{dy}{dx}=6x\,e^{3x^2-1}\).` },
    { q: R`Differentiate \(y=\ln(x^2+4)\) and find the gradient at \(x=2\).`, a: R`\(y'=\dfrac{2x}{x^2+4}\); at \(x=2\): \(y'=\dfrac{4}{8}=\dfrac12\).` },
    { q: R`A population is modelled by \(P=100e^{kt}\) and \(P(3)=120\). Find \(k\) and the rate of growth at \(t=3\).`, a: R`\(e^{3k}=1.2\Rightarrow k=\frac13\ln1.2\approx0.0608\). \(P'(t)=100k e^{kt}\Rightarrow P'(3)=120k\approx 7.29\) per week.` },
  ],
  tips: [
    'Write ln with brackets: ln(x+1), not ln x+1.',
    'State the reason for rejecting a solution, e.g. "x = −2 rejected since ln(x) is undefined for x ≤ 0".',
    'In tech-free papers, leave exact answers (e.g. ln 5, e²/2) unless told otherwise.',
  ],
  sim: 'tangent',
},
d2: {
  syllabus: [
    'Use \\(\\frac{d}{dx}\\sin x=\\cos x\\), \\(\\frac{d}{dx}\\cos x=-\\sin x\\) and their chain-rule forms',
    'Model and solve problems involving derivatives of trig functions',
    'Chain, product and quotient rules with exp, log and trig functions, in simplest and factorised form',
  ],
  notes: R`
<h3>Trig derivatives (x in radians!)</h3>
<div class="formula">\[\frac{d}{dx}\sin x=\cos x\qquad \frac{d}{dx}\cos x=-\sin x\qquad \frac{d}{dx}\tan x=\frac{1}{\cos^2x}\]
\[\frac{d}{dx}\sin(f(x))=f'(x)\cos(f(x))\qquad \frac{d}{dx}\cos(f(x))=-f'(x)\sin(f(x))\]</div>
<p>Set your calculator to <b>radians</b> for calculus. These rules only hold in radians.</p>
<h3>The three rules</h3>
<div class="formula">\[\textbf{Chain: }\ \frac{dy}{dx}=\frac{dy}{du}\cdot\frac{du}{dx}\qquad \textbf{Product: }\ (uv)'=u'v+uv'\qquad \textbf{Quotient: }\ \left(\frac uv\right)'=\frac{u'v-uv'}{v^2}\]</div>
<ul>
<li>Identify the <em>outermost</em> structure first: is the whole thing a product, a quotient, or a function of a function?</li>
<li>"Simplest and factorised form": take out common factors, e.g. \(\frac{d}{dx}x^2e^{-x}=2xe^{-x}-x^2e^{-x}=xe^{-x}(2-x)\).</li>
<li>Quotient rule order matters: <b>u′v − uv′</b> (top-derivative first). A mnemonic: "low d-high minus high d-low, over low squared".</li>
</ul>
<h3>Trig models</h3>
<p>\(y=a\sin(b(x-h))+k\): amplitude \(|a|\), period \(\frac{2\pi}{b}\), phase shift \(h\), centre line \(y=k\). Max = \(k+|a|\), min = \(k-|a|\). The <b>rate of change</b> \(y'=ab\cos(b(x-h))\) has maximum size \(|ab|\), which occurs where the graph crosses its centre line.</p>
<p>Ferris wheels, tides and daylight hours are typical contexts. Starting at the lowest point suggests \(-a\cos(bt)+k\).</p>`,
  examples: [
    { q: R`Differentiate \(y=\ln(x)\cos(x)\).`, a: R`Product rule: \(y'=\dfrac{\cos x}{x}-\ln(x)\sin(x)\).` },
    { q: R`Differentiate \(f(x)=\dfrac{\cos x}{\sin x}\) in simplest form.`, a: R`\(f'(x)=\dfrac{-\sin x\sin x-\cos x\cos x}{\sin^2x}=\dfrac{-(\sin^2x+\cos^2x)}{\sin^2x}=-\dfrac{1}{\sin^2x}\)` },
    { q: R`If \(f(x)=\sin(3x)\), find \(f'\!\left(\frac{\pi}{9}\right)\).`, a: R`\(f'(x)=3\cos(3x)\Rightarrow f'(\pi/9)=3\cos(\pi/3)=\dfrac32\).` },
    { q: R`Find the second derivative of \(h(x)=x\sin x\).`, a: R`\(h'=\sin x+x\cos x\); \(h''=\cos x+\cos x-x\sin x=2\cos x-x\sin x\).` },
  ],
  tips: [
    'Show the rule: write u = …, v = …, u′ = …, v′ = … — markers award a mark for "identifies the use of the product/quotient rule".',
    'sin²x means (sin x)²; derivative of sin²x is 2 sin x cos x (chain rule).',
    'Use the identity sin²x + cos²x = 1 to simplify quotient-rule answers.',
  ],
  sim: 'tangent',
},
d3: {
  syllabus: [
    'The second derivative as the rate of change of the first derivative; acceleration as the second derivative of displacement',
    'Concavity, points of inflection and their relationship with the second derivative',
    'Second derivative test for local maxima and minima',
    'Sketch graphs using first and second derivatives',
    'Optimisation problems (function given or to be developed)',
  ],
  notes: R`
<h3>What the derivatives tell you</h3>
<table class="tbl"><tr><th></th><th>&gt; 0</th><th>= 0</th><th>&lt; 0</th></tr>
<tr><td>\(f'(x)\)</td><td>increasing</td><td>stationary point</td><td>decreasing</td></tr>
<tr><td>\(f''(x)\)</td><td>concave up ∪</td><td>possible inflection</td><td>concave down ∩</td></tr></table>
<h3>Stationary points</h3>
<ol><li>Solve \(f'(x)=0\).</li><li>Second derivative test: \(f''(a)>0\) → local minimum; \(f''(a)<0\) → local maximum; \(f''(a)=0\) → test fails, use a sign table of \(f'\).</li><li>Find the y-value by substituting into \(f(x)\) (not \(f'\)!).</li></ol>
<h3>Points of inflection</h3>
<p>A point of inflection is where the <b>concavity changes</b>. Solve \(f''(x)=0\), then show \(f''\) changes sign either side (e.g. test \(x=a-1\) and \(x=a+1\)). \(f''(a)=0\) alone is not enough — e.g. \(y=x^4\) has \(f''(0)=0\) but no inflection. A <em>horizontal</em> (stationary) point of inflection has \(f'(a)=0\) and \(f''\) changes sign.</p>
<h3>Reading graphs of f, f′, f″</h3>
<ul><li>Turning points of \(f\) ↔ x-intercepts of \(f'\) (where \(f'\) changes sign).</li><li>Inflection points of \(f\) ↔ turning points of \(f'\) ↔ x-intercepts of \(f''\).</li><li>Where \(f\) is increasing, \(f'\) is above the x-axis.</li></ul>
<h3>Motion</h3>
<div class="formula">\[v(t)=x'(t)\qquad a(t)=v'(t)=x''(t)\]</div>
<p>"At rest" means \(v=0\). "Initially" means \(t=0\). Speeding up when \(v\) and \(a\) have the same sign.</p>
<h3>Optimisation recipe</h3>
<ol><li>Draw a diagram; define variables with units.</li><li>Write the quantity to optimise as a function of ONE variable (use a constraint to eliminate the other).</li><li>State the feasible domain.</li><li>Differentiate, set = 0, solve.</li><li>Justify max/min (second derivative test or sign table) and check endpoints.</li><li>Answer the question in words with units.</li></ol>
<p>"When is it growing fastest?" means maximise the <em>rate</em>: solve \(P''(t)=0\) and check it is a maximum of \(P'\).</p>`,
  examples: [
    { q: R`Find and classify the stationary points of \(y=x^3-3x^2\).`, a: R`\(y'=3x^2-6x=3x(x-2)=0\Rightarrow x=0,2\). \(y''=6x-6\): \(y''(0)=-6<0\) → max at \((0,0)\); \(y''(2)=6>0\) → min at \((2,-4)\).` },
    { q: R`Show \(f(x)=x^3-9x^2+5\) has a point of inflection at \(x=3\).`, a: R`\(f''(x)=6x-18\). \(f''(3)=0\); \(f''(2)=-6<0\) (concave down), \(f''(4)=6>0\) (concave up). Concavity changes, so there is a point of inflection at \(x=3\).` },
    { q: R`A rectangle has perimeter 40 m. Find the maximum area.`, a: R`\(2x+2y=40\Rightarrow y=20-x\). \(A=x(20-x)=20x-x^2\), \(0<x<20\). \(A'=20-2x=0\Rightarrow x=10\); \(A''=-2<0\) so max. Max area \(=100\text{ m}^2\) (a 10 m × 10 m square).` },
  ],
  tips: [
    'Always state the conclusion of a second derivative test: "since f″(2) > 0, local minimum".',
    'For inflection, test values either side — markers look for the sign change.',
    'In optimisation, give the answer to the question asked (e.g. the maximum volume, not just x).',
  ],
  sim: 'concavity',
},
i1: {
  syllabus: [
    'Anti-differentiation as the reverse of differentiation; notation \\(\\int f(x)\\,dx\\)',
    'Standard integrals: \\(x^n\\) (n ≠ −1), \\(e^x\\), \\(1/x\\), sin, cos; linearity rules',
    'Integrals of the form \\(\\int f(ax+b)\\,dx\\)',
    'Find \\(f(x)\\) from \\(f\'(x)\\) and an initial condition',
    'Displacement from velocity (and from acceleration with initial conditions)',
  ],
  notes: R`
<h3>Standard anti-derivatives</h3>
<div class="formula">\[\int x^n\,dx=\frac{x^{n+1}}{n+1}+c\ (n\neq-1)\qquad \int\frac1x\,dx=\ln x+c\ (x>0)\qquad \int e^x\,dx=e^x+c\]
\[\int\sin x\,dx=-\cos x+c\qquad \int\cos x\,dx=\sin x+c\]
\[\int f(ax+b)\,dx=\frac1a F(ax+b)+c\quad\text{e.g. }\int e^{4x}dx=\tfrac14e^{4x}+c,\ \int (4x+6)^3dx=\frac{(4x+6)^4}{16}+c\]</div>
<p>Also useful (reverse chain rule): \(\int\frac{f'(x)}{f(x)}dx=\ln f(x)+c\), e.g. \(\int\frac{x+1}{x^2+2x}dx=\frac12\ln(x^2+2x)+c\).</p>
<h3>Rewrite before integrating</h3>
<ul><li>Split fractions: \(\int\frac{e^x+1}{e^x}dx=\int(1+e^{-x})dx=x-e^{-x}+c\).</li><li>Negative powers: \(\int\frac{20}{x^3}dx=\int 20x^{-3}dx=-10x^{-2}+c\).</li><li>Expand brackets: \(\int x(x+8)dx=\int(x^2+8x)dx\).</li></ul>
<p>There is <b>no product rule</b> for integration — expand or rewrite first.</p>
<h3>Finding the constant</h3>
<p>Integrate, include \(+c\), then substitute the given point. E.g. \(F'(x)=6x^2\), \(F(1)=5\): \(F=2x^3+c\), \(5=2+c\Rightarrow c=3\).</p>
<h3>Motion</h3>
<div class="formula">\[x(t)=\int v(t)\,dt\qquad v(t)=\int a(t)\,dt\]</div>
<p>Use the initial conditions (e.g. "starts from rest at the origin": \(v(0)=0,\ x(0)=0\)) to find each constant separately.</p>`,
  examples: [
    { q: R`Find \(\int (3x^2-4\sin x+e^{2x})\,dx\).`, a: R`\(x^3+4\cos x+\tfrac12e^{2x}+c\)` },
    { q: R`\(f'(x)=\cos x-4\sin(2x+\pi)\) and \(f(\pi)=2\). Find \(f(x)\).`, a: R`\(f(x)=\sin x+2\cos(2x+\pi)+c\). \(f(\pi)=0+2\cos(3\pi)+c=-2+c=2\Rightarrow c=4\). So \(f(x)=\sin x+2\cos(2x+\pi)+4\).` },
    { q: R`A particle has \(a(t)=\pi\cos(\pi t)\), \(v(1)=0.5\), \(x(0)=0\). Find \(x(1)\).`, a: R`\(v=\sin(\pi t)+c_1\); \(0.5=0+c_1\Rightarrow v=\sin(\pi t)+0.5\). \(x=-\tfrac1\pi\cos(\pi t)+0.5t+c_2\); \(0=-\tfrac1\pi+c_2\Rightarrow c_2=\tfrac1\pi\). \(x(1)=\tfrac1\pi+0.5+\tfrac1\pi=0.5+\tfrac2\pi\) m.` },
  ],
  tips: ['Never forget +c in indefinite integrals — it costs marks.', 'Check by differentiating your answer.', 'Divide by the coefficient of x for f(ax+b) — a very common MC distractor multiplies instead.'],
  sim: 'motion',
},
r1: {
  syllabus: [
    'Discrete random variables and probability functions; point estimates from relative frequencies',
    'Uniform and non-uniform discrete RVs',
    'Mean \\(E(X)=\\sum p_ix_i\\), variance \\(\\sum p_i(x_i-\\mu)^2\\), standard deviation',
    'Bernoulli distribution: mean \\(p\\), variance \\(p(1-p)\\)',
    'Binomial distribution: \\(P(X=r)=\\binom nr p^r(1-p)^{n-r}\\), mean \\(np\\), variance \\(np(1-p)\\); language of "at most", "at least" etc.',
  ],
  notes: R`
<h3>Discrete random variables</h3>
<p>A probability distribution lists each value \(x_i\) with probability \(p_i\), where \(0\le p_i\le1\) and \(\sum p_i=1\).</p>
<div class="formula">\[E(X)=\mu=\sum p_ix_i\qquad \mathrm{Var}(X)=\sum p_i(x_i-\mu)^2=E(X^2)-\mu^2\qquad \sigma=\sqrt{\mathrm{Var}(X)}\]</div>
<h3>Bernoulli</h3>
<p>One trial, two outcomes: success (1) with probability \(p\), failure (0) with \(1-p\). Mean \(p\), variance \(p(1-p)\). Variance is largest when \(p=0.5\).</p>
<h3>Binomial \(X\sim\text{Bin}(n,p)\)</h3>
<p>Conditions (often asked!): a fixed number \(n\) of trials; each trial has two outcomes; trials are <b>independent</b>; the probability of success \(p\) is the <b>same</b> for every trial (e.g. sampling <em>with</em> replacement).</p>
<div class="formula">\[P(X=r)=\binom nr p^r(1-p)^{n-r}\qquad E(X)=np\qquad \mathrm{Var}(X)=np(1-p)\]</div>
<table class="tbl"><tr><th>Words</th><th>Means</th></tr>
<tr><td>at most 2</td><td>\(P(X\le2)=P(0)+P(1)+P(2)\)</td></tr>
<tr><td>at least 1</td><td>\(P(X\ge1)=1-P(X=0)\)</td></tr>
<tr><td>fewer than 3</td><td>\(P(X\le2)\)</td></tr>
<tr><td>more than 3</td><td>\(P(X\ge4)\)</td></tr>
<tr><td>between 2 and 5 inclusive</td><td>\(P(2\le X\le5)\)</td></tr></table>
<p>Tech-free: use \(\binom nr=\frac{n!}{r!(n-r)!}\) (e.g. \(\binom32=3\)) and leave fractions. Tech-active: use binomial pdf / cdf on the GDC.</p>`,
  examples: [
    { q: R`\(X\sim\text{Bin}(5,\tfrac35)\). Find \(P(X=1)\).`, a: R`\(\binom51\left(\tfrac35\right)^1\left(\tfrac25\right)^4=5\cdot\tfrac35\cdot\tfrac{16}{625}=\tfrac{48}{625}\)` },
    { q: R`5% of packets are underweight. In a batch of 20, find the mean, variance and \(P(X\le1)\).`, a: R`\(np=1\); \(np(1-p)=0.95\); \(P(X\le1)=0.95^{20}+20(0.05)(0.95)^{19}\approx0.7358\).` },
    { q: R`A Bernoulli trial has \(p=0.3\). Find the variance.`, a: R`\(0.3\times0.7=0.21\)` },
  ],
  tips: ['Define your variable and distribution: "Let X = number of …, X ~ Bin(20, 0.05)".', 'Use the complement for "at least one".', 'Without replacement from a small population is NOT binomial.'],
  sim: 'binomial',
},
i2: {
  syllabus: [
    'Estimate area with sums \\(\\sum f(x_i)\\delta x_i\\); the definite integral as a limit of sums',
    'Fundamental theorem of calculus: \\(\\int_a^b f(x)dx=F(b)-F(a)\\)',
    'Area under a curve, area enclosed by a curve and the x-axis, area between curves',
    'Trapezoidal rule',
    'Total change from rates of change; motion problems with definite integrals',
  ],
  notes: R`
<h3>Fundamental theorem</h3>
<div class="formula">\[\int_a^b f(x)\,dx=\Big[F(x)\Big]_a^b=F(b)-F(a)\]</div>
<p>A definite integral gives the <b>signed</b> area: regions below the x-axis count as negative.</p>
<h3>Areas</h3>
<ul><li>Find the x-intercepts first. Split the integral where the curve crosses the axis and add the absolute values: \(A=\int_a^c f\,dx+\left|\int_c^b f\,dx\right|\).</li>
<li>Between two curves: \(A=\int_a^b\big(\text{top}-\text{bottom}\big)dx\), where \(a,b\) are the intersection points.</li></ul>
<h3>Approximations</h3>
<p>Rectangles (left/right sums) of width \(\delta x\): \(A\approx\sum f(x_i)\delta x\). As \(\delta x\to0\) this becomes the integral.</p>
<div class="formula">\[\text{Trapezoidal rule: }\int_a^bf(x)dx\approx\frac w2\Big[f(x_0)+2\big(f(x_1)+\dots+f(x_{n-1})\big)+f(x_n)\Big],\quad w=\frac{b-a}{n}\]</div>
<p>For a concave-up curve the trapezoidal rule over-estimates; for concave-down it under-estimates.</p>
<h3>Total change</h3>
<p>If \(R(t)\) is a rate (litres/hour, people/year), the change between \(t=a\) and \(t=b\) is \(\int_a^bR(t)dt\). Final amount = initial amount + change.</p>
<h3>Motion</h3>
<p>Displacement from \(t=a\) to \(b\): \(\int_a^b v\,dt\). <b>Distance travelled</b>: \(\int_a^b|v|\,dt\) — split at times when \(v=0\).</p>`,
  examples: [
    { q: R`Find the area between \(y=9-x^2\) and the x-axis.`, a: R`Intercepts \(x=\pm3\). \(\int_{-3}^{3}(9-x^2)dx=\left[9x-\tfrac{x^3}{3}\right]_{-3}^{3}=18-(-18)=36\) units².` },
    { q: R`Find the total area between \(y=x^2-x-6\) and the x-axis from \(x=1\) to \(x=5\).`, a: R`Root at \(x=3\) in [1,5]. \(\int_1^3=-\tfrac{22}{3}\), \(\int_3^5=\tfrac{38}{3}\). Area \(=\tfrac{22}{3}+\tfrac{38}{3}=20\) units².` },
    { q: R`Use the trapezoidal rule with 4 strips for \(\int_0^4\sqrt{2x+1}\,dx\).`, a: R`\(w=1\): \(\tfrac12[1+2(\sqrt3+\sqrt5+\sqrt7)+3]=2+\sqrt3+\sqrt5+\sqrt7\).` },
  ],
  tips: ['Sketch the curve to see which parts are below the axis.', 'Write out every substitution in the trapezoidal rule — it is usually a mark.', 'Area is always positive; a definite integral can be negative.'],
  sim: 'riemann',
},
t: {
  syllabus: [
    'Sine rule (including the ambiguous case) and cosine rule',
    'Area of a triangle \\(\\tfrac12 bc\\sin A\\)',
    'Problems in 2D and 3D, bearings, angles of elevation and depression',
  ],
  notes: R`
<div class="formula">\[\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}\qquad c^2=a^2+b^2-2ab\cos C\qquad \cos C=\frac{a^2+b^2-c^2}{2ab}\qquad \text{Area}=\tfrac12ab\sin C\]</div>
<h3>Which rule?</h3>
<ul><li><b>Sine rule</b>: you know a side and its opposite angle (a "matching pair") plus one more side or angle.</li>
<li><b>Cosine rule</b>: two sides and the included angle (find the third side), or all three sides (find an angle).</li></ul>
<h3>Ambiguous case</h3>
<p>Using the sine rule to find an angle: \(\sin\theta=k\) has two solutions in \(0^\circ<\theta<180^\circ\): \(\theta\) and \(180^\circ-\theta\). Both are valid if the angle sum stays below 180°. E.g. \(\sin B=0.8\Rightarrow B=53.1^\circ\) or \(126.9^\circ\).</p>
<h3>Bearings</h3>
<p>True bearings are measured clockwise from north (e.g. 052°T). Draw a north line at every point; use alternate/co-interior angles between parallel north lines.</p>
<h3>Exact values (tech-free)</h3>
<table class="tbl"><tr><th>θ</th><th>30°</th><th>45°</th><th>60°</th><th>120°</th><th>150°</th></tr>
<tr><td>sin</td><td>1/2</td><td>√2/2</td><td>√3/2</td><td>√3/2</td><td>1/2</td></tr>
<tr><td>cos</td><td>√3/2</td><td>√2/2</td><td>1/2</td><td>−1/2</td><td>−√3/2</td></tr></table>
<h3>Solving trig equations</h3>
<p>\(2\cos\theta-1=0\Rightarrow\cos\theta=\tfrac12\Rightarrow\theta=60^\circ,300^\circ\) in \([0^\circ,360^\circ]\); add 360° for further solutions. Use the CAST diagram for the quadrants.</p>`,
  examples: [
    { q: R`Find the area of a triangle with sides 4 m and 4 m enclosing 120°.`, a: R`\(\tfrac12\cdot4\cdot4\sin120^\circ=8\cdot\tfrac{\sqrt3}{2}=4\sqrt3\text{ m}^2\)` },
    { q: R`In triangle ABC, \(a=8.8, b=9.9, c=11.3\). Find angle A.`, a: R`\(\cos A=\frac{9.9^2+11.3^2-8.8^2}{2(9.9)(11.3)}\approx0.663\Rightarrow A\approx48.5^\circ\)` },
    { q: R`Angle at B is 40°, side BC = 10 cm, side AC = 8 cm (opposite B). Find the possible angles A.`, a: R`\(\sin A=\frac{10\sin40^\circ}{8}\approx0.8035\Rightarrow A\approx53.5^\circ\) or \(126.5^\circ\). Both valid (40 + 126.5 < 180).` },
  ],
  tips: ['Label the triangle: side a is opposite angle A.', 'Keep unrounded values in your calculator for later steps.', 'Check calculator is in DEGREES for triangle problems (radians for calculus).'],
  sim: 'triangle',
},
n: {
  syllabus: [
    'Relative frequencies and histograms to estimate probabilities of continuous RVs',
    'Probability density functions, cumulative distribution functions, probabilities as integrals',
    'Expected value \\(\\int x\\,p(x)dx\\), variance \\(\\int(x-\\mu)^2p(x)dx\\), standard deviation',
    'Standardised normal variables (z-scores) to compare',
    'Normal distribution \\(X\\sim N(\\mu,\\sigma^2)\\): features, probabilities and quantiles using technology',
  ],
  notes: R`
<h3>Probability density functions</h3>
<p>A pdf \(p(x)\) satisfies \(p(x)\ge0\) and \(\int_{-\infty}^{\infty}p(x)dx=1\). Probabilities are areas: \(P(a\le X\le b)=\int_a^bp(x)dx\). For a continuous RV, \(P(X=a)=0\), so \(<\) and \(\le\) give the same answer.</p>
<div class="formula">\[E(X)=\mu=\int x\,p(x)\,dx\qquad \mathrm{Var}(X)=\int(x-\mu)^2p(x)\,dx=\int x^2p(x)dx-\mu^2\]</div>
<p>The <b>cumulative distribution function</b> is \(F(x)=P(X\le x)=\int_{-\infty}^{x}p(t)dt\), so \(p(x)=F'(x)\). The median \(m\) solves \(F(m)=0.5\); the 36th percentile solves \(F(a)=0.36\).</p>
<p>Unknown constant? Use "total area = 1" to find it first.</p>
<h3>Uniform continuous</h3>
<p>\(p(x)=\frac{1}{b-a}\) on \([a,b]\); mean \(\frac{a+b}2\), variance \(\frac{(b-a)^2}{12}\).</p>
<h3>Normal distribution</h3>
<p>Bell-shaped, symmetric about \(\mu\); about <b>68%</b> within \(\mu\pm\sigma\), <b>95%</b> within \(\mu\pm2\sigma\), <b>99.7%</b> within \(\mu\pm3\sigma\).</p>
<div class="formula">\[z=\frac{x-\mu}{\sigma}\]</div>
<ul><li>Use z-scores to compare results from different distributions (the larger z is relatively better).</li>
<li>Tech-active: normal cdf for probabilities; inverse normal for quantiles ("the top 2%" → inverse normal with area 0.98 to the left).</li>
<li>Unknown \(\mu\) or \(\sigma\): find the z-value for the known percentile, then solve \(z=\frac{x-\mu}{\sigma}\).</li></ul>`,
  examples: [
    { q: R`\(p(x)=\tfrac18x\) on \([0,4]\). Find \(E(X)\).`, a: R`\(\int_0^4\tfrac18x^2dx=\tfrac{1}{24}[x^3]_0^4=\tfrac{64}{24}=\tfrac83\)` },
    { q: R`\(p(x)=2x-2\) on \([1,2]\). Find the 36th percentile.`, a: R`\(\int_1^a(2x-2)dx=(a-1)^2=0.36\Rightarrow a=1.6\) (reject 0.4, not in domain).` },
    { q: R`Heights \(\sim N(165,15^2)\). Find the minimum height in the top 2%.`, a: R`Inverse normal: \(P(X<h)=0.98\Rightarrow z=2.054\), \(h=165+2.054(15)\approx195.8\) → 196 cm.` },
  ],
  tips: ['Draw and shade a bell curve for every normal question.', 'State the distribution: X ~ N(165, 15²).', 'For percentiles, convert "top 2%" to "98% below".'],
  sim: 'normal',
},
s: {
  syllabus: [
    'Random samples; sources of bias; procedures to ensure randomness',
    'Graphical displays of simulated samples from uniform, Bernoulli, binomial and normal distributions',
    'Sample proportion \\(\\hat p\\) as a random variable with mean \\(p\\) and standard deviation \\(\\sqrt{p(1-p)/n}\\)',
    'Approximate normality of \\(\\hat p\\) for large samples',
  ],
  notes: R`
<h3>Random samples and bias</h3>
<p>In a <b>simple random sample</b> every member of the population has an equal chance of selection (e.g. random number generator from a full list). Bias arises from self-selection (online polls), convenience samples (asking people at one location), non-response, and leading questions.</p>
<h3>Sample proportions</h3>
<p>\(\hat p=\frac{\text{number with the attribute}}{n}\). Different samples give different \(\hat p\) — it is a random variable.</p>
<div class="formula">\[E(\hat p)=p\qquad \mathrm{SD}(\hat p)=\sqrt{\frac{p(1-p)}{n}}\]</div>
<ul><li>As \(n\) increases the distribution of \(\hat p\) becomes <b>narrower</b> (less spread) and more <b>bell-shaped</b> (approximately normal), still centred on \(p\).</li>
<li>Halving the standard deviation of \(\hat p\) requires 4× the sample size.</li>
<li>Larger samples give \(\hat p\) values that better approximate \(p\).</li></ul>
<p>Because \(\hat p\) is approximately normal for large \(n\), you can find probabilities like \(P(\hat p\le0.84)\) using a normal distribution with mean \(p\) and SD \(\sqrt{p(1-p)/n}\).</p>`,
  examples: [
    { q: R`\(\hat p\) has mean 0.15 and SD 0.0345. Find \(n\).`, a: R`\(0.0345=\sqrt{0.15(0.85)/n}\Rightarrow n=\frac{0.1275}{0.0345^2}\approx107\)` },
    { q: R`A retailer claims \(p=0.9\). In a sample of 121 orders, 102 were on time. Is the claim reasonable?`, a: R`\(\hat p=0.843\). SD \(=\sqrt{0.9(0.1)/121}=0.0273\). \(P(\hat p\le0.843)\approx0.018\) — unlikely if the claim were true, so the claim is doubtful.` },
  ],
  tips: ['Describe distribution changes using centre, spread and shape.', 'Explain bias in context: say WHO is over- or under-represented.'],
  sim: 'sampling',
},
c: {
  syllabus: [
    'Interval estimates for a parameter',
    'Approximate confidence interval \\(\\left(\\hat p-z\\sqrt{\\hat p(1-\\hat p)/n},\\ \\hat p+z\\sqrt{\\hat p(1-\\hat p)/n}\\right)\\)',
    'Margin of error \\(E=z\\sqrt{\\hat p(1-\\hat p)/n}\\); relationship between margin of error, confidence level and sample size',
    'Most, but not all, confidence intervals contain \\(p\\)',
  ],
  notes: R`
<div class="formula">\[\left(\hat p-z\sqrt{\frac{\hat p(1-\hat p)}{n}},\ \hat p+z\sqrt{\frac{\hat p(1-\hat p)}{n}}\right)\qquad E=z\sqrt{\frac{\hat p(1-\hat p)}{n}}\]</div>
<table class="tbl"><tr><th>Confidence</th><th>90%</th><th>95%</th><th>99%</th></tr><tr><td>z</td><td>1.645</td><td>1.96 (≈2)</td><td>2.576</td></tr></table>
<h3>Relationships</h3>
<ul><li>Higher confidence → larger z → <b>wider</b> interval (larger E).</li>
<li>Larger sample size → <b>narrower</b> interval. To halve E you need 4× the sample.</li>
<li>Given an interval \((L,U)\): \(\hat p=\frac{L+U}{2}\), \(E=\frac{U-L}{2}\).</li>
<li>Sample size for a required margin of error: \(n=\frac{z^2\hat p(1-\hat p)}{E^2}\). With no prior estimate use \(\hat p=0.5\) (largest variability). Always round <b>up</b>.</li></ul>
<h3>Interpreting</h3>
<p>"We are 95% confident that the true proportion lies between 0.5 and 0.7." Over many samples, about 95% of intervals built this way would contain \(p\). If a claimed value lies outside the interval, the claim is not supported.</p>`,
  examples: [
    { q: R`17 of 50 people used public transport. Find an approximate 95% CI.`, a: R`\(\hat p=0.34\). \(E=1.96\sqrt{0.34(0.66)/50}\approx0.131\). CI \(\approx(0.209, 0.471)\).` },
    { q: R`A CI is \((0.62, 0.78)\) using \(z=2\). Find the margin of error and the sample size.`, a: R`\(\hat p=0.7\), \(E=0.08\). \(0.08=2\sqrt{0.7(0.3)/n}\Rightarrow n=\frac{4(0.21)}{0.0064}=131.25\), so about 131.` },
    { q: R`How large a sample for 95% confidence within ±0.05, no prior data?`, a: R`\(n=\frac{1.96^2(0.5)(0.5)}{0.05^2}=384.16\Rightarrow385\)` },
  ],
  tips: ['Round sample sizes UP.', 'Use p̂, not p, in the CI formula.', 'Interpret in context — never say "95% probability that p is in this interval".'],
  sim: 'ci',
},
};

export const FORMULAS = R`
<h3>Differentiation</h3>
\[\frac{d}{dx}x^n=nx^{n-1}\quad \frac{d}{dx}e^{x}=e^x\quad \frac{d}{dx}\ln x=\frac1x\quad \frac{d}{dx}\sin x=\cos x\quad \frac{d}{dx}\cos x=-\sin x\]
\[\text{Chain: }\frac{dy}{dx}=\frac{dy}{du}\frac{du}{dx}\qquad \text{Product: }(uv)'=u'v+uv'\qquad \text{Quotient: }\left(\frac uv\right)'=\frac{u'v-uv'}{v^2}\]
<h3>Integration</h3>
\[\int x^ndx=\frac{x^{n+1}}{n+1}+c\quad \int\frac1xdx=\ln x+c\quad \int e^xdx=e^x+c\quad \int\sin x\,dx=-\cos x+c\quad \int\cos x\,dx=\sin x+c\]
\[\int_a^bf(x)dx=F(b)-F(a)\qquad \int_a^bf(x)dx\approx\frac w2\big[f(x_0)+2(f(x_1)+\dots+f(x_{n-1}))+f(x_n)\big],\ w=\frac{b-a}n\]
<h3>Logarithms</h3>
\[\log_a(mn)=\log_am+\log_an\quad \log_a\frac mn=\log_am-\log_an\quad \log_a m^k=k\log_am\quad a^y=x\iff y=\log_ax\]
<h3>Trigonometry</h3>
\[\frac a{\sin A}=\frac b{\sin B}=\frac c{\sin C}\qquad c^2=a^2+b^2-2ab\cos C\qquad \text{Area}=\tfrac12ab\sin C\qquad \sin^2x+\cos^2x=1\]
<h3>Discrete random variables</h3>
\[E(X)=\sum p_ix_i\quad \mathrm{Var}(X)=\sum p_i(x_i-\mu)^2\quad \text{Bernoulli: }\mu=p,\ \sigma^2=p(1-p)\]
\[\text{Binomial: }P(X=r)=\binom nr p^r(1-p)^{n-r},\ \ \mu=np,\ \ \sigma^2=np(1-p)\]
<h3>Continuous random variables</h3>
\[P(a\le X\le b)=\int_a^bp(x)dx\quad E(X)=\int x\,p(x)dx\quad \mathrm{Var}(X)=\int(x-\mu)^2p(x)dx\quad z=\frac{x-\mu}\sigma\]
<h3>Sampling and confidence intervals</h3>
\[E(\hat p)=p\quad \mathrm{SD}(\hat p)=\sqrt{\frac{p(1-p)}n}\quad \left(\hat p-z\sqrt{\frac{\hat p(1-\hat p)}n},\ \hat p+z\sqrt{\frac{\hat p(1-\hat p)}n}\right)\quad E=z\sqrt{\frac{\hat p(1-\hat p)}n}\]
<p class="muted">This is a revision summary written for this site. In the exam you get the official QCAA formula book — check it matches what you need.</p>`;
