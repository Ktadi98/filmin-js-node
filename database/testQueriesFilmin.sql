SET SQL_SAFE_UPDATES = 0;
use filminproyectodb;

-- ================================================INICIO-TRIGGER DE INSERCIÓN DE NUEVO USUARIO==========================================
-- Insertar Usuario--> insertamos suscripción por defecto, insertamos factura por defecto, insertamos perfil por defecto
drop trigger if exists insert_user_AI;
delimiter //
create trigger insert_user_AI after insert on usuarios
for each row
begin
	insert into suscripciones values(default,"newSus",1.00);
    set @id_sus = (select idSuscripciones from suscripciones where nombre="newSus" limit 1);
    set @factura_string = (SELECT SUBSTR(MD5(RAND()), 1, 5) );
    set @perfil_string = (SELECT SUBSTR(MD5(RAND()), 1, 6));
    insert into facturas values(concat("DEFAULT",@factura_string),default,"mp1",@id_sus,new.correo);
    insert into perfiles values(concat("DEFAULT",@perfil_string),"Usuario1","assets/imgs/perfilDefault.png",new.correo);
 end //   
delimiter ;

-- ================================================FIN-TRIGGER DE INSERCIÓN DE NUEVO USUARIO==========================================

-- ================================================INICIO-TRIGGER DE ACTUALIZACIÓN DE SUSCRIPCIÓN==========================================
-- Actualizar suscripción --> Insertamos nueva factura con los datos de la suscripción actualizada
drop trigger if exists insert_factura_AU;
delimiter //
create trigger insert_factura_AU after update on suscripciones
for each row
begin
	set @factura_string2 = (SELECT SUBSTR(MD5(RAND()), 1, 5) );
    set @correo = (select U.correo from (Usuarios U JOIN Facturas F ON F.Usuarios_correo = U.correo)
					JOIN Suscripciones S ON F.idSuscripciones = S.idSuscripciones 
					WHERE S.idSuscripciones = old.idSuscripciones LIMIT 1);
	insert into facturas values(@factura_string2,default,"mp1",old.idSuscripciones,@correo);
end //
delimiter ;
-- ================================================FIN-TRIGGER DE ACTUALIZACIÓN DE SUSCRIPCIÓN==========================================

-- ================================================INICIO-TRIGGER DE ELIMINACIÓN PERFIL================================================
-- Eliminar perfil --> eliminamos todas las evaluaciones de los vídeos asociadas a ese perfil
drop trigger if exists delete_perfil_BD;
delimiter //
create trigger delete_perfil_BD before delete on perfiles
for each row
begin
	delete from Evaluaciones where idPerfiles = old.idPerfiles;
    -- set @current_user = (select old.correo from Perfiles limit 1); 
    -- update Usuarios set conta_perfiles = conta_perfiles - 1 where correo = @current_user;
end //
delimiter ;

-- ================================================FIN-TRIGGER DE ELIMINACIÓN PERFIL================================================

-- ================================================INICIO-TRIGGER DE CREACIÓN PERFIL================================================

-- INICIO =======Cursor para iterar sobre la tabla de videos
DROP PROCEDURE IF EXISTS insertDefaultEvaluaciones;
delimiter //
CREATE PROCEDURE insertDefaultEvaluaciones(in idPerfil varchar(100))
	BEGIN
		DECLARE CURSOR_VIDEO_TITLE VARCHAR(255);
        DECLARE done INT DEFAULT FALSE;
        DECLARE cursor_defaultEvaluaciones CURSOR FOR SELECT titulo FROM videos;
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
		OPEN cursor_defaultEvaluaciones;
		loop_through_rows: LOOP
			FETCH cursor_defaultEvaluaciones INTO CURSOR_VIDEO_TITLE;
			IF done THEN
			  LEAVE loop_through_rows;
			END IF;
			INSERT INTO Evaluaciones VALUES (CURSOR_VIDEO_TITLE,idPerfil,null,2);
		  END LOOP;
		  CLOSE cursor_defaultEvaluaciones;
	END //

