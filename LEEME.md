# Material Oficial CONASET 2026 · Licencia Clase B

Este directorio contiene todo el material gratuito extraído y consolidado desde **PracticaTest Chile** e integrado al simulador y planificador de estudio local.

---

## 📂 Archivos y Datos Integrados

### 1. Archivos JSON (Listos para consultar, APIs o scripts)
* **`material_clase_b_completo.json`**: Consolidado general con todos los exámenes, preguntas únicas, 138 señales de tránsito y los 10 capítulos del manual con sus trampas de examen.
* **`banco_preguntas.json`**: 170 preguntas de examen municipal oficiales extraídas directamente, con enunciado, opciones, diagramas y respuesta correcta verificada.
* **`senales_transito.json`**: Catálogo completo de 138 señales de tránsito de Chile (Reglamentarias, Advertencia de Peligro, Informativas y Transitorias) con código oficial, nombre, descripción y URL de imagen SVG en alta resolución.
* **`temario_y_trampas.json`**: Resumen estructurado de los 10 capítulos del Libro del Nuevo Conductor Clase B con los distractores y «Trampas de examen» más frecuentes.

---

### 2. Integración al Simulador Local (`index.html`)
La aplicación web local quedó enriquecida automáticamente:
* **Banco ampliado a 245 preguntas oficiales**: Se integraron las 170 preguntas nuevas a `questions-db.js` (clasificadas en sus respectivos capítulos del 1 al 10 y con preguntas de doble puntaje identificadas).
* **Soporte completo para imágenes y diagramas**: En `app.js` se agregó el renderizado de los diagramas y fotos oficiales tanto durante el examen como en la pantalla de revisión final.
* **Nueva pestaña "Señales (138)"**: Ahora puedes navegar y buscar interactivamente entre las 138 señales de tránsito oficiales directamente dentro de la interfaz web (`index.html`).

---

## 🚀 Cómo Usar
Simplemente abre el archivo **`index.html`** con tu navegador favorito (Chrome, Firefox, Edge, etc.) para comenzar a practicar.
