// ======================================================
// CONFIGURACIÓN DE SUPABASE
// ======================================================

const SUPABASE_URL = "https://pmbcvhkyfoppvyrnuztn.supabase.co";

// PEGA AQUÍ TU CLAVE PUBLISHABLE / ANON DE SUPABASE
const SUPABASE_ANON_KEY = "sb_publishable_yrZYYb4J2qqZmKTq05T35Q_2DBWRDMY";


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
// ELEMENTOS
// ======================================================

const pantallaAcceso =
    document.getElementById("pantallaAcceso");

const aplicacion =
    document.getElementById("aplicacion");

const formLogin =
    document.getElementById("formLogin");

const accesoCorreo =
    document.getElementById("accesoCorreo");

const accesoPassword =
    document.getElementById("accesoPassword");

const btnAcceso =
    document.getElementById("btnAcceso");

const mensajeAcceso =
    document.getElementById("mensajeAcceso");

const btnCambiarAcceso =
    document.getElementById("btnCambiarAcceso");

const btnCerrarSesion =
    document.getElementById("btnCerrarSesion");

const nombreUsuario =
    document.getElementById("nombreUsuario");

const avatarUsuario =
    document.getElementById("avatarUsuario");


// ======================================================
// MODAL CLIENTE
// ======================================================

const modalCliente =
    document.getElementById("modalCliente");

const formCliente =
    document.getElementById("formCliente");

const tituloModal =
    document.getElementById("tituloModal");

const cerrarModal =
    document.getElementById("cerrarModal");

const cancelarCliente =
    document.getElementById("cancelarCliente");

const btnNuevoCliente =
    document.getElementById("btnNuevoCliente");


// ======================================================
// CAMPOS CLIENTE
// ======================================================

const nombre =
    document.getElementById("nombre");

const cedula =
    document.getElementById("cedula");

const telefono =
    document.getElementById("telefono");

const correo =
    document.getElementById("correo");

const direccion =
    document.getElementById("direccion");

const mac =
    document.getElementById("mac");

const cto =
    document.getElementById("cto");

const puerto =
    document.getElementById("puerto");

const plan =
    document.getElementById("plan");

const precio =
    document.getElementById("precio");

const fecha =
    document.getElementById("fecha");

const estado =
    document.getElementById("estado");

const contrato =
    document.getElementById("contrato");

const archivoSeleccionado =
    document.getElementById("archivoSeleccionado");


// ======================================================
// CLIENTES
// ======================================================

const listaClientes =
    document.getElementById("listaClientes");

const buscarCliente =
    document.getElementById("buscarCliente");


// ======================================================
// MODAL ELIMINAR
// ======================================================

const modalEliminar =
    document.getElementById("modalEliminar");

const nombreEliminar =
    document.getElementById("nombreEliminar");

const cancelarEliminar =
    document.getElementById("cancelarEliminar");

const confirmarEliminar =
    document.getElementById("confirmarEliminar");


// ======================================================
// MODAL VER CLIENTE
// ======================================================

const modalVerCliente =
    document.getElementById("modalVerCliente");

const cerrarVerCliente =
    document.getElementById("cerrarVerCliente");

const verNombre =
    document.getElementById("verNombre");

const verTelefono =
    document.getElementById("verTelefono");

const verCedula =
    document.getElementById("verCedula");

const verCorreo =
    document.getElementById("verCorreo");

const verDireccion =
    document.getElementById("verDireccion");

const verMac =
    document.getElementById("verMac");

const verCto =
    document.getElementById("verCto");

const verPuerto =
    document.getElementById("verPuerto");

const verPlan =
    document.getElementById("verPlan");

const verPrecio =
    document.getElementById("verPrecio");

const verEstado =
    document.getElementById("verEstado");

const verFecha =
    document.getElementById("verFecha");

const verContrato =
    document.getElementById("verContrato");


// ======================================================
// ESTADÍSTICAS
// ======================================================

const totalClientes =
    document.getElementById("totalClientes");

const clientesActivos =
    document.getElementById("clientesActivos");

const ingresosMes =
    document.getElementById("ingresosMes");

const pagosPendientes =
    document.getElementById("pagosPendientes");


// ======================================================
// NAVEGACIÓN
// ======================================================

const botonesMenu =
    document.querySelectorAll(".menu-item");


