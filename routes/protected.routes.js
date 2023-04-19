import { Router } from "express";
import conn from "../database/conn.js";
import { validateMessageInServer } from "../public/js/validationFunctions/checkFormDataInserver.js";
import generator from "generate-password";
import { hashSync, compareSync } from "bcrypt";
import fs from "fs"; //para manipular el sistema de archivos

const router = Router();

//CRUD
//.post -> insert
//.get -> select
//.put -> update
//.delete -> delete

//=================================================RUTAS PRIVADAS=========================================================//

//=======================================INCIO:RUTAS-FILM_CLUSTER==================================================//
//filmCluster - página de contenidos
router.get("/filmCluster", (req, res) => {
  //Utilizamos la sesión/el email) como condición para renderizar la lista de vídeos
  if (req.session.userEmail) {
    //Obtenemos todos las pelis/series de la BD
    const getVideos = "select * from videos V JOIN Rated R ON V.titulo = R.titulo";

    conn.query(getVideos, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        //Filtramos los videos en su categoria correspondiente ("S":serie,"P":película)
        const videosP = result.filter(
          (video) => video.categoria === "P" && video.foto_video !== null
        );
        const videosS = result.filter(
          (video) => video.categoria === "S" && video.foto_video !== null
        );

        //Obtenemos las valoraciones que el perfil tiene de algunos videos
        const getEvals = "SELECT * FROM Evaluaciones WHERE idPerfiles = ?";

        conn.query(getEvals, [req.session.currentProfile], (err, evals) => {
          if (err) throw err;

          //Recogemos las videos que tienen un LIKE
          const evalsLike = evals.filter((e) => e.valoracion === 1);
          const titlesLike = evalsLike.map((e) => e.titulo);
          const videosLike = result.filter((r) => titlesLike.includes(r.titulo));

          //Si no hay evaluaciones setteamos un valor por defecto
          result.forEach((video) => {
            req.session.ratedAndSeen[video.titulo] = [0, 2];
          });

          //Si hay evaluaciones(no tiene por qué haberlas), seteamos la variable de sesion que contiene --> titulo_peli : [visto, valoracion] para mostrar la valoración correspondiente en la caja modal
          if (evals.length > 0) {
            evals.forEach(
              (evaluacion, index) =>
                (req.session.ratedAndSeen[evaluacion.titulo] = [0, evaluacion.valoracion])
            );
          }
          //console.log(res.locals.ratedAndSeen);
          res.render("filmCluster", {
            evals: res.locals.ratedAndSeen,
            videosS: videosS,
            videosP: videosP,
            videosLike: videosLike,
            currentProfile: res.locals.currentProfile,
            profileName: res.locals.profileName,
            profilePhoto: res.locals.profilePhoto,
            pageName: "",
          });
        });
      }
    });
  } else {
    //Si no hay sesión setteada redirigimos al usuario a la vista de inicio de sesión
    return res.redirect("login");
  }
});

//===============================INICIO: RUTA DE VALORACION(LIKE/DISLIKE) DEL USUARIO================
router.post("/video/set", (req, res) => {
  //valoracion --> 0:dislike, 1:like, 2:no valorada
  const valoracion = req.body.valor;
  const filmName = req.body.filmname;

  //Insertamos la evaluación indicada por el perfil en la peli/serie seleccionada
  const setEval =
    "INSERT INTO EVALUACIONES VALUES (?,?,NULL,?) ON DUPLICATE KEY UPDATE valoracion=?, visto = NULL";
  conn.query(
    setEval,
    [filmName, req.session.currentProfile, valoracion, valoracion],
    (err, result) => {
      if (err) throw err;
      res.json("Good");
    }
  );
});

//===============================FIN: RUTA DE VALORACION DEL USUARIO===============

