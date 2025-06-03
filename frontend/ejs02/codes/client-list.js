let usuarioActual = JSON.parse(localStorage.getItem("Usuario_Actual_Logueado")) || [];
let btnMostrarCliente = document.getElementById("btnMostrarCliente");

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

function crearCardClientes(listaClientes) {
    const contenedor = document.getElementById("contenedorClientes");
    contenedor.innerHTML = ""; 
    listaClientes.forEach(cliente => {
        const cardHTML = `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="card cartaCliente">
                    <div class="card-body">
                        <h5 class="card-title">${cliente.name}</h5>
                        <p class="card-text">
                            <strong>ID:</strong> ${cliente.id || ""}<br>
                            <strong>Cédula:</strong> ${cliente.idcard || ""}<br>
                            <strong>Email:</strong> ${cliente.email || ""}<br>
                            <strong>Teléfono:</strong> ${cliente.cellphone || ""}<br>
                            <strong>Token:</strong> ${cliente.token || ""}<br>
                        </p>
                        <button class="btn btn-primary btn-sm me-2">Modificar</button>
                        <button class="btn btn-danger btn-sm">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', cardHTML);
    });
}

btnMostrarCliente.addEventListener("click", function() {
    if (usuarioActual.length === 0) {
        alert("Por favor, inicie sesión primero.");
        return;
    }
    const token = usuarioActual[0].usuario_id; 
    crearListadoCliente(token).then(listaClientes => {
        crearCardClientes(listaClientes);
    });
});
