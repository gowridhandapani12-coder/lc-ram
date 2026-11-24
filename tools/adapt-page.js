// Adapts a finished Leaving Cert Study Lab physics page into this site:
// node tools/adapt-page.js <source.html> <config.json>
// Replaces the course sidebar with this site's chapter list, renames storage keys, title and brand line.
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const [,, srcPath, cfgPath] = process.argv;
const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
let t = fs.readFileSync(srcPath, "utf8");
const CH = JSON.parse(fs.readFileSync(path.join(ROOT, "physics", "chapters.json"), "utf8"));
const sidebar = here => CH.map(ch => `      <details${ch.sections.some(s=>s[0]===here)?" open":""}><summary>${ch.n} · ${ch.title}</summary><ol>${
  (ch.sections.length? ch.sections : [["", "Sections coming soon"]]).map(([n,name,f]) => n===here ? `<li class="here"><span class="mono">${n}</span>${name}</li>`
    : f && fs.existsSync(path.join(ROOT,"physics",f)) ? `<li class="link"><a href="${f}"><span class="mono">${n}</span>${name}</a></li>`
    : `<li><span class="mono">${n}</span>${name}</li>`).join("")}</ol></details>`).join("\n") +
  `\n      <p class="soon">Bold sections are ready. Others are coming soon. Chapters follow Real World Physics (2nd edition).</p>`;
const rep = (a, b) => { if (!t.includes(a)) throw "missing " + a; t = t.split(a).join(b); };
t = t.replace(/(<h4>)Full course(<\/h4>\n)[\s\S]*?(\n    <\/div>\n  <\/aside>)/, (m, a, b, c) => a + "Chapters" + b + sidebar(cfg.section) + c);
rep(`"${cfg.oldPrefix}`, `"${cfg.prefix}`); rep('"rl-theme"', '"lr-theme"'); rep('"rl-font"', '"lr-font"');
t = t.replace(/<title>[^<]*<\/title>/, `<title>${cfg.title}</title>`);
t = t.replace(/(<div class="brand">[\s\S]*?<b>)[^<]*(<\/b><span>)[^<]*(<\/span>)/, `$1${cfg.brand}$2${cfg.brandSub}$3`);
for (const [a, b] of cfg.replace || []) rep(a, b);
t = t.split("<!--subj-nav-->").map((part,i)=> i===0? part : part.slice(part.indexOf("<!--/subj-nav-->")+16).replace(/^\r?\n[ \t]*/,"")).join("");
fs.writeFileSync(path.join(ROOT, "physics", cfg.out), t);
fs.writeFileSync(path.join(require("os").tmpdir(), "lcram-check.js"), t.match(/<script>([\s\S]*)<\/script>/)[1]);
console.log("adapted", cfg.out);
