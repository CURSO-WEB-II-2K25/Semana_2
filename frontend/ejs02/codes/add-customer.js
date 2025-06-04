let txtIdClienteAdd = document.getElementById("clienteId-add");
let txtNombreClienteAdd = document.getElementById("clienteNombre-add");
let txtTelefonoClienteAdd = document.getElementById("clienteTelefono-add");
let txtEmailClienteAdd = document.getElementById("clienteEmail-add");
let btnGuardarCustomerAdd = document.getElementById("btnGuardarCus");
let usuarioActualAdd = JSON.parse(localStorage.getItem("Usuario_Actual_Logueado")) || [];

// Declara las variables para conectarse con servidor remoto
// que contiene el web service
//--------------------------------------------------------------
let urlAddCustomer = "http://localhost:5000"; // Actualizada según la documentación

// Funciones
function guardarCliente() {
    if (usuarioActualAdd.length > 0) {
        if (
            txtIdClienteAdd.value === "" ||
            txtNombreClienteAdd.value === "" ||
            txtEmailClienteAdd.value === "" ||
            txtTelefonoClienteAdd.value === ""
        ) {
            alert('Por favor complete todos los campos requeridos.');
            return;
        }
        let idcard = txtIdClienteAdd.value;
        let nombre = txtNombreClienteAdd.value;
        let email = decodeURIComponent(txtEmailClienteAdd.value);
        let telefono = txtTelefonoClienteAdd.value;
        const URL = `${urlAddCustomer}/${document.getElementById("clienteId").value}/customer`;

        fetch(URL, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idcard: idcard,
                name: nombre,
                cellphone: telefono,
                email: email
            })
        })
        .then(response => {
            if (response.status === 500 || response.status === 400) {
                alert("Error al ingresar el cliente.");
                throw new Error("Error al ingresar el cliente.");
            }
            return response.json();
        })
        .then(data => {
            if (data.customer.status_message === "Data was created" && data.customer.status_code === 201) {
                alert("Cliente creado correctamente.");
                txtIdClienteAdd.value = "";
                txtNombreClienteAdd.value = ""; 
                txtEmailClienteAdd.value = "";
                txtTelefonoClienteAdd.value = "";
            } else {
                alert("No se pudo crear el cliente. Verifica los datos.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    } else {
        alert("No hay un usuario logueado. Por lo tanto, no se puede guardar el cliente.");
        return;
    }
}
btnGuardarCustomerAdd.addEventListener("click", guardarCliente);
