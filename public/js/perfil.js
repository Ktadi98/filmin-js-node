import {
  initObject,
  sendFormObject,
  sendFetchedData,
} from "./validationFunctions/initFormDataObject.js";

import { validatePassword } from "./validationFunctions/loginAndRegister.js";

document.addEventListener("DOMContentLoaded", () => {
  const opciones = document.querySelectorAll(".opcionesCuenta ul li");
  const cajasOpciones = document.querySelectorAll(".opcion");
  const flujoOpciones = {
    1: cambiarContraseña(),
  };
  //MOSTRAMOS SOLO LA OPCION POR DEFECTO DEL PERFIl (Información Personal)
  for (let i = 1; i < cajasOpciones.length; i++) {
    cajasOpciones[i].classList.add("d-none");
  }

  opciones.forEach((opcion, index) => {
    opcion.addEventListener("click", (evento) => {
      cajasOpciones[index].classList.remove("d-none");
      ocultarOpcion(cajasOpciones, index);
      obtenerDatos(index.toString());
    });
  });

  // Función para renderizar la opción escogida de la lista de opciones
  function ocultarOpcion(cajasOpciones, indexMostrado) {
    cajasOpciones.forEach((opcion, i) => {
      if (i !== indexMostrado) {
        opcion.classList.add("d-none");
      }
    });
  }

  //Función que recoge los datos que gestiona el CRUD en función de la opción escogida.
  const obtenerDatos = (indice) => flujoOpciones.indice;

  //============================INICIO-MODIFICAR DATOS DE USUARIO===============================//
  const modifyInfoButton = document.getElementById("modifyInfoButton");
  const sendInfoButton = document.getElementById("sendInfoButton");
  const backButton = document.getElementById("backButton");
  const formInfoUser = document.getElementById("formInfoUser");
  const infoUser = document.querySelector(".infoUser");
  const errorInfoUser = document.getElementById("errorInfoUser");
  const toggleButtons = [modifyInfoButton, backButton];

  //Ocultamos/Mostramos vista de edición o de no-edición de datos de usuario
  toggleButtons.forEach((button) => {
    button.addEventListener("click", (evento) => {
      formInfoUser.classList.toggle("d-none");
      infoUser.classList.toggle("d-none");
    });
  });

  //Enviamps datos del formulario de la vista de edición al server de forma asíncrona con FETCH por método POST
  sendInfoButton.addEventListener("click", (evento) => {
    evento.preventDefault();
    const telefono = document.getElementById("telefono").value;
    const localidad = document.getElementById("localidad").value;
    const direccion = document.getElementById("direccion").value;

    if (telefono.length > 0 && localidad.length > 0 && direccion.length > 0) {
      errorInfoUser.textContent = "";
      const info = initObject(formInfoUser);

      sendFormObject(info, "/perfil/sendUserData")
        .then((message) => {
          //Si se han actualizado/insertado los datos correctamente
          if (message === "Datos usuario actualizados con éxito!") {
            location.reload();
          }
        })
        .catch((error) => console.log(error));
    }
    else {
      errorInfoUser.textContent = "Todos los campos deben rellenarse!"
    }
  });
  //============================FIN-MODIFICAR DATOS DE USUARIO===============================//

  //============================INICIO-MODIFICAR TIPO DE SUSCRIPCIÓN==========================//
  const cambiarSusButton = document.getElementById("cambiarSusButton");

  cambiarSusButton.addEventListener("click", (evento) => {
    evento.preventDefault();
    const seleccion = document.getElementById("seleccion").value;
    //Enviamos la opción seleccionada (Light,Medium o Anual) y al enviamos al server asincr. con API FETCH por método PUT
    fetch("/perfil/cambioSus", {
      method: "PUT",
      body: JSON.stringify({ suscripciones: seleccion }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((message) => {
        //Si se ha actualizado correctamente el tipo de suscrip. refrescamos la página de configuración
        if (message === "Suscripción actualizada con éxito.") {
          location.reload();
        }
      })
      .catch((error) => console.log(error));
  });
  //============================FIN-MODIFICAR TIPO DE SUSCRIPCIÓN==========================//

  //================INICIO:FUNCIONES AUXILIARES DE CAMBIO DE CONTRASEÑA============================//

  function cambiarContraseña() {
    const botonCambioPass = document.getElementById("botonCambioPass");

    botonCambioPass.addEventListener("click", (evento) => {
      evento.preventDefault();
      const formCambioPass = document.getElementById("formCambioPass");
      const mensajeCambioPass = document.getElementById("mensajeCambioPass");
      const newPass1 = document.getElementById("contraseñaNueva1").value;
      const newPass2 = document.getElementById("contraseñaNueva2").value;
      console.log(newPass1);
      console.log(newPass2);
      const compararPass = (pass1, pass2) => {
        return pass1 === pass2;
      };
      if (newPass1.length > 0 && newPass2.length > 0 && validatePassword(document.getElementById("contraseñaNueva1"),mensajeCambioPass)) {
        if (compararPass(newPass1, newPass2)) {
          const newPass = new FormData(formCambioPass);
          console.log(newPass);
          fetch("/perfil/cambioPass", {
            method: "PUT",
            body: newPass,
          })
            .then((response) => response.json())
            .then((message) => {
              if (message === "Contraseña actualizada con éxito.") {
                location.reload();
              }
            })
            .catch((error) => console.log(error));
        } else {
          mensajeCambioPass.textContent = "Las contraseñas no son iguales!";
          mensajeCambioPass.style.color = "white";
        }
      }
    });
  }

  //===============FINAL:FUNCIONES AUXILIARES DE CAMBIO DE CONTRASEÑA============================//
});