//===============================INICIO: RUTA DE BÚSQUEDA DE VIDEOS================
router.get("/filmCluster/search/:searchQuery", (req, res) => {
  //Obtenemos las pelis que tienen el titulo que coinciden con la cadena de búsqueda "searchQuery"
  const getVideosQuery =
    "select * from (videos V JOIN Rated R ON V.titulo = R.titulo) JOIN Evaluaciones E ON V.titulo = E.titulo WHERE LOWER(V.titulo) LIKE '" +
    req.params.searchQuery +
    "%' AND E.idPerfiles = ?";
  conn.query(getVideosQuery, [req.session.currentProfile], (err, result) => {
    if (err) throw err;
    //Si ha habido coincidencias enviamos resultados y los renderizamos en el cliente
    if (result.length > 0) {
      res.json(result);
    } else {
      //Si no hay coincidencias enviamos mensaje de error
      res.json("Error");
    }
  });
});

//===============================FIN: RUTA DE BÚSQUEDA DE VIDEOS================

//===============================INICIO: RUTA DE MoSTRAR CATEGORIA ESPECIFICA DE VIDEO================
router.get("/filmCluster/category/:genero", (req, res) => {
  //Obtenemos las pelis que contienen la categoria indicada por "genero".
  const getVideosQuery =
    "select * from (videos V JOIN Rated R ON V.titulo = R.titulo) JOIN Evaluaciones E ON V.titulo = E.titulo WHERE V.genero LIKE '%" +
    req.params.genero +
    "%' AND E.idPerfiles = ?";
  conn.query(getVideosQuery, [req.session.currentProfile], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      //Si ha habido coincidencias enviamos resultados y los renderizamos en el cliente
      res.json(result);
    } else {
      //Si no hay coincidencias enviamos mensaje de error
      res.json("Error");
    }
  });
});
//===============================FINAL: RUTA DE MoSTRAR CATEGORIA ESPECIFICA DE VIDEO================

//=======================================FIN:RUTAS-FILM_CLUSTER==================================================//

//==========================INICIO: RUTAS DE CONFIGURACIÓN DE USUARIO===============================================//
//perfil - ruta de opciones de usuario
router.get("/perfil", (req, res) => {
  //Utilizamos la sesión/el email) como condición para renderizar el perfil
  if (req.session.userEmail) {
    //Recogemos los datos de la BD que queremos mostrar en la vista de configuración de perfil
    const getInfoPersonal = "select * from ParametrosUsuario where correo = ?";
    conn.query(getInfoPersonal, [req.session.userEmail], (err, result) => {
      if (err) throw err;
      let info = {};
      //Si hay datos de usuario existentes, se recoge el resultado de la base de datos.
      if (result.length > 0) info = result[0];
      //Obtenemos el resto de datos para visualizar los datos en el resto de secciones de configuración
      //Obtener nombre de suscripción actual del usuario
      const getUserSus =
        "select S.nombre from Suscripciones S JOIN Facturas F ON F.idSuscripciones = S.idSuscripciones WHERE F.Usuarios_correo = ? LIMIT 1";
      conn.query(getUserSus, [req.session.userEmail], (err, result2) => {
        if (err) throw err;

        //Obtener todas las facturas con la fecha, método de pago y la idSuscripción
        const getUserFacturas =
          "select F.fecha_factura, S.nombre, S.idSuscripciones, F.idMetodosPago from Suscripciones S JOIN Facturas F ON F.idSuscripciones = S.idSuscripciones WHERE F.Usuarios_correo = ? AND F.idFacturas NOT LIKE '" +
          "DEFAULT%'";

        conn.query(getUserFacturas, [req.session.userEmail], (err, result3) => {
          if (err) throw err;

          //Formateamos la fecha de la factura para que sólo muestre el día {Lunes/Martes/... - numero}
          result3.forEach((factura) => {
            factura.fecha_factura = factura.fecha_factura.toString().substring(0, 10);
          });
          res.render("perfil", {
            pageName: "perfil",
            info: info,
            datosSus: result2[0],
            datosFacturas: result3,
          });
        });
      });
    });
  } else {
    return res.redirect("login");
  }
});

