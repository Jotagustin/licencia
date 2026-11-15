const fs = require("fs");
const vm = require("vm");
const assert = require("assert");

const dbCode = fs.readFileSync("questions-db.js", "utf8");
const ctx = { window: {} };
vm.runInNewContext(dbCode, ctx);

const chapters = ctx.window.CONASET_CHAPTERS;
const questions = ctx.window.CONASET_QUESTIONS;
const signs = ctx.window.CONASET_SIGNS;
const examSets = ctx.window.CONASET_EXAM_SETS;

assert(Array.isArray(chapters) && chapters.length === 9, `Expected 9 chapters, got ${chapters && chapters.length}`);
assert(Array.isArray(questions) && questions.length >= 250, `Expected >= 250 questions, got ${questions && questions.length}`);
assert(Array.isArray(signs) && signs.length === 138, `Expected 138 signs, got ${signs && signs.length}`);
assert(Array.isArray(examSets) && examSets.length === 5, `Expected 5 examSets, got ${examSets && examSets.length}`);

const validChapterIds = new Set(chapters.map((c) => c.id));
let chapterQuestionSum = 0;
for (const ch of chapters) {
  const chQs = questions.filter((q) => q.chapter === ch.id);
  chapterQuestionSum += chQs.length;
  assert(chQs.length >= 10, `Chapter ${ch.id} has only ${chQs.length} questions`);
  for (const ill of ch.illustrations || []) {
    assert(fs.existsSync(ill.src), `Missing chapter illustration: ${ill.src}`);
  }
}
assert(chapterQuestionSum === questions.length, `Chapter sum mismatch: ${chapterQuestionSum} !== ${questions.length}`);

// Validate Tema 10 (Anexos y definiciones) is represented in Chapter 9
const anexoQs = questions.filter((q) => q.chapter === 9 && /definiciones|anexo/i.test(q.category));
assert(anexoQs.length >= 4, `Expected >= 4 Anexos y definiciones questions in Ch 9, got ${anexoQs.length}`);

const seenIds = new Set();
let withImgCount = 0;
let withoutImgCount = 0;
let proseCount = 0;
let strictlyLongestCount = 0;
let correctLenSum = 0;
let distractorLenSum = 0;
let distractorCount = 0;

