let txtIdCliente = document.getElementById("clienteId");
let txtNombreCliente = document.getElementById("clienteNombre");
let txtEmailCliente = document.getElementById("clienteEmail");
let btnMostrarClienteActual = document.getElementById("btnMostrarCliente");
let usuarioActual = JSON.parse(localStorage.getItem("Usuario_Actual_Logueado")) || [];

// Declara las variables para conectarse con servidor remoto
// que contiene el web service
//--------------------------------------------------------------
let url = "http://localhost:5000"; // Actualizada según la documentación

// Funciones
function mostrarClienteActual() {
    if (usuarioActual.length > 0) {
        let idCliente = txtIdCliente.value = usuarioActual[0].usuario_id;
        const URL = `${url}/${idCliente}/me`;

        fetch(URL, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.status === 404) {
                alert("Usuario no encontrado.");
                throw new Error("Usuario no encontrado.");
            }
            return response.json();
        })
        .then(data => {
            if (data.status_code === 200 && data.status_message === "Ok") {
                let nombre = data.data.user.name;
                let correo = decodeURIComponent(data.data.user.email);
                txtNombreCliente.value = nombre;
                txtEmailCliente.value = correo;
            } 
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Ocurrió un error al obtener los datos del cliente.");
            txtIdCliente.value = "";
        });
    } else {
        alert("No hay un usuario logueado.");
    }
};