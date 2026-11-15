const fs = require("fs");
const vm = require("vm");

const DB_PATH = "questions-db.js";
const raw = fs.readFileSync(DB_PATH, "utf8");
const ctx = { window: {} };
vm.runInNewContext(raw, ctx);

const chapters = ctx.window.CONASET_CHAPTERS;
const questions = ctx.window.CONASET_QUESTIONS;
const signs = ctx.window.CONASET_SIGNS;

// 1. Reassign the 10 Chapter 10 questions into their valid CONASET chapters (1..9)
const CHAPTER_REMAP = {
  pt_1: 6,   // Líneas transversales -> Normas de circulación
  pt_8: 2,   // Luz alta -> Principios de la conducción
  pt_22: 6,  // Estacionamiento rural de emergencia -> Normas de circulación
  pt_31: 6,  // Demarcaciones de símbolos y leyendas -> Normas de circulación
  pt_53: 6,  // Tachas rojas -> Normas de circulación
  pt_78: 4,  // Perspectiva lineal -> La persona en el tránsito
  pt_139: 6, // Estacionar en subida -> Normas de circulación
  pt_152: 9, // Qué es una Vía -> Informaciones importantes y anexos
  pt_166: 6, // Detenerse antes de virar a la izquierda -> Normas de circulación
  pt_167: 6  // Ubicación en vía bidireccional para virar a la izquierda -> Normas de circulación
};

// 2. Clean text prefixes where stray copy-paste mentioned wrong images or omitted diagrams
const QUESTION_TEXT_FIXES = {
  q_pdf_33:
    "Al conducir con neblina espesa, ¿por qué se deben usar las luces bajas (y neblineros si los tiene) en lugar de las luces altas?",
  q_pdf_35:
    "Si una persona herida en un siniestro está inconsciente pero respira con normalidad y no presenta trauma evidente que impida su evaluación, ¿qué busca la posición lateral de seguridad?"
};

