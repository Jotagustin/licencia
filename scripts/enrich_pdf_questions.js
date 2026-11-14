#!/usr/bin/env node
/**
 * Integra nuevas preguntas visuales basadas directamente en las láminas extraídas de
 * LIBRO-DEL-NUEVO-CONDUCTOR-AUTOMOVILISTAS_2026.pdf y asigna a la totalidad del banco
 * de preguntas (100%) su respectiva ilustración local en assets/pdf-images/.
 */
const fs = require("fs");
const path = require("path");

global.window = {};
const dbPath = path.join(__dirname, "..", "questions-db.js");
eval(fs.readFileSync(dbPath, "utf8"));

const newVisualQuestions = [
  {
    id: "q_pdf_01",
    chapter: 1,
    category: "Siniestros de tránsito",
    doublePoints: false,
    image: "assets/pdf-images/pdf-007-vec.png",
    question: "De acuerdo con el cuadro oficial de 'Costos de los Siniestros de Tránsito' (pág. 7 del manual), ¿cuál de los siguientes ítems corresponde específicamente a los Costos Humanos?",
    options: [
      "Daños a los vehículos, a su carga y a la propiedad pública.",
      "Pérdida de productividad futura de personas fallecidas y sufrimiento físico y psicológico de lesionados y familiares.",
      "Gestión de seguros, atención de Carabineros, Bomberos y procesos judiciales.",
      "Traslado en ambulancia y costos hospitalarios de urgencia."
    ],
    correct: 1,
    explanation: "El cuadro de la página 7 clasifica los costos en cuatro grupos: materiales, de salud, administrativos y humanos; estos últimos comprenden la pérdida de productividad y el sufrimiento físico y psicológico de víctimas y cercanos."
  },
  {
    id: "q_pdf_02",
    chapter: 1,
    category: "Siniestros de tránsito",
    doublePoints: false,
    image: "assets/pdf-images/pdf-009-vec.png",
    question: "Observe la lámina de 'Principios Fundamentales y No Transables del Sistema Seguro' (pág. 9). ¿Qué establece su segundo principio respecto al cuerpo humano?",
    options: [
      "Que el cuerpo humano puede adaptarse a cualquier velocidad si utiliza cinturón.",
      "Que el cuerpo humano por naturaleza tiene una capacidad limitada para soportar las fuerzas de un impacto antes de que ocurra el daño.",
      "Que la responsabilidad recae exclusivamente en el peatón o ciclista involucrado.",
      "Que los errores humanos nunca ocurren en conductores experimentados."
    ],
    correct: 1,
    explanation: "El principio N° 2 del Sistema Seguro (Visión Cero, pág. 9) establece que el cuerpo humano tiene una tolerancia biomecánica limitada ante las fuerzas de un impacto, por lo que el sistema vial debe diseñarse para no superar ese umbral."
  },
  {
    id: "q_pdf_03",
    chapter: 2,
    category: "Principios de la conducción",
    doublePoints: false,
    image: "assets/pdf-images/pdf-011-003.png",
    question: "Observe el tablero de instrumentos de la página 11 del manual. Si durante la marcha se enciende un testigo de color rojo (como el de frenos, presión de aceite o temperatura), ¿qué indica?",
    options: [
      "Una función informativa opcional que puede revisarse en el próximo mantenimiento anual.",
      "Una advertencia crítica o avería grave que requiere detener el vehículo de inmediato en un lugar seguro.",
      "Que las luces bajas o de estacionamiento se encuentran encendidas.",
      "Que el sistema de climatización está operando a máxima potencia."
    ],
    correct: 1,
    explanation: "En el panel de instrumentos (pág. 11), los testigos rojos advierten peligro inmediato o anomalía grave en sistemas críticos (lubricación, refrigeración, frenos o sujeción), exigiendo detenerse con seguridad."
  },
  {
    id: "q_pdf_04",
    chapter: 2,
    category: "Principios de la conducción",
    doublePoints: false,
    image: "assets/pdf-images/pdf-012-005.png",
    question: "Según la ilustración del sistema de lubricación (pág. 12), ¿cómo debe verificarse correctamente el nivel de aceite del motor con la varilla medidora?",
    options: [
      "Con el motor acelerando en caliente y el auto estacionado en una pendiente.",
      "Con el motor detenido y frío, el vehículo en terreno plano, verificando que el nivel esté entre las marcas mínimo y máximo.",
      "Retirando la tapa del radiador mientras el motor está en marcha.",
      "Únicamente cuando se enciende la luz roja de presión de aceite en el tablero."
    ],
    correct: 1,
    explanation: "La medición del aceite debe hacerse con el vehículo nivelado y el motor frío, asegurándose de que la película de aceite se ubique entre las marcas MIN y MAX de la varilla (pág. 12)."
  },
  {
    id: "q_pdf_05",
    chapter: 2,
    category: "Principios de la conducción",
    doublePoints: false,
    image: "assets/pdf-images/pdf-020-025.png",
    question: "Observe el esquema de alcance de luces del vehículo (pág. 20). ¿Por qué las luces bajas están diseñadas con un haz asimétrico más corto hacia el lado izquierdo?",
    options: [
      "Para ahorrar energía de la batería y del alternador.",
      "Para iluminar la berma derecha sin encandilar a las personas conductoras que vienen en sentido contrario.",
      "Porque sólo funciona un foco delantero cuando se circula en zona urbana.",
      "Para proyectar luz hacia la copa de los árboles en zonas rurales."
    ],
    correct: 1,
    explanation: "Las luces bajas proyectan un haz asimétrico que ilumina mejor el borde derecho de la calzada y evita encandilar a quienes circulan en sentido opuesto (pág. 20)."
  },
  {
    id: "q_pdf_06",
    chapter: 2,
    category: "Principios de la conducción",
    doublePoints: false,
    image: "assets/pdf-images/pdf-021-044.png",
    question: "En la lámina de la página 21 sobre espejos retrovisores, ¿qué representan las zonas sombreadas junto a los costados del vehículo y cómo debe compensarlas quien conduce?",
    options: [
      "Representan el área de frenado de emergencia; se compensan pisando el embrague.",
      "Representan los puntos ciegos (ángulos muertos) que no cubren los espejos; se compensan girando brevemente la cabeza antes de cambiar de pista.",
      "Representan la distancia lateral obligatoria para estacionar en autopistas.",
      "Representan el alcance de los sensores de retroceso."
    ],
    correct: 1,
    explanation: "Los ángulos muertos o puntos ciegos (pág. 21) son áreas laterales no visibles en los espejos retrovisores; siempre debe complementarse la revisión de espejos con un giro rápido de cabeza sobre el hombro."
  },
  {
    id: "q_pdf_07",
    chapter: 2,
    category: "Principios de la conducción",
    doublePoints: true,
    image: "assets/pdf-images/pdf-024-047.png",
    question: "Observe el gráfico oficial de distancias de detención de la página 24 (barra amarilla = reacción; barra naranja = frenado en seco; barra morada = frenado en mojado). ¿Qué ocurre al pasar de 50 km/h a 110 km/h en pavimento mojado?",
    options: [
      "La distancia total de detención aumenta apenas unos 15 metros.",
      "La distancia total de detención supera los 180 metros debido a que la distancia de frenado crece con el cuadrado de la velocidad y se duplica en calzada mojada.",
      "La distancia de reacción disminuye a la mitad mientras que la de frenado se mantiene constante.",
      "El vehículo frena en exactamente la misma distancia gracias a los frenos ABS."
    ],
    correct: 1,
    explanation: "Como muestra la gráfica de la página 24, a 50 km/h en mojado se requieren unos 50 metros, mientras que a 110 km/h en pavimento mojado la distancia total supera los 180 metros."
  },
  {
    id: "q_pdf_08",
    chapter: 2,
    category: "Principios de la conducción",
    doublePoints: true,
    image: "assets/pdf-images/pdf-030-070.png",
    question: "Según la ilustración de seguridad pasiva de la página 30, ¿por qué está estrictamente prohibido instalar una silla de retención infantil mirando hacia atrás en un asiento delantero que posea airbag frontal activo?",
    options: [
      "Porque la silla infantil impide abrir la guantera del vehículo.",
      "Porque al activarse el airbag a unos 300 km/h golpearía violentamente el respaldo de la silla contra el niño o niña, causándole lesiones graves o la muerte.",
      "Porque el cinturón delantero es más corto que el trasero.",
      "Porque el espejo lateral derecho queda bloqueado por la silla."
    ],
    correct: 1,
    explanation: "La página 30 advierte que nunca debe colocarse una silla infantil en un asiento con airbag frontal activo, ya que la bolsa se infla en milisegundos con enorme fuerza de impacto."
  },
  {
    id: "q_pdf_09",
    chapter: 3,
    category: "Convivencia vial",
    doublePoints: false,
    image: "assets/pdf-images/pdf-034-vec.png",
    question: "De acuerdo con el recuadro 'Principales Factores de Riesgo' de la página 34 del manual, ¿cuáles son los cuatro grandes factores evitables que desencadenan la pérdida de control del vehículo?",
    options: [
      "El color del automóvil, la marca de los neumáticos, el tipo de combustible y el ancho de la berma.",
      "Las distracciones, el alcohol y drogas, la fatiga/sueño/fármacos/estrés, y la velocidad inadecuada.",
      "El uso del cinturón de seguridad, el encendido de luces bajas y el respeto a los semáforos.",
      "Conducir en vehículos con transmisión automática en zonas urbanas."
    ],
    correct: 1,
    explanation: "El esquema de la página 34 destaca como factores críticos de riesgo: distracciones, alcohol y drogas, fatiga/sueño/fármacos/estrés y velocidad inadecuada (presente en la cuarta parte de los siniestros con víctimas)."
  },
  {
    id: "q_pdf_10",
    chapter: 3,
    category: "Convivencia vial",
    doublePoints: false,
    image: "assets/pdf-images/pdf-097-vec.png",
    question: "Según la lámina 'La conducción a la defensiva significa que' (pág. 97), ¿qué actitud debe mantener siempre quien conduce frente a las demás personas usuarias de la vía?",
    options: [
      "Acelerar para pasar antes que los demás en cada intersección.",
      "Conducir con precaución, planificar con tiempo, mantener distancia de seguridad, frenar a tiempo y mirar primero antes de actuar.",
      "Confiar ciegamente en que ningún peatón o conductor cometerá jamás un error.",
      "Usar la bocina de forma preventiva en todas las esquinas."
    ],
    correct: 1,
    explanation: "La conducción a la defensiva (pág. 97) consiste en conducir con precaución, planificar con tiempo, mantener una prudente desconfianza preventiva, conservar buena distancia y mirar primero antes de maniobrar."
  },
  {
    id: "q_pdf_11",
    chapter: 4,
    category: "La persona en el tránsito",
    doublePoints: false,
    image: "assets/pdf-images/pdf-043-076.png",
    question: "Observe el diagrama del campo visual de la página 43 del manual. ¿Qué ocurre con el ángulo de visión periférica a medida que aumenta la velocidad del vehículo?",
    options: [
      "El campo visual se amplía hasta cubrir 360 grados alrededor del automóvil.",
      "Se produce el efecto de 'visión de túnel', reduciéndose drásticamente la capacidad de detectar peatones o vehículos en los costados de la vía.",
      "La visión periférica mejora de noche y empeora de día.",
      "El ángulo visual permanece idéntico a 30 km/h y a 120 km/h."
    ],
    correct: 1,
    explanation: "Como ilustra la página 43, a mayor velocidad (o bajo estrés/alcohol) el campo visual útil se estrecha progresivamente ('visión de túnel'), dificultando percibir peligros laterales en cruces."
  },
  {
    id: "q_pdf_12",
    chapter: 4,
    category: "La persona en el tránsito",
    doublePoints: true,
    image: "assets/pdf-images/pdf-050-vec.png",
    question: "Según el esquema oficial de sanciones de la Ley Tolerancia Cero (pág. 50), si una persona conduce en 'Estado de Ebriedad' (0,8 g/l o más) y causa lesiones gravísimas o la muerte, ¿qué sanción sobre su licencia recibe desde la primera vez?",
    options: [
      "Suspensión de la licencia por 3 meses.",
      "Inhabilidad de por vida para conducir vehículos motorizados (además de las penas de presidio de la Ley Emilia).",
      "Suspensión de la licencia únicamente durante los fines de semana.",
      "Amonestación verbal por escrito sin suspensión de licencia."
    ],
    correct: 1,
    explanation: "El diagrama oficial de la página 50 muestra que conducir en estado de ebriedad (0,8+ g/l) causando lesiones gravísimas o la muerte conlleva la inhabilidad de por vida para conducir, además de penas efectivas de cárcel."
  },
  {
    id: "q_pdf_13",
    chapter: 4,
    category: "La persona en el tránsito",
    doublePoints: true,
    image: "assets/pdf-images/pdf-052-080.png",
    question: "Observe la curva de alcoholemia en el tiempo de la página 52 del manual. Si una persona bebe alcohol durante la noche y duerme algunas horas, ¿por qué puede seguir dando positivo en un control a la mañana siguiente?",
    options: [
      "Porque el alcohol se multiplica mientras la persona duerme.",
      "Porque el hígado metaboliza el alcohol a un ritmo lento y constante (~0,10 a 0,15 g/l por hora), pudiendo tardar cerca de 19 horas en eliminarse por completo tras una ingesta alta.",
      "Porque dormir detiene por completo el funcionamiento del hígado.",
      "Porque tomó agua o café antes de salir en la mañana."
    ],
    correct: 1,
    explanation: "La curva de la página 52 demuestra que la eliminación del alcohol es lenta y lineal; tras una ingesta elevada en la noche, al día siguiente aún puede permanecer una alcoholemia superior al límite legal."
  },
  {
    id: "q_pdf_14",
    chapter: 5,
    category: "Usuarios vulnerables",
    doublePoints: false,
    image: "assets/pdf-images/pdf-072-083.png",
    question: "Observe la ilustración de adelantamiento a ciclistas de la página 72 del manual. ¿Qué maniobra muestra la figura correcta al sobrepasar o adelantar a una persona ciclista?",
    options: [
      "Pasar rozando el manubrio del ciclista a menos de 50 centímetros para no pisar el eje central.",
      "Reducir la velocidad y dejar una separación lateral mínima de 1,5 metros, ocupando parte de la pista contigua si está libre y es seguro.",
      "Tocar la bocina repetidamente a corta distancia para que el ciclista suba a la vereda.",
      "Adelantarlo por la berma derecha a alta velocidad."
    ],
    correct: 1,
    explanation: "La página 72 ilustra que al adelantar a un ciclista se debe mantener una distancia lateral de al menos 1,5 metros por la inestabilidad propia del vehículo de dos ruedas."
  },
  {
    id: "q_pdf_15",
    chapter: 5,
    category: "Usuarios vulnerables",
    doublePoints: true,
    image: "assets/pdf-images/pdf-074-091.png",
    question: "Según la infografía oficial '¿Cómo se usa correctamente una silla para bebés y niños?' (pág. 74), ¿cuáles son los tres factores obligatorios que deben verificarse antes de elegir e instalar un Sistema de Retención Infantil (SRI)?",
    options: [
      "El color del tapiz, el año del permiso de circulación y la marca de los neumáticos.",
      "El peso, la altura y la edad del niño o niña, las características de anclaje del vehículo (ISOFIX/LATCH o cinturón de 3 puntas) y la certificación nacional vigente (etiqueta amarilla).",
      "Únicamente que la silla quepa en el maletero cuando no se utiliza.",
      "Que el niño pueda abrocharse y desabrocharse solo el arnés durante el viaje."
    ],
    correct: 1,
    explanation: "La infografía de la página 74 especifica que el SRI debe seleccionarse según peso, talla y edad del menor, compatibilidad de anclaje del vehículo, grupo de ocupantes y sello de acreditación vigente en Chile."
  },
  {
    id: "q_pdf_16",
    chapter: 5,
    category: "Usuarios vulnerables",
    doublePoints: true,
    image: "assets/pdf-images/pdf-075-097.png",
    question: "Observe la comparativa de impacto en sillas infantiles de la página 75 del manual. ¿Por qué es mucho más seguro que los lactantes y niños pequeños viajen en una silla orientada mirando hacia atrás?",
    options: [
      "Porque así pueden mirar por la luneta trasera del automóvil.",
      "Porque en una colisión frontal las fuerzas del impacto se distribuyen uniformemente sobre la espalda y la cabeza en el respaldo de la silla, protegiendo el cuello y la médula espinal.",
      "Porque ocupa menos espacio en el asiento delantero del copiloto.",
      "Porque evita tener que abrochar el arnés de seguridad."
    ],
    correct: 1,
    explanation: "Como ilustra la página 75, cuando la silla mira hacia atrás el impacto frontal es absorbido por el respaldo conteniendo cabeza, cuello y torso sin someter las vértebras cervicales a tracción violenta."
  },
  {
    id: "q_pdf_17",
    chapter: 6,
    category: "Normas de circulación",
    doublePoints: false,
    image: "assets/pdf-images/pdf-077-109.png",
    question: "Observe las señales corporales de Carabineros en la página 77 del manual. ¿Qué indica un Carabinero cuando es visto de frente o de espaldas por los vehículos que se aproximan?",
    options: [
      "Autorización para avanzar con precaución.",
      "Obligación de detenerse (equivalente a luz roja del semáforo).",
      "Obligación de virar inmediatamente a la derecha.",
      "Autorización para aumentar la velocidad máxima en 20 km/h."
    ],
    correct: 1,
    explanation: "Según la página 77, un Carabinero visto de frente o de espaldas indica detención obligatoria; visto de costado autoriza a avanzar; y con el brazo en alto ordena detenerse a todos quienes se aproximan."
  },
  {
    id: "q_pdf_18",
    chapter: 6,
    category: "Normas de circulación",
    doublePoints: false,
    image: "assets/pdf-images/pdf-079-121.png",
    question: "En la ilustración de semáforos con flecha verde de la página 79, si el semáforo muestra simultáneamente luz circular roja y una flecha verde encendida hacia la derecha, ¿qué puede hacer usted?",
    options: [
      "Seguir derecho a través del cruce sin detenerse.",
      "Avanzar únicamente en la dirección indicada por la flecha verde (virar a la derecha), cediendo el paso a los peatones que estén cruzando y a los vehículos con derecho preferente.",
      "Realizar un viraje en U de inmediato.",
      "Esperar obligatoriamente a que se apague la flecha verde para poder virar."
    ],
    correct: 1,
    explanation: "La página 79 explica que con luz roja y flecha verde se puede avanzar sólo hacia el sentido indicado por la flecha, respetando siempre a peatones y vehículos que circulen reglamentariamente."
  },
  {
    id: "q_pdf_19",
    chapter: 6,
    category: "Normas de circulación",
    doublePoints: false,
    image: "assets/pdf-images/pdf-082-163.png",
    question: "Observe las demarcaciones longitudinales de la página 82 del manual. ¿Qué indica una doble línea continua en el eje central de una calzada bidireccional?",
    options: [
      "Que se permite adelantar en ambos sentidos si no vienen vehículos de frente.",
      "Que está estrictamente prohibido traspasar el eje central para adelantar o virar a la izquierda en ambos sentidos de circulación.",
      "Que la vía es exclusiva para transporte público.",
      "Que se permite estacionar sobre el eje central."
    ],
    correct: 1,
    explanation: "La línea longitudinal continua (simple o doble, pág. 82) prohíbe ser traspasada o circular sobre ella por el riesgo de colisión frontal en sectores de visibilidad reducida."
  },
  {
    id: "q_pdf_20",
    chapter: 6,
    category: "Normas de circulación",
    doublePoints: false,
    image: "assets/pdf-images/pdf-083-173.png",
    question: "Observe la demarcación amarilla de 'No bloquear cruce' (cuadrícula de líneas diagonales amarillas, pág. 83). ¿Qué regla aplica al enfrentar este cruce aunque su semáforo esté en luz verde?",
    options: [
      "Puede ingresar y quedar detenido sobre las líneas amarillas mientras espera que avance la fila.",
      "No debe ingresar al cruce si a la salida de éste no existe espacio suficiente en su pista para despejar completamente la intersección.",
      "Sólo aplica para camiones de más de 3.500 kg.",
      "Indica una zona habilitada para estacionamiento de emergencia."
    ],
    correct: 1,
    explanation: "La cuadrícula amarilla en intersecciones (pág. 83) prohíbe quedar detenido dentro del cruce; nunca se debe ingresar —aun con luz verde— si la pista de salida está congestionada."
  },
  {
    id: "q_pdf_21",
    chapter: 6,
    category: "Normas de circulación",
    doublePoints: false,
    image: "assets/pdf-images/pdf-084-176.png",
    question: "En el esquema de cruce no regulado de la página 84 (sin semáforo, Carabinero ni señales PARE o CEDA EL PASO), ¿qué vehículo debe ceder el paso?",
    options: [
      "El vehículo que se aproxima por la derecha.",
      "El vehículo que se aproxima por la izquierda debe ceder el paso al que viene por su derecha (regla de prioridad de la derecha).",
      "El vehículo de menor tamaño siempre cede el paso al más grande.",
      "Ninguno tiene preferencia; ambos deben retroceder."
    ],
    correct: 1,
    explanation: "Como ilustra la página 84, en todo cruce no regulado rige la prioridad de la derecha: quien se acerca al cruce debe ceder el paso a todo vehículo que se aproxime por su lado derecho."
  },
  {
    id: "q_pdf_22",
    chapter: 6,
    category: "Normas de circulación",
    doublePoints: false,
    image: "assets/pdf-images/pdf-086-183.png",
    question: "Observe las señales manuales con el brazo de la página 86 del manual. Si un ciclista o conductor extiende su brazo izquierdo en ángulo recto hacia arriba, ¿qué maniobra está anunciando?",
    options: [
      "Viraje a la izquierda.",
      "Viraje a la derecha o cambio a la pista derecha.",
      "Disminución de velocidad o detención.",
      "Saludo a otros usuarios de la vía."
    ],
    correct: 1,
    explanation: "En la página 86 se detallan las tres señales manuales reglamentarias: brazo izquierdo horizontal = viraje a la izquierda; brazo izquierdo en ángulo recto hacia arriba = viraje a la derecha; brazo izquierdo hacia abajo = disminución de velocidad o detención."
  },
  {
    id: "q_pdf_23",
    chapter: 6,
    category: "Normas de circulación",
    doublePoints: false,
    image: "assets/pdf-images/pdf-089-190.png",
    question: "Observe el esquema comparativo de la página 89 sobre circulación en calzadas. ¿Cuándo una maniobra para pasar a otro vehículo en el mismo sentido se denomina 'Adelantar' y cuándo 'Sobrepasar'?",
    options: [
      "Se llama adelantar en zona urbana y sobrepasar en zona rural.",
      "Es 'Adelantar' cuando se traspasa el eje de la calzada (invadiendo la pista de sentido contrario) y 'Sobrepasar' cuando se pasa a otro vehículo sin traspasar el eje central (en vías con dos o más pistas en el mismo sentido).",
      "Es 'Adelantar' cuando se pasa por la derecha y 'Sobrepasar' por la izquierda.",
      "Ambos términos significan exactamente lo mismo en la Ley de Tránsito."
    ],
    correct: 1,
    explanation: "La página 89 grafica claramente la diferencia legal: adelantar implica situarse delante de otro vehículo cruzando el eje de la calzada; sobrepasar se realiza en calzadas con varias pistas en el mismo sentido sin cruzar el eje."
  },
  {
    id: "q_pdf_24",
    chapter: 6,
    category: "Normas de circulación",
    doublePoints: false,
    image: "assets/pdf-images/pdf-090-192.png",
    question: "Según la ilustración de uso correcto de pistas de la página 90, cuando una calzada cuenta con tres o más pistas en un mismo sentido y usted circula a una velocidad inferior a la del resto del flujo, ¿por cuál pista debe circular?",
    options: [
      "Por la pista izquierda para tener mejor visibilidad.",
      "Por la pista de más a la derecha, dejando las pistas centrales e izquierda para quienes circulan a mayor velocidad o sobrepasan.",
      "Zigzagueando entre las tres pistas según el tráfico.",
      "Por la berma lateral de emergencia."
    ],
    correct: 1,
    explanation: "La página 90 muestra que en vías de múltiples pistas por sentido se debe circular normalmente por la pista derecha, reservando las demás para sobrepasar o virar a la izquierda."
  },
  {
    id: "q_pdf_25",
    chapter: 6,
    category: "Normas de circulación",
    doublePoints: false,
    image: "assets/pdf-images/pdf-092-197.png",
    question: "Observe los diagramas de viraje a la izquierda en una intersección bidireccional (pág. 92). ¿Dónde deben ubicarse dos vehículos que vienen en sentidos opuestos y ambos desean virar a su respectiva izquierda?",
    options: [
      "Deben rodearse mutuamente por detrás cerrando el paso de quienes siguen directo.",
      "Deben ubicarse justo a la derecha del eje central de su respectiva vía y virar pasando cada uno por delante del otro (sin bloquearse mutuamente).",
      "Deben abrirse hacia la berma derecha antes de girar a la izquierda.",
      "Está prohibido que dos vehículos viren a la izquierda al mismo tiempo."
    ],
    correct: 1,
    explanation: "Como ilustra la página 92, al virar a la izquierda desde vías bidireccionales la trayectoria correcta es situarse junto al eje central y girar pasando por delante del centro del cruce y del vehículo que vira en sentido opuesto."
  },
  {
    id: "q_pdf_26",
    chapter: 6,
    category: "Normas de circulación",
    doublePoints: false,
    image: "assets/pdf-images/pdf-093-203.png",
    question: "En la lámina sobre circulación en rotondas (pág. 93), ¿qué obligaciones tiene quien se aproxima para ingresar a la rotonda y luego para salir de ella?",
    options: [
      "Tiene preferencia automática sobre quienes ya giran dentro de la rotonda.",
      "Al ingresar debe ceder el paso a los vehículos que ya circulan dentro de la rotonda; y para salir debe ubicarse oportunamente en la pista exterior derecha y señalizar con el intermitente derecho.",
      "Debe ingresar tocando la bocina y salir desde la pista interior directamente.",
      "Puede circular en sentido horario o antihorario indistintamente."
    ],
    correct: 1,
    explanation: "La página 93 detalla que los vehículos que ya circulan por la rotonda tienen preferencia sobre los que desean ingresar, y toda salida debe señalizarse con anticipación desde la pista externa."
  },
  {
    id: "q_pdf_27",
    chapter: 6,
    category: "Normas de circulación",
    doublePoints: false,
    image: "assets/pdf-images/pdf-094-205.png",
    question: "Observe las ilustraciones sobre el Viraje en 'U' en la página 94 del manual. ¿En cuál de los siguientes lugares está estrictamente prohibido realizar un viraje en 'U'?",
    options: [
      "En vías urbanas donde una señal informativa lo autoriza expresamente.",
      "En las intersecciones de calles y caminos, sobre los pasos para peatones, a menos de 200 metros de una curva, cima o gradiente, y donde exista línea continua.",
      "En estacionamientos privados fuera de la vía pública.",
      "Únicamente en caminos de tierra."
    ],
    correct: 1,
    explanation: "La página 94 grafica las prohibiciones legales del viraje en U: intersecciones de calles y caminos, pasos peatonales, a menos de 200 m de curvas/cimas/cruces ferroviarios, puentes, túneles y donde la demarcación continua lo prohíba."
  },
  {
    id: "q_pdf_28",
    chapter: 6,
    category: "Normas de circulación",
    doublePoints: false,
    image: "assets/pdf-images/pdf-095-209.png",
    question: "Según los esquemas de 'Pistas Especiales' de la página 95 (pistas sólo buses), ¿en qué único caso un automóvil particular puede ingresar a una pista exclusiva para buses demarcada con línea segmentada?",
    options: [
      "Para adelantar al tráfico lento durante la hora punta.",
      "Únicamente por el tramo estrictamente necesario para realizar un viraje (por ejemplo, virar a la derecha en la esquina próxima o ingresar a un inmueble), donde la línea divisoria sea segmentada.",
      "Para estacionar mientras compra en un local comercial.",
      "Cuando el automóvil lleva más de dos pasajeros."
    ],
    correct: 1,
    explanation: "La página 95 muestra que las pistas sólo buses no pueden usarse para circular con vehículos particulares, salvo en el tramo demarcado con línea segmentada estrictamente necesario para efectuar un viraje."
  },
  {
    id: "q_pdf_29",
    chapter: 6,
    category: "Normas de circulación",
    doublePoints: false,
    image: "assets/pdf-images/pdf-101-222.png",
    question: "Observe el diagrama de encuentro con un obstáculo y un vehículo en sentido contrario (pág. 101). Si en su pista hay un vehículo detenido o trabajos en la vía y simultáneamente viene otro auto de frente, ¿quién debe ceder el paso?",
    options: [
      "El vehículo que viene en sentido contrario por su pista libre.",
      "El conductor en cuya pista se encuentra el obstáculo debe detenerse detrás de éste y ceder el paso al vehículo que viene en sentido contrario.",
      "Ambos deben pasar al mismo tiempo usando las bermas.",
      "Tiene preferencia quien encienda primero las luces altas."
    ],
    correct: 1,
    explanation: "Como ilustra la página 100–101, quien encuentra su pista obstruida debe disminuir la velocidad o detenerse y ceder el paso a los vehículos que vienen por la pista libre en sentido opuesto."
  },
  {
    id: "q_pdf_30",
    chapter: 6,
    category: "Normas de circulación",
    doublePoints: false,
    image: "assets/pdf-images/pdf-102-223.png",
    question: "En la lámina de adelantamiento en carretera de la página 102, ¿qué obligaciones tiene el conductor del vehículo que está siendo adelantado?",
    options: [
      "Aumentar la velocidad para poner a prueba al vehículo que lo adelanta.",
      "Mantenerse lo más cerca posible del borde derecho de su pista y no aumentar su velocidad hasta que el otro vehículo complete la maniobra.",
      "Desplazarse hacia el eje central de la calzada.",
      "Detenerse bruscamente en medio de la pista de circulación."
    ],
    correct: 1,
    explanation: "La página 102 indica que el conductor adelantado debe facilitar la maniobra ciñéndose a la derecha de la calzada y absteniéndose absolutamente de aumentar su velocidad."
  },
  {
    id: "q_pdf_31",
    chapter: 7,
    category: "Circunstancias especiales",
    doublePoints: false,
    image: "assets/pdf-images/pdf-111-249.png",
    question: "Observe el diagrama de estabilidad con remolque de la página 111. Si usted conduce un automóvil arrastrando un remolque y éste comienza a zigzaguear (colear), ¿qué acción debe realizar?",
    options: [
      "Acelerar a fondo para tensar el enganche del remolque.",
      "Soltar el acelerador y sujetar firmemente el volante reduciendo la velocidad de forma progresiva hasta recuperar la estabilidad.",
      "Dar volantazos bruscos de lado a lado.",
      "Tirar del freno de mano mientras mantiene el acelerador pisado."
    ],
    correct: 1,
    explanation: "La página 111 explica que un remolque mal estibado o a exceso de velocidad puede zigzaguear; ante ello se debe desacelerar suavemente y mantener el volante firme sin frenar ni girar bruscamente."
  },
  {
    id: "q_pdf_32",
    chapter: 7,
    category: "Circunstancias especiales",
    doublePoints: false,
    image: "assets/pdf-images/pdf-112-251.png",
    question: "Según las láminas de ingreso a autopistas de la página 112, ¿cómo debe utilizarse correctamente la pista de aceleración para incorporarse a una autopista?",
    options: [
      "Deteniéndose al inicio de la pista de aceleración e ingresando en primera marcha a 15 km/h.",
      "Señalizando oportunamente, aprovechando el largo de la pista de aceleración para alcanzar una velocidad similar a la del flujo de la autopista y cediendo el paso antes de incorporarse.",
      "Ingresando directamente a la pista izquierda sin mirar los espejos.",
      "Circulando en marcha atrás si se pasó de la entrada."
    ],
    correct: 1,
    explanation: "La página 112 ilustra la regla de incorporación: usar toda la pista de aceleración para igualar la velocidad del flujo de la autopista, respetando siempre la preferencia de quienes ya circulan por ella."
  },
  {
    id: "q_pdf_33",
    chapter: 7,
    category: "Circunstancias especiales",
    doublePoints: false,
    image: "assets/pdf-images/pdf-118-262.png",
    question: "Observe la ilustración de conducción bajo neblina o lluvia intensa en la página 118. ¿Por qué al conducir con neblina espesa se deben usar las luces bajas (y neblineros si los tiene) en lugar de las luces altas?",
    options: [
      "Porque las luces altas gastan el líquido refrigerante del motor.",
      "Porque las gotas de agua en suspensión reflejan el haz elevado de las luces altas hacia los ojos del propio conductor, reduciendo aún más la visibilidad.",
      "Porque está prohibido encender cualquier luz durante el día con neblina.",
      "Porque las luces bajas iluminan a más de 500 metros de distancia."
    ],
    correct: 1,
    explanation: "La página 118 muestra que en presencia de neblina las microgotas de agua actúan como espejo frente a las luces altas, encandilando al propio conductor; por ello deben usarse luces bajas y neblineros."
  },
  {
    id: "q_pdf_34",
    chapter: 8,
    category: "Conducción eficiente",
    doublePoints: false,
    image: "assets/pdf-images/pdf-132-276.png",
    question: "En los diagramas de conducción eficiente de la página 132, ¿por qué mantener una amplia distancia de seguridad respecto al vehículo que antecede reduce el consumo de combustible?",
    options: [
      "Porque permite ser remolcado por la corriente de aire del auto delantero.",
      "Porque evita el ciclo constante de frenadas y aceleraciones bruscas, permitiendo anticipar las variaciones del tráfico y aprovechar la inercia del vehículo con marcha engranada.",
      "Porque el motor se apaga automáticamente cada 10 metros.",
      "Porque reduce el peso total del vehículo en un 30%."
    ],
    correct: 1,
    explanation: "Como ilustra la página 132, conservar buena distancia permite anticipar maniobras, levantar el pie del acelerador con cambio puesto (corte de inyección = consumo 0) y evitar aceleraciones innecesarias."
  },
  {
    id: "q_pdf_35",
    chapter: 9,
    category: "Informaciones importantes",
    doublePoints: false,
    image: "assets/pdf-images/pdf-138-288.png",
    question: "Observe la secuencia de primeros auxilios de las páginas 137–138 del manual. Si una persona herida en un siniestro está inconsciente pero respira con normalidad y no presenta trauma evidente que impida su evaluación, ¿qué busca la posición lateral de seguridad?",
    options: [
      "Sentarla para darle de beber agua o bebidas azucaradas.",
      "Mantener despejada su vía aérea y evitar que sufra asfixia por la caída de la lengua hacia atrás o por eventuales vómitos o sangrado.",
      "Permitir que camine inmediatamente por la calzada.",
      "Quitarle el casco a tirones si es motociclista."
    ],
    correct: 1,
    explanation: "Las páginas 137–138 explican el protocolo ABC (vía aérea, respiración, circulación) y cómo mantener permeable la vía aérea evitando la asfixia sin dar jamás alimentos ni líquidos a un herido."
  },
  {
    id: "q_pdf_36",
    chapter: 9,
    category: "Informaciones importantes",
    doublePoints: false,
    image: "assets/pdf-images/pdf-146-290.png",
    question: "Según la secuencia ilustrada en la página 146 sobre detención por emergencia o avería en carretera, ¿qué elementos de seguridad debe activar y utilizar quien conduce antes de descender del vehículo?",
    options: [
      "Apagar todas las luces del auto y caminar por el centro de la pista rápida.",
      "Encender de inmediato las luces intermitentes de emergencia (hazard), colocarse el chaleco reflectante antes de bajar del habitáculo e instalar los triángulos reflectantes a distancia reglamentaria.",
      "Levantar el capó y sentarse sobre el parachoques delantero.",
      "Colocar piedras grandes en el eje central de la calzada."
    ],
    correct: 1,
    explanation: "La página 146 grafica paso a paso cómo actuar ante una pana o emergencia: encender luces de advertencia de peligro, retirarse fuera de la calzada si es posible, ponerse el chaleco reflectante antes de salir del auto e instalar los dispositivos reflectantes."
  }
];

