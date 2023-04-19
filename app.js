//IMPORTS
import express from "express"; //para usar el servidor de express
import fileUpload from "express-fileupload"; //para cargar imagenes
import path from "path"; // solución para utilizar "__dirname" con "import"
import { fileURLToPath } from "url"; // solución para utilizar "__dirname" con "import"

//Rutas del proyecto
import viewsRoutes from "./routes/views.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import registerRoutes from "./routes/register.routes.js";
import loginRoutes from "./routes/login.routes.js";

//Para poder implementar sesiones con cookies
import session from "express-session";

//=============================================INITS================================================//
const app = express(); //creación del servidor
const __dirname = path.dirname(fileURLToPath(import.meta.url)); /// solución para utilizar "__dirname" con "import"

//=======================CONFIGURATIONS FOR TEMPLATE ENGINE (ejs)===================================//
app.set("port", 3000);
app.set("view engine", "ejs"); //config. motor de plantillas
app.set("views", __dirname + "/views"); // apuntar a la carpeta de archivos estáticos

//========================================MIDDLEWARES==============================================//

//Configuración del Middleware de sesión : Tiene que ser la primera configuración de middleware
app.use(
  session({
    secret: "secret", //Valor de la cookie codificado
    resave: true, // mantiene el enlace al cerrar pestaña
    saveUninitialized: true, //guarda la cookie no inicializada
  })
);
//Configuración de variables locales de la sesión para que estén
//disponibles en cualquier plantilla/vista.
//next: pasa a las rutas posteriores configuradas
app.use((req, res, next) => {
  //Podemos almacenar tantas variables como necesitemos
  //Las variables locales son accesibles desde cualquier punto de la aplicación
  res.locals.userName = req.session.userName; //nombre de usuario
  res.locals.userEmail = req.session.userEmail; //correo del usuario
  res.locals.contaPerfiles = req.session.contaPerfiles; //contador de perfiles de un usuario

  //Variables de sesión para gestionar las valoraciones de cada usuario
  res.locals.currentProfile = req.session.currentProfile; //perfil actual que ha entrado en la vista de vídeos
  res.locals.ratedAndSeen = req.session.ratedAndSeen; // objeto javascript que guarda la valoración por cada video
  res.locals.profileName = req.session.profileName; // nombre del perfil actual que ha entrado en la vista de vídeos
  res.locals.profilePhoto = req.session.profilePhoto; // foto del perfil actual que ha entrado en la vista de vídeos
  next();
});
app.use(express.static(__dirname + "/public")); //archivos estáticos
app.use(express.static(__dirname + "/uploads")); //archivos estáticos para las imágenes de los perfiles
app.use(express.json()); //para que el servidor envíe la respuesta en fromato JSON.
app.use(fileUpload({ createParentPath: true })); //configuración para subir imágenes
app.use(viewsRoutes, protectedRoutes, contactRoutes, registerRoutes, loginRoutes);

//Configuración del renderizado de la página de error de servicio
//se muesta si la ruta de la URL es incorrecta.
app.use((req, res) => {
  res.status(404).render("404");
});

export default app;
