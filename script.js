
/* ======================================================
   SISTECFIBER TELECOMUNICACIONES
   Gestión de clientes, documentos, equipos y usuarios
====================================================== */


/* ======================================================
   1. CONFIGURACIÓN DE SUPABASE
====================================================== */

const SUPABASE_URL = "https://pmbcvhkyfoppvyrnuztn.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_yrZYYb4J2qqZmKTq05T35Q_2DBWRDMY";

if (!window.supabase) {
    throw new Error(
        "No se ha cargado Supabase. Comprueba el script de Supabase en tu HTML."
    );
}

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


/* ======================================================
   2. VARIABLES GENERALES
====================================================== */

let clientes = [];
let clienteEditando = null;
let clienteEliminar = null;
let cargandoClientes = false;
let sesionActual = null;
let inicializandoSesion = false;


/* ======================================================
   3. ELEMENTOS DE ACCESO
====================================================== */

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


/* ======================================================
   4. ELEMENTOS DEL MODAL DE CLIENTE
====================================================== */

const modalCliente = document.getElementById("modalCliente");
const formCliente = document.getElementById("formCliente");
const tituloModal = document.getElementById("tituloModal");
const cerrarModal = document.getElementById("cerrarModal");
const cancelarCliente = document.getElementById("cancelarCliente");
const btnNuevoCliente = document.getElementById("btnNuevoCliente");


/* ======================================================
   5. CAMPOS DEL CLIENTE
====================================================== */

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


/* ======================================================
   6. DOCUMENTOS DEL CLIENTE
====================================================== */

const cedulaArchivo = document.getElementById("cedulaArchivo");
const contrato = document.getElementById("contrato");
const reciboPublico = document.getElementById("reciboPublico");

const detalleCedula = document.getElementById("detalleCedula");
const detalleContrato = document.getElementById("detalleContrato");
const detalleRecibo = document.getElementById("detalleRecibo");


/* ======================================================
   7. LISTAS Y BUSCADORES
====================================================== */

const listaClientes = document.getElementById("listaClientes");
const buscarCliente = document.getElementById("buscarCliente");

const listaDatos = document.getElementById("listaDatos");
const buscarDatos = document.getElementById("buscarDatos");


/* ======================================================
   8. MODAL PARA ELIMINAR CLIENTES
====================================================== */

const modalEliminar = document.getElementById("modalEliminar");
const nombreEliminar = document.getElementById("nombreEliminar");
const cancelarEliminar = document.getElementById("cancelarEliminar");
const confirmarEliminar = document.getElementById("confirmarEliminar");


/* ======================================================
   9. MODAL PARA VER CLIENTES
====================================================== */

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


/* ======================================================
   10. ESTADÍSTICAS
====================================================== */

const totalClientes = document.getElementById("totalClientes");
const clientesActivos = document.getElementById("clientesActivos");
const ingresosMes = document.getElementById("ingresosMes");
const pagosPendientes = document.getElementById("pagosPendientes");


/* ======================================================
   11. NAVEGACIÓN
====================================================== */

const botonesMenu = document.querySelectorAll(".menu-item");

const seccionesMenu = {
    inicio: document.getElementById("seccionInicio"),
    clientes: document.getElementById("seccionClientes"),
    pagos: document.getElementById("seccionPagos"),
    datos: document.getElementById("seccionDatos"),
    equipos: document.getElementById("seccionEquipos"),
    soporte: document.getElementById("seccionSoporte")
};


/* ======================================================
   12. FUNCIONES GENERALES
====================================================== */

function escaparHTML(texto) {
    return String(texto ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function normalizarBusqueda(valor) {
    return String(valor ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}


function formatearMoneda(valor) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(Number(valor) || 0);
}


function mostrarNotificacion(titulo, mensaje, tipo = "exito") {
    const anterior = document.querySelector(".notificacion-sistecfiber");

    if (anterior) {
        anterior.remove();
    }

    const notificacion = document.createElement("div");

    notificacion.className =
        "notificacion-sistecfiber notificacion-" + tipo;

    const icono = document.createElement("div");
    icono.className = "notificacion-icono";
    icono.textContent = tipo === "error" ? "✕" : "✓";

    const contenido = document.createElement("div");
    contenido.className = "notificacion-contenido";

    const tituloElemento = document.createElement("div");
    tituloElemento.className = "notificacion-titulo";
    tituloElemento.textContent = titulo;

    const mensajeElemento = document.createElement("div");
    mensajeElemento.className = "notificacion-mensaje";
    mensajeElemento.textContent = mensaje;

    contenido.appendChild(tituloElemento);
    contenido.appendChild(mensajeElemento);

    notificacion.appendChild(icono);
    notificacion.appendChild(contenido);

    document.body.appendChild(notificacion);

    setTimeout(function () {
        notificacion.classList.add("notificacion-saliendo");

        setTimeout(function () {
            notificacion.remove();
        }, 300);
    }, 3500);
}


function establecerTexto(elemento, valor, predeterminado = "No registrado") {
    if (elemento) {
        elemento.textContent = valor || predeterminado;
    }
}


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


/* ======================================================
   13. NAVEGACIÓN ENTRE SECCIONES
====================================================== */

function mostrarSeccion(nombreSeccion) {
    if (
        !Object.prototype.hasOwnProperty.call(seccionesMenu, nombreSeccion) ||
        !seccionesMenu[nombreSeccion]
    ) {
        nombreSeccion = "inicio";
    }

    try {
        localStorage.setItem("sistecfiber_seccion", nombreSeccion);
    } catch (error) {
        console.warn("No se pudo guardar la sección.", error);
    }

    Object.values(seccionesMenu).forEach(function (seccion) {
        if (!seccion) return;

        seccion.style.display = "none";
        seccion.classList.remove("mostrar");
    });

    botonesMenu.forEach(function (boton) {
        boton.classList.remove("activo", "seleccionado");
    });

    const seccionActual = seccionesMenu[nombreSeccion];

    if (!seccionActual) return;

    seccionActual.style.display = "block";

    if (
        nombreSeccion === "pagos" ||
        nombreSeccion === "datos" ||
        nombreSeccion === "equipos" ||
        nombreSeccion === "soporte"
    ) {
        seccionActual.classList.add("mostrar");
    }

    const botonActivo = document.querySelector(
        '.menu-item[data-seccion="' + nombreSeccion + '"]'
    );

    if (botonActivo) {
        botonActivo.classList.add("activo", "seleccionado");
    }

    if (nombreSeccion === "inicio") {
        actualizarEstadisticas();
    }

    if (nombreSeccion === "clientes") {
        mostrarClientesFiltrados(
            buscarCliente ? buscarCliente.value : ""
        );
    }

    if (nombreSeccion === "datos") {
        mostrarDatos();
    }

    if (nombreSeccion === "equipos") {
        mostrarEquipos();
    }
}


botonesMenu.forEach(function (boton) {
    boton.addEventListener("click", function (event) {
        event.preventDefault();
        mostrarSeccion(this.dataset.seccion);
    });
});


/* ======================================================
   14. MOSTRAR APLICACIÓN O LOGIN
====================================================== */

function mostrarAplicacion() {
    if (pantallaAcceso) {
        pantallaAcceso.style.display = "none";
    }

    if (aplicacion) {
        aplicacion.style.display = "flex";
    }
}


function mostrarLogin() {
    if (pantallaAcceso) {
        pantallaAcceso.style.display = "flex";
    }

    if (aplicacion) {
        aplicacion.style.display = "none";
    }
}


function mostrarMensajeAcceso(mensaje, tipo = "") {
    if (!mensajeAcceso) return;

    mensajeAcceso.textContent = mensaje;
    mensajeAcceso.className = "mensaje-acceso " + tipo;
}


/* ======================================================
   15. REGISTRO DE CUENTAS
====================================================== */

let modoRegistro = false;


function crearCampoNombreRegistro() {
    let campoNombre = document.getElementById("nombreRegistro");

    if (campoNombre) return campoNombre;

    if (!accesoCorreo || !accesoCorreo.parentNode) {
        return null;
    }

    const contenedor = document.createElement("div");
    contenedor.id = "contenedorNombreRegistro";
    contenedor.style.marginBottom = "12px";

    campoNombre = document.createElement("input");
    campoNombre.type = "text";
    campoNombre.id = "nombreRegistro";
    campoNombre.name = "nombreRegistro";
    campoNombre.placeholder = "Nombre completo";
    campoNombre.autocomplete = "name";
    campoNombre.maxLength = 100;
    campoNombre.style.width = "100%";
    campoNombre.style.boxSizing = "border-box";

    contenedor.appendChild(campoNombre);

    accesoCorreo.parentNode.insertBefore(
        contenedor,
        accesoCorreo
    );

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
            if (texto) {
                texto.textContent = "Crea tu cuenta para ingresar al panel";
            }

            if (btnAcceso) btnAcceso.textContent = "Crear cuenta";

            btnCambiarAcceso.textContent = "Ya tengo una cuenta";

            crearCampoNombreRegistro();
        } else {
            if (titulo) titulo.textContent = "Sistecfiber";
            if (texto) {
                texto.textContent = "Inicia sesión para ingresar al panel";
            }

            if (btnAcceso) btnAcceso.textContent = "Iniciar sesión";

            btnCambiarAcceso.textContent = "Crear una cuenta";

            eliminarCampoNombreRegistro();
        }

        mostrarMensajeAcceso("");
    });
}


