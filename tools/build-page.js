// Builds a chapter page from a template: node tools/build-page.js <template.html> <config.json>
// Templates use @@INC start ||| end@@ to copy shared blocks (top bar, flashcards, quiz, glossary, router, etc.) from
// the reference page below, so every page behaves identically. @@SIDEBAR:<section>@@ becomes the chapter list.
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const REF = path.join(ROOT, "tools", "reference-page.html");
const [,, tplPath, cfgPath] = process.argv;
const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
const src = fs.readFileSync(REF, "utf8");
let t = fs.readFileSync(tplPath, "utf8");
const SUBJ = cfg.subject || "physics";
const CH = JSON.parse(fs.readFileSync(path.join(ROOT, SUBJ, "chapters.json"), "utf8"));
const sidebar = here => CH.map(ch => `      <details${ch.n===here||ch.sections.some(s=>s[0]===here)?" open":""}><summary>${ch.n} · ${ch.title}</summary><ol>${
  (ch.sections.length? ch.sections : [["", "Sections coming soon"]]).map(([n,name,f]) => n===here ? `<li class="here"><span class="mono">${n}</span>${name}</li>`
    : (f=f||ch.file) && fs.existsSync(path.join(ROOT,SUBJ,f)) ? `<li class="link"><a href="${f}"><span class="mono">${n}</span>${name}</a></li>`
    : `<li><span class="mono">${n}</span>${name}</li>`).join("")}</ol></details>`).join("\n") +
  `\n      <p class="soon">${cfg.bookNote || "Bold sections are ready. Others are coming soon. Chapters follow Real World Physics (2nd edition)."}</p>`;
t = t.replace(/@@SIDEBAR:([\d.]+)@@/g, (m, s) => sidebar(s));
t = t.replace(/@@INC ([\s\S]*?) \|\|\| ([\s\S]*?)@@/g, (m, a, b) => { const i = src.indexOf(a); if (i < 0) throw "start " + a; const j = b === "</html>" ? src.length : src.indexOf(b, i + a.length); if (j < 0) throw "end " + b; return src.slice(i, j); });
const rep = (a, b) => { if (!t.includes(a)) throw "missing " + a; t = t.split(a).join(b); };
rep("am11-", cfg.prefix); rep('"am-theme"', '"lr-theme"'); rep('"am-font"', '"lr-font"');
rep("<title>Mathematical Modelling Lab</title>", `<title>${cfg.title}</title>`);
rep("<b>Mathematical Modelling</b><span>Leaving Cert Applied Maths · Strand 1</span>", `<b>${cfg.brand}</b><span>${cfg.brandSub}</span>`);
rep('lab = "cycle"', `lab = "${cfg.firstLab}"`);
if (cfg.pType) rep('let pType="line"', `let pType="${cfg.pType}"`);
rep('>Mathematical</text>', `>${cfg.mm[0]}</text>`); rep('>modelling</text>', `>${cfg.mm[1]}</text>`);
rep("Search: assumption, residual, iterate…", cfg.search);
if (SUBJ === "physics") { rep("20% of your grade", "40% of your grade"); rep("Modelling project skills", "Investigation skills");
rep("What the spec's assessment criteria reward at a high level. Tick them off as you practise.", "Skills the Physics in Practice Investigation rewards. Tick them off as you practise."); }
if (cfg.feedback) rep("Write the model first, check your units (m³ → L, s → h), and round only at the end. Try again or show the solution.", cfg.feedback);
rep("function rr(ctx,x,y,w,h,r){ r=Math.min(r,h/2,w/2);", "function rr(ctx,x,y,w,h,r){ if(w<0){ x+=w; w=-w; } if(h<0){ y+=h; h=-h; } r=Math.max(0,Math.min(r,h/2,w/2));");
rep('const glFirst = g => /[A-Za-z]/.test(g.t[0]) ? g.t[0].toUpperCase() : "#";', 'const glFirst = g => { const c=g.t[0].normalize("NFD")[0]; return /[A-Za-z]/.test(c) ? c.toUpperCase() : "#"; };');
// strip the other site's subject tabs; tools/site.js adds this site's own
t = t.split("<!--subj-nav-->").map((part,i)=> i===0? part : part.slice(part.indexOf("<!--/subj-nav-->")+16).replace(/^\r?\n[ \t]*/,"")).join("");
if (t.includes("@@")) throw "leftover @@";
fs.writeFileSync(path.join(ROOT, SUBJ, cfg.out), t);
fs.writeFileSync(path.join(require("os").tmpdir(), "lcram-check.js"), t.match(/<script>([\s\S]*)<\/script>/)[1]);
console.log("built", cfg.out, t.length);
