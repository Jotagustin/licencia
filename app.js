// ==========================================================================
// CLASE B · CONASET 2026 — Lógica de Planificación y Simulador Minimalista
// ==========================================================================

(function () {
  const STORAGE_KEY = "claseb_crono_state_v1";

  const ICONS = {
    check: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    xmark: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    arrowRight: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
    arrowLeft: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
    clock: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    chevronRight: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
    chevronDown: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
    sun: `<path d="M12 3v2m0 14v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path><circle cx="12" cy="12" r="5"></circle>`,
    moon: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`
  };

  function getTodayISO() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function addDaysISO(baseISO, daysToAdd) {
    const [y, m, d] = baseISO.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + daysToAdd);
    const ny = dt.getFullYear();
    const nm = String(dt.getMonth() + 1).padStart(2, "0");
    const nd = String(dt.getDate()).padStart(2, "0");
    return `${ny}-${nm}-${nd}`;
  }

  function diffDays(fromISO, toISO) {
    const [y1, m1, d1] = fromISO.split("-").map(Number);
    const [y2, m2, d2] = toISO.split("-").map(Number);
    const dt1 = new Date(y1, m1 - 1, d1);
    const dt2 = new Date(y2, m2 - 1, d2);
    const diff = Math.round((dt2 - dt1) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  }

  function formatHumanDate(isoStr) {
    const [y, m, d] = isoStr.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString("es-CL", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });
  }

  const defaultState = {
    targetDate: addDaysISO(getTodayISO(), 7),
    baselineLevel: "zero",
    targetSimulacros: 6,
    feedbackMode: "instant",
    completedDays: {},
    masteredQuestionIds: [],
    failedQuestionIds: [],
    examHistory: [],
    studiedMinutesToday: 0,
    lastStudyDate: getTodayISO(),
    theme: "light"
  };

  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaultState };
      const parsed = JSON.parse(raw);
      const merged = { ...defaultState, ...parsed };
      if (merged.lastStudyDate !== getTodayISO()) {
        merged.studiedMinutesToday = 0;
        merged.lastStudyDate = getTodayISO();
      }
      return merged;
    } catch (e) {
      return { ...defaultState };
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // Ignore storage error
    }
  }

  // ==========================================================================
  // Cálculo del Plan Diario Según Fecha Meta
  // ==========================================================================
  function computeSprintPlan() {
    const today = getTodayISO();
    const daysLeft = diffDays(today, state.targetDate);

    const totalChapterMinutes = window.CONASET_CHAPTERS.reduce(
      (acc, ch) => acc + ch.baseMinutes,
      0
    );

    const levelMultiplier =
      state.baselineLevel === "zero"
        ? 1.0
        : state.baselineLevel === "medium"
        ? 0.68
        : 0.42;

    const effectiveTheoryMinutes = Math.round(totalChapterMinutes * levelMultiplier);
    const targetTestsCount = Math.max(daysLeft * 2, Number(state.targetSimulacros) + daysLeft);
    const totalTestMinutes = targetTestsCount * 18;
    const totalRequiredMinutes = effectiveTheoryMinutes + totalTestMinutes;

    const dailyMinutes = Math.max(20, Math.ceil(totalRequiredMinutes / daysLeft));
    const testsPerDay = Math.max(1, Math.ceil(targetTestsCount / daysLeft));

    const chapters = window.CONASET_CHAPTERS;
    const schedule = [];

    for (let i = 0; i < daysLeft; i++) {
      const dayISO = addDaysISO(today, i);
      const dayNumber = i + 1;

      let assignedChapters = [];
      if (daysLeft === 1) {
        assignedChapters = chapters.slice();
      } else if (daysLeft <= 3) {
        const chunkSize = Math.ceil(chapters.length / daysLeft);
        const start = i * chunkSize;
        assignedChapters = chapters.slice(start, start + chunkSize);
        if (assignedChapters.length === 0) {
          assignedChapters = [chapters[1], chapters[3], chapters[4], chapters[5]];
        }
      } else {
        const theoryDays = Math.max(1, Math.floor(daysLeft * 0.8));
        if (i < theoryDays) {
          const startIdx = Math.floor((i * chapters.length) / theoryDays);
          const endIdx = Math.floor(((i + 1) * chapters.length) / theoryDays);
          assignedChapters = chapters.slice(startIdx, Math.max(startIdx + 1, endIdx));
        } else {
          assignedChapters = [chapters[1], chapters[3], chapters[4], chapters[5]];
        }
      }

      const isFinalStage = daysLeft > 3 && i >= Math.floor(daysLeft * 0.8);
      const focusTitle =
        daysLeft === 1
          ? "Intensivo completo: 9 capítulos y simulacro municipal"
          : isFinalStage
          ? "Simulacro oficial completo y refuerzo de doble puntaje"
          : assignedChapters.map((c) => `${c.number} (${c.title})`).join(" · ");

      schedule.push({
        dayIndex: i,
        dayNumber,
        dateISO: dayISO,
        humanDate: formatHumanDate(dayISO),
        isToday: i === 0,
        dailyMinutes,
        testsPerDay,
        isFinalStage,
        focusTitle,
        chapterIds: assignedChapters.map((c) => c.id),
        chapters: assignedChapters,
        completed: Boolean(state.completedDays[dayISO])
      });
    }

    return {
      daysLeft,
      dailyMinutes,
      testsPerDay,
      totalRequiredMinutes,
      targetTestsCount,
      schedule
    };
  }

  function computeReadinessStats() {
    const totalQuestions = window.CONASET_QUESTIONS.length;
    const masteredCount = state.masteredQuestionIds.length;
    const failedCount = state.failedQuestionIds.length;
    const history = state.examHistory;

    let avgScore38 = 0;
    if (history.length > 0) {
      const recent = history.slice(-5);
      const sum = recent.reduce((acc, item) => acc + item.scaledScore38, 0);
      avgScore38 = Math.round((sum / recent.length) * 10) / 10;
    }

    return {
      totalQuestions,
      masteredCount,
      failedCount,
      examsTaken: history.length,
      avgScore38
    };
  }

  // ==========================================================================
  // Renderizado de la Vista 1: Plan y Práctica
  // ==========================================================================
  function renderDashboard() {
    const plan = computeSprintPlan();
    const stats = computeReadinessStats();

    const dateInput = document.getElementById("target-date-input");
    if (dateInput) {
      dateInput.min = getTodayISO();
      dateInput.value = state.targetDate;
    }

    const levelSelect = document.getElementById("baseline-level-select");
    if (levelSelect) levelSelect.value = state.baselineLevel;

    const feedbackSelect = document.getElementById("feedback-mode-select");
    if (feedbackSelect) feedbackSelect.value = state.feedbackMode;

    document.querySelectorAll("[data-preset-days]").forEach((btn) => {
      const d = Number(btn.getAttribute("data-preset-days"));
      btn.classList.toggle("is-selected", d === plan.daysLeft);
    });

    // Franja de 3 métricas esenciales
    document.getElementById("odo-days-left").textContent =
      plan.daysLeft === 1 ? "1 día" : `${plan.daysLeft} días`;
    document.getElementById("odo-target-date-sub").textContent = `Meta: ${formatHumanDate(
      state.targetDate
    )}`;

    document.getElementById("odo-daily-time").textContent = `${plan.dailyMinutes} min`;
    document.getElementById("odo-daily-time-sub").textContent = `${plan.testsPerDay} ${
      plan.testsPerDay === 1 ? "test diario" : "tests diarios"
    } · Hoy: ${state.studiedMinutesToday} min`;

    const scoreEl = document.getElementById("odo-avg-score");
    const scoreSubEl = document.getElementById("odo-avg-score-sub");
    if (stats.examsTaken > 0) {
      scoreEl.textContent = `${stats.avgScore38} / 38`;
      scoreSubEl.textContent =
        stats.avgScore38 >= 33
          ? `Aprobado (${stats.masteredCount}/${stats.totalQuestions} dominadas)`
          : `Faltan ${Math.ceil(33 - stats.avgScore38)} pts para aprobar`;
    } else {
      scoreEl.textContent = "Pendiente";
      scoreSubEl.textContent = `${stats.masteredCount}/${stats.totalQuestions} pregs dominadas`;
    }

    // Resumen del foco de hoy
    const todayPlan = plan.schedule[0];
    if (todayPlan) {
      document.getElementById("today-focus-summary").textContent = `Meta de hoy (${todayPlan.humanDate}) · ${todayPlan.dailyMinutes} min sugeridos`;
      document.getElementById("today-focus-chapters").textContent = todayPlan.focusTitle;
    }

    // Contador de errores
    const mistakesBadge = document.getElementById("mistakes-count-badge");
    if (mistakesBadge) {
      mistakesBadge.textContent = `${stats.failedCount} ${
        stats.failedCount === 1 ? "error" : "errores"
      }`;
      mistakesBadge.className = `status-pill tabular ${
        stats.failedCount > 0 ? "pill-fail" : ""
      }`;
    }

    // Meta del cronograma
    const completedCount = plan.schedule.filter((d) => d.completed).length;
    const schedMeta = document.getElementById("schedule-summary-meta");
    if (schedMeta) {
      schedMeta.textContent = `${completedCount} de ${plan.daysLeft} días completados`;
    }

    // Lista vertical del cronograma
    const listContainer = document.getElementById("sprint-schedule-list");
    if (listContainer) {
      listContainer.innerHTML = plan.schedule
        .map((day) => {
          return `
            <div class="clean-row ${day.isToday ? "is-today-row" : ""}">
              <div class="row-main">
                <button type="button" class="check-toggle ${
                  day.completed ? "is-checked" : ""
                }" data-action="toggle-day-complete" data-day-iso="${
            day.dateISO
          }" aria-label="Marcar día ${day.dayNumber} como completado">
                  ${ICONS.check}
                </button>
                <div>
                  <h3 class="row-title" style="${
                    day.completed ? "text-decoration: line-through; color: var(--text-muted);" : ""
                  }">
                    Día ${day.dayNumber} · ${day.humanDate} ${
            day.isToday ? '<span class="status-pill" style="margin-left: 0.4rem;">Hoy</span>' : ""
          }
                  </h3>
                  <p class="row-sub">${day.focusTitle}</p>
                </div>
              </div>
              <div class="row-right">
                <span class="status-pill tabular">${day.dailyMinutes} min</span>
                <button type="button" class="btn-text-action" data-action="start-day-test" data-day-index="${
                  day.dayIndex
                }">
                  <span>Practicar</span>
                  ${ICONS.chevronRight}
                </button>
              </div>
            </div>
          `;
        })
        .join("");
    }

    renderHistoryList();
  }

  function renderHistoryList() {
    const container = document.getElementById("recent-history-list");
    if (!container) return;

    if (state.examHistory.length === 0) {
      container.innerHTML = `
        <div class="clean-row" style="color: var(--text-muted); font-size: 0.86rem;">
          Aún no hay simulacros registrados. Inicia el test del día o un simulacro oficial para evaluar tu nivel.
        </div>
      `;
      return;
    }

    container.innerHTML = state.examHistory
      .slice()
      .reverse()
      .slice(0, 6)
      .map((entry) => {
        const passed = entry.scaledScore38 >= 33;
        return `
          <div class="clean-row">
            <div class="row-main">
              <span class="status-dot ${passed ? "dot-done" : "dot-fail"}" aria-hidden="true"></span>
              <div>
                <p class="row-title">${entry.title}</p>
                <p class="row-sub tabular">${entry.dateStr} · Duración: ${entry.durationStr}</p>
              </div>
            </div>
            <div class="row-right">
              <span class="tabular" style="font-size: 0.88rem; font-weight: 600;">
                ${entry.scaledScore38} / 38 pts
              </span>
              <span class="status-pill ${passed ? "pill-pass" : "pill-fail"}">
                ${passed ? "Aprobado" : "Reprobado"}
              </span>
            </div>
          </div>
        `;
      })
      .join("");
  }

  // ==========================================================================
  // Motor de Exámenes
  // ==========================================================================
  let activeExam = null;
  let examTimerInterval = null;

  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function prepareQuestionInstance(q) {
    const rawExplanations = Array.isArray(q.optionExplanations)
      ? q.optionExplanations
      : [];
    const indexedOptions = q.options.map((text, idx) => ({
      text,
      whyText: rawExplanations[idx] || q.explanation || "",
      isCorrect: idx === q.correct
    }));
    const shuffled = shuffleArray(indexedOptions);
    const newCorrectIndex = shuffled.findIndex((o) => o.isCorrect);
    return {
      ...q,
      options: shuffled.map((o) => o.text),
      optionExplanations: shuffled.map((o) => o.whyText),
      correct: newCorrectIndex
    };
  }

  function buildExamQuestions(mode, options = {}) {
    const allQuestions = window.CONASET_QUESTIONS;

    if (mode === "official") {
      const doubles = shuffleArray(allQuestions.filter((q) => q.doublePoints));
      const singles = shuffleArray(allQuestions.filter((q) => !q.doublePoints));

      const selectedDoubles = doubles.slice(0, 3);
      const selectedSingles = singles.slice(0, 32);

      const usedIds = new Set([...selectedDoubles, ...selectedSingles].map((q) => q.id));
      const remaining = shuffleArray(allQuestions.filter((q) => !usedIds.has(q.id)));
      const combined = [...selectedDoubles, ...selectedSingles, ...remaining].slice(0, 35);

      return shuffleArray(
        combined.map((q, idx) => ({
          ...prepareQuestionInstance(q),
          doublePoints: idx < 3
        }))
      );
    }

    if (mode === "day-sprint") {
      const plan = computeSprintPlan();
      const dayObj = plan.schedule[options.dayIndex || 0] || plan.schedule[0];
      const chapterSet = new Set(dayObj.chapterIds);
      const pdfVisualsInChapters = shuffleArray(
        allQuestions.filter((q) => chapterSet.has(q.chapter) && String(q.id).startsWith("q_pdf_"))
      );
      const restInChapters = shuffleArray(
        allQuestions.filter((q) => chapterSet.has(q.chapter) && !String(q.id).startsWith("q_pdf_"))
      );
      const doubles = shuffleArray(
        allQuestions.filter((q) => q.doublePoints && !chapterSet.has(q.chapter))
      );
      const combined = [...pdfVisualsInChapters.slice(0, 6), ...restInChapters, ...doubles].slice(0, 15);
      return shuffleArray(combined).map(prepareQuestionInstance);
    }

    if (mode === "double-points") {
      const doubles = shuffleArray(allQuestions.filter((q) => q.doublePoints));
      return doubles.map(prepareQuestionInstance);
    }

    if (mode === "express") {
      const doubles = shuffleArray(allQuestions.filter((q) => q.doublePoints)).slice(0, 2);
      const singles = shuffleArray(allQuestions.filter((q) => !q.doublePoints)).slice(0, 8);
      return shuffleArray([...doubles, ...singles]).map(prepareQuestionInstance);
    }

    if (mode === "mistakes") {
      const failedSet = new Set(state.failedQuestionIds);
      let pool = allQuestions.filter((q) => failedSet.has(q.id));
      if (pool.length === 0) {
        pool = shuffleArray(allQuestions.filter((q) => q.doublePoints)).slice(0, 10);
      }
      return shuffleArray(pool).map(prepareQuestionInstance);
    }

    if (mode === "chapter") {
      const chId = Number(options.chapterId) || 1;
      const pool = shuffleArray(allQuestions.filter((q) => q.chapter === chId));
      return pool.map(prepareQuestionInstance);
    }

    return shuffleArray(allQuestions).slice(0, 15).map(prepareQuestionInstance);
  }

  function startExam(mode, options = {}) {
    if (examTimerInterval) clearInterval(examTimerInterval);

    const questions = buildExamQuestions(mode, options);
    const maxPoints = questions.reduce((acc, q) => acc + (q.doublePoints ? 2 : 1), 0);

    let title = "Simulacro oficial municipal";
    let timeLimitSeconds = 45 * 60;

    if (mode === "day-sprint") {
      const dayNum = (options.dayIndex || 0) + 1;
      title = `Práctica programada · Día ${dayNum}`;
      timeLimitSeconds = 20 * 60;
    } else if (mode === "double-points") {
      title = "Práctica de preguntas de doble puntaje";
      timeLimitSeconds = 20 * 60;
    } else if (mode === "express") {
      title = "Práctica breve (10 preguntas)";
      timeLimitSeconds = 12 * 60;
    } else if (mode === "mistakes") {
      title = "Repaso de errores registrados";
      timeLimitSeconds = 15 * 60;
    } else if (mode === "chapter") {
      const ch = window.CONASET_CHAPTERS.find((c) => c.id === Number(options.chapterId));
      title = ch ? `${ch.number}: ${ch.title}` : "Práctica por capítulo";
      timeLimitSeconds = 15 * 60;
    }

    activeExam = {
      mode,
      title,
      questions,
      maxPoints,
      currentIndex: 0,
      answers: {},
      startTimeMs: Date.now(),
      remainingSeconds: timeLimitSeconds,
      finished: false,
      feedbackMode: mode === "official" ? state.feedbackMode : "instant"
    };

    switchView("exam");
    renderExamView();

    examTimerInterval = setInterval(() => {
      if (!activeExam || activeExam.finished) {
        clearInterval(examTimerInterval);
        return;
      }
      activeExam.remainingSeconds = Math.max(0, activeExam.remainingSeconds - 1);
      updateTimerDisplay();
      if (activeExam.remainingSeconds === 0) {
        finishExam();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const timerEl = document.getElementById("exam-timer-display");
    if (!timerEl || !activeExam) return;
    const mins = Math.floor(activeExam.remainingSeconds / 60);
    const secs = activeExam.remainingSeconds % 60;
    timerEl.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  }

  function renderExamView() {
    const container = document.getElementById("exam-cockpit-container");
    if (!container || !activeExam) return;

    if (activeExam.finished) {
      renderExamResults(container);
      return;
    }

    const qIndex = activeExam.currentIndex;
    const totalQ = activeExam.questions.length;
    const q = activeExam.questions[qIndex];
    const selectedOpt = activeExam.answers[qIndex];
    const hasAnswered = selectedOpt !== undefined;
    const showInstant = activeExam.feedbackMode === "instant" && hasAnswered;

    const progressPct = Math.round(((qIndex + 1) / totalQ) * 100);
    const letters = ["A", "B", "C", "D"];

    const optionsHtml = q.options
      .map((optText, idx) => {
        let stateClass = "";
        let keyContent = letters[idx] || idx + 1;

        if (hasAnswered) {
          if (showInstant) {
            if (idx === q.correct) {
              stateClass = "is-correct";
              keyContent = ICONS.check;
            } else if (idx === selectedOpt) {
              stateClass = "is-wrong";
              keyContent = ICONS.xmark;
            }
          } else if (idx === selectedOpt) {
            stateClass = "is-selected";
          }
        }

        return `
          <button type="button" class="option-row ${stateClass}" data-action="select-option" data-opt-index="${idx}" ${
          showInstant ? "disabled" : ""
        }>
            <span class="option-key">${keyContent}</span>
            <span>${optText}</span>
          </button>
        `;
      })
      .join("");

    const indexButtonsHtml = activeExam.questions
      .map((item, idx) => {
        const ans = activeExam.answers[idx];
        let cls = "";
        if (idx === qIndex) cls += " is-current";
        else if (ans !== undefined) {
          if (activeExam.feedbackMode === "instant") {
            cls += ans === item.correct ? " is-ok" : " is-err";
          } else {
            cls += " is-ok";
          }
        }
        if (item.doublePoints) cls += " is-double";
        return `<button type="button" class="index-btn tabular ${cls}" data-action="jump-question" data-q-index="${idx}" title="Pregunta ${
          idx + 1
        }">${idx + 1}</button>`;
      })
      .join("");

    container.innerHTML = `
      <div class="exam-progress-track" aria-hidden="true">
        <div class="exam-progress-fill" style="width: ${progressPct}%;"></div>
      </div>

      <div class="exam-top-meta">
        <div>
          <strong style="color: var(--text-primary);">${activeExam.title}</strong>
          <span style="margin: 0 0.4rem;">·</span>
          <span class="tabular">Pregunta ${qIndex + 1} de ${totalQ}</span>
        </div>

        <div style="display: flex; align-items: center; gap: 0.85rem;">
          <span style="display: inline-flex; align-items: center; gap: 0.3rem;" class="tabular">
            ${ICONS.clock}
            <span id="exam-timer-display">45:00</span>
          </span>
          <button type="button" class="btn-outline" style="padding: 0.3rem 0.65rem; font-size: 0.78rem;" data-action="finish-exam">
            Finalizar
          </button>
        </div>
      </div>

      <div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="status-pill">Capítulo ${q.chapter} · ${q.category}</span>
          ${
            q.doublePoints
              ? `<span class="status-pill pill-double">Doble puntaje · 2 pts</span>`
              : `<span class="status-pill">1 pto</span>`
          }
        </div>

        <h2 class="exam-question-heading">${q.question}</h2>
        ${
          q.image
            ? `<figure class="exam-figure">
                <img src="${q.image}" data-fallback="${
                q.localFallback || ""
              }" onerror="if(this.dataset.fallback && this.src !== this.dataset.fallback){this.src = this.dataset.fallback;}" alt="Ilustración de apoyo para la pregunta" loading="lazy" />
                <figcaption class="exam-figure-caption">
                  Lámina de referencia · Libro para la Conducción en Chile (Capítulo ${q.chapter})
                </figcaption>
              </figure>`
            : ""
        }

        <div class="options-list">
          ${optionsHtml}
        </div>

        ${
          showInstant
            ? (() => {
                const isCorrectAns = selectedOpt === q.correct;
                const ptsLabel = `${q.doublePoints ? 2 : 1} ${
                  q.doublePoints ? "puntos" : "punto"
                }`;
                const chosenLetter = letters[selectedOpt] || selectedOpt + 1;
                const correctLetter = letters[q.correct] || q.correct + 1;
                const chosenWhy =
                  (q.optionExplanations && q.optionExplanations[selectedOpt]) ||
                  q.explanation;
                const correctWhy =
                  (q.optionExplanations && q.optionExplanations[q.correct]) ||
                  q.explanation;

                const otherWrongItems = q.options
                  .map((optText, idx) => ({
                    idx,
                    letter: letters[idx] || idx + 1,
                    optText,
                    why:
                      (q.optionExplanations && q.optionExplanations[idx]) ||
                      q.explanation
                  }))
                  .filter(
                    (item) =>
                      item.idx !== q.correct &&
                      (isCorrectAns || item.idx !== selectedOpt)
                  );

                return `
          <div class="feedback-panel" role="region" aria-label="Explicación pedagógica de la pregunta">
            <div class="feedback-header">
              <div class="feedback-header-title ${isCorrectAns ? "is-pass" : "is-fail"}">
                <span class="status-dot ${isCorrectAns ? "dot-done" : "dot-fail"}" aria-hidden="true"></span>
                <span>${
                  isCorrectAns
                    ? `Respuesta correcta (+${ptsLabel})`
                    : `Respuesta incorrecta (0 de ${ptsLabel})`
                }</span>
              </div>
              <span class="status-pill">${
                q.manualRef || `Capítulo ${q.chapter} · Manual Oficial 2026`
              }</span>
            </div>

            ${
              !isCorrectAns
                ? `
              <div class="feedback-block feedback-block-wrong">
                <div class="feedback-label label-wrong">
                  ${ICONS.xmark}
                  <span>Por qué NO es la alternativa ${chosenLetter} (Tu elección)</span>
                </div>
                <p class="feedback-quote">"${q.options[selectedOpt]}"</p>
                <p class="feedback-reason">${chosenWhy}</p>
              </div>
            `
                : ""
            }

            <div class="feedback-block feedback-block-correct">
              <div class="feedback-label label-correct">
                ${ICONS.check}
                <span>Por qué SÍ es la alternativa ${correctLetter} (${
                  isCorrectAns ? "Tu respuesta" : "Respuesta correcta"
                })</span>
              </div>
              <p class="feedback-quote">"${q.options[q.correct]}"</p>
              <p class="feedback-reason">${correctWhy}</p>
            </div>

            ${
              otherWrongItems.length > 0
                ? `
              <div class="feedback-block">
                <div class="feedback-label" style="color: var(--text-secondary);">
                  <span>Por qué se ${
                    otherWrongItems.length === 1 ? "descarta la otra alternativa" : "descartan las demás alternativas"
                  }</span>
                </div>
                <div class="feedback-all-list">
                  ${otherWrongItems
                    .map(
                      (item) => `
                    <div class="feedback-opt-row">
                      <strong style="color: var(--text-primary);">Alternativa ${item.letter} ("${item.optText}"):</strong>
                      <span> ${item.why}</span>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }
          </div>
        `;
              })()
            : ""
        }

        <div class="exam-footer-nav">
          <button type="button" class="btn-outline" data-action="prev-question" ${
            qIndex === 0 ? "disabled" : ""
          }>
            ${ICONS.arrowLeft}
            <span>Anterior</span>
          </button>

          ${
            qIndex < totalQ - 1
              ? `<button type="button" class="btn-solid" data-action="next-question">
                  <span>Siguiente</span>
                  ${ICONS.arrowRight}
                </button>`
              : `<button type="button" class="btn-solid" data-action="finish-exam">
                  <span>Entregar y evaluar</span>
                  ${ICONS.check}
                </button>`
          }
        </div>

        <div class="index-strip" aria-label="Navegación rápida de preguntas">
          ${indexButtonsHtml}
        </div>
      </div>
    `;

    updateTimerDisplay();
  }

  function finishExam() {
    if (!activeExam || activeExam.finished) return;
    activeExam.finished = true;
    if (examTimerInterval) clearInterval(examTimerInterval);

    let earnedPoints = 0;
    let correctCount = 0;
    const elapsedSeconds = Math.max(
      5,
      Math.round((Date.now() - activeExam.startTimeMs) / 1000)
    );
    const elapsedMinutes = Math.max(1, Math.ceil(elapsedSeconds / 60));

    const masteredSet = new Set(state.masteredQuestionIds);
    const failedSet = new Set(state.failedQuestionIds);

    activeExam.questions.forEach((q, idx) => {
      const pts = q.doublePoints ? 2 : 1;
      const userAns = activeExam.answers[idx];
      if (userAns === q.correct) {
        earnedPoints += pts;
        correctCount += 1;
        masteredSet.add(q.id);
        failedSet.delete(q.id);
      } else {
        failedSet.add(q.id);
      }
    });

    state.masteredQuestionIds = Array.from(masteredSet);
    state.failedQuestionIds = Array.from(failedSet);
    state.studiedMinutesToday += elapsedMinutes;

    const scaledScore38 =
      Math.round((earnedPoints / activeExam.maxPoints) * 38 * 10) / 10;

    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    const durationStr = `${mins}m ${secs}s`;

    activeExam.results = {
      earnedPoints,
      maxPoints: activeExam.maxPoints,
      correctCount,
      totalQuestions: activeExam.questions.length,
      scaledScore38,
      passed: scaledScore38 >= 33,
      durationStr
    };

    state.examHistory.push({
      title: activeExam.title,
      dateStr: new Date().toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit"
      }),
      earnedPoints,
      maxPoints: activeExam.maxPoints,
      scaledScore38,
      durationStr
    });

    saveState();
    renderExamView();
    renderDashboard();
  }

  function renderExamResults(container) {
    const res = activeExam.results;

    const reviewRowsHtml = activeExam.questions
      .map((q, idx) => {
        const userAns = activeExam.answers[idx];
        const isOk = userAns === q.correct;
        const userText =
          userAns !== undefined ? q.options[userAns] : "Sin responder";
        const correctText = q.options[q.correct];

        return `
          <div class="clean-row" style="align-items: flex-start; flex-direction: column; gap: 0.4rem;">
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
              <span style="font-size: 0.78rem; color: var(--text-muted);" class="tabular">
                Pregunta ${idx + 1} · Capítulo ${q.chapter} ${
          q.doublePoints ? "· Doble puntaje (2 pts)" : ""
        }
              </span>
              <span class="status-pill ${isOk ? "pill-pass" : "pill-fail"} tabular">
                ${isOk ? `+${q.doublePoints ? 2 : 1} pto` : `0 / ${q.doublePoints ? 2 : 1} pto`}
              </span>
            </div>

            <p class="row-title" style="font-size: 0.95rem;">${q.question}</p>
            ${
              q.image
                ? `<div style="margin: 0.5rem 0; background: #FFFFFF; padding: 0.5rem; border-radius: 6px; border: 1px solid var(--border-hairline);"><img src="${q.image}" data-fallback="${
                    q.localFallback || ""
                  }" onerror="if(this.dataset.fallback && this.src !== this.dataset.fallback){this.src = this.dataset.fallback;}" alt="Ilustración de la pregunta" style="max-height: 140px; width: auto; display: block;" /></div>`
                : ""
            }

            ${
              !isOk
                ? `<div class="feedback-block feedback-block-wrong" style="width: 100%; border-radius: var(--radius-sm); margin-top: 0.25rem;">
                    <div class="feedback-label label-wrong">
                      ${ICONS.xmark}
                      <span>Por qué NO es tu selección (${userText})</span>
                    </div>
                    <p class="feedback-reason">${
                      userAns !== undefined && q.optionExplanations
                        ? q.optionExplanations[userAns]
                        : "Pregunta sin responder dentro del tiempo del examen."
                    }</p>
                  </div>`
                : ""
            }
            <div class="feedback-block feedback-block-correct" style="width: 100%; border-radius: var(--radius-sm); margin-top: 0.25rem;">
              <div class="feedback-label label-correct">
                ${ICONS.check}
                <span>Por qué SÍ es la alternativa correcta (${correctText})</span>
              </div>
              <p class="feedback-reason">${
                (q.optionExplanations && q.optionExplanations[q.correct]) ||
                q.explanation
              }</p>
            </div>
          </div>
        `;
      })
      .join("");

    container.innerHTML = `
      <div style="padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-hairline);">
        <span class="status-pill ${res.passed ? "pill-pass" : "pill-fail"}">
          ${res.passed ? "Aprobado (Estándar Municipal ≥ 33/38)" : "No aprobado (Mínimo requerido: 33/38)"}
        </span>

        <h2 class="page-title tabular" style="margin-top: 0.6rem;">
          ${res.scaledScore38} / 38 puntos equivalentes
        </h2>

        <p class="page-subtitle tabular">
          Obtuviste ${res.earnedPoints} de ${res.maxPoints} puntos (${
      res.correctCount
    } de ${res.totalQuestions} respuestas correctas) en ${res.durationStr}.
        </p>

        <div style="display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 1.15rem;">
          <button type="button" class="btn-solid" data-action="start-mode" data-mode="official">
            <span>Nuevo simulacro oficial</span>
            ${ICONS.arrowRight}
          </button>
          ${
            state.failedQuestionIds.length > 0
              ? `<button type="button" class="btn-outline" data-action="start-mode" data-mode="mistakes">
                  <span>Repasar errores (${state.failedQuestionIds.length})</span>
                </button>`
              : ""
          }
          <button type="button" class="btn-outline" data-action="go-view" data-view="plan">
            <span>Volver al plan</span>
          </button>
        </div>
      </div>

      <section class="content-section">
        <div class="section-block-header">
          <div>
            <h2 class="section-heading">Revisión detallada de respuestas</h2>
            <p class="section-desc">Fundamento oficial por pregunta según el Libro para la Conducción en Chile 2026.</p>
          </div>
        </div>
        <div class="clean-list">
          ${reviewRowsHtml}
        </div>
      </section>
    `;
  }

  // ==========================================================================
  // Renderizado de la Vista 3: Acordeón del Temario 2026 + Calculadora Cap. 2
  // ==========================================================================
  function renderChaptersAccordion() {
    const container = document.getElementById("chapters-accordion-container");
    if (!container) return;

    container.innerHTML = window.CONASET_CHAPTERS.map((ch, idx) => {
      const chQuestionsCount = window.CONASET_QUESTIONS.filter(
        (q) => q.chapter === ch.id
      ).length;

      const calculatorHtml =
        ch.id === 2
          ? `
        <div class="inline-calculator">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.65rem;">
            <strong style="font-size: 0.86rem; color: var(--text-primary);">
              Calculadora de distancia de reacción y frenado
            </strong>
            <span id="lab-total-val" class="tabular" style="font-weight: 700; color: var(--text-primary);">
              39 m totales
            </span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.85rem; margin-bottom: 0.75rem;">
            <div>
              <label for="lab-speed-slider" class="control-label" style="display: flex; justify-content: space-between;">
                <span>Velocidad</span>
                <span id="lab-speed-label" class="tabular">60 km/h</span>
              </label>
              <input type="range" id="lab-speed-slider" min="30" max="120" step="10" value="60" style="width: 100%; margin-top: 0.35rem;" />
            </div>

            <div>
              <label for="lab-surface-select" class="control-label">Calzada</label>
              <select id="lab-surface-select" class="minimal-input" style="margin-top: 0.2rem; padding: 0.35rem 0.5rem; font-size: 0.84rem;">
                <option value="dry">Asfalto seco (normal)</option>
                <option value="wet">Asfalto mojado / lluvia (×2)</option>
                <option value="ice">Hielo / escarcha (×8)</option>
              </select>
            </div>
          </div>

          <div style="display: flex; gap: 1.25rem; font-size: 0.82rem; color: var(--text-secondary); border-top: 1px solid var(--border-hairline); padding-top: 0.6rem;" class="tabular">
            <span>Reacción (1 s): <strong id="lab-reaction-val" style="color: var(--text-primary);">18 m</strong></span>
            <span>Frenado: <strong id="lab-braking-val" style="color: var(--text-primary);">21 m</strong></span>
          </div>
        </div>
      `
          : "";

      return `
        <details class="chapter-details" ${idx === 0 ? "open" : ""}>
          <summary class="chapter-summary">
            <div class="row-main">
              <span class="status-dot ${
                ch.priority.includes("Crítica") || ch.priority.includes("Alta")
                  ? "dot-warn"
                  : ""
              }" aria-hidden="true"></span>
              <div>
                <h2 class="row-title" style="font-size: 1.08rem;">${ch.number}: ${ch.title}</h2>
                <p class="row-sub">${ch.pages} · Lectura: ${ch.baseMinutes} min · Peso en examen: ${
        ch.examWeight
      }</p>
              </div>
            </div>
            <div class="row-right">
              <span class="status-pill">${ch.priority}</span>
              ${ICONS.chevronDown}
            </div>
          </summary>

          <div class="chapter-body">
            <p style="margin: 0 0 0.5rem 0;">${ch.summary}</p>
            <ul class="facts-list">
              ${ch.keyFacts.map((f) => `<li>${f}</li>`).join("")}
            </ul>
            ${
              Array.isArray(ch.illustrations) && ch.illustrations.length > 0
                ? `<div class="chapter-illustrations-block">
                    <h3 class="chapter-illustrations-title">Láminas e ilustraciones extraídas del manual oficial (PDF 2026)</h3>
                    <div class="chapter-illustrations-strip">
                      ${ch.illustrations
                        .map(
                          (ill) => `
                        <figure class="chapter-figure">
                          <img src="${ill.src}" alt="${ill.caption}" loading="lazy" />
                          <figcaption class="chapter-figure-caption">${ill.caption}</figcaption>
                        </figure>
                      `
                        )
                        .join("")}
                    </div>
                  </div>`
                : ""
            }
            ${calculatorHtml}
            <div style="margin-top: 1rem;">
              <button type="button" class="btn-outline" data-action="start-chapter-test" data-chapter-id="${
                ch.id
              }">
                <span>Practicar ${ch.number} (${chQuestionsCount} preguntas)</span>
                ${ICONS.arrowRight}
              </button>
            </div>
          </div>
        </details>
      `;
    }).join("");

    updateStoppingDistanceCalculator();
  }

  
  // ==========================================================================
  // Renderizado de la Vista 4: Señales de Tránsito Oficiales (138 Señales)
  // ==========================================================================
  function renderSignsView(filterText = "") {
    const container = document.getElementById("signs-grid-container");
    if (!container || !window.CONASET_SIGNS) return;

    const term = filterText.toLowerCase().trim();
    const filtered = window.CONASET_SIGNS.filter((s) => {
      if (!term) return true;
      return (
        s.code.toLowerCase().includes(term) ||
        s.name.toLowerCase().includes(term) ||
        s.category.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
      );
    });

    if (filtered.length === 0) {
      container.innerHTML =
        '<div style="padding: 2rem 0; color: var(--text-secondary);">No se encontraron señales coincidentes.</div>';
      return;
    }

    // Agrupar señales por categoría oficial para mantener jerarquía de subtítulos H2
    const groups = new Map();
    filtered.forEach((s) => {
      if (!groups.has(s.category)) groups.set(s.category, []);
      groups.get(s.category).push(s);
    });

    container.innerHTML = Array.from(groups.entries())
      .map(
        ([category, items]) => `
        <section class="content-section">
          <div class="section-block-header">
            <div>
              <h2 class="section-heading">${category}</h2>
              <p class="section-desc">Significado normativo y código técnico oficial CONASET.</p>
            </div>
            <span class="status-pill tabular">${items.length} ${
          items.length === 1 ? "señal" : "señales"
        }</span>
          </div>

          <div class="clean-list">
            ${items
              .map(
                (s) => `
              <div class="clean-row" style="align-items: flex-start;">
                <div style="width: 3.5rem; flex-shrink: 0; display: flex; justify-content: center; padding-top: 0.15rem;">
                  <img src="${s.image_url}" alt="${s.name}" loading="lazy" style="width: 3.25rem; height: 3.25rem; aspect-ratio: 1 / 1; object-fit: contain;" />
                </div>
                <div class="row-main" style="flex-direction: column; gap: 0.2rem;">
                  <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem;">
                    <h3 class="row-title">${s.name}</h3>
                    <span class="status-pill tabular">${s.code}</span>
                  </div>
                  <p class="row-sub">${s.description}</p>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </section>
      `
      )
      .join("");
  }

  function updateStoppingDistanceCalculator() {
    const speedSlider = document.getElementById("lab-speed-slider");
    const surfaceSelect = document.getElementById("lab-surface-select");
    if (!speedSlider || !surfaceSelect) return;

    const v = Number(speedSlider.value);
    const surface = surfaceSelect.value;

    const reactionMeters = Math.round((v * 3) / 10);
    const baseBraking = Math.round((v * v) / 170);
    const multiplier = surface === "dry" ? 1 : surface === "wet" ? 2 : 8;
    const brakingMeters = baseBraking * multiplier;
    const totalMeters = reactionMeters + brakingMeters;

    document.getElementById("lab-speed-label").textContent = `${v} km/h`;
    document.getElementById("lab-reaction-val").textContent = `${reactionMeters} m`;
    document.getElementById("lab-braking-val").textContent = `${brakingMeters} m`;
    document.getElementById("lab-total-val").textContent = `${totalMeters} m totales`;
  }

  // ==========================================================================
  // Navegación y Tema
  // ==========================================================================
  function switchView(viewName) {
    document.querySelectorAll(".view-panel").forEach((panel) => {
      panel.classList.toggle("is-active", panel.id === `view-${viewName}`);
    });
    document.querySelectorAll(".nav-item").forEach((tab) => {
      tab.classList.toggle(
        "is-active",
        tab.getAttribute("data-view") === viewName
      );
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    const labelEl = document.getElementById("theme-label-text");
    const iconEl = document.getElementById("theme-icon-svg");
    if (labelEl) {
      labelEl.textContent = theme === "dark" ? "Claro" : "Oscuro";
    }
    if (iconEl) {
      iconEl.innerHTML = theme === "dark" ? ICONS.sun : ICONS.moon;
    }
    saveState();
  }

  function initEvents() {
    const searchSigns = document.getElementById("search-signs-input");
    if (searchSigns) {
      searchSigns.addEventListener("input", (e) => {
        renderSignsView(e.target.value);
      });
    }
    const dateInput = document.getElementById("target-date-input");
    if (dateInput) {
      dateInput.addEventListener("change", (e) => {
        if (e.target.value) {
          state.targetDate = e.target.value;
          saveState();
          renderDashboard();
        }
      });
    }

    const levelSelect = document.getElementById("baseline-level-select");
    if (levelSelect) {
      levelSelect.addEventListener("change", (e) => {
        state.baselineLevel = e.target.value;
        saveState();
        renderDashboard();
      });
    }

    const feedbackSelect = document.getElementById("feedback-mode-select");
    if (feedbackSelect) {
      feedbackSelect.addEventListener("change", (e) => {
        state.feedbackMode = e.target.value;
        saveState();
      });
    }

    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        applyTheme(state.theme === "dark" ? "light" : "dark");
      });
    }

    document.addEventListener("input", (e) => {
      if (e.target.id === "lab-speed-slider" || e.target.id === "lab-surface-select") {
        updateStoppingDistanceCalculator();
      }
    });

    document.addEventListener("click", (e) => {
      const presetBtn = e.target.closest("[data-preset-days]");
      if (presetBtn) {
        const days = Number(presetBtn.getAttribute("data-preset-days"));
        state.targetDate = addDaysISO(getTodayISO(), days);
        saveState();
        renderDashboard();
        return;
      }

      const navTab = e.target.closest("[data-view]");
      if (navTab && !navTab.hasAttribute("data-action")) {
        const view = navTab.getAttribute("data-view");
        if (view === "exam" && !activeExam) {
          startExam("official");
        } else {
          switchView(view);
        }
        return;
      }

      const actionEl = e.target.closest("[data-action]");
      if (!actionEl) return;

      const action = actionEl.getAttribute("data-action");

      if (action === "start-day-test") {
        const dayIndex = Number(actionEl.getAttribute("data-day-index") || 0);
        startExam("day-sprint", { dayIndex });
      } else if (action === "toggle-day-complete") {
        const iso = actionEl.getAttribute("data-day-iso");
        state.completedDays[iso] = !state.completedDays[iso];
        if (state.completedDays[iso]) {
          state.studiedMinutesToday += 25;
        }
        saveState();
        renderDashboard();
      } else if (action === "start-mode") {
        const mode = actionEl.getAttribute("data-mode");
        startExam(mode);
      } else if (action === "start-chapter-test") {
        const chId = Number(actionEl.getAttribute("data-chapter-id"));
        startExam("chapter", { chapterId: chId });
      } else if (action === "select-option") {
        if (!activeExam || activeExam.finished) return;
        const optIdx = Number(actionEl.getAttribute("data-opt-index"));
        activeExam.answers[activeExam.currentIndex] = optIdx;
        renderExamView();
      } else if (action === "next-question") {
        if (activeExam && activeExam.currentIndex < activeExam.questions.length - 1) {
          activeExam.currentIndex += 1;
          renderExamView();
        }
      } else if (action === "prev-question") {
        if (activeExam && activeExam.currentIndex > 0) {
          activeExam.currentIndex -= 1;
          renderExamView();
        }
      } else if (action === "jump-question") {
        if (activeExam) {
          activeExam.currentIndex = Number(actionEl.getAttribute("data-q-index"));
          renderExamView();
        }
      } else if (action === "finish-exam") {
        finishExam();
      } else if (action === "go-view") {
        switchView(actionEl.getAttribute("data-view"));
      }
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    applyTheme(state.theme || "light");
    initEvents();
    renderDashboard();
    renderChaptersAccordion();
    renderSignsView();

    const params = new URLSearchParams(window.location.search);
    if (params.get("theme") === "dark" || params.get("theme") === "light") {
      applyTheme(params.get("theme"));
    }
    const requestedView = params.get("view");
    if (requestedView === "exam") {
      startExam("official");
    } else if (requestedView === "manual") {
      switchView("manual");
    } else if (requestedView === "senales") {
      switchView("senales");
    }
  });
})();
