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
   BASE DE DATOS
================================================== */

let db;

const DB_NAME = "MiNetDB";
const DB_VERSION = 1;
const STORE_NAME = "clientes";


function iniciarBaseDatos() {

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function(event) {

        db = event.target.result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {

            db.createObjectStore(STORE_NAME, {
                keyPath: "id"
            });

        }

    };

    request.onsuccess = function(event) {

        db = event.target.result;

        cargarClientes();

    };

    request.onerror = function() {

        console.error("No se pudo abrir la base de datos.");

    };

}


function cargarClientes() {

    const transaction = db.transaction(
        STORE_NAME,
        "readonly"
    );

    const store = transaction.objectStore(STORE_NAME);

    const request = store.getAll();

    request.onsuccess = function() {

        clientes = request.result || [];

        renderizarClientes();
        actualizarEstadisticas();

    };

}


function guardarCliente(cliente) {

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(
            STORE_NAME,
            "readwrite"
        );

        const store = transaction.objectStore(STORE_NAME);

        const request = store.put(cliente);

        request.onsuccess = function() {
            resolve();
        };

        request.onerror = function() {
            reject(request.error);
        };

    });

}


function eliminarClienteDB(id) {

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(
            STORE_NAME,
            "readwrite"
        );

        const store = transaction.objectStore(STORE_NAME);

        const request = store.delete(id);

        request.onsuccess = function() {
            resolve();
        };

        request.onerror = function() {
            reject(request.error);
        };

    });

}


/* ==================================================
   UTILIDADES
================================================== */

function dinero(valor) {

    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(valor || 0);

}


function generarID() {

    return "C-" +
        Date.now().toString(36) +
        Math.random().toString(36).substring(2, 7);

}


function escaparHTML(texto) {

    const div = document.createElement("div");

    div.textContent = texto || "";

    return div.innerHTML;

}


/* ==================================================
   NUEVO CLIENTE
================================================== */

btnNuevoCliente.addEventListener("click", function() {

    clienteEditando = null;

    formCliente.reset();

    document.getElementById("tituloModal").textContent =
        "Nuevo cliente";

    archivoSeleccionado.textContent = "";

    modalCliente.classList.add("mostrar");

    document.getElementById("nombre").focus();

});


/* ==================================================
   CERRAR MODAL
================================================== */

function cerrarModalCliente() {

    modalCliente.classList.remove("mostrar");

    formCliente.reset();

    archivoSeleccionado.textContent = "";

    clienteEditando = null;

}


cerrarModal.addEventListener(
    "click",
    cerrarModalCliente
);


cancelarCliente.addEventListener(
    "click",
    cerrarModalCliente
);


/* ==================================================
   CONTRATO
================================================== */

archivoInput.addEventListener("change", function() {

    const archivo = archivoInput.files[0];

    if (!archivo) {

        archivoSeleccionado.textContent = "";

        return;

    }

    archivoSeleccionado.innerHTML =
        `📄 ${escaparHTML(archivo.name)}`;

});


/* ==================================================
   GUARDAR CLIENTE
================================================== */

formCliente.addEventListener("submit", async function(event) {

    event.preventDefault();

    const nombre =
        document.getElementById("nombre").value.trim();

    const cedula =
        document.getElementById("cedula").value.trim();

    const telefono =
        document.getElementById("telefono").value.trim();

    const correo =
        document.getElementById("correo").value.trim();

    const direccion =
        document.getElementById("direccion").value.trim();

    const ip =
        document.getElementById("ip").value.trim();

    const plan =
        document.getElementById("plan").value;

    const precio =
        Number(document.getElementById("precio").value);

    const fecha =
        document.getElementById("fecha").value;

    const estado =
        document.getElementById("estado").value;


    if (
        !nombre ||
        !telefono ||
        !direccion ||
        !precio
    ) {

        alertar(
            "Completa los campos obligatorios."
        );

        return;

    }


    let cliente;


    /* EDITAR */

    if (clienteEditando) {

        cliente = clientes.find(
            c => c.id === clienteEditando
        );

        if (!cliente) {
            return;
        }

        cliente.nombre = nombre;
        cliente.cedula = cedula;
        cliente.telefono = telefono;
        cliente.correo = correo;
        cliente.direccion = direccion;
        cliente.ip = ip;
        cliente.plan = plan;
        cliente.precio = precio;
        cliente.fecha = fecha;
        cliente.estado = estado;

    }


    /* NUEVO */

    else {

        cliente = {

            id: generarID(),

            nombre: nombre,

            cedula: cedula,

            telefono: telefono,

            correo: correo,

            direccion: direccion,

            ip: ip,

            plan: plan,

            precio: precio,

            fecha: fecha,

            estado: estado,

            contrato: null

        };

    }


    /* CONTRATO */

    const archivo = archivoInput.files[0];

    if (archivo) {

        cliente.contrato = {

            nombre: archivo.name,

            tipo: archivo.type,

            tamaño: archivo.size,

            archivo: archivo

        };

    }


    try {

        await guardarCliente(cliente);

        cargarClientes();

        cerrarModalCliente();

        alertar(
            "Cliente guardado correctamente."
        );

    }

    catch(error) {

        console.error(error);

        alertar(
            "No se pudo guardar el cliente."
        );

    }

});


