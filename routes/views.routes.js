import { Router } from "express";
const router = Router();
import conn from "../database/conn.js";

//===============RUTAS PÚBLICAS=============//
//index - página principal
router.get("/", (req, res) => {
  res.render("index", {
    userEmail: res.locals.userEmail,
    pageName: "index",
  });
});

//login - formulario de sesión
router.get("/login", (req, res) => {
  res.render("login", {
    userEmail: res.locals.userEmail,
    pageName: "login",
  });
});

//register - formulario de registro
router.get("/register", (req, res) => {
  res.render("register", {
    userEmail: res.locals.userEmail,
    pageName: "register",
  });
});

//register2 - seleccion de tipo de suscripción
router.get("/registerSelect", (req, res) => {
  res.render("register2", {
    userEmail: res.locals.userEmail,
    pageName: "",
  });
});

//contacto - formulario de contacto
router.get("/contacto", (req, res) => {
  res.render("contacto", {
    userEmail: res.locals.userEmail,
    pageName: "contacto",
  });
});

//recuperación - formulario de recuperación de contraseña
router.get("/recuperarPass", (req, res) => {
  res.render("recuperarPass", {
    userEmail: res.locals.userEmail,
    pageName: "",
  });
});

//Ruta de verifición de email
router.get("/verificarEmail", (req, res) => {

  //Obtenemos el usuario que tiene el token de verificaión
  const getUserTokenQuery = "SELECT * FROM Usuarios WHERE token_email = ?";

  conn.query(getUserTokenQuery, [req.query.token], (err, result) => {
    if (err) throw err;
    //Si el token de verificación coincide con el que hay en la BD
    if (result.length > 0) {
      //Actualizamos el campo de correo verificado de la BD
      const setUserVerified = "UPDATE Usuarios SET correo_verificado = 1 WHERE token_email = ?";
      conn.query(setUserVerified, [req.query.token], (err, result) => {
        if (err) throw err;
        res.send("Correo verificado correctamente");
      });
    } else {
      res.send("Token verification failed. Try contacting Filmin' support.");
    }
  });
});

export default router;
