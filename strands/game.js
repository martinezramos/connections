/* ============================================================
   game.js — Lógica de Hilos (clon de Strands en español)
   ============================================================ */

const COLS = 6;
const ROWS = 8;

// ── Estado ────────────────────────────────────────────────────
const state = {
  puzzle:       null,     // objeto puzzle cargado
  selected:     [],       // índices seleccionados en orden
  foundWords:   new Set(),// índices de palabras encontradas
  foundCells:   new Set(),// índices de celdas ya reclamadas
  hintsUsed:    0,
  hintWord:     null,     // índice de la palabra pista activa
  hintTimer:    null,
  bloqueado:    false,
};

// ── DOM ───────────────────────────────────────────────────────
let gridEl, svgEl, toastEl, hintBtn, statusEl, modalEl;

// ── Init ──────────────────────────────────────────────────────
function init() {
  gridEl   = document.getElementById("grid");
  svgEl    = document.getElementById("svg-overlay");
  toastEl  = document.getElementById("toast");
  hintBtn  = document.getElementById("btn-hint");
  statusEl = document.getElementById("status");
  modalEl  = document.getElementById("modal");

  const uuid = getUUIDFromURL();
  state.puzzle = uuid
    ? (getPuzzleByUUID(uuid) ?? getPuzzleOfDay())
    : getPuzzleOfDay();

  // Encabezado
  document.getElementById("tema-header").textContent = state.puzzle.tema;
  document.getElementById("pista-header").textContent = state.puzzle.pista;
  const fecha = new Date(state.puzzle.fecha + "T12:00:00");
  document.getElementById("fecha-header").textContent =
    fecha.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });

  // Cargar progreso guardado
  loadProgress();

  buildGrid();
  updateStatus();

  hintBtn.addEventListener("click", useHint);
  document.getElementById("btn-close-modal").addEventListener("click", () => {
    modalEl.classList.add("hidden");
  });

  // Soporte teclado (accesibilidad)
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") clearSelection();
    if (e.key === "Enter") submitSelection();
  });
}

// ── URL helpers ───────────────────────────────────────────────
function getUUIDFromURL() {
  const parts = window.location.pathname.replace(/^\/|\/$/g, "").split("/");
  const candidate = parts[parts.length - 1];
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (UUID_RE.test(candidate)) return candidate;
  const qp = new URLSearchParams(window.location.search).get("uuid");
  if (qp && UUID_RE.test(qp)) return qp;
  return null;
}

// ── Construcción del grid ─────────────────────────────────────
function buildGrid() {
  gridEl.innerHTML = "";
  state.puzzle.grid.forEach((letra, idx) => {
    const cell = document.createElement("button");
    cell.id        = `cell-${idx}`;
    cell.className = "cell";
    cell.textContent = letra;
    cell.setAttribute("aria-label", `Letra ${letra}`);

    cell.addEventListener("click",       () => onCellClick(idx));
    cell.addEventListener("touchstart",  e => { e.preventDefault(); onCellClick(idx); }, { passive: false });

    gridEl.appendChild(cell);
  });

  // Actualizar celdas ya encontradas al recargar
  state.foundWords.forEach(wi => {
    markWordFound(wi, false);
  });
}

// ── Selección de celdas ───────────────────────────────────────
function onCellClick(idx) {
  if (state.bloqueado) return;
  if (state.foundCells.has(idx)) return; // ya reclamada

  const { selected } = state;

  // Si clicamos la última celda seleccionada → deseleccionar
  if (selected.length > 0 && selected[selected.length - 1] === idx) {
    selected.pop();
    renderSelection();
    return;
  }

  // Si ya está en la selección pero no es la última → ignorar
  if (selected.includes(idx)) return;

  // Si hay selección y la nueva celda no es adyacente → ignorar
  if (selected.length > 0 && !areAdjacent(selected[selected.length - 1], idx)) {
    shakeCells(selected);
    return;
  }

  selected.push(idx);
  renderSelection();

  // Auto-submit si la longitud coincide con alguna palabra
  const match = findWordMatch();
  if (match !== null) {
    submitSelection(match);
  }
}

function areAdjacent(a, b) {
  const ra = Math.floor(a / COLS), ca = a % COLS;
  const rb = Math.floor(b / COLS), cb = b % COLS;
  return a !== b && Math.abs(ra - rb) <= 1 && Math.abs(ca - cb) <= 1;
}