// 3. Visually verified image-to-question assignment (null when purely conceptual without an exact diagram)
const VERIFIED_IMAGES = {
  // Chapter 1
  q105: "assets/pdf-images/pdf-009-vec.png",
  q_pdf_01: "assets/pdf-images/pdf-007-vec.png",
  q_pdf_02: "assets/pdf-images/pdf-009-vec.png",
  pt_36: "assets/pdf-images/pdf-038-073.png",
  pt_70: "assets/pdf-images/pdf-007-vec.png",
  pt_79: "assets/pdf-images/pdf-038-073.png",
  pt_122: "assets/pdf-images/pdf-038-073.png",
  pt_40: "assets/pdf-images/pdf-027-053.png",
  pt_170: "assets/pdf-images/pdf-092-197.png",

  // Chapter 2
  q201: "assets/pdf-images/pdf-024-047.png",
  q202: "assets/pdf-images/pdf-024-047.png",
  q203: "assets/pdf-images/pdf-019-023.png",
  q204: "assets/pdf-images/pdf-019-023.png",
  q205: "assets/pdf-images/pdf-019-023.png",
  q206: "assets/pdf-images/pdf-014-013.png",
  q207: "assets/pdf-images/pdf-027-053.png",
  q208: "assets/pdf-images/pdf-031-071.png",
  q210: "assets/pdf-images/pdf-011-003.png",
  q212: "assets/pdf-images/pdf-024-047.png",
  q213: "assets/pdf-images/pdf-021-042.png",
  q_pdf_03: "assets/pdf-images/pdf-011-003.png",
  q_pdf_05: "assets/pdf-images/pdf-020-025.png",
  q_pdf_06: "assets/pdf-images/pdf-021-042.png",
  q_pdf_07: "assets/pdf-images/pdf-024-047.png",
  q_pdf_08: "assets/pdf-images/pdf-030-070.png",
  pt_3: "assets/pdf-images/pdf-019-023.png",
  pt_8: "assets/pdf-images/pdf-020-025.png",
  pt_12: "assets/pdf-images/pdf-024-047.png",
  pt_16: "assets/pdf-images/pdf-027-053.png",
  pt_27: "assets/pdf-images/pdf-021-042.png",
  pt_38: "assets/pdf-images/pdf-014-013.png",
  pt_42: "assets/pdf-images/pdf-025-049.png",
  pt_52: "assets/pdf-images/pdf-024-047.png",
  pt_91: "assets/pdf-images/pdf-026-051.png",
  pt_92: "assets/pdf-images/pdf-024-047.png",
  pt_98: "assets/pdf-images/pdf-114-258.png",
  pt_137: "assets/pdf-images/pdf-019-023.png",
  pt_147: "assets/pdf-images/pdf-024-047.png",
  pt_150: "assets/pdf-images/pdf-024-047.png",
  pt_159: "assets/pdf-images/pdf-024-047.png",
  pt_169: "assets/pdf-images/pdf-025-049.png",

  // Chapter 3
  q302: "assets/pdf-images/pdf-097-vec.png",
  q304: "assets/pdf-images/pdf-083-171.png",
  q_pdf_09: "assets/pdf-images/pdf-034-vec.png",
  q_pdf_10: "assets/pdf-images/pdf-097-vec.png",
  pt_93: "assets/pdf-images/pdf-084-176.png",

  // Chapter 4
  q401: "assets/pdf-images/pdf-050-table.png",
  q402: "assets/pdf-images/pdf-050-table.png",
  q403: "assets/pdf-images/pdf-050-vec.png",
  q404: "assets/pdf-images/pdf-052-080.png",
  q405: "assets/pdf-images/pdf-052-080.png",
  q406: "assets/pdf-images/pdf-044-078.png",
  q407: "assets/pdf-images/pdf-034-vec.png",
  q408: "assets/pdf-images/pdf-034-vec.png",
  q_pdf_11: "assets/pdf-images/pdf-044-078.png",
  q_pdf_12: "assets/pdf-images/pdf-050-vec.png",
  q_pdf_13: "assets/pdf-images/pdf-052-080.png",
  pt_35: "assets/pdf-images/pdf-034-vec.png",
  pt_43: "assets/pdf-images/pdf-034-vec.png",
  pt_56: "assets/pdf-images/pdf-034-vec.png",
  pt_68: "assets/pdf-images/pdf-043-076.png",
  pt_74: "assets/pdf-images/pdf-034-vec.png",
  pt_75: "assets/pdf-images/pdf-034-vec.png",
  pt_77: "assets/pdf-images/pdf-034-vec.png",
  pt_99: "assets/pdf-images/pdf-050-table.png",
  pt_101: "assets/pdf-images/pdf-034-vec.png",
  pt_130: "assets/pdf-images/pdf-050-table.png",
  pt_168: "assets/pdf-images/pdf-050-table.png",

  // Chapter 5
  q501: "assets/pdf-images/pdf-075-097.png",
  q502: "assets/pdf-images/pdf-075-097.png",
  q503: "assets/pdf-images/pdf-075-096.png",
  q504: "assets/pdf-images/pdf-071-082.png",
  q506: "assets/pdf-images/pdf-075-097.png",
  q508: "assets/pdf-images/pdf-027-053.png",
  q_pdf_14: "assets/pdf-images/pdf-071-082.png",
  q_pdf_15: "assets/pdf-images/pdf-075-096.png",
  q_pdf_16: "assets/pdf-images/pdf-075-097.png",
  pt_19: "assets/pdf-images/pdf-075-097.png",
  pt_29: "assets/pdf-images/pdf-131-272.png",
  pt_76: "assets/pdf-images/pdf-072-083.png",
  pt_80: "assets/pdf-images/pdf-116-261.png",
  pt_88: "assets/pdf-images/pdf-111-249.png",
  pt_95: "assets/pdf-images/pdf-083-169.png",
  pt_106: "assets/diagrams/pt_106_paso_peatones.svg",
  pt_113: "assets/pdf-images/pdf-075-097.png",
  pt_121: "assets/pdf-images/pdf-075-097.png",
  pt_132: "assets/diagrams/pt_132_viraje_ciclovia.svg",
  pt_135: "assets/pdf-images/pdf-083-169.png",
  pt_161: "assets/pdf-images/pdf-131-272.png",
  pt_163: "assets/pdf-images/pdf-075-097.png",

  // Chapter 6
  q605: "assets/pdf-images/pdf-077-109.png",
  q606: "assets/pdf-images/pdf-082-168.png",
  q607: "assets/pdf-images/pdf-092-195.png",
  q608: "assets/pdf-images/pdf-088-189.png",
  q609: "assets/pdf-images/pdf-105-229.png",
  q610: "assets/pdf-images/pdf-089-190.png",
  q611: "assets/pdf-images/pdf-094-206.png",
  q614: "assets/pdf-images/pdf-079-121.png",
  q_pdf_17: "assets/pdf-images/pdf-077-109.png",
  q_pdf_18: "assets/pdf-images/pdf-079-117.png",
  q_pdf_19: "assets/pdf-images/pdf-082-163.png",
  q_pdf_20: "assets/pdf-images/pdf-083-171.png",
  q_pdf_22: "assets/pdf-images/pdf-086-186.png",
  q_pdf_23: "assets/pdf-images/pdf-089-190.png",
  q_pdf_24: "assets/pdf-images/pdf-090-192.png",
  q_pdf_25: "assets/pdf-images/pdf-092-197.png",
  q_pdf_26: "assets/pdf-images/pdf-094-206.png",
  q_pdf_27: "assets/pdf-images/pdf-094-204.png",
  q_pdf_28: "assets/pdf-images/pdf-095-210.png",
  q_pdf_30: "assets/pdf-images/pdf-102-223.png",
  pt_22: "assets/pdf-images/pdf-146-290.png",
  pt_28: "assets/pdf-images/pdf-094-204.png",
  pt_31: "assets/pdf-images/pdf-083-170.png",
  pt_33: "assets/pdf-images/pdf-086-186.png",
  pt_44: "assets/pdf-images/pdf-168-685.png",
  pt_48: "assets/diagrams/pt_48_retorno_autopista.svg",
  pt_64: "assets/pdf-images/pdf-153-415.png",
  pt_72: "assets/pdf-images/pdf-083-173.png",
  pt_81: "assets/pdf-images/pdf-079-121.png",
  pt_83: "assets/diagrams/pt_83_estacionado_izquierda.svg",
  pt_85: "assets/pdf-images/pdf-110-246.png",
  pt_86: "assets/pdf-images/pdf-147-295.png",
  pt_90: "assets/pdf-images/pdf-105-229.png",
  pt_102: "assets/diagrams/pt_102_zona_curvas.svg",
  pt_108: "assets/pdf-images/pdf-102-223.png",
  pt_134: "assets/pdf-images/pdf-102-223.png",
  pt_142: "assets/diagrams/pt_142_fin_prohibicion_adelantar.svg",
  pt_148: "assets/pdf-images/pdf-151-333.png",
  pt_151: "assets/diagrams/pt_151_interseccion_abc.svg",
  pt_155: "assets/pdf-images/pdf-079-117.png",
  pt_156: "assets/pdf-images/pdf-105-229.png",
  pt_166: "assets/pdf-images/pdf-092-197.png",
  pt_167: "assets/pdf-images/pdf-092-197.png",

  // Chapter 7
  q705: "assets/pdf-images/pdf-111-249.png",
  q706: "assets/pdf-images/pdf-146-290.png",
  q707: "assets/pdf-images/pdf-129-269.png",
  q_pdf_31: "assets/pdf-images/pdf-114-258.png",
  q_pdf_32: "assets/pdf-images/pdf-083-173.png",
  pt_160: "assets/pdf-images/pdf-114-258.png",

  // Chapter 8
  q802: "assets/pdf-images/pdf-131-272.png",
  q803: "assets/pdf-images/pdf-131-272.png",
  q_pdf_34: "assets/pdf-images/pdf-132-276.png",
  pt_18: "assets/pdf-images/pdf-132-276.png",
  pt_65: "assets/pdf-images/pdf-132-276.png",
  pt_71: "assets/pdf-images/pdf-129-269.png",

  // Chapter 9
  q901: "assets/pdf-images/pdf-168-685.png",
  q902: "assets/pdf-images/pdf-137-284.png",
  q903: "assets/pdf-images/pdf-168-685.png",
  q904: "assets/pdf-images/pdf-148-301.png",
  q_pdf_35: "assets/pdf-images/pdf-137-284.png",
  q_pdf_36: "assets/pdf-images/pdf-146-290.png"
};