delimiter ;
-- FIN =======Cursor para iterar sobre la tabla de videos
-- Insertar perfil --> insertar evaluaciones por defecto valoracion = 2 para todas los videos para la id del nuevo perfil 
drop trigger if exists create_perfil_AI;
delimiter //
create trigger create_perfil_AI after insert on perfiles
for each row
begin
   call insertDefaultEvaluaciones(new.idPerfiles);
end //
delimiter ;



-- ================================================FIN-TRIGGER DE CREACIÓN PERFIL================================================
-- ================================================INICIO-CONSULTAS DE TESTEO==========================================
select * from usuarios;
update usuarios set correo_verificado = 1 where correo like "carlos%";
select * from facturas where idFacturas NOT LIKE "DEFAULT%";
select * from suscripciones;
select * from perfiles;
insert into ParametrosUsuario VALUES ("carlos1@gmail.com","999999999","C","P");
select * from ParametrosUsuario;
delete from ParametrosUsuario where correo = "carlos1@gmail.com";
delete from perfiles where foto_perfil not like "assets%" ;
delete from facturas where Usuarios_correo = "carlos1@gmail.com";
select S.* from (Usuarios U JOIN Facturas F ON F.Usuarios_correo = U.correo)
JOIN Suscripciones S ON F.idSuscripciones = S.idSuscripciones 
WHERE correo = "carlos1@gmail.com";

-- Obtener facturas,suscripción del usuario loggeado
select * from (Usuarios U JOIN Facturas F ON F.Usuarios_correo = U.correo)
JOIN Suscripciones S ON F.idSuscripciones = S.idSuscripciones 
WHERE correo = "carlos1@gmail.com" LIMIT 1;

select S.nombre from Suscripciones S JOIN Facturas F ON F.idSuscripciones = S.idSuscripciones WHERE F.Usuarios_correo = "carlos1@gmail.com" LIMIT 1;
select distinct F.fecha_factura, S.nombre, F.idMetodosPago from Suscripciones S JOIN Facturas F ON F.idSuscripciones = S.idSuscripciones WHERE F.Usuarios_correo = "carlos1@gmail.com";

