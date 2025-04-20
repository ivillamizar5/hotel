async function verificarUsuario(usuario, password) {
  try {
    const result = await fetch("http://localhost:3000/usuarios");
    if (!result.ok) {
      throw new Error("Error al traer los datos");
    }
    const data = await result.json();
    const user = data.find(
      (e) => e.username === usuario && e.password === password
    );
    
    return user;
  } catch (error) {
    console.log(error);
  }
}

async function traerIdUsuario() {
  let usuario = localStorage.getItem("usuarioActual");
  if (usuario === null) {
    return false;
  } else {
    usuario = usuario.replace(/[\[\]"]/g, '');
    try {
      const result = await fetch(
        `http://localhost:3000/usuarios?username=${usuario}`
      );
      
      if (!result.ok) {
        throw new Error("Error al traer los datos");
      }
      
      const idUsuario = await result.json();
      return idUsuario[0].id;
    } catch (error) {
      console.log(error);
    }
  }
}





// Exportar todas las funciones
export { verificarUsuario, traerIdUsuario };