for (const q of questions) {
  assert(q.id && !seenIds.has(q.id), `Duplicate or missing question id: ${q.id}`);
  seenIds.add(q.id);
  assert(validChapterIds.has(q.chapter), `Invalid chapter ${q.chapter} in ${q.id}`);
  assert(Array.isArray(q.options) && q.options.length >= 2, `Invalid options in ${q.id}`);
  assert(typeof q.correct === "number" && q.correct >= 0 && q.correct < q.options.length, `Invalid correct index in ${q.id}`);
  assert(q.explanation && q.explanation.length > 10, `Missing explanation in ${q.id}`);
  assert(
    Array.isArray(q.optionExplanations) && q.optionExplanations.length === q.options.length,
    `Invalid optionExplanations length in ${q.id}`
  );
  assert(
    !/Cap[ií]tulo\s+\d+|P[aá]gs?\.\s*\d+|PracticaTest|C[oó]digo\s+[a-zA-Z0-9]+/i.test(q.explanation),
    `Disallowed manual/code ref in ${q.id} explanation`
  );
  assert(
    !/^(De acuerdo con el cuadro oficial|Observe la l[aá]mina|Seg[uú]n la infograf[ií]a oficial)/i.test(q.question),
    `Generic textbook stem found in ${q.id}: ${q.question}`
  );

  if (q.image !== null) {
    assert(typeof q.image === "string" && fs.existsSync(q.image), `Missing question image: ${q.image} in ${q.id}`);
    assert(q.localFallback && fs.existsSync(q.localFallback), `Missing localFallback: ${q.localFallback} in ${q.id}`);
    withImgCount++;
  } else {
    withoutImgCount++;
  }

  if (/\b(en la imagen|esta señal|estas señales|se observa|se aprecia|mostrada|la figura|observe la|gráfico|infografía)\b/i.test(q.question)) {
    assert(q.image, `Visual question ${q.id} is missing an image: ${q.question}`);
  }

  assert(q.image !== "assets/pdf-images/pdf-106-239.png", `Disallowed reflective-vest image on ${q.id}`);
  assert(q.image !== "assets/pdf-images/pdf-095-209.png", `Disallowed vias-reversibles image on ${q.id}`);
  if (q.image === "assets/pdf-images/pdf-168-685.png") {
    assert(/licencia|documentos|examen|municipalidad/i.test(q.question), `License image misused on ${q.id}`);
  }

  // Anti-length-bias validation for prose questions
  const lens = q.options.map((o) => o.length);
  const isFormulaic =
    q.options.every((o) => /^(I+|Solo|Ambas|Todas|Ninguna|Verdadero|Falso)/i.test(o.trim())) ||
    Math.max(...lens) < 22;

  if (!isFormulaic) {
    proseCount++;
    const cLen = lens[q.correct];
    const dLens = lens.filter((_, i) => i !== q.correct);
    const maxD = Math.max(...dLens);
    const minD = Math.min(...dLens);
    if (cLen > maxD) strictlyLongestCount++;
    correctLenSum += cLen;
    distractorLenSum += dLens.reduce((a, b) => a + b, 0);
    distractorCount += dLens.length;

    assert(cLen / maxD <= 1.25, `Length bias (too long) on ${q.id}: correct=${cLen}, maxD=${maxD}`);
    assert(cLen / minD >= 0.70, `Length bias (too short) on ${q.id}: correct=${cLen}, minD=${minD}`);
  }
}

const strictlyLongestPct = (strictlyLongestCount / proseCount) * 100;
const avgCorrect = correctLenSum / proseCount;
const avgDistractor = distractorLenSum / distractorCount;
const avgRelDiff = Math.abs(avgCorrect - avgDistractor) / avgDistractor;

assert(
  strictlyLongestPct >= 20 && strictlyLongestPct <= 42,
  `Expected prose strictlyLongest rate between 20% and 42%, got ${strictlyLongestPct.toFixed(1)}%`
);
assert(
  avgRelDiff <= 0.10,
  `Average correct (${avgCorrect.toFixed(1)}) vs distractor (${avgDistractor.toFixed(1)}) differs by >10%`
);

// Validate all 5 real extracted exam sets
for (const setObj of examSets) {
  assert(setObj.key && setObj.title && Array.isArray(setObj.questionIds), `Invalid examSet: ${JSON.stringify(setObj)}`);
  assert(setObj.questionIds.length === 35, `Expected 35 questions in ${setObj.key}, got ${setObj.questionIds.length}`);
  const uniqueInSet = new Set(setObj.questionIds);
  assert(uniqueInSet.size === 35, `Duplicate questions in examSet ${setObj.key}`);
  for (const qId of setObj.questionIds) {
    assert(seenIds.has(qId), `ExamSet ${setObj.key} references missing question ${qId}`);
  }
}

// Validate all 138 signs
const seenCodes = new Set();
for (const s of signs) {
  assert(s.code && !seenCodes.has(s.code), `Duplicate or missing sign code: ${s.code}`);
  seenCodes.add(s.code);
  assert(s.name && s.category && s.description && s.image_url, `Missing sign metadata in ${s.code}`);
}

console.log(
  `PASS: ${chapters.length} chapters (${chapterQuestionSum} qs), ${withImgCount} with image, ${withoutImgCount} sin imagen, ${examSets.length} examSets, ${signs.length} signs. Anti-bias: strictlyLongest=${strictlyLongestPct.toFixed(1)}% (${strictlyLongestCount}/${proseCount}), avgC=${avgCorrect.toFixed(1)} vs avgD=${avgDistractor.toFixed(1)}.`
);
