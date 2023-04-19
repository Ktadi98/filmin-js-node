//Funciones para validar lso distintos campos de los formularios en la parte del servidor.

function validateNameInServer(name, res) {
  if (name === "") {
    res.json("El campo 'Nombre' no puede estar vacío!");
    return false;
  }

  return true;
}

function validateApellidoInServer(apell, res) {
  if (apell === "") {
    res.json("El campo 'Apellido' no puede estar vacío!");
    return false;
  }

  return true;
}

function validateEmailInServer(email, res) {
  const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  if (email === "") {
    res.json("El campo 'Email' no puede estar vacío!");
    return false;
  }
  if (!emailRegex.test(email)) {
    res.json("El campo 'Email' no tiene el formato correcto!");
    return false;
  }

  return true;
}

function validateMessageInServer(message, res) {
  if (message === "") {
    res.json("El campo no puede estar vacío!");
    return false;
  }

  if (message.length < 7) {
    res.json("El campo tiene que contener al menos 7 carácteres");
    return false;
  }

  return true;
}

function validatePasswordInServer(pass, res) {
  const passRegEx = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  if (pass === "") {
    res.json("El campo 'Contraseña' no puede estar vacío!");
    return false;
  }
  if (!passRegEx.test(pass)) {
    res.json("El campo 'Contraseña' no tiene el formato correcto!");
    return false;
  }

  return true;
}

export {
  validateNameInServer,
  validateApellidoInServer,
  validateEmailInServer,
  validateMessageInServer,
  validatePasswordInServer,
};