/* ======================================================
   16. INICIAR SESIÓN Y REGISTRAR CUENTAS
====================================================== */

if (formLogin) {
    formLogin.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = accesoCorreo?.value.trim() || "";
        const password = accesoPassword?.value || "";

        if (!email || !password) {
            mostrarMensajeAcceso(
                "Completa todos los campos.",
                "error"
            );
            return;
        }

        if (btnAcceso) {
            btnAcceso.disabled = true;
        }

        try {
            if (modoRegistro) {
                const campoNombre = document.getElementById("nombreRegistro");
                const nombrePersona = campoNombre?.value.trim() || "";

                if (!nombrePersona) {
                    mostrarMensajeAcceso(
                        "Escribe tu nombre completo.",
                        "error"
                    );
                    return;
                }

                const resultado = await supabaseClient.auth.signUp({
                    email,
                    password,
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
                    "Cuenta creada. Si se solicita, confirma tu correo antes de iniciar sesión.",
                    "exito"
                );

                return;
            }

            mostrarMensajeAcceso("Iniciando sesión...");

            const resultado = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

            if (resultado.error) {
                throw resultado.error;
            }

            mostrarMensajeAcceso(
                "Sesión iniciada correctamente.",
                "exito"
            );

        } catch (error) {
            console.error("Error de acceso:", error);

            mostrarMensajeAcceso(
                error.message || "No se pudo completar el acceso.",
                "error"
            );
        } finally {
            if (btnAcceso) {
                btnAcceso.disabled = false;
            }
        }
    });
}


/* ======================================================
   17. USUARIO Y SESIÓN
====================================================== */

function actualizarUsuario(usuario) {
    if (!usuario) return;

    const nombrePersona =
        usuario.user_metadata?.nombre || "Administrador";

    if (nombreUsuario) {
        nombreUsuario.textContent = nombrePersona;
    }

    if (avatarUsuario) {
        avatarUsuario.textContent =
            nombrePersona.charAt(0).toUpperCase() || "A";
    }
}


async function obtenerUsuarioActual() {
    const resultado = await supabaseClient.auth.getUser();

    if (resultado.error) {
        throw resultado.error;
    }

    return resultado.data.user || null;
}


async function comprobarSesion() {
    if (inicializandoSesion) return;

    inicializandoSesion = true;

    try {
        const resultado = await supabaseClient.auth.getSession();

        if (resultado.error) {
            throw resultado.error;
        }

        const session = resultado.data.session;

        if (!session) {
            sesionActual = null;
            mostrarLogin();
            return;
        }

        sesionActual = session.user.id;

        mostrarAplicacion();
        actualizarUsuario(session.user);

        await cargarClientes();

        mostrarSeccion(obtenerSeccionGuardada());

    } catch (error) {
        console.error("Error al comprobar la sesión:", error);
        mostrarLogin();
    } finally {
        inicializandoSesion = false;
    }
}


supabaseClient.auth.onAuthStateChange(function (evento, session) {
    if (evento === "INITIAL_SESSION") {
        return;
    }

    // Evita ejecutar operaciones de Supabase directamente dentro
    // del callback de autenticación.
    setTimeout(async function () {
        if (session?.user) {
            const nuevoUsuarioId = session.user.id;
            const cambioUsuario = sesionActual !== nuevoUsuarioId;

            sesionActual = nuevoUsuarioId;

            mostrarAplicacion();
            actualizarUsuario(session.user);

            if (cambioUsuario || evento === "SIGNED_IN") {
                clientes = [];
                await cargarClientes();
            }

            if (
                evento === "SIGNED_IN" ||
                evento === "USER_UPDATED"
            ) {
                actualizarUsuario(session.user);
            }

            mostrarSeccion(obtenerSeccionGuardada());

        } else {
            sesionActual = null;
            clientes = [];

            mostrarLogin();
        }
    }, 0);
});


/* ======================================================
   18. CERRAR SESIÓN
====================================================== */

if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", async function () {
        btnCerrarSesion.disabled = true;

        try {
            const resultado = await supabaseClient.auth.signOut();

            if (resultado.error) {
                throw resultado.error;
            }

            clientes = [];
            sesionActual = null;

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
        } finally {
            btnCerrarSesion.disabled = false;
        }
    });
}


