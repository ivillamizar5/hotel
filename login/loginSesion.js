
import {verificarUsuario} from "./funcionesUsuario.js";
import {crearSesion,cerrarIniciarSesion} from "./funcionSesion.js";

const hazteunacuenta = document.getElementById("hazteunacuenta")
const cerrarSesion = document.getElementById("cerrarSesion");


const formu = document.getElementById("formularioLogin");


    let ruta ="./login.html";

   cerrarIniciarSesion(cerrarSesion,hazteunacuenta,function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },ruta)



async function validarLoginUsuario(usuario,password) {
  if (usuario === "") {
    console.log("Verifique que todos los campos se encuentre registrados");
  } else {
    const traerUsuario = await verificarUsuario(usuario, password);
    
    if (traerUsuario === undefined) {
      console.log("Usuario no existe")
    } else {
      crearSesion(usuario)
    }
  }
}

formu.addEventListener("submit", (event) => {
  event.preventDefault();
  const nomUsu = document.getElementById("nombreUsuario").value.trim();
  const password = document.getElementById("contrasenna").value.trim();
  validarLoginUsuario(nomUsu, password)  //si existe el usuario almacenarlo en el localStorach
});



  // abrir y cerrar el menu en dispositivos pequeños
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });




