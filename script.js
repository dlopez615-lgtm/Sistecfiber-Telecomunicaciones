/* ==================================================
   SISTEMA DE CLIENTES - SISTECFIBER
================================================== */

let clientes = [];
let clienteEditando = null;
let clienteAEliminar = null;

const modalCliente = document.getElementById("modalCliente");
const modalEliminar = document.getElementById("modalEliminar");
const modalVerCliente = document.getElementById("modalVerCliente");

const formCliente = document.getElementById("formCliente");
const listaClientes = document.getElementById("listaClientes");
const buscarCliente = document.getElementById("buscarCliente");

const btnNuevoCliente = document.getElementById("btnNuevoCliente");
const cerrarModal = document.getElementById("cerrarModal");
const cancelarCliente = document.getElementById("cancelarCliente");

const cancelarEliminar = document.getElementById("cancelarEliminar");
const confirmarEliminar = document.getElementById("confirmarEliminar");

const cerrarVerCliente = document.getElementById("cerrarVerCliente");

const archivoInput = document.getElementById("contrato");
const archivoSeleccionado = document.getElementById("archivoSeleccionado");


/* ==================================================
   FORMATO MAC, CTO Y PUERTO
================================================== */

const campoMAC = document.getElementById("mac");
const campoCTO = document.getElementById("cto");
const campoPuerto = document.getElementById("puerto");

if (campoMAC) {
    campoMAC.addEventListener("input", function () {
        this.value = this.value
            .toUpperCase()
            .replace(/[^A-Z0-9:-]/g, "");
    });
}

if (campoCTO) {
    campoCTO.addEventListener("input", function () {
        this.value = this.value
            .toUpperCase()
            .replace(/[^A-Z0-9-]/g, "");
    });
}

if (campoPuerto) {
    campoPuerto.addEventListener("input", function () {
        this.value = this.value
            .toUpperCase()
            .replace(/[^A-Z0-9-]/g, "");
    });
}


/* ==================================================
   SUPABASE
================================================== */

const SUPABASE_URL = "https://pmbcvhkyfoppvyrnuztn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_yrZYYb4J2qqZmKTq05T35Q_2DBWRDMY";

let supabaseDB = null;
let usuarioActual = null;

function supabaseConfigurado() {
    return (
        SUPABASE_URL &&
        SUPABASE_PUBLISHABLE_KEY &&
        !SUPABASE_URL.includes("PEGA_AQUI") &&
        !SUPABASE_PUBLISHABLE_KEY.includes("PEGA_AQUI")
    );
}


/* ==================================================
   ACCESO
================================================== */

const pantallaAcceso =
    document.getElementById("pantallaAcceso");

const formLogin =
    document.getElementById("formLogin");

const accesoCorreo =
    document.getElementById("accesoCorreo");

const accesoPassword =
    document.getElementById("accesoPassword");

const tituloAcceso =
    document.getElementById("tituloAcceso");

const textoAcceso =
    document.getElementById("textoAcceso");

const btnAcceso =
    document.getElementById("btnAcceso");

const btnCambiarAcceso =
    document.getElementById("btnCambiarAcceso");

const mensajeAcceso =
    document.getElementById("mensajeAcceso");

const btnCerrarSesion =
    document.getElementById("btnCerrarSesion");

const nombreUsuario =
    document.getElementById("nombreUsuario");

let modoRegistro = false;


function mostrarMensajeAcceso(mensaje, error = true) {

    if (!mensajeAcceso) return;

    mensajeAcceso.textContent = mensaje;

    mensajeAcceso.style.color =
        error ? "#dc2626" : "#15803d";
}


function configurarModoAcceso() {

    if (modoRegistro) {

        tituloAcceso.textContent =
            "Crear cuenta";

        textoAcceso.textContent =
            "Crea una cuenta para guardar tu información en la nube";

        btnAcceso.textContent =
            "Crear cuenta";

        btnCambiarAcceso.textContent =
            "Ya tengo una cuenta";

        accesoPassword.autocomplete =
            "new-password";

    } else {

        tituloAcceso.textContent =
            "Iniciar sesión";

        textoAcceso.textContent =
            "Ingresa a tu cuenta para continuar";

        btnAcceso.textContent =
            "Iniciar sesión";

        btnCambiarAcceso.textContent =
            "Crear una cuenta";

        accesoPassword.autocomplete =
            "current-password";
    }

    mostrarMensajeAcceso("");
}


function bloquearAplicacion() {

    if (pantallaAcceso) {
        pantallaAcceso.classList.remove("oculta");
    }
}


function mostrarAplicacion() {

    if (pantallaAcceso) {
        pantallaAcceso.classList.add("oculta");
    }

    const correo =
        usuarioActual?.email || "Usuario";

    if (nombreUsuario) {

        nombreUsuario.textContent =
            correo;

        nombreUsuario.title =
            correo;
    }

    const inicial =
        correo.charAt(0).toUpperCase();

    const avatar =
        document.querySelector(".usuario .avatar");

    if (avatar) {
        avatar.textContent = inicial;
    }
}


