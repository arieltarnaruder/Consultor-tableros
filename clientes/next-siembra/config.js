// CONFIGURACIÓN DE MARCA E IDENTIDAD
const CLIENTE = {
    nombre: "Next Siembra",
    subtitulo: "Plan de Acción Comercial 2026 · Generación de Demanda",
    colorA: "#0EA5E9", // Celeste Next
    colorB: "#2E7D32", // Verde Eficiencia
    colorC: "#F5C800",
    logo: null
};

// MATRIZ DE USUARIOS Y PERMISOS (PINS ACCESO)
const USUARIOS_DEMO = [
    { id: "dir", nombre: "Ariel Tarnaruder", rol: "director", zona: null, pin: "1234", email: "ariel@nextsiembra.com" },
    { id: "pm", nombre: "Product Manager", rol: "pm", zona: null, pin: "2001", email: "pm@nextsiembra.com" },
    { id: "mkt", nombre: "Responsable Marketing", rol: "marketing", zona: null, pin: "2002", email: "mkt@nextsiembra.com" }
];

// BASE DE DATOS OPERATIVA (EXTRAÍDA DEL INFORME DE JERRY)
const DEMO = [
    { programa: "Generación de Demanda", plan: "Investigación y Segmentación", tarea: "Mapeo de zonas agrícolas prioritarias junto a PMs", responsable: "director", estado: "En curso", prioridad: "Alta", avance: 0.40, fechaVencimiento: "2026-06-30", comentarios: "Definir perfil de productor ideal para la tecnología." },
    { programa: "Generación de Demanda", plan: "Investigación y Segmentación", tarea: "Relevamiento de base de datos de clientes de concesionarios (Zona Núcleo)", responsable: "marketing", estado: "Pendiente", prioridad: "Media", avance: 0.00, fechaVencimiento: "2026-06-30", comentarios: "Identificar prospectos de alta conversión." },
    { programa: "Generación de Demanda", plan: "Alianzas e Influenciadores", tarea: "Reuniones estratégicas con coordinadores de redes Aapresid", responsable: "director", estado: "En curso", prioridad: "Alta", avance: 0.25, fechaVencimiento: "2026-07-15", comentarios: "Explorar validaciones conjuntas a campo." },
    { programa: "Generación de Demanda", plan: "Alianzas e Influenciadores", tarea: "Identificar y contactar asesores técnicos independientes referentes", responsable: "marketing", estado: "Pendiente", prioridad: "Media", avance: 0.00, fechaVencimiento: "2026-07-15", comentarios: "Armar red de difusión para datos de ensayos." },
    { programa: "Generación de Demanda", plan: "Contenidos y Comunicación", tarea: "Desarrollar materiales de soporte técnico enfocados en Corte por Sección Bosch", responsable: "marketing", estado: "En curso", prioridad: "Alta", avance: 0.60, fechaVencimiento: "2026-06-15", comentarios: "Destacar fuertemente el ahorro de insumos." },
    { programa: "Generación de Demanda", plan: "Contenidos y Comunicación", tarea: "Preparar casos de éxito y folletería técnica para drones EA Vision", responsable: "marketing", estado: "Pendiente", prioridad: "Media", avance: 0.10, fechaVencimiento: "2026-06-15", comentarios: "Enfoque netamente en eficiencia agronómica." },
    { programa: "Generación de Demanda", plan: "Ferias y Exposiciones", tarea: "Selección y priorización del calendario de muestras rurales del interior", responsable: "director", estado: "Cerrada", prioridad: "Alta", avance: 1.00, fechaVencimiento: "2026-05-20", comentarios: "Calendario cerrado y aprobado con el equipo." },
    { programa: "Generación de Demanda", plan: "Ferias y Exposiciones", tarea: "Coordinar envío de material promocional y banners unificados a distribuidores", responsable: "marketing", estado: "Pendiente", prioridad: "Media", avance: 0.00, fechaVencimiento: "2026-08-30", comentarios: "Acompañar los stands propios de los concesionarios." },
    { programa: "Generación de Demanda", plan: "Ferias y Exposiciones", tarea: "Asignar ingenieros de soporte técnico para asistencia en jornadas regionales", responsable: "director", estado: "Pendiente", prioridad: "Media", avance: 0.00, fechaVencimiento: "2026-08-30", comentarios: "Soporte presencial técnico programado." },
    { programa: "Generación de Demanda", plan: "Ensayo y Validación Técnica", tarea: "Definición del protocolo técnico para seguimiento de lotes testigo", responsable: "director", estado: "En curso", prioridad: "Alta", avance: 0.50, fechaVencimiento: "2026-09-15", comentarios: "Asegurar rigurosidad de los datos junto con Jerry." },
    { programa: "Generación de Demanda", plan: "Ensayo y Validación Técnica", tarea: "Selección de productores referentes para implementación de muestras dinámicas", responsable: "marketing", estado: "Pendiente", prioridad: "Media", avance: 0.00, fechaVencimiento: "2026-09-15", comentarios: "Buscar líderes de opinión en cada región." }
];

// Exportar variables para que el motor las lea de forma externa
if (typeof module !== 'undefined') {
    module.exports = { CLIENTE, USUARIOS_DEMO, DEMO };
}
