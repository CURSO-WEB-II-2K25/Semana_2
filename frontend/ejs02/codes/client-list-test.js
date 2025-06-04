let usuarioActual = JSON.parse(localStorage.getItem("Usuario_Actual_Logueado")) || [];
//let btnMostrarCliente = document.getElementById("btnMostrarCliente");
let label = document.getElementById("usuarioActualLabel");

// Declara las variables para conectarse con servidor remoto
// que contiene el web service
//--------------------------------------------------------------
let url = "http://localhost:5000"; // Actualizada según la documentación

// Funciones
function crearListadoCliente(token){
const URL = `${url}/${token}/customer`;
return fetch(URL)
    .then(response => response.json())
    .then(data => {
        if (
            data.status_code === 200 &&
            data.status_message === "Ok" &&
            data.data === "Empty customers list"
        ) {
            alert("Lista de clientes vacía");
            return [];
        }
        else if (
            data.status_code === 200 &&
            data.status_message === "Ok" &&
            Array.isArray(data.data)
        ) {
            return data.data;
        } else {
            return [];
        }
    })
    .catch(error => {
        console.error("Error al obtener la lista de clientes:", error);
        return [];
    });
}

function eliminarCliente(token,idCus){
    if(!confirm("¿Está seguro de que desea eliminar este cliente? Esta acción no se puede deshacer.")) {
        return; // Si el usuario cancela, no hacer nada
    }
    const URL = `${url}/${token}/customer/${idCus}`;
    fetch(URL, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.status === 404) {
            alert("Cliente no encontrado.");
            throw new Error("Cliente no encontrado.");
        }
        if (!response.ok) {
            alert(`Error del servidor: ${response.status}`);
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.result === true) {
            alert("Cliente eliminado correctamente.");
            document.getElementById(`fila-${idCus}`)?.remove();
        } else {
            alert("No se pudo eliminar el cliente. Respuesta inesperada del servidor.");
        }
    })
    .catch(error => {
        console.error("Error al eliminar el cliente:", error);
        alert("Error inesperado. Ver consola para más detalles.");
    });
}

function agregarIdCliente(id){
    localStorage.setItem("Id_Cliente_Seleccionado", id);
}

function crearTablaClientes(listaClientes) {
    const contenedor = document.getElementById("tablaClientes");
    contenedor.innerHTML = ""; 
    listaClientes.forEach(cliente => {
        const fila = `
            <tr id="fila-${cliente.id}">
                <td>${cliente.id || ""}</td>
                <td>${cliente.idcard || ""}</td>
                <td>${cliente.name || ""}</td>
                <td>
                    <a class="btn btn-primary btn-sm me-2" href="modifyCustomer.html" onclick="agregarIdCliente('${cliente.id}')">Modificar</a>
                    <button class="btn btn-danger btn-sm" onclick="eliminarCliente('${usuarioActual[0].usuario_id}','${cliente.id}')">Eliminar</button>
                </td>
            </tr> 
        `;
        contenedor.insertAdjacentHTML('beforeend', fila);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    if (usuarioActual.length === 0) {
        alert("Por favor, inicie sesión primero.");
        return;
    }
    const token = usuarioActual[0].usuario_id;
    label.textContent = usuarioActual[0].usuario_nombre.toUpperCase();
    crearListadoCliente(token).then(listaClientes => {
        crearTablaClientes(listaClientes);
    });
});


