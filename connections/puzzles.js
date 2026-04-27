// Base de datos de puzzles
// Colores: "yellow" | "green" | "blue" | "purple"
// Dificultad: yellow = fácil → purple = difícil

const PUZZLES = [
    {
        // Puzzle 0 — 2026-02-27
        uuid: "a1b2c3d4-0001-4e5f-8a9b-000000000001",
        fecha: "2026-02-27",
        categorias: [
            {
                nombre: "Bailes latinoamericanos",
                color: "yellow",
                palabras: ["SALSA", "CUMBIA", "MERENGUE", "BACHATA"],
            },
            {
                nombre: "Instrumentos de cuerda",
                color: "green",
                palabras: ["GUITARRA", "VIOLÍN", "ARPA", "BAJO"],
            },
            {
                nombre: "SOBRE___",
                color: "blue",
                palabras: ["MESA", "NOMBRE", "NATURAL", "SALIENTE"],
            },
            {
                nombre: "Sinónimos de MENTIRA",
                color: "purple",
                palabras: ["EMBUSTE", "BULO", "PATRAÑA", "FALSEDAD"],
            },
        ],
    },
    {
        // Puzzle 1 — 2026-02-28
        uuid: "a1b2c3d4-0002-4e5f-8a9b-000000000002",
        fecha: "2026-02-28",
        categorias: [
            {
                nombre: "Géneros literarios",
                color: "yellow",
                palabras: ["NOVELA", "CUENTO", "POEMA", "ENSAYO"],
            },
            {
                nombre: "Capitales sudamericanas",
                color: "green",
                palabras: ["LIMA", "BOGOTÁ", "BRASILIA", "CARACAS"],
            },
            {
                nombre: "Sinónimos de BONITO",
                color: "blue",
                palabras: ["BELLO", "HERMOSO", "LINDO", "GUAPO"],
            },
            {
                nombre: "Riman con -ÓN",
                color: "purple",
                palabras: ["CANCIÓN", "PANTALÓN", "TELEVISIÓN", "AVIÓN"],
            },
        ],
    },
    {
        // Puzzle 2 — 2026-03-01
        uuid: "a1b2c3d4-0003-4e5f-8a9b-000000000003",
        fecha: "2026-03-01",
        categorias: [
            {
                nombre: "Animales que hibernan",
                color: "yellow",
                palabras: ["OSO", "MURCIÉLAGO", "MARMOTA", "ERIZO"],
            },
            {
                nombre: "Sinónimos de CAMINAR",
                color: "green",
                palabras: ["ANDAR", "MARCHAR", "PASEAR", "DEAMBULAR"],
            },
            {
                nombre: "Tipos de pasta italiana",
                color: "blue",
                palabras: ["ESPAGUETI", "PENNE", "FUSILLI", "LASAÑA"],
            },
            {
                nombre: "___ de agua",
                color: "purple",
                palabras: ["PISTOLA", "POLO", "FUENTE", "BOTELLA"],
            },
        ],
    },
    {
        // Puzzle 3 — 2026-03-02
        uuid: "a1b2c3d4-0004-4e5f-8a9b-000000000004",
        fecha: "2026-03-02",
        categorias: [
            {
                nombre: "Frutas tropicales",
                color: "yellow",
                palabras: ["MANGO", "PAPAYA", "GUAYABA", "MARACUYÁ"],
            },
            {
                nombre: "Sinónimos de ENOJADO",
                color: "green",
                palabras: ["FURIOSO", "IRACUNDO", "COLÉRICO", "INDIGNADO"],
            },
            {
                nombre: "Partes del ojo",
                color: "blue",
                palabras: ["PUPILA", "CÓRNEA", "RETINA", "IRIS"],
            },
            {
                nombre: "Contienen un color",
                color: "purple",
                palabras: ["AZULEJO", "ENROJECER", "VERDURA", "AMORATADO"],
            },
        ],
    },
    {
        // Puzzle 4 — 2026-03-03
        uuid: "a1b2c3d4-0005-4e5f-8a9b-000000000005",
        fecha: "2026-03-03",
        categorias: [
            {
                nombre: "Medios de transporte",
                color: "yellow",
                palabras: ["AVIÓN", "TREN", "BARCO", "AUTOBÚS"],
            },
            {
                nombre: "Elementos químicos",
                color: "green",
                palabras: ["OXÍGENO", "HIDRÓGENO", "CARBONO", "NITRÓGENO"],
            },
            {
                nombre: "___ nacional",
                color: "blue",
                palabras: ["PARQUE", "HIMNO", "BANDERA", "EQUIPO"],
            },
            {
                nombre: "Sinónimos de SILENCIO",
                color: "purple",
                palabras: ["MUTISMO", "QUIETUD", "SIGILO", "MUDEZ"],
            },
        ],
    },
    {
        // Puzzle 5 — 2026-03-04
        uuid: "a1b2c3d4-0006-4e5f-8a9b-000000000006",
        fecha: "2026-03-04",
        categorias: [
            {
                "nombre": "Marcas de detergente que también son nombres propios",
                "color": "yellow",
                "palabras": ["ROMA", "ARIEL", "ACE", "BOLD"]
            },
            {
                "nombre": "Palabras que pueden ser títulos de obras ganadoras del Óscar a Mejor Película",
                "color": "green",
                "palabras": ["ROMA", "GLADIADOR", "PARÁSITOS", "TITANIC"]
            },
            {
                "nombre": "Palabras que pueden ir después de 'cuento de'",
                "color": "blue",
                "palabras": ["HADAS", "TERROR", "NAVIDAD", "CIENCIA"]
            },
            {
                "nombre": "Palabras que contienen el nombre de una nota musical (DO, RE, MI, FA, SOL, LA, SI) en cualquier posición",
                "color": "purple",
                "palabras": ["FAMILIA", "MIRADOR", "ISLA", "SOLAR"]
            }
        ]

    },
];

// Colores Tailwind por nivel
const COLOR_CLASSES = {
    yellow: {
        bg: "bg-yellow-300",
        text: "text-yellow-900",
        dot: "bg-yellow-300",
        label: "Amarillo",
    },
    green: {
        bg: "bg-green-400",
        text: "text-green-900",
        dot: "bg-green-400",
        label: "Verde",
    },
    blue: {
        bg: "bg-blue-400",
        text: "text-blue-900",
        dot: "bg-blue-400",
        label: "Azul",
    },
    purple: {
        bg: "bg-purple-400",
        text: "text-purple-900",
        dot: "bg-purple-400",
        label: "Morado",
    },
};

/**
 * Retorna el puzzle correspondiente a la fecha de hoy.
 * Si no hay puzzle para hoy, rota por índice de día del año.
 */
/**
 * Retorna el puzzle por UUID.
 * Lanza un error si no existe.
 */
function getPuzzleByUUID(uuid) {
    return PUZZLES.find((p) => p.uuid === uuid) || null;
}

/**
 * Retorna el puzzle correspondiente a la fecha de hoy.
 * Si no hay puzzle para hoy, rota por índice de día del año.
 */
function getPuzzleOfDay() {
    const hoy = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const byDate = PUZZLES.find((p) => p.fecha === hoy);
    if (byDate) return byDate;

    // Fallback: rotar por día del año
    const start = new Date(new Date().getFullYear(), 0, 0);
    const diff = new Date() - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return PUZZLES[dayOfYear % PUZZLES.length];
}
