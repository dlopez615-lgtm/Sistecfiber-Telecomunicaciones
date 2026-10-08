
 // ======================================================
 // CONFIGURACIÓN DE SUPABASE
 // ======================================================

const SUPABASE_URL = "https://pmbcvhkyfoppvyrnuztn.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_yrZYYb4J2qqZmKTq05T35Q_2DBWRDMY";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// ======================================================
// VARIABLES
// ======================================================

let clientes = [];
let clienteEditando = null;
let clienteEliminar = null;


// ======================================================
// ELEMENTOS DE ACCESO
// ======================================================

const pantallaAcceso = document.getElementById("pantallaAcceso");
const aplicacion = document.getElementById("aplicacion");
const formLogin = document.getElementById("formLogin");
const accesoCorreo = document.getElementById("accesoCorreo");
const accesoPassword = document.getElementById("accesoPassword");
const btnAcceso = document.getElementById("btnAcceso");
const mensajeAcceso = document.getElementById("mensajeAcceso");
const btnCambiarAcceso = document.getElementById("btnCambiarAcceso");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");
const nombreUsuario = document.getElementById("nombreUsuario");
const avatarUsuario = document.getElementById("avatarUsuario");


// ======================================================
// MODAL CLIENTE
// ======================================================

const modalCliente = document.getElementById("modalCliente");
const formCliente = document.getElementById("formCliente");
const tituloModal = document.getElementById("tituloModal");
const cerrarModal = document.getElementById("cerrarModal");
const cancelarCliente = document.getElementById("cancelarCliente");
const btnNuevoCliente = document.getElementById("btnNuevoCliente");


// ======================================================
// CAMPOS DEL CLIENTE
// ======================================================

const nombre = document.getElementById("nombre");
const cedula = document.getElementById("cedula");
const telefono = document.getElementById("telefono");
const correo = document.getElementById("correo");
const direccion = document.getElementById("direccion");
const mac = document.getElementById("mac");
const cto = document.getElementById("cto");
const puerto = document.getElementById("puerto");
const plan = document.getElementById("plan");
const precio = document.getElementById("precio");
const fecha = document.getElementById("fecha");
const estado = document.getElementById("estado");


// ======================================================
// ARCHIVOS
// ======================================================

const cedulaArchivo = document.getElementById("cedulaArchivo");
const contrato = document.getElementById("contrato");
const reciboPublico = document.getElementById("reciboPublico");


// ======================================================
// ESPACIOS DE ARCHIVOS
// ======================================================

const detalleCedula = document.getElementById("detalleCedula");
const detalleContrato = document.getElementById("detalleContrato");
const detalleRecibo = document.getElementById("detalleRecibo");


// ======================================================
// CLIENTES
// ======================================================

const listaClientes = document.getElementById("listaClientes");
const buscarCliente = document.getElementById("buscarCliente");


// ======================================================
// DATOS
// ======================================================

const listaDatos = document.getElementById("listaDatos");
const buscarDatos = document.getElementById("buscarDatos");


// ======================================================
// MODAL ELIMINAR
// ======================================================

const modalEliminar = document.getElementById("modalEliminar");
const nombreEliminar = document.getElementById("nombreEliminar");
const cancelarEliminar = document.getElementById("cancelarEliminar");
const confirmarEliminar = document.getElementById("confirmarEliminar");


// ======================================================
// MODAL VER CLIENTE
// ======================================================

const modalVerCliente = document.getElementById("modalVerCliente");
const cerrarVerCliente = document.getElementById("cerrarVerCliente");
const verNombre = document.getElementById("verNombre");
const verTelefono = document.getElementById("verTelefono");
const verCedula = document.getElementById("verCedula");
const verCorreo = document.getElementById("verCorreo");
const verDireccion = document.getElementById("verDireccion");
const verMac = document.getElementById("verMac");
const verCto = document.getElementById("verCto");
const verPuerto = document.getElementById("verPuerto");
const verPlan = document.getElementById("verPlan");
const verPrecio = document.getElementById("verPrecio");
const verEstado = document.getElementById("verEstado");
const verFecha = document.getElementById("verFecha");
const verCedulaArchivo = document.getElementById("verCedulaArchivo");
const verContrato = document.getElementById("verContrato");
const verReciboPublico = document.getElementById("verReciboPublico");


// ======================================================
// ESTADÍSTICAS
// ======================================================

const totalClientes = document.getElementById("totalClientes");
const clientesActivos = document.getElementById("clientesActivos");
const ingresosMes = document.getElementById("ingresosMes");
const pagosPendientes = document.getElementById("pagosPendientes");


// ======================================================
// NAVEGACIÓN
// ======================================================

const botonesMenu = document.querySelectorAll(".menu-item");

const seccionesMenu = {
    inicio: document.getElementById("seccionInicio"),
    clientes: document.getElementById("seccionClientes"),
    pagos: document.getElementById("seccionPagos"),
    datos: document.getElementById("seccionDatos"),
    equipos: document.getElementById("seccionEquipos"),
    soporte: document.getElementById("seccionSoporte")
};


// ======================================================
// OBTENER ÚLTIMA SECCIÓN GUARDADA
// ======================================================

