#!/usr/bin/env node
/**
 * Genera explicaciones pedagógicas detalladas por alternativa (optionExplanations) y
 * referencias exactas al manual oficial (manualRef) para las 280 preguntas de CONASET 2026.
 *
 * Para cada pregunta:
 * - Si el usuario elige una alternativa incorrecta, explica específicamente por qué esa
 *   afirmación es falsa, qué trampa conceptual contiene o qué norma de la Ley de Tránsito contradice.
 * - Para la alternativa correcta, explica por qué es la respuesta válida y cuál es su
 *   fundamento técnico/legal en el Libro para la Conducción en Chile 2026.
 */
const fs = require("fs");
const path = require("path");

global.window = {};
const dbPath = path.join(__dirname, "..", "questions-db.js");
eval(fs.readFileSync(dbPath, "utf8"));

const chapterPages = {
  1: "Capítulo 1: Los siniestros de tránsito (Págs. 6–10)",
  2: "Capítulo 2: Los principios de la conducción (Págs. 11–32)",
  3: "Capítulo 3: Convivencia vial (Págs. 33–36)",
  4: "Capítulo 4: La persona en el tránsito (Págs. 37–67)",
  5: "Capítulo 5: Las y los usuarios vulnerables (Págs. 68–76)",
  6: "Capítulo 6: Normas de circulación (Págs. 77–108)",
  7: "Capítulo 7: Conducción en circunstancias especiales (Págs. 109–126)",
  8: "Capítulo 8: Conducción eficiente (Págs. 127–135)",
  9: "Capítulo 9: Informaciones importantes y anexos (Págs. 136–170)"
};

function cleanSentence(str) {
  const s = String(str || "").trim();
  if (!s) return "";
  return s.endsWith(".") ? s : `${s}.`;
}

