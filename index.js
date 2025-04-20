import { cerrarIniciarSesion } from "./login/funcionSesion.js";

const hazteunacuenta = document.querySelectorAll(".hazteunacuenta")
const cerrarSesion = document.querySelectorAll(".cerrarSesion");
const habitacionesReservadas = document.querySelectorAll(".habitacionesReservadas");


    let ruta ="./login/login.html";

   cerrarIniciarSesion(cerrarSesion,hazteunacuenta,habitacionesReservadas,function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },ruta)



// Lógica del carrusel 

let currentIndex = 0;
const carouselImages = document.getElementById("carouselImages");
const totalImages = carouselImages.children.length;

// Función para mover el carrusel
function moveCarousel(direction) {
  currentIndex += direction;

  // Asegura que el carrusel vuelva al inicio o final
  if (currentIndex < 0) {
    currentIndex = totalImages - 1;
  } else if (currentIndex >= totalImages) {
    currentIndex = 0;
  }

  // Desplazar las imágenes
  carouselImages.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Obtener los botones y añadirles los eventos
document.getElementById("prevButton").addEventListener("click", function() {
  moveCarousel(-1);
});

document.getElementById("nextButton").addEventListener("click", function() {
  moveCarousel(1);
});


  // abrir y cerrar el menu en dispositivos pequeños
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });


    