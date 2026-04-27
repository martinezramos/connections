/* ============================================================
   game.js — Lógica del juego Conexiones
   ============================================================ */

// ── Estado del juego ─────────────────────────────────────────
const state = {
  puzzle: null,           // puzzle activo
  words: [],              // palabras en el grid (orden actual)
  selected: [],           // palabras actualmente seleccionadas
  solved: [],             // categorías ya resueltas
  erroresRestantes: 4,    // intentos disponibles
  bloqueado: false,       // evita clicks durante animaciones
};

// ── Referencias al DOM ───────────────────────────────────────
const gridEl        = document.getElementById("grid");
const solvedAreaEl  = document.getElementById("solved-area");
const btnShuffle    = document.getElementById("btn-shuffle");
const btnDeselect   = document.getElementById("btn-deselect");
const btnSubmit     = document.getElementById("btn-submit");
const errorDotsEl   = document.getElementById("error-dots");
const modalEl       = document.getElementById("modal");
const modalEmoji    = document.getElementById("modal-emoji");
const modalTitle    = document.getElementById("modal-title");
const modalMsg      = document.getElementById("modal-msg");
const modalSummary  = document.getElementById("modal-summary");
const btnCloseModal = document.getElementById("btn-close-modal");
const toastEl       = document.getElementById("toast");
const fechaHeader   = document.getElementById("fecha-header");

// ── Resolver puzzle desde la URL ─────────────────────────────
/**
 * Lee el UUID de:
 *   1. window.location.pathname  →  /{uuid}   (tras history.replaceState de 404.html)
 *   2. query param ?uuid={uuid}               (acceso directo / dev local)
 * Si no se encuentra ninguno devuelve null.
 */
function getUUIDFromURL() {
  // Quitar slashes y posibles prefijos de sub-ruta (GitHub Pages repo name)
  const parts = window.location.pathname.replace(/^\/|\/$/g, "").split("/");
  const candidate = parts[parts.length - 1];
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (UUID_RE.test(candidate)) return candidate;

  // Fallback: query param ?uuid=
  const params = new URLSearchParams(window.location.search);
  const qp = params.get("uuid");
  if (qp && UUID_RE.test(qp)) return qp;

  return null;
}

// ── Inicialización ───────────────────────────────────────────
function init() {
  const uuid = getUUIDFromURL();
  state.puzzle = uuid ? (getPuzzleByUUID(uuid) ?? getPuzzleOfDay()) : getPuzzleOfDay();

  // Mostrar fecha formateada en el header
  const fecha = new Date(state.puzzle.fecha + "T12:00:00");
  fechaHeader.textContent = fecha.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Extraer todas las palabras y mezclarlas
  state.words = state.puzzle.categorias.flatMap((c) => c.palabras);
  shuffle(state.words);

  renderGrid();
  updateSubmitButton();
}

// ── Utilidades ───────────────────────────────────────────────
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Render del grid ──────────────────────────────────────────
function renderGrid() {
  gridEl.innerHTML = "";
  state.words.forEach((word) => {
    const tile = createTile(word);
    gridEl.appendChild(tile);
  });
}

function createTile(word) {
  const btn = document.createElement("button");
  btn.dataset.word = word;
  btn.className = [
    "tile",
    "bg-stone-200",
    "text-stone-800",
    "rounded-xl",
    "font-extrabold",
    "text-xs",
    "sm:text-sm",
    "tracking-wide",
    "uppercase",
    "py-4",
    "px-2",
    "text-center",
    "leading-tight",
    "cursor-pointer",
    "select-none",
  ].join(" ");

  btn.textContent = word;
  btn.addEventListener("click", () => handleTileClick(word));
  return btn;
}

// ── Manejo de clicks ─────────────────────────────────────────
function handleTileClick(word) {
  if (state.bloqueado) return;

  const tile = getTileEl(word);
  if (!tile) return;

  if (state.selected.includes(word)) {
    // Deseleccionar
    state.selected = state.selected.filter((w) => w !== word);
    tile.classList.remove("selected");
  } else {
    if (state.selected.length >= 4) return; // máximo 4
    state.selected.push(word);
    tile.classList.add("selected");
    animateTile(tile, "pop");
  }

  updateSubmitButton();
}

function getTileEl(word) {
  return gridEl.querySelector(`[data-word="${CSS.escape(word)}"]`);
}

// ── Submit ───────────────────────────────────────────────────
async function handleSubmit() {
  if (state.selected.length !== 4 || state.bloqueado) return;
  state.bloqueado = true;

  const selSet = new Set(state.selected);

  // Buscar a qué categoría pertenecen las 4 palabras seleccionadas
  const categoria = state.puzzle.categorias.find((cat) => {
    const catSet = new Set(cat.palabras);
    return state.selected.every((w) => catSet.has(w));
  });

  if (categoria) {
    // ¡Correcto!
    await animateCorrect(categoria);
  } else {
    // Incorrecto — detectar si le faltó sólo una
    const cercana = state.puzzle.categorias.find((cat) => {
      const catSet = new Set(cat.palabras);
      const aciertos = state.selected.filter((w) => catSet.has(w)).length;
      return aciertos === 3;
    });

    await animateError();
    state.erroresRestantes--;
    updateErrorDots();

    if (cercana) {
      showToast("¡Casi! Te faltó una");
    }

    if (state.erroresRestantes === 0) {
      await sleep(600);
      await revealAllRemaining();
      await sleep(400);
      showModal(false);
    }
  }

  state.selected = [];
  updateSubmitButton();
  state.bloqueado = false;
}