const seccionesMenu = {

    inicio:
        document.getElementById("seccionInicio"),

    clientes:
        document.getElementById("seccionClientes"),

    pagos:
        document.getElementById("seccionPagos"),

    contratos:
        document.getElementById("seccionContratos"),

    equipos:
        document.getElementById("seccionEquipos"),

    soporte:
        document.getElementById("seccionSoporte")

};


// ======================================================
// MOSTRAR SECCIÓN
// ======================================================

function mostrarSeccion(nombreSeccion) {

    Object.values(seccionesMenu).forEach(seccion => {

        if (seccion) {

            seccion.style.display = "none";

            seccion.classList.remove("mostrar");

        }

    });


    botonesMenu.forEach(boton => {

        boton.classList.remove("activo");

        boton.classList.remove("seleccionado");

    });


    const seccion =
        seccionesMenu[nombreSeccion];


    if (seccion) {

        seccion.style.display = "block";

        seccion.classList.add("mostrar");

    }


    const botonActivo =
        document.querySelector(
            `.menu-item[data-seccion="${nombreSeccion}"]`
        );


    if (botonActivo) {

        botonActivo.classList.add("activo");

        botonActivo.classList.add("seleccionado");

    }

}


// ======================================================
// EVENTOS DEL MENÚ
// ======================================================

botonesMenu.forEach(boton => {

    boton.addEventListener("click", function () {

        const seccion =
            this.dataset.seccion;

        mostrarSeccion(seccion);

    });

});


// ======================================================
// MOSTRAR / OCULTAR APLICACIÓN
// ======================================================

function mostrarAplicacion() {

    pantallaAcceso.style.display = "none";

    aplicacion.style.display = "flex";

}


function mostrarLogin() {

    pantallaAcceso.style.display = "flex";

    aplicacion.style.display = "none";

}


// ======================================================
// MENSAJE DE LOGIN
// ======================================================

function mostrarMensajeAcceso(
    mensaje,
    tipo = ""
) {

    mensajeAcceso.textContent = mensaje;

    mensajeAcceso.className =
        "mensaje-acceso " + tipo;

}


// ======================================================
// CAMPO DE NOMBRE PARA REGISTRO
// ======================================================

function crearCampoNombreRegistro() {

    let campoNombre =
        document.getElementById("nombreRegistro");

    if (campoNombre) {
        return campoNombre;
    }


    const contenedor =
        document.createElement("div");

    contenedor.id =
        "contenedorNombreRegistro";

    contenedor.style.marginBottom =
        "12px";


    campoNombre =
        document.createElement("input");

    campoNombre.type =
        "text";

    campoNombre.id =
        "nombreRegistro";

    campoNombre.name =
        "nombreRegistro";

    campoNombre.placeholder =
        "Nombre completo";

    campoNombre.autocomplete =
        "name";

    campoNombre.style.width =
        "100%";

    campoNombre.style.boxSizing =
        "border-box";


    const campoCorreo =
        accesoCorreo;


    campoCorreo.parentNode.insertBefore(
        contenedor,
        campoCorreo
    );


    contenedor.appendChild(
        campoNombre
    );


    return campoNombre;

}


function eliminarCampoNombreRegistro() {

    const contenedor =
        document.getElementById(
            "contenedorNombreRegistro"
        );

    if (contenedor) {

        contenedor.remove();

    }

}


// ======================================================
// LOGIN / REGISTRO
// ======================================================

let modoRegistro = false;


btnCambiarAcceso.addEventListener(
    "click",
    function () {

        modoRegistro = !modoRegistro;


        if (modoRegistro) {

            document.getElementById("tituloAcceso").textContent =
                "Crear cuenta";

            document.getElementById("textoAcceso").textContent =
                "Crea tu cuenta para ingresar al panel";

            btnAcceso.textContent =
                "Crear cuenta";

            btnCambiarAcceso.textContent =
                "Ya tengo una cuenta";


            crearCampoNombreRegistro();


        } else {

            document.getElementById("tituloAcceso").textContent =
                "Sistecfiber";

            document.getElementById("textoAcceso").textContent =
                "Inicia sesión para ingresar al panel";

            btnAcceso.textContent =
                "Iniciar sesión";

            btnCambiarAcceso.textContent =
                "Crear una cuenta";


            eliminarCampoNombreRegistro();

        }


        mostrarMensajeAcceso("");

    }
);


