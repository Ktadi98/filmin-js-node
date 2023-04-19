import { Router } from "express";
import {
  validatePasswordInServer,
  validateEmailInServer,
} from "../public/js/validationFunctions/checkFormDataInserver.js";
import conn from "../database/conn.js";
import { hashSync, compareSync } from "bcrypt"; // funciones de encriptación

const router = Router();

//Ruta de autenticación de usuario (incio de sesión)
router.post("/login/sendLoginData", (req, res) => {

  //Recogemos los datos del formulario de inicio de sesion que nos envía el cliente asíncronamente desde ../public/js/login.js 
  const email = req.body.email;
  const pass = req.body.pass;

  if (validateEmailInServer(email, res)) {
    //Validamos si el correo/usuario existe en la BD, después comprobar si está verificado con token y por último verificar que ha introducido bien la contraseña.
    const sql = "select * from Usuarios where correo = ? ";
    conn.query(sql, [email], (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        //Si la consulta no devuelve ningún resultado el usuario no existe y no procedemos con el inicio de sesión
        res.json("El email introducido no existe...");
      } else {
        //Una vez vemos que el usuario existe BD, verificamos si ha verificado la cuenta 
        const verificacion = "select * from Usuarios where correo=? and correo_verificado = ?";
        conn.query(verificacion, [email, true], (err, result) => {
          if (err) throw err;
          if (result.length === 0) {
            //El email existe pero no está verificado.
            res.json(
              "La cuenta no está confirmada. Verifíquela mediante el enlace enviado a su correo."
            );
          } else {
            //Una vez comprobamos que el usuario actual tiene la cuenta verificada, comprobamos si la contraseña introducida coincide con la que consta en la BD
            const hashPass = result[0].contrasenya;
            if (compareSync(pass, hashPass)) {
              //Si el password introducido es correocto almacenamos/iniciamos datos del usuario en la cookie de sesión
              req.session.userName = result[0].nombre;
              req.session.userEmail = result[0].correo;
              req.session.currentProfile = "";
              req.session.ratedAndSeen = {};
              req.session.contaPerfiles = result[0].conta_perfiles;
              req.session.profileName = "";
              req.session.profilePhoto = "";

              //Establecer la duración de la cookie a 1 día ( en milisegundos)
              req.session.cookie.maxAge = 1 * 24 * 60 * 60 * 1000;

              //Enviamos mensaje de éxito al cliente
              res.json("El login se ha realizado correctamente.");
            } else {
              //Enviamos mensaje de fracaso al cliente si la pass. no coincide
              res.json("La contraseña introducida no es correcta.");
            }
          }
        });
      }
    });
  }
});

//Ruta para cerrar sesión (implica destruir la cookie de sesión)
router.get("/logOut", (req, res) => {
  req.session.destroy(); //método para destruir la cookie
  return res.redirect("/"); //redirigimos a la portada
});

export default router;
