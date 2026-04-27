/* ============================================================
   game.js — Lógica de Palabrle
   ============================================================ */

const MAX_INTENTOS = 6;
const LONGITUD     = 5;

// ── Estado ───────────────────────────────────────────────────
const state = {
  entrada: null,           // objeto { uuid, fecha, palabra }
  secreta: "",             // palabra normalizada (sin tildes)
  intentos: [],            // array de resultados evaluados
  intentoActual: [],       // letras del intento en curso
  terminado: false,
  bloqueado: false,        // durante animaciones
};

// ── DOM ───────────────────────────────────────────────────────
const boardEl      = document.getElementById("board");
const keyboardEl   = document.getElementById("keyboard");
const toastEl      = document.getElementById("toast");
const modalEl      = document.getElementById("modal");
const modalEmoji   = document.getElementById("modal-emoji");
const modalTitle   = document.getElementById("modal-title");
const modalWord    = document.getElementById("modal-word");
const modalMsg     = document.getElementById("modal-msg");
const btnClose     = document.getElementById("btn-close-modal");
const fechaHeader  = document.getElementById("fecha-header");

// ── Layout del teclado ────────────────────────────────────────
const FILAS_TECLADO = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L","Ñ"],
  ["ENTER","Z","X","C","V","B","N","M","⌫"],
];

// ── Init ──────────────────────────────────────────────────────
function init() {
  const uuid = getUUIDFromURL();
  state.entrada = uuid ? (getPalabraByUUID(uuid) ?? getPalabraOfDay()) : getPalabraOfDay();
  state.secreta = normalizar(state.entrada.palabra);

  const fecha = new Date(state.entrada.fecha + "T12:00:00");
  fechaHeader.textContent = fecha.toLocaleDateString("es-ES", {
    year: "numeric", month: "long", day: "numeric",
  });

  buildBoard();
  buildKeyboard();
  document.addEventListener("keydown", handleKeydown);
}

// ── UUID desde URL (igual que en Connections) ─────────────────
function getUUIDFromURL() {
  const parts = window.location.pathname.replace(/^\/|\/$/g, "").split("/");
  const candidate = parts[parts.length - 1];
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (UUID_RE.test(candidate)) return candidate;

  const qp = new URLSearchParams(window.location.search).get("uuid");
  if (qp && UUID_RE.test(qp)) return qp;
  return null;
}

// ── Construir tablero ─────────────────────────────────────────
function buildBoard() {
  boardEl.innerHTML = "";
  for (let r = 0; r < MAX_INTENTOS; r++) {
    const fila = document.createElement("div");
    fila.id = `fila-${r}`;
    fila.className = "flex gap-1.5";

    for (let c = 0; c < LONGITUD; c++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.id = `tile-${r}-${c}`;

      const inner = document.createElement("div");
      inner.className = "tile-inner";

      const front = document.createElement("div");
      front.className = "tile-front";

      const back = document.createElement("div");
      back.className = "tile-back";

      inner.appendChild(front);
      inner.appendChild(back);
      tile.appendChild(inner);
      fila.appendChild(tile);
    }
    boardEl.appendChild(fila);
  }
}

// ── Construir teclado ─────────────────────────────────────────
function buildKeyboard() {
  keyboardEl.innerHTML = "";
  FILAS_TECLADO.forEach((fila) => {
    const row = document.createElement("div");
    row.className = "flex gap-1 justify-center";
    fila.forEach((letra) => {
      const btn = document.createElement("button");
      btn.id = `key-${letra}`;
      btn.textContent = letra;
      const esWide = letra === "ENTER" || letra === "⌫";
      btn.className = `key${esWide ? " wide" : ""}`;
      btn.addEventListener("click", () => handleLetra(letra));
      row.appendChild(btn);
    });
    keyboardEl.appendChild(row);
  });
}

// ── Input (físico y virtual) ──────────────────────────────────
function handleKeydown(e) {
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  if (e.key === "Enter")     { handleLetra("ENTER"); return; }
  if (e.key === "Backspace") { handleLetra("⌫"); return; }
  const l = normalizar(e.key);
  if (/^[A-ZÑ]$/.test(l))   { handleLetra(l); }
}

function handleLetra(letra) {
  if (state.terminado || state.bloqueado) return;

  if (letra === "⌫") {
    borrar();
  } else if (letra === "ENTER") {
    enviar();
  } else {
    escribir(normalizar(letra));
  }
}

// ── Escribir / borrar letras ──────────────────────────────────
function escribir(letra) {
  if (state.intentoActual.length >= LONGITUD) return;
  state.intentoActual.push(letra);
  const fila = state.intentos.length;
  const col  = state.intentoActual.length - 1;
  const front = getFront(fila, col);
  front.textContent = letra;
  front.classList.add("has-letter");
}