formLogin.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            accesoCorreo.value.trim();

        const password =
            accesoPassword.value;


        if (!email || !password) {

            mostrarMensajeAcceso(
                "Completa todos los campos.",
                "error"
            );

            return;

        }


        btnAcceso.disabled = true;


        // ==================================================
        // REGISTRO
        // ==================================================

        if (modoRegistro) {

            const campoNombre =
                document.getElementById(
                    "nombreRegistro"
                );


            const nombrePersona =
                campoNombre
                    ? campoNombre.value.trim()
                    : "";


            if (!nombrePersona) {

                mostrarMensajeAcceso(
                    "Escribe tu nombre completo.",
                    "error"
                );

                btnAcceso.disabled = false;

                return;

            }


            mostrarMensajeAcceso(
                "Creando cuenta..."
            );


            const {
                data,
                error
            } =
                await supabaseClient.auth.signUp({

                    email: email,

                    password: password,

                    options: {

                        data: {

                            nombre:
                                nombrePersona

                        }

                    }

                });


            if (error) {

                console.error(error);

                mostrarMensajeAcceso(
                    error.message,
                    "error"
                );

                btnAcceso.disabled = false;

                return;

            }


            mostrarMensajeAcceso(
                "Cuenta creada correctamente. Revisa tu correo si Supabase solicita confirmación.",
                "exito"
            );


            btnAcceso.disabled = false;

            return;

        }


        // ==================================================
        // INICIAR SESIÓN
        // ==================================================

        mostrarMensajeAcceso(
            "Iniciando sesión..."
        );


        const {
            data,
            error
        } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        if (error) {

            console.error(error);

            mostrarMensajeAcceso(
                error.message,
                "error"
            );

            btnAcceso.disabled = false;

            return;

        }


        mostrarMensajeAcceso(
            "Sesión iniciada correctamente.",
            "exito"
        );


        btnAcceso.disabled = false;

    }
);


// ======================================================
// CERRAR SESIÓN
// ======================================================

btnCerrarSesion.addEventListener(
    "click",
    async function () {

        await supabaseClient.auth.signOut();

        clientes = [];

        listaClientes.innerHTML = "";

        mostrarLogin();

    }
);


// ======================================================
// CAMBIO DE SESIÓN
// ======================================================

supabaseClient.auth.onAuthStateChange(
    async function (event, session) {

        if (session) {

            mostrarAplicacion();

            actualizarUsuario(
                session.user
            );

            await cargarClientes();

            mostrarSeccion("inicio");

        } else {

            mostrarLogin();

        }

    }
);


// ======================================================
// ACTUALIZAR USUARIO
// ======================================================

function actualizarUsuario(usuario) {

    if (!usuario) {
        return;
    }


    const email =
        usuario.email || "Administrador";


    const nombrePersona =
        usuario.user_metadata?.nombre ||
        "Administrador";


    nombreUsuario.textContent =
        nombrePersona;


    avatarUsuario.textContent =
        nombrePersona
            .charAt(0)
            .toUpperCase();

}


// ======================================================
// COMPROBAR SESIÓN AL CARGAR
// ======================================================

async function comprobarSesion() {

    const {
        data,
        error
    } =
        await supabaseClient.auth.getSession();


    if (error) {

        console.error(error);

        mostrarLogin();

        return;

    }


    if (data.session) {

        mostrarAplicacion();

        actualizarUsuario(
            data.session.user
        );

        await cargarClientes();

        mostrarSeccion("inicio");

    } else {

        mostrarLogin();

    }

}


// ======================================================
// CARGAR CLIENTES DESDE SUPABASE
// ======================================================

async function cargarClientes() {

    listaClientes.innerHTML =
        "<p>Cargando clientes...</p>";


    const {
        data,
        error
    } =
        await supabaseClient
            .from("Clientes")
            .select("*")
            .order("id", {
                ascending: false
            });


    if (error) {

        console.error(
            "Error cargando clientes:",
            error
        );

        listaClientes.innerHTML =
            "<p>No se pudieron cargar los clientes.</p>";

        return;

    }


    clientes =
        data || [];


    mostrarClientes(
        clientes
    );


    actualizarEstadisticas();

}


// ======================================================
// MOSTRAR CLIENTES
// ======================================================

