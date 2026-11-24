// =========================================================================
// CONFIGURACIÓN DE FIREBASE FIRESTORE (UNERMB 2026)
// =========================================================================
const firebaseConfig = {
  apiKey: "AIzaSyA8lUOC24vw5ygSSnJLJH2_ZCxjT7_QVK8",
  authDomain: "unermb-expoferia.firebaseapp.com",
  projectId: "unermb-expoferia",
  storageBucket: "unermb-expoferia.firebasestorage.app",
  messagingSenderId: "506583817897",
  appId: "1:506583817897:web:866cb1c9e6cd59ed9553b8"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Colecciones en la nube
const coleccionParticipantes = db.collection("participantes");
const coleccionEventos = db.collection("eventos");
const coleccionStands = db.collection("stands");
const coleccionNoticias = db.collection("noticias");
const coleccionTesis = db.collection("tesis");

// Credenciales Maestras del Administrador
const ADMIN_EMAIL = "admin@unermb.edu.ve";
const ADMIN_PASS = "UNERMB2026*";

// =========================================================================
// RELACIÓN DINÁMICA CARRERA -> LÍNEAS DE INVESTIGACIÓN UNERMB (PUNTOS 1 Y 2)
// =========================================================================
const LINEAS_POR_CARRERA = {
  "PNF en Informática": [
    "Ingeniería del Software, Desarrollo Web y Aplicaciones Móviles",
    "Inteligencia Artificial, Ciencia de Datos y Aprendizaje Automático",
    "Redes, Telecomunicaciones y Seguridad Informática",
    "Automatización, IoT y Sistemas Embebidos"
  ],
  "Ingeniería de Gas": [
    "Procesamiento, Transporte y Distribución de Gas Natural",
    "Simulación y Optimización de Procesos Petroquímicos",
    "Seguridad Industrial, Higiene y Ambiente en Hidrocarburos",
    "Eficiencia Energética y Energías Alternativas"
  ],
  "Ingeniería de Mantenimiento Mecánico": [
    "Confiabilidad Operacional y Mantenimiento Predictivo",
    "Diseño Mecánico, Materiales y Manufactura",
    "Termodinámica, Fluidos y Sistemas Térmicos",
    "Gestión de Activos Industriales"
  ],
  "Administración": [
    "Gerencia Estratégica, Innovación y Emprendimiento",
    "Gestión Aduanera, Comercio Exterior y Logística",
    "Talento Humano y Comportamiento Organizacional",
    "Gestión Pública y Desarrollo Regional"
  ],
  "Contaduría Pública": [
    "Auditoría Financiera, Control Interno y Forense",
    "Gestión Tributaria y Normativa Fiscal Venezolana",
    "Contabilidad de Costos y Finanzas Corporativas",
    "Sistemas de Información Contable"
  ],
  "Educación": [
    "Tecnologías de la Información y Comunicación (TIC) en el Aula",
    "Didáctica de las Ciencias Naturales y Exactas",
    "Currículo, Evaluación y Gestión Educativa",
    "Pedagogía Social, Inclusión y Orientación"
  ],
  "Ingeniería Agroalimentaria": [
    "Producción Vegetal y Animal Sustentable",
    "Tecnología y Conservación de Alimentos",
    "Agroecología, Suelos y Gestión Ambiental",
    "Soberanía y Seguridad Agroalimentaria"
  ]
};

function configurarSelectorCarreraYLinea(idSelectCarrera, idSelectLinea) {
  const selectCarrera = document.getElementById(idSelectCarrera);
  const selectLinea = document.getElementById(idSelectLinea);
  if (!selectCarrera || !selectLinea) return;

  selectCarrera.addEventListener("change", () => {
    const carreraSeleccionada = selectCarrera.value;
    const lineas = LINEAS_POR_CARRERA[carreraSeleccionada] || [];

    selectLinea.innerHTML = "";
    if (lineas.length === 0) {
      selectLinea.disabled = true;
      selectLinea.innerHTML = '<option value="" selected disabled>Primero seleccione una carrera...</option>';
      return;
    }

    selectLinea.disabled = false;
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.disabled = true;
    defaultOpt.selected = true;
    defaultOpt.textContent = "Seleccione Línea de Investigación...";
    selectLinea.appendChild(defaultOpt);

    lineas.forEach(linea => {
      const opt = document.createElement("option");
      opt.value = linea;
      opt.textContent = linea;
      selectLinea.appendChild(opt);
    });
  });
}

// =========================================================================
// ANIMACIÓN DE SUBIDA SUAVE
// =========================================================================
function inyectarEstilosAnimacion() {
  if (document.getElementById("estilosAnimacionUNERMB")) return;
  const style = document.createElement("style");
  style.id = "estilosAnimacionUNERMB";
  style.innerHTML = `
    @keyframes slideUpSmooth {
      0% {
        opacity: 0;
        transform: translateY(45px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animar-subida-suave {
      animation: slideUpSmooth 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `;
  document.head.appendChild(style);
}

function dispararAnimacion(idElemento) {
  const el = document.getElementById(idElemento);
  if (!el) return;
  el.classList.remove("animar-subida-suave");
  void el.offsetWidth;
  el.classList.add("animar-subida-suave");
}

// =========================================================================
// DATOS SEMILLA (CRONOGRAMA, STANDS, NOTICIAS Y REPOSITORIO DE TESIS)
// =========================================================================
const EVENTOS_SEMILLA = [
  {
    idDoc: "ev_1",
    sede: "Cabimas",
    lugar: "Cabimas - Aud. Principal",
    horario: "09:00 AM - 10:30 AM",
    titulo: "Foro: Inteligencia Artificial en la Educación Superior",
    ponente: "Dra. Carmen Silva",
    tipo: "Foro Central",
    estado: "activo",
    fechaArchivado: null
  },
  {
    idDoc: "ev_2",
    sede: "Ciudad Ojeda",
    lugar: "Ciudad Ojeda - Lab 2",
    horario: "11:00 AM - 01:00 PM",
    titulo: "Taller: Despliegue de Aplicaciones con Docker",
    ponente: "Ing. Roberto Gómez",
    tipo: "Taller Práctico",
    estado: "activo",
    fechaArchivado: null
  },
  {
    idDoc: "ev_3",
    sede: "San Francisco",
    lugar: "San Francisco - Salón A",
    horario: "02:00 PM - 03:30 PM",
    titulo: "Mesa de Trabajo: Innovación Tecnológica Regional",
    ponente: "MSc. Alejandro Rincón",
    tipo: "Mesa de Investigación",
    estado: "activo",
    fechaArchivado: null
  },
  {
    idDoc: "ev_4",
    sede: "Los Puertos de Altagracia",
    lugar: "Los Puertos - Sala de Conferencias",
    horario: "10:00 AM - 11:30 AM",
    titulo: "Simposio: Desarrollo Sustentable en la Costa Oriental",
    ponente: "Dra. Beatriz Nava",
    tipo: "Simposio",
    estado: "activo",
    fechaArchivado: null
  }
];

const STANDS_SEMILLA = [
  {
    idDoc: "st_101",
    titulo: "Portal Automatizado de Gestión de Expoferias UNERMB",
    categoria: "Software y Web",
    sede: "Cabimas",
    equipo: "Jesús Pérez y Diego Peña - PNF Informática",
    descripcion: "Plataforma web responsive para registro de ponencias, repositorio de tesis y emisión de certificados con QR.",
    votos: 28
  },
  {
    idDoc: "st_102",
    titulo: "Estación Meteorológica IoT con ESP32 y Panel Solar",
    categoria: "Robótica e IoT",
    sede: "Ciudad Ojeda",
    equipo: "Semillero de Robótica Aplicada",
    descripcion: "Monitoreo en tiempo real de temperatura, humedad y calidad del aire en los laboratorios universitarios.",
    votos: 19
  },
  {
    idDoc: "st_103",
    titulo: "Modelo de Gestión Contable para PYMES en el Zulia",
    categoria: "Gestión e Industria",
    sede: "San Francisco",
    equipo: "Grupo de Investigación Gerencial",
    descripcion: "Herramienta de análisis financiero y control tributario adaptada a emprendimientos regionales.",
    votos: 15
  }
];

const TESIS_SEMILLA = [
  {
    idDoc: "tesis_1",
    titulo: "Desarrollo de un Portal Web SPA con Base de Datos Cloud para la Gestión de Congresos y Expoferias de la UNERMB",
    autores: "Jesús Pérez, Diego Peña",
    tutor: "MSc. Alejandro Rincón",
    carrera: "PNF en Informática",
    linea: "Ingeniería del Software, Desarrollo Web y Aplicaciones Móviles",
    anio: "2026",
    enlace: "",
    resumen: "Diseño e implementación de un sistema web centralizado con arquitectura SPA, validación criptográfica de certificados mediante códigos QR y sincronización en tiempo real en Firebase Firestore."
  },
  {
    idDoc: "tesis_2",
    titulo: "Optimización del Sistema de Compresión y Transporte de Gas Natural en la Costa Oriental del Lago",
    autores: "Br. Carlos Mendoza",
    tutor: "Ing. Roberto Gómez",
    carrera: "Ingeniería de Gas",
    linea: "Procesamiento, Transporte y Distribución de Gas Natural",
    anio: "2025",
    enlace: "",
    resumen: "Evaluación termodinámica y simulación operativa de estaciones compresoras para reducir pérdidas de presión en redes de distribución industrial."
  },
  {
    idDoc: "tesis_3",
    titulo: "Estrategias Didácticas Basadas en Entornos Virtuales para la Enseñanza de las Ciencias Naturales",
    autores: "Lcda. María Rodríguez",
    tutor: "Dra. Carmen Silva",
    carrera: "Educación",
    linea: "Tecnologías de la Información y Comunicación (TIC) en el Aula",
    anio: "2025",
    enlace: "",
    resumen: "Análisis del impacto de las herramientas digitales interactivas en el rendimiento académico de estudiantes de educación media y universitaria."
  }
];

const NOTICIAS_SEMILLA = [
  {
    idDoc: "not_1",
    titulo: "Apertura Oficial de Recepción de Ponencias y Tesis UNERMB 2026",
    categoria: "Comunicado Oficial",
    contenido: "El Vicerrectorado Académico informa a toda la comunidad universitaria que se encuentra abierto el registro de ponencias por carrera y el repositorio digital de trabajos de grado.",
    fecha: new Date().toISOString()
  },
  {
    idDoc: "not_2",
    titulo: "Implementación de Certificados con Verificación QR",
    categoria: "Expoferia 2026",
    contenido: "Todos los certificados emitidos en esta edición cuentan con validación mediante código QR integrado y acceso privado por participante.",
    fecha: new Date().toISOString()
  }
];

let participantes = [];
let eventosCronograma = [];
let standsExpoferia = [];
let noticiasPortal = [];
let repositorioTesis = [];

let sesionActual = JSON.parse(sessionStorage.getItem("unermb_sesion")) || null;

// Control de 1 solo Like por stand
function obtenerStandsVotados() {
  try {
    return JSON.parse(localStorage.getItem("unermb_stands_votados")) || [];
  } catch (e) {
    return [];
  }
}

function guardarVotoStand(idStand) {
  const votados = obtenerStandsVotados();
  if (!votados.includes(idStand)) {
    votados.push(idStand);
    localStorage.setItem("unermb_stands_votados", JSON.stringify(votados));
  }
}

// =========================================================================
// UTILIDADES Y FORMATEO DE FECHA
// =========================================================================
function formatearFechaRegistro(fechaIso) {
  if (!fechaIso) return "Fecha no registrada";
  try {
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString("es-VE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  } catch (e) {
    return fechaIso;
  }
}

function actualizarContadores() {
  const activos = eventosCronograma.filter(e => e.estado !== "archivado");
  const statP = document.getElementById("statPonentes");
  const statE = document.getElementById("statEventos");
  const statT = document.getElementById("statTesis");
  const statN = document.getElementById("statNoticias");
  const badgeAdmin = document.querySelector("#navItemAdmin .badge");

  if (statP) statP.innerText = participantes.length;
  if (statE) statE.innerText = activos.length;
  if (statT) statT.innerText = repositorioTesis.length;
  if (statN) statN.innerText = noticiasPortal.length;
  if (badgeAdmin) badgeAdmin.innerText = participantes.length;
}

// =========================================================================
// SINCRONIZACIÓN EN TIEMPO REAL CON FIREBASE FIRESTORE
// =========================================================================
function iniciarSincronizacionNube() {
  coleccionParticipantes.onSnapshot(snapshot => {
    const lista = [];
    snapshot.forEach(doc => lista.push(doc.data()));
    participantes = lista;
    actualizarContadores();
    renderizarPanelAdmin();
    if (sesionActual && sesionActual.rolSistema === "participante") {
      renderizarVistaSesion();
    }
  });

  coleccionEventos.onSnapshot(async snapshot => {
    if (snapshot.empty) {
      for (const ev of EVENTOS_SEMILLA) {
        await coleccionEventos.doc(ev.idDoc).set(ev);
      }
      return;
    }
    const lista = [];
    snapshot.forEach(doc => lista.push({ ...doc.data(), idDoc: doc.id }));
    eventosCronograma = lista;
    actualizarContadores();
    renderizarCronograma();
    renderizarPanelAdmin();
  });

  coleccionStands.onSnapshot(async snapshot => {
    if (snapshot.empty) {
      for (const st of STANDS_SEMILLA) {
        await coleccionStands.doc(st.idDoc).set(st);
      }
      return;
    }
    const lista = [];
    snapshot.forEach(doc => lista.push({ ...doc.data(), idDoc: doc.id }));
    standsExpoferia = lista;
    actualizarContadores();
    const catActiva = document.querySelector(".filtro-stand.active")?.getAttribute("data-cat") || "todas";
    renderizarStands(catActiva);
  });

  coleccionTesis.onSnapshot(async snapshot => {
    if (snapshot.empty) {
      for (const t of TESIS_SEMILLA) {
        await coleccionTesis.doc(t.idDoc).set(t);
      }
      return;
    }
    const lista = [];
    snapshot.forEach(doc => lista.push({ ...doc.data(), idDoc: doc.id }));
    repositorioTesis = lista;
    actualizarContadores();
    renderizarRepositorioTesis();
  });

  coleccionNoticias.onSnapshot(async snapshot => {
    if (snapshot.empty) {
      for (const not of NOTICIAS_SEMILLA) {
        await coleccionNoticias.doc(not.idDoc).set(not);
      }
      return;
    }
    const lista = [];
    snapshot.forEach(doc => lista.push({ ...doc.data(), idDoc: doc.id }));
    lista.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    noticiasPortal = lista;
    actualizarContadores();
    renderizarNoticias();
  });
}

// =========================================================================
// VALIDACIONES DE TECLADO EN TIEMPO REAL
// =========================================================================
function configurarValidacionesInputs() {
  const camposSoloLetras = ["nombre", "asistenteNombre"];
  camposSoloLetras.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, "");
      });
    }
  });

  const camposSoloNumeros = ["cedula", "telefono", "asistenteCedula", "asistenteTelefono"];
  camposSoloNumeros.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, "");
      });
    }
  });
}

