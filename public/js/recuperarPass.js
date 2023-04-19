import { validateEmail } from "./validationFunctions/loginAndRegister.js";

import { initObject, sendFormObject } from "./validationFunctions/initFormDataObject.js";

document.addEventListener("DOMContentLoaded", () => {
  const inputEmail = document.querySelector("#email");
  const spans = document.querySelectorAll("span");
  const submitButton = document.querySelector("button");
  const form = document.querySelector("form");

  //Validación campos del formulario al darle al botón
  submitButton.addEventListener("click", (evento) => {
    evento.preventDefault();

    //Recogemos el correo donde vamos a enviar la nueva contrasenya
    const validatedEmail = validateEmail(inputEmail, spans[0]);

    if (validatedEmail) {
      //Si el formato del email introducido es correcto
      let recoverInfo = initObject(form);

      //Enviamos los campos del formulario asíncronamente mediante API FETCH por método POST al servidor (/register.routes)
      sendFormObject(recoverInfo, "/recuperarPass/sendEmail")
        .then((mensaje) => {
          //Mostarmos el mensaje de error/confirmación que nos llega desde el servidor
          spans[1].textContent = mensaje;
          spans[1].style.color = "white";
        })
        .catch((error) => console.log(error));
    }
  });
});
