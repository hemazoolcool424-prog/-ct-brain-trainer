// CT Brain Trainer: منطق التدريب والتقييم
// الصور تُحمَّل من مجلد cases/ بعد تحويلها من DICOM لـ PNG (brain window: WL 40، WW 80)

const CASES = [
  {
    id: "CB-H-001",
    image: "cases/CB-H-001.png",
    answer: "Epidural hematoma",
    options: ["Epidural hematoma", "Subdural hematoma", "Subarachnoid hemorrhage", "Intraparenchymal hemorrhage", "طبيعي"],
    explain: "نزيف epidural: شكل عدسي (biconvex) بين الجمجمة والسحايا، ويتوقف عند الـ suture ولا يعبره."
  },
  {
    id: "CB-H-002",
    image: "cases/CB-H-002.png",
    answer: "Subdural hematoma",
    options: ["Epidural hematoma", "Subdural hematoma", "Subarachnoid hemorrhage", "Intraparenchymal hemorrhage", "طبيعي"],
    explain: "نزيف subdural: شكل هلالي (crescentic) بين السحايا والمخ، ويعبر الـ suture لكن لا يعبر الـ falx."
  }
];

const STORAGE_KEY = "ctBrainTrainer.results.v1";
let index = 0;
let answered = false;

function loadResults() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { total: 0, correct: 0 }; }
  catch (e) { return { total: 0, correct: 0 }; }
}

function saveResults(r) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(r)); } catch (e) {}
}

function render() {
  const c = CASES[index];
  answered = false;
  document.getElementById("counter").textContent = `حالة ${index + 1} من ${CASES.length}`;
  document.getElementById("scan").src = c.image;
  document.getElementById("explain").textContent = "";
  document.getElementById("next").style.display = "none";

  const opts = document.getElementById("opts");
  opts.innerHTML = "";
  c.options.forEach(opt => {
    const b = document.createElement("button");
    b.textContent = opt;
    b.onclick = () => choose(opt, b);
    opts.appendChild(b);
  });
  showScore();
}

function choose(opt, btn) {
  if (answered) return;
  answered = true;
  const c = CASES[index];
  const r = loadResults();
  r.total += 1;
  const ok = opt === c.answer;
  if (ok) r.correct += 1;
  saveResults(r);

  btn.classList.add(ok ? "correct" : "wrong");
  document.querySelectorAll("#opts button").forEach(b => {
    if (b.textContent === c.answer) b.classList.add("correct");
    b.disabled = true;
  });
  document.getElementById("explain").textContent =
    (ok ? "إجابة صحيحة. " : `الإجابة الصحيحة: ${c.answer}. `) + c.explain;
  document.getElementById("next").style.display = "block";
  showScore();
}

function showScore() {
  const r = loadResults();
  const pct = r.total ? Math.round((r.correct / r.total) * 100) : 0;
  document.getElementById("score").textContent =
    `النتيجة: ${r.correct} من ${r.total} (${pct}%)`;
}

document.getElementById("next").onclick = () => {
  index = (index + 1) % CASES.length;
  render();
};

render();