/* ==================================================
   MOSTRAR CLIENTES
================================================== */

function renderizarClientes() {

    const texto =
        buscarCliente.value.toLowerCase().trim();


    const filtrados = clientes.filter(cliente => {

        return (

            (cliente.nombre || "")
                .toLowerCase()
                .includes(texto)

            ||

            (cliente.telefono || "")
                .toLowerCase()
                .includes(texto)

            ||

            (cliente.direccion || "")
                .toLowerCase()
                .includes(texto)

        );

    });


    listaClientes.innerHTML = "";


    if (filtrados.length === 0) {

        listaClientes.innerHTML = `

            <div class="sin-clientes">

                <div class="sin-icono">
                    👥
                </div>

                <h3>
                    No hay clientes
                </h3>

                <p>
                    Agrega un cliente para comenzar.
                </p>

            </div>

        `;

        return;

    }


    filtrados.forEach(cliente => {

        listaClientes.appendChild(
            crearTarjetaCliente(cliente)
        );

    });

}


/* ==================================================
   TARJETA COMPRIMIDA
================================================== */

function crearTarjetaCliente(cliente) {

    const card = document.createElement("div");

    card.className = "cliente-card";


    const inicial =
        (cliente.nombre || "?")
            .charAt(0)
            .toUpperCase();


    const claseEstado =
        (cliente.estado || "")
            .toLowerCase();


    let botonContrato = "";


    if (cliente.contrato) {

        botonContrato = `

            <button
                class="btn-card btn-contrato"
                type="button"
                onclick="verContrato('${cliente.id}')">

                📄 Contrato

            </button>

        `;

    }


    /*
       SOLO MOSTRAMOS:
       - Avatar
       - Nombre
       - Estado
       - Botones

       Los demás datos aparecen
       únicamente en "Ver".
    */

    card.innerHTML = `

        <div class="cliente-top">

            <div class="cliente-identidad">

                <div class="cliente-avatar">
                    ${inicial}
                </div>

                <div>

                    <h3>
                        ${escaparHTML(cliente.nombre)}
                    </h3>

                    <span class="cliente-id"></span>

                </div>

            </div>


            <span class="estado ${claseEstado}">
                ${escaparHTML(cliente.estado)}
            </span>

        </div>


        <div class="cliente-botones">

            <button
                class="btn-card btn-ver"
                type="button"
                onclick="verCliente('${cliente.id}')">

                Ver

            </button>


            <button
                class="btn-card btn-editar"
                type="button"
                onclick="editarCliente('${cliente.id}')">

                Editar

            </button>


            ${botonContrato}


            <button
                class="btn-card btn-eliminar"
                type="button"
                onclick="abrirEliminar('${cliente.id}')">

                Eliminar

            </button>

        </div>

    `;


    return card;

}


/* ==================================================
   EDITAR CLIENTE
================================================== */

