import { Router } from "express";
import {
  validateNameInServer,
  validateApellidoInServer,
  validateEmailInServer,
  validatePasswordInServer,
} from "../public/js/validationFunctions/checkFormDataInserver.js";
import conn from "../database/conn.js";
import { hashSync, compareSync } from "bcrypt"; // funciones de encriptación
import nodeMailer from "../utils/nodemailer.js";
import generator from "generate-password";
import { validatePasswordRegister } from "../public/js/validationFunctions/loginAndRegister.js";

const router = Router();

//PRIMER PASO DEL REGISTRO: Ruta para el registro del usuario, formulario
router.post("/register/sendRegisterData", (req, res) => {

  //Recogemos los campos de formulario enviados mediante FETCH por el cliente desde ../js/validatePasswordRegister.js
  const nombre = req.body.nombre;
  const apellido = req.body.apellido;
  const email = req.body.email;
  const pass = req.body.pass;

  //Validamos los campos en server
  if (
    validateNameInServer(nombre, res) &&
    validateApellidoInServer(apellido, res) &&
    validateEmailInServer(email, res) &&
    validatePasswordInServer(pass, res)
  ) {
    //===============Comprobar que el email no está registrado================================//

    const sql = "select * from Usuarios where correo = ?"; //Bind query (?) para evitar ataque SQL injection 
    conn.query(sql, [email], (err, result) => {
      if (err) throw err; //lanza excepción
      if (result.length > 0) {
        // si la consulta devuelve un valor(array), el email está registrado y no continuamos con la creación del usuario
        res.json("El email introducido está en uso!");
      } else {
        //Si la consulta no devuelve un resultaod el correo no consta en la BD
        const hashPassword = hashSync(pass, 10); //encriptar password
        const emailVerificationToken = generator.generate({
          //generación de token de verificación
          length: 100,
          numbers: true,
        });

        //configuración de la URL de confirmación de email y del correo de verifiación
        const url_host = `${req.protocol}://${req.get(`host`)}`;
        const url_link = `${url_host}/verificarEmail?token=${emailVerificationToken}`;
        const html = ` 
        <div> 
         <h2>Mensaje:</h2>Estimado cliente, ${email} haga click en el siguiente enlace para verificar su cuenta de correo.
         <p><a href="${url_link}">Enlace de verificación</a></p>
        </div> 
        `;

        nodeMailer(
          "pruebatarrias@outlook.com",
          "pruebatarrias@outlook.com",
          "Email de verificación de cuenta Filmin'",
          html
        )
          .then((result) => {
            if (result) {
              //Si el email de confirmación se ha enviado correctamente creamos un nuevo usuario con el campo de confirmación a false 
              const sql = "insert into Usuarios values(?,?,?,?,default,default,?,default)";
              conn.query(
                sql,
                [email, nombre, apellido, hashPassword, emailVerificationToken],
                (err, result) => {
                  if (err) throw err;
                  //Enviamos mensaje de confirmación de envío al cliente 
                  res.json(
                    "Usuario registrado correctamente. Gracias por confiar en Filmin'. Le hemos enviado un correo a su email para verificar su cuenta"
                  );
                }
              );
            } else {
              //enviamos mensaje de error al cliente
              res.json("Error al enviar los datos!",result);
            }
          })
          .catch((error) => console.log(error));
      }
    });
  }
});

//SEGUNDO PASO DEL REGISTRO : Ruta de selección de tipo de suscripción
router.post("/registerSelect/sendType", (req, res) => {

  //Recogemos los datos de la suscripción seleccionada por el usuario enviados por FETCH por el cliente desde ../js/register2.js
  const tipo = req.body.tipo;
  const precio = req.body.precio;

  //Obtenemos la nueva suscripción por defecto creada en el primer paso del registro
  const selectNuevaSus = "select idSuscripciones from suscripciones where nombre = ?";
  conn.query(selectNuevaSus, ["newSus"], (err, resultSus) => {
    if (err) throw err;
    //Actualizamos la suscripción creada por defecto con los datos que corresponden de tipo y precio 
    const actNuevaSus = "UPDATE suscripciones set nombre = ?, precio = ? where idSuscripciones = ?";
    conn.query(actNuevaSus, [tipo, precio, resultSus[0].idSuscripciones], (err, result) => {
      if (err) {
        throw err;
      }
      //Enviamos mensaje de confirmación al cliente
      res.json("Selección confirmada correctamente.Disfruta de Filmin'!");
    });
  });
});

//Ruta de Recuperación de contraseña
router.post("/recuperarPass/sendEmail", (req, res) => {
  //Recogemos el campo email del formulario enviado mediante API FETCH por el cliente en ../js/recuperarPass.js
  const email = req.body.email;
  //Validación del campo en server
  if (validateEmailInServer(email, res)) {
    //===============Comprobar que el email está registrado para enviar el correo de recuperación================//
    const sql = "select * from usuarios where correo=?";
    conn.query(sql, [email], (err, result) => {
      if (result.length > 0) {
        //Si el email está registrado generamos la contraseña con modulo generate-password
        const newPass = generator.generate({
          length: 9,
          numbers: true,
        });

        //Configuramos el mensaje de recuperación de contraseña
        const html = ` 
        <div> 
         <h2>Mensaje:</h2>Estimado cliente, has solicitado un cambio de contraseña recientemente.
         La nueva contraseña generada es la siguiente:
         <p>${newPass}</p> 
        </div> 
        `;

        //Enviamos correo al usuario con la nueva contraseña
        nodeMailer(
          "pruebatarrias@outlook.com",
          "pruebatarrias@outlook.com",
          "Email de recuperación de contraseña asociada",
          html
        )
          .then((result) => {
            if (result) {
              //SI el correo se ha enviado correctamente insertamos en la BD la nueva contraseña generada para el correo indicado
              let newPassEnc = hashSync(newPass, 10);
              const insertarNuevaPass = "update Usuarios set contrasenya=? where correo=?";
              conn.query(insertarNuevaPass, [newPassEnc, email], (err, result) => {
                if (err) throw err;
                //Enviamos mensaje de confirmación al cliente
                res.json(
                  "Hemos enviado un correo a la dirección especificada. Sigue las instrucciones que encontrarás allí para recuperar tu contraseña."
                );
              });
            } else {
              //Enviamos mensaje de error al cliente
              res.json("Error al enviar los datos!",result);
            }
          })
          .catch((error) => console.log(error));
      } else {
        //Enviamos mensaje de error al cliente si el correo especificado en el formulario no consta en la BD
        res.json("El email introducido no está en uso. Por favor, introduce un correo existente.");
      }
    });
  }
});

export default router;