//=====================INICIO-CONFIGURACIÓN DE USUARIO: DATOS PERSONALES==========================//
router.post("/perfil/sendUserData", (req, res) => {
  //Recogemos los datos del objeto formulario que nos llega por FETCH desde el cliente.
  const telefono = req.body.telefono;
  const localidad = req.body.localidad;
  const direccion = req.body.direccion;

  //Comprobamos que si el usuario ya tiene datos registrados
  const getParametrosUsuario = "SELECT * FROM ParametrosUsuario WHERE correo = ?";
  conn.query(getParametrosUsuario, [res.locals.userEmail], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      //Si NO los tiene los insertamos en la BD
      const insertParametrosUsuario = "INSERT INTO ParametrosUsuario VALUES (?,?,?,?)";
      conn.query(
        insertParametrosUsuario,
        [res.locals.userEmail, telefono, localidad, direccion],
        (err, result) => {
          if (err) throw err;
          res.json("Datos usuario actualizados con éxito!");
        }
      );
    } else {
      //Si SÍ los tiene los actualizamos en la BD
      const updateParametrosUsuario =
        "UPDATE ParametrosUsuario SET telefono = ?, localidad = ?, direccion = ? WHERE correo = ?";
      conn.query(
        updateParametrosUsuario,
        [telefono, localidad, direccion, res.locals.userEmail],
        (err, result) => {
          if (err) throw err;
          res.json("Datos usuario actualizados con éxito!");
        }
      );
    }
  });
});

//=====================FINAL-CONFIGURACIÓN DE USUARIO: DATOS PERSONALES==========================//