// =========================================================================
// NAVEGACIÓN SPA Y CONTROL DE SESIÓN
// =========================================================================
function cambiarPestana(tabId) {
  if (tabId === "admin" && (!sesionActual || sesionActual.rolSistema !== "admin")) {
    tabId = "acceso";
  }

  document.querySelectorAll(".tab-view").forEach(vista => vista.classList.remove("active"));
  const targetView = document.getElementById(`tab-${tabId}`);
  if (targetView) {
    targetView.classList.add("active");
    if (tabId === "admin") {
      dispararAnimacion("tab-admin");
    } else if (tabId === "acceso") {
      if (sesionActual && sesionActual.rolSistema === "participante") {
        dispararAnimacion("vistaPerfilParticipante");
      } else {
        dispararAnimacion("vistaFormularioLogin");
      }
    }
  }

  document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
    if (link.getAttribute("data-tab-target") === tabId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  const navCollapse = document.getElementById("navContent");
  if (navCollapse && navCollapse.classList.contains("show")) {
    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
    if (bsCollapse) bsCollapse.hide();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function guardarSesion(datosSesion) {
  sesionActual = datosSesion;
  if (datosSesion) {
    sessionStorage.setItem("unermb_sesion", JSON.stringify(datosSesion));
  } else {
    sessionStorage.removeItem("unermb_sesion");
  }
  renderizarVistaSesion();
  renderizarCronograma();
  renderizarNoticias();
  renderizarRepositorioTesis();
}

function renderizarVistaSesion() {
  const navItemAdmin = document.getElementById("navItemAdmin");
  const navLinkAcceso = document.getElementById("navLinkAcceso");
  const liNavAcceso = navLinkAcceso ? navLinkAcceso.closest(".nav-item") : null;
  const textoNavAcceso = document.getElementById("textoNavAcceso");
  const btnAbrirModalNoticiaAdmin = document.getElementById("btnAbrirModalNoticiaAdmin");
  const vistaFormLogin = document.getElementById("vistaFormularioLogin");
  const vistaPerfil = document.getElementById("vistaPerfilParticipante");

  // 1. Sin sesión activa
  if (!sesionActual) {
    navItemAdmin?.classList.add("d-none");
    btnAbrirModalNoticiaAdmin?.classList.add("d-none");
    liNavAcceso?.classList.remove("d-none");
    if (textoNavAcceso) textoNavAcceso.innerText = "Iniciar Sesión";
    vistaFormLogin?.classList.remove("d-none");
    vistaPerfil?.classList.add("d-none");
    return;
  }

  // 2. Administrador activo: Quitar "Sesión Admin" de la barra superior y ocultar el login
  if (sesionActual.rolSistema === "admin") {
    navItemAdmin?.classList.remove("d-none");
    btnAbrirModalNoticiaAdmin?.classList.remove("d-none");
    liNavAcceso?.classList.add("d-none");
    vistaFormLogin?.classList.add("d-none");
    vistaPerfil?.classList.add("d-none");
    renderizarPanelAdmin();
    return;
  }

  // 3. Participante activo: Mostrar "Mi Cuenta" y abrir su perfil privado
  if (sesionActual.rolSistema === "participante") {
    navItemAdmin?.classList.add("d-none");
    btnAbrirModalNoticiaAdmin?.classList.add("d-none");
    liNavAcceso?.classList.remove("d-none");
    if (textoNavAcceso) textoNavAcceso.innerText = "Mi Cuenta";

    const miRegistro = participantes.find(p => p.cedulaId === sesionActual.cedulaId);
    if (!miRegistro) return;

    vistaFormLogin?.classList.add("d-none");
    vistaPerfil?.classList.remove("d-none");

    const fechaTexto = formatearFechaRegistro(miRegistro.fechaCreacion);
    const estatus = miRegistro.estatusPonencia || "En Revisión";

    document.getElementById("perfilSaludoNombre").innerText = `Hola, ${miRegistro.nombre}`;
    document.getElementById("perfilCedula").innerText = miRegistro.cedula;
    document.getElementById("perfilCorreo").innerText = miRegistro.correo || "No especificado";
    document.getElementById("perfilTelefono").innerText = miRegistro.telefono || "No especificado";
    document.getElementById("perfilRol").innerText = miRegistro.rol;
    document.getElementById("perfilCarrera").innerText = miRegistro.carrera || "General";
    document.getElementById("perfilLinea").innerText = miRegistro.linea || "General";
    document.getElementById("perfilSede").innerText = miRegistro.sede || "General";
    document.getElementById("perfilEvento").innerText = miRegistro.evento;
    document.getElementById("perfilFecha").innerText = fechaTexto;
    document.getElementById("perfilCodigo").innerText = `Código de Verificación: ${miRegistro.codigo}`;

    const badgeEstatus = document.getElementById("perfilBadgeEstatus");
    const textoEstatus = document.getElementById("perfilTextoEstatus");
    const btnDescargarMiCert = document.getElementById("btnDescargarMiCertificado");
    const alertaPendiente = document.getElementById("alertaCertificadoPendiente");

    if (estatus === "Aprobada") {
      badgeEstatus.className = "badge bg-success";
      badgeEstatus.innerText = "Aprobada / Verificada";
      textoEstatus.innerText = "Tu participación ha sido avalada por el Comité Académico. Tu certificado digital está listo para descargar.";
      btnDescargarMiCert.disabled = false;
      alertaPendiente.classList.add("d-none");
    } else if (estatus === "En Revisión") {
      badgeEstatus.className = "badge bg-warning text-dark";
      badgeEstatus.innerText = "Pendiente por Aprobar (En Revisión)";
      textoEstatus.innerText = "El Administrador está verificando tu registro para habilitar la descarga de tu certificado.";
      btnDescargarMiCert.disabled = true;
      alertaPendiente.classList.remove("d-none");
    } else {
      badgeEstatus.className = "badge bg-danger";
      badgeEstatus.innerText = "Observada / Rechazada";
      textoEstatus.innerText = "Tu propuesta presenta observaciones por parte del comité evaluador.";
      btnDescargarMiCert.disabled = true;
      alertaPendiente.classList.remove("d-none");
    }

    document.getElementById("previewNombre").innerText = miRegistro.nombre.toUpperCase();
    document.getElementById("previewCedula").innerText = `Cédula de Identidad: ${miRegistro.cedula}`;
    document.getElementById("previewEvento").innerText = `Por su destacada participación como ${miRegistro.rol} en "${miRegistro.evento}"`;
    document.getElementById("previewFecha").innerHTML = `<i class="fa-regular fa-calendar-days me-1"></i>Registrado el: <strong>${fechaTexto}</strong>`;

    btnDescargarMiCert.onclick = () => {
      if (estatus === "Aprobada") {
        generarCertificadoPDF(miRegistro);
      }
    };
  }
}

// =========================================================================
// MODO CLARO / OSCURO
// =========================================================================
function inicializarTema() {
  const temaGuardado = localStorage.getItem("unermb_theme") || "light";
  aplicarTema(temaGuardado);

  const btnTheme = document.getElementById("themeToggle");
  if (btnTheme) {
    btnTheme.addEventListener("click", () => {
      const actual = document.documentElement.getAttribute("data-bs-theme");
      const nuevo = actual === "dark" ? "light" : "dark";
      aplicarTema(nuevo);
      localStorage.setItem("unermb_theme", nuevo);
    });
  }
}

function aplicarTema(tema) {
  document.documentElement.setAttribute("data-bs-theme", tema);
  const icon = document.getElementById("themeIcon");
  if (icon) {
    icon.className = tema === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
}

// =========================================================================
// RENDERIZADOS: CRONOGRAMA, STANDS, REPOSITORIO DE TESIS Y NOTICIAS
// =========================================================================
function renderizarCronograma() {
  const contenedor = document.getElementById("listaEventos");
  const filtroSede = document.getElementById("filtroSede")?.value || "todas";
  const textoBusqueda = document.getElementById("buscarEvento")?.value.trim().toLowerCase() || "";
  const sinEventosMsg = document.getElementById("sinEventosMsg");
  const esAdmin = sesionActual && sesionActual.rolSistema === "admin";

  if (!contenedor) return;
  contenedor.innerHTML = "";

  const filtrados = eventosCronograma.filter(ev => {
    if (ev.estado === "archivado") return false;
    const coincideSede = filtroSede === "todas" || ev.sede === filtroSede;
    const coincideTexto =
      (ev.titulo || "").toLowerCase().includes(textoBusqueda) ||
      (ev.ponente || "").toLowerCase().includes(textoBusqueda) ||
      (ev.lugar || "").toLowerCase().includes(textoBusqueda);
    return coincideSede && coincideTexto;
  });

  if (filtrados.length === 0) {
    sinEventosMsg?.classList.remove("d-none");
    return;
  } else {
    sinEventosMsg?.classList.add("d-none");
  }

  filtrados.forEach(ev => {
    const col = document.createElement("div");
    col.className = "col-md-6 evento-item";
    col.innerHTML = `
      <div class="card card-event shadow-sm h-100 p-3 d-flex flex-column justify-content-between">
        <div>
          <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-1">
            <span class="badge badge-sede px-2 py-1">
              <i class="fa-solid fa-location-dot me-1"></i>${ev.lugar}
            </span>
            <span class="text-muted small">
              <i class="fa-regular fa-clock me-1"></i>${ev.horario}
            </span>
          </div>
          <h5 class="fw-bold mb-1">${ev.titulo}</h5>
          <p class="text-muted small mb-3"><strong>Ponente:</strong> ${ev.ponente}</p>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top flex-wrap gap-2">
          <span class="badge bg-body-tertiary text-body border">${ev.tipo}</span>
          <div class="d-flex gap-2">
            ${esAdmin ? `
              <button class="btn btn-sm btn-outline-danger fw-semibold btn-archivar-evento" data-id="${ev.idDoc}">
                <i class="fa-solid fa-box-archive me-1"></i>Archivar
              </button>
            ` : ""}
            <button class="btn btn-sm btn-outline-primary fw-semibold btn-inscribir-evento"
              data-titulo="${ev.titulo}" data-sede="${ev.sede}">
              <i class="fa-solid fa-user-plus me-1"></i>Inscribirme
            </button>
          </div>
        </div>
      </div>
    `;
    contenedor.appendChild(col);
  });

  document.querySelectorAll(".btn-inscribir-evento").forEach(btn => {
    btn.addEventListener("click", () => {
      const titulo = btn.getAttribute("data-titulo");
      const sede = btn.getAttribute("data-sede");
      document.getElementById("eventoInscribirTitulo").value = titulo;
      document.getElementById("eventoInscribirSede").value = sede;
      document.getElementById("modalEventoNombreDisplay").innerText = titulo;
      document.getElementById("modalEventoSedeBadge").innerText = `Sede ${sede}`;
      document.getElementById("alertErrorAsistente")?.classList.add("d-none");
      const modal = new bootstrap.Modal(document.getElementById("modalInscribirEvento"));
      modal.show();
    });
  });

  document.querySelectorAll(".btn-archivar-evento").forEach(btn => {
    btn.addEventListener("click", async () => {
      const idDoc = btn.getAttribute("data-id");
      await coleccionEventos.doc(idDoc).update({
        estado: "archivado",
        fechaArchivado: new Date().toISOString()
      });
    });
  });
}

function renderizarStands(categoriaFiltro = "todas") {
  const contenedor = document.getElementById("listaStands");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  const votados = obtenerStandsVotados();

  const filtrados = standsExpoferia.filter(
    st => categoriaFiltro === "todas" || st.categoria === categoriaFiltro
  );

  filtrados.forEach(st => {
    const yaVoto = votados.includes(st.idDoc);
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";
    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0 rounded-3">
        <div class="card-body p-4 d-flex flex-column justify-content-between">
          <div>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-warning text-dark fw-semibold">${st.categoria}</span>
              <span class="badge badge-sede"><i class="fa-solid fa-location-dot me-1"></i>${st.sede}</span>
            </div>
            <h5 class="fw-bold mt-2 mb-2">${st.titulo}</h5>
            <p class="text-muted small mb-3">${st.descripcion}</p>
          </div>
          <div class="pt-3 border-top d-flex justify-content-between align-items-center">
            <small class="text-muted"><i class="fa-solid fa-users me-1"></i>${st.equipo}</small>
            <button class="btn btn-sm ${yaVoto ? 'btn-warning text-dark' : 'btn-outline-warning text-body'} fw-semibold btn-votar-stand"
              data-id="${st.idDoc}" ${yaVoto ? "disabled" : ""}>
              <i class="fa-solid ${yaVoto ? 'fa-check' : 'fa-thumbs-up text-warning'} me-1"></i>
              <span>${st.votos || 0}</span>
            </button>
          </div>
        </div>
      </div>
    `;
    contenedor.appendChild(col);
  });

  document.querySelectorAll(".btn-votar-stand").forEach(btn => {
    btn.addEventListener("click", async () => {
      const idDoc = btn.getAttribute("data-id");
      if (obtenerStandsVotados().includes(idDoc)) return;

      btn.disabled = true;
      guardarVotoStand(idDoc);

      const stand = standsExpoferia.find(s => s.idDoc === idDoc);
      if (stand) {
        await coleccionStands.doc(idDoc).update({
          votos: (stand.votos || 0) + 1
        });
      }
    });
  });
}

function renderizarRepositorioTesis() {
  const contenedor = document.getElementById("listaTesis");
  const textoBusqueda = document.getElementById("buscarTesis")?.value.trim().toLowerCase() || "";
  const filtroCarrera = document.getElementById("filtroCarreraTesis")?.value || "todas";
  const filtroAnio = document.getElementById("filtroAnioTesis")?.value || "todos";
  const sinTesisMsg = document.getElementById("sinTesisMsg");
  const esAdmin = sesionActual && sesionActual.rolSistema === "admin";

  if (!contenedor) return;
  contenedor.innerHTML = "";

  const filtradas = repositorioTesis.filter(t => {
    const coincideCarrera = filtroCarrera === "todas" || (t.carrera || "").includes(filtroCarrera);
    const coincideAnio = filtroAnio === "todos" || String(t.anio) === filtroAnio;
    const coincideTexto =
      (t.titulo || "").toLowerCase().includes(textoBusqueda) ||
      (t.autores || "").toLowerCase().includes(textoBusqueda) ||
      (t.tutor || "").toLowerCase().includes(textoBusqueda) ||
      (t.linea || "").toLowerCase().includes(textoBusqueda) ||
      (t.resumen || "").toLowerCase().includes(textoBusqueda);
    return coincideCarrera && coincideAnio && coincideTexto;
  });

  if (filtradas.length === 0) {
    sinTesisMsg?.classList.remove("d-none");
    return;
  } else {
    sinTesisMsg?.classList.add("d-none");
  }

  filtradas.forEach(t => {
    const col = document.createElement("div");
    col.className = "col-md-6";
    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0 rounded-3 border-start border-primary border-4">
        <div class="card-body p-4 d-flex flex-column justify-content-between">
          <div>
            <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-1">
              <span class="badge bg-primary-subtle text-primary-emphasis fw-semibold">${t.carrera}</span>
              <span class="badge bg-warning text-dark fw-bold"><i class="fa-regular fa-calendar me-1"></i>${t.anio}</span>
            </div>
            <h5 class="fw-bold mt-2 mb-2">${t.titulo}</h5>
            <p class="small text-primary-unermb fw-semibold mb-2">
              <i class="fa-solid fa-diagram-project me-1"></i>Línea: ${t.linea}
            </p>
            <p class="text-muted small mb-3">${t.resumen}</p>
          </div>
          <div>
            <div class="small text-muted mb-3">
              <div><i class="fa-solid fa-user-graduate me-1"></i><strong>Autor(es):</strong> ${t.autores}</div>
              <div><i class="fa-solid fa-chalkboard-user me-1"></i><strong>Tutor:</strong> ${t.tutor}</div>
            </div>
            <div class="pt-3 border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
              ${t.enlace ? `
                <a href="${t.enlace}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-primary fw-semibold">
                  <i class="fa-solid fa-arrow-up-right-from-square me-1"></i>Consultar Documento
                </a>
              ` : `<span class="badge bg-body-tertiary text-muted border"><i class="fa-solid fa-building-columns me-1"></i>Disponible en Biblioteca UNERMB</span>`}
              ${esAdmin ? `
                <button class="btn btn-sm btn-outline-danger btn-borrar-tesis" data-id="${t.idDoc}">
                  <i class="fa-solid fa-trash me-1"></i>Eliminar
                </button>
              ` : ""}
            </div>
          </div>
        </div>
      </div>
    `;
    contenedor.appendChild(col);
  });

  document.querySelectorAll(".btn-borrar-tesis").forEach(btn => {
    btn.addEventListener("click", async () => {
      const idDoc = btn.getAttribute("data-id");
      await coleccionTesis.doc(idDoc).delete();
    });
  });
}

function renderizarNoticias() {
  const contenedor = document.getElementById("listaNoticias");
  if (!contenedor) return;
  contenedor.innerHTML = "";
  const esAdmin = sesionActual && sesionActual.rolSistema === "admin";

  noticiasPortal.forEach(not => {
    const col = document.createElement("div");
    col.className = "col-md-6";
    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0 rounded-3">
        <div class="card-body p-4 d-flex flex-column justify-content-between">
          <div>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-primary-subtle text-primary-emphasis fw-semibold">${not.categoria}</span>
              <small class="text-muted"><i class="fa-regular fa-calendar me-1"></i>${formatearFechaRegistro(not.fecha)}</small>
            </div>
            <h5 class="fw-bold mt-2 mb-2">${not.titulo}</h5>
            <p class="text-muted small mb-0">${not.contenido}</p>
          </div>
          ${esAdmin ? `
            <div class="pt-3 mt-3 border-top text-end">
              <button class="btn btn-sm btn-outline-danger btn-borrar-noticia" data-id="${not.idDoc}">
                <i class="fa-solid fa-trash me-1"></i>Eliminar Noticia
              </button>
            </div>
          ` : ""}
        </div>
      </div>
    `;
    contenedor.appendChild(col);
  });

  document.querySelectorAll(".btn-borrar-noticia").forEach(btn => {
    btn.addEventListener("click", async () => {
      const idDoc = btn.getAttribute("data-id");
      await coleccionNoticias.doc(idDoc).delete();
    });
  });
}

// =========================================================================
// PANEL DE CONTROL DEL ADMINISTRADOR
// =========================================================================
function renderizarPanelAdmin() {
  if (!sesionActual || sesionActual.rolSistema !== "admin") return;

  const tbodyP = document.getElementById("tablaAdminParticipantesBody");
  const filtroTexto = document.getElementById("buscarAdminParticipante")?.value.trim().toLowerCase() || "";

  if (tbodyP) {
    tbodyP.innerHTML = "";
    const filtrados = participantes.filter(p => {
      return (
        (p.cedula || "").toLowerCase().includes(filtroTexto) ||
        (p.nombre || "").toLowerCase().includes(filtroTexto) ||
        (p.correo || "").toLowerCase().includes(filtroTexto) ||
        (p.carrera || "").toLowerCase().includes(filtroTexto) ||
        (p.evento || "").toLowerCase().includes(filtroTexto)
      );
    });

    filtrados.forEach(p => {
      const estatusActual = p.estatusPonencia || "En Revisión";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="ps-3 fw-bold">${p.cedula}</td>
        <td>
          <div class="fw-semibold">${p.nombre}</div>
          <div class="small text-muted"><i class="fa-regular fa-envelope me-1"></i>${p.correo || "-"}</div>
          <div class="small text-muted"><i class="fa-solid fa-phone me-1"></i>${p.telefono || "-"}</div>
        </td>
        <td style="max-width: 210px;">
          <div class="fw-semibold text-primary-unermb">${p.carrera || "General"}</div>
          <div class="small text-muted text-truncate" title="${p.linea || 'General'}">${p.linea || "General"}</div>
        </td>
        <td>
          <span class="badge badge-sede mb-1">${p.sede || "General"}</span>
          <div class="small text-muted">${p.rol}</div>
        </td>
        <td style="max-width: 230px;">
          <div class="fw-semibold text-truncate" title="${p.evento}">${p.evento}</div>
          <div class="small text-muted text-truncate" title="${p.resumen || 'Sin resumen'}">${p.resumen || "Asistencia / Sin resumen"}</div>
        </td>
        <td class="small text-muted" style="max-width: 140px;">${formatearFechaRegistro(p.fechaCreacion)}</td>
        <td>
          <select class="form-select form-select-sm select-estatus-admin" data-id="${p.cedulaId}">
            <option value="En Revisión" ${estatusActual === "En Revisión" ? "selected" : ""}>En Revisión</option>
            <option value="Aprobada" ${estatusActual === "Aprobada" ? "selected" : ""}>Aprobada</option>
            <option value="Rechazada" ${estatusActual === "Rechazada" ? "selected" : ""}>Rechazada</option>
          </select>
        </td>
        <td class="text-end pe-3">
          <button class="btn btn-sm btn-success btn-descargar-admin" data-id="${p.cedulaId}">
            <i class="fa-solid fa-file-pdf me-1"></i>PDF + QR
          </button>
        </td>
      `;
      tbodyP.appendChild(tr);
    });

    document.querySelectorAll(".select-estatus-admin").forEach(sel => {
      sel.addEventListener("change", async () => {
        const id = sel.getAttribute("data-id");
        await coleccionParticipantes.doc(id).update({
          estatusPonencia: sel.value
        });
      });
    });

    document.querySelectorAll(".btn-descargar-admin").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const part = participantes.find(p => p.cedulaId === id);
        if (part) generarCertificadoPDF(part);
      });
    });
  }

  const tbodyArch = document.getElementById("tablaHistorialArchivadosBody");
  const badgeArch = document.getElementById("badgeTotalArchivados");
  const archivados = eventosCronograma.filter(e => e.estado === "archivado");

  if (badgeArch) badgeArch.innerText = `${archivados.length} archivados`;

  if (tbodyArch) {
    tbodyArch.innerHTML = "";
    if (archivados.length === 0) {
      tbodyArch.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">No hay actividades archivadas en el historial.</td></tr>`;
    } else {
      archivados.forEach(ev => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="ps-3 fw-semibold">${ev.titulo}</td>
          <td>${ev.ponente}</td>
          <td><span class="badge bg-secondary">${ev.lugar}</span></td>
          <td class="small text-muted">${formatearFechaRegistro(ev.fechaArchivado)}</td>
          <td class="text-end pe-3">
            <button class="btn btn-sm btn-outline-primary me-1 btn-restaurar-evento" data-id="${ev.idDoc}">
              <i class="fa-solid fa-rotate-left me-1"></i>Restaurar al Cronograma
            </button>
            <button class="btn btn-sm btn-outline-danger btn-eliminar-definitivo" data-id="${ev.idDoc}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        `;
        tbodyArch.appendChild(tr);
      });

      document.querySelectorAll(".btn-restaurar-evento").forEach(btn => {
        btn.addEventListener("click", async () => {
          const idDoc = btn.getAttribute("data-id");
          await coleccionEventos.doc(idDoc).update({
            estado: "activo",
            fechaArchivado: null
          });
        });
      });

      document.querySelectorAll(".btn-eliminar-definitivo").forEach(btn => {
        btn.addEventListener("click", async () => {
          const idDoc = btn.getAttribute("data-id");
          await coleccionEventos.doc(idDoc).delete();
        });
      });
    }
  }
}

