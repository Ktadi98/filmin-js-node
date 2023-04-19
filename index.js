import app from "./app.js";
import "./database/conn.js";

//Levantamos el servidor en la dirección localhost con el puerto configurado en app.js (puerto:3000)
//process.env.PORT : variable de entorno para el cloud server de Heroku

app.listen((process.env.PORT || app.get("port")), () => {
  console.log(`Servidor: http://localhost:${app.get("port")}`);
});
