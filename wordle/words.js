// ============================================================
// words.js — Palabras del día + palabras válidas para Palabrle
// ============================================================
// Todas las palabras: 5 letras, mayúsculas, sin tildes en la
// comparación (las tildes se muestran pero se normalizan al validar)

// Palabras que pueden ser la respuesta, con UUID y fecha asociada
const PALABRAS_DEL_DIA = [
  { uuid: "b2c3d4e5-0001-4f6a-9b0c-100000000001", fecha: "2026-02-28", palabra: "PLAYA" },
  { uuid: "b2c3d4e5-0002-4f6a-9b0c-100000000002", fecha: "2026-03-01", palabra: "CIELO" },
  { uuid: "b2c3d4e5-0003-4f6a-9b0c-100000000003", fecha: "2026-03-02", palabra: "FABLE" },
  { uuid: "b2c3d4e5-0004-4f6a-9b0c-100000000004", fecha: "2026-03-03", palabra: "LUGAR" },
  { uuid: "b2c3d4e5-0005-4f6a-9b0c-100000000005", fecha: "2026-03-04", palabra: "TORRE" },
  { uuid: "b2c3d4e5-0006-4f6a-9b0c-100000000006", fecha: "2026-03-05", palabra: "MUNDO" },
  { uuid: "b2c3d4e5-0007-4f6a-9b0c-100000000007", fecha: "2026-03-06", palabra: "VAPOR" },
  { uuid: "b2c3d4e5-0008-4f6a-9b0c-100000000008", fecha: "2026-03-07", palabra: "CLAVE" },
  { uuid: "b2c3d4e5-0009-4f6a-9b0c-100000000009", fecha: "2026-03-08", palabra: "PLUMA" },
  { uuid: "b2c3d4e5-0010-4f6a-9b0c-100000000010", fecha: "2026-03-09", palabra: "BRISA" },
  { uuid: "b2c3d4e5-0011-4f6a-9b0c-100000000011", fecha: "2026-03-10", palabra: "FINCA" },
  { uuid: "b2c3d4e5-0012-4f6a-9b0c-100000000012", fecha: "2026-03-11", palabra: "GLOBO" },
  { uuid: "b2c3d4e5-0013-4f6a-9b0c-100000000013", fecha: "2026-03-12", palabra: "TRIGO" },
  { uuid: "b2c3d4e5-0014-4f6a-9b0c-100000000014", fecha: "2026-03-13", palabra: "PERLA" },
  { uuid: "b2c3d4e5-0015-4f6a-9b0c-100000000015", fecha: "2026-03-14", palabra: "DANZA" },
  { uuid: "b2c3d4e5-0016-4f6a-9b0c-100000000016", fecha: "2026-03-15", palabra: "SUELO" },
  { uuid: "b2c3d4e5-0017-4f6a-9b0c-100000000017", fecha: "2026-03-16", palabra: "TIGRE" },
  { uuid: "b2c3d4e5-0018-4f6a-9b0c-100000000018", fecha: "2026-03-17", palabra: "GRASA" },
  { uuid: "b2c3d4e5-0019-4f6a-9b0c-100000000019", fecha: "2026-03-18", palabra: "JUEGO" },
  { uuid: "b2c3d4e5-0020-4f6a-9b0c-100000000020", fecha: "2026-03-19", palabra: "MOLDE" },
  { uuid: "b2c3d4e5-0021-4f6a-9b0c-100000000021", fecha: "2026-03-20", palabra: "FRUTA" },
  { uuid: "b2c3d4e5-0022-4f6a-9b0c-100000000022", fecha: "2026-03-21", palabra: "LLAVE" },
  { uuid: "b2c3d4e5-0023-4f6a-9b0c-100000000023", fecha: "2026-03-22", palabra: "CERDO" },
  { uuid: "b2c3d4e5-0024-4f6a-9b0c-100000000024", fecha: "2026-03-23", palabra: "PARTE" },
  { uuid: "b2c3d4e5-0025-4f6a-9b0c-100000000025", fecha: "2026-03-24", palabra: "CAMPO" },
  { uuid: "b2c3d4e5-0026-4f6a-9b0c-100000000026", fecha: "2026-03-25", palabra: "LECHE" },
  { uuid: "b2c3d4e5-0027-4f6a-9b0c-100000000027", fecha: "2026-03-26", palabra: "BUQUE" },
  { uuid: "b2c3d4e5-0028-4f6a-9b0c-100000000028", fecha: "2026-03-27", palabra: "CLIMA" },
  { uuid: "b2c3d4e5-0029-4f6a-9b0c-100000000029", fecha: "2026-03-28", palabra: "ORDEN" },
  { uuid: "b2c3d4e5-0030-4f6a-9b0c-100000000030", fecha: "2026-03-29", palabra: "PUNTA" },
];

