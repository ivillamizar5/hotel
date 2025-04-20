import { traerIdUsuario } from "../login/funcionesUsuario.js";

//mostrar habitacion por idHabitacion
async function mostrarHabitacionId(idHabitacion) {
  try {
    const result = await fetch(
      `http://localhost:3000/habitacion?id=${idHabitacion}`
    );
    if (!result.ok) {
      throw new Error("Error al traer los datos");
    }
    const data = await result.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

//cuando hago el checkin verifico el numero de la habitacion disponible para retornarlas
async function traerNumeroHabitacionNoReservada(idhabitacion) {
  try {
    const dataHabitaciones = await mostrarHabitacionId(idhabitacion);
    const habitacionReservada = await fetch(
      `http://localhost:3000/reserva?idhabitacion=${idhabitacion}`
    );
    if (!habitacionReservada.ok) {
      throw new Error("Error al traer los datos");
    }
    const data = await habitacionReservada.json();
    let filtroHabitacion = dataHabitaciones[0].numhabitacion;
    data.forEach((element) => {
      if (filtroHabitacion.includes(element.numhabitacion)) {
        //verifico que si el numero de la habitacion esta incluido en alguna habitacion
        filtroHabitacion = filtroHabitacion.filter(
          (el) => el != element.numhabitacion
        );
      }
    });
    
    return filtroHabitacion;
  } catch (error) {
    console.log(error);
  }
}

async function traerReservas() {
  try {
    const respuesta = await fetch("http://localhost:3000/reserva");
    if (!respuesta.ok) {
      throw new Error("Error al traer las reservas");
    }
    const data = await respuesta.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// http://localhost:3000/reserva?idusuario=1
async function traerReservasxUsuario() {
  try {
    const idUsuario = await traerIdUsuario(); // Espera que se resuelva traerIdUsuario
    
    const respuesta = await fetch(`http://localhost:3000/reserva?idusuario=${idUsuario}`);
    
    if (!respuesta.ok) {
      throw new Error("Error al traer las reservas");
    }

    const data = await respuesta.json();
    console.log(data);
    return data;

  } catch (error) {
    console.error("Error al obtener las reservas:", error);
  }
}

// Función para eliminar una reserva
async function eliminarReserva(idReserva) {
  try {
    const respuesta = await fetch(`http://localhost:3000/reserva/${idReserva}`, {
      method: "DELETE",
    });

    if (!respuesta.ok) {
      throw new Error("Error al eliminar la reserva");
    }

    const resultado = await respuesta.json();
    console.log("Reserva eliminada correctamente:", resultado);
    return true; // éxito
  } catch (error) {
    console.error("Error al eliminar la reserva:", error);
    return false; // fallo
  }
}





// // Filtrar habitaciones que no están reservadas


// Función para normalizar una fecha y quitar la parte de la hora
function normalizarFecha(fecha) {
  const fechaObj = new Date(fecha);
  fechaObj.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00
  return fechaObj;
}

// Filtrar habitaciones que no están reservadas
async function mostrarHabitaciones(fechaInicio, fechaFin) {
  try {
    // Traer las reservas
    const listaReservadas = await traerReservas();
    
    // Crear un objeto para almacenar las habitaciones reservadas por ID
    let obj = {};

    // Normalizar las fechas de inicio y fin
    const inicio = normalizarFecha(fechaInicio);
    const fin = normalizarFecha(fechaFin);

    // Recorrer todas las reservas
    listaReservadas.forEach((el) => {
      // Normalizar las fechas de las reservas
      const reservaInicio = normalizarFecha(el.fechareserva);
      const reservaFin = normalizarFecha(el.fechafinreserva);

      // Verificar si las fechas de la reserva se solapan con el rango de fechas proporcionado
      if (inicio <= reservaFin && fin >= reservaInicio) {
        let idhabitacion = el.idhabitacion;

        // Si ya existe el idhabitacion, agregamos los números de habitación a la lista
        if (obj[idhabitacion]) {
          obj[idhabitacion].push(el.numhabitacion);
        } else {
          obj[idhabitacion] = [el.numhabitacion];
        }
      }
    });

    // Obtener la lista de habitaciones
    const result = await fetch("http://localhost:3000/habitacion");
    if (!result.ok) {
      throw new Error("Error al traer los datos");
    }
    const data = await result.json();

    

    // Filtrar habitaciones disponibles (eliminando las reservadas)
    data.forEach((el) => {
      // Verificar si el ID de la habitación está en las reservas
      if (obj.hasOwnProperty(el.id)) {
        // Filtrar las habitaciones no reservadas
        el.numhabitacion = el.numhabitacion.filter((num) => 
          !obj[el.id].some((element) => element.includes(num))
        );
      }
    });

    // Ordenar las habitaciones por el número de habitaciones disponibles
    data.sort((a, b) => b.numhabitacion.length - a.numhabitacion.length);

   
    return data;
  } catch (error) {
    console.error(error);
  }
}



// Función para reservar una habitación
async function reservarHabitacion(
  fechareserva,
  fechafinreserva,
  idusuario,
  idhabitacion,
  precio,
  numhabitacion,
  noches,
  cantidadpersonas
) {
  try {
    const result = await fetch("http://localhost:3000/reserva", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fechareserva,
        fechafinreserva,
        idusuario,
        idhabitacion: parseInt(idhabitacion),
        precio,
        numhabitacion,
        estado: false,
        noches,
        cantidadpersonas,
      }),
    });
    if (!result.ok) {
      throw new Error("Error al guardar la reserva");
    }
  } catch (error) {
    console.log(error);
  }
}

export {
  mostrarHabitaciones,
  traerNumeroHabitacionNoReservada,
  reservarHabitacion,
  traerReservasxUsuario,
  eliminarReserva
};
