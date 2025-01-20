import { cerrarIniciarSesion, crearSesion } from "./funcionSesion.js";
import {  verificarUsuario } from "./funcionesUsuario.js";

const formAgregar = document.getElementById("agregarUsuario");
const nombre = document.getElementById("nombre");
const usuario = document.getElementById("usuario");
const password = document.getElementById("contrasenna");

const hazteunacuenta = document.getElementById("hazteunacuenta")
const cerrarSesion = document.getElementById("cerrarSesion");


let ruta ="./login.html";

cerrarIniciarSesion(cerrarSesion,hazteunacuenta,function (ms) {
 return new Promise(resolve => setTimeout(resolve, ms))
},ruta)


async function agregarUsuario(nombre, username, password) {
  const data = {
    username,
    nombre,
    password,
  };

  try {
    const result = await fetch("http://localhost:3000/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!result.ok) {
      throw new Error("Error al guardar los datos");
    }
    window.location.href = "../index.html";
    //generar la sesion

  } catch (error) {
    console.log(error);
  }
}


async function validarUsuario(nombre, usuario, password) {
  const traerUsuario = await verificarUsuario(usuario, password);

  if (nombre.length === "" || usuario.length === "" || password === "") {
    console.log("Verifique que todos los campos se encuentre registrados");
  } else {
    if (traerUsuario === undefined) {
      agregarUsuario(nombre, usuario, password);
      crearSesion(usuario);
    } else {
      console.log("El usuario Existe");
    }
  }
}


formAgregar.addEventListener("submit", (e) => {
  e.preventDefault();
  
  validarUsuario(nombre.value.trim(),usuario.value.trim(), password.value.trim());
  nombre.value="";
  usuario.value="";
  password.value="";
});


  // abrir y cerrar el menu en dispositivos pequeños
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