// ── Comprobar si la selección coincide exactamente con una palabra ──
function findWordMatch() {
  const sel = [...state.selected].sort((a, b) => a - b);
  const { palabras } = state.puzzle;

  for (let i = 0; i < palabras.length; i++) {
    if (state.foundWords.has(i)) continue;
    const sorted = [...palabras[i].celdas].sort((a, b) => a - b);
    if (arraysEqual(sel, sorted)) return i;
  }
  return null;
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

// ── Enviar selección ──────────────────────────────────────────
function submitSelection(wordIndex) {
  if (wordIndex === undefined || wordIndex === null) {
    wordIndex = findWordMatch();
  }

  if (wordIndex !== null) {
    // ¡Acierto!
    state.bloqueado = true;
    clearSVG();

    // Animación pop → luego colorear
    const celdas = state.puzzle.palabras[wordIndex].celdas;
    celdas.forEach((ci, i) => {
      setTimeout(() => {
        document.getElementById(`cell-${ci}`)?.classList.add("pop");
      }, i * 60);
    });

    setTimeout(() => {
      state.foundWords.add(wordIndex);
      celdas.forEach(ci => state.foundCells.add(ci));
      state.selected = [];
      markWordFound(wordIndex, true);
      saveProgress();
      updateStatus();
      state.bloqueado = false;

      // ¿Victoria?
      const total = state.puzzle.palabras.length;
      const pangIdx = state.puzzle.palabras.findIndex(p => p.esPangrama);
      const nonPang = state.puzzle.palabras.filter((_, i) => !state.puzzle.palabras[i].esPangrama);
      if (state.foundWords.size === total) {
        setTimeout(showWinModal, 400);
      } else if (state.foundWords.has(pangIdx)) {
        showToast("¡Pangrama encontrado! 🌟");
      }
    }, celdas.length * 60 + 100);

  } else {
    // Selección incorrecta que no coincide con nada
    if (state.selected.length > 0) {
      const match = findWordMatch();
      if (match === null && state.selected.length > 2) {
        shakeCells(state.selected);
        setTimeout(() => clearSelection(), 500);
      }
    }
  }
}

// ── Marcar palabra como encontrada ───────────────────────────
function markWordFound(wordIndex, animate) {
  const p = state.puzzle.palabras[wordIndex];
  const cls = p.esPangrama ? "found-pangrama" : "found-word";

  p.celdas.forEach((ci, i) => {
    const el = document.getElementById(`cell-${ci}`);
    if (!el) return;
    if (animate) {
      setTimeout(() => {
        el.classList.remove("selected", "hint-glow", "pop");
        el.classList.add(cls, "bounce-in");
      }, i * 40);
    } else {
      el.classList.remove("selected", "hint-glow");
      el.classList.add(cls);
    }
  });
}

// ── Render de selección + línea SVG ──────────────────────────
function renderSelection() {
  // Limpiar estado visual anterior
  document.querySelectorAll(".cell.selected").forEach(el => el.classList.remove("selected"));

  state.selected.forEach(ci => {
    const el = document.getElementById(`cell-${ci}`);
    el?.classList.add("selected");
  });

  drawSVGPath();
}

function clearSelection() {
  state.selected.forEach(ci => {
    document.getElementById(`cell-${ci}`)?.classList.remove("selected");
  });
  state.selected = [];
  clearSVG();
}

// ── SVG de la línea de selección ─────────────────────────────
function cellCenter(idx) {
  const el = document.getElementById(`cell-${idx}`);
  if (!el) return { x: 0, y: 0 };
  const gridRect = gridEl.getBoundingClientRect();
  const cellRect = el.getBoundingClientRect();
  return {
    x: cellRect.left - gridRect.left + cellRect.width  / 2,
    y: cellRect.top  - gridRect.top  + cellRect.height / 2,
  };
}

function drawSVGPath() {
  clearSVG();
  const sel = state.selected;
  if (sel.length < 2) return;

  // Sincronizar tamaño SVG con el grid
  const rect = gridEl.getBoundingClientRect();
  svgEl.setAttribute("width",  rect.width);
  svgEl.setAttribute("height", rect.height);

  for (let i = 0; i < sel.length - 1; i++) {
    const a = cellCenter(sel[i]);
    const b = cellCenter(sel[i + 1]);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", a.x); line.setAttribute("y1", a.y);
    line.setAttribute("x2", b.x); line.setAttribute("y2", b.y);
    line.setAttribute("stroke", "#facc15");
    line.setAttribute("stroke-width", "6");
    line.setAttribute("stroke-linecap", "round");
    svgEl.appendChild(line);
  }
}

function clearSVG() {
  while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
}

// ── Animaciones ───────────────────────────────────────────────
function shakeCells(indices) {
  indices.forEach(ci => {
    const el = document.getElementById(`cell-${ci}`);
    if (!el) return;
    el.classList.remove("shake");
    void el.offsetWidth; // reflow
    el.classList.add("shake");
    el.addEventListener("animationend", () => el.classList.remove("shake"), { once: true });
  });
}

// ── Pista ─────────────────────────────────────────────────────
function useHint() {
  if (state.bloqueado) return;

  // Limpiar pista anterior
  if (state.hintTimer) {
    clearTimeout(state.hintTimer);
    removeHintGlow();
  }

  // Encontrar una palabra no hallada (no pangrama primero)
  const candidates = state.puzzle.palabras
    .map((p, i) => ({ ...p, i }))
    .filter(p => !state.foundWords.has(p.i) && !p.esPangrama);

  const target = candidates[Math.floor(Math.random() * candidates.length)];
  if (!target) {
    showToast("¡Ya encontraste todas las palabras temáticas!");
    return;
  }

  state.hintWord = target.i;
  state.hintsUsed++;
  hintBtn.textContent = `Pista (${state.hintsUsed} usadas)`;

  target.celdas.forEach(ci => {
    document.getElementById(`cell-${ci}`)?.classList.add("hint-glow");
  });

  state.hintTimer = setTimeout(removeHintGlow, 3000);
}

function removeHintGlow() {
  document.querySelectorAll(".hint-glow").forEach(el => el.classList.remove("hint-glow"));
  state.hintWord  = null;
  state.hintTimer = null;
}

// ── Status ────────────────────────────────────────────────────
function updateStatus() {
  const total    = state.puzzle.palabras.filter(p => !p.esPangrama).length;
  const halladas = [...state.foundWords].filter(i => !state.puzzle.palabras[i].esPangrama).length;
  statusEl.textContent = `${halladas} de ${total} palabras encontradas`;
}

// ── Toast ─────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, duration = 2000) {
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.classList.remove("hidden", "opacity-0");
  toastTimer = setTimeout(() => toastEl.classList.add("hidden"), duration);
}

