import {
  validateName,
  validateEmail,
  validateMessage,
} from "./validationFunctions/loginAndRegister.js";

import { initObject, sendFormObject } from "./validationFunctions/initFormDataObject.js";

document.addEventListener("DOMContentLoaded", () => {
  const nombre = document.querySelector("#nombre");
  const inputEmail = document.querySelector("#email");
  const spans = document.querySelectorAll("span");
  const submitButton = document.querySelector("button");
  const message = document.querySelector("textarea");
  const form = document.querySelector("form");

  //Validación campos del formulario al darle al botón
  submitButton.addEventListener("click", (evento) => {
    evento.preventDefault();

    //Campos formulario de contacto: nombre, email y mensaje
    const validatedName = validateName(nombre, spans[0]);
    const validatedEmail = validateEmail(inputEmail, spans[1]);
    const validatedMessage = validateMessage(message, spans[2]);

    if (validatedName && validatedEmail && validatedMessage) {
      //Si los campos son válidos enviamos los datos por método "POST" asíncronamente con API FETCH al servidor
      let contactInfo = initObject(form);

      sendFormObject(contactInfo, "/contacto/sendContactInfo")
        .then((mensaje) => {
          //Mostramos el mensjae de envío correcto/incorrecto que nos llega desde el servidor
          spans[3].textContent = mensaje;
          spans[3].style.color = "white";
        })
        .catch((error) => console.log(error));
    }
  });
});
