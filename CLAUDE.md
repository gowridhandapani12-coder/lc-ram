# LC Ram

Free, interactive Leaving Cert study pages organised by textbook chapter, in the same design as the Leaving Cert Study
Lab (`..\leaving-cert-study`). GitHub: `gowridhandapani12-coder/lc-ram` (public). Live site (GitHub Pages, from `main`):
https://gowridhandapani12-coder.github.io/lc-ram/

## Subjects

| Folder | Subject | Structure |
|--------|---------|-----------|
| `physics/` | Physics | Chapters and sections of *Real World Physics*, 2nd edition (Folens). Plan: `physics/COURSE-PLAN.md` |

## Source material and copyright

- The user chose *Real World Physics* (2nd edition, Folens) as the syllabus structure. It's a paid ebook on
  https://library.folens.ie (MY FOLENS login; the user signs in, in their own Chrome). Use it only for the chapter and
  section titles, the order of topics and what each section covers. **Never copy its text, figures, worked examples or
  exercises.** All explanations, labs and questions on these pages are original.
- Chapter list: `physics/chapters.json` (chapters 1–25 from the contents pages; sections listed for chapters 1–2 so
  far; read further contents pages to add more).
- Assessment info follows the new Physics specification (written exam 60%, Physics in Practice Investigation 40%).
  Practice questions are labelled as not official SEC papers.

## How pages are built

- `tools/templates/<page>.html` + `<page>.json` → `node tools/build-page.js tools/templates/<page>.html tools/templates/<page>.json`
  writes `physics/<file>.html`. Templates contain only the page's own data, labs and text; `@@INC start ||| end@@`
  copies the shared blocks (head/CSS, top bar, flashcards, quiz, glossary, router, theme) from
  `tools/reference-page.html` (a copy of the Study Lab's Applied Maths 1.1 page), and `@@SIDEBAR:<section>@@` becomes
  the chapter list from `physics/chapters.json`. Rebuild older pages after adding one so their sidebars link to it.
- Then `node tools/site.js` adds the subject tabs and regenerates `index.html` and `physics/index.html`.
- File names: `ch<chapter>-<section>-<slug>.html`. localStorage prefix `lr<chapter><section>-` (e.g. `lr13-`);
  theme/font keys `lr-theme` / `lr-font`.

## Run it locally

`node server.js`, then http://localhost:5191. Preview config "lcram" (in `..\leaving-cert-study\.claude\launch.json`).

## Quality checks

Same as the Study Lab (`..\leaving-cert-study\physics\CLAUDE.md`): `node --check` the page script, open every tab and
lab (front the browser tab so canvases have a size), no console errors, no horizontal scroll at 375 px, verify every
quiz answer and trainer solution by hand. Then commit (`Add physics <section> page`) and push.

## Usage budget

The user is on the Pro plan and needs most of the weekly allowance for other work. Build only when asked.
