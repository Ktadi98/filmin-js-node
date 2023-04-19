import { sendFormObject, sendFetchedData } from "./validationFunctions/initFormDataObject.js";
document.addEventListener("DOMContentLoaded", () => {
  const prev = document.querySelectorAll(".prev");
  const next = document.querySelectorAll(".next");
  const videos = document.querySelectorAll(".videos");

  //====================INICIO-CARGA DE MODAL BOX CON LOS DETALLES DE LA PELICULA O SERIE==================================//
  const contentBoxes = document.querySelectorAll(".contentBox");
  const modalBox = document.getElementById("modal-box");
  const imageBox = document.getElementById("image-box");
  const specs = document.getElementById("specs");
  const tituloVideo = document.getElementById("titulo");
  const descripcionVideo = document.getElementById("des");
  const closeIcon = document.getElementById("cross");

  contentBoxes.forEach((box) => {
    box.addEventListener("click", (evento) => {
      renderModalBox(box);
    });
  });

  function renderModalBox(film) {
    modalBox.style.display = "block";
    modalBox.setAttribute("filmname", film.getAttribute("titulo"));
    //LLenar content con la información de la peli/serie
    const duracion = document.createElement("span");
    const anyoRelease = document.createElement("span");
    const score = document.createElement("span");
    const rated = document.createElement("span");
    const genero = document.createElement("span");
    modalBox.setAttribute("eval", film.getAttribute("eval"));
    modalBox.setAttribute("video", film.getAttribute("video"));
    imageBox.style.backgroundImage = "url(" + film.getAttribute("imagen") + ")";
    tituloVideo.textContent = "Titulo: " + film.getAttribute("titulo");
    duracion.textContent = "Duración: " + film.getAttribute("duracion");
    anyoRelease.textContent = "Año: " + film.getAttribute("anyo");
    score.textContent = "Puntuación: " + film.getAttribute("score");
    rated.textContent = "Público: " + film.getAttribute("tipo");
    genero.textContent = "Género: " + film.getAttribute("genero");
    descripcionVideo.textContent = film.getAttribute("descripcion");
    
    if (modalBox.getAttribute("eval") === "1") {
      likeButton.classList.add("clicked");
      disLikeButton.classList.remove("clicked");
    } else if (modalBox.getAttribute("eval") === "0") {
      disLikeButton.classList.add("clicked");
      likeButton.classList.remove("clicked");
    } else if (modalBox.getAttribute("eval") === "2") {
      disLikeButton.classList.remove("clicked");
      likeButton.classList.remove("clicked");
    }
    cleanElement(specs);
    specs.appendChild(duracion);
    specs.appendChild(anyoRelease);
    specs.appendChild(score);
    specs.appendChild(rated);
    specs.appendChild(genero);
  }

  const iframeVideo = document.querySelector("iframe");

  //Cerrar detalle contenido al clickar fuera del container modal
  window.addEventListener("click", (evento) => {
    //Detalle del video
    if (evento.target === modalBox) {
      modalBox.style.display = "none";
    }

    //Reproducción del video
    if (evento.target === reproductor) {
      reproductor.style.display = "none";

      //Detener video reproducido en iframe
      let iframeSrc = iframeVideo.src;
      iframeVideo.src = iframeSrc;
    }
  });

  //Cerrar detalle del contenido del video al clickar la cruz
  closeIcon.addEventListener("click", () => {
    modalBox.style.display = "none";
  });

  function cleanElement(element) {
    if (element.childElementCount > 0) {
      let child = element.lastChild;
      while (child) {
        element.removeChild(child);
        child = element.lastChild;
      }
    }
  }

  //====================FIN-CARGA DE MODAL BOX CON LOS DETALLES DE LA PELICULA O SERIE==================================//

  //========================INICIO: GESTIÓN DEL LIKE/DISLIKE DE LA PELI O SERIE==========================================//

  const likeButton = document.getElementById("like");
  const disLikeButton = document.getElementById("dislike");

  likeButton.addEventListener("click", (event) => {
    event.preventDefault();
    likeButton.classList.toggle("clicked");

    if (disLikeButton.classList.contains("clicked")) {
      disLikeButton.classList.toggle("clicked");
    }
    let filmName = likeButton.parentElement.parentElement.parentElement.getAttribute("filmname");
    let val = -1;
    if (likeButton.classList.contains("clicked")) val = 1;
    else val = 2;

    //Enviamos por API FETCH método POST la valoración indicada (Me gusta) de la peli seleccionada al server 
    sendFormObject({ valor: val, filmname: filmName }, "/video/set")
      .then((message) => {
        if (message === "Good") {
          console.log("Valoracion Ok");
        }
      })
      .catch((error) => console.log(error));
  });

  disLikeButton.addEventListener("click", (event) => {
    event.preventDefault();
    disLikeButton.classList.toggle("clicked");
    if (likeButton.classList.contains("clicked")) {
      likeButton.classList.toggle("clicked");
    }
    let filmName = likeButton.parentElement.parentElement.parentElement.getAttribute("filmname");
    let val = -1;
    if (disLikeButton.classList.contains("clicked")) val = 0;
    else val = 2;
    //Enviamos por API FETCH método POST la valoración indicada (No me gusta) de la peli seleccionada al server 
    sendFormObject({ valor: val, filmname: filmName }, "/video/set")
      .then((message) => {
        if (message === "Good") {
          console.log("Valoracion No Ok");
        }
      })
      .catch((error) => console.log(error));
  });

  //========================FIN: GESTIÓN DEL LIKE/DISLIKE DE LA PELI O SERIE=============================================//

  //==========INICIO:Next and Previous Functionality (based on : https://www.w3schools.com/howto/howto_js_slideshow.asp)=======/

  videos.forEach((video, index) => {
    let iteration = 0;
    let increment = 300;
    prev[index].addEventListener("click", () => {
      if (iteration >= 0) {
        video.style.transform = "translateX(" + 0 + "px)";
        console.log("click prev");
        increment = 300;
        iteration--;
        if(iteration < 0) iteration = 0;
      }
    });

    next[index].addEventListener("click", () => {
      video.style.transform = "translateX(-" + increment + "px)";
      increment += 300;
      iteration++;
      console.log("click next");
    });
  });

  //==========FIN:Next and Previous Functionality (based on : https://www.w3schools.com/howto/howto_js_slideshow.asp)=======/

  //===================================INCIO-Barra de Búsqueda===============================================//

  const buttonSearch = document.getElementById("search");
  const textSearch = document.getElementById("searchBar");
  const sections = document.querySelectorAll("section");
  const main = document.querySelector("main");
  const divSearched = document.createElement("div");

  buttonSearch.addEventListener("click", () => {
    let searchQuery = textSearch.value.toLowerCase();

    if (searchQuery !== "") {
      sections.forEach((section) => {
        section.style.display = "none";
      });

      //Ponemos estilos al div que contendrá a las pelis que coincidan con la búsqueda
      initDiv(divSearched);

      //Realizamos una petición GET al servidor asincr. para que nos devuelva los videos que coincidan con la cadena de búsqueda
      sendFetchedData(`/filmCluster/search/${searchQuery}`)
        .then((searchResult) => {
          if (searchResult != "Error") {
            searchResult.forEach((result) => {
              let filmDiv = document.createElement("div");
              //Añadimos los atributos a cada película para después renderizar la modal box
              filmDiv = initVideo(result, filmDiv);

              divSearched.appendChild(filmDiv);

              //Añadimos el evento detalle(modal box) cada vez que hacemos click en las pelis/series que coinciden con la búsqueda
              filmDiv.addEventListener("click", () => {
                renderModalBox(filmDiv);
              });
            });

            main.appendChild(divSearched);
          }
        })
        .catch((error) => console.log(error));
    }
  });

  //Al modificar la cadena de búsqueda volvemos al menú principal
  textSearch.addEventListener("keydown", () => {
    cleanElement(divSearched);
    cleanElement(divGenero);
    if (textSearch.value === "") {
      sections.forEach((section) => {
        section.style.display = "block";
      });
    }
  });
  //===================================FIN-Barra de Búsqueda===============================================//
  //==============================INCIO-Lógica de reproductor de vídeo===========================//
  const reproductor = document.getElementById("reproductor");
  const seeContent = document.getElementById("seeContent");

  seeContent.addEventListener("click", (event) => {
    //Escondemos modal de los detalles del video al ver el video
    reproductor.style.display = "block";
    modalBox.style.display = "none";

    iframeVideo.src = seeContent.parentElement.parentElement.parentElement.getAttribute("video");
  });
  //==============================FIN-Lógica de reproductor de vídeo===========================//

  //==============================INICIO-Barra lateral de categorías===========================//
  const showCategories = document.getElementById("showCategories");
  const concealCategories = document.getElementById("concealCategories");
  const categorias = document.getElementById("categorias");

  //Icono de flechas para mostrar categorías
  showCategories.addEventListener("click", () => {
    showCategories.style.display = "none";
    concealCategories.style.display = "block";
    categorias.style.display = "block";
    if (window.innerWidth >= 768) {
      categorias.style.width = "250px";
      main.style.marginLeft = "250px";
    }
    if (window.innerWidth > 576 && window.innerWidth < 768) {
      categorias.style.width = "200px";
      main.style.marginLeft = "200px";
    }
    if (window.innerWidth <= 576) {
      categorias.style.width = "100%";
      main.style.marginLeft = "0";
      main.style.marginTop = "250px";
    }
    main.style.background = "rgba(0, 0, 0, 0.4)";
  });

  //Icono de flechas para ocultar categorias
  concealCategories.addEventListener("click", () => {
    showCategories.style.display = "block";
    concealCategories.style.display = "none";
    categorias.style.display = "block";
    if (window.innerWidth >= 768) {
      categorias.style.width = "0";
      main.style.marginLeft = "0";
    }

    if (window.innerWidth > 576 && window.innerWidth < 768) {
      categorias.style.width = "0";
      main.style.marginLeft = "0";
    }
    if (window.innerWidth <= 576) {
      categorias.style.width = "0px";
      main.style.marginTop = "0px";
    }

    main.style.background = "";
  });

  //Evento para mostrar los videos que tengan el género seleccionado
  const categoriasEnlaces = document.querySelectorAll("#categorias .cat");
  const atras = document.getElementById("atras");
  const divGenero = document.createElement("div");

  atras.addEventListener("click", (event) => {
    event.preventDefault();
    location.reload();
  });

  categoriasEnlaces.forEach((categoria) => {
    categoria.addEventListener("click", (event) => {
      event.preventDefault();
      const genero = event.target.textContent;
      sections.forEach((section) => {
        section.style.display = "none";
      });

      cleanElement(divGenero);
      cleanElement(divSearched);

      //Ponemos estilos al div que contendrá a las pelis con la categoría específica
      initDiv(divGenero);

      //Realizamos una petición GET al servidor asincr. para que nos devuelva los videos que coincidan con la categoría seleccionada
      sendFetchedData(`/filmCluster/category/${genero}`)
        .then((searchResult) => {
          if (searchResult != "Error") {
            searchResult.forEach((result) => {
              let filmDiv = document.createElement("div");
              //Añadimos los atributos a cada película para después renderizar la modal box
              filmDiv = initVideo(result, filmDiv);

              divGenero.appendChild(filmDiv);

              //Añadimos el detalle(modal box) cada vez que hacemos click en las pelis/series que coinciden con la categoría seleccionada
              filmDiv.addEventListener("click", () => {
                renderModalBox(filmDiv);
              });
            });

            main.appendChild(divGenero);
          }
        })
        .catch((error) => console.log(error));
    });
  });

  const initDiv = (div) => {
    div.classList.add("row");
    div.classList.add("col-m-12");
    div.style.justifyContent = "center";
    div.style.alignItems = "center";
    div.style.gap = "20px";
  };

  const initVideo = (result, filmDiv) => {
    const a = document.createElement("a");
    filmDiv.classList.add("contentBox");
    filmDiv.style.justifyContent = "center";
    filmDiv.style.alignItems = "center";
    a.href = "#";
    filmDiv.appendChild(a);
    filmDiv.style.backgroundImage = "url(" + result.foto_video + ")";
    filmDiv.setAttribute("titulo", result.titulo);
    filmDiv.setAttribute("anyo", result.anyo_publicacion);
    filmDiv.setAttribute("score", result.imbd_rating);
    filmDiv.setAttribute("duracion", result.duracion);
    filmDiv.setAttribute("imagen", result.foto_video);
    filmDiv.setAttribute("tipo", result.tipo);
    filmDiv.setAttribute("genero", result.genero);
    filmDiv.setAttribute("descripcion", result.descripcion);
    filmDiv.setAttribute("video", result.video);
    filmDiv.setAttribute("eval", result.valoracion);
    return filmDiv;
  };
  //==============================FIN-Barra lateral de categorías==============================//
});