/* ======================================================
   19. CARGAR CLIENTES DESDE SUPABASE
====================================================== */

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
            listaClientes.innerHTML = `
                <div class="menu-extra-vacio">
                    <h3>No se pudieron cargar los clientes</h3>
                    <p>Comprueba la conexión y los permisos de Supabase.</p>
                </div>
            `;
        }

        if (listaDatos) {
            listaDatos.innerHTML = `
                <div class="menu-extra-vacio">
                    <h3>No se pudieron cargar los documentos</h3>
                    <p>Comprueba la conexión e inténtalo de nuevo.</p>
                </div>
            `;
        }

    } finally {
        cargandoClientes = false;
    }
}


/* ======================================================
   20. MOSTRAR CLIENTES
====================================================== */

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
        const claseEstado = normalizarBusqueda(estadoCliente)
            .replaceAll(" ", "-");

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

        card.querySelector(".btn-ver-cliente").addEventListener(
            "click",
            function () {
                abrirModalVerCliente(cliente);
            }
        );

        card.querySelector(".btn-editar-cliente").addEventListener(
            "click",
            function (event) {
                event.preventDefault();
                event.stopPropagation();
                abrirModalEditar(cliente);
            }
        );

        card.querySelector(".btn-eliminar-cliente").addEventListener(
            "click",
            function () {
                abrirModalEliminar(cliente);
            }
        );

        listaClientes.appendChild(card);
    });
}


/* ======================================================
   21. BUSCADOR DE CLIENTES
====================================================== */

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
            cliente.mac,
            cliente.marca_onu
        ];

        return normalizarBusqueda(
            campos.filter(Boolean).join(" ")
        ).includes(busqueda);
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
}


/* ======================================================
   22. SECCIÓN DATOS Y DOCUMENTOS
====================================================== */

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

        return normalizarBusqueda(
            campos.filter(Boolean).join(" ")
        ).includes(textoBusqueda);
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
                <p>Prueba con otro nombre, teléfono o identificación.</p>
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

        tarjeta.querySelectorAll(".btn-abrir-dato").forEach(
            function (boton) {
                boton.addEventListener("click", function () {
                    abrirDocumento(boton.dataset.ruta);
                });
            }
        );

        listaDatos.appendChild(tarjeta);
    });
}


if (buscarDatos) {
    buscarDatos.addEventListener("input", mostrarDatos);
}


function crearDocumentoDatos(
    ruta,
    nombreArchivo,
    icono,
    nombreDocumento
) {
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


/* ======================================================
   23. ABRIR MODAL PARA NUEVO CLIENTE
====================================================== */

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


/* ======================================================
   24. EDITAR CLIENTE
====================================================== */

function asignarValor(elemento, valor) {
    if (elemento) {
        elemento.value = valor ?? "";
    }
}


function abrirModalEditar(cliente) {
    if (!cliente || !modalCliente) return;

    clienteEditando = cliente;

    if (tituloModal) {
        tituloModal.textContent = "Editar cliente";
    }

    asignarValor(nombre, cliente.nombre);
    asignarValor(cedula, cliente.identificacion);
    asignarValor(telefono, cliente.telefono);
    asignarValor(correo, cliente.correo);
    asignarValor(direccion, cliente.direccion);
    asignarValor(mac, cliente.mac);
    asignarValor(marcaOnu, cliente.marca_onu);
    asignarValor(cto, cliente.cto);
    asignarValor(puerto, cliente.puerto);
    asignarValor(plan, cliente.plan);
    asignarValor(precio, cliente.precio);
    asignarValor(fecha, cliente.fecha);
    asignarValor(estado, cliente.estado || "Activo");

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

    modalCliente.classList.add("activo");
    modalCliente.style.display = "flex";
}


function mostrarArchivoActual(
    contenedor,
    nombreArchivo,
    texto,
    rutaArchivo
) {
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (!nombreArchivo) {
        contenedor.innerHTML = `
            <span class="archivo-vacio">No hay documento cargado.</span>
        `;
        return;
    }

    const informacion = document.createElement("div");
    informacion.className = "archivo-actual";

    informacion.innerHTML = `
        <div class="archivo-actual-info">
            <span class="archivo-actual-titulo">
                ✓ ${escaparHTML(texto)}
            </span>
            <span class="archivo-actual-nombre">
                ${escaparHTML(nombreArchivo)}
            </span>
        </div>
    `;

    if (rutaArchivo) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "btn-secondary";
        boton.textContent = "Abrir";

        boton.addEventListener("click", function () {
            abrirDocumento(rutaArchivo);
        });

        informacion.appendChild(boton);
    }

    contenedor.appendChild(informacion);
}


/* ======================================================
   25. CERRAR MODALES DE CLIENTES
====================================================== */

function cerrarModalCliente() {
    if (!modalCliente) return;

    modalCliente.classList.remove("activo");
    modalCliente.style.display = "none";

    clienteEditando = null;

    limpiarArchivosSeleccionados();

    if (formCliente) {
        formCliente.reset();
    }
}


if (cerrarModal) {
    cerrarModal.addEventListener("click", cerrarModalCliente);
}


if (cancelarCliente) {
    cancelarCliente.addEventListener("click", cerrarModalCliente);
}


function limpiarArchivosSeleccionados() {
    if (detalleCedula) detalleCedula.innerHTML = "";
    if (detalleContrato) detalleContrato.innerHTML = "";
    if (detalleRecibo) detalleRecibo.innerHTML = "";

    if (cedulaArchivo) cedulaArchivo.value = "";
    if (contrato) contrato.value = "";
    if (reciboPublico) reciboPublico.value = "";
}


/* ======================================================
   26. MOSTRAR ARCHIVOS SELECCIONADOS
====================================================== */