function obtenerSeccionGuardada() {
    try {
        const guardada = localStorage.getItem("sistecfiber_seccion");

        if (
            guardada &&
            Object.prototype.hasOwnProperty.call(seccionesMenu, guardada) &&
            seccionesMenu[guardada]
        ) {
            return guardada;
        }
    } catch (error) {
        console.warn("No se pudo recuperar la sección guardada.", error);
    }

    return "inicio";
}


// ======================================================
// MOSTRAR SECCIÓN
// ======================================================

function mostrarSeccion(nombreSeccion) {

    if (
        !Object.prototype.hasOwnProperty.call(
            seccionesMenu,
            nombreSeccion
        ) ||
        !seccionesMenu[nombreSeccion]
    ) {
        nombreSeccion = "inicio";
    }

    Object.values(seccionesMenu).forEach(function (seccion) {
        if (!seccion) return;

        seccion.style.display = "none";
        seccion.classList.remove("mostrar");
    });

    botonesMenu.forEach(function (boton) {
        boton.classList.remove("activo");
        boton.classList.remove("seleccionado");
    });

    const seccion = seccionesMenu[nombreSeccion];

    if (!seccion) return;

    seccion.style.display = "block";
    seccion.classList.add("mostrar");

    const botonActivo = document.querySelector(
        '.menu-item[data-seccion="' + nombreSeccion + '"]'
    );

    if (botonActivo) {
        botonActivo.classList.add("activo");
        botonActivo.classList.add("seleccionado");
    }

    // Guardar la sección seleccionada para la próxima recarga
    try {
        localStorage.setItem("sistecfiber_seccion", nombreSeccion);
    } catch (error) {
        console.warn("No se pudo guardar la sección.", error);
    }

    if (nombreSeccion === "inicio") {
        actualizarEstadisticas();
    }

    if (nombreSeccion === "clientes") {
        mostrarClientes(clientes);
    }

    if (nombreSeccion === "datos") {
        mostrarDatos();
    }
}


// ======================================================
// EVENTOS DEL MENÚ
// ======================================================

botonesMenu.forEach(function (boton) {
    boton.addEventListener("click", function (event) {
        event.preventDefault();

        const seccion = this.dataset.seccion;

        mostrarSeccion(seccion);
    });
});


// ======================================================
// MOSTRAR APLICACIÓN
// ======================================================

function mostrarAplicacion() {
    if (pantallaAcceso) {
        pantallaAcceso.style.display = "none";
    }

    if (aplicacion) {
        aplicacion.style.display = "flex";
    }
}


// ======================================================
// MOSTRAR LOGIN
// ======================================================

function mostrarLogin() {
    if (pantallaAcceso) {
        pantallaAcceso.style.display = "flex";
    }

    if (aplicacion) {
        aplicacion.style.display = "none";
    }
}


// ======================================================
// MENSAJE LOGIN
// ======================================================

function mostrarMensajeAcceso(mensaje, tipo) {
    if (!mensajeAcceso) return;

    mensajeAcceso.textContent = mensaje;
    mensajeAcceso.className = "mensaje-acceso " + (tipo || "");
}


// ======================================================
// REGISTRO
// ======================================================

let modoRegistro = false;

function crearCampoNombreRegistro() {
    let campoNombre = document.getElementById("nombreRegistro");

    if (campoNombre) return campoNombre;

    const contenedor = document.createElement("div");
    contenedor.id = "contenedorNombreRegistro";
    contenedor.style.marginBottom = "12px";

    campoNombre = document.createElement("input");
    campoNombre.type = "text";
    campoNombre.id = "nombreRegistro";
    campoNombre.name = "nombreRegistro";
    campoNombre.placeholder = "Nombre completo";
    campoNombre.style.width = "100%";
    campoNombre.style.boxSizing = "border-box";

    if (accesoCorreo && accesoCorreo.parentNode) {
        accesoCorreo.parentNode.insertBefore(contenedor, accesoCorreo);
        contenedor.appendChild(campoNombre);
    }

    return campoNombre;
}

function eliminarCampoNombreRegistro() {
    const contenedor = document.getElementById("contenedorNombreRegistro");

    if (contenedor) {
        contenedor.remove();
    }
}

if (btnCambiarAcceso) {
    btnCambiarAcceso.addEventListener("click", function () {
        modoRegistro = !modoRegistro;

        const titulo = document.getElementById("tituloAcceso");
        const texto = document.getElementById("textoAcceso");

        if (modoRegistro) {
            if (titulo) titulo.textContent = "Crear cuenta";
            if (texto) texto.textContent = "Crea tu cuenta para ingresar al panel";

            btnAcceso.textContent = "Crear cuenta";
            btnCambiarAcceso.textContent = "Ya tengo una cuenta";

            crearCampoNombreRegistro();
        } else {
            if (titulo) titulo.textContent = "Sistecfiber";
            if (texto) texto.textContent = "Inicia sesión para ingresar al panel";

            btnAcceso.textContent = "Iniciar sesión";
            btnCambiarAcceso.textContent = "Crear una cuenta";

            eliminarCampoNombreRegistro();
        }

        mostrarMensajeAcceso("");
    });
}


// ======================================================
// LOGIN
// ======================================================

