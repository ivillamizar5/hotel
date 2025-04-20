let usuario = localStorage.getItem("usuarioActual");
function crearSesion(nomUsu){
  if(usuario === null){
    let usuario = [];
    usuario.push(nomUsu);
    localStorage.setItem("usuarioActual", JSON.stringify(usuario));
    localStorage.setItem("paginaAnterior", "./index.html");
    window.location.href = "../index.html";
  }
}

function cerrarIniciarSesion(cerrarSesion, hazteunacuenta, habitacionesReservadas, sleep, ruta) {
  if (usuario) {
    cerrarSesion.forEach(boton => boton.innerHTML = "Cerrar Sesión");

    hazteunacuenta.forEach(elem => elem.style.display = "none");

    habitacionesReservadas.forEach(elem => elem.style.display = "block");
  } else {
    cerrarSesion.forEach(boton => boton.innerHTML = "Iniciar Sesión");
    habitacionesReservadas.forEach(elem => elem.style.display = "none");
    hazteunacuenta.forEach(elem => elem.style.display = "block");
  }

  cerrarSesion.forEach(boton => {
    boton.addEventListener("click", () => {
      if (localStorage.getItem("usuarioActual") === null) {
        window.location.href = ruta;
      } else {
        localStorage.removeItem("usuarioActual");
        sleep(1000).then(() => {
          window.location.href = "../index.html";
        });
      }
    });
  });
}




export{crearSesion,cerrarIniciarSesion} 