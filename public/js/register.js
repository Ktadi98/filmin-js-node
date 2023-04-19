import {
  validateName,
  validateApellido,
  validateEmail,
  validatePasswordRegister,
} from "./validationFunctions/loginAndRegister.js";

import { initObject, sendFormObject } from "./validationFunctions/initFormDataObject.js";

document.addEventListener("DOMContentLoaded", () => {
  const nombre = document.querySelector("#nombre");
  const apellido = document.querySelector("#apellido");
  const inputPass = document.querySelector("#pass");
  const inputEmail = document.querySelector("#email");
  const spans = document.querySelectorAll("span");
  const submitButton = document.querySelector("button");
  const form = document.querySelector("form");

  //Validación campos del formulario al darle al botón
  submitButton.addEventListener("click", (evento) => {
    evento.preventDefault();
    
    //Recogemos los datos del formulario en de registro del DOM (nombre,apellido,correo,contraseña)
    const nameValidated = validateName(nombre, spans[0]);
    const apellidoValidated = validateApellido(apellido, spans[1]);
    const emailValidated = validateEmail(inputEmail, spans[2]);
    const passwordValidated = validatePasswordRegister(inputPass, spans[3]);

    //Validamos el formato de los campos
    if (nameValidated && apellidoValidated && emailValidated && passwordValidated) {
      const registerInfo = initObject(form);

      //Si los campos tienen el formato correcto enviamos los campos asíncronamente con API FETCH por método POST al server
      sendFormObject(registerInfo, "/register/sendRegisterData")
        .then((mensaje) => {
          //Procesamos el mensaje que recibimos del servidor 
          spans[4].textContent = mensaje;
          spans[4].style.color = "white";
          
          if (
            mensaje ===
            "Usuario registrado correctamente. Gracias por confiar en Filmin'. Le hemos enviado un correo a su email para verificar su cuenta"
          ) {
            //Si el mensaje es de éxito procedemos con el segundo paso del registro
            location.href = "/registerSelect";
          }
        })
        .catch((error) => console.log(error));
    }
  });
});