function mostrarClientes(
    lista
) {

    listaClientes.innerHTML = "";


    if (!lista || lista.length === 0) {

        listaClientes.innerHTML = `

            <div class="menu-extra-vacio">

                <h3>
                    No hay clientes
                </h3>

                <p>
                    Todavía no has registrado ningún cliente.
                </p>

            </div>

        `;

        return;

    }


    lista.forEach(cliente => {

        const card =
            document.createElement("div");


        card.className =
            "cliente-card";


        const estadoCliente =
            cliente.estado || "Activo";


        card.innerHTML = `

            <div class="cliente-top">

                <div>

                    <h3>
                        ${escaparHTML(
                            cliente.nombre || "Sin nombre"
                        )}
                    </h3>

                    <span class="estado ${estadoCliente
                        .toLowerCase()
                        .replaceAll(" ", "-")}">

                        ${escaparHTML(
                            estadoCliente
                        )}

                    </span>

                </div>

            </div>


            <div class="cliente-datos">

                <p>
                    <strong>Teléfono:</strong>
                    ${escaparHTML(
                        cliente.telefono || "No registrado"
                    )}
                </p>

                <p>
                    <strong>Dirección:</strong>
                    ${escaparHTML(
                        cliente.direccion || "No registrada"
                    )}
                </p>

                <p>
                    <strong>Plan:</strong>
                    ${escaparHTML(
                        cliente.plan || "No registrado"
                    )}
                </p>

            </div>


            <div class="cliente-botones">

                <button
                    type="button"
                    class="btn-secondary btn-ver-cliente">

                    Ver

                </button>


                <button
                    type="button"
                    class="btn-primary btn-editar-cliente">

                    Editar

                </button>


                <button
                    type="button"
                    class="btn-danger btn-eliminar-cliente">

                    Eliminar

                </button>

            </div>

        `;


        const botonVer =
            card.querySelector(
                ".btn-ver-cliente"
            );


        const botonEditar =
            card.querySelector(
                ".btn-editar-cliente"
            );


        const botonEliminar =
            card.querySelector(
                ".btn-eliminar-cliente"
            );


        botonVer.addEventListener(
            "click",
            function () {

                abrirModalVerCliente(
                    cliente
                );

            }
        );


        botonEditar.addEventListener(
            "click",
            function () {

                abrirModalEditar(
                    cliente
                );

            }
        );


        botonEliminar.addEventListener(
            "click",
            function () {

                abrirModalEliminar(
                    cliente
                );

            }
        );


        listaClientes.appendChild(
            card
        );

    });

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

buscarCliente.addEventListener(
    "input",
    function () {

        const texto =
            this.value
                .trim()
                .toLowerCase();


        if (!texto) {

            mostrarClientes(
                clientes
            );

            return;

        }


        const filtrados =
            clientes.filter(cliente => {

                return (

                    String(
                        cliente.nombre || ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        cliente.telefono || ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        cliente.direccion || ""
                    )
                        .toLowerCase()
                        .includes(texto)

                );

            });


        mostrarClientes(
            filtrados
        );

    }
);


// ======================================================
// ABRIR MODAL NUEVO CLIENTE
// ======================================================

btnNuevoCliente.addEventListener(
    "click",
    function () {

        abrirModalCliente();

    }
);


function abrirModalCliente() {

    clienteEditando = null;


    tituloModal.textContent =
        "Nuevo cliente";


    formCliente.reset();


    archivoSeleccionado.textContent =
        "";


    if (modalCliente) {

        modalCliente.classList.add("activo");

        modalCliente.style.display = "flex";

    }

}


// ======================================================
// ABRIR MODAL EDITAR
// ======================================================

function abrirModalEditar(
    cliente
) {

    clienteEditando =
        cliente;


    tituloModal.textContent =
        "Editar cliente";


    nombre.value =
        cliente.nombre || "";

    cedula.value =
        cliente.identificacion || "";

    telefono.value =
        cliente.telefono || "";

    correo.value =
        cliente.correo || "";

    direccion.value =
        cliente.direccion || "";

    mac.value =
        cliente.mac || "";

    cto.value =
        cliente.cto || "";

    puerto.value =
        cliente.puerto || "";

    plan.value =
        cliente.plan || "300 Mbps";

    precio.value =
        cliente.precio || "";

    fecha.value =
        cliente.fecha || "";

    estado.value =
        cliente.estado || "Activo";


    archivoSeleccionado.textContent =
        cliente.contrato_nombre
            ? `Contrato actual: ${cliente.contrato_nombre}`
            : "";


    modalCliente.classList.add("activo");

    modalCliente.style.display =
        "flex";

}


// ======================================================
// CERRAR MODAL CLIENTE
// ======================================================

function cerrarModalCliente() {

    modalCliente.classList.remove(
        "activo"
    );

    modalCliente.style.display =
        "none";

    clienteEditando = null;

    formCliente.reset();

    archivoSeleccionado.textContent =
        "";

}


cerrarModal.addEventListener(
    "click",
    cerrarModalCliente
);


cancelarCliente.addEventListener(
    "click",
    cerrarModalCliente
);


// ======================================================
// MOSTRAR ARCHIVO SELECCIONADO
// ======================================================

contrato.addEventListener(
    "change",
    function () {

        if (this.files.length > 0) {

            archivoSeleccionado.textContent =
                "Archivo seleccionado: " +
                this.files[0].name;

        } else {

            archivoSeleccionado.textContent =
                "";

        }

    }
);


// ======================================================
// NOTIFICACIONES BONITAS
// ======================================================

function mostrarNotificacion(
    titulo,
    mensaje,
    tipo = "exito"
) {

    const anterior =
        document.querySelector(
            ".notificacion-sistecfiber"
        );


    if (anterior) {

        anterior.remove();

    }


    const notificacion =
        document.createElement("div");


    notificacion.className =
        `notificacion-sistecfiber notificacion-${tipo}`;


    const icono =
        tipo === "exito"
            ? "✓"
            : "✕";


    notificacion.innerHTML = `

        <div class="notificacion-icono">
            ${icono}
        </div>

        <div class="notificacion-contenido">

            <div class="notificacion-titulo">
                ${titulo}
            </div>

            <div class="notificacion-mensaje">
                ${mensaje}
            </div>

        </div>

    `;


    document.body.appendChild(
        notificacion
    );


    setTimeout(() => {

        notificacion.classList.add(
            "notificacion-saliendo"
        );


        setTimeout(() => {

            notificacion.remove();

        }, 250);


    }, 3000);

}


// ======================================================
// GUARDAR CLIENTE
// ======================================================

formCliente.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const botonGuardar =
            formCliente.querySelector(
                'button[type="submit"]'
            );


        botonGuardar.disabled =
            true;


        try {

            let rutaContrato =
                clienteEditando?.contrato_ruta ||
                null;

            let nombreContrato =
                clienteEditando?.contrato_nombre ||
                null;


            // ------------------------------------------
            // SUBIR CONTRATO
            // ------------------------------------------

            if (
                contrato.files &&
                contrato.files.length > 0
            ) {

                const archivo =
                    contrato.files[0];


                const nombreArchivo =
                    Date.now() +
                    "_" +
                    archivo.name
                        .replace(
                            /[^a-zA-Z0-9._-]/g,
                            "_"
                        );


                const {
                    data: {
                        user
                    }
                } = await supabaseClient.auth.getUser();


                if (!user) {

                    mostrarNotificacion(
                        "Sesión no encontrada",
                        "No se encontró el usuario autenticado.",
                        "error"
                    );

                    botonGuardar.disabled =
                        false;

                    return;

                }


                const ruta =
                    user.id +
                    "/contratos/" +
                    nombreArchivo;


                const {
                    error: errorSubida
                } =
                    await supabaseClient
                        .storage
                        .from("documentos")
                        .upload(
                            ruta,
                            archivo,
                            {
                                upsert: false
                            }
                        );


                if (errorSubida) {

                    console.error(
                        errorSubida
                    );


                    mostrarNotificacion(
                        "Error al subir",
                        "No se pudo subir el contrato.",
                        "error"
                    );


                    botonGuardar.disabled =
                        false;

                    return;

                }


                rutaContrato =
                    ruta;

                nombreContrato =
                    archivo.name;

            }


            // ------------------------------------------
            // DATOS
            // ------------------------------------------

            const datosCliente = {

                nombre:
                    nombre.value.trim(),

                identificacion:
                    cedula.value.trim(),

                telefono:
                    telefono.value.trim(),

                correo:
                    correo.value.trim(),

                direccion:
                    direccion.value.trim(),

                mac:
                    mac.value.trim(),

                cto:
                    cto.value.trim(),

                puerto:
                    puerto.value.trim(),

                plan:
                    plan.value,

                precio:
                    Number(precio.value) || 0,

                fecha:
                    fecha.value || null,

                estado:
                    estado.value,

                contrato_ruta:
                    rutaContrato,

                contrato_nombre:
                    nombreContrato

            };


            // ------------------------------------------
            // EDITAR
            // ------------------------------------------

            if (clienteEditando) {

                const {
                    error
                } =
                    await supabaseClient
                        .from("Clientes")
                        .update(
                            datosCliente
                        )
                        .eq(
                            "id",
                            clienteEditando.id
                        );


                if (error) {

                    console.error(
                        "Error actualizando:",
                        error
                    );


                    mostrarNotificacion(
                        "No se pudo actualizar",
                        "Revisa los datos e inténtalo nuevamente.",
                        "error"
                    );


                    botonGuardar.disabled =
                        false;

                    return;

                }


                mostrarNotificacion(
                    "Cliente actualizado",
                    "Los datos del cliente se actualizaron correctamente."
                );

            }


            // ------------------------------------------
            // CREAR
            // ------------------------------------------

            else {

                const {
                    error
                } =
                    await supabaseClient
                        .from("Clientes")
                        .insert(
                            datosCliente
                        );


                if (error) {

                    console.error(
                        "Error guardando:",
                        error
                    );


                    mostrarNotificacion(
                        "No se pudo guardar",
                        "Revisa los datos e inténtalo nuevamente.",
                        "error"
                    );


                    botonGuardar.disabled =
                        false;

                    return;

                }


                mostrarNotificacion(
                    "Cliente guardado",
                    "El cliente se agregó correctamente."
                );

            }


            cerrarModalCliente();

            await cargarClientes();

        } catch (error) {

            console.error(
                "Error general:",
                error
            );


            mostrarNotificacion(
                "Ocurrió un error",
                "No se pudo completar la operación.",
                "error"
            );

        }


        botonGuardar.disabled =
            false;

    }
);


