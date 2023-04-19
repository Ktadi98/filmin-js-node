import { validateEmail, validatePassword } from "./validationFunctions/loginAndRegister.js";
import { initObject, sendFormObject } from "./validationFunctions/initFormDataObject.js";

document.addEventListener("DOMContentLoaded", () => {
  const eyeIcon = document.querySelector("#eye");
  const inputPass = document.querySelector("#pass");
  const inputEmail = document.querySelector("#correo");
  const spans = document.querySelectorAll("span");
  const submitButton = document.querySelector("button");
  const form = document.querySelector("form");

  //Evento para mostrar/no mostrar la contraseña al clickar el ícono del ojo
  eyeIcon.addEventListener("click", () => {
    eyeIcon.classList.toggle("fa-eye-slash");

    inputPass.type === "password" ? (inputPass.type = "text") : (inputPass.type = "password");
  });

  //Validación campos del formulario al darle al botón
  submitButton.addEventListener("click", (evento) => {
    evento.preventDefault();

    //recogemos los campos del formulario desde el DOM para validarlos 
    const emailValidated = validateEmail(inputEmail, spans[0]);
    const passValidated = validatePassword(inputPass, spans[1]);

    if (emailValidated && passValidated) {
      //Si los campos tienen el formato correcto los enviamos asinc. mediante API FETCH por método POST al servidor
      const loginInfo = initObject(form);

      sendFormObject(loginInfo, "/login/sendLoginData")
        .then((mensaje) => {
          //Procesamos el mensaje que nos llega desde el servidor 
          spans[1].textContent = mensaje;
          spans[1].style.color = "white";
          if (mensaje === "El login se ha realizado correctamente.") {
            //Si se ha podido loggear correctamente redirigimos al usuario a la vista de selección de perfil
            location.href = "/selectPerfil";
          }
        })
        .catch((error) => console.log(error));
    }
  });
});