// Eliminar duplicados previos de q_pdf_* si existieran
const baseQuestions = window.CONASET_QUESTIONS.filter(q => !String(q.id).startsWith("q_pdf_"));
const allQuestions = [...baseQuestions, ...newVisualQuestions];

// Mapeador semántico que asigna a CADA pregunta del banco una ilustración extraída del PDF oficial (assets/pdf-images/...)
function pickPdfImageForQuestion(q) {
  if (String(q.id).startsWith("q_pdf_") || String(q.id).startsWith("q1") || String(q.id).startsWith("q2") || String(q.id).startsWith("q3") || String(q.id).startsWith("q4") || String(q.id).startsWith("q5") || String(q.id).startsWith("q6") || String(q.id).startsWith("q7") || String(q.id).startsWith("q8") || String(q.id).startsWith("q9")) {
    if (String(q.image || "").startsWith("assets/pdf-images/")) {
      return q.image;
    }
  }

  const text = `${q.question} ${(q.options || []).join(" ")} ${q.explanation || ""}`.toLowerCase();

  // Reglas de coincidencia temática con las láminas del PDF 2026
  if (text.includes("silla") || text.includes("retención infantil") || text.includes("sri") || text.includes("niño") || text.includes("lactante") || text.includes("135 cm") || text.includes("12 años")) {
    return text.includes("atrás") || text.includes("lactante")
      ? "assets/pdf-images/pdf-075-097.png"
      : "assets/pdf-images/pdf-074-091.png";
  }
  if (text.includes("alcohol") || text.includes("ebriedad") || text.includes("alcoholemia") || text.includes("tolerancia cero") || text.includes("emilia") || text.includes("0,31") || text.includes("0,8")) {
    if (text.includes("hora") || text.includes("elimina") || text.includes("curva") || text.includes("metabol")) {
      return "assets/pdf-images/pdf-052-080.png";
    }
    return text.includes("sanción") || text.includes("suspensión") || text.includes("cárcel") || text.includes("inhabilidad")
      ? "assets/pdf-images/pdf-050-vec.png"
      : "assets/pdf-images/pdf-050-table.png";
  }
  if (text.includes("túnel") || text.includes("campo visual") || text.includes("visión periférica")) {
    return "assets/pdf-images/pdf-043-076.png";
  }
  if (text.includes("droga") || text.includes("marihuana") || text.includes("cocaína") || text.includes("medicamento") || text.includes("antihistamínico") || text.includes("fatiga") || text.includes("sueño") || text.includes("somnolencia")) {
    return "assets/pdf-images/pdf-034-vec.png";
  }
  if (text.includes("celular") || text.includes("whatsapp") || text.includes("distracción") || text.includes("manos libres")) {
    return "assets/pdf-images/pdf-044-079.png";
  }
  if (text.includes("apoyacabeza") || text.includes("latigazo") || text.includes("cervical")) {
    return "assets/pdf-images/pdf-031-071.png";
  }
  if (text.includes("airbag") || text.includes("bolsa de aire")) {
    return "assets/pdf-images/pdf-030-070.png";
  }
  if (text.includes("cinturón") || text.includes("submarino")) {
    return "assets/pdf-images/pdf-027-053.png";
  }
  if (text.includes("neumático") || text.includes("1,6 mm") || text.includes("presión de aire") || text.includes("banda de rodadura") || text.includes("surco")) {
    return "assets/pdf-images/pdf-019-023.png";
  }
  if (text.includes("punto ciego") || text.includes("puntos ciegos") || text.includes("ángulo muerto") || text.includes("espejo retrovisor") || text.includes("espejos")) {
    return "assets/pdf-images/pdf-021-044.png";
  }
  if (text.includes("reacción") || text.includes("distancia de frenado") || text.includes("distancia de detención") || text.includes("detención total")) {
    return "assets/pdf-images/pdf-024-047.png";
  }
  if (text.includes("energía cinética") || text.includes("cuadrado de la velocidad") || text.includes("fuerza centrífuga") || text.includes("curva")) {
    return "assets/pdf-images/pdf-023-045.png";
  }
  if (text.includes("tablero") || text.includes("testigo") || text.includes("velocímetro") || text.includes("tacómetro")) {
    return "assets/pdf-images/pdf-011-003.png";
  }
  if (text.includes("aceite") || text.includes("lubricación") || text.includes("motor")) {
    return "assets/pdf-images/pdf-012-005.png";
  }
  if (text.includes("amortiguador") || text.includes("suspensión") || text.includes("dirección") || text.includes("frenos abs") || text.includes("líquido de freno")) {
    return "assets/pdf-images/pdf-014-013.png";
  }
  if (text.includes("seguridad activa") || text.includes("seguridad pasiva")) {
    return "assets/pdf-images/pdf-026-051.png";
  }
  if (text.includes("ciclista") || text.includes("bicicleta") || text.includes("1,5 m") || text.includes("ciclovía")) {
    return "assets/pdf-images/pdf-072-083.png";
  }
  if (text.includes("peatón") || text.includes("peatones") || text.includes("paso de cebra") || text.includes("paso peatonal") || text.includes("persona mayor")) {
    return "assets/pdf-images/pdf-071-082.png";
  }
  if (text.includes("motocicleta") || text.includes("motociclista") || text.includes("casco")) {
    return q.chapter === 9 ? "assets/pdf-images/pdf-137-284.png" : "assets/pdf-images/pdf-099-213.png";
  }
  if (text.includes("carabinero")) {
    return "assets/pdf-images/pdf-077-109.png";
  }
  if (text.includes("semáforo") || text.includes("luz roja") || text.includes("luz verde") || text.includes("luz amarilla") || text.includes("flecha verde")) {
    return "assets/pdf-images/pdf-079-121.png";
  }
  if (text.includes("rotonda")) {
    return "assets/pdf-images/pdf-093-203.png";
  }
  if (text.includes("viraje en u") || text.includes("virar en u")) {
    return "assets/pdf-images/pdf-094-205.png";
  }
  if (text.includes("adelantar") || text.includes("adelantamiento") || text.includes("sobrepasar")) {
    return text.includes("sobrepasar") ? "assets/pdf-images/pdf-089-190.png" : "assets/pdf-images/pdf-102-223.png";
  }
  if (text.includes("estacionar") || text.includes("estacionamiento") || text.includes("grifo") || text.includes("cuneta") || text.includes("10 metros") || text.includes("20 metros")) {
    return "assets/pdf-images/pdf-106-239.png";
  }
  if (text.includes("línea continua") || text.includes("eje central") || text.includes("demarcación") || text.includes("línea mixta")) {
    return "assets/pdf-images/pdf-082-165.png";
  }
  if (text.includes("bloquear cruce") || text.includes("cuadrícula amarilla") || text.includes("cruce ferroviario") || text.includes("tren")) {
    return "assets/pdf-images/pdf-083-173.png";
  }
  if (text.includes("viraje") || text.includes("virar") || text.includes("intermitente") || text.includes("30 metros") || text.includes("brazo")) {
    return text.includes("brazo") ? "assets/pdf-images/pdf-086-183.png" : "assets/pdf-images/pdf-092-197.png";
  }
  if (text.includes("pista") || text.includes("exclusiva") || text.includes("buses") || text.includes("emergencia")) {
    return "assets/pdf-images/pdf-095-209.png";
  }
  if (text.includes("50 km/h") || text.includes("100 km/h") || text.includes("120 km/h") || text.includes("30 km/h") || text.includes("velocidad máxima") || text.includes("límite de velocidad")) {
    return "assets/pdf-images/pdf-098-212.png";
  }
  if (text.includes("lluvia") || text.includes("aquaplaning") || text.includes("hidroplaneo") || text.includes("charco") || text.includes("mojado")) {
    return "assets/pdf-images/pdf-115-259.png";
  }
  if (text.includes("hielo") || text.includes("nieve") || text.includes("escarcha") || text.includes("helada")) {
    return "assets/pdf-images/pdf-116-261.png";
  }
  if (text.includes("neblina") || text.includes("niebla") || text.includes("neblinero")) {
    return "assets/pdf-images/pdf-118-262.png";
  }
  if (text.includes("noche") || text.includes("nocturna") || text.includes("encandil") || text.includes("luces altas") || text.includes("luces bajas")) {
    return "assets/pdf-images/pdf-110-246.png";
  }
  if (text.includes("carga") || text.includes("portaequipaje") || text.includes("equipaje") || text.includes("remolque")) {
    return text.includes("remolque") ? "assets/pdf-images/pdf-111-249.png" : "assets/pdf-images/pdf-114-258.png";
  }
  if (text.includes("autopista") || text.includes("pista de aceleración") || text.includes("peaje")) {
    return "assets/pdf-images/pdf-112-251.png";
  }
  if (text.includes("eficiente") || text.includes("combustible") || text.includes("rpm") || text.includes("marcha") || text.includes("punto muerto") || text.includes("neutro") || text.includes("consumo")) {
    return text.includes("rpm") || text.includes("2.000") ? "assets/pdf-images/pdf-131-272.png" : "assets/pdf-images/pdf-132-276.png";
  }
  if (text.includes("herido") || text.includes("auxilio") || text.includes("ambulancia") || text.includes("hemorragia") || text.includes("respiración") || text.includes("inconsciente")) {
    return "assets/pdf-images/pdf-138-288.png";
  }
  if (text.includes("chaleco reflectante") || text.includes("triángulo") || text.includes("desperfecto") || text.includes("avería") || text.includes("emergencia")) {
    return "assets/pdf-images/pdf-146-290.png";
  }
  if (text.includes("eléctrico") || text.includes("contaminación") || text.includes("emisiones") || text.includes("medio ambiente") || text.includes("catalítico")) {
    return "assets/pdf-images/pdf-147-295.png";
  }
  if (text.includes("soap") || text.includes("padron") || text.includes("padrón") || text.includes("permiso de circulación") || text.includes("revisión técnica") || text.includes("licencia") || text.includes("municipal")) {
    return "assets/pdf-images/pdf-168-685.png";
  }

  // Fallback por capítulo hacia una lámina oficial del PDF de ese capítulo
  const chapterDefault = {
    1: "assets/pdf-images/pdf-009-vec.png",
    2: "assets/pdf-images/pdf-024-047.png",
    3: "assets/pdf-images/pdf-034-vec.png",
    4: "assets/pdf-images/pdf-050-vec.png",
    5: "assets/pdf-images/pdf-074-091.png",
    6: "assets/pdf-images/pdf-084-176.png",
    7: "assets/pdf-images/pdf-110-246.png",
    8: "assets/pdf-images/pdf-131-272.png",
    9: "assets/pdf-images/pdf-137-284.png"
  };
  return chapterDefault[q.chapter] || "assets/pdf-images/pdf-084-176.png";
}

allQuestions.forEach((q) => {
  const localImg = pickPdfImageForQuestion(q);
  q.image = localImg;
  q.localFallback = localImg;
});

const out =
  `// Base de datos oficial CONASET 2026 - Automovilistas Clase B (280 Preguntas con 100% Ilustraciones Extraídas del PDF Oficial)\n` +
  `window.CONASET_CHAPTERS = ${JSON.stringify(window.CONASET_CHAPTERS, null, 2)};\n\n` +
  `window.CONASET_QUESTIONS = ${JSON.stringify(allQuestions, null, 2)};\n\n` +
  `window.CONASET_SIGNS = ${JSON.stringify(window.CONASET_SIGNS, null, 2)};\n`;

fs.writeFileSync(dbPath, out, "utf8");

const totalLocal = allQuestions.filter((q) => String(q.image).startsWith("assets/pdf-images/")).length;
console.log(`Updated questions-db.js: ${allQuestions.length} total questions (${newVisualQuestions.length} new visual PDF questions added).`);
console.log(`Questions using local extracted PDF images: ${totalLocal} / ${allQuestions.length} (100%).`);