if (formLogin) {
    formLogin.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = accesoCorreo.value.trim();
        const password = accesoPassword.value;

        if (!email || !password) {
            mostrarMensajeAcceso("Completa todos los campos.", "error");
            return;
        }

        btnAcceso.disabled = true;

        try {
            if (modoRegistro) {
                const campoNombre = document.getElementById("nombreRegistro");
                const nombrePersona = campoNombre ? campoNombre.value.trim() : "";

                if (!nombrePersona) {
                    mostrarMensajeAcceso("Escribe tu nombre completo.", "error");
                    btnAcceso.disabled = false;
                    return;
                }

                const resultado = await supabaseClient.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            nombre: nombrePersona
                        }
                    }
                });

                if (resultado.error) {
                    throw resultado.error;
                }

                mostrarMensajeAcceso("Cuenta creada correctamente.", "exito");
                return;
            }

            mostrarMensajeAcceso("Iniciando sesión...");

            const resultado = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (resultado.error) {
                throw resultado.error;
            }

            mostrarMensajeAcceso("Sesión iniciada correctamente.", "exito");

        } catch (error) {
            console.error(error);

            mostrarMensajeAcceso(
                error.message || "No se pudo iniciar sesión.",
                "error"
            );
        }

        btnAcceso.disabled = false;
    });
}


// ======================================================
// CERRAR SESIÓN
// ======================================================

if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", async function () {
        await supabaseClient.auth.signOut();

        clientes = [];

        try {
            localStorage.removeItem("sistecfiber_seccion");
        } catch (error) {
            console.warn(error);
        }

        mostrarLogin();
    });
}


// ======================================================
// SESIÓN
// ======================================================

supabaseClient.auth.onAuthStateChange(async function (event, session) {

    if (session) {
        mostrarAplicacion();

        actualizarUsuario(session.user);

        await cargarClientes();

        // Recuperar la última sección después de iniciar sesión
        mostrarSeccion(obtenerSeccionGuardada());

    } else {
        mostrarLogin();
    }
});


// ======================================================
// USUARIO
// ======================================================

function actualizarUsuario(usuario) {
    if (!usuario) return;

    const nombrePersona = usuario.user_metadata?.nombre || "Administrador";

    if (nombreUsuario) {
        nombreUsuario.textContent = nombrePersona;
    }

    if (avatarUsuario) {
        avatarUsuario.textContent = nombrePersona.charAt(0).toUpperCase();
    }
}


// ======================================================
// COMPROBAR SESIÓN
// ======================================================

async function comprobarSesion() {
    const resultado = await supabaseClient.auth.getSession();

    if (resultado.error || !resultado.data.session) {
        mostrarLogin();
        return;
    }

    mostrarAplicacion();

    actualizarUsuario(resultado.data.session.user);

    await cargarClientes();

    // Recuperar la sección guardada en lugar de regresar siempre a Inicio
    mostrarSeccion(obtenerSeccionGuardada());
}


// ======================================================
// CARGAR CLIENTES
// ======================================================

async function cargarClientes() {
    if (!listaClientes) return;

    listaClientes.innerHTML = "<p>Cargando clientes...</p>";

    const resultado = await supabaseClient
        .from("Clientes")
        .select("*")
        .order("id", { ascending: false });

    if (resultado.error) {
        console.error(resultado.error);

        listaClientes.innerHTML = "<p>No se pudieron cargar los clientes.</p>";
        return;
    }

    clientes = resultado.data || [];

    mostrarClientes(clientes);
    mostrarDatos();
    actualizarEstadisticas();
}


// ======================================================
// MOSTRAR CLIENTES
// ======================================================

function mostrarClientes(lista) {
    if (!listaClientes) return;

    listaClientes.innerHTML = "";

    if (!lista || lista.length === 0) {
        listaClientes.innerHTML = `
            <div class="menu-extra-vacio">
                <h3>No hay clientes</h3>
                <p>Todavía no has registrado ningún cliente.</p>
            </div>
        `;
        return;
    }

    lista.forEach(function (cliente) {
        const card = document.createElement("div");
        card.className = "cliente-card";

        const estadoCliente = cliente.estado || "Activo";
        const claseEstado = estadoCliente.toLowerCase().replaceAll(" ", "-");

        card.innerHTML = `
            <div class="cliente-top">
                <div>
                    <h3>${escaparHTML(cliente.nombre || "Sin nombre")}</h3>
                    <span class="estado ${claseEstado}">
                        ${escaparHTML(estadoCliente)}
                    </span>
                </div>
            </div>

            <div class="cliente-datos">
                <p>
                    <strong>Teléfono:</strong>
                    ${escaparHTML(cliente.telefono || "No registrado")}
                </p>
                <p>
                    <strong>Dirección:</strong>
                    ${escaparHTML(cliente.direccion || "No registrada")}
                </p>
                <p>
                    <strong>Plan:</strong>
                    ${escaparHTML(cliente.plan || "No registrado")}
                </p>
            </div>

            <div class="cliente-botones">
                <button type="button" class="btn-secondary btn-ver-cliente">Ver</button>
                <button type="button" class="btn-primary btn-editar-cliente">Editar</button>
                <button type="button" class="btn-danger btn-eliminar-cliente">Eliminar</button>
            </div>
        `;

        card.querySelector(".btn-ver-cliente").addEventListener("click", function () {
            abrirModalVerCliente(cliente);
        });

        card.querySelector(".btn-editar-cliente").addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            abrirModalEditar(cliente);
        });

        card.querySelector(".btn-eliminar-cliente").addEventListener("click", function () {
            abrirModalEliminar(cliente);
        });

        listaClientes.appendChild(card);
    });
}