// ======================================================
// MODAL VER CLIENTE
// ======================================================

function abrirModalVerCliente(
    cliente
) {

    verNombre.textContent =
        cliente.nombre || "Cliente";

    verTelefono.textContent =
        cliente.telefono || "No registrado";

    verCedula.textContent =
        cliente.identificacion || "No registrada";

    verCorreo.textContent =
        cliente.correo || "No registrado";

    verDireccion.textContent =
        cliente.direccion || "No registrada";

    verMac.textContent =
        cliente.mac || "No registrada";

    verCto.textContent =
        cliente.cto || "No registrado";

    verPuerto.textContent =
        cliente.puerto || "No registrado";

    verPlan.textContent =
        cliente.plan || "No registrado";


    verPrecio.textContent =
        cliente.precio
            ? formatearMoneda(cliente.precio)
            : "$0";


    verEstado.textContent =
        cliente.estado || "No registrado";


    verFecha.textContent =
        cliente.fecha || "No registrada";


    verContrato.innerHTML =
        "";


    if (
        cliente.contrato_ruta
    ) {

        const botonContrato =
            document.createElement(
                "button"
            );


        botonContrato.type =
            "button";


        botonContrato.className =
            "btn-primary";


        botonContrato.textContent =
            "Ver contrato";


        botonContrato.addEventListener(
            "click",
            function () {

                abrirContrato(
                    cliente.contrato_ruta
                );

            }
        );


        verContrato.appendChild(
            botonContrato
        );

    } else {

        verContrato.textContent =
            "No hay contrato cargado.";

    }


    modalVerCliente.classList.add(
        "activo"
    );

    modalVerCliente.style.display =
        "flex";

}