let withImg = 0;
let withoutImg = 0;
let remappedCh = 0;

for (const q of questions) {
  if (CHAPTER_REMAP[q.id]) {
    q.chapter = CHAPTER_REMAP[q.id];
    remappedCh++;
  }
  if (QUESTION_TEXT_FIXES[q.id]) {
    q.question = QUESTION_TEXT_FIXES[q.id];
  }
  const targetImg = VERIFIED_IMAGES[q.id] || null;
  if (targetImg && !fs.existsSync(targetImg)) {
    throw new Error(`Target image does not exist: ${targetImg} for ${q.id}`);
  }
  q.image = targetImg;
  q.localFallback = targetImg;
  if (targetImg) withImg++;
  else withoutImg++;
}

const out = [
  "// Base de datos completa de capítulos, preguntas oficiales y señales CONASET 2026",
  `window.CONASET_CHAPTERS = ${JSON.stringify(chapters, null, 2)};`,
  "",
  `window.CONASET_QUESTIONS = ${JSON.stringify(questions, null, 2)};`,
  "",
  `window.CONASET_SIGNS = ${JSON.stringify(signs, null, 2)};`,
  ""
].join("\n");

fs.writeFileSync(DB_PATH, out, "utf8");
console.log(
  `Updated ${questions.length} questions: remappedCh=${remappedCh}, withVerifiedImage=${withImg}, conceptualNoImage=${withoutImg}.`
);