// ── Modal de victoria ─────────────────────────────────────────
function showWinModal() {
  const total     = state.puzzle.palabras.length - 1; // sin pangrama
  const hints     = state.hintsUsed;
  const emoji     = hints === 0 ? "🏆" : hints <= 2 ? "🌟" : "🎉";
  const subtitulo = hints === 0
    ? "¡Sin pistas! Impresionante."
    : `Pistas usadas: ${hints}`;

  document.getElementById("modal-emoji").textContent   = emoji;
  document.getElementById("modal-title").textContent   = "¡Completado!";
  document.getElementById("modal-puzzle").textContent  = `Tema: ${state.puzzle.tema}`;
  document.getElementById("modal-msg").textContent     = subtitulo;
  modalEl.classList.remove("hidden");
}

// ── Persistencia ──────────────────────────────────────────────
const STORAGE_KEY = "hilos-progress";

function saveProgress() {
  const data = {
    uuid:       state.puzzle.uuid,
    fecha:      new Date().toISOString().slice(0, 10),
    foundWords: [...state.foundWords],
    hintsUsed:  state.hintsUsed,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    const hoy  = new Date().toISOString().slice(0, 10);
    if (data.uuid !== state.puzzle.uuid || data.fecha !== hoy) return;

    data.foundWords.forEach(i => {
      state.foundWords.add(i);
      state.puzzle.palabras[i].celdas.forEach(ci => state.foundCells.add(ci));
    });
    state.hintsUsed = data.hintsUsed || 0;
    if (state.hintsUsed > 0) {
      hintBtn.textContent = `Pista (${state.hintsUsed} usadas)`;
    }
  } catch (_) { /* ignorar errores de localStorage */ }
}

// ── Arranque ──────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", init);
