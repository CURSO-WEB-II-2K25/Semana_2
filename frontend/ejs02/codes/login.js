let textCorreo = document.getElementById("txtEmail");
let textContra = document.getElementById("txtContra");
let btnIniciarSesion = document.getElementById("btnLogin");
let btnRegistrarse = document.getElementById("btnRegister");
let ListaUsuarioActual = JSON.parse(localStorage.getItem("Usuario_Actual_Logueado")) || [];
let ListaUsuariosRegistrados = JSON.parse(localStorage.getItem("Lista_Usuarios_Registrados")) || [];

// Declara las variables para conectarse con servidor remoto
// que contiene el web service
//--------------------------------------------------------------
let url = "http://192.168.100.171:5000"; // Actualizada según la documentación

// Creacion de funciones
function crearUsuario(id,nombre, correo) {
    userActual = {
                usuario_id: id,
                usuario_nombre:nombre,
                usuario_email: correo,
            }
    return userActual;

}


// Funcion cerrar sesión
function cerrarSesion() {
    // Limpiar el usuario actual
    ListaUsuarioActual = [];
    localStorage.removeItem("Usuario_Actual_Logueado");
    alert("Sesión cerrada exitosamente.");
}

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
            throw new Error("Usuario no encontrado.");
        }
        return response.json();
    })
    .then(data => {
        if (data.status_code === 200 && data.status_message === "Ok") {
            let id = data.data.user.token;
            let nombre = data.data.user.name;
  
            // Crear el objeto del usuario actual
            let usuarioActual = crearUsuario(id, nombre,correo);

            
            // Guardar usuario actual (solo uno)
            if (ListaUsuarioActual.length === 0){
                ListaUsuarioActual = [usuarioActual];

                // Agregar a la lista de registrados solo si no existe ya
                const yaRegistrado = ListaUsuariosRegistrados.some(usuario => usuario.usuario_id == id)
                if (!yaRegistrado){
                    ListaUsuariosRegistrados.push(usuarioActual);
                }

                // Guardar en localStorage
                localStorage.setItem("Usuario_Actual_Logueado", JSON.stringify(ListaUsuarioActual));
                localStorage.setItem("Lista_Usuarios_Registrados", JSON.stringify(ListaUsuariosRegistrados));

                alert("Inicio de sesión exitoso\nID: " + id + "\nNombre: " + nombre);
            }else{
                alert("Ya hay un usuario logueado. Por favor, cierra sesión antes de iniciar sesión con otro usuario.");
            }
            // Limpiar los campos de entrada
            textCorreo.value = "";
            textContra.value = "";

        } else if (data.status_code === 401 && data.status_message === "Unauthorized") {
            console.log("AQUI EL ESTATUS 401");
            alert(data.data);
            textCorreo.value = "";
            textContra.value = "";
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
        alert("Usuario no encontrado. Regístrate primero.");
        textCorreo.value = "";
        textContra.value = "";
    });
});