/* ==================================================
   INICIAR SESIÓN
================================================== */

async function iniciarSesion() {

    if (!supabaseConfigurado()) {

        mostrarMensajeAcceso(
            "Primero configura la URL y la clave pública de Supabase en script.js."
        );

        return;
    }

    btnAcceso.disabled = true;

    mostrarMensajeAcceso(
        "Ingresando...",
        false
    );

    const { data, error } =
        await supabaseDB.auth.signInWithPassword({

            email:
                accesoCorreo.value.trim(),

            password:
                accesoPassword.value

        });

    btnAcceso.disabled = false;

    if (error) {

        mostrarMensajeAcceso(
            "No se pudo iniciar sesión. Revisa el correo y la contraseña."
        );

        console.error(error);

        return;
    }

    usuarioActual =
        data.user;

    formLogin.reset();

    mostrarAplicacion();

    await cargarClientes();
}


/* ==================================================
   CREAR CUENTA
================================================== */

async function crearCuenta() {

    if (!supabaseConfigurado()) {

        mostrarMensajeAcceso(
            "Primero configura la URL y la clave pública de Supabase en script.js."
        );

        return;
    }

    btnAcceso.disabled = true;

    mostrarMensajeAcceso(
        "Creando cuenta...",
        false
    );

    const { data, error } =
        await supabaseDB.auth.signUp({

            email:
                accesoCorreo.value.trim(),

            password:
                accesoPassword.value

        });

    btnAcceso.disabled = false;

    if (error) {

        mostrarMensajeAcceso(
            error.message
        );

        return;
    }

    if (data.session && data.user) {

        usuarioActual =
            data.user;

        formLogin.reset();

        mostrarAplicacion();

        await cargarClientes();

        return;
    }

    mostrarMensajeAcceso(
        "Cuenta creada. Revisa tu correo para confirmar la cuenta.",
        false
    );

    modoRegistro = false;

    configurarModoAcceso();
}


/* ==================================================
   EVENTOS DE ACCESO
================================================== */

formLogin.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        if (modoRegistro) {

            await crearCuenta();

        } else {

            await iniciarSesion();

        }

    }
);


btnCambiarAcceso.addEventListener(
    "click",
    function () {

        modoRegistro =
            !modoRegistro;

        configurarModoAcceso();

    }
);


btnCerrarSesion.addEventListener(
    "click",
    async function () {

        if (!supabaseDB) {
            return;
        }

        await supabaseDB.auth.signOut();

        usuarioActual = null;

        clientes = [];

        renderizarClientes();

        actualizarEstadisticas();

        bloquearAplicacion();

    }
);


/* ==================================================
   INICIAR SISTEMA
================================================== */

async function iniciarSistema() {

    configurarModoAcceso();

    bloquearAplicacion();

    if (!supabaseConfigurado()) {

        mostrarMensajeAcceso(
            "Falta configurar Supabase en script.js."
        );

        return;
    }

    const { createClient } =
        window.supabase;

    supabaseDB =
        createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY,
            {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            }
        );

    const {
        data: { user }
    } =
        await supabaseDB.auth.getUser();

    if (user) {

        usuarioActual =
            user;

        mostrarAplicacion();

        await cargarClientes();
    }

    supabaseDB.auth.onAuthStateChange(
        async function (event, session) {

            if (session?.user) {

                usuarioActual =
                    session.user;

                mostrarAplicacion();

            } else if (event === "SIGNED_OUT") {

                usuarioActual = null;

                bloquearAplicacion();
            }

        }
    );
}


/* ==================================================
   CONVERTIR CLIENTE PARA SUPABASE
================================================== */

function clienteParaBaseDatos(cliente) {

    return {

        id:
            cliente.id,

        user_id:
            usuarioActual.id,

        nombre:
            cliente.nombre || "",

        cedula:
            cliente.cedula || "",

        telefono:
            cliente.telefono || "",

        correo:
            cliente.correo || "",

        direccion:
            cliente.direccion || "",

        mac:
            cliente.mac || "",

        cto:
            cliente.cto || "",

        puerto:
            cliente.puerto || "",

        plan:
            cliente.plan || "300 Mbps",

        precio:
            Number(cliente.precio || 0),

        fecha:
            cliente.fecha || null,

        estado:
            cliente.estado || "Activo",

        contrato:
            cliente.contrato || null
    };
}


/* ==================================================
   CARGAR CLIENTES
================================================== */