// ======================================================
// MOSTRAR DATOS
// ======================================================

function mostrarDatos() {
    if (!listaDatos) return;

    listaDatos.innerHTML = "";

    const textoBusqueda = buscarDatos
        ? buscarDatos.value.trim().toLowerCase()
        : "";

    const clientesFiltrados = clientes.filter(function (cliente) {
        if (!textoBusqueda) return true;

        return String(cliente.nombre || "")
            .toLowerCase()
            .includes(textoBusqueda);
    });

    if (!clientes || clientes.length === 0) {
        listaDatos.innerHTML = `
            <div class="menu-extra-vacio">
                <h3>No hay clientes</h3>
                <p>Cuando registres clientes, sus documentos aparecerán aquí.</p>
            </div>
        `;
        return;
    }

    if (clientesFiltrados.length === 0) {
        listaDatos.innerHTML = `
            <div class="menu-extra-vacio">
                <h3>No se encontró ningún cliente</h3>
                <p>Prueba buscando con otro nombre.</p>
            </div>
        `;
        return;
    }

    clientesFiltrados.forEach(function (cliente) {
        const tarjeta = document.createElement("div");
        tarjeta.className = "datos-cliente";

        tarjeta.innerHTML = `
            <div class="datos-cliente-cabecera">
                <div class="datos-cliente-icono">👤</div>
                <div class="datos-cliente-nombre">
                    ${escaparHTML(cliente.nombre || "Sin nombre")}
                </div>
            </div>

            <div class="datos-documentos">
                ${crearDocumentoDatos(
                    cliente.cedula_ruta,
                    cliente.cedula_nombre,
                    "🪪",
                    "Cédula"
                )}

                ${crearDocumentoDatos(
                    cliente.contrato_ruta,
                    cliente.contrato_nombre,
                    "📄",
                    "Contrato"
                )}

                ${crearDocumentoDatos(
                    cliente.recibo_ruta,
                    cliente.recibo_nombre,
                    "🧾",
                    "Recibo de servicio público"
                )}
            </div>
        `;

        tarjeta.querySelectorAll(".btn-abrir-dato").forEach(function (boton) {
            boton.addEventListener("click", function () {
                abrirDocumento(boton.dataset.ruta);
            });
        });

        listaDatos.appendChild(tarjeta);
    });
}


// ======================================================
// BUSCADOR DE DATOS
// ======================================================

if (buscarDatos) {
    buscarDatos.addEventListener("input", function () {
        mostrarDatos();
    });
}


// ======================================================
// CREAR DOCUMENTO EN DATOS
// ======================================================

