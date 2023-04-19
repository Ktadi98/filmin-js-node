import Suscripcion from "./clases/Suscripcion.js";
import { initObject, sendFormObject } from "./validationFunctions/initFormDataObject.js";

//Script que construye las suscripciones mediante la clase Suscripción y las añade al DOM del navegador.
const suscriptionTemplate = document.getElementById("suscriptionTemplate").content;
const suscriptionsBox = document.querySelector("#suscriptionsBox");
const fragment = document.createDocumentFragment();

const s1 = new Suscripcion(
  "Light",
  8.99,
  undefined,
  "Calidad FullHD hasta en 5 dispositivos. Cancela cuando quieras, sin compromiso."
);

const s2 = new Suscripcion(
  "Medium",
  14.99,
  undefined,
  "Calidad 4K hasta en 10 dispositivos. Esta es la suscripción que más usuarios han seleccionado."
);

const s3 = new Suscripcion(
  "Anual",
  149.99,
  "Si pagas todos los meses por adelantado, supone un ahorro del 17%.",
  "Calidad 4K hasta en 10 dispositivos todo el año! Cancela cuando quieras, sin compromiso."
);

const arraySuscripciones = [s1, s2, s3];
crearSuscripciones(arraySuscripciones);
const buttons = document.querySelectorAll("button");

buttons.forEach((button, index) => {
  button.addEventListener("click", (evento) => {
    evento.preventDefault();

    //Cuando clickemos a una suscripción en concreto enviamos los datos de tipo y precio para actualizarlos en la BD
    const formObject = {
      tipo: buttons[index].name,
      precio: arraySuscripciones[index].getPrecio(),
    };

    //Enviamos el tipo y precio asíncronamente mediante API FETCH por método POST al servidor
    sendFormObject(formObject, "/registerSelect/sendType")
      .then((mensaje) => {
        //Si el mensjae del server es de éxito redirigmos al usuario a la vista de inicio de sesión
        if (mensaje === "Selección confirmada correctamente.Disfruta de Filmin'!") {
          location.href = "/login";
        }
      })
      .catch((error) => console.log(error));
  });
});

//Función auxiliar para renderizar los tipos de suscripciones en la vista 
function crearSuscripciones(suscripciones) {
  suscripciones.forEach((suscripcion) => {
    suscriptionTemplate.querySelector("h2").textContent = suscripcion.getTipoPago();
    suscriptionTemplate.querySelector("h3").textContent = suscripcion.getPrecio() + "€";
    suscriptionTemplate.querySelector("p").textContent = "*" + suscripcion.getDescripcion();
    suscriptionTemplate.querySelector("button").textContent = "Continuar";
    suscriptionTemplate.querySelector("button").name = suscripcion.getTipoPago();
    const cloneSuscription = suscriptionTemplate.cloneNode(true);
    fragment.appendChild(cloneSuscription);
    suscriptionsBox.appendChild(fragment);
  });
}
