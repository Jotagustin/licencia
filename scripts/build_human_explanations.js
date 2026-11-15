#!/usr/bin/env node
/**
 * Genera explicaciones claras, breves y sin repeticiones para cada alternativa
 * en questions-db.js, eliminando referencias al manual, páginas o códigos.
 */
const fs = require("fs");
const path = require("path");

global.window = {};
const dbPath = path.join(__dirname, "..", "questions-db.js");
require("vm").runInNewContext(fs.readFileSync(dbPath, "utf8"), { window: global.window });

const ptExplanations = JSON.parse(fs.readFileSync("/tmp/pt_explanations.json", "utf8"));
ptExplanations.pt_157 =
  "Cargar demasiado peso atrás eleva la parte delantera del vehículo: las luces delanteras apuntan más arriba (perdiendo foco) y la dirección pierde apoyo, haciendo que el auto tienda a girar de forma imprevista.";

function stripBookRefs(text) {
  let s = String(text || "").trim();
  s = s.replace(/^Según el Anexo \d+[^,]*,\s*/i, "");
  s = s.replace(/^Según el Capítulo \d+[^:]*:\s*/i, "");
  s = s.replace(/^Según la página \d+,\s*/i, "");
  s = s.replace(/^El Capítulo \d+\s+destaca que\s+/i, "");
  s = s.replace(/^El cuadro de la página \d+\s+/i, "Los costos de un siniestro se ");
  s = s.replace(/^La clasificación oficial clasifica los costos/i, "Los costos de un siniestro se clasifican");
  s = s.replace(/^El principio N° \d+ del Sistema Seguro \([^)]+\)\s+establece que\s+/i, "El principio del Sistema Seguro establece que ");
  s = s.replace(/^En el panel de instrumentos \(pág\. \d+\),\s+/i, "En el tablero del vehículo, ");
  s = s.replace(/^Como muestra la gráfica de la página \d+,\s+/i, "En la práctica, ");
  s = s.replace(/^Como ilustra la página [\d–-]+,\s*/i, "");
  s = s.replace(/^La(?:s)? página(?:s)? [\d–-]+ (?:advierte|explica|muestra|indica|detalla|grafica|ilustra)n?(?: claramente)?(?: paso a paso)?(?: que)?\s*/i, "");
  s = s.replace(/^La infografía de la página \d+ especifica que\s+/i, "");
  s = s.replace(/^La curva de la página \d+ demuestra que\s+/i, "");
  s = s.replace(/^El diagrama oficial de la página \d+ muestra que\s+/i, "");
  s = s.replace(/^El esquema de la página \d+ destaca como\s+/i, "Entre los ");
  s = s.replace(/^En la página \d+ se detallan\s+/i, "Existen ");
  s = s.replace(/^El manual reemplaza /i, "Se reemplaza ");
  s = s.replace(/^Las prohibiciones legales del viraje en U:/i, "El viraje en U está prohibido en");
  s = s.replace(/^La regla de incorporación:/i, "Para incorporarse correctamente se debe");
  s = s.replace(/^El protocolo ABC \(vía aérea, respiración, circulación\) y cómo mantener/i, "La posición lateral de seguridad busca mantener");
  s = s.replace(/\s*\(págs?\.?\s*[\d–-]+\)/gi, "");
  s = s.replace(/\s*\([^)]*pág\.[^)]*\)/gi, "");
  s = s.replace(/,\s*pág\.\s*\d+/gi, "");
  s = s.trim();
  if (!s) return "";
  s = s.charAt(0).toUpperCase() + s.slice(1);
  return s.endsWith(".") ? s : `${s}.`;
}