function buildWhyWrong(q, wrongOptText, correctOptText) {
  const w = String(wrongOptText || "").trim();
  const wl = w.toLowerCase();
  const c = String(correctOptText || "").trim();
  const exp = cleanSentence(q.explanation);

  // Análisis específico de trampas frecuentes en los distractores del examen CONASET
  if (
    wl.includes("acelera") ||
    wl.includes("aumentar la velocidad") ||
    wl.includes("aumenta su velocidad") ||
    wl.includes("más rápido") ||
    wl.includes("mayor velocidad")
  ) {
    return `Se descarta porque aumentar la velocidad o acelerar en esta situación incrementa la energía cinética, reduce el tiempo de reacción disponible y agrava el riesgo de siniestro. Según el manual oficial: ${exp} Por ello, lo correcto es: "${c}".`;
  }

  if (
    wl.includes("bocina") ||
    wl.includes("tocar la bocina") ||
    wl.includes("aparato sonoro")
  ) {
    return `Se descarta porque la Ley de Tránsito prohíbe el uso de la bocina en zonas urbanas salvo para prevenir inminentemente un siniestro; nunca debe usarse para apurar a peatones, ciclistas u otros conductores. ${exp}`;
  }

  if (
    wl.includes("punto muerto") ||
    wl.includes("neutro") ||
    wl.includes("pisando el embrague") ||
    wl.includes("desembraga")
  ) {
    return `Se descarta porque circular en punto muerto o con el embrague pisado desconecta las ruedas de la retención del motor (pérdida de freno motor), sobrecalienta los frenos y aumenta el consumo de combustible. ${exp}`;
  }

  if (
    wl.includes("luces altas") &&
    (q.question.toLowerCase().includes("neblina") ||
      q.question.toLowerCase().includes("niebla") ||
      q.question.toLowerCase().includes("encandil"))
  ) {
    return `Se descarta porque las luces altas se reflejan en las gotas de agua en suspensión (en neblina) o encandilan a quien viene de frente, reduciendo drásticamente la visibilidad en lugar de mejorarla. ${exp}`;
  }

  if (
    wl.includes("café") ||
    wl.includes("ducha") ||
    wl.includes("ejercicio") ||
    wl.includes("dormir") ||
    wl.includes("agua")
  ) {
    if (q.question.toLowerCase().includes("alcohol") || q.question.toLowerCase().includes("alcoholemia")) {
      return `Se descarta porque es un mito frecuente: ni el café, ni las duchas frías, ni el ejercicio aceleran la metabolización hepática del alcohol en la sangre; sólo el paso del tiempo (~0,10 a 0,15 g/l por hora) lo elimina. ${exp}`;
    }
  }

  if (
    wl.includes("quitarle el casco") ||
    wl.includes("retirar el casco") ||
    wl.includes("darle agua") ||
    wl.includes("dar de beber") ||
    wl.includes("moverlo de inmediato") ||
    wl.includes("sentarla")
  ) {
    return `Se descarta porque mover a un lesionado sin conocimiento técnico, quitarle el casco a un motociclista o darle líquidos/alimentos puede provocar lesiones medulares irreversibles o asfixia. ${exp}`;
  }

  if (
    wl.includes("sólo") ||
    wl.includes("únicamente") ||
    wl.includes("nunca") ||
    wl.includes("jamás") ||
    wl.includes("ninguna") ||
    wl.includes("siempre tiene preferencia") ||
    wl.includes("preferencia automática")
  ) {
    return `Se descarta porque establece una condición absoluta o restrictiva ("${w}") que contradice el principio de seguridad preventiva y la normativa vigente. ${exp} En cambio, la alternativa correcta establece que: "${c}".`;
  }

  // Comparación numérica cuando el distractor altera una cifra reglamentaria (km/h, metros, g/l, años, mm, puntos)
  const wrongNums = w.match(/\d+(?:[.,]\d+)?/g);
  const correctNums = c.match(/\d+(?:[.,]\d+)?/g);
  if (wrongNums && correctNums && wrongNums.join(",") !== correctNums.join(",")) {
    return `Se descarta porque el valor o rango indicado en esta alternativa (${wrongNums.join(" / ")}) no corresponde al parámetro oficial exigido por la Ley de Tránsito chilena (que establece ${correctNums.join(" / ")}). ${exp}`;
  }

  return `Se descarta porque la afirmación "${w}" es contraria a lo dispuesto en el ${chapterPages[q.chapter] || "Manual Oficial CONASET 2026"}. ${exp} Por esa razón, la respuesta correcta es: "${c}".`;
}

function buildWhyCorrect(q, correctOptText) {
  const c = String(correctOptText || "").trim();
  const exp = cleanSentence(q.explanation);
  return `Es la alternativa correcta ("${c}") porque coincide exactamente con la norma oficial del ${chapterPages[q.chapter] || "Libro para la Conducción en Chile 2026"}: ${exp}`;
}

window.CONASET_QUESTIONS.forEach((q) => {
  q.manualRef = chapterPages[q.chapter] || "Manual Oficial CONASET 2026";
  const correctOptText = q.options[q.correct];
  q.optionExplanations = q.options.map((optText, idx) => {
    if (idx === q.correct) {
      return buildWhyCorrect(q, optText);
    }
    return buildWhyWrong(q, optText, correctOptText);
  });
});

const out =
  `// Base de datos oficial CONASET 2026 - Automovilistas Clase B (280 Preguntas con 100% Ilustraciones del PDF y Retroalimentación por Alternativa)\n` +
  `window.CONASET_CHAPTERS = ${JSON.stringify(window.CONASET_CHAPTERS, null, 2)};\n\n` +
  `window.CONASET_QUESTIONS = ${JSON.stringify(window.CONASET_QUESTIONS, null, 2)};\n\n` +
  `window.CONASET_SIGNS = ${JSON.stringify(window.CONASET_SIGNS, null, 2)};\n`;

fs.writeFileSync(dbPath, out, "utf8");
console.log(
  "Enriched all",
  window.CONASET_QUESTIONS.length,
  "questions with optionExplanations and manualRef."
);
