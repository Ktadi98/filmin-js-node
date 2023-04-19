//Script que implementa el toggle de las respuestas de la sección de FAQ de la página.
const answers = {
  answer1:
    "Filmin' es un servicio de streaming nuevo que te trae las mejores historias de todas las compañías cinematográficas que te puedas imaginar, juntas por primera vez.",
  answer2:
    "Puedes reproducir Filmin' en iPhone y iPad, móviles y tablets Android, Apple TV, Android TV, Chromecast, Samsung TV, LG, Chrome OS, MacOS, Windows PC, PS5, PS4, Xbox Series X|S, y Xbox One. Y más dispositivos en el futuro.",
  answer3:
    "Si tienes algún problema al suscribirte o al acceder a Filmin', encontrarás ayuda en nuestro Centro de Ayuda. ¡Estarás viendo Filmin' antes de lo que canta un gallo!",
  answer4:
    "¡Sí! Puedes pasar de la suscripción mensual Light o Medium y a la anual. También puedes cancelar tu suscripción en cualquier momento.",
};

function toggleAnswer(add, index) {
  let addition = true;
  add.addEventListener("click", () => {
    const answer = document.getElementById("answer" + (index + 1));
    if (addition) {
      answer.style.display = "block";
      answer.textContent = eval("answers.answer" + (index + 1));
      add.innerHTML = "&#8722;";
      addition = false;
    } else {
      add.innerHTML = "&#43;";
      answer.style.display = "none";
      addition = true;
    }
  });
}

//Cada vez que le damos al icono de "add" en una pregunta se muestra/oculta la respuesta correspondiente
document.addEventListener("DOMContentLoaded", () => {
  const additions = document.querySelectorAll(".add");
  additions.forEach((e, index) => {
    toggleAnswer(e, index);
  });
});