function mostrarArchivoSeleccionado(input, contenedor, tipoArchivo) {
    if (!input || !contenedor) return;

    const archivo = input.files?.[0];

    if (!archivo) {
        contenedor.innerHTML = "";
        return;
    }

    const validacion = validarArchivo(archivo);

    if (!validacion.valido) {
        input.value = "";
        contenedor.innerHTML = "";

        mostrarNotificacion(
            "Archivo no válido",
            validacion.mensaje,
            "error"
        );

        return;
    }

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


if (cedulaArchivo) {
    cedulaArchivo.addEventListener("change", function () {
        mostrarArchivoSeleccionado(
            cedulaArchivo,
            detalleCedula,
            "cédula"
        );
    });
}


if (contrato) {
    contrato.addEventListener("change", function () {
        mostrarArchivoSeleccionado(
            contrato,
            detalleContrato,
            "contrato"
        );
    });
}


if (reciboPublico) {
    reciboPublico.addEventListener("change", function () {
        mostrarArchivoSeleccionado(
            reciboPublico,
            detalleRecibo,
            "recibo"
        );
    });
}


/* ======================================================
   27. VALIDAR ARCHIVOS
====================================================== */

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


/* ======================================================
   28. SUBIR DOCUMENTOS A SUPABASE STORAGE
====================================================== */

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

    if (!userId) {
        throw new Error("No se pudo identificar al usuario.");
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


async function eliminarArchivoStorage(ruta) {
    if (!ruta) return;

    const resultado = await supabaseClient
        .storage
        .from("documentos")
        .remove([ruta]);

    if (resultado.error) {
        console.warn(
            "No se pudo eliminar un archivo de Storage:",
            resultado.error
        );
    }
}


async function eliminarArchivoAnterior(rutaAnterior, rutaNueva) {
    if (!rutaAnterior || rutaAnterior === rutaNueva) return;

    await eliminarArchivoStorage(rutaAnterior);
}


/* ======================================================
   29. GUARDAR O ACTUALIZAR CLIENTE
====================================================== */

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

        // Si ocurre un error en la base de datos, se intentará limpiar
        // únicamente los archivos nuevos subidos durante esta operación.
        const archivosNuevosSubidos = [];

        try {
            if (!nombre || !cedula || !telefono || !direccion ||
                !mac || !cto || !puerto || !plan || !precio || !estado) {
                throw new Error(
                    "Faltan campos del formulario. Comprueba los ID en tu HTML."
                );
            }

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

            for (const archivo of archivos) {
                if (!archivo) continue;

                const validacion = validarArchivo(archivo);

                if (!validacion.valido) {
                    throw new Error(validacion.mensaje);
                }
            }

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
                archivosNuevosSubidos.push(resultado.ruta);
            }

            if (nuevoContrato) {
                const resultado = await subirDocumento(
                    nuevoContrato,
                    "contratos",
                    user.id
                );

                contratoRuta = resultado.ruta;
                contratoNombre = resultado.nombre;
                archivosNuevosSubidos.push(resultado.ruta);
            }

            if (nuevoRecibo) {
                const resultado = await subirDocumento(
                    nuevoRecibo,
                    "recibos",
                    user.id
                );

                reciboRuta = resultado.ruta;
                reciboNombre = resultado.nombre;
                archivosNuevosSubidos.push(resultado.ruta);
            }

            const datosCliente = {
                nombre: nombre.value.trim(),
                identificacion: cedula.value.trim(),
                telefono: telefono.value.trim(),
                correo: correo?.value.trim() || "",
                direccion: direccion.value.trim(),
                mac: mac.value.trim(),
                marca_onu: marcaOnu?.value.trim() || "",
                cto: cto.value.trim(),
                puerto: puerto.value.trim(),
                plan: plan.value,
                precio: Number(precio.value) || 0,
                fecha: fecha?.value || null,
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
            console.error("Error al guardar el cliente:", error);

            // Limpiar archivos recién subidos si el registro no pudo guardarse.
            for (const ruta of archivosNuevosSubidos) {
                await eliminarArchivoStorage(ruta);
            }

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


/* ======================================================
   30. VER INFORMACIÓN DE UN CLIENTE
====================================================== */

function abrirModalVerCliente(cliente) {
    if (!cliente) return;

    establecerTexto(verNombre, cliente.nombre, "Cliente");
    establecerTexto(verTelefono, cliente.telefono);
    establecerTexto(verCedula, cliente.identificacion, "No registrada");
    establecerTexto(verCorreo, cliente.correo);
    establecerTexto(verDireccion, cliente.direccion, "No registrada");
    establecerTexto(verMac, cliente.mac, "No registrada");
    establecerTexto(verCto, cliente.cto);
    establecerTexto(verPuerto, cliente.puerto);
    establecerTexto(verPlan, cliente.plan);
    establecerTexto(verPrecio, formatearMoneda(cliente.precio));
    establecerTexto(verEstado, cliente.estado);
    establecerTexto(verFecha, cliente.fecha, "No registrada");

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
        "Recibo de servicio público"
    );

    if (modalVerCliente) {
        modalVerCliente.classList.add("activo");
        modalVerCliente.style.display = "flex";
    }
}


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
    `;

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "btn-primary btn-abrir-documento";
    boton.textContent = "Abrir";

    boton.addEventListener("click", function () {
        abrirDocumento(ruta);
    });

    documento.appendChild(boton);
    contenedor.appendChild(documento);
}


/* ======================================================
   31. ABRIR DOCUMENTOS PRIVADOS
====================================================== */

async function abrirDocumento(ruta) {
    if (!ruta) {
        mostrarNotificacion(
            "Documento no disponible",
            "No se encontró la ruta del documento.",
            "error"
        );
        return;
    }

    // Abrir una pestaña directamente durante el clic ayuda a evitar
    // que el navegador bloquee la ventana emergente.
    const nuevaVentana = window.open("about:blank", "_blank");

    try {
        const resultado = await supabaseClient
            .storage
            .from("documentos")
            .createSignedUrl(ruta, 3600);

        if (resultado.error) {
            throw resultado.error;
        }

        const url = resultado.data?.signedUrl;

        if (!url) {
            throw new Error("Supabase no devolvió el enlace del documento.");
        }

        if (nuevaVentana) {
            nuevaVentana.opener = null;
            nuevaVentana.location.href = url;
        } else {
            window.location.href = url;
        }

    } catch (error) {
        if (nuevaVentana) {
            nuevaVentana.close();
        }

        console.error("Error al abrir documento:", error);

        mostrarNotificacion(
            "No se pudo abrir",
            error.message || "Comprueba los permisos del documento.",
            "error"
        );
    }
}


if (cerrarVerCliente) {
    cerrarVerCliente.addEventListener("click", function () {
        if (!modalVerCliente) return;

        modalVerCliente.classList.remove("activo");
        modalVerCliente.style.display = "none";
    });
}


/* ======================================================
   32. ELIMINAR CLIENTES
====================================================== */

function abrirModalEliminar(cliente) {
    if (!cliente) return;

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

            // Los documentos se eliminan después de borrar el registro.
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
            console.error("Error al eliminar cliente:", error);

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


/* ======================================================
   33. ACTUALIZAR ESTADÍSTICAS
====================================================== */

function actualizarEstadisticas() {
    const total = clientes.length;

    const activos = clientes.filter(function (cliente) {
        return normalizarBusqueda(cliente.estado) === "activo";
    }).length;

    const ingresos = clientes
        .filter(function (cliente) {
            return normalizarBusqueda(cliente.estado) === "activo";
        })
        .reduce(function (acumulado, cliente) {
            return acumulado + (Number(cliente.precio) || 0);
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


/* ======================================================
   34. CONSULTA DE EQUIPOS
====================================================== */

function mostrarEquipos() {
    const seccion = document.getElementById("seccionEquipos");

    if (!seccion) return;

    const panel = seccion.querySelector(".panel");

    if (!panel) return;

    // El panel de Equipos se construye al entrar a esta sección.
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
            cliente.marca_onu,
            cliente.cto,
            cliente.puerto
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

            <button type="button" class="btn-secondary" style="margin-top:12px;">
                Ver equipos
            </button>

            <div class="detalle-equipos"
                style="display:none;margin-top:14px;overflow-wrap:anywhere;">

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

            boton.textContent = estaVisible
                ? "Ver equipos"
                : "Ocultar equipos";
        });

        lista.appendChild(tarjeta);
    });
}


/* ======================================================
   35. CERRAR MODALES CON CLIC AFUERA O ESCAPE
====================================================== */

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


document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;

    cerrarModalCliente();
    cerrarModalEliminar();

    if (modalVerCliente) {
        modalVerCliente.classList.remove("activo");
        modalVerCliente.style.display = "none";
    }

    const modalPerfil = document.getElementById("modalPerfilUsuario");

    if (modalPerfil) {
        modalPerfil.style.display = "none";
    }
});


/* ======================================================
   36. MODAL DE PERFIL DEL USUARIO
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
            background:white;
            color:#1f2937;
            width:100%;
            max-width:430px;
            max-height:90vh;
            overflow-y:auto;
            border-radius:18px;
            padding:25px;
            box-sizing:border-box;
            box-shadow:0 20px 60px rgba(0,0,0,.2);
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
                    Si cambias el correo, Supabase podría pedirte confirmarlo.
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

    const cerrar = function () {
        modal.style.display = "none";
    };

    modal.querySelector("#cerrarPerfil").addEventListener("click", cerrar);
    modal.querySelector("#cancelarPerfil").addEventListener("click", cerrar);

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            cerrar();
        }
    });

    return modal;
}


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

        if (resultado.error) {
            throw resultado.error;
        }

        const usuario = resultado.data.user;

        if (!usuario) {
            throw new Error("No se encontró una sesión activa.");
        }

        inputNombre.value = usuario.user_metadata?.nombre || "";
        inputCorreo.value = usuario.email || "";

        mensaje.textContent = "";
        inputNombre.focus();

    } catch (error) {
        mensaje.textContent =
            error.message || "No se pudo cargar el perfil.";

        mensaje.style.color = "#dc2626";

    } finally {
        botonGuardar.disabled = false;
    }
}


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

        if (!nuevoNombre || !nuevoCorreo) {
            mensaje.textContent = "Completa el nombre y el correo.";
            mensaje.style.color = "#dc2626";
            return;
        }

        botonGuardar.disabled = true;
        botonGuardar.textContent = "Guardando...";
        mensaje.textContent = "";

        try {
            const resultadoUsuario = await supabaseClient.auth.getUser();

            if (resultadoUsuario.error) {
                throw resultadoUsuario.error;
            }

            const usuario = resultadoUsuario.data.user;

            if (!usuario) {
                throw new Error("No hay una sesión iniciada.");
            }

            const correoActual = usuario.email || "";

            const cambios = {
                data: {
                    ...(usuario.user_metadata || {}),
                    nombre: nuevoNombre
                }
            };

            if (
                nuevoCorreo.toLowerCase() !== correoActual.toLowerCase()
            ) {
                cambios.email = nuevoCorreo;
            }

            const resultado = await supabaseClient.auth.updateUser(cambios);

            if (resultado.error) {
                throw resultado.error;
            }

            const usuarioActualizado = resultado.data.user;

            if (nombreUsuario) {
                nombreUsuario.textContent = nuevoNombre;
            }

            if (avatarUsuario) {
                avatarUsuario.textContent =
                    nuevoNombre.charAt(0).toUpperCase();
            }

            if (
                nuevoCorreo.toLowerCase() !== correoActual.toLowerCase()
            ) {
                mensaje.textContent =
                    "Nombre actualizado. Revisa tu correo para confirmar el cambio de email si Supabase lo solicita.";
            } else {
                mensaje.textContent = "Perfil actualizado correctamente.";
            }

            mensaje.style.color = "#15803d";

            if (usuarioActualizado) {
                actualizarUsuario(usuarioActualizado);
            }

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

/* =====================================================
   SISTECFIBER - MÓDULO DE PAGOS MENSUALES
   Agregar al final del script.js existente
===================================================== */

// Día de vencimiento mensual. Cambia el 10 si lo necesitas.
const PAGOS_DIA_VENCIMIENTO = 10;

let pagosRegistros = [];
let pagosCargando = false;

const pagosElemento = id => document.getElementById(id);

function pagosObtenerConexion() {
    if (typeof supabaseClient !== "undefined" && supabaseClient) {
        return supabaseClient;
    }

    if (typeof supabaseDB !== "undefined" && supabaseDB) {
        return supabaseDB;
    }

    return null;
}

async function pagosObtenerUsuario() {
    if (typeof usuarioActual !== "undefined" && usuarioActual?.id) {
        return usuarioActual;
    }

    const db = pagosObtenerConexion();

    if (!db) {
        return null;
    }

    const { data, error } = await db.auth.getUser();

    if (error) {
        console.error("Error obteniendo usuario:", error);
        return null;
    }

    return data?.user || null;
}

function pagosObtenerClientes() {
    if (typeof clientes !== "undefined" && Array.isArray(clientes)) {
        return clientes;
    }

    return [];
}

function pagosFechaLocal(fecha = new Date()) {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}

function pagosMesActual() {
    return pagosFechaLocal().slice(0, 7);
}

function pagosPrimerDia(mes) {
    return `${mes}-01`;
}

function pagosDinero(valor) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(Number(valor) || 0);
}

function pagosEscapar(texto) {
    const elemento = document.createElement("span");
    elemento.textContent = String(texto ?? "");
    return elemento.innerHTML;
}

function pagosNombreCliente(cliente) {
    return cliente?.nombre || cliente?.nombre_completo || "Cliente sin nombre";
}

function pagosValorMensual(cliente) {
    return Number(cliente?.precio ?? cliente?.mensualidad ?? 0);
}

function pagosFechaValida(fecha) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(fecha || ""));
}

function pagosMostrarMensaje(texto, error = false) {
    const elemento = pagosElemento("pagoMensaje");

    if (!elemento) {
        if (texto) {
            alert(texto);
        }
        return;
    }

    elemento.textContent = texto;
    elemento.style.color = error ? "#b91c1c" : "#15803d";
}

function pagosEstadoMensualidad(mes, pago) {
    if (pago) {
        return "pagado";
    }

    const mesActual = pagosMesActual();

    if (mes < mesActual) {
        return "vencido";
    }

    if (mes > mesActual) {
        return "pendiente";
    }

    const diaHoy = new Date().getDate();

    return diaHoy >= PAGOS_DIA_VENCIMIENTO
        ? "vencido"
        : "pendiente";
}

function pagosTextoEstado(estado) {
    if (estado === "pagado") return "Pagado";
    if (estado === "vencido") return "Vencido";

    return "Pendiente";
}

function pagosBuscarRegistro(clienteId, mes) {
    return pagosRegistros.find(pago =>
        String(pago.cliente_id) === String(clienteId) &&
        pago.periodo === pagosPrimerDia(mes)
    );
}

/* =====================================================
   CARGAR PAGOS DESDE SUPABASE
===================================================== */

async function pagosCargarRegistros() {
    const db = pagosObtenerConexion();
    const usuario = await pagosObtenerUsuario();

    if (!db || !usuario) {
        pagosMostrarErrorTabla(
            "Inicia sesión para consultar las mensualidades."
        );
        return;
    }

    if (pagosCargando) {
        return;
    }

    pagosCargando = true;

    const cuerpo = pagosElemento("pagosTablaCuerpo");

    if (cuerpo) {
        cuerpo.innerHTML = `
            <tr>
                <td colspan="6" class="pagos-sin-resultados">
                    Cargando mensualidades...
                </td>
            </tr>
        `;
    }

    try {
        const mes = pagosElemento("pagosPeriodo")?.value || pagosMesActual();
        const periodo = pagosPrimerDia(mes);

        const { data, error } = await db
            .from("pagos_mensuales")
            .select("*")
            .eq("user_id", usuario.id)
            .eq("periodo", periodo);

        if (error) {
            throw error;
        }

        pagosRegistros = data || [];

        pagosRenderizar();
    } catch (error) {
        console.error("Error al cargar pagos:", error);

        pagosMostrarErrorTabla(
            "No se pudieron cargar los pagos. Verifica la tabla y las políticas RLS de Supabase."
        );
    } finally {
        pagosCargando = false;
    }
}

function pagosMostrarErrorTabla(mensaje) {
    const cuerpo = pagosElemento("pagosTablaCuerpo");

    if (cuerpo) {
        cuerpo.innerHTML = `
            <tr>
                <td colspan="6" class="pagos-sin-resultados">
                    ${pagosEscapar(mensaje)}
                </td>
            </tr>
        `;
    }
}

/* =====================================================
   DIBUJAR TABLA Y ESTADÍSTICAS
===================================================== */

function pagosRenderizar() {
    const mes = pagosElemento("pagosPeriodo")?.value || pagosMesActual();
    const cuerpo = pagosElemento("pagosTablaCuerpo");

    if (!cuerpo) {
        return;
    }

    const clientesDisponibles = pagosObtenerClientes().filter(cliente =>
        String(cliente.estado || "Activo").toLowerCase() !== "retirado"
    );

    const filtroEstado =
        pagosElemento("pagosFiltroEstado")?.value || "todos";

    const busqueda =
        (pagosElemento("pagosBuscar")?.value || "")
            .trim()
            .toLocaleLowerCase("es-CO");

    let totalRecaudado = 0;
    let totalPendiente = 0;
    let cantidadPagados = 0;
    let cantidadVencidos = 0;

    const filas = [];

    clientesDisponibles.forEach(cliente => {
        const id = String(cliente.id);
        const nombre = pagosNombreCliente(cliente);
        const telefono = String(cliente.telefono || "");
        const mensualidad = pagosValorMensual(cliente);
        const pago = pagosBuscarRegistro(id, mes);
        const estado = pagosEstadoMensualidad(mes, pago);

        if (pago) {
            totalRecaudado += Number(pago.monto) || 0;
            cantidadPagados++;
        } else {
            totalPendiente += mensualidad;

            if (estado === "vencido") {
                cantidadVencidos++;
            }
        }

        if (
            filtroEstado !== "todos" &&
            estado !== filtroEstado
        ) {
            return;
        }

        if (
            busqueda &&
            !nombre.toLocaleLowerCase("es-CO").includes(busqueda) &&
            !telefono.toLocaleLowerCase("es-CO").includes(busqueda)
        ) {
            return;
        }

        const fechaPago = pago?.fecha_pago
            ? pagosEscapar(pago.fecha_pago)
            : "—";

        const metodoPago = pago?.metodo
            ? pagosEscapar(pago.metodo)
            : "—";

        
        const accion = pago
            ? `
                <div class="pagos-acciones">
                    <span class="pagos-estado pagado">Registrado</span>
                    <button
                        type="button"
                        class="pagos-btn-eliminar"
                        data-pagos-eliminar="${pagosEscapar(id)}"
                        title="Eliminar el pago de este mes">
                        Eliminar pago
                    </button>
                </div>
            `
            : `
                <button
                    type="button"
                    class="pagos-btn-accion"
                    data-pagos-registrar="${pagosEscapar(id)}">
                    Registrar pago
                </button>
            `;

        filas.push(`
            <tr>
                <td>
                    <strong>${pagosEscapar(nombre)}</strong>
                    ${telefono
                        ? `<br><small>${pagosEscapar(telefono)}</small>`
                        : ""}
                </td>

                <td>${pagosDinero(mensualidad)}</td>

                <td>
                    <span class="pagos-estado ${estado}">
                        ${pagosTextoEstado(estado)}
                    </span>
                </td>

                <td>${fechaPago}</td>

                <td>${metodoPago}</td>

                <td>${accion}</td>
            </tr>
        `);
    });

    cuerpo.innerHTML = filas.length
        ? filas.join("")
        : `
            <tr>
                <td colspan="6" class="pagos-sin-resultados">
                    No hay clientes que coincidan con este filtro.
                </td>
            </tr>
        `;

    pagosElemento("pagosTotalRecaudado").textContent =
        pagosDinero(totalRecaudado);

    pagosElemento("pagosTotalPendiente").textContent =
        pagosDinero(totalPendiente);

    pagosElemento("pagosClientesVencidos").textContent =
        String(cantidadVencidos);

    pagosElemento("pagosCantidadPagados").textContent =
        String(cantidadPagados);

    pagosActualizarAviso(cantidadVencidos, mes);
}

function pagosActualizarAviso(cantidadVencidos, mes) {
    const aviso = pagosElemento("pagosAvisoVencimiento");

    if (!aviso) {
        return;
    }

    if (cantidadVencidos > 0) {
        aviso.hidden = false;

        aviso.textContent =
            `Atención: hay ${cantidadVencidos} mensualidad(es) vencida(s) ` +
            `para ${mes}. Revisa los clientes marcados como vencidos.`;
    } else {
        aviso.hidden = true;
        aviso.textContent = "";
    }
}

/* =====================================================
   ABRIR MODAL DE PAGO
===================================================== */

function pagosAbrirModal(clienteId = "") {
    const modal = pagosElemento("modalRegistrarPago");
    const formulario = pagosElemento("formRegistrarPago");

    if (!modal || !formulario) {
        alert("No se encontró el formulario de pagos en el HTML.");
        return;
    }

    formulario.reset();

    pagosMostrarMensaje("");

    pagosLlenarSelectClientes();

    pagosElemento("pagoPeriodo").value =
        pagosElemento("pagosPeriodo")?.value || pagosMesActual();

    pagosElemento("pagoFecha").value = pagosFechaLocal();

    if (clienteId) {
        pagosElemento("pagoCliente").value = String(clienteId);
    }

    pagosActualizarMonto();

    modal.classList.add("abierto");
}

function pagosCerrarModal() {
    const modal = pagosElemento("modalRegistrarPago");

    if (modal) {
        modal.classList.remove("abierto");
    }

    pagosMostrarMensaje("");
}

function pagosLlenarSelectClientes() {
    const selector = pagosElemento("pagoCliente");

    if (!selector) {
        return;
    }

    const mes = pagosElemento("pagoPeriodo")?.value || pagosMesActual();

    const opciones = pagosObtenerClientes()
        .filter(cliente =>
            String(cliente.estado || "Activo").toLowerCase() !== "retirado"
        )
        .map(cliente => {
            const id = String(cliente.id);
            const nombre = pagosNombreCliente(cliente);
            const pago = pagosBuscarRegistro(id, mes);
            const yaPago = Boolean(pago);

            return {
                id,
                nombre,
                yaPago,
                mensualidad: pagosValorMensual(cliente)
            };
        });

    selector.innerHTML = `
        <option value="">Seleccionar cliente</option>
        ${opciones.map(cliente => `
            <option
                value="${pagosEscapar(cliente.id)}"
                ${cliente.yaPago ? "disabled" : ""}>
                ${pagosEscapar(cliente.nombre)}
                ${cliente.yaPago ? " — ya pagó este mes" : ""}
            </option>
        `).join("")}
    `;
}

function pagosActualizarMonto() {
    const selector = pagosElemento("pagoCliente");
    const monto = pagosElemento("pagoMonto");
    const mes = pagosElemento("pagoPeriodo")?.value || pagosMesActual();

    if (!selector || !monto) {
        return;
    }

    const cliente = pagosObtenerClientes().find(
        item => String(item.id) === String(selector.value)
    );

    monto.value = cliente ? pagosValorMensual(cliente) : "";

    if (cliente && pagosBuscarRegistro(String(cliente.id), mes)) {
        pagosMostrarMensaje(
            "Este cliente ya tiene un pago registrado para ese mes.",
            true
        );
    } else {
        pagosMostrarMensaje("");
    }
}

/* =====================================================
   GUARDAR PAGO COMPLETO
===================================================== */

async function pagosGuardar(event) {
    event.preventDefault();

    const db = pagosObtenerConexion();
    const usuario = await pagosObtenerUsuario();

    if (!db || !usuario) {
        pagosMostrarMensaje(
            "No hay una sesión activa. Inicia sesión nuevamente.",
            true
        );
        return;
    }

    const clienteId = pagosElemento("pagoCliente").value;
    const mes = pagosElemento("pagoPeriodo").value;
    const metodo = pagosElemento("pagoMetodo").value;
    const fechaPago = pagosElemento("pagoFecha").value;
    const boton = pagosElemento("btnGuardarPago");

    const cliente = pagosObtenerClientes().find(
        item => String(item.id) === String(clienteId)
    );

    if (!cliente) {
        pagosMostrarMensaje("Selecciona un cliente válido.", true);
        return;
    }

    if (!/^\d{4}-\d{2}$/.test(mes)) {
        pagosMostrarMensaje("Selecciona el mes que se está pagando.", true);
        return;
    }

    if (!pagosFechaValida(fechaPago)) {
        pagosMostrarMensaje("Selecciona una fecha de pago válida.", true);
        return;
    }

    if (!metodo) {
        pagosMostrarMensaje("Selecciona el método de pago.", true);
        return;
    }

    const monto = pagosValorMensual(cliente);

    if (!Number.isFinite(monto) || monto <= 0) {
        pagosMostrarMensaje(
            "Este cliente no tiene una mensualidad válida en su ficha.",
            true
        );
        return;
    }

    const periodo = pagosPrimerDia(mes);

    const pagoExistente = pagosBuscarRegistro(clienteId, mes);

    if (pagoExistente) {
        pagosMostrarMensaje(
            "Ya existe un pago registrado para este cliente y mes.",
            true
        );
        return;
    }

    if (fechaPago > pagosFechaLocal()) {
        pagosMostrarMensaje(
            "La fecha de pago no puede ser posterior a hoy.",
            true
        );
        return;
    }

    boton.disabled = true;
    boton.textContent = "Guardando...";

    try {
        const registro = {
            user_id: usuario.id,
            cliente_id: String(cliente.id),
            cliente_nombre: pagosNombreCliente(cliente),
            periodo,
            monto,
            metodo,
            fecha_pago: fechaPago
        };

        const { error } = await db
            .from("pagos_mensuales")
            .insert(registro);

        if (error) {
            if (error.code === "23505") {
                throw new Error(
                    "Este cliente ya tiene un pago registrado para ese mes."
                );
            }

            throw error;
        }

        pagosCerrarModal();

        await pagosCargarRegistros();

        mostrarNotificacion(
        "¡Pago registrado correctamente!",
        `Cliente: ${pagosNombreCliente(cliente)} · ` +
        `Valor: ${pagosDinero(monto)} · ` +
        `Mes: ${mes}`,
        "exito"
    );
    } catch (error) {
        console.error("Error guardando pago:", error);

        pagosMostrarMensaje(
            error.message ||
            "No se pudo guardar el pago. Verifica Supabase e inténtalo nuevamente.",
            true
        );
    } finally {
        boton.disabled = false;
        boton.textContent = "Confirmar pago";
    }
}


// =============================================
// ELIMINAR PAGO MENSUAL
// =============================================

async function pagosEliminarRegistro(clienteId, mes) {
    try {
        const db = pagosObtenerConexion();

        if (!db) {
            mostrarNotificacion(
                "Error",
                "No hay conexión con la base de datos.",
                "error"
            );
            return false;
        }

        const usuario = await pagosObtenerUsuario();

        if (!usuario || !usuario.id) {
            mostrarNotificacion(
                "Error",
                "Debes iniciar sesión para eliminar un pago.",
                "error"
            );
            return false;
        }

        const periodo = pagosPrimerDia(mes);

        const { data, error } = await db
            .from("pagos_mensuales")
            .delete()
            .eq("user_id", usuario.id)
            .eq("cliente_id", String(clienteId))
            .eq("periodo", periodo)
            .select("id");

        if (error) {
            console.error(
                "Error al eliminar el pago:",
                error
            );

            mostrarNotificacion(
                "Error",
                "No se pudo eliminar el pago. Verifica los permisos de Supabase.",
                "error"
            );
            return false;
        }

        if (!data || data.length === 0) {
            mostrarNotificacion(
                "Aviso",
                "No se encontró el pago para eliminar.",
                "error"
            );
            return false;
        }

        mostrarNotificacion(
            "Éxito",
            "El pago se eliminó correctamente.",
            "exito"
        );

        await pagosCargarRegistros();

        return true;

    } catch (error) {
        console.error(
            "Error inesperado al eliminar el pago:",
            error
        );

        mostrarNotificacion(
            "Error",
            "Ocurrió un problema al eliminar el pago.",
            "error"
        );

        return false;
    }
}

/* =====================================================
   EVENTOS DEL MÓDULO
===================================================== */

function pagosInicializarEventos() {
    const botonNuevo = pagosElemento("btnRegistrarPago");
    const botonCerrar = pagosElemento("cerrarModalPago");
    const botonCancelar = pagosElemento("cancelarModalPago");
    const formulario = pagosElemento("formRegistrarPago");
    const periodo = pagosElemento("pagosPeriodo");
    const filtro = pagosElemento("pagosFiltroEstado");
    const buscar = pagosElemento("pagosBuscar");
    const cliente = pagosElemento("pagoCliente");
    const periodoModal = pagosElemento("pagoPeriodo");
    const cuerpo = pagosElemento("pagosTablaCuerpo");

    if (periodo && !periodo.value) {
        periodo.value = pagosMesActual();
    }

    if (periodoModal && !periodoModal.value) {
        periodoModal.value = pagosMesActual();
    }

    if (botonNuevo) {
        botonNuevo.addEventListener("click", () => pagosAbrirModal());
    }

    if (botonCerrar) {
        botonCerrar.addEventListener("click", pagosCerrarModal);
    }

    if (botonCancelar) {
        botonCancelar.addEventListener("click", pagosCerrarModal);
    }

    if (formulario) {
        formulario.addEventListener("submit", pagosGuardar);
    }

    if (periodo) {
        periodo.addEventListener("change", async () => {
            await pagosCargarRegistros();
        });
    }

    if (filtro) {
        filtro.addEventListener("change", pagosRenderizar);
    }

    if (buscar) {
        buscar.addEventListener("input", pagosRenderizar);
    }

    if (cliente) {
        cliente.addEventListener("change", pagosActualizarMonto);
    }

    if (periodoModal) {
        periodoModal.addEventListener("change", () => {
            pagosLlenarSelectClientes();
            pagosActualizarMonto();
        });
    }

    if (cuerpo) {
    cuerpo.addEventListener("click", async event => {

        // ELIMINAR UN PAGO
        const botonEliminar = event.target.closest(
            "[data-pagos-eliminar]"
        );

        if (botonEliminar) {
            const clienteId = botonEliminar.getAttribute(
                "data-pagos-eliminar"
            );

            const periodoSeleccionado = pagosElemento(
                "pagosPeriodo"
            );

            const mes = periodoSeleccionado
                ? periodoSeleccionado.value
                : pagosMesActual();

            pagosConfirmarEliminacion(clienteId, mes);
            return;
        }

        // REGISTRAR UN PAGO
        const botonRegistrar = event.target.closest(
            "[data-pagos-registrar]"
        );

        if (botonRegistrar) {
            pagosAbrirModal(
                botonRegistrar.getAttribute(
                    "data-pagos-registrar"
                )
            );
        }
    });
}

    const modal = pagosElemento("modalRegistrarPago");

    if (modal) {
        modal.addEventListener("click", event => {
            if (event.target === modal) {
                pagosCerrarModal();
            }
        });
    }

    // Al abrir la sección Pagos, consulta los datos actualizados.
    document.querySelectorAll('[data-seccion="pagos"]').forEach(boton => {
        boton.addEventListener("click", () => {
            setTimeout(() => {
                pagosCargarRegistros();
            }, 100);
        });
    });
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        pagosInicializarEventos,
        { once: true }
    );
} else {
    pagosInicializarEventos();
}


// =============================================
// CONFIRMACIÓN PARA ELIMINAR PAGOS
// =============================================

let pagoPendienteEliminar = null;

function pagosConfirmarEliminacion(clienteId, mes) {
    const modal = document.getElementById(
        "modalConfirmarEliminarPago"
    );

    if (!modal) {
        console.error(
            "No existe el modal modalConfirmarEliminarPago en el HTML."
        );

        mostrarNotificacion(
            "Error",
            "No se encontró la ventana de confirmación.",
            "error"
        );
        return;
    }

    pagoPendienteEliminar = {
        clienteId: String(clienteId),
        mes: mes
    };

    // Mostrar el modal
    modal.classList.add("abierto");
    modal.style.display = "flex";
}

function pagosCerrarConfirmacion() {
    const modal = document.getElementById(
        "modalConfirmarEliminarPago"
    );

    if (modal) {
        modal.classList.remove("abierto");
        modal.style.display = "none";
    }

    pagoPendienteEliminar = null;
}


// =============================================
// EVENTOS DEL MODAL PARA ELIMINAR PAGOS
// =============================================

function pagosConfigurarModalEliminar() {
    const modal = document.getElementById(
        "modalConfirmarEliminarPago"
    );

    const cancelar = document.getElementById(
        "cancelarEliminarPago"
    );

    const aceptar = document.getElementById(
        "aceptarEliminarPago"
    );

    if (!modal || !cancelar || !aceptar) {
        console.error(
            "No se encontró el modal de confirmación. Revisa el HTML."
        );
        return;
    }

    // Evitar registrar los eventos dos veces
    if (modal.dataset.eventosConfigurados === "true") {
        return;
    }

    modal.dataset.eventosConfigurados = "true";

    // Cerrar al pulsar Cancelar
    cancelar.addEventListener("click", () => {
        pagosCerrarConfirmacion();
    });

    // Cerrar al pulsar fuera de la ventana
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            pagosCerrarConfirmacion();
        }
    });

    // Confirmar la eliminación
    aceptar.addEventListener("click", async () => {
        if (!pagoPendienteEliminar) {
            return;
        }

        const pago = { ...pagoPendienteEliminar };

        aceptar.disabled = true;
        aceptar.textContent = "Eliminando...";

        try {
            const eliminado = await pagosEliminarRegistro(
                pago.clienteId,
                pago.mes
            );

            if (eliminado) {
                pagosCerrarConfirmacion();
            }
        } finally {
            aceptar.disabled = false;
            aceptar.textContent = "Sí, eliminar";
        }
    });
}

// Inicializar cuando el HTML esté disponible
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        pagosConfigurarModalEliminar
    );
} else {
    pagosConfigurarModalEliminar();
}


activarEdicionPerfil();
activarGuardadoPerfil();


/* ======================================================
   37. INICIAR LA APLICACIÓN
====================================================== */

comprobarSesion();