async function cargarClientes() {

    if (!supabaseDB || !usuarioActual) {

        clientes = [];

        renderizarClientes();

        actualizarEstadisticas();

        return;
    }

    const { data, error } =
        await supabaseDB
            .from("clientes")
            .select("*")
            .eq(
                "user_id",
                usuarioActual.id
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(error);

        alertar(
            "No se pudieron cargar los clientes."
        );

        return;
    }

    clientes =
        data || [];

    renderizarClientes();

    actualizarEstadisticas();
}


/* ==================================================
   SUBIR CONTRATO
================================================== */

async function subirContrato(
    archivo,
    clienteId
) {

    if (!archivo || !usuarioActual) {
        return null;
    }

    const nombreSeguro =
        archivo.name
            .replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
            );

    const ruta =
        `${usuarioActual.id}/${clienteId}/${Date.now()}-${nombreSeguro}`;

    const { error } =
        await supabaseDB
            .storage
            .from("documentos")
            .upload(
                ruta,
                archivo,
                {
                    upsert: true,
                    contentType:
                        archivo.type ||
                        "application/octet-stream"
                }
            );

    if (error) {

        console.error(error);

        throw new Error(
            "No se pudo subir el contrato."
        );
    }

    return {

        nombre:
            archivo.name,

        tipo:
            archivo.type,

        tamaño:
            archivo.size,

        ruta:
            ruta
    };
}


/* ==================================================
   GUARDAR CLIENTE
================================================== */

async function guardarCliente(cliente) {

    if (!supabaseDB || !usuarioActual) {

        alertar(
            "Debes iniciar sesión primero."
        );

        return false;
    }

    const registro =
        clienteParaBaseDatos(
            cliente
        );

    const { error } =
        await supabaseDB
            .from("clientes")
            .upsert(
                registro,
                {
                    onConflict: "id"
                }
            );

    if (error) {

        console.error(error);

        alertar(
            "No se pudo guardar el cliente."
        );

        return false;
    }

    return true;
}


/* ==================================================
   ELIMINAR CLIENTE
================================================== */

async function eliminarClienteDB(
    id
) {

    if (!supabaseDB || !usuarioActual) {
        return false;
    }

    const cliente =
        clientes.find(
            c => c.id === id
        );

    if (
        cliente &&
        cliente.contrato &&
        cliente.contrato.ruta
    ) {

        const { error:
            errorStorage
        } =
            await supabaseDB
                .storage
                .from("documentos")
                .remove([
                    cliente.contrato.ruta
                ]);

        if (errorStorage) {
            console.error(errorStorage);
        }
    }

    const { error } =
        await supabaseDB
            .from("clientes")
            .delete()
            .eq(
                "id",
                id
            )
            .eq(
                "user_id",
                usuarioActual.id
            );

    if (error) {

        console.error(error);

        alertar(
            "No se pudo eliminar el cliente."
        );

        return false;
    }

    return true;
}


/* ==================================================
   VER CONTRATO
================================================== */

async function verContrato(
    id
) {

    const cliente =
        clientes.find(
            c => c.id === id
        );

    if (
        !cliente ||
        !cliente.contrato
    ) {

        alertar(
            "Este cliente no tiene contrato."
        );

        return;
    }

    if (
        cliente.contrato.ruta &&
        supabaseDB
    ) {

        const { data, error } =
            await supabaseDB
                .storage
                .from("documentos")
                .createSignedUrl(
                    cliente.contrato.ruta,
                    3600
                );

        if (error) {

            console.error(error);

            alertar(
                "No se pudo abrir el contrato."
            );

            return;
        }

        window.open(
            data.signedUrl,
            "_blank"
        );

        return;
    }

    if (cliente.contrato.archivo) {

        try {

            const binario =
                atob(
                    cliente.contrato.archivo
                );

            const bytes =
                new Uint8Array(
                    binario.length
                );

            for (
                let i = 0;
                i < binario.length;
                i++
            ) {

                bytes[i] =
                    binario.charCodeAt(i);
            }

            const blob =
                new Blob(
                    [bytes],
                    {
                        type:
                            cliente.contrato.tipo ||
                            "application/octet-stream"
                    }
                );

            const url =
                URL.createObjectURL(
                    blob
                );

            window.open(
                url,
                "_blank"
            );

            setTimeout(
                () =>
                    URL.revokeObjectURL(url),
                60000
            );

        } catch (error) {

            console.error(error);

            alertar(
                "No se pudo abrir el archivo."
            );
        }
    }
}
/* ==================================================
   ESTADÍSTICAS
================================================== */