-- ===========================INSERTS DE PElÍCULAS===================
-- delete from videos;
select * from videos;
insert into videos values ("Los Juegos del Hambre 1",2012,7.2,'assets/imgs/juegosHambre.webp',"La nación de Panem está dividida en 12 distritos, gobernados desde el Capitolio. Como castigo por una revuelta fallida, cada distrito se ve obligado a seleccionar dos tributos, un chico y una chica de entre 12 a 18 años.","P", "https://www.youtube.com/embed/_8Ktfs2mBDY","Acción Drama");
insert into videos values ("Guardianes de la Galaxia 1",2014,6.9,'assets/imgs/guardianes.jpg',"En 1988, tras la muerte de su madre, un joven, Peter Quill es abducido de la Tierra por los Devastadores (Ravagers, en inglés), un grupo de piratas espaciales liderados por Yondu Udonta.","P","https://www.youtube.com/embed/dzj4P11Yr6E","Acción Aventura");
insert into videos values("Rick y Morty",2013,9.1,'assets/imgs/rickMorty.jpg',"Rick Sánchez es un ejemplo del típico científico loco. Es un genio, pero es irresponsable, alcohólico, egoísta, un poco depresivo y con poca cordura. Rick por diferentes razones termina mudándose a la casa de su hija Beth y en ese momento se encuentra con su nieto Morty; un chico de 14 años de edad, tímido y no muy listo. Al juntarse con su nieto, Rick y Morty viven una variedad de aventuras a lo largo del cosmos y universos paralelos. Y es mediante tantas vivencias y reflexiones que Rick busca que su nieto Morty no acabe como su padre, Jerry, un hombre muy poco exitoso que a pesar de tener buenas intenciones resulta ser bastante inútil en muchas ocasiones y depende mucho de su esposa, Beth, hija de Rick.","S","https://www.youtube.com/embed/hl1U0bxTHbY","Comedia");
insert into videos values ("Shameless",2011,10,'assets/imgs/shameless.webp',"La serie representa a la familia de Frank Gallagher, un padre soltero de seis hijos. Mientras pasa sus días borracho es su hija mayor, Fiona Gallagher, quien se tiene que hacer responsable del resto de sus hermanos.","S","https://www.youtube.com/embed/9tvkYS5cA58","Comedia Drama");
insert into videos values ("Euphoria",2019,8.9,'assets/imgs/euphoria.jpg',"Euphoria, sigue a «un grupo de estudiantes de secundaria mientras navegan por las drogas, el sexo, la prostitución, la identidad, el trauma, las redes sociales, el amor y la amistad","S","https://www.youtube.com/embed/zadGXDG-z4M","Drama");
insert into videos values ("Westworld",2016,7.2,'assets/imgs/westworld.jpg',"En un futuro no especificado, Westworld, uno de los seis parques temáticos poseído y operados por Delos Inc., permite a los visitantes experimentar el Viejo Oeste en un entorno poblado por «anfitriones», androides programados para satisfacer todos los deseos de los visitantes.","S","https://www.youtube.com/embed/qLFBcdd6Qw0","Drama Aventura");
insert into videos values ("Batman: el caballero de la Noche",2012,7.5,'assets/imgs/batman.jpg','Hace ya ocho años desde que Batman se convirtió en fugitivo al asumir la muerte de Harvey. La dura Ley Dent sigue aplacando la criminalidad de Gotham, aunque la llegada de una gata ladrona y un misterioso terrorista enmascarado lo cambiará todo.',"P","https://www.youtube.com/embed/ru879ckLnJo","Acción");
insert into videos values ("Interestelar",2014,7.9,'assets/imgs/interestelar.webp','En 2067, la destrucción de las cosechas en la Tierra ha hecho que la agricultura sea cada vez más difícil y se vea amenazada la supervivencia de la humanidad. Joseph Cooper, viudo, exingeniero y piloto de la NASA, dirige una granja con su suegro Donald, su hijo Tom y su hija Murph, quien cree que su habitación está embrujada por un poltergeist. Cuando aparecen inexplicablemente extraños patrones de polvo en el suelo de la habitación de Murph, Cooper se da cuenta de que la gravedad está detrás de su formación, no un "fantasma". Interpreta el patrón como un conjunto de coordenadas geográficas formadas en código binario. Cooper y Murph siguen las coordenadas a una instalación secreta de la NASA, donde se encuentran con el exprofesor de Cooper, el doctor Brand.','P',"https://www.youtube.com/embed/LYS2O1nl9iM","Aventura Drama");
insert into rated values ("Los Juegos del Hambre 1","+12",120);
insert into rated values ("Guardianes de la Galaxia 1","+12",124);
insert into rated values ("Rick y Morty","+18",25);
insert into rated values ("Shameless","+18",49);
insert into rated values ("Euphoria","+18",45);
insert into rated values ("Westworld","+12",63);
insert into rated values ("Batman: el caballero de la Noche","+12",93);
insert into rated values ("Interestelar","+12",130);
select * from rated;
select * from videos V JOIN Rated R ON V.titulo = R.titulo;

select * from Evaluaciones;


select * from (videos V JOIN Rated R ON V.titulo = R.titulo) JOIN Evaluaciones E ON V.titulo = E.titulo WHERE LOWER(V.titulo) LIKE "ri%" AND E.idPerfiles = "DEFAULTe2ae5f";

select * from (videos V JOIN Rated R ON V.titulo = R.titulo) JOIN Evaluaciones E ON V.titulo = E.titulo WHERE V.genero LIKE '%Acción%' AND E.idPerfiles = "DEFAULTe2ae5f";
-- ================================================CONSULTAS DE DISPOSITIVOS============================================


-- ================================================FIN-CONSULTA DE TESTEO==========================================



