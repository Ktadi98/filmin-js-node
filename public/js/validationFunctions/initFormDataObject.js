//Función para construir un objeto con los datos del formulario que envía el cliente
function initObject(form) {
  const formData = new FormData(form);
  let contactData = {};
  formData.forEach((value, key) => (contactData[key] = value));

  return contactData;
}

//Función que devuelve mensaje de confirmación del servidor si se han recibido los datos correctamente
async function sendFormObject(contactInfo, endPoint) {
  return fetch(endPoint, {
    method: "POST",
    body: JSON.stringify(contactInfo),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((mensaje) => {
      return mensaje;
    })
    .catch((error) => console.log(error));
}

async function sendFetchedData(endPoint) {
  return fetch(endPoint, {
    method: "GET",
    //body: JSON.stringify(contactInfo),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((mensaje) => {
      return mensaje;
    })
    .catch((error) => console.log(error));
}

export { initObject, sendFormObject, sendFetchedData };