function borrar() {
  if (state.intentoActual.length === 0) return;
  const fila = state.intentos.length;
  const col  = state.intentoActual.length - 1;
  const front = getFront(fila, col);
  front.textContent = "";
  front.classList.remove("has-letter");
  state.intentoActual.pop();
}

// ── Enviar intento ────────────────────────────────────────────
async function enviar() {
  if (state.intentoActual.length < LONGITUD) {
    shakeRow(state.intentos.length);
    showToast("Escribe 5 letras");
    return;
  }

  const palabra = state.intentoActual.join("");

  if (!esValida(palabra)) {
    shakeRow(state.intentos.length);
    showToast("Palabra no encontrada");
    return;
  }

  state.bloqueado = true;
  const resultado = evaluarIntento(palabra, state.secreta);
  state.intentos.push(resultado);

  await revelarFila(state.intentos.length - 1, resultado);
  actualizarTeclado(resultado);

  const gano = resultado.every((r) => r.estado === "green");

  if (gano) {
    await bounceRow(state.intentos.length - 1);
    state.terminado = true;
    setTimeout(() => showModal(true), 400);
  } else if (state.intentos.length >= MAX_INTENTOS) {
    state.terminado = true;
    setTimeout(() => showModal(false), 600);
  }

  state.intentoActual = [];
  state.bloqueado = false;
}

// ── Revelar fila con flip por columna ─────────────────────────
function revelarFila(fila, resultado) {
  return new Promise((resolve) => {
    resultado.forEach(({ letra, estado }, col) => {
      setTimeout(() => {
        const inner = getInner(fila, col);
        const back  = inner.querySelector(".tile-back");
        back.textContent = letra;
        back.className = `tile-back ${estado}`;
        inner.classList.add("flipped");
        if (col === LONGITUD - 1) setTimeout(resolve, 300);
      }, col * 300);
    });
  });
}

// ── Bounce de victoria ────────────────────────────────────────
function bounceRow(fila) {
  return new Promise((resolve) => {
    for (let c = 0; c < LONGITUD; c++) {
      setTimeout(() => {
        const inner = getInner(fila, c);
        inner.classList.add("bounce");
        inner.addEventListener("animationend", () => inner.classList.remove("bounce"), { once: true });
        if (c === LONGITUD - 1) setTimeout(resolve, 600);
      }, c * 80);
    }
  });
}

// ── Shake de error ────────────────────────────────────────────
function shakeRow(fila) {
  const row = document.getElementById(`fila-${fila}`);
  row.classList.add("shake");
  row.addEventListener("animationend", () => row.classList.remove("shake"), { once: true });
}

// ── Actualizar teclado ────────────────────────────────────────
const PRIORIDAD = { green: 3, yellow: 2, gray: 1 };

function actualizarTeclado(resultado) {
  resultado.forEach(({ letra, estado }) => {
    const key = document.getElementById(`key-${letra}`);
    if (!key) return;
    const actual = key.dataset.estado;
    if (!actual || PRIORIDAD[estado] > PRIORIDAD[actual]) {
      key.dataset.estado = estado;
      key.className = key.className.replace(/\b(green|yellow|gray)\b/g, "").trim() + ` ${estado}`;
    }
  });
}

// ── Modal ─────────────────────────────────────────────────────
const MENSAJES_VICTORIA = [
  "¡Increíble!", "¡Excelente!", "¡Muy bien!", "¡Genial!", "¡Bien hecho!", "¡Qué alivio!",
];

function showModal(gano) {
  modalEmoji.textContent  = gano ? "🎉" : "😔";
  modalTitle.textContent  = gano ? MENSAJES_VICTORIA[state.intentos.length - 1] : "Sin suerte hoy";
  modalWord.textContent   = `La palabra era: ${state.entrada.palabra.toUpperCase()}`;
  modalMsg.textContent    = gano
    ? `Lo lograste en ${state.intentos.length} intento${state.intentos.length > 1 ? "s" : ""}`
    : "¡Inténtalo mañana!";
  modalEl.classList.remove("hidden");
}

btnClose.addEventListener("click", () => modalEl.classList.add("hidden"));
modalEl.addEventListener("click", (e) => { if (e.target === modalEl) modalEl.classList.add("hidden"); });

// ── Toast ─────────────────────────────────────────────────────
let _toastTimer = null;
function showToast(msg, ms = 1800) {
  clearTimeout(_toastTimer);
  toastEl.textContent = msg;
  toastEl.classList.remove("hidden");
  _toastTimer = setTimeout(() => toastEl.classList.add("hidden"), ms);
}

// ── Helpers DOM ───────────────────────────────────────────────
function getInner(r, c) {
  return document.querySelector(`#tile-${r}-${c} .tile-inner`);
}
function getFront(r, c) {
  return document.querySelector(`#tile-${r}-${c} .tile-front`);
}

// ── Arrancar ──────────────────────────────────────────────────
init();