function crearDocumentoDatos(ruta, nombreArchivo, icono, nombreDocumento) {

    if (!ruta) {
        return `
            <div class="datos-documento datos-documento-vacio">
                <div class="datos-documento-info">
                    <span class="datos-documento-icono">${icono}</span>
                    <div>
                        <strong>${escaparHTML(nombreDocumento)}</strong>
                        <span class="datos-no-cargado">No cargado</span>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="datos-documento">
            <div class="datos-documento-info">
                <span class="datos-documento-icono">${icono}</span>
                <div>
                    <strong>${escaparHTML(nombreDocumento)}</strong>
                    <span class="datos-documento-nombre">
                        ${escaparHTML(nombreArchivo || "Documento")}
                    </span>
                </div>
            </div>

            <button
                type="button"
                class="btn-secondary btn-abrir-dato"
                data-ruta="${escaparHTML(ruta)}">
                Abrir
            </button>
        </div>
    `;
}


// ======================================================
// ESCAPAR HTML
// ======================================================

function escaparHTML(texto) {
    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ======================================================
// BUSCAR CLIENTES
// ======================================================

if (buscarCliente) {
    buscarCliente.addEventListener("input", function () {
        const texto = this.value.trim().toLowerCase();

        if (!texto) {
            mostrarClientes(clientes);
            return;
        }

        const filtrados = clientes.filter(function (cliente) {
            return (
                String(cliente.nombre || "").toLowerCase().includes(texto) ||
                String(cliente.identificacion || "").toLowerCase().includes(texto) ||
                String(cliente.telefono || "").toLowerCase().includes(texto) ||
                String(cliente.correo || "").toLowerCase().includes(texto) ||
                String(cliente.cto || "").toLowerCase().includes(texto)
            );
        });

        mostrarClientes(filtrados);
    });
}


// ======================================================
// ABRIR MODAL NUEVO CLIENTE
// ======================================================

if (btnNuevoCliente) {
    btnNuevoCliente.addEventListener("click", abrirModalCliente);
}

function abrirModalCliente() {
    clienteEditando = null;

    tituloModal.textContent = "Nuevo cliente";

    if (formCliente) {
        formCliente.reset();
    }

    limpiarArchivosSeleccionados();

    if (modalCliente) {
        modalCliente.classList.add("activo");
        modalCliente.style.display = "flex";
    }
}


// ======================================================
// ABRIR MODAL EDITAR
// ======================================================

function abrirModalEditar(cliente) {
    clienteEditando = cliente;

    tituloModal.textContent = "Editar cliente";

    nombre.value = cliente.nombre || "";
    cedula.value = cliente.identificacion || "";
    telefono.value = cliente.telefono || "";
    correo.value = cliente.correo || "";
    direccion.value = cliente.direccion || "";
    mac.value = cliente.mac || "";
    cto.value = cliente.cto || "";
    puerto.value = cliente.puerto || "";
    plan.value = cliente.plan || "";
    precio.value = cliente.precio ?? "";
    fecha.value = cliente.fecha || "";
    estado.value = cliente.estado || "Activo";

    if (cedulaArchivo) cedulaArchivo.value = "";
    if (contrato) contrato.value = "";
    if (reciboPublico) reciboPublico.value = "";

    mostrarArchivoActual(
        detalleCedula,
        cliente.cedula_nombre,
        "Cédula actual",
        cliente.cedula_ruta
    );

    mostrarArchivoActual(
        detalleContrato,
        cliente.contrato_nombre,
        "Contrato actual",
        cliente.contrato_ruta
    );

    mostrarArchivoActual(
        detalleRecibo,
        cliente.recibo_nombre,
        "Recibo actual",
        cliente.recibo_ruta
    );

    if (modalCliente) {
        modalCliente.classList.add("activo");
        modalCliente.style.display = "flex";
    }
}


// ======================================================
// MOSTRAR ARCHIVO ACTUAL
// ======================================================

function mostrarArchivoActual(contenedor, nombreArchivo, texto, rutaArchivo) {
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (!nombreArchivo) {
        contenedor.innerHTML = `
            <span class="archivo-vacio">No hay documento cargado.</span>
        `;
        return;
    }

    contenedor.innerHTML = `
        <div class="archivo-actual">
            <div class="archivo-actual-info">
                <span class="archivo-actual-titulo">
                    ✓ ${escaparHTML(texto)}
                </span>
                <span class="archivo-actual-nombre">
                    ${escaparHTML(nombreArchivo)}
                </span>
            </div>

            ${
                rutaArchivo
                    ? `<button type="button" class="btn-secondary btn-abrir-archivo">Abrir</button>`
                    : ""
            }
        </div>
    `;

    const boton = contenedor.querySelector(".btn-abrir-archivo");

    if (boton) {
        boton.addEventListener("click", function () {
            abrirDocumento(rutaArchivo);
        });
    }
}


// ======================================================
// CERRAR MODAL CLIENTE
// ======================================================

function cerrarModalCliente() {
    if (!modalCliente) return;

    modalCliente.classList.remove("activo");
    modalCliente.style.display = "none";

    clienteEditando = null;

    limpiarArchivosSeleccionados();
}

if (cerrarModal) {
    cerrarModal.addEventListener("click", cerrarModalCliente);
}

if (cancelarCliente) {
    cancelarCliente.addEventListener("click", cerrarModalCliente);
}


// ======================================================
// LIMPIAR ARCHIVOS
// ======================================================

function limpiarArchivosSeleccionados() {
    if (detalleCedula) detalleCedula.innerHTML = "";
    if (detalleContrato) detalleContrato.innerHTML = "";
    if (detalleRecibo) detalleRecibo.innerHTML = "";

    if (cedulaArchivo) cedulaArchivo.value = "";
    if (contrato) contrato.value = "";
    if (reciboPublico) reciboPublico.value = "";
}


// ======================================================
// MOSTRAR ARCHIVO SELECCIONADO
// ======================================================

function mostrarArchivoSeleccionado(input, contenedor, tipoArchivo) {
    if (!input || !contenedor) return;

    if (!input.files || input.files.length === 0) return;

    const archivo = input.files[0];

    contenedor.innerHTML = `
        <div class="archivo-seleccionado">
            <span class="archivo-seleccionado-titulo">
                ✓ Nuevo ${escaparHTML(tipoArchivo)} seleccionado
            </span>
            <span class="archivo-seleccionado-nombre">
                ${escaparHTML(archivo.name)}
            </span>
        </div>
    `;

    contenedor.style.display = "block";
}


// ======================================================
// SELECCIONAR CÉDULA
// ======================================================

if (cedulaArchivo) {
    cedulaArchivo.addEventListener("change", function () {
        mostrarArchivoSeleccionado(cedulaArchivo, detalleCedula, "cédula");
    });
}


// ======================================================
// SELECCIONAR CONTRATO
// ======================================================

if (contrato) {
    contrato.addEventListener("change", function () {
        mostrarArchivoSeleccionado(contrato, detalleContrato, "contrato");
    });
}


// ======================================================
// SELECCIONAR RECIBO
// ======================================================

if (reciboPublico) {
    reciboPublico.addEventListener("change", function () {
        mostrarArchivoSeleccionado(reciboPublico, detalleRecibo, "recibo");
    });
}


// ======================================================
// VALIDAR ARCHIVO
// ======================================================

function validarArchivo(archivo) {
    if (!archivo) {
        return { valido: true };
    }

    const maximo = 10 * 1024 * 1024;

    if (archivo.size > maximo) {
        return {
            valido: false,
            mensaje: "El archivo supera el límite de 10 MB."
        };
    }

    const extensionesPermitidas = [
        ".pdf",
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ];

    const nombreArchivo = archivo.name.toLowerCase();

    const permitido = extensionesPermitidas.some(function (extension) {
        return nombreArchivo.endsWith(extension);
    });

    if (!permitido) {
        return {
            valido: false,
            mensaje: "Solo se permiten archivos PDF, JPG, JPEG, PNG o WEBP."
        };
    }

    return { valido: true };
}


// ======================================================
// CREAR NOMBRE DE ARCHIVO
// ======================================================

function crearNombreArchivo(archivo) {
    const nombreLimpio = archivo.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9._-]/g, "_");

    return (
        Date.now() +
        "_" +
        Math.random().toString(36).substring(2, 8) +
        "_" +
        nombreLimpio
    );
}


