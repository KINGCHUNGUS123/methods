# Mathematical Methods Hub

Interactive revision site for QCAA Mathematical Methods Units 3 & 4 (2025 syllabus).

- **Learn**: 10 topic lessons (syllabus dot points, notes, formulas, worked examples, exam tips) and an interactive model for each topic
- **Question bank**: all 232 QCAA external exam questions 2020–2025 (120 multiple choice, 112 short response), each with
  - its syllabus topic
  - a difficulty label: **SF** simple familiar, **CF** complex familiar, **CU** complex unfamiliar
  - a suggested time (each paper's times add up to about 90 minutes)
  - the official answer (MC) or marking guide and sample response (SR)
- **Past papers**: exam mode with 5 min perusal plus 90 min working, then self-marking against the guide
- **Progress**: saved in the browser, per topic and per difficulty; reset or back up with a progress code
- **custom.js**: add your own questions

## Files (flat, no folders)

| File | What it is |
|---|---|
| index.html | page shell |
| main.js | app (pages, question bank, exam mode, progress) |
| content.js | lessons and formula summary |
| sims.js | interactive models |
| custom.js | your own questions |
| style.css | styles (light and dark) |
| exams.json | question index: topic, SF/CF/CU, marks, time, MC answers |
| ex-2020.json to ex-2025.json | question and marking-guide images |
| package.json, vite.config.js | Vite build setup |

## Put it online (GitHub, then Bolt)

1. On GitHub, create a new repository (it can be private), click **Add file → Upload files**, drag in all 16 files, and commit.
2. In Bolt (bolt.new), import the GitHub repository.
3. Ask Bolt: "install dependencies and run the dev server". Check it works.
4. Click **Publish**.

Run it locally instead: `npm install`, then `npm run dev`.

## Changing difficulty labels or times

Labels and times are stored in `exams.json` (`cls` = SF/CF/CU, `time` = minutes). QCAA doesn't publish which questions are SF, CF or CU, so every label is a judgement made against the syllabus definitions, balanced so each paper is close to the 60/20/20 split.

Past exam questions and marking guides © State of Queensland (QCAA), used under CC BY 4.0.