function editarCliente(id) {

    const cliente = clientes.find(
        c => c.id === id
    );

    if (!cliente) {
        return;
    }


    clienteEditando = id;


    document.getElementById("tituloModal").textContent =
        "Editar cliente";


    document.getElementById("nombre").value =
        cliente.nombre || "";


    document.getElementById("cedula").value =
        cliente.cedula || "";


    document.getElementById("telefono").value =
        cliente.telefono || "";


    document.getElementById("correo").value =
        cliente.correo || "";


    document.getElementById("direccion").value =
        cliente.direccion || "";


    document.getElementById("ip").value =
        cliente.ip || "";


    document.getElementById("plan").value =
        cliente.plan || "100 Mbps";


    document.getElementById("precio").value =
        cliente.precio || "";


    document.getElementById("fecha").value =
        cliente.fecha || "";


    document.getElementById("estado").value =
        cliente.estado || "Activo";


    archivoInput.value = "";


    if (cliente.contrato) {

        archivoSeleccionado.innerHTML = `

            📄 Contrato actual:

            <strong>
                ${escaparHTML(cliente.contrato.nombre)}
            </strong>

            <br>

            <small>
                Si seleccionas otro archivo,
                reemplazará el actual.
            </small>

        `;

    }

    else {

        archivoSeleccionado.textContent =
            "Este cliente todavía no tiene contrato.";

    }


    modalCliente.classList.add("mostrar");

}


/* ==================================================
   ELIMINAR
================================================== */

function abrirEliminar(id) {

    const cliente = clientes.find(
        c => c.id === id
    );

    if (!cliente) {
        return;
    }


    clienteAEliminar = id;


    document.getElementById("nombreEliminar").textContent =
        cliente.nombre;


    modalEliminar.classList.add("mostrar");

}


cancelarEliminar.addEventListener(
    "click",
    function() {

        clienteAEliminar = null;

        modalEliminar.classList.remove("mostrar");

    }
);


confirmarEliminar.addEventListener(
    "click",
    async function() {

        if (!clienteAEliminar) {
            return;
        }


        try {

            await eliminarClienteDB(
                clienteAEliminar
            );

            clienteAEliminar = null;

            modalEliminar.classList.remove(
                "mostrar"
            );

            cargarClientes();

            alertar(
                "Cliente eliminado correctamente."
            );

        }

        catch(error) {

            console.error(error);

            alertar(
                "No se pudo eliminar el cliente."
            );

        }

    }
);


/* ==================================================
   VER CLIENTE
================================================== */

function verCliente(id) {

    const cliente = clientes.find(
        c => c.id === id
    );

    if (!cliente) {
        return;
    }


    document.getElementById("verNombre").textContent =
        cliente.nombre;


    document.getElementById("verTelefono").textContent =
        cliente.telefono || "No registrado";


    document.getElementById("verCedula").textContent =
        cliente.cedula || "No registrada";


    document.getElementById("verCorreo").textContent =
        cliente.correo || "No registrado";


    document.getElementById("verDireccion").textContent =
        cliente.direccion || "No registrada";


    document.getElementById("verIp").textContent =
        cliente.ip || "No registrada";


    document.getElementById("verPlan").textContent =
        cliente.plan || "No registrado";


    document.getElementById("verPrecio").textContent =
        dinero(cliente.precio);


    document.getElementById("verEstado").textContent =
        cliente.estado || "No registrado";


    document.getElementById("verFecha").textContent =
        cliente.fecha || "No registrada";


    const contrato =
        document.getElementById("verContrato");


    if (cliente.contrato) {

        contrato.innerHTML = `

            <strong>
                📄 Contrato
            </strong>

            <br><br>

            ${escaparHTML(
                cliente.contrato.nombre
            )}

            <br><br>

            <button
                class="btn-primary"
                type="button"
                onclick="verContrato('${cliente.id}')">

                Abrir contrato

            </button>

        `;

    }

    else {

        contrato.innerHTML = `

            📄 Este cliente no tiene
            contrato cargado.

        `;

    }


    modalVerCliente.classList.add(
        "mostrar"
    );

}


/* ==================================================
   CERRAR VER CLIENTE
================================================== */

cerrarVerCliente.addEventListener(
    "click",
    function() {

        modalVerCliente.classList.remove(
            "mostrar"
        );

    }
);


/* ==================================================
   VER CONTRATO
================================================== */

function verContrato(id) {

    const cliente = clientes.find(
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


    const archivo =
        cliente.contrato.archivo;


    if (!archivo) {

        alertar(
            "No se encontró el archivo."
        );

        return;

    }


    const url =
        URL.createObjectURL(archivo);


    window.open(
        url,
        "_blank"
    );


    setTimeout(
        function() {

            URL.revokeObjectURL(url);

        },
        60000
    );

}


/* ==================================================
   BÚSQUEDA
================================================== */

buscarCliente.addEventListener(
    "input",
    renderizarClientes
);


/* ==================================================
   ESTADÍSTICAS
================================================== */

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
                (total, cliente) =>
                    total +
                    Number(cliente.precio || 0),
                0
            );


    document.getElementById(
        "totalClientes"
    ).textContent =
        total;


    document.getElementById(
        "clientesActivos"
    ).textContent =
        activos;


    document.getElementById(
        "ingresosMes"
    ).textContent =
        dinero(ingresos);

}