function actualizarEstadisticas() {

    const totalClientes =
        document.getElementById("totalClientes");

    const clientesActivos =
        document.getElementById("clientesActivos");

    const ingresosMes =
        document.getElementById("ingresosMes");

    const pagosPendientes =
        document.getElementById("pagosPendientes");


    if (totalClientes) {

        totalClientes.textContent =
            clientes.length;
    }


    const activos =
        clientes.filter(
            cliente =>
                cliente.estado === "Activo"
        ).length;


    if (clientesActivos) {

        clientesActivos.textContent =
            activos;
    }


    const ingresos =
        clientes
            .filter(
                cliente =>
                    cliente.estado === "Activo"
            )
            .reduce(
                (total, cliente) =>
                    total +
                    Number(
                        cliente.precio || 0
                    ),
                0
            );


    if (ingresosMes) {

        ingresosMes.textContent =
            "$" +
            ingresos.toLocaleString(
                "es-CO"
            );
    }


    /*
       Los pagos pendientes se mantienen
       en 0 porque todavía no existe
       una tabla de pagos independiente
       en Supabase.
    */

    if (pagosPendientes) {

        pagosPendientes.textContent =
            "0";
    }
}


/* ==================================================
   ALERTAS
================================================== */

function alertar(mensaje) {

    /*
       Si el proyecto original tiene
       una función de alerta personalizada,
       se puede utilizar aquí.
    */

    alert(mensaje);
}


/* ==================================================
   GENERAR ID
================================================== */

function generarId() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );
}


/* ==================================================
   ABRIR MODAL NUEVO CLIENTE
================================================== */

function abrirModalCliente(
    cliente = null
) {

    clienteEditando =
        cliente;

    if (!formCliente) {
        return;
    }

    formCliente.reset();


    /*
       Limpiar archivo seleccionado
    */

    if (archivoSeleccionado) {

        archivoSeleccionado.textContent =
            "Ningún archivo seleccionado";
    }


    if (cliente) {

        /*
           MODO EDITAR
        */

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


        if (nombre)
            nombre.value =
                cliente.nombre || "";

        if (cedula)
            cedula.value =
                cliente.cedula || "";

        if (telefono)
            telefono.value =
                cliente.telefono || "";

        if (correo)
            correo.value =
                cliente.correo || "";

        if (direccion)
            direccion.value =
                cliente.direccion || "";

        if (mac)
            mac.value =
                cliente.mac || "";

        if (cto)
            cto.value =
                cliente.cto || "";

        if (puerto)
            puerto.value =
                cliente.puerto || "";

        if (plan)
            plan.value =
                cliente.plan || "";

        if (precio)
            precio.value =
                cliente.precio || "";

        if (fecha)
            fecha.value =
                cliente.fecha || "";

        if (estado)
            estado.value =
                cliente.estado || "Activo";


        if (archivoSeleccionado) {

            if (
                cliente.contrato &&
                cliente.contrato.nombre
            ) {

                archivoSeleccionado.textContent =
                    cliente.contrato.nombre;

            } else {

                archivoSeleccionado.textContent =
                    "Ningún archivo seleccionado";
            }
        }


        const titulo =
            document.querySelector(
                "#modalCliente h2"
            );

        if (titulo) {

            titulo.textContent =
                "Editar cliente";
        }

    } else {

        /*
           MODO NUEVO
        */

        const titulo =
            document.querySelector(
                "#modalCliente h2"
            );

        if (titulo) {

            titulo.textContent =
                "Nuevo cliente";
        }

        const estado =
            document.getElementById("estado");

        if (estado) {

            estado.value =
                "Activo";
        }
    }


    if (modalCliente) {

        modalCliente.classList.add(
            "activo"
        );
    }
}


/* ==================================================
   CERRAR MODAL CLIENTE
================================================== */

function cerrarModalCliente() {

    if (modalCliente) {

        modalCliente.classList.remove(
            "activo"
        );
    }

    clienteEditando =
        null;

    if (formCliente) {

        formCliente.reset();
    }

    if (archivoSeleccionado) {

        archivoSeleccionado.textContent =
            "Ningún archivo seleccionado";
    }
}


/* ==================================================
   OBTENER DATOS DEL FORMULARIO
================================================== */

function obtenerDatosFormulario() {

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


    return {

        id:
            clienteEditando?.id ||
            generarId(),

        nombre:
            nombre?.value.trim() || "",

        cedula:
            cedula?.value.trim() || "",

        telefono:
            telefono?.value.trim() || "",

        correo:
            correo?.value.trim() || "",

        direccion:
            direccion?.value.trim() || "",

        mac:
            mac?.value.trim() || "",

        cto:
            cto?.value.trim() || "",

        puerto:
            puerto?.value.trim() || "",

        plan:
            plan?.value.trim() ||
            "300 Mbps",

        precio:
            Number(
                precio?.value || 0
            ),

        fecha:
            fecha?.value || "",

        estado:
            estado?.value ||
            "Activo",

        contrato:
            clienteEditando?.contrato ||
            null
    };
}


/* ==================================================
   GUARDAR DESDE FORMULARIO
================================================== */