cerrarVerCliente.addEventListener(
    "click",
    function () {

        modalVerCliente.classList.remove(
            "activo"
        );

        modalVerCliente.style.display =
            "none";

    }
);


// ======================================================
// ABRIR CONTRATO
// ======================================================

async function abrirContrato(
    ruta
) {

    const {
        data,
        error
    } =
        await supabaseClient
            .storage
            .from("documentos")
            .createSignedUrl(
                ruta,
                3600
            );


    if (error) {

        console.error(
            error
        );


        mostrarNotificacion(
            "No se pudo abrir",
            "No se pudo abrir el contrato.",
            "error"
        );


        return;

    }


    window.open(
        data.signedUrl,
        "_blank"
    );

}


// ======================================================
// MODAL ELIMINAR
// ======================================================

function abrirModalEliminar(
    cliente
) {

    clienteEliminar =
        cliente;


    nombreEliminar.textContent =
        cliente.nombre || "este cliente";


    modalEliminar.classList.add(
        "activo"
    );

    modalEliminar.style.display =
        "flex";

}


function cerrarModalEliminar() {

    modalEliminar.classList.remove(
        "activo"
    );

    modalEliminar.style.display =
        "none";

    clienteEliminar =
        null;

}


cancelarEliminar.addEventListener(
    "click",
    cerrarModalEliminar
);


