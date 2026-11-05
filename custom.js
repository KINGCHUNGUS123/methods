// ─────────────────────────────────────────────────────────────
//  MY OWN QUESTIONS
//  Add your own practice questions here. They appear in the
//  Question bank under "My questions" and on each topic page.
//
//  topic: d1 d2 d3 i1 r1 i2 t n s c   (see the Learn page)
//  cls:   'SF' | 'CF' | 'CU'
//  type:  'MC' (give options + answer letter) or 'SR' (give a worked solution)
//  Maths can be written in TeX between \( and \)  — remember to
//  double the backslashes inside normal quotes, e.g. '\\(e^{2x}\\)'.
// ─────────────────────────────────────────────────────────────
export const CUSTOM = [
  {
    id: 'my-1', topic: 'd1', cls: 'SF', type: 'MC', marks: 1, time: 1.5,
    q: 'Differentiate \\(y=e^{5x}\\).',
    options: { A: '\\(e^{5x}\\)', B: '\\(5e^{5x}\\)', C: '\\(5xe^{5x-1}\\)', D: '\\(\\tfrac15e^{5x}\\)' },
    answer: 'B',
  },
  {
    id: 'my-2', topic: 'i2', cls: 'SF', type: 'SR', marks: 3, time: 4,
    q: 'Determine the area enclosed between \\(y=4-x^2\\) and the x-axis.',
    solution: 'x-intercepts \\(x=\\pm2\\). Area \\(=\\int_{-2}^{2}(4-x^2)\\,dx=\\left[4x-\\tfrac{x^3}{3}\\right]_{-2}^{2}=\\tfrac{16}{3}-\\left(-\\tfrac{16}{3}\\right)=\\tfrac{32}{3}\\) units².',
  },
];
