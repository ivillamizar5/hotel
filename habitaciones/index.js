import { cerrarIniciarSesion } from "../login/funcionSesion.js";
import { traerIdUsuario } from "../login/funcionesUsuario.js";
import {
  mostrarHabitaciones,
  reservarHabitacion,
  traerNumeroHabitacionNoReservada,
} from "./funcionReserva.js";

const habitaciones = document.getElementById("habitaciones");
const formConsulta = document.getElementById("formConsulta");
const hazteunacuenta = document.querySelectorAll(".hazteunacuenta");
const cerrarSesion = document.querySelectorAll(".cerrarSesion");

//modal
const modal = document.getElementById("modal");
const tituloModal = document.querySelector(".tituloModal");
const textoModal = document.querySelector(".textoModal");
const habitacionesReservadas = document.querySelectorAll(".habitacionesReservadas");


// Formatear la fecha actual a YYYY-MM-DD
const fechaActual = new Date();
const anio = fechaActual.getFullYear();
const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
const dia = String(fechaActual.getDate()).padStart(2, "0");
const fechaFormateada = `${anio}-${mes}-${dia}`;
// Asignar la fecha mínima al input de fecha
document.getElementById("inicio").setAttribute("min", fechaFormateada);
document.getElementById("final").setAttribute("min", fechaFormateada);

let ruta = "../login/login.html";

cerrarIniciarSesion(
  cerrarSesion,
  hazteunacuenta,
  habitacionesReservadas,
  function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  ruta
);

const fechaInico = document.getElementById("inicio");
const fechaFinal = document.getElementById("final");
let cantPersonas = document.getElementById("cantidadpersonas");

// Formatear la fecha en el formato aceptado por el input de tipo "date"
const formattedDate = `${anio}-${mes}-${dia}`;

// Establecer el valor del input
fechaInico.value = formattedDate;
fechaFinal.value = formattedDate;

formConsulta.addEventListener("submit", (e) => {
  e.preventDefault();
  //calcular las noches restando la fecha final y inicio
  let fechaFinal1 = new Date(fechaFinal.value);
  let fechaInico1 = new Date(fechaInico.value);
  let diff = fechaFinal1.getTime() - fechaInico1.getTime();

  let noches = Math.round(diff / (1000 * 60 * 60 * 24));
  habitaciones.textContent = "";

  
  if (cantPersonas.value === 0) {
    cantPersonas = 1;
  }

  if (noches === 0 || isNaN(noches)) {
    noches = 1;
  }

  pintarHabitaciones(noches, cantPersonas.value);
});

pintarHabitaciones(1, 1);