formCliente.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (!usuarioActual) {

            alertar(
                "Debes iniciar sesión primero."
            );

            return;
        }


        const botonGuardar =
            formCliente.querySelector(
                'button[type="submit"]'
            );


        if (botonGuardar) {

            botonGuardar.disabled =
                true;

            botonGuardar.textContent =
                "Guardando...";
        }


        try {

            const cliente =
                obtenerDatosFormulario();


            /*
               Archivo nuevo
            */

            const archivo =
                archivoInput?.files?.[0];


            if (archivo) {

                /*
                   Si estamos editando y ya tenía
                   un archivo anterior, primero
                   guardamos el nuevo.
                */

                const contratoNuevo =
                    await subirContrato(
                        archivo,
                        cliente.id
                    );

                cliente.contrato =
                    contratoNuevo;
            }


            const guardado =
                await guardarCliente(
                    cliente
                );


            if (!guardado) {

                return;
            }


            /*
               Actualizar el cliente localmente
            */

            const indice =
                clientes.findIndex(
                    c =>
                        c.id ===
                        cliente.id
                );


            if (indice >= 0) {

                clientes[indice] =
                    cliente;

            } else {

                clientes.unshift(
                    cliente
                );
            }


            renderizarClientes();

            actualizarEstadisticas();

            cerrarModalCliente();


            alertar(
                "Cliente guardado correctamente."
            );


        } catch (error) {

            console.error(error);

            alertar(
                error.message ||
                "Ocurrió un error al guardar el cliente."
            );

        } finally {

            if (botonGuardar) {

                botonGuardar.disabled =
                    false;

                botonGuardar.textContent =
                    "Guardar cliente";
            }
        }
    }
);


/* ==================================================
   SELECCIÓN DE ARCHIVO
================================================== */

if (archivoInput) {

    archivoInput.addEventListener(
        "change",
        function () {

            const archivo =
                this.files?.[0];


            if (!archivo) {

                if (archivoSeleccionado) {

                    archivoSeleccionado.textContent =
                        "Ningún archivo seleccionado";
                }

                return;
            }


            if (archivoSeleccionado) {

                archivoSeleccionado.textContent =
                    archivo.name;
            }
        }
    );
}


/* ==================================================
   RENDERIZAR CLIENTES
================================================== */

function renderizarClientes(
    filtro = ""
) {

    if (!listaClientes) {
        return;
    }


    listaClientes.innerHTML =
        "";


    const textoFiltro =
        filtro
            .toLowerCase()
            .trim();


    const clientesFiltrados =
        clientes.filter(
            cliente => {

                const nombre =
                    (
                        cliente.nombre ||
                        ""
                    ).toLowerCase();

                const cedula =
                    (
                        cliente.cedula ||
                        ""
                    ).toLowerCase();

                const telefono =
                    (
                        cliente.telefono ||
                        ""
                    ).toLowerCase();

                return (
                    nombre.includes(
                        textoFiltro
                    ) ||
                    cedula.includes(
                        textoFiltro
                    ) ||
                    telefono.includes(
                        textoFiltro
                    )
                );
            }
        );


    if (
        clientesFiltrados.length ===
        0
    ) {

        listaClientes.innerHTML = `
            <div class="sin-clientes">
                <div class="sin-clientes-icono">
                    👤
                </div>
                <h3>No hay clientes</h3>
                <p>
                    ${
                        textoFiltro
                            ? "No se encontraron clientes con esa búsqueda."
                            : "Agrega tu primer cliente para comenzar."
                    }
                </p>
            </div>
        `;

        return;
    }


    clientesFiltrados.forEach(
        cliente => {

            const tarjeta =
                document.createElement(
                    "div"
                );

            tarjeta.className =
                "cliente-card";


            const nombre =
                cliente.nombre ||
                "Sin nombre";


            const inicial =
                nombre
                    .charAt(0)
                    .toUpperCase();


            tarjeta.innerHTML = `

                <div class="cliente-card-info">

                    <div class="cliente-avatar">
                        ${inicial}
                    </div>

                    <div class="cliente-card-nombre">
                        <h3>
                            ${escapeHTML(nombre)}
                        </h3>
                    </div>

                </div>

                <div class="cliente-card-acciones">

                    <button
                        type="button"
                        class="btn-ver"
                        data-id="${cliente.id}">
                        Ver
                    </button>

                    <button
                        type="button"
                        class="btn-editar"
                        data-id="${cliente.id}">
                        Editar
                    </button>

                    <button
                        type="button"
                        class="btn-eliminar"
                        data-id="${cliente.id}">
                        Eliminar
                    </button>

                </div>
            `;


            listaClientes.appendChild(
                tarjeta
            );
        }
    );


    /*
       Eventos de los botones
    */

    listaClientes
        .querySelectorAll(
            ".btn-ver"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    function () {

                        const cliente =
                            clientes.find(
                                c =>
                                    c.id ===
                                    this.dataset.id
                            );

                        if (cliente) {

                            verCliente(
                                cliente
                            );
                        }
                    }
                );
            }
        );


    listaClientes
        .querySelectorAll(
            ".btn-editar"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    function () {

                        const cliente =
                            clientes.find(
                                c =>
                                    c.id ===
                                    this.dataset.id
                            );

                        if (cliente) {

                            abrirModalCliente(
                                cliente
                            );
                        }
                    }
                );
            }
        );


    listaClientes
        .querySelectorAll(
            ".btn-eliminar"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    function () {

                        const cliente =
                            clientes.find(
                                c =>
                                    c.id ===
                                    this.dataset.id
                            );

                        if (cliente) {

                            abrirModalEliminar(
                                cliente
                            );
                        }
                    }
                );
            }
        );
}


