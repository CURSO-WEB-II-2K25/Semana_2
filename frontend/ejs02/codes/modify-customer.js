let inputId = document.getElementById("clienteId");
let inputIdCard = document.getElementById("clienteIdCard");
let inputName = document.getElementById("clienteNombre");
let inputEmail = document.getElementById("clienteEmail");
let inputPhone = document.getElementById("clienteTelefono");
let ListaUsuarioActual = JSON.parse(localStorage.getItem("Usuario_Actual_Logueado")) || [];
let _id = localStorage.getItem("Id_Cliente_Seleccionado");
let token = ListaUsuarioActual[0].usuario_id || "";

// Declara las variables para conectarse con servidor remoto
// que contiene el web service
//--------------------------------------------------------------
let url = "http://localhost:5000"; // Actualizada según la documentación


function cargarDatosCliente(token,id,url){
    const URL = `${url}/${token}/customer/${id}`;
    fetch(URL, {
        method: "GET",
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
        return response.json();
    })
    .then(data => {
        if (data.status_code === 200 && data.status_message === "Ok" && data.data !=="Customer data not found") {
            let cliente = data.data;
            inputId.value = cliente.id || "";
            inputIdCard.value = cliente.idcard || "";
            inputName.value = cliente.name || "";
            inputEmail.value = cliente.email || "";
            inputPhone.value = cliente.cellphone || "";
        } else {
            alert("Error al cargar los datos del cliente.");
        }
    })
}

document.addEventListener("DOMContentLoaded", function() {
    cargarDatosCliente(token, _id, url);
});