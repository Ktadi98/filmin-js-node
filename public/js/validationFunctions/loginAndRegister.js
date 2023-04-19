//Funciones para validar lso distintos campos de los formularios en la parte del cliente.
function validateName(name, span) {
  if (name.value === "") {
    span.innerHTML = "&#9888;" + "El campo 'Nombre' no puede estar vacío!";
    name.classList.add("error");
    return false;
  } else {
    span.textContent = "";
    name.classList.remove("error");
    return true;
  }
}

function validateApellido(apellido, span) {
  if (apellido.value === "") {
    span.innerHTML = "&#9888;" + "El campo 'Apellido' no puede estar vacío!";
    apellido.classList.add("error");
    return false;
  } else {
    span.textContent = "";
    apellido.classList.remove("error");
    return true;
  }
}

function validateEmail(email, span) {
  const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

  if (email.value === "") {
    span.innerHTML = "&#9888;" + "El campo 'Correo' no puede estar vacío!";
    email.classList.add("error");
    email.classList.remove("checked");
    return false;
  } else if (!emailRegex.test(email.value)) {
    span.innerHTML = "&#9888;" + "El correo no es válido";
    email.classList.add("error");
    email.classList.remove("checked");
    return false;
  } else {
    span.innerHTML = "&#10003;" + "Correcto.";
    email.classList.remove("error");
    email.classList.add("checked");
    return true;
  }
}

function validatePassword(pass, span) {
  const passRegEx = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  // span.classList.remove("passMessage");
  span.textContent = "";

  if (pass.value === "") {
    span.innerHTML = "&#9888;" + "El campo 'Contraseña' no puede estar vacío!";
    pass.classList.add("error");
    pass.classList.remove("checked");
    return false;
  } else if (!passRegEx.test(pass.value)) {
    span.innerHTML = "&#9888;" + "La contraseña no es válida";
    pass.classList.add("error");
    pass.classList.remove("checked");
    return false;
  } else {
    span.innerHTML = "&#10003;" + "Correcto.";
    pass.classList.remove("error");
    pass.classList.add("checked");
    return true;
  }
}

function validatePasswordRegister(pass, span) {
  const passRegEx = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  span.classList.remove("passMessage");
  span.textContent = "";

  if (pass.value === "") {
    span.innerHTML = "&#9888;" + "El campo 'Contraseña' no puede estar vacío!";
    pass.classList.add("error");
    pass.classList.remove("checked");
    span.style.color = "red";
    return false;
  } else if (!passRegEx.test(pass.value)) {
    span.innerHTML = "&#9888;" + "La contraseña no es válida";
    pass.classList.add("error");
    pass.classList.remove("checked");
    return false;
  } else {
    span.innerHTML = "&#10003;" + "Correcto.";
    pass.classList.remove("error");
    pass.classList.add("checked");
    span.style.color = "lightgreen";
    return true;
  }
}

function validateMessage(message, span) {
  if (message.value === "") {
    span.innerHTML = "&#9888;" + "El campo 'Comentario' no puede estar vacío!";
    message.classList.add("error");
    message.classList.remove("checked");
    span.style.color = "red";
    return false;
  } else if (message.value.length < 10) {
    span.innerHTML = "&#9888;" + "El mensaje debe contener al menos 10 carácteres!";
    message.classList.add("error");
    message.classList.remove("checked");
    return false;
  } else {
    span.innerHTML = "&#10003;" + "Correcto.";
    message.classList.remove("error");
    message.classList.add("checked");
    span.style.color = "lightgreen";
    return true;
  }
}

function validateMessageProfile(message, span, type) {
  if (message.value === "") {
    span.innerHTML = "&#9888;" + `El campo ${type} no puede estar vacío!`;
    message.classList.add("error");
    message.classList.remove("checked");
    span.style.color = "red";
    return false;
  } else if (message.value.length < 7) {
    span.innerHTML = "&#9888;" + `El ${type} debe contener al menos 7 carácteres!`;
    message.classList.add("error");
    message.classList.remove("checked");
    return false;
  } else {
    span.innerHTML = "&#10003;" + "Correcto.";
    message.classList.remove("error");
    message.classList.add("checked");
    span.style.color = "lightgreen";
    return true;
  }
}

export {
  validateName,
  validateApellido,
  validateEmail,
  validatePassword,
  validatePasswordRegister,
  validateMessage,
  validateMessageProfile,
};