// ======================================================
// OBTENER USUARIO
// ======================================================

async function obtenerUsuarioActual() {
    const resultado = await supabaseClient.auth.getUser();

    if (resultado.error) {
        return null;
    }

    return resultado.data.user || null;
}


// ======================================================
// SUBIR DOCUMENTO
// ======================================================

async function subirDocumento(archivo, carpeta, userId) {
    if (!archivo) {
        return {
            ruta: null,
            nombre: null
        };
    }

    const validacion = validarArchivo(archivo);

    if (!validacion.valido) {
        throw new Error(validacion.mensaje);
    }

    const nombreArchivo = crearNombreArchivo(archivo);

    const ruta = userId + "/" + carpeta + "/" + nombreArchivo;

    const resultado = await supabaseClient
        .storage
        .from("documentos")
        .upload(ruta, archivo, {
            cacheControl: "3600",
            contentType: archivo.type || "application/octet-stream",
            upsert: false
        });

    if (resultado.error) {
        throw new Error(
            resultado.error.message || "No se pudo subir el archivo."
        );
    }

    return {
        ruta: resultado.data.path || ruta,
        nombre: archivo.name
    };
}


// ======================================================
// ELIMINAR ARCHIVO ANTERIOR
// ======================================================

async function eliminarArchivoAnterior(rutaAnterior, rutaNueva) {
    if (!rutaAnterior) return;

    if (rutaNueva && rutaAnterior === rutaNueva) return;

    const resultado = await supabaseClient
        .storage
        .from("documentos")
        .remove([rutaAnterior]);

    if (resultado.error) {
        console.warn(
            "No se pudo eliminar el archivo anterior:",
            resultado.error
        );
    }
}


// ======================================================
// GUARDAR CLIENTE
// ======================================================

if (formCliente) {
    formCliente.addEventListener("submit", async function (event) {
        event.preventDefault();

        const botonGuardar = formCliente.querySelector(
            'button[type="submit"]'
        );

        if (botonGuardar) {
            botonGuardar.disabled = true;
            botonGuardar.textContent = "Guardando...";
        }

        try {
            const user = await obtenerUsuarioActual();

            if (!user) {
                throw new Error("No hay una sesión iniciada.");
            }

            const nuevoCedula = cedulaArchivo?.files?.[0] || null;
            const nuevoContrato = contrato?.files?.[0] || null;
            const nuevoRecibo = reciboPublico?.files?.[0] || null;

            const archivos = [
                nuevoCedula,
                nuevoContrato,
                nuevoRecibo
            ];

            archivos.forEach(function (archivo) {
                if (!archivo) return;

                const validacion = validarArchivo(archivo);

                if (!validacion.valido) {
                    throw new Error(validacion.mensaje);
                }
            });

            let cedulaRuta = clienteEditando?.cedula_ruta || null;
            let cedulaNombre = clienteEditando?.cedula_nombre || null;

            let contratoRuta = clienteEditando?.contrato_ruta || null;
            let contratoNombre = clienteEditando?.contrato_nombre || null;

            let reciboRuta = clienteEditando?.recibo_ruta || null;
            let reciboNombre = clienteEditando?.recibo_nombre || null;

            const cedulaRutaAnterior = cedulaRuta;
            const contratoRutaAnterior = contratoRuta;
            const reciboRutaAnterior = reciboRuta;

            if (nuevoCedula) {
                const resultado = await subirDocumento(
                    nuevoCedula,
                    "cedulas",
                    user.id
                );

                cedulaRuta = resultado.ruta;
                cedulaNombre = resultado.nombre;
            }

            if (nuevoContrato) {
                const resultado = await subirDocumento(
                    nuevoContrato,
                    "contratos",
                    user.id
                );

                contratoRuta = resultado.ruta;
                contratoNombre = resultado.nombre;
            }

            if (nuevoRecibo) {
                const resultado = await subirDocumento(
                    nuevoRecibo,
                    "recibos",
                    user.id
                );

                reciboRuta = resultado.ruta;
                reciboNombre = resultado.nombre;
            }

            const datosCliente = {
                nombre: nombre.value.trim(),
                identificacion: cedula.value.trim(),
                telefono: telefono.value.trim(),
                correo: correo.value.trim(),
                direccion: direccion.value.trim(),
                mac: mac.value.trim(),
                cto: cto.value.trim(),
                puerto: puerto.value.trim(),
                plan: plan.value,
                precio: Number(precio.value) || 0,
                fecha: fecha.value || null,
                estado: estado.value,
                cedula_ruta: cedulaRuta,
                cedula_nombre: cedulaNombre,
                contrato_ruta: contratoRuta,
                contrato_nombre: contratoNombre,
                recibo_ruta: reciboRuta,
                recibo_nombre: reciboNombre
            };

            if (clienteEditando) {
                const resultado = await supabaseClient
                    .from("Clientes")
                    .update(datosCliente)
                    .eq("id", clienteEditando.id);

                if (resultado.error) {
                    throw resultado.error;
                }

                if (nuevoCedula && cedulaRutaAnterior) {
                    await eliminarArchivoAnterior(
                        cedulaRutaAnterior,
                        cedulaRuta
                    );
                }

                if (nuevoContrato && contratoRutaAnterior) {
                    await eliminarArchivoAnterior(
                        contratoRutaAnterior,
                        contratoRuta
                    );
                }

                if (nuevoRecibo && reciboRutaAnterior) {
                    await eliminarArchivoAnterior(
                        reciboRutaAnterior,
                        reciboRuta
                    );
                }

                mostrarNotificacion(
                    "Cliente actualizado",
                    "Los datos se actualizaron correctamente.",
                    "exito"
                );

            } else {
                const resultado = await supabaseClient
                    .from("Clientes")
                    .insert(datosCliente);

                if (resultado.error) {
                    throw resultado.error;
                }

                mostrarNotificacion(
                    "Cliente guardado",
                    "El cliente se guardó correctamente.",
                    "exito"
                );
            }

            cerrarModalCliente();

            await cargarClientes();

        } catch (error) {
            console.error("ERROR:", error);

            mostrarNotificacion(
                "Error",
                error.message || "No se pudo guardar el cliente.",
                "error"
            );
        }

        if (botonGuardar) {
            botonGuardar.disabled = false;
            botonGuardar.textContent = "Guardar cliente";
        }
    });
}


