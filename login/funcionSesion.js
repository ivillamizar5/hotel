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


function cerrarIniciarSesion(cerrarSesion,hazteunacuenta,sleep,ruta){  
  console.log(cerrarSesion)
  if (usuario) {
    // Si hay un usuario
    cerrarSesion.innerHTML = "Cerrar Sesión"
    hazteunacuenta.removeAttribute("href");
    hazteunacuenta.innerHTML="";
  }  else {
    cerrarSesion.innerHTML = "Iniciar Sesión"
  //   // si el usuario está vacío
  //   //mensajeAlerta.textContent = "No hay sesión activa. Será redirigido en 5 segundo a la página de inicio de Sesion";
   }

   cerrarSesion.addEventListener("click", () => {
    console.log("aca")
    if(localStorage.getItem("usuarioActual")===null){
      
      window.location.href = ruta;
      
    }else{
      localStorage.removeItem("usuarioActual");
      sleep(1000).then(() => {
      
        window.location.href = "./index.html"
      });
    }
  })


}




export{crearSesion,cerrarIniciarSesion} 