async function pintarHabitaciones(noches, cantPersonas) {
  let data = await mostrarHabitaciones(fechaInico.value, fechaFinal.value);
  
  data = data.filter((e) => e.cantidadpersonas >= cantPersonas);

  if (data.length === 0) {
    console.log("No hay habitaciones");
  }

  // Configurar el contenedor principal como grid responsivo
  habitaciones.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  data.forEach((e) => {
    // Crear el contenedor principal para cada habitación
    let div = document.createElement("div");

    div.className =
      "p-4 border-gray-200 border rounded-sm shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4 ml-5 mr-5 mt-5";

    // Contenedor de texto
    let textContainer = document.createElement("div");
    textContainer.className = "flex-1";

    // Agregar el título de la habitación
    textContainer.innerHTML += `<div  items-center">
          <a href="${e.imagen}" target="_blank" class="text-xl font-bold text-gray-800 mr-2">${e.tipohabitacion}</a>
         
        </div>`;

    // Agregar lista de propiedades con borde y espacio a la derecha
    let listItems = "";
    for (const key in e.propio) {
      listItems += `<li class="list-none text-gray-600 whitespace-nowrap border border-gray-400 p-1 mr-2 mt-2 text-xs">${e.propio[key]}</li>`;
    }

    // Hacer que la lista sea horizontal, con ajuste automático de elementos si es necesario
    textContainer.innerHTML += ` <ul class="flex flex-wrap">${listItems}</ul> <p>${e.descripcion}</p>`;

    let listHabitacion = "";

    for (let i = 0; i < e.numhabitacion.length; i++) {
      listHabitacion += `
      <label>
        <input type="checkbox" class="miCheckbox" name="numHabitacion${e.numhabitacion[i]}" value=${e.numhabitacion[i]}>
        ${e.numhabitacion[i]}
      </label>
      `;
    }

    // Crear opciones para el select
    let listOption = "";
    let i = 0;
    for (let i = 1; i <= e.cantidadpersonas; i++) {
      listOption += `<option value="${parseInt(i).toString()}">${i}
                  </option>`;
    }

    // Agregar el select y un párrafo para mostrar el precio seleccionado
    textContainer.innerHTML += `<form class="formReserva">  
        <label class="block mt-3 mb-3">
          Cantidad de personas:
          <select class=" mt-1 block w-full px-2 py-1 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-400 transition-all duration-150 select-precio">
            ${listOption}
          </select>
        </label>
    <label> Habitaciones:</label> ${listHabitacion}

          <p class="text-lg font-semibold text-gray-800 mt-2 precio-habitacion">
            Precio para ${noches} NOCHE: <span class="text-blue-500"></span>
          </p>
          
          <input type="submit" value="Reservar" id="${
            e.id
          }" class="btnReservar ${
      e.numhabitacion.length === 0 ? "hidden" : "block"
    } block m-auto px-2 py-2 bg-blue-500 text-white font-semibold rounded-sm shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-100">
          </input>
           </form> 
           <p > ${e.numhabitacion.length === 0 ? "No Disponible" : ""}</p>
        `;

   

    // Agregar los contenedores al div principal
    div.appendChild(textContainer);

    // Agregar al contenedor principal de habitaciones
    habitaciones.appendChild(div);

    // Actualizar el precio al cambiar la selección
    // Obtener checkboxes del formulario actual
    const precioSpan = div.querySelector(".precio-habitacion span");
    // Añadir evento change para manejar los checkboxes seleccionados en el formulario actual
    precioSpan.textContent = e.precio * noches;
    let canthabiSelec = 1;

   // Inicializar el precio en el <span> con el primer valor del select
   const select = div.querySelector(".select-precio");
 

    //evento para reservar
    let arrayNumHabitacion = []; // Arreglo para almacenar checkboxes seleccionados
    const formReserva = div.querySelector(".formReserva");
    precioSpan.textContent = e.precio * noches; // Mostrar el precio inicial

    const checkboxes = formReserva.querySelectorAll(".miCheckbox");

    // Añadir eventos solo a los checkboxes del formulario actual
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          // Agregar al arreglo si no está ya presente
          if (!arrayNumHabitacion.includes(checkbox.value)) {
            arrayNumHabitacion.push(checkbox.value);
          }
        } else {
          // Eliminar del arreglo si se desmarca
          const index = arrayNumHabitacion.indexOf(checkbox.value);
          if (index > -1) {
            arrayNumHabitacion.splice(index, 1);
          }
        }

        // Actualizar el precio mostrado en el span correspondiente
        if (arrayNumHabitacion.length === 0) {
          precioSpan.textContent = select.value*(e.precio * noches); // Precio base
        } else {
          precioSpan.textContent =
            select.value* arrayNumHabitacion.length * e.precio * noches;
        }

        
      });
    });

    //const formReserva = div.querySelector(".formReserva");
    formReserva.addEventListener("submit", async (e) => {
      e.preventDefault();

      const idUsuario = await traerIdUsuario();
      if (!idUsuario) {
        //El usuario está registrado?
        //si me devuelve falso, muestro el usuario no se ha registrado
        tituloModal.textContent = "";
        textoModal.textContent = "Debes iniciar sesión para reservar";
        modal.classList.remove("hidden");
      } else {
        //traer los valores de los checks
        let precio =
          e.target.children[e.target.children.length - 2].children[0]
            .textContent;
        let idhabitacion = e.target.children[e.target.children.length - 1].id;
       


        //validar que se haya seleccionado una habitacion
        if (arrayNumHabitacion.length === 0) {
          tituloModal.textContent = "";
          textoModal.textContent = "Debes seleccionar una habitación";
          modal.classList.remove("hidden");
          return;
        } else {
          //llevar los datos para que se puedan agregar

          await reservarHabitacion(
            fechaInico.value,
            fechaFinal.value,
            idUsuario,
            idhabitacion,
            precio,
            arrayNumHabitacion,
            noches,
            select.value
          );
          await mostrarHabitaciones(fechaInico.value, fechaFinal.value);
          alert(
            `RESERVA CREADA!!  El check-in empieza a las 14:00 del día ${fechaInico.value} Si no llegas antes de las 16:00, tu reserva se cancela y la habitación queda disponible para otros.`
          );
        }
      }
    });
  });
}

document.getElementById("closeModal").addEventListener("click", () => {
  modal.classList.add("hidden");
});

// abrir y cerrar el menu en dispositivos pequeños
const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

menuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