// Palabras válidas para adivinar (incluye las del día + muchas más)
// Se normalizan a mayúsculas sin tilde para comparación uniforme
const PALABRAS_VALIDAS = new Set([
  // — palabras del día —
  "PLAYA","CIELO","FABLE","LUGAR","TORRE","MUNDO","VAPOR","CLAVE","PLUMA","BRISA",
  "FINCA","GLOBO","TRIGO","PERLA","DANZA","SUELO","TIGRE","GRASA","JUEGO","MOLDE",
  "FRUTA","LLAVE","CERDO","PARTE","CAMPO","LECHE","BUQUE","CLIMA","ORDEN","PUNTA",
  // — vocabulario adicional —
  "AGUJA","ALGAS","ALTAR","AMIGO","ANGEL","ANTES","ARBOL","ARCOS","ARENA","ARROZ",
  "AVION","AZCAR","AZULE","BALCO","BANCO","BAILE","BAJAR","BARRO","BARCO","BEBER",
  "BELLA","BELLO","BESAR","BESOS","BLUSA","BOLAS","BOLSO","BONOS","BURRO","BYTES",
  "CABAL","CABRA","CACOS","CAIDA","CALLE","CANTA","CANTO","CARGO","CARTA","CASAS",
  "CASCO","CAZAR","CERCA","CERRO","CHICA","CHICO","CIFRA","CINCO","CINTA","CIRCO",
  "CLASE","COBRA","COCER","COCOA","COLOR","CONTA","COMBO","COPAS","CORAL","CORTE",
  "COSA","COSTA","CUEVA","CULPA","CURVA","DEBER","DELTA","DEUDA","DIETA","DOBLE",
  "DOLOR","DRAMA","DUCHA","DULCE","DUROS","ECHAR","ENERO","ERROR","ESCAL","ESCENA",
  "ESPADA","ESTACA","ETAPA","EXTRA","FALDA","FALSO","FANGO","FICHA","FIEBRE","FINAL",
  "FIRMA","FLACO","FLOR","FONDO","FORMA","FOTOS","FRENO","FRESA","FUEGO","FUERZA",
  "GANAS","GATOS","GESTO","GIRAR","GOLFO","GOLPE","GORDO","GORRA","GRADO","GRAFO",
  "GRANO","GRITO","GRUPO","GUAPO","GUSTO","HABLA","HACER","HIELO","HIJOS","HONGO",
  "HONOR","HUESO","HUEVO","HUMMO","IDEAS","IGUAL","IMPOR","INTRO","ISLA","JAMON",
  "JARRA","JOVEN","JUGAR","KILO","LABIA","LABIO","LABOR","LARGO","LASER","LATON",
  "LETRA","LIBRA","LIBRO","LIMON","LINEA","LISTA","LITRO","LLAMA","LLANO","LLENO",
  "LLORO","LOGRO","LUCES","LUMBRE","LUNAR","MADRE","MAGIA","MAIZ","MANOS","MANTA",
  "MANZANA","MAREA","MARCO","MATAR","MAYOR","MEDIA","MENOS","METRO","MIEDO","MIMAR",
  "MISMO","MITON","MIXTO","MORIR","MOTOR","MUCHO","MUELA","MUJER","MURAL","NARCO",
  "NARIZ","NEGRO","NIVEL","NOBLE","NOCHE","NORMA","NORTE","NOTA","NOVIO","NUBLE",
  "NUEVE","NUEVO","OBESO","OBRAR","OESTE","OLIVA","OLIVO","OMITE","OPINA","OPTAR",
  "OREJA","OVEJA","OTOÑO","PADRE","PARED","PARIS","PASTO","PATIO","PATOS","PECES",
  "PELEA","PELMA","PERRO","PESAR","PEDIR","PIANO","PICAR","PIEDRA","PIEZA","PILOTO",
  "PINZA","PISTA","PIXEL","PIZZA","PLANO","PLATO","PLAZA","POLEN","POLVO","POLLO",
  "POSSO","PRISA","PRIMO","PROBA","PUNTA","RASGO","RAZÓN","REDAN","REGLA","REINO",
  "RELOJ","RENTA","REYES","RIEGO","RISCO","RITMO","ROBLE","ROCAS","RODAR","RODEO",
  "RONDA","ROPIA","RUBIO","RUEDA","RURAL","SABOR","SACAR","SALIR","SALON","SALSA",
  "SALTO","SANAR","SAUCE","SAZON","SELLO","SERIE","SEXTO","SIGLO","SIRCO","SOBRE",
  "SOCIO","SOFAS","SOLAR","SONDA","SUAVE","SUBIR","SUELA","SUMAR","TABLA","TALLA",
  "TANGO","TARDE","TARRO","TECHO","TEMAS","TEMOR","TENER","TENSO","TEXTO","TIBIA",
  "TIMBA","TIMBO","TINTO","TOCAR","TOLDO","TOMAR","TOTAL","TRAJE","TRAMA","TRAMO",
  "TRAMO","TRARO","TRAZO","TRECE","TRESA","TURNO","UNICO","UNION","UNTAR","URGIR",
  "VARIOS","VALOR","VECES","VERDE","VERSO","VIAJE","VIDEO","VINOS","VISTA","VITAL",
  "VOCAL","VOLCA","VOLCO","VOLAR","VONDA","VOTOS","VUELO","YUNTA","ZUMO",
]);

