let textCorreo = document.getElementById("txtEmail");
let textContra = document.getElementById("txtContra");
let btnIniciarSesion = document.getElementById("btnLogin");
let btnRegistrarse = document.getElementById("btnRegister");

// Declara las variables para conectarse con servidor remoto
// que contiene el web service
//--------------------------------------------------------------
let url = "http://localhost:5000"; // Actualizada según la documentación

// Programación de evento botón login
btnIniciarSesion.addEventListener("click", function(){
    let correo = encodeURIComponent(textCorreo.value);
    let contra = encodeURIComponent(textContra.value);
    const URL = `${url}/login/${correo}/${contra}`;
    console.log("URL" + URL);

    fetch(URL, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response =>{
        if (response.status === 404){
            textCorreo.value = "";
            textContra.value = "";
            throw new Error("Usuario no encontrado. Por favor, regístrate primero.");
        }
        return response.json();
    })
    .then(data => {
        if (data.status_code === 200 && data.status_message === "Ok") {
            let id = data.data.user.token;
            let nombre = data.data.user.name;
            
            // Guardar en localStorage
            localStorage.setItem("usuarioId", id);
            localStorage.setItem("usuarioNombre", nombre);

            alert("Inicio de sesión exitoso\nID: " + id + "\nNombre: " + nombre);
            textCorreo.value = "";
            textContra.value = "";

        } else if (data.status_code === 401 && data.status_message === "Unauthorized") {
            console.log("AQUI");
            alert(data.data);
            textCorreo.value = "";
            textContra.value = "";
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
        alert(error.message || "Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.");
    });
});