function cleanQuestionText(text) {
  let s = String(text || "").trim();
  s = s.replace(/^Según la página \d+ del libro,\s*/i, "");
  s = s.replace(/^Según el libro para la conducción en Chile,\s*/i, "");
  s = s.replace(/^Según el Libro para la Conducción en Chile,\s*/i, "");
  s = s.replace(/^Según el libro,\s*/i, "");
  s = s.replace(/^De acuerdo con el cuadro oficial de ([^,(]+)\s*\([^)]+\),\s*/i, "Respecto a $1, ");
  s = s.replace(/^Observe la lámina de ([^.(]+)\s*\([^)]+\)\.\s*/i, "Respecto a $1: ");
  s = s.replace(/^Observe el tablero de instrumentos de la página \d+ del manual\.\s*/i, "En el tablero de instrumentos, ");
  s = s.replace(/^Según la ilustración del sistema de lubricación \(pág\. \d+\),\s*/i, "Al revisar el sistema de lubricación, ");
  s = s.replace(/^Observe el esquema de alcance de luces del vehículo \(pág\. \d+\)\.\s*/i, "");
  s = s.replace(/^En la lámina de la página \d+ sobre espejos retrovisores,\s*/i, "Respecto a los espejos retrovisores, ");
  s = s.replace(/^Observe el gráfico oficial de distancias de detención de la página \d+\s*/i, "Observe el gráfico de distancias de detención ");
  s = s.replace(/^Según la ilustración de seguridad pasiva de la página \d+,\s*/i, "Por seguridad pasiva, ");
  s = s.replace(/^De acuerdo con el recuadro 'Principales Factores de Riesgo' de la página \d+ del manual,\s*/i, "");
  s = s.replace(/^Según la lámina 'La conducción a la defensiva significa que' \(pág\. \d+\),\s*/i, "En la conducción a la defensiva, ");
  s = s.replace(/^Observe el diagrama del campo visual de la página \d+ del manual\.\s*/i, "");
  s = s.replace(/^Según el esquema oficial de sanciones de la Ley Tolerancia Cero \(pág\. \d+\),\s*/i, "Según la Ley Tolerancia Cero, ");
  s = s.replace(/^En la lámina sobre [^.(]+\(pág\. \d+\),\s*/i, "");
  s = s.replace(/^En la ilustración de semáforos con flecha verde de la página \d+,\s*/i, "En un semáforo con flecha verde, ");
  s = s.replace(/^En el esquema de cruce no regulado de la página \d+\s*/i, "En un cruce no regulado ");
  s = s.replace(/^Según (?:la lámina|las láminas|los esquemas|la ilustración)[^,(]*\(pág\. \d+\)[^,]*,\s*/i, "");
  s = s.replace(/^Según (?:la lámina|las láminas|los esquemas|la ilustración)[^,]*de la página \d+[^,]*,\s*/i, "");
  s = s.replace(/^En (?:los diagramas|la lámina)[^,]*de la página \d+,\s*/i, "");
  s = s.replace(/^Observe [^.(]+\(pág\. \d+\)\.\s*/i, "");
  s = s.replace(/^Observe [^.(]+de la página \d+[^.]*\.\s*/i, "");
  s = s.replace(/^Observe la secuencia de primeros auxilios mostrada en la imagen del manual\.\s*/i, "");
  s = s.replace(/^Según las definiciones oficiales de la Ley de Tránsito y el glosario del manual,\s*/i, "Según las definiciones de tránsito, ");
  s = s.replace(/^Según las definiciones del manual,\s*/i, "Según las definiciones de tránsito, ");
  s = s.replace(/de la página \d+ del manual\.?\s*/gi, "");
  s = s.replace(/,\s*pág\.\s*\d+\)/gi, ")");
  s = s.replace(/\s*\(págs?\.?\s*[\d–-]+\)/gi, "");
  s = s.replace(/,\s*¿qué indica el libro\?/i, ", ¿qué se recomienda hacer?");
  s = s.replace(/mostrado en el libro/gi, "vigente");
  s = s.replace(/de las páginas [\d–-]+/gi, "mostrada en la imagen");
  s = s.replace(/en la página \d+/gi, "en la imagen");
  s = s.replace(/en la imagen del manual/gi, "en la imagen");
  s = s.replace(/,\s*¿/g, ", ¿");
  s = s.trim();
  if (s.startsWith("¿") && s.length > 1) {
    return "¿" + s.charAt(1).toUpperCase() + s.slice(2);
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const CUSTOM_WRONG = {
  pt_170: [
    "Los impactos laterales no son los más habituales al esperar un viraje a la izquierda, ya que el vehículo aguarda detenido dentro de su propia pista.",
    "El peligro principal al detenerse para doblar a la izquierda no viene de frente, sino del tránsito que se aproxima por tu misma pista desde atrás."
  ]
};

function buildWhyCorrect(q) {
  return stripBookRefs(q.explanation);
}

function buildWhyWrong(q, wrongOptText, correctOptText, idx) {
  if (CUSTOM_WRONG[q.id]) {
    const wrongIdx = q.options
      .map((_, i) => i)
      .filter((i) => i !== q.correct)
      .indexOf(idx);
    if (wrongIdx >= 0 && CUSTOM_WRONG[q.id][wrongIdx]) {
      return CUSTOM_WRONG[q.id][wrongIdx];
    }
  }

  const w = String(wrongOptText || "").trim();
  const wl = w.toLowerCase();
  const ql = String(q.question || "").toLowerCase();
  const c = String(correctOptText || "").trim();

  if (q.options.length === 2 && /^(verdadero|falso)$/i.test(w)) {
    if (/^falso$/i.test(w)) {
      return "Se descarta porque la afirmación sí es verdadera en la práctica vial.";
    }
    return "Se descarta porque en realidad ocurre lo contrario a lo que indica la afirmación.";
  }

  if (/^(sólo\s+|solo\s+)?[iv]+(\s*,\s*[iv]+)*(\s+y\s+[iv]+)?\.?$/i.test(w)) {
    return `Esta combinación es incompleta o incluye un punto incorrecto; la combinación válida es "${c}".`;
  }

  if (/^(señal|vehículo)\s+/i.test(w)) {
    return `Esa alternativa señala una figura o vehículo distinto al que cumple la condición correcta ("${c}").`;
  }

  if (wl.includes("acelera") || wl.includes("aumentar la velocidad") || wl.includes("aumenta su velocidad") || wl.includes("más rápido") || wl.includes("mayor velocidad")) {
    if (!ql.includes("aceite") && !ql.includes("lubricación")) {
      return "Acelerar o aumentar la velocidad reduce el tiempo de reacción, alarga la distancia de frenado y agrava el riesgo.";
    }
  }

  if (wl.includes("bocina") || wl.includes("tocar la bocina") || wl.includes("aparato sonoro")) {
    return "La bocina está prohibida para apurar, saludar o mostrar enojo; solo puede usarse para evitar un peligro inminente.";
  }

  if (wl.includes("punto muerto") || wl.includes("neutro") || wl.includes("pisando el embrague") || wl.includes("desembraga") || wl.includes("pedal de embrague")) {
    return "Circular en neutro o con el embrague presionado desconecta la retención del motor (freno motor) y quita control sobre el vehículo.";
  }

  if (wl.includes("luces altas") && (ql.includes("neblina") || ql.includes("niebla") || ql.includes("encandil") || ql.includes("adelant"))) {
    return "Las luces altas rebotan en la neblina o encandilan a otros conductores, reduciendo la visibilidad.";
  }

  if ((wl.includes("café") || wl.includes("ducha") || wl.includes("ejercicio") || wl.includes("dormir") || wl.includes("agua")) && (ql.includes("alcohol") || ql.includes("alcoholemia") || ql.includes("alcohólicas"))) {
    return "Es un mito: ni el café, ni las duchas ni el ejercicio aceleran la eliminación del alcohol; solo el paso del tiempo lo reduce.";
  }

  if (wl.includes("quitarle el casco") || wl.includes("retirar el casco") || wl.includes("darle agua") || wl.includes("dar de beber") || wl.includes("moverlo") || wl.includes("subirlo")) {
    return "Mover a un herido sin preparación, sacarle el casco o darle líquidos puede causar lesiones cervicales graves o asfixia.";
  }

  if (wl.includes("vereda") || wl.includes("acera")) {
    if (ql.includes("estacion")) {
      return "Estacionar sobre la vereda está siempre prohibido, incluso si queda espacio para peatones.";
    }
  }

  const wrongNums = w.match(/\d+(?:[.,]\d+)?/g);
  const correctNums = c.match(/\d+(?:[.,]\d+)?/g);
  if (wrongNums && correctNums && wrongNums.join(",") !== correctNums.join(",")) {
    return `La cifra indicada (${wrongNums.join(" / ")}) no coincide con el valor real (${correctNums.join(" / ")}).`;
  }

  if (ql.includes("falsa") || ql.includes("incorrecta") || ql.includes("no corresponde")) {
    return "Esa afirmación sí es verdadera, por lo que no corresponde a la excepción falsa que pide la pregunta.";
  }

  if (/\b(sólo|solo|únicamente|nunca|jamás|siempre|todo momento|cualquier)\b/i.test(wl) && !/\b(sólo|solo|siempre)\b/i.test(c.toLowerCase())) {
    return `Plantea una regla absoluta ("${w}") que no se cumple en la realidad ni contempla excepciones importantes.`;
  }

  if (wl.includes("duplica") && ql.includes("energía")) {
    return "La energía cinética y la distancia de frenado no se duplican al doblar la velocidad: crecen al cuadrado (4 veces).";
  }
  if (wl.includes("aumenta 2 veces") || wl.includes("proporcional")) {
    return "No crece de forma proporcional (×2), sino exponencialmente con el cuadrado de la velocidad (×4).";
  }
  if (wl.includes("prohíbe usar la palabra")) {
    return "La ley no prohíbe usar esa palabra; se habla de siniestros porque casi todos tienen causas prevenibles.";
  }
  if (wl.includes("aditivo") && ql.includes("aceite")) {
    return "Agregar un aditivo no resuelve una pérdida de presión de aceite; seguir con el motor en marcha puede fundirlo.";
  }
  if (wl.includes("radiador") && (ql.includes("aceite") || ql.includes("lubricación"))) {
    return "El radiador pertenece al circuito de refrigeración (agua/refrigerante), no al nivel de aceite del motor; abrirlo en marcha además quema.";
  }
  if (wl.includes("luz roja") && (ql.includes("aceite") || ql.includes("lubricación"))) {
    return "No debes esperar a que se encienda la luz roja de alerta: el nivel se revisa preventivamente antes de que falte lubricación.";
  }
  if (wl.includes("luneta trasera") && ql.includes("silla")) {
    return "La orientación hacia atrás no tiene relación con la vista hacia afuera, sino con cómo el respaldo absorbe la fuerza de un choque frontal.";
  }
  if (wl.includes("asiento delantero") && (ql.includes("silla") || ql.includes("niño"))) {
    return "Los menores de 12 años deben ir en los asientos traseros y jamás en un asiento con airbag frontal activo frente a una silla mirando atrás.";
  }
  if (wl.includes("arnés") && ql.includes("silla")) {
    return "El arnés siempre debe abrocharse ajustado al cuerpo del niño para sujetarlo dentro de la silla ante un impacto.";
  }
  if (wl.includes("en todo momento") || wl.includes("cualquier municipalidad") || wl.includes("lugar de nacimiento")) {
    return "No corresponde al requisito real: el trámite se exige en la municipalidad del domicilio de residencia.";
  }
  if (wl.includes("ahorrar batería") || wl.includes("ahorrar combustible")) {
    return "Ese no es el motivo principal de seguridad vial para la medida consultada.";
  }

  return `No es correcto: lo adecuado aquí es "${c.replace(/\.$/, "")}", ya que esta opción contradice la regla de seguridad o el dato real del caso.`;
}

window.CONASET_QUESTIONS.forEach((q) => {
  if (q.id === "q_pdf_17") {
    q.question = "Observe las señales corporales de Carabineros en la imagen. ¿Qué indica un Carabinero cuando es visto de frente o de espaldas por los vehículos que se aproximan?";
  } else {
    q.question = cleanQuestionText(q.question);
  }

  if (ptExplanations[q.id]) {
    q.explanation = ptExplanations[q.id];
  } else {
    q.explanation = stripBookRefs(q.explanation);
  }

  delete q.manualRef;

  const correctOptText = q.options[q.correct];
  q.optionExplanations = q.options.map((optText, idx) => {
    if (idx === q.correct) {
      return buildWhyCorrect(q);
    }
    return buildWhyWrong(q, optText, correctOptText, idx);
  });
});

const out =
  `// Base de datos oficial CONASET 2026 - Automovilistas Clase B (284 Preguntas con Ilustraciones y Retroalimentación Clara)\n` +
  `window.CONASET_CHAPTERS = ${JSON.stringify(window.CONASET_CHAPTERS, null, 2)};\n\n` +
  `window.CONASET_QUESTIONS = ${JSON.stringify(window.CONASET_QUESTIONS, null, 2)};\n\n` +
  `window.CONASET_SIGNS = ${JSON.stringify(window.CONASET_SIGNS, null, 2)};\n`;

fs.writeFileSync(dbPath, out, "utf8");
console.log("Regenerated clean, non-repetitive explanations for", window.CONASET_QUESTIONS.length, "questions.");