/* ==================================================
   ALERTA
================================================== */

function alertar(mensaje) {

    const alerta =
        document.createElement("div");


    alerta.style.position = "fixed";
    alerta.style.bottom = "25px";
    alerta.style.right = "25px";
    alerta.style.background = "#111827";
    alerta.style.color = "white";
    alerta.style.padding = "14px 18px";
    alerta.style.borderRadius = "10px";
    alerta.style.boxShadow =
        "0 10px 30px rgba(0,0,0,.2)";
    alerta.style.zIndex = "99999";
    alerta.style.fontSize = "13px";


    alerta.textContent = mensaje;


    document.body.appendChild(alerta);


    setTimeout(
        function() {

            alerta.remove();

        },
        2500
    );

}


/* ==================================================
   CERRAR MODALES HACIENDO CLICK AFUERA
================================================== */

modalCliente.addEventListener(
    "click",
    function(event) {

        if (event.target === modalCliente) {

            cerrarModalCliente();

        }

    }
);


modalEliminar.addEventListener(
    "click",
    function(event) {

        if (event.target === modalEliminar) {

            modalEliminar.classList.remove(
                "mostrar"
            );

            clienteAEliminar = null;

        }

    }
);


modalVerCliente.addEventListener(
    "click",
    function(event) {

        if (event.target === modalVerCliente) {

            modalVerCliente.classList.remove(
                "mostrar"
            );

        }

    }
);


/* ==================================================
   ESC PARA CERRAR
================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key !== "Escape") {
            return;
        }


        modalCliente.classList.remove(
            "mostrar"
        );


        modalEliminar.classList.remove(
            "mostrar"
        );


        modalVerCliente.classList.remove(
            "mostrar"
        );

    }
);


/* ==================================================
   NAVEGACIÓN DE LA BARRA LATERAL
================================================== */

