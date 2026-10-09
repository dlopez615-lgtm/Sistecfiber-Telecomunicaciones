
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
let cargandoClientes = false;


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
const marcaOnu = document.getElementById("marcaOnu");
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
// RECUPERAR LA ÚLTIMA SECCIÓN VISITADA
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
// MOSTRAR SECCIÓN Y GUARDARLA
// ======================================================

function mostrarSeccion(nombreSeccion) {
    if (
        !Object.prototype.hasOwnProperty.call(seccionesMenu, nombreSeccion) ||
        !seccionesMenu[nombreSeccion]
    ) {
        nombreSeccion = "inicio";
    }

    // Guardar la sección antes de cambiar la pantalla
    try {
        localStorage.setItem("sistecfiber_seccion", nombreSeccion);
    } catch (error) {
        console.warn("No se pudo guardar la sección.", error);
    }

    // Ocultar todas las secciones
    Object.values(seccionesMenu).forEach(function (seccion) {
        if (!seccion) return;

        seccion.style.display = "none";
        seccion.classList.remove("mostrar");
    });

    // Quitar la selección de los botones
    botonesMenu.forEach(function (boton) {
        boton.classList.remove("activo", "seleccionado");
    });

    const seccionActual = seccionesMenu[nombreSeccion];

    if (!seccionActual) return;

    // Mostrar la sección seleccionada
    seccionActual.style.display = "block";

    // Mantener las clases que necesitan las secciones adicionales
    if (
    nombreSeccion === "pagos" ||
    nombreSeccion === "datos" ||
    nombreSeccion === "equipos" ||
    nombreSeccion === "soporte"
) {
    seccionActual.classList.add("mostrar");
}

if (nombreSeccion === "datos") {
    mostrarDatos();
}

if (nombreSeccion === "equipos") {
    mostrarEquipos();
}

    // Marcar el botón correspondiente
    const botonActivo = document.querySelector(
        '.menu-item[data-seccion="' + nombreSeccion + '"]'
    );

    if (botonActivo) {
        botonActivo.classList.add("activo", "seleccionado");
    }

    // Actualizar el contenido de la sección
    if (nombreSeccion === "inicio") {
        actualizarEstadisticas();
    }

    if (nombreSeccion === "clientes") {
        if (buscarCliente && buscarCliente.value.trim()) {
            mostrarClientesFiltrados(buscarCliente.value);
        } else {
            mostrarClientes(clientes);
        }
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

            if (btnAcceso) btnAcceso.textContent = "Crear cuenta";
            btnCambiarAcceso.textContent = "Ya tengo una cuenta";

            crearCampoNombreRegistro();
        } else {
            if (titulo) titulo.textContent = "Sistecfiber";
            if (texto) texto.textContent = "Inicia sesión para ingresar al panel";

            if (btnAcceso) btnAcceso.textContent = "Iniciar sesión";
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

        if (btnAcceso) {
            btnAcceso.disabled = true;
        }

        try {
            if (modoRegistro) {
                const campoNombre = document.getElementById("nombreRegistro");
                const nombrePersona = campoNombre
                    ? campoNombre.value.trim()
                    : "";

                if (!nombrePersona) {
                    mostrarMensajeAcceso(
                        "Escribe tu nombre completo.",
                        "error"
                    );
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

                mostrarMensajeAcceso(
                    "Cuenta creada correctamente. Si se solicita, confirma tu correo.",
                    "exito"
                );

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
        } finally {
            if (btnAcceso) {
                btnAcceso.disabled = false;
            }
        }
    });
}


// ======================================================
// CERRAR SESIÓN
// ======================================================

if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", async function () {
        try {
            const resultado = await supabaseClient.auth.signOut();

            if (resultado.error) {
                throw resultado.error;
            }

            clientes = [];

            try {
                localStorage.removeItem("sistecfiber_seccion");
            } catch (error) {
                console.warn(error);
            }

            mostrarLogin();

        } catch (error) {
            console.error("No se pudo cerrar la sesión:", error);

            mostrarNotificacion(
                "Error",
                "No se pudo cerrar la sesión correctamente.",
                "error"
            );
        }
    });
}


// ======================================================
// CONTROLAR CAMBIOS DE SESIÓN
// ======================================================