// ── Animaciones ──────────────────────────────────────────────
function animateTile(tile, animClass) {
  tile.classList.remove(animClass);
  void tile.offsetWidth; // reflow
  tile.classList.add(animClass);
  tile.addEventListener("animationend", () => tile.classList.remove(animClass), { once: true });
}

async function animateError() {
  const tiles = state.selected.map((w) => getTileEl(w)).filter(Boolean);
  tiles.forEach((t) => t.classList.add("shake"));
  await sleep(550);
  tiles.forEach((t) => t.classList.remove("shake", "selected"));
}

async function animateCorrect(categoria) {
  // Pequeña pausa antes
  await sleep(200);

  // Revelar grupo
  await revealGroup(categoria);

  // Comprobar victoria
  if (state.solved.length === state.puzzle.categorias.length) {
    await sleep(500);
    showModal(true);
  }
}

// ── Revelar grupo resuelto ───────────────────────────────────
async function revealGroup(categoria) {
  // Marcar como resuelta
  state.solved.push(categoria);

  // Quitar palabras del grid
  state.words = state.words.filter((w) => !categoria.palabras.includes(w));

  // Remover tiles del grid
  categoria.palabras.forEach((w) => getTileEl(w)?.remove());

  // Crear bloque de grupo resuelto
  const colors = COLOR_CLASSES[categoria.color];
  const block = document.createElement("div");
  block.className = [
    "w-full",
    "rounded-xl",
    "py-4",
    "px-4",
    "text-center",
    colors.bg,
    colors.text,
    "bounce-in",
  ].join(" ");

  block.innerHTML = `
    <p class="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">${categoria.nombre}</p>
    <p class="font-extrabold text-sm tracking-wide">${categoria.palabras.join(" · ")}</p>
  `;

  solvedAreaEl.appendChild(block);
  await sleep(400);
}

// Revela todos los grupos restantes al perder
async function revealAllRemaining() {
  const pendientes = state.puzzle.categorias.filter(
    (cat) => !state.solved.includes(cat)
  );
  for (const cat of pendientes) {
    await revealGroup(cat);
    await sleep(300);
  }
}

// ── Shuffle ──────────────────────────────────────────────────
function handleShuffle() {
  if (state.bloqueado) return;
  // Deseleccionar primero
  deselectAll();
  shuffle(state.words);
  renderGrid();
  updateSubmitButton();
}

// ── Deseleccionar todo ───────────────────────────────────────
function deselectAll() {
  state.selected = [];
  gridEl.querySelectorAll(".selected").forEach((t) => t.classList.remove("selected"));
  updateSubmitButton();
}

// ── Botón Submit ─────────────────────────────────────────────
function updateSubmitButton() {
  const listo = state.selected.length === 4;
  btnSubmit.disabled = !listo;
  if (listo) {
    btnSubmit.className = btnSubmit.className
      .replace("text-gray-400", "text-gray-800")
      .replace("border-gray-400", "border-gray-800")
      .replace("cursor-not-allowed", "cursor-pointer");
    btnSubmit.classList.add("hover:bg-gray-100");
  } else {
    btnSubmit.classList.remove("hover:bg-gray-100");
    if (!btnSubmit.className.includes("text-gray-400")) {
      btnSubmit.className = btnSubmit.className
        .replace("text-gray-800", "text-gray-400")
        .replace("border-gray-800", "border-gray-400")
        .replace("cursor-pointer", "cursor-not-allowed");
    }
  }
}

// ── Indicador de errores ─────────────────────────────────────
function updateErrorDots() {
  const dots = errorDotsEl.querySelectorAll(".error-dot");
  const usados = 4 - state.erroresRestantes;
  dots.forEach((dot, i) => {
    if (i < usados) {
      dot.classList.add("used");
    }
  });
}

// ── Toast ────────────────────────────────────────────────────
let toastTimeout = null;
function showToast(msg, duration = 2000) {
  clearTimeout(toastTimeout);
  toastEl.textContent = msg;
  toastEl.classList.remove("hidden");
  toastTimeout = setTimeout(() => toastEl.classList.add("hidden"), duration);
}

// ── Modal ────────────────────────────────────────────────────
function showModal(gano) {
  modalEmoji.textContent   = gano ? "🎉" : "😔";
  modalTitle.textContent   = gano ? "¡Felicidades!" : "¡Suerte la próxima!";
  modalMsg.textContent     = gano
    ? "Resolviste todas las conexiones."
    : `Te quedaron ${state.puzzle.categorias.length - state.solved.length} grupo(s) sin resolver.`;

  // Resumen de grupos en el modal
  modalSummary.innerHTML = "";
  state.puzzle.categorias.forEach((cat) => {
    const colors = COLOR_CLASSES[cat.color];
    const row = document.createElement("div");
    row.className = `rounded-lg py-2 px-3 text-xs font-bold ${colors.bg} ${colors.text}`;
    row.textContent = `${cat.nombre}: ${cat.palabras.join(", ")}`;
    modalSummary.appendChild(row);
  });

  modalEl.classList.remove("hidden");
}

// ── Event Listeners ──────────────────────────────────────────
btnShuffle.addEventListener("click", handleShuffle);
btnDeselect.addEventListener("click", deselectAll);
btnSubmit.addEventListener("click", handleSubmit);
btnCloseModal.addEventListener("click", () => modalEl.classList.add("hidden"));
modalEl.addEventListener("click", (e) => {
  if (e.target === modalEl) modalEl.classList.add("hidden");
});

// ── Arrancar ─────────────────────────────────────────────────
init();
