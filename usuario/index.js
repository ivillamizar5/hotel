import { eliminarReserva, traerReservasxUsuario } from "../habitaciones/funcionReserva.js";
import { cerrarIniciarSesion } from "../login/funcionSesion.js";




const habitacionesReservadaUsuario = document.getElementById("habitacionesReservadaUsuario");


async function pintarHabitacionesReservadaUsuario() {
    const reservas = await traerReservasxUsuario();
  
    if (reservas.length === 0) {
      habitacionesReservadaUsuario.innerHTML = `<p class="text-gray-500">No tienes habitaciones reservadas aún.</p>`;
      return;
    }
  
    habitacionesReservadaUsuario.innerHTML = "";
    habitacionesReservadaUsuario.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex-grow";
  
    reservas.forEach((reserva) => {
      const div = document.createElement("div");
      div.className = "p-4 border border-gray-300 rounded-sm shadow-sm bg-white m-2";
  
      const habitacionesList = reserva.numhabitacion.map(num => `<li>${num}</li>`).join("");
  
      div.innerHTML = `
        <h3 class="text-lg font-bold text-blue-700 mb-2">Reserva #${reserva.id}</h3>
        <p><strong>Fechas:</strong> ${reserva.fechareserva} ➝ ${reserva.fechafinreserva}</p>
        <p><strong>Noches:</strong> ${reserva.noches}</p>
        <p><strong>Personas:</strong> ${reserva.cantidadpersonas}</p>
        <p><strong>Precio:</strong> $${Number(reserva.precio).toLocaleString()}</p>
        <p><strong>Estado:</strong> ${reserva.estado ? "Activa" : "Por Check in"}</p>
        <p><strong>Habitaciones:</strong></p>
        <ul class="list-disc ml-6 text-gray-700">${habitacionesList}</ul>
        <button class="cancelarReserva bg-red-500 text-white px-3 py-1 mt-2 rounded hover:bg-red-600" data-id="${reserva.id}">
          Cancelar
        </button>
      `;
  
      habitacionesReservadaUsuario.appendChild(div);
  
      // Asignar el evento de clic al botón de "Cancelar" dentro de cada div creado
      div.querySelector(".cancelarReserva").addEventListener("click", async (e) => {
        const idReserva = e.target.getAttribute("data-id");
        const confirmar = confirm(`¿Seguro que deseas cancelar la reserva ${idReserva}?`);
  
        if (confirmar) {
          const eliminada = await eliminarReserva(idReserva);
          if (eliminada) {
            alert("Reserva cancelada con éxito");
            // Recargar reservas
            const idUsuario = await traerIdUsuario();
            const nuevasReservas = await traerReservasPorIdUsuario(idUsuario);
            pintarHabitacionesReservadaUsuario(nuevasReservas);
          } else {
            alert("No se pudo cancelar la reserva");
          }
        }
      });
    });
  }
  




const hazteunacuenta = document.querySelectorAll(".hazteunacuenta");

const cerrarSesion = document.querySelectorAll(".cerrarSesion");
const habitacionesReservadas = document.querySelectorAll(".habitacionesReservadas");
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





document.addEventListener("DOMContentLoaded", () => {
    pintarHabitacionesReservadaUsuario();
  });

document.getElementById("closeModal").addEventListener("click", () => {
    modal.classList.add("hidden");
  });
  
  // abrir y cerrar el menu en dispositivos pequeños
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");
  
  menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
  