/* ==================================================
   ESCAPAR HTML
================================================== */

function escapeHTML(
    texto
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        texto ?? "";

    return div.innerHTML;
}


/* ==================================================
   VER CLIENTE
================================================== */

function verCliente(
    cliente
) {

    if (!modalVerCliente) {
        return;
    }


    const elementos = {

        nombre:
            document.getElementById(
                "verNombre"
            ),

        telefono:
            document.getElementById(
                "verTelefono"
            ),

        cedula:
            document.getElementById(
                "verCedula"
            ),

        correo:
            document.getElementById(
                "verCorreo"
            ),

        direccion:
            document.getElementById(
                "verDireccion"
            ),

        mac:
            document.getElementById(
                "verMac"
            ),

        cto:
            document.getElementById(
                "verCto"
            ),

        puerto:
            document.getElementById(
                "verPuerto"
            ),

        plan:
            document.getElementById(
                "verPlan"
            ),

        precio:
            document.getElementById(
                "verPrecio"
            ),

        estado:
            document.getElementById(
                "verEstado"
            ),

        fecha:
            document.getElementById(
                "verFecha"
            )
    };


    if (elementos.nombre) {

        elementos.nombre.textContent =
            cliente.nombre ||
            "Sin nombre";
    }


    if (elementos.telefono) {

        elementos.telefono.textContent =
            cliente.telefono ||
            "No registrado";
    }


    if (elementos.cedula) {

        elementos.cedula.textContent =
            cliente.cedula ||
            "No registrada";
    }


    if (elementos.correo) {

        elementos.correo.textContent =
            cliente.correo ||
            "No registrado";
    }


    if (elementos.direccion) {

        elementos.direccion.textContent =
            cliente.direccion ||
            "No registrada";
    }


    if (elementos.mac) {

        elementos.mac.textContent =
            cliente.mac ||
            "No registrada";
    }


    if (elementos.cto) {

        elementos.cto.textContent =
            cliente.cto ||
            "No registrada";
    }


    if (elementos.puerto) {

        elementos.puerto.textContent =
            cliente.puerto ||
            "No registrado";
    }


    if (elementos.plan) {

        elementos.plan.textContent =
            cliente.plan ||
            "No registrado";
    }


    if (elementos.precio) {

        elementos.precio.textContent =
            "$" +
            Number(
                cliente.precio || 0
            ).toLocaleString(
                "es-CO"
            );
    }


    if (elementos.estado) {

        elementos.estado.textContent =
            cliente.estado ||
            "Activo";
    }


    if (elementos.fecha) {

        elementos.fecha.textContent =
            cliente.fecha ||
            "No registrada";
    }


    /*
       Botón para abrir contrato
    */

    const botonContrato =
        document.getElementById(
            "btnVerContrato"
        );


    if (botonContrato) {

        botonContrato.onclick =
            function () {

                verContrato(
                    cliente.id
                );
            };


        if (
            cliente.contrato
        ) {

            botonContrato.style.display =
                "inline-flex";

        } else {

            botonContrato.style.display =
                "none";
        }
    }


    modalVerCliente.classList.add(
        "activo"
    );
}


/* ==================================================
   CERRAR MODAL VER CLIENTE
================================================== */

function cerrarModalVerCliente() {

    if (modalVerCliente) {

        modalVerCliente.classList.remove(
            "activo"
        );
    }
}


/* ==================================================
   MODAL ELIMINAR
================================================== */

function abrirModalEliminar(
    cliente
) {

    clienteAEliminar =
        cliente;


    const nombre =
        document.getElementById(
            "nombreClienteEliminar"
        );


    if (nombre) {

        nombre.textContent =
            cliente.nombre ||
            "este cliente";
    }


    if (modalEliminar) {

        modalEliminar.classList.add(
            "activo"
        );
    }
}


/* ==================================================
   CERRAR MODAL ELIMINAR
================================================== */

function cerrarModalEliminar() {

    clienteAEliminar =
        null;


    if (modalEliminar) {

        modalEliminar.classList.remove(
            "activo"
        );
    }
}


/* ==================================================
   CONFIRMAR ELIMINACIÓN
================================================== */