// ── Helpers ──────────────────────────────────────────────────

/** Normaliza: quita tildes, a mayúsculas */
function normalizar(str) {
  return str
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Devuelve la palabra del día (por UUID o por fecha/rotación) */
function getPalabraByUUID(uuid) {
  return PALABRAS_DEL_DIA.find((p) => p.uuid === uuid) || null;
}

function getPalabraOfDay() {
  const hoy = new Date().toISOString().slice(0, 10);
  const byDate = PALABRAS_DEL_DIA.find((p) => p.fecha === hoy);
  if (byDate) return byDate;

  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((new Date() - start) / 86400000);
  return PALABRAS_DEL_DIA[dayOfYear % PALABRAS_DEL_DIA.length];
}

/** Valida que una palabra de 5 letras esté en el vocabulario */
function esValida(palabra) {
  return PALABRAS_VALIDAS.has(normalizar(palabra));
}

/**
 * Evalúa un intento contra la palabra secreta.
 * Retorna array de 5 objetos: { letra, estado }
 * estado: "green" | "yellow" | "gray"
 *
 * Maneja duplicados correctamente:
 *  - Primero asigna greens
 *  - Luego yellows/grays consumiendo letras no usadas
 */
function evaluarIntento(intento, secreta) {
  const intentoArr = normalizar(intento).split("");
  const secretaArr = normalizar(secreta).split("");
  const resultado = Array(5).fill(null);
  const disponibles = [...secretaArr]; // letras que quedan por asignar

  // Paso 1: greens
  for (let i = 0; i < 5; i++) {
    if (intentoArr[i] === secretaArr[i]) {
      resultado[i] = { letra: intento[i], estado: "green" };
      disponibles[i] = null;
    }
  }

  // Paso 2: yellows / grays
  for (let i = 0; i < 5; i++) {
    if (resultado[i]) continue; // ya asignado como green
    const idx = disponibles.indexOf(intentoArr[i]);
    if (idx !== -1) {
      resultado[i] = { letra: intento[i], estado: "yellow" };
      disponibles[idx] = null;
    } else {
      resultado[i] = { letra: intento[i], estado: "gray" };
    }
  }

  return resultado;
}
