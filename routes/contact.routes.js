import { Router } from "express";
import {
  validateNameInServer,
  validateEmailInServer,
  validateMessageInServer,
} from "../public/js/validationFunctions/checkFormDataInserver.js";

import nodeMailer from "../utils/nodemailer.js"; // nodemailer
const router = Router();


//Ruta que gestiona los datos enviados por el usuario en el formulario mediante fetch en public/js/contacto.js
router.post("/contacto/sendContactInfo", (req, res) => {

  //Recogemos los datos enviados con FETCH
  const nombre = req.body.nombre;
  const email = req.body.email;
  const mensaje = req.body.mensaje;

  //Validación de los campos en servidor, si son válidos enviamos el email
  if (
    validateNameInServer(nombre, res) &&
    validateEmailInServer(email, res) &&
    validateMessageInServer(mensaje, res)
  ) {

    //Configuración del mensaje a enviar
    const html = ` 
    <div> 
     <h1>Datos de Formulario de contacto</h1>
     <h2>Nombre: ${nombre}</h2> 
     <h2>Email: ${email}</h2> 
     <h2>Mensaje:</h2> <p>${mensaje}</p> 
    </div> 
    `;
    nodeMailer(
      "pruebatarrias@outlook.com",
      "pruebatarrias@outlook.com",
      "Email enviado con Nodemailer desde el formulario de contacto",
      html
    )
      .then((result) => {
        //Si el email se ha enviado correctamente enviamos mensaje de confirmación al cliente
        if (result) {
          res.json(
            "Hemos recibido tu mensaje.Te responderemos al correo electrónico especificado en las próximas 24 horas."
          );
        //Si ha habido algún error enviando el correo enviamos mensaje de error al cleinte 
        } else {
          res.json("Error al enviar los datos!",result);
        }
      })
      .catch((error) => console.log(error));
  }
});

export default router;