// ======================================================
// VER CLIENTE
// ======================================================

function abrirModalVerCliente(cliente) {
    verNombre.textContent = cliente.nombre || "Cliente";
    verTelefono.textContent = cliente.telefono || "No registrado";
    verCedula.textContent = cliente.identificacion || "No registrada";
    verCorreo.textContent = cliente.correo || "No registrado";
    verDireccion.textContent = cliente.direccion || "No registrada";
    verMac.textContent = cliente.mac || "No registrada";
    verCto.textContent = cliente.cto || "No registrado";
    verPuerto.textContent = cliente.puerto || "No registrado";
    verPlan.textContent = cliente.plan || "No registrado";
    verPrecio.textContent = formatearMoneda(cliente.precio);
    verEstado.textContent = cliente.estado || "No registrado";
    verFecha.textContent = cliente.fecha || "No registrada";

    mostrarDocumento(
        verCedulaArchivo,
        cliente.cedula_ruta,
        cliente.cedula_nombre,
        "🪪",
        "Cédula"
    );

    mostrarDocumento(
        verContrato,
        cliente.contrato_ruta,
        cliente.contrato_nombre,
        "📄",
        "Contrato"
    );

    mostrarDocumento(
        verReciboPublico,
        cliente.recibo_ruta,
        cliente.recibo_nombre,
        "🧾",
        "Recibo"
    );

    if (modalVerCliente) {
        modalVerCliente.classList.add("activo");
        modalVerCliente.style.display = "flex";
    }
}


// ======================================================
// MOSTRAR DOCUMENTO
// ======================================================

function mostrarDocumento(
    contenedor,
    ruta,
    nombreArchivo,
    icono,
    nombreDocumento
) {
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (!ruta) {
        contenedor.innerHTML = `
            <div class="documento-sin-archivo">
                ${icono}
                No hay ${escaparHTML(nombreDocumento)} cargado.
            </div>
        `;
        return;
    }

    const documento = document.createElement("div");
    documento.className = "documento-archivo";

    documento.innerHTML = `
        <div class="documento-info">
            <span class="documento-icono">${icono}</span>
            <div class="documento-nombre">
                <strong>${escaparHTML(nombreDocumento)}</strong>
                <span>${escaparHTML(nombreArchivo || "Documento")}</span>
            </div>
        </div>

        <button
            type="button"
            class="btn-primary btn-abrir-documento">
            Abrir
        </button>
    `;

    const boton = documento.querySelector(".btn-abrir-documento");

    boton.addEventListener("click", function () {
        abrirDocumento(ruta);
    });

    contenedor.appendChild(documento);
}


// ======================================================
// ABRIR DOCUMENTO
// ======================================================

async function abrirDocumento(ruta) {
    if (!ruta) return;

    try {
        const resultado = await supabaseClient
            .storage
            .from("documentos")
            .createSignedUrl(ruta, 3600);

        if (resultado.error) {
            throw resultado.error;
        }

        window.open(resultado.data.signedUrl, "_blank");

    } catch (error) {
        console.error(error);

        mostrarNotificacion(
            "No se pudo abrir",
            "No fue posible abrir el documento.",
            "error"
        );
    }
}