if (confirmarEliminar) {

    confirmarEliminar.addEventListener(
        "click",
        async function () {

            if (!clienteAEliminar) {
                return;
            }


            const id =
                clienteAEliminar.id;


            confirmarEliminar.disabled =
                true;

            confirmarEliminar.textContent =
                "Eliminando...";


            try {

                const eliminado =
                    await eliminarClienteDB(
                        id
                    );


                if (!eliminado) {
                    return;
                }


                clientes =
                    clientes.filter(
                        cliente =>
                            cliente.id !==
                            id
                    );


                renderizarClientes();

                actualizarEstadisticas();

                cerrarModalEliminar();


                alertar(
                    "Cliente eliminado correctamente."
                );


            } catch (error) {

                console.error(error);

                alertar(
                    "No se pudo eliminar el cliente."
                );

            } finally {

                confirmarEliminar.disabled =
                    false;

                confirmarEliminar.textContent =
                    "Eliminar";
            }
        }
    );
}


/* ==================================================
   BOTONES DE MODALES
================================================== */

if (btnNuevoCliente) {

    btnNuevoCliente.addEventListener(
        "click",
        function () {

            abrirModalCliente();
        }
    );
}


if (cerrarModal) {

    cerrarModal.addEventListener(
        "click",
        cerrarModalCliente
    );
}


if (cancelarCliente) {

    cancelarCliente.addEventListener(
        "click",
        cerrarModalCliente
    );
}


if (cerrarVerCliente) {

    cerrarVerCliente.addEventListener(
        "click",
        cerrarModalVerCliente
    );
}


if (cancelarEliminar) {

    cancelarEliminar.addEventListener(
        "click",
        cerrarModalEliminar
    );
}


/* ==================================================
   CERRAR MODALES HACIENDO CLICK AFUERA
================================================== */

window.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            modalCliente
        ) {

            cerrarModalCliente();
        }


        if (
            event.target ===
            modalEliminar
        ) {

            cerrarModalEliminar();
        }


        if (
            event.target ===
            modalVerCliente
        ) {

            cerrarModalVerCliente();
        }
    }
);


/* ==================================================
   BUSCADOR
================================================== */

if (buscarCliente) {

    buscarCliente.addEventListener(
        "input",
        function () {

            renderizarClientes(
                this.value
            );
        }
    );
}


/* ==================================================
   ESCAPE PARA CERRAR MODALES
================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }


        cerrarModalCliente();

        cerrarModalEliminar();

        cerrarModalVerCliente();
    }
);

/* ==================================================
   NAVEGACIÓN PRINCIPAL
================================================== */

const enlacesMenu =
    document.querySelectorAll(
        ".sidebar nav a, .sidebar a"
    );


/* ==================================================
   ELEMENTOS DE LAS SECCIONES
================================================== */

const seccionInicio =
    document.getElementById("inicio");

const seccionClientes =
    document.getElementById("clientes");

const seccionPagos =
    document.getElementById("pagos");

const seccionContratos =
    document.getElementById("contratos");

const seccionEquipos =
    document.getElementById("equipos");

const seccionSoporte =
    document.getElementById("soporte");


/* ==================================================
   MOSTRAR INICIO
================================================== */

function mostrarInicio() {

    ocultarSecciones();

    if (seccionInicio) {

        seccionInicio.style.display =
            "";
    }

    actualizarEstadisticas();
}


/* ==================================================
   MOSTRAR CLIENTES
================================================== */

function mostrarClientes() {

    ocultarSecciones();

    if (seccionClientes) {

        seccionClientes.style.display =
            "";
    }

    renderizarClientes();

    actualizarEstadisticas();
}


/* ==================================================
   MOSTRAR PAGOS
================================================== */

function mostrarPagos() {

    ocultarSecciones();

    if (seccionPagos) {

        seccionPagos.style.display =
            "";
    }
}


/* ==================================================
   MOSTRAR CONTRATOS
================================================== */

function mostrarContratos() {

    ocultarSecciones();

    if (seccionContratos) {

        seccionContratos.style.display =
            "";
    }
}


/* ==================================================
   MOSTRAR EQUIPOS
================================================== */

function mostrarEquipos() {

    ocultarSecciones();

    if (seccionEquipos) {

        seccionEquipos.style.display =
            "";
    }
}


/* ==================================================
   MOSTRAR SOPORTE
================================================== */

function mostrarSoporte() {

    ocultarSecciones();

    if (seccionSoporte) {

        seccionSoporte.style.display =
            "";
    }
}


/* ==================================================
   OCULTAR SECCIONES
================================================== */

function ocultarSecciones() {

    const secciones = [

        seccionInicio,
        seccionClientes,
        seccionPagos,
        seccionContratos,
        seccionEquipos,
        seccionSoporte

    ];


    secciones.forEach(
        seccion => {

            if (seccion) {

                seccion.style.display =
                    "none";
            }
        }
    );
}