supabaseClient.auth.onAuthStateChange(function (evento, session) {
    // La sesión inicial se comprueba en comprobarSesion().
    // Así evitamos cargar los clientes dos veces al abrir la página.
    if (evento === "INITIAL_SESSION") {
        return;
    }

    // Ejecutar fuera del callback de autenticación
    setTimeout(async function () {
        if (session) {
            mostrarAplicacion();
            actualizarUsuario(session.user);

            await cargarClientes();

            mostrarSeccion(obtenerSeccionGuardada());
        } else {
            mostrarLogin();
        }
    }, 0);
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
// COMPROBAR SESIÓN AL ABRIR LA PÁGINA
// ======================================================

async function comprobarSesion() {
    try {
        const resultado = await supabaseClient.auth.getSession();

        if (resultado.error || !resultado.data.session) {
            mostrarLogin();
            return;
        }

        const session = resultado.data.session;

        mostrarAplicacion();
        actualizarUsuario(session.user);

        await cargarClientes();

        // Recuperar la última sección visitada
        mostrarSeccion(obtenerSeccionGuardada());

    } catch (error) {
        console.error("Error al comprobar la sesión:", error);
        mostrarLogin();
    }
}


// ======================================================
// CARGAR CLIENTES
// ======================================================

async function cargarClientes() {
    if (cargandoClientes) return;

    cargandoClientes = true;

    if (listaClientes) {
        listaClientes.innerHTML = "<p>Cargando clientes...</p>";
    }

    try {
        const resultado = await supabaseClient
            .from("Clientes")
            .select("*")
            .order("id", { ascending: false });

        if (resultado.error) {
            throw resultado.error;
        }

        clientes = resultado.data || [];

        mostrarClientesFiltrados(
            buscarCliente ? buscarCliente.value : ""
        );

        mostrarDatos();
        actualizarEstadisticas();

    } catch (error) {
        console.error("Error al cargar clientes:", error);

        if (listaClientes) {
            listaClientes.innerHTML =
                "<p>No se pudieron cargar los clientes.</p>";
        }

        if (listaDatos) {
            listaDatos.innerHTML = `
                <div class="menu-extra-vacio">
                    <h3>No se pudieron cargar los datos</h3>
                    <p>Comprueba la conexión e inténtalo de nuevo.</p>
                </div>
            `;
        }
    } finally {
        cargandoClientes = false;
    }
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
                    <span class="estado ${escaparHTML(claseEstado)}">
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
                <button type="button" class="btn-secondary btn-ver-cliente">
                    Ver
                </button>
                <button type="button" class="btn-primary btn-editar-cliente">
                    Editar
                </button>
                <button type="button" class="btn-danger btn-eliminar-cliente">
                    Eliminar
                </button>
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
// BUSCADOR DE CLIENTES
// ======================================================

function normalizarBusqueda(valor) {
    return String(valor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function mostrarClientesFiltrados(texto) {
    const busqueda = normalizarBusqueda(texto);

    if (!busqueda) {
        mostrarClientes(clientes);
        return;
    }

    const filtrados = clientes.filter(function (cliente) {
        const campos = [
            cliente.nombre,
            cliente.identificacion,
            cliente.telefono,
            cliente.correo,
            cliente.direccion,
            cliente.cto,
            cliente.puerto,
            cliente.plan,
            cliente.mac
        ];

        return normalizarBusqueda(campos.filter(Boolean).join(" "))
            .includes(busqueda);
    });

    if (filtrados.length === 0) {
        if (listaClientes) {
            listaClientes.innerHTML = `
                <div class="menu-extra-vacio">
                    <h3>No se encontraron clientes</h3>
                    <p>Prueba con otro nombre o dato.</p>
                </div>
            `;
        }

        return;
    }

    mostrarClientes(filtrados);
}

if (buscarCliente) {
    buscarCliente.addEventListener("input", function () {
        mostrarClientesFiltrados(this.value);
    });

    buscarCliente.addEventListener("search", function () {
        mostrarClientesFiltrados(this.value);
    });
}


// ======================================================
// MOSTRAR DATOS Y FILTRAR DOCUMENTOS
// ======================================================

function mostrarDatos() {
    if (!listaDatos) return;

    const textoBusqueda = normalizarBusqueda(
        buscarDatos ? buscarDatos.value : ""
    );

    const clientesFiltrados = clientes.filter(function (cliente) {
        const campos = [
            cliente.nombre,
            cliente.identificacion,
            cliente.telefono,
            cliente.correo,
            cliente.direccion,
            cliente.cto,
            cliente.plan,
            cliente.mac,
            cliente.cedula_nombre,
            cliente.contrato_nombre,
            cliente.recibo_nombre
        ];

        const textoCliente = normalizarBusqueda(
            campos.filter(Boolean).join(" ")
        );

        return textoCliente.includes(textoBusqueda);
    });

    listaDatos.innerHTML = "";

    if (clientes.length === 0) {
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
                <h3>No se encontraron resultados</h3>
                <p>Prueba con otro nombre, teléfono o número de identificación.</p>
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

    buscarDatos.addEventListener("search", function () {
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
// ABRIR MODAL NUEVO CLIENTE
// ======================================================

if (btnNuevoCliente) {
    btnNuevoCliente.addEventListener("click", abrirModalCliente);
}

function abrirModalCliente() {
    clienteEditando = null;

    if (tituloModal) {
        tituloModal.textContent = "Nuevo cliente";
    }

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

    if (tituloModal) {
        tituloModal.textContent = "Editar cliente";
    }

    nombre.value = cliente.nombre || "";
    cedula.value = cliente.identificacion || "";
    telefono.value = cliente.telefono || "";
    correo.value = cliente.correo || "";
    direccion.value = cliente.direccion || "";
    mac.value = cliente.mac || "";
    if (marcaOnu) {
    marcaOnu.value = cliente.marca_onu || "";
    }
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
                    ? '<button type="button" class="btn-secondary btn-abrir-archivo">Abrir</button>'
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
                marca_onu: marcaOnu ? marcaOnu.value : "",
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

        } finally {
            if (botonGuardar) {
                botonGuardar.disabled = false;
                botonGuardar.textContent = "Guardar cliente";
            }
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

        <button type="button" class="btn-primary btn-abrir-documento">
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
        if (!modalVerCliente) return;

        modalVerCliente.classList.remove("activo");
        modalVerCliente.style.display = "none";
    });
}


// ======================================================
// ELIMINAR CLIENTE
// ======================================================

function abrirModalEliminar(cliente) {
    clienteEliminar = cliente;

    if (nombreEliminar) {
        nombreEliminar.textContent = cliente.nombre || "este cliente";
    }

    if (modalEliminar) {
        modalEliminar.classList.add("activo");
        modalEliminar.style.display = "flex";
    }
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
            const cliente = clienteEliminar;

            const resultado = await supabaseClient
                .from("Clientes")
                .delete()
                .eq("id", cliente.id);

            if (resultado.error) {
                throw resultado.error;
            }

            // Eliminar los archivos después de borrar el registro
            await eliminarArchivoStorage(cliente.cedula_ruta);
            await eliminarArchivoStorage(cliente.contrato_ruta);
            await eliminarArchivoStorage(cliente.recibo_ruta);

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

        } finally {
            confirmarEliminar.disabled = false;
        }
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
// CERRAR MODALES AL HACER CLIC AFUERA
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
// EQUIPOS: CONSULTA DE MAC Y MARCA DE ONU
// ======================================================

function mostrarEquipos() {
    const seccion = document.getElementById("seccionEquipos");

    if (!seccion) return;

    const panel = seccion.querySelector(".panel");

    if (!panel) return;

    panel.innerHTML = `
        <div class="panel-header">
            <div>
                <h2>Equipos</h2>
                <p>Consulta la MAC y la marca de ONU de cada cliente</p>
            </div>
        </div>

        <div class="buscador" style="margin: 20px 0;">
            <span>⌕</span>
            <input
                type="search"
                id="buscarEquipos"
                placeholder="Buscar cliente, MAC o marca de ONU..."
                autocomplete="off">
        </div>

        <div id="listaEquipos" class="menu-extra-grid"></div>
    `;

    const buscador = document.getElementById("buscarEquipos");

    if (buscador) {
        buscador.addEventListener("input", function () {
            renderizarEquipos(this.value);
        });
    }

    renderizarEquipos("");
}

function renderizarEquipos(texto = "") {
    const lista = document.getElementById("listaEquipos");

    if (!lista) return;

    const busqueda = normalizarBusqueda(texto);

    const filtrados = clientes.filter(function (cliente) {
        const campos = [
            cliente.nombre,
            cliente.mac,
            cliente.marca_onu
        ];

        return normalizarBusqueda(
            campos.filter(Boolean).join(" ")
        ).includes(busqueda);
    });

    lista.innerHTML = "";

    if (filtrados.length === 0) {
        lista.innerHTML = `
            <div class="menu-extra-vacio">
                <h3>No se encontraron equipos</h3>
                <p>Registra un cliente o prueba con otra búsqueda.</p>
            </div>
        `;
        return;
    }

    filtrados.forEach(function (cliente) {
        const tarjeta = document.createElement("div");

        tarjeta.className = "menu-extra-card";

        tarjeta.innerHTML = `
            <h3>${escaparHTML(cliente.nombre || "Sin nombre")}</h3>

            <p>
                <strong>Estado:</strong>
                ${escaparHTML(cliente.estado || "No registrado")}
            </p>

            <button
                type="button"
                class="btn-secondary"
                style="margin-top: 12px;">
                Ver equipos
            </button>

            <div
                class="detalle-equipos"
                style="display:none; margin-top:14px; overflow-wrap:anywhere;">

                <p>
                    <strong>MAC:</strong>
                    ${escaparHTML(cliente.mac || "No registrada")}
                </p>

                <p>
                    <strong>Marca de ONU:</strong>
                    ${escaparHTML(cliente.marca_onu || "No registrada")}
                </p>

                <p>
                    <strong>CTO:</strong>
                    ${escaparHTML(cliente.cto || "No registrada")}
                </p>

                <p>
                    <strong>Puerto:</strong>
                    ${escaparHTML(cliente.puerto || "No registrado")}
                </p>

            </div>
        `;

        const boton = tarjeta.querySelector("button");
        const detalles = tarjeta.querySelector(".detalle-equipos");

        boton.addEventListener("click", function () {
            const estaVisible = detalles.style.display !== "none";

            detalles.style.display = estaVisible ? "none" : "block";
            boton.textContent = estaVisible ? "Ver equipos" : "Ocultar equipos";
        });

        lista.appendChild(tarjeta);
    });
}

// ======================================================
// INICIAR APLICACIÓN
// ======================================================

// No llamar mostrarSeccion("inicio") aquí.
// Se recuperará la última sección guardada.
comprobarSesion();


/* ======================================================
   PERFIL DEL USUARIO: EDITAR NOMBRE Y CORREO
====================================================== */

function crearModalPerfil() {
    let modal = document.getElementById("modalPerfilUsuario");

    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "modalPerfilUsuario";

    modal.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(15, 23, 42, 0.65);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            color: #1f2937;
            width: 100%;
            max-width: 430px;
            border-radius: 18px;
            padding: 25px;
            box-sizing: border-box;
            box-shadow: 0 20px 60px rgba(0,0,0,.2);
        ">
            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:12px;
                margin-bottom:20px;
            ">
                <div>
                    <h2 style="margin:0 0 5px;">Mi perfil</h2>
                    <p style="margin:0;color:#64748b;font-size:14px;">
                        Actualiza los datos de tu cuenta
                    </p>
                </div>

                <button
                    type="button"
                    id="cerrarPerfil"
                    aria-label="Cerrar"
                    style="
                        border:0;
                        background:#f1f5f9;
                        border-radius:10px;
                        width:36px;
                        height:36px;
                        cursor:pointer;
                        font-size:20px;
                    ">×</button>
            </div>

            <form id="formPerfilUsuario">
                <label for="perfilNombre"
                    style="display:block;font-weight:600;margin-bottom:7px;">
                    Nombre
                </label>

                <input
                    id="perfilNombre"
                    type="text"
                    maxlength="100"
                    required
                    placeholder="Tu nombre completo"
                    style="
                        width:100%;
                        box-sizing:border-box;
                        padding:12px;
                        border:1px solid #cbd5e1;
                        border-radius:10px;
                        margin-bottom:17px;
                    ">

                <label for="perfilCorreo"
                    style="display:block;font-weight:600;margin-bottom:7px;">
                    Correo electrónico
                </label>

                <input
                    id="perfilCorreo"
                    type="email"
                    maxlength="254"
                    required
                    placeholder="correo@ejemplo.com"
                    style="
                        width:100%;
                        box-sizing:border-box;
                        padding:12px;
                        border:1px solid #cbd5e1;
                        border-radius:10px;
                        margin-bottom:10px;
                    ">

                <p style="
                    font-size:12px;
                    color:#64748b;
                    margin:0 0 18px;
                    line-height:1.5;
                ">
                    Si cambias el correo, Supabase podría pedirte confirmar
                    el cambio desde tu correo electrónico.
                </p>

                <p id="mensajePerfil"
                    role="status"
                    style="font-size:13px;margin-bottom:15px;"></p>

                <div style="display:flex;gap:10px;">
                    <button
                        type="button"
                        id="cancelarPerfil"
                        style="
                            flex:1;
                            padding:12px;
                            border:1px solid #cbd5e1;
                            border-radius:10px;
                            background:white;
                            cursor:pointer;
                        ">
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        id="guardarPerfil"
                        style="
                            flex:1;
                            padding:12px;
                            border:0;
                            border-radius:10px;
                            background:#2563eb;
                            color:white;
                            font-weight:600;
                            cursor:pointer;
                        ">
                        Guardar cambios
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const cerrar = () => {
        modal.style.display = "none";
    };

    modal.querySelector("#cerrarPerfil").addEventListener("click", cerrar);
    modal.querySelector("#cancelarPerfil").addEventListener("click", cerrar);

    modal.addEventListener("click", function (event) {
        if (event.target === modal) cerrar();
    });

    return modal;
}


// Abrir el perfil y cargar los datos actuales de Supabase
async function abrirPerfilUsuario() {
    const modal = crearModalPerfil();
    const inputNombre = modal.querySelector("#perfilNombre");
    const inputCorreo = modal.querySelector("#perfilCorreo");
    const mensaje = modal.querySelector("#mensajePerfil");
    const botonGuardar = modal.querySelector("#guardarPerfil");

    mensaje.textContent = "Cargando perfil...";
    mensaje.style.color = "#64748b";
    botonGuardar.disabled = true;
    modal.style.display = "flex";

    try {
        const resultado = await supabaseClient.auth.getUser();

        if (resultado.error) throw resultado.error;

        const usuario = resultado.data.user;

        if (!usuario) {
            throw new Error("No se encontró una sesión activa.");
        }

        inputNombre.value = usuario.user_metadata?.nombre || "";
        inputCorreo.value = usuario.email || "";

        mensaje.textContent = "";
        inputNombre.focus();
    } catch (error) {
        mensaje.textContent = error.message || "No se pudo cargar el perfil.";
        mensaje.style.color = "#dc2626";
    } finally {
        botonGuardar.disabled = false;
    }
}


// Hacer clic en el nombre o el avatar para abrir el perfil
function activarEdicionPerfil() {
    [nombreUsuario, avatarUsuario].forEach(function (elemento) {
        if (!elemento) return;

        elemento.style.cursor = "pointer";
        elemento.title = "Haz clic para editar tu perfil";

        elemento.addEventListener("click", abrirPerfilUsuario);

        elemento.setAttribute("role", "button");
        elemento.setAttribute("tabindex", "0");

        elemento.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                abrirPerfilUsuario();
            }
        });
    });
}


// Guardar los cambios en la cuenta de Supabase
function activarGuardadoPerfil() {
    const modal = crearModalPerfil();
    const formulario = modal.querySelector("#formPerfilUsuario");
    const inputNombre = modal.querySelector("#perfilNombre");
    const inputCorreo = modal.querySelector("#perfilCorreo");
    const mensaje = modal.querySelector("#mensajePerfil");
    const botonGuardar = modal.querySelector("#guardarPerfil");

    formulario.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nuevoNombre = inputNombre.value.trim();
        const nuevoCorreo = inputCorreo.value.trim();
        const correoActual = (
            await supabaseClient.auth.getUser()
        ).data?.user?.email || "";

        if (!nuevoNombre || !nuevoCorreo) {
            mensaje.textContent = "Completa el nombre y el correo.";
            mensaje.style.color = "#dc2626";
            return;
        }

        botonGuardar.disabled = true;
        botonGuardar.textContent = "Guardando...";
        mensaje.textContent = "";

        try {
            const cambios = {
                data: {
                    nombre: nuevoNombre
                }
            };

            if (nuevoCorreo.toLowerCase() !== correoActual.toLowerCase()) {
                cambios.email = nuevoCorreo;
            }

            const resultado = await supabaseClient.auth.updateUser(cambios);

            if (resultado.error) throw resultado.error;

            const usuarioActualizado = resultado.data.user;

            if (nombreUsuario) {
                nombreUsuario.textContent = nuevoNombre;
            }

            if (avatarUsuario) {
                avatarUsuario.textContent =
                    nuevoNombre.charAt(0).toUpperCase();
            }

            if (usuarioActualizado?.email !== correoActual) {
                mensaje.textContent =
                    "Nombre actualizado. Revisa tu correo para confirmar el cambio de email si Supabase lo solicita.";
            } else {
                mensaje.textContent = "Perfil actualizado correctamente.";
            }

            mensaje.style.color = "#15803d";

        } catch (error) {
            console.error("Error al actualizar el perfil:", error);

            mensaje.textContent =
                error.message || "No se pudieron guardar los cambios.";

            mensaje.style.color = "#dc2626";
        } finally {
            botonGuardar.disabled = false;
            botonGuardar.textContent = "Guardar cambios";
        }
    });
}


// Iniciar las funciones del perfil
activarEdicionPerfil();
activarGuardadoPerfil();