// ======================================================
// CERRAR MODAL VER
// ======================================================

if (cerrarVerCliente) {
    cerrarVerCliente.addEventListener("click", function () {
        modalVerCliente.classList.remove("activo");
        modalVerCliente.style.display = "none";
    });
}


// ======================================================
// ELIMINAR CLIENTE
// ======================================================

function abrirModalEliminar(cliente) {
    clienteEliminar = cliente;

    nombreEliminar.textContent = cliente.nombre || "este cliente";

    modalEliminar.classList.add("activo");
    modalEliminar.style.display = "flex";
}

function cerrarModalEliminar() {
    if (!modalEliminar) return;

    modalEliminar.classList.remove("activo");
    modalEliminar.style.display = "none";

    clienteEliminar = null;
}

if (cancelarEliminar) {
    cancelarEliminar.addEventListener("click", cerrarModalEliminar);
}


// ======================================================
// ELIMINAR ARCHIVO
// ======================================================

async function eliminarArchivoStorage(ruta) {
    if (!ruta) return;

    const resultado = await supabaseClient
        .storage
        .from("documentos")
        .remove([ruta]);

    if (resultado.error) {
        console.warn(resultado.error);
    }
}


// ======================================================
// CONFIRMAR ELIMINAR
// ======================================================

if (confirmarEliminar) {
    confirmarEliminar.addEventListener("click", async function () {
        if (!clienteEliminar) return;

        confirmarEliminar.disabled = true;

        try {
            await eliminarArchivoStorage(clienteEliminar.cedula_ruta);
            await eliminarArchivoStorage(clienteEliminar.contrato_ruta);
            await eliminarArchivoStorage(clienteEliminar.recibo_ruta);

            const resultado = await supabaseClient
                .from("Clientes")
                .delete()
                .eq("id", clienteEliminar.id);

            if (resultado.error) {
                throw resultado.error;
            }

            cerrarModalEliminar();

            mostrarNotificacion(
                "Cliente eliminado",
                "El cliente fue eliminado correctamente.",
                "exito"
            );

            await cargarClientes();

        } catch (error) {
            console.error(error);

            mostrarNotificacion(
                "Error",
                error.message || "No se pudo eliminar el cliente.",
                "error"
            );
        }

        confirmarEliminar.disabled = false;
    });
}


// ======================================================
// ESTADÍSTICAS
// ======================================================

function actualizarEstadisticas() {
    const total = clientes.length;

    const activos = clientes.filter(function (cliente) {
        return cliente.estado === "Activo";
    }).length;

    const ingresos = clientes
        .filter(function (cliente) {
            return cliente.estado === "Activo";
        })
        .reduce(function (acumulado, cliente) {
            return acumulado + Number(cliente.precio || 0);
        }, 0);

    if (totalClientes) {
        totalClientes.textContent = total;
    }

    if (clientesActivos) {
        clientesActivos.textContent = activos;
    }

    if (ingresosMes) {
        ingresosMes.textContent = formatearMoneda(ingresos);
    }

    if (pagosPendientes) {
        pagosPendientes.textContent = "$0";
    }
}


// ======================================================
// MONEDA
// ======================================================

function formatearMoneda(valor) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(Number(valor) || 0);
}


// ======================================================
// NOTIFICACIÓN
// ======================================================

function mostrarNotificacion(titulo, mensaje, tipo) {
    const anterior = document.querySelector(".notificacion-sistecfiber");

    if (anterior) {
        anterior.remove();
    }

    const notificacion = document.createElement("div");

    notificacion.className =
        "notificacion-sistecfiber notificacion-" + (tipo || "exito");

    notificacion.innerHTML = `
        <div class="notificacion-icono">
            ${tipo === "error" ? "✕" : "✓"}
        </div>

        <div class="notificacion-contenido">
            <div class="notificacion-titulo">
                ${escaparHTML(titulo)}
            </div>
            <div class="notificacion-mensaje">
                ${escaparHTML(mensaje)}
            </div>
        </div>
    `;

    document.body.appendChild(notificacion);

    setTimeout(function () {
        notificacion.classList.add("notificacion-saliendo");

        setTimeout(function () {
            notificacion.remove();
        }, 300);
    }, 3000);
}


// ======================================================
// CERRAR MODALES AL HACER CLICK AFUERA
// ======================================================

window.addEventListener("click", function (event) {
    if (modalCliente && event.target === modalCliente) {
        cerrarModalCliente();
    }

    if (modalEliminar && event.target === modalEliminar) {
        cerrarModalEliminar();
    }

    if (modalVerCliente && event.target === modalVerCliente) {
        modalVerCliente.classList.remove("activo");
        modalVerCliente.style.display = "none";
    }
});


// ======================================================
// ESCAPE
// ======================================================

document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;

    cerrarModalCliente();
    cerrarModalEliminar();

    if (modalVerCliente) {
        modalVerCliente.classList.remove("activo");
        modalVerCliente.style.display = "none";
    }
});


// ======================================================
// INICIAR
// ======================================================

// No forzar Inicio aquí.
// La función comprobarSesion recuperará la última sección guardada.
comprobarSesion();