(function iniciarNavegacion() {

    const menuItems =
        document.querySelectorAll(".menu-item");


    const estadisticas =
        document.querySelector(".estadisticas");


    const panelClientes =
        document.querySelector("section.panel");


    const main =
        document.querySelector(".main");


    if (
        !menuItems.length ||
        !estadisticas ||
        !panelClientes ||
        !main
    ) {
        return;
    }


    /* ==============================================
       CREAR VISTA PARA LAS OPCIONES DEL MENÚ
    ============================================== */

    let vistaExtra =
        document.getElementById(
            "vistaMenuExtra"
        );


    if (!vistaExtra) {

        vistaExtra =
            document.createElement("section");

        vistaExtra.id =
            "vistaMenuExtra";

        vistaExtra.className =
            "panel vista-menu-extra";


        main.appendChild(
            vistaExtra
        );

    }


    /* ==============================================
       ESTILOS ADICIONALES
       No modifica tu CSS original.
    ============================================== */

    const estilos =
        document.createElement("style");


    estilos.textContent = `

        /* TARJETAS COMPRIMIDAS */

        .cliente-card .cliente-datos {
            display: none !important;
        }


        .cliente-card {
            min-height: auto;
        }


        .cliente-card .cliente-botones {
            margin-top: 14px;
        }


        /* VISTAS DEL MENÚ */

        .vista-menu-extra {
            display: none;
        }


        .vista-menu-extra.mostrar {
            display: block;
        }


        .menu-extra-grid {
            display: grid;
            grid-template-columns:
                repeat(auto-fit, minmax(250px, 1fr));
            gap: 18px;
            margin-top: 20px;
        }


        .menu-extra-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            padding: 18px;
            box-shadow:
                0 4px 15px rgba(0,0,0,.04);
        }


        .menu-extra-card h3 {
            margin-top: 0;
            margin-bottom: 12px;
        }


        .menu-extra-card p {
            margin: 8px 0;
            color: #4b5563;
        }


        .menu-extra-vacio {
            padding: 40px 20px;
            text-align: center;
        }


        .menu-extra-tabla {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
        }


        .menu-extra-tabla th,
        .menu-extra-tabla td {
            padding: 14px;
            border-bottom: 1px solid #e5e7eb;
            text-align: left;
        }


        .menu-extra-tabla th {
            font-weight: 600;
        }


        .estado-pendiente {
            color: #b45309;
            font-weight: 600;
        }


        .menu-extra-card button {
            margin-top: 10px;
        }

    `;


    document.head.appendChild(
        estilos
    );


    /* ==============================================
       SELECCIONAR OPCIÓN
    ============================================== */

    function seleccionarMenu(boton) {

        menuItems.forEach(item => {

            item.classList.remove(
                "activo"
            );

            item.classList.remove(
                "seleccionado"
            );

        });


        boton.classList.add(
            "activo"
        );

        boton.classList.add(
            "seleccionado"
        );

    }


    /* ==============================================
       INICIO
    ============================================== */

    function mostrarInicio() {

        estadisticas.style.display =
            "";

        panelClientes.style.display =
            "";

        vistaExtra.classList.remove(
            "mostrar"
        );

    }


    /* ==============================================
       CLIENTES
    ============================================== */

    function mostrarClientes() {

        estadisticas.style.display =
            "none";

        panelClientes.style.display =
            "";

        vistaExtra.classList.remove(
            "mostrar"
        );


        setTimeout(
            function() {

                buscarCliente.focus();

            },
            50
        );

    }


    /* ==============================================
       VISTA EXTRA
    ============================================== */

    function mostrarVistaExtra(
        titulo,
        descripcion,
        contenido
    ) {

        estadisticas.style.display =
            "none";


        panelClientes.style.display =
            "none";


        vistaExtra.innerHTML = `

            <div class="panel-header">

                <div>

                    <h2>
                        ${titulo}
                    </h2>

                    <p>
                        ${descripcion}
                    </p>

                </div>

            </div>


            ${contenido}

        `;


        vistaExtra.classList.add(
            "mostrar"
        );

    }


    /* ==============================================
       PAGOS
    ============================================== */

    function vistaPagos() {

        let contenido = "";


        if (!clientes.length) {

            contenido = `

                <div class="menu-extra-vacio">

                    <h3>
                        No hay clientes registrados
                    </h3>

                    <p>
                        Agrega clientes para comenzar
                        a gestionar pagos.
                    </p>

                </div>

            `;

        }

        else {

            contenido = `

                <table class="menu-extra-tabla">

                    <thead>

                        <tr>

                            <th>
                                Cliente
                            </th>

                            <th>
                                Mensualidad
                            </th>

                            <th>
                                Estado del pago
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${clientes.map(cliente => `

                            <tr>

                                <td>
                                    ${escaparHTML(
                                        cliente.nombre
                                    )}
                                </td>

                                <td>
                                    ${dinero(
                                        cliente.precio
                                    )}
                                </td>

                                <td class="estado-pendiente">

                                    Pendiente de registrar

                                </td>

                            </tr>

                        `).join("")}

                    </tbody>

                </table>

            `;

        }


        mostrarVistaExtra(
            "Pagos",
            "Consulta las mensualidades de tus clientes.",
            contenido
        );

    }


    /* ==============================================
       CONTRATOS
    ============================================== */

    function vistaContratos() {

        let contenido = "";


        const clientesConContrato =
            clientes.filter(
                cliente =>
                    cliente.contrato
            );


        if (!clientesConContrato.length) {

            contenido = `

                <div class="menu-extra-vacio">

                    <h3>
                        No hay contratos cargados
                    </h3>

                    <p>
                        Los contratos aparecerán aquí
                        cuando los agregues a un cliente.
                    </p>

                </div>

            `;

        }

        else {

            contenido = `

                <div class="menu-extra-grid">

                    ${clientesConContrato.map(
                        cliente => `

                        <div class="menu-extra-card">

                            <h3>
                                ${escaparHTML(
                                    cliente.nombre
                                )}
                            </h3>


                            <p>
                                📄
                                ${escaparHTML(
                                    cliente.contrato.nombre
                                )}
                            </p>


                            <button
                                class="btn-primary"
                                type="button"
                                onclick="verContrato('${cliente.id}')">

                                Abrir contrato

                            </button>

                        </div>

                    `).join("")}

                </div>

            `;

        }


        mostrarVistaExtra(
            "Contratos",
            "Consulta los contratos asociados a tus clientes.",
            contenido
        );

    }


    /* ==============================================
       EQUIPOS
    ============================================== */

    function vistaEquipos() {

        let contenido = "";


        if (!clientes.length) {

            contenido = `

                <div class="menu-extra-vacio">

                    <h3>
                        No hay clientes registrados
                    </h3>

                    <p>
                        Los datos de conexión
                        aparecerán aquí.
                    </p>

                </div>

            `;

        }

        else {

            contenido = `

                <div class="menu-extra-grid">

                    ${clientes.map(
                        cliente => `

                        <div class="menu-extra-card">

                            <h3>
                                ${escaparHTML(
                                    cliente.nombre
                                )}
                            </h3>


                            <p>

                                <strong>
                                    IP:
                                </strong>

                                ${escaparHTML(
                                    cliente.ip ||
                                    "No registrada"
                                )}

                            </p>


                            <p>

                                <strong>
                                    Plan:
                                </strong>

                                ${escaparHTML(
                                    cliente.plan ||
                                    "No registrado"
                                )}

                            </p>


                            <p>

                                <strong>
                                    Estado:
                                </strong>

                                ${escaparHTML(
                                    cliente.estado ||
                                    "No registrado"
                                )}

                            </p>

                        </div>

                    `).join("")}

                </div>

            `;

        }


        mostrarVistaExtra(
            "Equipos",
            "Consulta la información de conexión de cada cliente.",
            contenido
        );

    }


    /* ==============================================
       SOPORTE
    ============================================== */

    function vistaSoporte() {

        let contenido = "";


        if (!clientes.length) {

            contenido = `

                <div class="menu-extra-vacio">

                    <h3>
                        No hay clientes registrados
                    </h3>

                    <p>
                        Agrega clientes para gestionar soporte.
                    </p>

                </div>

            `;

        }

        else {

            contenido = `

                <div class="menu-extra-grid">

                    ${clientes.map(
                        cliente => `

                        <div class="menu-extra-card">

                            <h3>
                                ${escaparHTML(
                                    cliente.nombre
                                )}
                            </h3>


                            <p>

                                <strong>
                                    Teléfono:
                                </strong>

                                ${escaparHTML(
                                    cliente.telefono ||
                                    "No registrado"
                                )}

                            </p>


                            <p>

                                <strong>
                                    Dirección:
                                </strong>

                                ${escaparHTML(
                                    cliente.direccion ||
                                    "No registrada"
                                )}

                            </p>


                            <button
                                class="btn-primary"
                                type="button"
                                onclick="abrirSoporteCliente('${cliente.id}')">

                                Crear solicitud

                            </button>

                        </div>

                    `).join("")}

                </div>

            `;

        }


        mostrarVistaExtra(
            "Soporte",
            "Gestiona solicitudes de atención para tus clientes.",
            contenido
        );

    }


    /* ==============================================
       BOTONES DE LA BARRA LATERAL
    ============================================== */

    menuItems.forEach(
        function(boton, indice) {

            boton.addEventListener(
                "click",
                function() {

                    seleccionarMenu(
                        boton
                    );


                    if (indice === 0) {

                        mostrarInicio();

                    }


                    if (indice === 1) {

                        mostrarClientes();

                    }


                    if (indice === 2) {

                        vistaPagos();

                    }


                    if (indice === 3) {

                        vistaContratos();

                    }


                    if (indice === 4) {

                        vistaEquipos();

                    }


                    if (indice === 5) {

                        vistaSoporte();

                    }

                }
            );

        }
    );

})();


/* ==================================================
   SOPORTE - CREAR SOLICITUD
================================================== */

function abrirSoporteCliente(id) {

    const cliente =
        clientes.find(
            c => c.id === id
        );


    if (!cliente) {
        return;
    }


    const motivo =
        prompt(
            `Escribe el motivo del soporte para ${cliente.nombre}:`
        );


    if (motivo === null) {
        return;
    }


    const texto =
        motivo.trim();


    if (!texto) {

        alertar(
            "Debes escribir el motivo de la solicitud."
        );

        return;

    }


    alertar(
        `Solicitud creada para ${cliente.nombre}.`
    );

}


/* ==================================================
   INICIAR SISTEMA
================================================== */

iniciarBaseDatos();