//perfil - sección de historial de pagos
router.get("/perfil/historialPagos", (req, res) => {
  //Mostramos las facturas que tiene el usuario
  //Se genera una factura nueva al crear el usuario
  //Se genera una factura nueva cada vez que cambiamos de tipo de suscripción
  const selectFacturas =
    "select * from facturas where Usuarios_correo=? AND idFacturas NOT LIKE '" + "DEFAULT%'";
  conn.query(selectFacturas, [res.locals.userEmail], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

//perfil - sección de cambio de contraseña
router.put("/perfil/cambioPass", (req, res) => {
  //Encriptamos la nueva contraseña introducida por el usuario loggeado y actualizamos su registro en la BD.
  const passNueva = req.body.passNueva1;
  const hashPassword = hashSync(passNueva, 10);
  const updatePassUser = "update usuarios set contrasenya = ? where correo = ?";
  conn.query(updatePassUser, [hashPassword, req.session.userEmail], (err, result) => {
    if (err) throw err;
    res.json("Contraseña actualizada con éxito.");
  });
});

//=====================INICIO-CONFIGURACIÓN DE USUARIO: NUEVA SUSCRIPCIÓN==========================//
router.put("/perfil/cambioSus", (req, res) => {
  const Suscripciones = {
    Light: "8.99",
    Medium: "14.99",
    Anual: "149.99",
  };
  //Recogemos los datos del objeto formulario que nos llega por FETCH desde el cliente por método PUT
  const nuevaSuscripcion = req.body.suscripciones;

  let precio = parseFloat(Suscripciones[nuevaSuscripcion]);

  //Obtenemos el id de suscripción asociado al usuario loggeado
  const selectIdSuscripcion =
    "select S.idSuscripciones from (Usuarios U JOIN Facturas F ON F.Usuarios_correo = U.correo) JOIN Suscripciones S ON F.idSuscripciones = S.idSuscripciones WHERE correo = ? ";

  conn.query(selectIdSuscripcion, [req.session.userEmail], (err, result1) => {
    if (err) throw err;

    //Actualizamos el tipo y el precio de la suscripción asociado al usuario loggeado. Una vez actualizado generamos una nueva factura asociada a esta idSuscripcion (con el trigger de la BD)
    const actualizarSuscripcion =
      "UPDATE Suscripciones SET nombre = ?, precio=? WHERE idSuscripciones=?";
    conn.query(
      actualizarSuscripcion,
      [nuevaSuscripcion, precio, result1[0].idSuscripciones],
      (err, result) => {
        if (err) throw err;
        res.json("Suscripción actualizada con éxito.");
      }
    );
  });
});
//=====================FIN-CONFIGURACIÓN DE USUARIO: NUEVA SUSCRIPCIÓN==========================//

//==========================FIN: RUTAS DE CONFIGURACIÓN DE USUARIO===============================================//

//=========================INICIO: RUTAS DE VISTA DE SELECCIÓN DE PERFIL====================================================//

//selectPerfil - selección de perfil del usuario
router.get("/selectPerfil", (req, res) => {
  //Utilizamos la sesión/el email) como condición para renderizar el perfil
  if (req.session.userEmail) {
    const getPerfiles = "select * from perfiles where correo = ?";
    //Seleccionamos los perfiles del usuario loggeado
    conn.query(getPerfiles, [req.session.userEmail], (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        //Obtenemos el nñumero actual de perfiles creados por ese usuario y lo almacenamos en la var. sesión
        const getContaPerfiles = "SELECT conta_perfiles from Usuarios where correo = ?";
        conn.query(getContaPerfiles, [req.session.userEmail], (err, result2) => {
          if (err) throw err;
          req.session.contaPerfiles = result2[0].conta_perfiles;
          res.render("selectPerfil", {
            pageName: "selectPerfil",
            contaPerfiles: res.locals.contaPerfiles,
            perfiles: result,
          });
        });
      }
    });
  } else {
    return res.redirect("login");
  }
});

//==============INICIO-SETTEAR PEFIL_ID EN SESIÓN al CLICKAR UN PEFIL ESPECÍFICO======================//
router.post("/perfil/setId", (req, res) => {
  if (req.session.userEmail) {
    //Setteamos el perfil actual al clickado
    req.session.currentProfile = req.body.perfilId;
    req.session.profileName = req.body.perfilName;
    req.session.profilePhoto = req.body.perfilFoto;
    //Esto servirá para obtener de la BD las valoraciones y otros parámetros de las pelis y vídeos
    res.json("Good");
  } else {
    return res.redirect("login");
  }
});
//==============FIN-SETTEAR PEFIL_ID EN SESIÓN al CLICKAR UN PEFIL ESPECÍFICO======================//

//==============INICIO-DESSETTEAR PEFIL_ID EN SESIÓN al CLICKAR SECCION DE PERFILES======================//
router.get("/perfil/unSetProfile", (req, res) => {
  //Limpiamps datos de sesión del perfil actual
  req.session.currentProfile = "";
  req.session.profileName = "";
  req.session.profilePhoto = "";
  //Limpieza del objeto que contiene las valoraciones de los vídeos
  for (let prop in req.session.ratedAndSeen) delete req.session.ratedAndSeen[prop];
  res.json("Good");
});
//==============FIN-SETTEAR PEFIL_ID EN SESIÓN al CLICKAR SECCION DE PERFILES======================//

//Perfil-Añadir nuevo perfil en la vista de selección de perfil
router.post("/perfil/add", (req, res) => {
  // Recoger datos necesarios del formulario de creación de perfil(nombre y foto)
  const nombrePerfil = req.body.nombrePerfil;
  const imagenPerfil = req.files.imagenPerfil;

  //Validar datos de formulario en servidor
  if (validateMessageInServer(nombrePerfil)) {
    //Verificamos que el nombre del perfil no se repite
    //si es asi se añade a la BD
    const sql = "select * from perfiles where nombre_perfil = ? AND correo = ? ";
    conn.query(sql, [nombrePerfil, req.session.userEmail], (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        res.json("No puedes repetir el nombre de perfil!");
      } else {
        //creamos una carpeta para cada usuario con las fotos de perfil
        imagenPerfil.mv(`uploads/${req.session.userEmail}/${imagenPerfil.name}`, (err) => {
          if (err) throw err;
          const imagenURL = `${req.session.userEmail}/${imagenPerfil.name}`;
          //Insertamos el perfil en la BD
          const insertarPerfil = "insert into perfiles values (?,?,?,?)";
          const idPerfilString = generator.generate({
            //generar string para id de perfil
            length: 3,
            numbers: true,
          });
          conn.query(
            insertarPerfil,
            ["Perfil" + idPerfilString, nombrePerfil, imagenURL, req.session.userEmail],
            (err, result) => {
              if (err) throw err;
              //Como hemos añadido un nuevo perfil, incrementamos el contador de perfiles del usuario
              const actualizarContador = "Update Usuarios set conta_perfiles = ? where correo = ?";
              conn.query(
                actualizarContador,
                [req.session.contaPerfiles + 1, req.session.userEmail],
                (err, result) => {
                  if (err) throw err;
                  req.session.contaPerfiles += 1;
                  res.json(`Perfil ${nombrePerfil} creado con éxito! `);
                }
              );
            }
          );
        });
      }
    });
  }
});

//Perfil-Actualizar perfil seleccionado.

router.put("/perfil/update/:perfil_id", (req, res) => {
  // Recoger datos necesarios del formulario de actualizacoión de perfil(nombre y foto)
  const nombrePerfilUpdate = req.body.nombrePerfilUpdate;
  let imagenPerfilUpdate = false;

  //Si se ha modificado la imagen recogemos el campo
  if (req.files) {
    imagenPerfilUpdate = req.files.imagenPerfilUpdate;
  }

  //Validar datos de formulario en servidor
  if (validateMessageInServer(nombrePerfilUpdate)) {
    //Si se ha modificado la imagen cambiamos el nombre de perfil y la imagen en la BD
    if (imagenPerfilUpdate) {
      imagenPerfilUpdate.mv(`uploads/${req.session.userEmail}/${imagenPerfilUpdate.name}`, (err) => {
        if (err) throw err;
        const imagenURL = `${req.session.userEmail}/${imagenPerfilUpdate.name}`;
        const sql = "update perfiles set nombre_perfil = ?, foto_perfil = ? where idPerfiles = ?";

        conn.query(sql, [nombrePerfilUpdate, imagenURL, req.params.perfil_id], (err, result) => {
          if (err) throw err; // lanza excepción error
          res.json("Perfil Actualizado Correctamente");
        });
      });
    } else {
      //Si no se ha modificado la imagen sólo cambiamos el nombre del perfil en la BD
      const sql = "UPDATE Perfiles SET nombre_perfil = ? WHERE idPerfiles = ?";
      conn.query(sql, [nombrePerfilUpdate, req.params.perfil_id], (err, result) => {
        //console.log(result);
        if (err) throw err;
        if (result.changedRows === 0) {
          res.json("Problema al actualizar el perfil!");
        }
        res.json("Perfil Actualizado Correctamente");
      });
    }
  }
});

//Perfil-Borrar perfil seleccionado.

router.delete("/perfil/delete/:perfil_id", (req, res) => {
  //SI el usario intenta borrar el perfil por defecto, se lo impedimos
  if (req.params.perfil_id.includes("DEFAULT")) {
    res.json("No puedes borrar el perfil por defecto!");
  } else {
    //En caso contrario:
    //1.borramos la imagen del perfil del SA.
    //2.borramos el registro correspondiente en la BD.

    //Seleccionamos el perfil en concreto para recoger el nombre de la imagen para usarlo en el borrado posteriormente
    const sql = "select * from perfiles where idPerfiles = ?";
    conn.query(sql, [req.params.perfil_id], (err, result) => {
      if (err) throw err;
      //Borramos la imagen correspondiente en /uploads asociada al perfil
      const indeximageName = result[0].foto_perfil.indexOf("/");
      const imageName = result[0].foto_perfil.substring(indeximageName + 1);
      //console.log(imageName);
      const path = `uploads/${req.session.userEmail}/${imageName}`;
      fs.unlink(path, (err) => {
        if (err) throw err;
        //Borramos el perfil de la BD
        const sql = "DELETE FROM Perfiles WHERE idPerfiles = ?";
        conn.query(sql, [req.params.perfil_id], (err, result) => {
          if (err) throw err;
          const actualizarContador = "Update Usuarios set conta_perfiles = ? where correo = ?";
          conn.query(
            actualizarContador,
            [req.session.contaPerfiles - 1, req.session.userEmail],
            (err, result) => {
              if (err) throw err;
              req.session.contaPerfiles -= 1;
              res.json("Perfil borrado con éxito");
            }
          );
        });
      });
    });
  }
});

//=========================FIN: RUTAS DE VISTA DE SELECCIÓN DE PERFIL====================================================//

export default router;