// =========================================================================
// GENERACIÓN DE CERTIFICADO PDF CON CÓDIGO QR INTEGRADO
// =========================================================================
function generarCertificadoPDF(participante) {
  if (!participante) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const fechaTexto = formatearFechaRegistro(participante.fechaCreacion);

  doc.setDrawColor(13, 59, 102);
  doc.setLineWidth(3);
  doc.rect(10, 10, 277, 190);

  doc.setDrawColor(244, 211, 94);
  doc.setLineWidth(1);
  doc.rect(13, 13, 271, 184);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(13, 59, 102);
  doc.text("UNIVERSIDAD NACIONAL EXPERIMENTAL RAFAEL MARÍA BARALT", 148, 30, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text("VICERRECTORADO ACADÉMICO - COORDINACIÓN GENERAL DE INVESTIGACIÓN", 148, 38, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(13, 59, 102);
  doc.text("CERTIFICADO DE PARTICIPACIÓN", 148, 56, { align: "center" });

  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text("Se otorga el presente certificado a:", 148, 68, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.text(participante.nombre.toUpperCase(), 148, 82, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`Cédula de Identidad: ${participante.cedula} | Sede: ${participante.sede || "UNERMB"}`, 148, 90, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Por su destacada participación como ${participante.rol} en:`, 148, 104, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(13, 59, 102);
  const lineasEvento = doc.splitTextToSize(`"${participante.evento}"`, 210);
  doc.text(lineasEvento, 148, 114, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(70, 70, 70);
  doc.text(`Fecha y hora de registro: ${fechaTexto}`, 148, 134, { align: "center" });

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Código Único de Verificación: ${participante.codigo}`, 148, 142, { align: "center" });

  if (window.QRious) {
    const qr = new QRious({
      value: `UNERMB-2026 | CERTIFICADO VALIDO | CEDULA: ${participante.cedula} | NOMBRE: ${participante.nombre} | CODIGO: ${participante.codigo} | FECHA: ${participante.fechaCreacion}`,
      size: 160,
      level: "M"
    });
    const qrDataUrl = qr.toDataURL("image/png");
    doc.addImage(qrDataUrl, "PNG", 242, 148, 30, 30);
    doc.setFontSize(7);
    doc.text("Escanea para verificar", 257, 181, { align: "center" });
  }

  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.5);
  doc.line(55, 172, 115, 172);
  doc.line(165, 172, 225, 172);

  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.text("Comité Organizador UNERMB", 85, 178, { align: "center" });
  doc.text("Secretaría Académica", 195, 178, { align: "center" });

  doc.save(`Certificado_${participante.cedula}.pdf`);
}

// =========================================================================
// EXPORTACIÓN DE BASE DE DATOS A EXCEL (CSV)
// =========================================================================
function exportarBaseDatosCSV() {
  if (participantes.length === 0) {
    alert("No hay participantes registrados para exportar.");
    return;
  }

  const encabezados = ["Cedula", "Nombre", "Correo", "Telefono", "Rol", "Carrera", "Linea_Investigacion", "Sede", "Evento_Ponencia", "Estatus", "Codigo", "Fecha_Registro"];
  const filas = participantes.map(p => [
    `"${p.cedula || ""}"`,
    `"${(p.nombre || "").replace(/"/g, '""')}"`,
    `"${p.correo || ""}"`,
    `"${p.telefono || ""}"`,
    `"${p.rol || ""}"`,
    `"${p.carrera || ""}"`,
    `"${p.linea || ""}"`,
    `"${p.sede || ""}"`,
    `"${(p.evento || "").replace(/"/g, '""')}"`,
    `"${p.estatusPonencia || "En Revisión"}"`,
    `"${p.codigo || ""}"`,
    `"${formatearFechaRegistro(p.fechaCreacion)}"`
  ]);

  const contenidoCSV = "\uFEFF" + [encabezados.join(";"), ...filas.map(f => f.join(";"))].join("\n");
  const blob = new Blob([contenidoCSV], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Reporte_Inscritos_UNERMB_2026.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// =========================================================================
// INICIALIZACIÓN DE EVENTOS DEL DOM
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
  inyectarEstilosAnimacion();
  inicializarTema();
  configurarValidacionesInputs();
  configurarSelectorCarreraYLinea("carrera", "linea");
  configurarSelectorCarreraYLinea("tesisCarrera", "tesisLinea");
  iniciarSincronizacionNube();
  renderizarVistaSesion();

  document.querySelectorAll("[data-tab-target]").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      cambiarPestana(el.getAttribute("data-tab-target"));
    });
  });

  document.querySelectorAll("[data-go-tab]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      cambiarPestana(btn.getAttribute("data-go-tab"));
    });
  });

  const textareaResumen = document.getElementById("resumen");
  const contadorPalabras = document.getElementById("contadorPalabras");
  if (textareaResumen && contadorPalabras) {
    textareaResumen.addEventListener("input", () => {
      const texto = textareaResumen.value.trim();
      contadorPalabras.innerText = texto ? texto.split(/\s+/).length : 0;
    });
  }

  // 1. LOGIN DE PARTICIPANTES Y ADMINISTRADOR
  const formLogin = document.getElementById("formLogin");
  if (formLogin) {
    formLogin.addEventListener("submit", async e => {
      e.preventDefault();
      const usuarioInput = document.getElementById("loginUsuario").value.trim().toLowerCase();
      const claveInput = document.getElementById("loginClave").value.trim();
      const alertErr = document.getElementById("alertErrorLogin");

      alertErr?.classList.add("d-none");

      if (usuarioInput === ADMIN_EMAIL && claveInput === ADMIN_PASS) {
        guardarSesion({ rolSistema: "admin" });
        formLogin.reset();
        cambiarPestana("admin");
        return;
      }

      const claveSoloNumeros = claveInput.replace(/[^0-9]/g, "");
      let encontrado = participantes.find(
        p => (p.correo || "").toLowerCase() === usuarioInput && p.cedulaId === claveSoloNumeros
      );

      if (!encontrado && claveSoloNumeros) {
        try {
          const docSnap = await coleccionParticipantes.doc(claveSoloNumeros).get();
          if (docSnap.exists) {
            const data = docSnap.data();
            if ((data.correo || "").toLowerCase() === usuarioInput) {
              encontrado = data;
            }
          }
        } catch (err) {
          console.error(err);
        }
      }

      if (encontrado) {
        guardarSesion({ rolSistema: "participante", cedulaId: encontrado.cedulaId });
        formLogin.reset();
        cambiarPestana("acceso");
      } else {
        alertErr?.classList.remove("d-none");
      }
    });
  }

  // Botones Cerrar Sesión
  document.querySelectorAll(".btn-cerrar-sesion").forEach(btn => {
    btn.addEventListener("click", () => {
      guardarSesion(null);
      cambiarPestana("acceso");
    });
  });

  // 2. REGISTRO DE PONENTE (CON CARRERA Y LÍNEA DE INVESTIGACIÓN RELACIONADA)
  const formPonente = document.getElementById("formPonente");
  if (formPonente) {
    formPonente.addEventListener("submit", async e => {
      e.preventDefault();

      const btnSubmit = formPonente.querySelector('button[type="submit"]');
      const alertSuccess = document.getElementById("alertSuccess");
      const alertError = document.getElementById("alertErrorCedula");
      const msgError = document.getElementById("msgErrorCedula");

      alertSuccess?.classList.add("d-none");
      alertError?.classList.add("d-none");

      const nombre = document.getElementById("nombre").value.trim();
      const tipoCedula = document.getElementById("tipoCedula").value;
      const numeroCedula = document.getElementById("cedula").value.trim().replace(/[^0-9]/g, "");
      const cedulaFormateada = `${tipoCedula}-${numeroCedula}`;
      const cedulaDocId = numeroCedula;

      const correo = document.getElementById("correo").value.trim().toLowerCase();
      const telefonoLimpio = document.getElementById("telefono").value.trim().replace(/[^0-9]/g, "");

      const rol = document.getElementById("rol").value;
      const sede = document.getElementById("sede").value;
      const carrera = document.getElementById("carrera").value;
      const linea = document.getElementById("linea").value;
      const titulo = document.getElementById("titulo").value.trim();
      const resumen = document.getElementById("resumen").value.trim();
      const publicarEnCronograma = document.getElementById("agregarAlCronograma").checked;

      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(nombre) || nombre.length < 3) {
        msgError.innerHTML = "<strong>Formato inválido:</strong> El nombre solo debe contener letras.";
        alertError.classList.remove("d-none");
        return;
      }

      if (numeroCedula.length < 6 || numeroCedula.length > 9) {
        msgError.innerHTML = "<strong>Cédula inválida:</strong> Ingresa un número de cédula válido (6 a 9 dígitos).";
        alertError.classList.remove("d-none");
        return;
      }

      if (telefonoLimpio.length < 10 || telefonoLimpio.length > 11) {
        msgError.innerHTML = "<strong>Teléfono inválido:</strong> Ingresa un número telefónico válido (10 a 11 dígitos).";
        alertError.classList.remove("d-none");
        return;
      }

      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Validando disponibilidad...';
      }

      try {
        const docRef = coleccionParticipantes.doc(cedulaDocId);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          msgError.innerHTML = "<strong>Dato en uso:</strong> La cédula de identidad ingresada ya se encuentra registrada. Por favor, verifícala.";
          alertError.classList.remove("d-none");
          return;
        }

        const consultaCorreo = await coleccionParticipantes.where("correo", "==", correo).get();
        if (!consultaCorreo.empty) {
          msgError.innerHTML = "<strong>Dato en uso:</strong> El correo electrónico ingresado ya se encuentra registrado. Por favor, verifícalo.";
          alertError.classList.remove("d-none");
          return;
        }

        const consultaTelefono = await coleccionParticipantes.where("telefonoLimpio", "==", telefonoLimpio).get();
        if (!consultaTelefono.empty) {
          msgError.innerHTML = "<strong>Dato en uso:</strong> El número telefónico ingresado ya se encuentra registrado. Por favor, verifícalo.";
          alertError.classList.remove("d-none");
          return;
        }

        const codigoGenerado = "UNERMB-2026-" + Math.floor(1000 + Math.random() * 9000);
        const fechaExactaRegistro = new Date().toISOString();

        const nuevoParticipante = {
          cedula: cedulaFormateada,
          cedulaId: cedulaDocId,
          tipoNacionalidad: tipoCedula,
          correo: correo,
          telefono: telefonoLimpio,
          telefonoLimpio: telefonoLimpio,
          nombre,
          evento: `Ponencia: ${titulo}`,
          rol: rol || "Ponente",
          sede,
          carrera,
          linea,
          resumen,
          estatusPonencia: "En Revisión",
          codigo: codigoGenerado,
          fechaCreacion: fechaExactaRegistro
        };

        await docRef.set(nuevoParticipante);

        if (publicarEnCronograma) {
          const idEv = "ev_" + Date.now();
          await coleccionEventos.doc(idEv).set({
            idDoc: idEv,
            sede,
            lugar: `${sede} - Sala de Ponencias`,
            horario: "Horario por asignar",
            titulo,
            ponente: nombre,
            tipo: carrera,
            estado: "activo",
            fechaArchivado: null
          });
        }

        const msgCodigo = document.getElementById("msgCodigoRegistrado");
        if (msgCodigo) {
          msgCodigo.innerText = `Participante: ${nombre} (${cedulaFormateada}) | Estatus: En Revisión | Usuario: ${correo} | Clave: ${cedulaDocId}`;
        }
        alertSuccess?.classList.remove("d-none");

        const btnIrCuenta = document.getElementById("btnIrAMiCuentaRecienCreado");
        if (btnIrCuenta) {
          btnIrCuenta.onclick = () => {
            guardarSesion({ rolSistema: "participante", cedulaId: cedulaDocId });
            cambiarPestana("acceso");
          };
        }

        formPonente.reset();
        const selectLinea = document.getElementById("linea");
        if (selectLinea) {
          selectLinea.disabled = true;
          selectLinea.innerHTML = '<option value="" selected disabled>Primero seleccione una carrera...</option>';
        }
        if (contadorPalabras) contadorPalabras.innerText = "0";
      } catch (err) {
        console.error("Error al guardar en Firebase:", err);
        msgError.innerText = "Error de conexión con la base de datos. Intenta nuevamente.";
        alertError.classList.remove("d-none");
      } finally {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = '<i class="fa-solid fa-paper-plane me-2"></i>Enviar Postulación';
        }
      }
    });
  }

  // Botón Limpiar también reinicia el menú dependiente
  document.getElementById("btnLimpiarFormPonente")?.addEventListener("click", () => {
    const selectLinea = document.getElementById("linea");
    if (selectLinea) {
      selectLinea.disabled = true;
      selectLinea.innerHTML = '<option value="" selected disabled>Primero seleccione una carrera...</option>';
    }
    if (contadorPalabras) contadorPalabras.innerText = "0";
  });

  // 3. CRONOGRAMA E INSCRIPCIÓN DE ASISTENTE
  document.getElementById("filtroSede")?.addEventListener("change", renderizarCronograma);
  document.getElementById("buscarEvento")?.addEventListener("input", renderizarCronograma);

  const formInscribirAsistente = document.getElementById("formInscribirAsistente");
  if (formInscribirAsistente) {
    formInscribirAsistente.addEventListener("submit", async e => {
      e.preventDefault();
      const alertErrModal = document.getElementById("alertErrorAsistente");
      const msgErrModal = document.getElementById("msgErrorAsistente");
      alertErrModal?.classList.add("d-none");

      const nombre = document.getElementById("asistenteNombre").value.trim();
      const tipoCedula = document.getElementById("asistenteTipoCedula").value;
      const numeroCedula = document.getElementById("asistenteCedula").value.trim().replace(/[^0-9]/g, "");
      const cedulaFormateada = `${tipoCedula}-${numeroCedula}`;
      const cedulaDocId = numeroCedula;

      const correo = document.getElementById("asistenteCorreo").value.trim().toLowerCase();
      const telefonoLimpio = document.getElementById("asistenteTelefono").value.trim().replace(/[^0-9]/g, "");
      const rol = document.getElementById("asistenteRol").value;
      const tituloEvento = document.getElementById("eventoInscribirTitulo").value;
      const sedeEvento = document.getElementById("eventoInscribirSede").value;

      if (numeroCedula.length < 6 || numeroCedula.length > 9) {
        msgErrModal.innerHTML = "<strong>Cédula inválida:</strong> Ingresa entre 6 y 9 dígitos.";
        alertErrModal.classList.remove("d-none");
        return;
      }

      try {
        const docRef = coleccionParticipantes.doc(cedulaDocId);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          msgErrModal.innerHTML = "<strong>Dato en uso:</strong> La cédula ingresada ya se encuentra registrada.";
          alertErrModal.classList.remove("d-none");
          return;
        }

        const consultaCorreo = await coleccionParticipantes.where("correo", "==", correo).get();
        if (!consultaCorreo.empty) {
          msgErrModal.innerHTML = "<strong>Dato en uso:</strong> El correo electrónico ingresado ya está registrado. Por favor, verifícalo.";
          alertErrModal.classList.remove("d-none");
          return;
        }

        const consultaTel = await coleccionParticipantes.where("telefonoLimpio", "==", telefonoLimpio).get();
        if (!consultaTel.empty) {
          msgErrModal.innerHTML = "<strong>Dato en uso:</strong> El número telefónico ingresado ya está registrado. Por favor, verifícalo.";
          alertErrModal.classList.remove("d-none");
          return;
        }

        const codigoGenerado = "UNERMB-2026-" + Math.floor(1000 + Math.random() * 9000);
        const nuevoAsistente = {
          cedula: cedulaFormateada,
          cedulaId: cedulaDocId,
          tipoNacionalidad: tipoCedula,
          correo,
          telefono: telefonoLimpio,
          telefonoLimpio,
          nombre,
          evento: tituloEvento,
          rol,
          sede: sedeEvento,
          carrera: "Asistencia General",
          linea: "Actividad Académica",
          estatusPonencia: "En Revisión",
          codigo: codigoGenerado,
          fechaCreacion: new Date().toISOString()
        };

        await docRef.set(nuevoAsistente);

        const modalEl = document.getElementById("modalInscribirEvento");
        bootstrap.Modal.getInstance(modalEl)?.hide();
        formInscribirAsistente.reset();

        guardarSesion({ rolSistema: "participante", cedulaId: cedulaDocId });
        cambiarPestana("acceso");
      } catch (err) {
        console.error("Error al registrar asistente:", err);
      }
    });
  }

  // 4. STANDS EXPOFERIA
  document.querySelectorAll(".filtro-stand").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filtro-stand").forEach(b => {
        b.classList.remove("btn-warning", "fw-semibold", "active");
        b.classList.add("btn-outline-secondary");
      });
      btn.classList.remove("btn-outline-secondary");
      btn.classList.add("btn-warning", "fw-semibold", "active");
      renderizarStands(btn.getAttribute("data-cat"));
    });
  });

  const formNuevoStand = document.getElementById("formNuevoStand");
  if (formNuevoStand) {
    formNuevoStand.addEventListener("submit", async e => {
      e.preventDefault();
      const idSt = "st_" + Date.now();
      await coleccionStands.doc(idSt).set({
        idDoc: idSt,
        titulo: document.getElementById("standTitulo").value.trim(),
        categoria: document.getElementById("standCategoria").value,
        sede: document.getElementById("standSede").value,
        equipo: document.getElementById("standEquipo").value.trim(),
        descripcion: document.getElementById("standDesc").value.trim(),
        votos: 1
      });
      const modalEl = document.getElementById("modalNuevoStand");
      bootstrap.Modal.getInstance(modalEl)?.hide();
      formNuevoStand.reset();
    });
  }

  // 5. REPOSITORIO DE TESIS
  document.getElementById("buscarTesis")?.addEventListener("input", renderizarRepositorioTesis);
  document.getElementById("filtroCarreraTesis")?.addEventListener("change", renderizarRepositorioTesis);
  document.getElementById("filtroAnioTesis")?.addEventListener("change", renderizarRepositorioTesis);

  const formNuevaTesis = document.getElementById("formNuevaTesis");
  if (formNuevaTesis) {
    formNuevaTesis.addEventListener("submit", async e => {
      e.preventDefault();
      const idTesis = "tesis_" + Date.now();
      await coleccionTesis.doc(idTesis).set({
        idDoc: idTesis,
        titulo: document.getElementById("tesisTitulo").value.trim(),
        autores: document.getElementById("tesisAutores").value.trim(),
        tutor: document.getElementById("tesisTutor").value.trim(),
        carrera: document.getElementById("tesisCarrera").value,
        linea: document.getElementById("tesisLinea").value,
        anio: document.getElementById("tesisAnio").value,
        enlace: document.getElementById("tesisEnlace").value.trim(),
        resumen: document.getElementById("tesisResumen").value.trim()
      });
      const modalEl = document.getElementById("modalNuevaTesis");
      bootstrap.Modal.getInstance(modalEl)?.hide();
      formNuevaTesis.reset();
      const selectTesisLinea = document.getElementById("tesisLinea");
      if (selectTesisLinea) {
        selectTesisLinea.disabled = true;
        selectTesisLinea.innerHTML = '<option value="" selected disabled>Primero elija carrera...</option>';
      }
    });
  }

  // 6. NOTICIAS Y PANEL ADMIN
  const formNuevaNoticia = document.getElementById("formNuevaNoticia");
  if (formNuevaNoticia) {
    formNuevaNoticia.addEventListener("submit", async e => {
      e.preventDefault();
      const idNot = "not_" + Date.now();
      await coleccionNoticias.doc(idNot).set({
        idDoc: idNot,
        titulo: document.getElementById("noticiaTitulo").value.trim(),
        categoria: document.getElementById("noticiaCategoria").value,
        contenido: document.getElementById("noticiaContenido").value.trim(),
        fecha: new Date().toISOString()
      });
      const modalEl = document.getElementById("modalNuevaNoticia");
      bootstrap.Modal.getInstance(modalEl)?.hide();
      formNuevaNoticia.reset();
    });
  }

  document.getElementById("buscarAdminParticipante")?.addEventListener("input", renderizarPanelAdmin);
  document.getElementById("btnExportarCSV")?.addEventListener("click", exportarBaseDatosCSV);
});