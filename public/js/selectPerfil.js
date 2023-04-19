import { validateMessageProfile } from "./validationFunctions/loginAndRegister.js";
import { sendFormObject } from "./validationFunctions/initFormDataObject.js";

document.addEventListener("DOMContentLoaded", () => {
  const addPerfilButton = document.getElementById("addPerfilButton");
  const crearPerfilButton = document.getElementById("crearPerfilButton");
  const manageUsersButton = document.getElementById("manageUsers");
  const modalBox = document.querySelectorAll(".modal-box")[0];
  const formModalBox = document.querySelectorAll(".modal-content-box")[0];
  const closeIcon = document.querySelectorAll(".cross")[0];

  const modalBoxUpdate = document.querySelectorAll(".modal-box")[1];
  const formModalBoxUpdate = document.querySelectorAll(".modal-content-box")[1];
  const closeIconUpdate = document.querySelectorAll(".cross")[1];
  const updatePerfilButton = document.getElementById("updatePerfilButton");
  const pencilIcons = document.querySelectorAll(".pencil");

  const idPerfiles = [];
  const nombrePerfiles = [];
  const urlImgPerfiles = [];
  const borrarPerfilButton = document.getElementById("borrarPerfilButton");

  //==============INICIO-SETTEAR PEFIL_ID EN SESIÓN al CLICKAR UN PERFIL ESPECÍFICO======================//
  const hiperenlaces = document.querySelectorAll(".hiperenlaces");
  hiperenlaces.forEach((hiperenlace) => {
    hiperenlace.addEventListener("click", (evento) => {
      evento.preventDefault();
      const clickedPerfilId = hiperenlace.getAttribute("id");
      const clickedPerfilName = hiperenlace.parentElement.getAttribute("nombre_perfil");
      const clickedPerfilPhoto = hiperenlace.parentElement.getAttribute("img");

      //Enviamos perfilId del perfil clickado al servidor asíncronamente para settearlo en la sesión
      sendFormObject(
        {
          perfilId: clickedPerfilId,
          perfilName: clickedPerfilName,
          perfilFoto: clickedPerfilPhoto,
        },
        "/perfil/setId"
      )
        .then((message) => {
          if (message === "Good") {
            location.href = "/filmCluster";
          }
        })
        .catch((error) => console.log(error));
    });
  });
  //==============FIN-SETTEAR PEFIL_ID EN SESIÓN al CLICKAR UN PEFIL ESPECÍFICO======================//

  //=====================INICIO-Dessetar currentProfile i dataRatedAndSeen de la sesión al clickar el hiperenlace====================//
  let perfilesLink = document.getElementById("perfilesLink");
  perfilesLink.addEventListener("click", (evento) => {
    evento.preventDefault();
    fetch("/perfil/unSetProfile", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((message) => {
        if (message === "Good") {
          location.href = "/selectPerfil";
        }
      })
      .catch((error) => console.log(error));
  });

  //=====================FIN-Dessetar currentProfile i dataRatedAndSeen de la sesión al clickar el hiperenlace====================//

  //Cargar la ventana modal con le formulario de añadir perfil cuando clickamos al boton añadir perfil
  if (addPerfilButton !== null) {
    addPerfilButton.addEventListener("click", () => {
      //Limpiamos valor de cammpos cada vez que vamos a añadir un perfil
      const campos = formModalBox.querySelectorAll("input");
      campos.forEach((campo) => (campo.value = ""));

      //Mostramos la modal box con el formulario de añadir perfil
      renderModalBox(modalBox, -1, 0);
    });
  }

  //Recoger id's de los perfiles
  pencilIcons.forEach((pencil) => {
    idPerfiles.push(pencil.parentNode.getAttribute("perfil_id"));
    nombrePerfiles.push(pencil.parentNode.getAttribute("nombre_perfil"));
    urlImgPerfiles.push(pencil.parentNode.getAttribute("img"));
  });

  //Al darle click a los íconos de actulizar, renderizar modal con opciones de actualización y borrado
  pencilIcons.forEach((pencil, index) => {
    pencil.addEventListener("click", (evento) => {
      renderModalBox(modalBoxUpdate, index, 1);
    });
  });
  manageUsersButton.setAttribute;
  //Al clickar al botón de gestión de perfiles, aparecen/desaparecen los iconos de actualizar.

  manageUsersButton.addEventListener("click", () => {
    pencilIcons.forEach((icon) => {
      icon.classList.toggle("d-none");
      icon.classList.toggle("depth-one");
    });
  });
  //====INICIO:Funciones y eventos Auxiliares del modal===/

  function renderModalBox(modalBox, index = -1, indexForm) {
    modalBox.style.display = "block";
    if (index >= 0) {
      modalBox.setAttribute("id_perfil", idPerfiles[index]);
      modalBox.setAttribute("nombre_perfil", nombrePerfiles[index]);
      modalBox.setAttribute("img", urlImgPerfiles[index]);
    }
    const getUpdate = document.getElementById("content_update");
    //Formulario de actualización de perfil
    if (indexForm === 1) {
      getUpdate.setAttribute("nombre_perfil", modalBox.getAttribute("nombre_perfil"));
      getUpdate.setAttribute("img", modalBox.getAttribute("img"));
      document.getElementById("nombrePerfilUpdate").value = getUpdate.getAttribute("nombre_perfil");
      document.getElementById("EDITpreview").innerHTML = `<img src=${getUpdate.getAttribute(
        "img"
      )} alt="editImage">`;
    }
  }

  // previsualizar imagen ADD PROJECT
  document.getElementById("imagenPerfil").onchange = function (e) {
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function () {
      let preview = document.getElementById("ADDpreview"),
        image = document.createElement("img");
      image.src = reader.result;
      preview.innerHTML = "";
      preview.append(image);
    };
  };

  // previsualizar imagen EDIT PROJECT
  document.getElementById("imagenPerfilUpdate").onchange = function (e) {
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function () {
      let preview = document.getElementById("EDITpreview"),
        image = document.createElement("img");
      image.src = reader.result;
      preview.innerHTML = "";
      preview.append(image);
    };
  };

  //Enviar datos del formulario de la modal box al clickar "Añadir"
  crearPerfilButton.addEventListener("click", (event) => {
    event.preventDefault();

    const spans = modalBox.querySelectorAll("span");

    //Validamos campos del formulario
    const nombrePerfil = document.getElementById("nombrePerfil");
    const imagenPerfil = document.getElementById("imagenPerfil");

    if (
      validateMessageProfile(nombrePerfil, spans[1], "Nombre") &&
      validateMessageProfile(imagenPerfil, spans[2], "Imagen")
    ) {
      //Enviamos datos del formulario al servidor asíncronamente
      const formData = new FormData(formModalBox);
      fetch("/perfil/add", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((message) => {
          spans[3].textContent = message;
          spans[3].style.color = "white";
          location.reload();
        })
        .catch((error) => console.log(error));
    }
  });

  const formUpdate = document.getElementById("formUpdate");
  let changes = false;
  formUpdate.addEventListener("input", () => {
    changes = true;
  });

  //Enviar datos del formulario de la modal box al clickar "Actualizar"
  updatePerfilButton.addEventListener("click", (event) => {
    event.preventDefault();

    const spans = formUpdate.querySelectorAll("span");

    //Validamos campos del formulario
    const nombrePerfilUpdate = document.getElementById("nombrePerfilUpdate");
    const imagenPerfilUpdate = document.getElementById("imagenPerfilUpdate");

    if (changes) {
      if (
        validateMessageProfile(nombrePerfilUpdate, spans[1], "Nombre") &&
        validateMessageProfile(imagenPerfilUpdate, spans[2], "Imagen")
      ) {
        //Enviamos datos del formulario al servidor asíncronamente
        const formData = new FormData(formModalBoxUpdate);
        fetch(`/perfil/update/${formUpdate.getAttribute("id_perfil")}`, {
          method: "PUT",
          body: formData,
        })
          .then((response) => response.json())
          .then((message) => {
            if (message === "Perfil Actualizado Correctamente") {
              location.reload();
            }
          })
          .catch((error) => console.log(error));
      }
    }
  });

  //Cerrar caja modal al clickar fuera de ella
  window.addEventListener("click", (evento) => {
    if (evento.target === modalBox) {
      modalBox.style.display = "none";
    }
    if (evento.target === modalBoxUpdate) {
      modalBoxUpdate.style.display = "none";
    }
  });

  //Cerrar caja modal al clickar a la cruz
  closeIcon.addEventListener("click", () => {
    modalBox.style.display = "none";
  });

  closeIconUpdate.addEventListener("click", () => {
    modalBoxUpdate.style.display = "none";
  });

  //=======FINAL:Funciones y eventos Auxiliares del modal==============/

  //=====================BORRADO DE PERFIL//
  borrarPerfilButton.addEventListener("click", (evento) => {
    evento.preventDefault();
    const formUpdate = document.getElementById("formUpdate");
    const spans = formUpdate.querySelectorAll("span");

    if (confirm("¿Seguro que quieres eliminar el prefil?")) {
      fetch(`/perfil/delete/${formUpdate.getAttribute("id_perfil")}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((message) => {
          if (message === "No puedes borrar el perfil por defecto!") {
            spans[4].textContent = message;
            spans[4].style.color = "white";
          } else {
            location.reload();
          }
        })
        .catch((error) => console.log(error));
    }
  });
});
