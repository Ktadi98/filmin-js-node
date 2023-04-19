function renderSearchFilms(films, divSearched) {
  //Hide default content slideshows
  sections.forEach((section) => {
    section.style.display = "none";
  });
  //Render Section for searched content

  divSearched.classList.add("row");
  divSearched.classList.add("col-m-12");

  if (films.Search !== undefined && films.Search !== null) {
    films.Search.forEach((film) => {
      const filmDiv = document.createElement("div");
      const a = document.createElement("a");
      filmDiv.classList.add("contentBox");
      filmDiv.style.justifyContent = "center";
      filmDiv.style.alignItems = "center";
      a.href = "#";
      filmDiv.appendChild(a);
      filmDiv.style.backgroundImage = "url(" + film.Poster + ")";
      divSearched.appendChild(filmDiv);

      //Añadimos el detalles cada vez que hacemos click en las pelis/series que coinciden con la búsqueda
      filmDiv.addEventListener("click", () => {
        renderModalBox(film);
      });
    });
  }
  divSearched.style.justifyContent = "center";
  divSearched.style.alignItems = "center";
  divSearched.style.gap = "20px";

  main.appendChild(divSearched);
}

function renderFilm(film, videos) {
  //console.log(film);
  if (film !== undefined && film !== null) {
    const filmDiv = document.createElement("div");
    const a = document.createElement("a");
    filmDiv.classList.add("contentBox");
    filmDiv.style.justifyContent = "center";
    filmDiv.style.alignItems = "center";
    a.href = "#";
    filmDiv.appendChild(a);
    filmDiv.style.backgroundImage = "url(" + film.Poster + ")";
    videos.appendChild(filmDiv);
  }
}

function renderModalBox(film) {
  modalBox.style.display = "block";
  //LLenar content con la información de la peli/serie
  const duracion = document.createElement("span");
  const anyoRelease = document.createElement("span");
  const score = document.createElement("span");
  const rated = document.createElement("span");
  imageBox.style.backgroundImage = "url(" + film.Poster + ")";
  tituloVideo.textContent = film.Title;
  duracion.textContent = film.Runtime;
  anyoRelease.textContent = film.Year;
  score.textContent = film.imdbRating;
  rated.textContent = film.Rated;
  cleanElement(specs);
  specs.appendChild(duracion);
  specs.appendChild(anyoRelease);
  specs.appendChild(score);
  specs.appendChild(rated);
  descripcionVideo.textContent = film.Plot;
}

async function fetchVideo(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      } else {
        return response.json();
      }
    })
    .then((film) => {
      return film;
    })
    .catch((error) => console.log(error));
}

function cleanElement(element) {
  if (element.childElementCount > 0) {
    let child = element.lastChild;
    while (child) {
      element.removeChild(child);
      child = element.lastChild;
    }
  }
}

export { renderSearchFilms, renderModalBox, renderFilm, fetchVideo, cleanElement };