/* ==================================================
   NAVEGACIÓN DEL MENÚ
================================================== */

enlacesMenu.forEach(
    enlace => {

        enlace.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const destino =
                    this.getAttribute(
                        "href"
                    );


                enlacesMenu.forEach(
                    item => {

                        item.classList.remove(
                            "activo"
                        );
                    }
                );


                this.classList.add(
                    "activo"
                );


                if (
                    destino ===
                    "#inicio"
                ) {

                    mostrarInicio();

                } else if (
                    destino ===
                    "#clientes"
                ) {

                    mostrarClientes();

                } else if (
                    destino ===
                    "#pagos"
                ) {

                    mostrarPagos();

                } else if (
                    destino ===
                    "#contratos"
                ) {

                    mostrarContratos();

                } else if (
                    destino ===
                    "#equipos"
                ) {

                    mostrarEquipos();

                } else if (
                    destino ===
                    "#soporte"
                ) {

                    mostrarSoporte();
                }

            }
        );
    }
);


/* ==================================================
   SOPORTE DE CLIENTE
================================================== */

function abrirSoporteCliente(
    cliente
) {

    if (!cliente) {
        return;
    }


    const telefono =
        cliente.telefono || "";


    if (!telefono) {

        alertar(
            "Este cliente no tiene un número de teléfono registrado."
        );

        return;
    }


    const numero =
        telefono.replace(
            /\D/g,
            ""
        );


    const mensaje =
        encodeURIComponent(
            "Hola " +
            (cliente.nombre || "") +
            ", somos Sistecfiber Telecomunicaciones. Nos comunicamos contigo para brindarte soporte."
        );


    window.open(
        "https://wa.me/57" +
        numero +
        "?text=" +
        mensaje,
        "_blank"
    );
}


/* ==================================================
   INICIALIZAR BOTONES DE SOPORTE
================================================== */

function configurarBotonesSoporte() {

    document
        .querySelectorAll(
            ".btn-soporte-cliente"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    function () {

                        const cliente =
                            clientes.find(
                                c =>
                                    c.id ===
                                    this.dataset.id
                            );


                        if (cliente) {

                            abrirSoporteCliente(
                                cliente
                            );
                        }
                    }
                );
            }
        );
}


/* ==================================================
   FORMATO DE DINERO
================================================== */

function formatoDinero(
    valor
) {

    return (
        "$" +
        Number(
            valor || 0
        ).toLocaleString(
            "es-CO"
        )
    );
}


/* ==================================================
   ACTUALIZAR PRECIO AUTOMÁTICAMENTE
================================================== */

const campoPlan =
    document.getElementById(
        "plan"
    );

const campoPrecio =
    document.getElementById(
        "precio"
    );


if (
    campoPlan &&
    campoPrecio
) {

    campoPlan.addEventListener(
        "change",
        function () {

            const texto =
                this.value
                    .toLowerCase();


            if (
                texto.includes(
                    "100"
                )
            ) {

                campoPrecio.value =
                    50000;

            } else if (
                texto.includes(
                    "200"
                )
            ) {

                campoPrecio.value =
                    60000;

            } else if (
                texto.includes(
                    "300"
                )
            ) {

                campoPrecio.value =
                    70000;

            } else if (
                texto.includes(
                    "400"
                )
            ) {

                campoPrecio.value =
                    80000;
            }
        }
    );
}


/* ==================================================
   VALIDAR CORREO
================================================== */

function correoValido(
    correo
) {

    if (!correo) {
        return true;
    }


    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
            correo
        );
}


/* ==================================================
   VALIDAR FORMULARIO
================================================== */

if (formCliente) {

    formCliente.addEventListener(
        "submit",
        function (event) {

            const correo =
                document.getElementById(
                    "correo"
                );


            if (
                correo &&
                correo.value &&
                !correoValido(
                    correo.value.trim()
                )
            ) {

                event.preventDefault();

                alertar(
                    "Ingresa un correo electrónico válido."
                );

                correo.focus();
            }
        },
        true
    );
}


/* ==================================================
   CERRAR MODALES AL CAMBIAR DE SECCIÓN
================================================== */

function cerrarTodosLosModales() {

    cerrarModalCliente();

    cerrarModalEliminar();

    cerrarModalVerCliente();
}


/* ==================================================
   CONTROL DE TECLA ENTER
================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            event.target.tagName !==
                "TEXTAREA"
        ) {

            /*
               Se deja que el formulario
               maneje normalmente el Enter.
            */
        }
    }
);


/* ==================================================
   CONTROL DE ERRORES
================================================== */

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "Error en Sistecfiber:",
            event.error ||
            event.message
        );
    }
);


/* ==================================================
   INICIAR APLICACIÓN
================================================== */

iniciarSistema();
