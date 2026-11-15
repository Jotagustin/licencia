#!/usr/bin/env node
/**
 * Reconstruye window.CONASET_QUESTIONS y window.CONASET_EXAM_SETS en questions-db.js
 * combinando las 170 preguntas reales extraídas (pt_1..pt_170) con las preguntas
 * temáticas reestructuradas, eliminando duplicados y corrigiendo sesgos de longitud.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT_DIR = path.join(__dirname, "..");
const DB_PATH = path.join(ROOT_DIR, "questions-db.js");
const BANCO_PATH = path.join(ROOT_DIR, "banco_preguntas.json");
const MATERIAL_PATH = path.join(ROOT_DIR, "material_clase_b_completo.json");
const PT_REWRITES_PATH = path.join(__dirname, "data", "pt_rewrites.json");
const EXTRA_QUESTIONS_PATH = path.join(__dirname, "data", "extra_questions.json");

const EXAM_CATEGORY_SLUGS = [
  {
    key: "official-day",
    title: "Examen Oficial del Día",
    description: "Selección oficial municipal del día (35 preguntas extraídas)",
    sourceTitle: "Examen Oficial del Día (Clase B - Municipal)"
  },
  {
    key: "hardest-35",
    title: "Las 35 Preguntas Más Difíciles",
    description: "Las 35 preguntas municipales con mayor tasa de error",
    sourceTitle: "Las 35 Preguntas Más Difíciles"
  },
  {
    key: "easiest-35",
    title: "Las 35 Preguntas Más Fáciles",
    description: "Las 35 preguntas municipales base de mayor acierto",
    sourceTitle: "Las 35 Preguntas Más Fáciles"
  },
  {
    key: "municipal-11-11",
    title: "Examen Municipal 11-11-2026",
    description: "Test municipal completo extraído (35 preguntas)",
    sourceTitle: "Examen Municipal 11-11-2026"
  },
  {
    key: "municipal-10-11",
    title: "Examen Municipal 10-11-2026",
    description: "Test municipal completo extraído (35 preguntas)",
    sourceTitle: "Examen Municipal 10-11-2026"
  }
];

function loadExistingDb() {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(DB_PATH, "utf8"), ctx);
  return {
    chapters: ctx.window.CONASET_CHAPTERS,
    questions: ctx.window.CONASET_QUESTIONS,
    signs: ctx.window.CONASET_SIGNS
  };
}

function buildExamSetsMap(banco, material) {
  const codeToPtId = new Map();
  banco.forEach((item, idx) => {
    codeToPtId.set(item.code, `pt_${idx + 1}`);
  });

  const examsByCategory = material.examenes_por_categoria || {};
  const questionExamSets = new Map();
  const examSets = [];

  for (const meta of EXAM_CATEGORY_SLUGS) {
    const cat = examsByCategory[meta.sourceTitle];
    if (!cat || !Array.isArray(cat.preguntas)) {
      throw new Error(`Missing category in material_clase_b_completo.json: ${meta.sourceTitle}`);
    }
    const questionIds = cat.preguntas.map((p) => {
      const ptId = codeToPtId.get(p.code);
      if (!ptId) {
        throw new Error(`Unmapped question code "${p.code}" in ${meta.sourceTitle}`);
      }
      if (!questionExamSets.has(ptId)) {
        questionExamSets.set(ptId, []);
      }
      questionExamSets.get(ptId).push(meta.key);
      return ptId;
    });

    examSets.push({
      key: meta.key,
      title: meta.title,
      description: meta.description,
      questionIds
    });
  }

  return { examSets, questionExamSets };
}

function applyPtRewrites(existingPtQuestions, ptRewrites, questionExamSets) {
  return existingPtQuestions.map((orig) => {
    const patch = ptRewrites[orig.id] || {};
    const options = patch.options || orig.options;
    const correct = patch.correct !== undefined ? patch.correct : orig.correct;
    const explanation = patch.explanation || orig.explanation;
    const optionExplanations = patch.optionExplanations || orig.optionExplanations;

    if (options.length !== optionExplanations.length) {
      throw new Error(`optionExplanations length mismatch on ${orig.id}`);
    }

    return {
      id: orig.id,
      chapter: patch.chapter !== undefined ? patch.chapter : orig.chapter,
      doublePoints: patch.doublePoints !== undefined ? patch.doublePoints : orig.doublePoints,
      category: patch.category || orig.category,
      source: "extracted",
      examSets: questionExamSets.get(orig.id) || [],
      question: patch.question || orig.question,
      options,
      correct,
      explanation,
      image: patch.image !== undefined ? patch.image : orig.image,
      localFallback: patch.localFallback !== undefined ? patch.localFallback : orig.localFallback,
      optionExplanations
    };
  });
}

function normalizeExtraQuestions(extraQuestions) {
  return extraQuestions.map((q) => {
    if (!Array.isArray(q.options) || q.options.length !== 3) {
      throw new Error(`Expected 3 options on restructured question ${q.id}`);
    }
    if (!Array.isArray(q.optionExplanations) || q.optionExplanations.length !== 3) {
      throw new Error(`Expected 3 optionExplanations on restructured question ${q.id}`);
    }
    return {
      ...q,
      source: "restructured",
      examSets: []
    };
  });
}

function printBiasReport(questions) {
  let prose = 0;
  let strictlyLongest = 0;
  let strictlyShortest = 0;
  let correctLenSum = 0;
  let distractorLenSum = 0;
  let distractorCount = 0;

  for (const q of questions) {
    const lens = q.options.map((o) => o.length);
    const isFormulaic =
      q.options.every((o) => /^(I+|Solo|Ambas|Todas|Ninguna|Verdadero|Falso)/i.test(o.trim())) ||
      Math.max(...lens) < 22;
    if (isFormulaic) continue;

    prose++;
    const cLen = lens[q.correct];
    const dLens = lens.filter((_, i) => i !== q.correct);
    if (cLen > Math.max(...dLens)) strictlyLongest++;
    if (cLen < Math.min(...dLens)) strictlyShortest++;
    correctLenSum += cLen;
    distractorLenSum += dLens.reduce((a, b) => a + b, 0);
    distractorCount += dLens.length;
  }

  console.log(
    `Rebuilt ${questions.length} questions (${prose} prose): strictlyLongest=${strictlyLongest} (${(
      (strictlyLongest / prose) *
      100
    ).toFixed(1)}%), strictlyShortest=${strictlyShortest} (${(
      (strictlyShortest / prose) *
      100
    ).toFixed(1)}%), avgCorrect=${(correctLenSum / prose).toFixed(1)} chars, avgDistractor=${(
      distractorLenSum / distractorCount
    ).toFixed(1)} chars`
  );
}

function main() {
  const { chapters, questions: existingQuestions, signs } = loadExistingDb();
  const banco = JSON.parse(fs.readFileSync(BANCO_PATH, "utf8"));
  const material = JSON.parse(fs.readFileSync(MATERIAL_PATH, "utf8"));
  const ptRewrites = JSON.parse(fs.readFileSync(PT_REWRITES_PATH, "utf8"));
  const extraRaw = JSON.parse(fs.readFileSync(EXTRA_QUESTIONS_PATH, "utf8"));

  const { examSets, questionExamSets } = buildExamSetsMap(banco, material);
  const ptExisting = existingQuestions.filter((q) => String(q.id).startsWith("pt_"));
  const ptUpdated = applyPtRewrites(ptExisting, ptRewrites, questionExamSets);
  const extraUpdated = normalizeExtraQuestions(extraRaw);

  const combined = [...ptUpdated, ...extraUpdated];
  combined.sort((a, b) => a.chapter - b.chapter);

  const output = [
    "// Base de datos completa de capítulos, preguntas oficiales, señales y exámenes CONASET 2026",
    `window.CONASET_CHAPTERS = ${JSON.stringify(chapters, null, 2)};`,
    "",
    `window.CONASET_QUESTIONS = ${JSON.stringify(combined, null, 2)};`,
    "",
    `window.CONASET_SIGNS = ${JSON.stringify(signs, null, 2)};`,
    "",
    `window.CONASET_EXAM_SETS = ${JSON.stringify(examSets, null, 2)};`,
    ""
  ].join("\n");

  fs.writeFileSync(DB_PATH, output, "utf8");
  printBiasReport(combined);
}

main();