confirmarEliminar.addEventListener(
    "click",
    async function () {

        if (!clienteEliminar) {
            return;
        }


        confirmarEliminar.disabled =
            true;


        try {

            // ------------------------------------------
            // ELIMINAR CONTRATO DEL STORAGE
            // ------------------------------------------

            if (
                clienteEliminar.contrato_ruta
            ) {

                const {
                    error:
                        errorStorage
                } =
                    await supabaseClient
                        .storage
                        .from("documentos")
                        .remove([
                            clienteEliminar.contrato_ruta
                        ]);


                if (errorStorage) {

                    console.warn(
                        "No se pudo eliminar el archivo:",
                        errorStorage
                    );

                }

            }


            // ------------------------------------------
            // ELIMINAR CLIENTE
            // ------------------------------------------

            const {
                error
            } =
                await supabaseClient
                    .from("Clientes")
                    .delete()
                    .eq(
                        "id",
                        clienteEliminar.id
                    );


            if (error) {

                console.error(
                    error
                );


                mostrarNotificacion(
                    "No se pudo eliminar",
                    "No fue posible eliminar el cliente.",
                    "error"
                );


                confirmarEliminar.disabled =
                    false;

                return;

            }


            const nombreClienteEliminado =
                clienteEliminar.nombre ||
                "El cliente";


            cerrarModalEliminar();


            mostrarNotificacion(
                "Cliente eliminado",
                `${nombreClienteEliminado} fue eliminado correctamente.`
            );


            await cargarClientes();


        } catch (error) {

            console.error(
                error
            );


            mostrarNotificacion(
                "Ocurrió un error",
                "No se pudo completar la eliminación.",
                "error"
            );

        }


        confirmarEliminar.disabled =
            false;

    }
);


// ======================================================
// ESTADÍSTICAS
// ======================================================

function actualizarEstadisticas() {

    const total =
        clientes.length;


    const activos =
        clientes.filter(
            cliente =>
                cliente.estado === "Activo"
        ).length;


    const ingresos =
        clientes
            .filter(
                cliente =>
                    cliente.estado === "Activo"
            )
            .reduce(
                (
                    total,
                    cliente
                ) =>
                    total +
                    Number(
                        cliente.precio || 0
                    ),
                0
            );


    totalClientes.textContent =
        total;


    clientesActivos.textContent =
        activos;


    ingresosMes.textContent =
        formatearMoneda(
            ingresos
        );


    pagosPendientes.textContent =
        "$0";

}


// ======================================================
// FORMATO MONEDA
// ======================================================

function formatearMoneda(
    valor
) {

    return new Intl.NumberFormat(
        "es-CO",
        {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }
    ).format(
        Number(valor) || 0
    );

}


// ======================================================
// CERRAR MODALES AL HACER CLICK AFUERA
// ======================================================

window.addEventListener(
    "click",
    function (event) {

        if (
            event.target === modalCliente
        ) {

            cerrarModalCliente();

        }


        if (
            event.target === modalEliminar
        ) {

            cerrarModalEliminar();

        }


        if (
            event.target === modalVerCliente
        ) {

            modalVerCliente.classList.remove(
                "activo"
            );

            modalVerCliente.style.display =
                "none";

        }

    }
);


// ======================================================
// ESCAPE PARA CERRAR MODALES
// ======================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            cerrarModalCliente();

            cerrarModalEliminar();

            modalVerCliente.classList.remove(
                "activo"
            );

            modalVerCliente.style.display =
                "none";

        }

    }
);


// ======================================================
// INICIAR
// ======================================================

mostrarSeccion("inicio");

comprobarSesion();

