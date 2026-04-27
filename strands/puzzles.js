// ============================================================
// puzzles.js — Puzzles para Hilos (clon de Strands en español)
// ============================================================
// Grid: 6 columnas × 8 filas = 48 celdas
// Índice: fila * 6 + columna  (base 0)
//
// El spangrama ocupa la columna 0 (arriba→abajo), tocando el
// borde superior e inferior — los dos lados opuestos. ✓
// Las palabras temáticas llenan las columnas 1-5 de cada fila.
// ============================================================

const PUZZLES = [

  // ── Puzzle 1 · 2026-02-28 · INSECTOS ──────────────────────
  //
  //      0    1    2    3    4    5
  // r0:  M    M    O    S    C    A
  // r1:  A    A    B    E    J    A
  // r2:  R    P    U    L    G    A
  // r3:  I    L    A    R    V    A
  // r4:  P    O    R    U    G    A
  // r5:  O    N    I    N    F    A
  // r6:  S    P    I    O    J    O
  // r7:  A    A    F    I    D    O
  //
  // Spangrama: MARIPOSA (col 0, top→bottom) ✓
  {
    uuid:  "a1b2c3d4-0001-4e5f-8a9b-000000000001",
    fecha: "2026-02-28",
    tema:  "INSECTOS",
    pista: "Pequeñas criaturas de seis patas",
    grid: [
      "M","M","O","S","C","A",
      "A","A","B","E","J","A",
      "R","P","U","L","G","A",
      "I","L","A","R","V","A",
      "P","O","R","U","G","A",
      "O","N","I","N","F","A",
      "S","P","I","O","J","O",
      "A","A","F","I","D","O",
    ],
    palabras: [
      { palabra: "MARIPOSA", celdas: [0,6,12,18,24,30,36,42], esPangrama: true },
      { palabra: "MOSCA",    celdas: [1,2,3,4,5]      },
      { palabra: "ABEJA",    celdas: [7,8,9,10,11]    },
      { palabra: "PULGA",    celdas: [13,14,15,16,17]  },
      { palabra: "LARVA",    celdas: [19,20,21,22,23]  },
      { palabra: "ORUGA",    celdas: [25,26,27,28,29]  },
      { palabra: "NINFA",    celdas: [31,32,33,34,35]  },
      { palabra: "PIOJO",    celdas: [37,38,39,40,41]  },
      { palabra: "AFIDO",    celdas: [43,44,45,46,47]  },
    ],
  },

  // ── Puzzle 2 · 2026-03-01 · PAÍSES ────────────────────────
  //
  //      0    1    2    3    4    5
  // r0:  C    C    H    I    L    E
  // r1:  O    C    H    I    N    A
  // r2:  L    I    N    D    I    A
  // r3:  O    G    H    A    N    A
  // r4:  M    K    E    N    Y    A
  // r5:  B    T    O    N    G    A
  // r6:  I    N    I    G    E    R
  // r7:  A    C    O    R    E    A
  //
  // Spangrama: COLOMBIA (col 0, top→bottom) ✓
  {
    uuid:  "a1b2c3d4-0002-4e5f-8a9b-000000000002",
    fecha: "2026-03-01",
    tema:  "PAÍSES",
    pista: "Naciones del mundo",
    grid: [
      "C","C","H","I","L","E",
      "O","C","H","I","N","A",
      "L","I","N","D","I","A",
      "O","G","H","A","N","A",
      "M","K","E","N","Y","A",
      "B","T","O","N","G","A",
      "I","N","I","G","E","R",
      "A","C","O","R","E","A",
    ],
    palabras: [
      { palabra: "COLOMBIA", celdas: [0,6,12,18,24,30,36,42], esPangrama: true },
      { palabra: "CHILE",    celdas: [1,2,3,4,5]      },
      { palabra: "CHINA",    celdas: [7,8,9,10,11]    },
      { palabra: "INDIA",    celdas: [13,14,15,16,17]  },
      { palabra: "GHANA",    celdas: [19,20,21,22,23]  },
      { palabra: "KENYA",    celdas: [25,26,27,28,29]  },
      { palabra: "TONGA",    celdas: [31,32,33,34,35]  },
      { palabra: "NIGER",    celdas: [37,38,39,40,41]  },
      { palabra: "COREA",    celdas: [43,44,45,46,47]  },
    ],
  },

  // ── Puzzle 3 · 2026-03-02 · COLORES ───────────────────────
  //
  //      0    1    2    3    4    5
  // r0:  A    N    E    G    R    O
  // r1:  M    V    E    R    D    E
  // r2:  A    B    E    I    G    E
  // r3:  R    C    O    R    A    L
  // r4:  I    S    I    E    N    A
  // r5:  L    M    A    L    V    A
  // r6:  L    R    U    B    I    O
  // r7:  O    E    B    A    N    O
  //
  // Spangrama: AMARILLO (col 0, top→bottom) ✓
  {
    uuid:  "a1b2c3d4-0003-4e5f-8a9b-000000000003",
    fecha: "2026-03-02",
    tema:  "COLORES",
    pista: "Tonos y matices del arcoíris y más allá",
    grid: [
      "A","N","E","G","R","O",
      "M","V","E","R","D","E",
      "A","B","E","I","G","E",
      "R","C","O","R","A","L",
      "I","S","I","E","N","A",
      "L","M","A","L","V","A",
      "L","R","U","B","I","O",
      "O","E","B","A","N","O",
    ],
    palabras: [
      { palabra: "AMARILLO", celdas: [0,6,12,18,24,30,36,42], esPangrama: true },
      { palabra: "NEGRO",    celdas: [1,2,3,4,5]      },
      { palabra: "VERDE",    celdas: [7,8,9,10,11]    },
      { palabra: "BEIGE",    celdas: [13,14,15,16,17]  },
      { palabra: "CORAL",    celdas: [19,20,21,22,23]  },
      { palabra: "SIENA",    celdas: [25,26,27,28,29]  },
      { palabra: "MALVA",    celdas: [31,32,33,34,35]  },
      { palabra: "RUBIO",    celdas: [37,38,39,40,41]  },
      { palabra: "EBANO",    celdas: [43,44,45,46,47]  },
    ],
  },

];

// ── Helpers ───────────────────────────────────────────────────

function getPuzzleByUUID(uuid) {
  return PUZZLES.find(p => p.uuid === uuid) || null;
}

function getPuzzleOfDay() {
  const hoy = new Date().toISOString().slice(0, 10);
  const byDate = PUZZLES.find(p => p.fecha === hoy);
  if (byDate) return byDate;
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((new Date() - start) / 86400000);
  return PUZZLES[dayOfYear % PUZZLES.length];
}
