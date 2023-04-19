-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema FilminProyectoDB
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `FilminProyectoDB` ;

-- -----------------------------------------------------
-- Schema FilminProyectoDB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `FilminProyectoDB` DEFAULT CHARACTER SET utf8 ;
USE `FilminProyectoDB` ;

-- -----------------------------------------------------
-- Table `FilminProyectoDB`.`Usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FilminProyectoDB`.`Usuarios` (
  `correo` VARCHAR(255) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(255) NOT NULL,
  `contrasenya` VARCHAR(255) NOT NULL,
  `fecha_alta` DATETIME NOT NULL DEFAULT current_timestamp,
  `correo_verificado` TINYINT NOT NULL DEFAULT 0,
  `token_email` VARCHAR(255) NULL,
  `conta_perfiles` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`correo`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FilminProyectoDB`.`Suscripciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FilminProyectoDB`.`Suscripciones` (
  `idSuscripciones` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `precio` FLOAT NOT NULL,
  PRIMARY KEY (`idSuscripciones`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FilminProyectoDB`.`Perfiles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FilminProyectoDB`.`Perfiles` (
  `idPerfiles` VARCHAR(100) NOT NULL,
  `nombre_perfil` VARCHAR(100) NOT NULL,
  `foto_perfil` VARCHAR(255) NULL,
  `correo` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idPerfiles`),
  CONSTRAINT `fk_Perfiles_Usuarios1`
    FOREIGN KEY (`correo`)
    REFERENCES `FilminProyectoDB`.`Usuarios` (`correo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FilminProyectoDB`.`MetodosPago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FilminProyectoDB`.`MetodosPago` (
  `idMetodosPago` VARCHAR(255) NOT NULL,
  `numero_tarjeta` VARCHAR(100) NOT NULL,
  `titular_cuenta` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idMetodosPago`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FilminProyectoDB`.`Videos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FilminProyectoDB`.`Videos` (
  `titulo` VARCHAR(255) NOT NULL,
  `anyo_publicacion` INT NOT NULL,
  `imbd_rating` FLOAT NOT NULL,
  `foto_video` VARCHAR(255) NULL,
  `descripcion` VARCHAR(2000) NOT NULL,
  `categoria` VARCHAR(255) NOT NULL,
  `video` VARCHAR(1000) NOT NULL,
  `genero` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`titulo`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FilminProyectoDB`.`Dispositivos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FilminProyectoDB`.`Dispositivos` (
  `idDispositivos` VARCHAR(255) NOT NULL,
  `correo` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idDispositivos`),
  CONSTRAINT `fk_Dispositivos_Usuarios1`
    FOREIGN KEY (`correo`)
    REFERENCES `FilminProyectoDB`.`Usuarios` (`correo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FilminProyectoDB`.`TiposDispositivo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FilminProyectoDB`.`TiposDispositivo` (
  `idDispositivos` VARCHAR(255) NOT NULL,
  `tipo` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idDispositivos`),
  CONSTRAINT `fk_TiposDispositvo_Dispositivos1`
    FOREIGN KEY (`idDispositivos`)
    REFERENCES `FilminProyectoDB`.`Dispositivos` (`idDispositivos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FilminProyectoDB`.`TecnologiasDispositivo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FilminProyectoDB`.`TecnologiasDispositivo` (
  `idDispositivos` VARCHAR(255) NOT NULL,
  `tecnologia` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idDispositivos`),
  CONSTRAINT `fk_SODispositivo_Dispositivos1`
    FOREIGN KEY (`idDispositivos`)
    REFERENCES `FilminProyectoDB`.`Dispositivos` (`idDispositivos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FilminProyectoDB`.`TiposPerfil`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FilminProyectoDB`.`TiposPerfil` (
  `idPerfiles` VARCHAR(100) NOT NULL,
  `nombre_tipo` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idPerfiles`),
  CONSTRAINT `fk_TiposPerfil_Perfiles1`
    FOREIGN KEY (`idPerfiles`)
    REFERENCES `FilminProyectoDB`.`Perfiles` (`idPerfiles`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FilminProyectoDB`.`Facturas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FilminProyectoDB`.`Facturas` (
  `idFacturas` VARCHAR(255) NOT NULL,
  `fecha_factura` DATETIME NOT NULL DEFAULT current_timestamp,
  `idMetodosPago` VARCHAR(255) NOT NULL,
  `idSuscripciones` INT NOT NULL,
  `Usuarios_correo` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idFacturas`),
  CONSTRAINT `fk_Facturas_MetodosPago1`
    FOREIGN KEY (`idMetodosPago`)
    REFERENCES `FilminProyectoDB`.`MetodosPago` (`idMetodosPago`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Facturas_Suscripciones1`
    FOREIGN KEY (`idSuscripciones`)
    REFERENCES `FilminProyectoDB`.`Suscripciones` (`idSuscripciones`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Facturas_Usuarios1`
    FOREIGN KEY (`Usuarios_correo`)
    REFERENCES `FilminProyectoDB`.`Usuarios` (`correo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FilminProyectoDB`.`Rated`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FilminProyectoDB`.`Rated` (
  `titulo` VARCHAR(255) NOT NULL,
  `tipo` VARCHAR(100) NOT NULL,
  `duracion` INT NOT NULL,
  PRIMARY KEY (`titulo`),
  CONSTRAINT `fk_Rated_Videos1`
    FOREIGN KEY (`titulo`)
    REFERENCES `FilminProyectoDB`.`Videos` (`titulo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FilminProyectoDB`.`TiposPago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FilminProyectoDB`.`TiposPago` (
  `idMetodosPago` VARCHAR(255) NOT NULL,
  `tipo` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idMetodosPago`),
  CONSTRAINT `fk_TiposPago_MetodosPago1`
    FOREIGN KEY (`idMetodosPago`)
    REFERENCES `FilminProyectoDB`.`MetodosPago` (`idMetodosPago`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FilminProyectoDB`.`Reseñas`
-- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `FilminProyectoDB`.`Reseñas` (
--   `idReseñas` INT NOT NULL auto_increment,
--   `visto` TINYINT NULL,
--   `valoracion` TINYINT NULL,
--   PRIMARY KEY (`idReseñas`))
-- ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FilminProyectoDB`.`Evaluaciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FilminProyectoDB`.`Evaluaciones` (
  `titulo` VARCHAR(255) NOT NULL,
  `idPerfiles` VARCHAR(100) NOT NULL,
  `visto` INT NULL,
  `valoracion` INT NULL,
  PRIMARY KEY (`idPerfiles`, `titulo`),
  CONSTRAINT `fk_table1_Videos1`
    FOREIGN KEY (`titulo`)
    REFERENCES `FilminProyectoDB`.`Videos` (`titulo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Reseñas_Perfiles1`
    FOREIGN KEY (`idPerfiles`)
    REFERENCES `FilminProyectoDB`.`Perfiles` (`idPerfiles`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FilminProyectoDB`.`ParametrosUsuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FilminProyectoDB`.`ParametrosUsuario` (
  `correo` VARCHAR(255) NOT NULL,
  `telefono` CHAR(9) NULL,
  `localidad` VARCHAR(255) NULL,
  `direccion` VARCHAR(255) NULL,
  PRIMARY KEY (`correo`),
  CONSTRAINT `fk_ParametrosUsuario_Usuarios1`
    FOREIGN KEY (`correo`)
    REFERENCES `FilminProyectoDB`.`Usuarios` (`correo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `FilminProyectoDB`.`Usuarios`
-- -----------------------------------------------------
-- START TRANSACTION;
-- USE `FilminProyectoDB`;
-- INSERT INTO `FilminProyectoDB`.`Usuarios` (`correo`, `nombre`, `apellido`, `contrasenya`, `fecha_alta`, `correo_verificado`, `token_email`) VALUES ('usuario1@gmail.com', 'usuario1', 'apellido1', 'abcdefghijkl', DEFAULT, DEFAULT, NULL);
-- INSERT INTO `FilminProyectoDB`.`Usuarios` (`correo`, `nombre`, `apellido`, `contrasenya`, `fecha_alta`, `correo_verificado`, `token_email`) VALUES ('usuario2@gmail.com', 'usuario2', 'apellido2', 'lkjhgfdsadn', DEFAULT, DEFAULT, NULL);

-- COMMIT;


-- -----------------------------------------------------
-- Data for table `FilminProyectoDB`.`Suscripciones`
-- -----------------------------------------------------
START TRANSACTION;
USE `FilminProyectoDB`;
INSERT INTO `FilminProyectoDB`.`Suscripciones` (`idSuscripciones`, `nombre`, `precio`) VALUES (1, 'Light', 8.99);
INSERT INTO `FilminProyectoDB`.`Suscripciones` (`idSuscripciones`, `nombre`, `precio`) VALUES (2, 'Medium', 14.99);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FilminProyectoDB`.`Perfiles`
-- -----------------------------------------------------
-- START TRANSACTION;
-- USE `FilminProyectoDB`;
-- INSERT INTO `FilminProyectoDB`.`Perfiles` (`idPerfiles`, `nombre_perfil`, `foto_perfil`, `correo`) VALUES ('perfil11', 'nombre11', NULL, 'usuario1@gmail.com');
-- INSERT INTO `FilminProyectoDB`.`Perfiles` (`idPerfiles`, `nombre_perfil`, `foto_perfil`, `correo`) VALUES ('perfil21', 'nombre21', NULL, 'usuario2@gmail.com');

-- COMMIT;


-- -----------------------------------------------------
-- Data for table `FilminProyectoDB`.`MetodosPago`
-- -----------------------------------------------------
START TRANSACTION;
USE `FilminProyectoDB`;
INSERT INTO `FilminProyectoDB`.`MetodosPago` (`idMetodosPago`, `numero_tarjeta`, `titular_cuenta`) VALUES ('mp1', '12345678910', 'Titular1');

COMMIT;


-- -----------------------------------------------------
-- Data for table `FilminProyectoDB`.`Videos`
-- -----------------------------------------------------
-- START TRANSACTION;
-- USE `FilminProyectoDB`;
-- INSERT INTO `FilminProyectoDB`.`Videos` (`titulo`, `anyo_publicacion`, `imbd_rating`) VALUES ('HungerGames', 2012, 8.1);

-- COMMIT;


-- -----------------------------------------------------
-- Data for table `FilminProyectoDB`.`Dispositivos`
-- -----------------------------------------------------
-- START TRANSACTION;
-- USE `FilminProyectoDB`;
-- INSERT INTO `FilminProyectoDB`.`Dispositivos` (`idDispositivos`, `correo`) VALUES ('disp11', 'usuario1@gmail.com');
-- INSERT INTO `FilminProyectoDB`.`Dispositivos` (`idDispositivos`, `correo`) VALUES ('disp12', 'usuario1@gmail.com');
-- INSERT INTO `FilminProyectoDB`.`Dispositivos` (`idDispositivos`, `correo`) VALUES ('disp21', 'usuario2@gmail.com');
-- INSERT INTO `FilminProyectoDB`.`Dispositivos` (`idDispositivos`, `correo`) VALUES ('disp22', 'usuario2@gmail.com');

-- COMMIT;


-- -----------------------------------------------------
-- Data for table `FilminProyectoDB`.`TiposDispositivo`
-- -----------------------------------------------------
-- START TRANSACTION;
-- USE `FilminProyectoDB`;
-- INSERT INTO `FilminProyectoDB`.`TiposDispositivo` (`idDispositivos`, `tipo`) VALUES ('disp11', 'movil');
-- INSERT INTO `FilminProyectoDB`.`TiposDispositivo` (`idDispositivos`, `tipo`) VALUES ('disp12', 'tv');
-- INSERT INTO `FilminProyectoDB`.`TiposDispositivo` (`idDispositivos`, `tipo`) VALUES ('disp21', 'movill');
-- INSERT INTO `FilminProyectoDB`.`TiposDispositivo` (`idDispositivos`, `tipo`) VALUES ('disp22', 'movill');

-- COMMIT;


-- -----------------------------------------------------
-- Data for table `FilminProyectoDB`.`TecnologiasDispositivo`
-- -----------------------------------------------------
-- START TRANSACTION;
-- USE `FilminProyectoDB`;
-- INSERT INTO `FilminProyectoDB`.`TecnologiasDispositivo` (`idDispositivos`, `tecnologia`) VALUES ('disp11', 'android');
-- INSERT INTO `FilminProyectoDB`.`TecnologiasDispositivo` (`idDispositivos`, `tecnologia`) VALUES ('disp12', 'chromecast');
-- INSERT INTO `FilminProyectoDB`.`TecnologiasDispositivo` (`idDispositivos`, `tecnologia`) VALUES ('disp21', 'android');
-- INSERT INTO `FilminProyectoDB`.`TecnologiasDispositivo` (`idDispositivos`, `tecnologia`) VALUES ('disp22', 'ios');

-- COMMIT;


-- -----------------------------------------------------
-- Data for table `FilminProyectoDB`.`TiposPerfil`
-- -----------------------------------------------------
-- START TRANSACTION;
-- USE `FilminProyectoDB`;
-- INSERT INTO `FilminProyectoDB`.`TiposPerfil` (`idPerfiles`, `nombre_tipo`) VALUES ('perfil11', 'adulto');
-- INSERT INTO `FilminProyectoDB`.`TiposPerfil` (`idPerfiles`, `nombre_tipo`) VALUES ('perfil21', 'infantil');

-- COMMIT;


-- -----------------------------------------------------
-- Data for table `FilminProyectoDB`.`Facturas`
-- -----------------------------------------------------
-- START TRANSACTION;
-- USE `FilminProyectoDB`;
-- INSERT INTO `FilminProyectoDB`.`Facturas` (`idFacturas`, `fecha_factura`, `idMetodosPago`, `idSuscripciones`, `Usuarios_correo`) VALUES ('factura11', DEFAULT, 'mp1', 1, 'usuario1@gmail.com');
-- INSERT INTO `FilminProyectoDB`.`Facturas` (`idFacturas`, `fecha_factura`, `idMetodosPago`, `idSuscripciones`, `Usuarios_correo`) VALUES ('factura21', DEFAULT, 'mp1', 2, 'usuario2@gmail.com');

-- COMMIT;


-- -----------------------------------------------------
-- Data for table `FilminProyectoDB`.`Rated`
-- -----------------------------------------------------
-- START TRANSACTION;
-- USE `FilminProyectoDB`;
-- INSERT INTO `FilminProyectoDB`.`Rated` (`titulo`, `tipo`, `duracion`) VALUES ('HungerGames', 'Mature', 123);

-- COMMIT;


-- -----------------------------------------------------
-- Data for table `FilminProyectoDB`.`TiposPago`
-- -----------------------------------------------------
START TRANSACTION;
USE `FilminProyectoDB`;
INSERT INTO `FilminProyectoDB`.`TiposPago` (`idMetodosPago`, `tipo`) VALUES ('mp1', 'VISA');

COMMIT;


-- -----------------------------------------------------
-- Data for table `FilminProyectoDB`.`Reseñas`
-- -----------------------------------------------------
-- START TRANSACTION;
-- USE `FilminProyectoDB`;
-- INSERT INTO `FilminProyectoDB`.`Reseñas` (`idReseñas`, `visto`, `valoracion`) VALUES (1, 1, 1);
-- INSERT INTO `FilminProyectoDB`.`Reseñas` (`idReseñas`, `visto`, `valoracion`) VALUES (2, 1, 0);

-- COMMIT;


-- -----------------------------------------------------
-- Data for table `FilminProyectoDB`.`Evaluaciones`
-- -----------------------------------------------------
-- START TRANSACTION;
-- USE `FilminProyectoDB`;
-- INSERT INTO `FilminProyectoDB`.`Evaluaciones` (`titulo`, `idPerfiles`, `idReseñas`) VALUES ('HungerGames', 'perfil11', 1);
-- INSERT INTO `FilminProyectoDB`.`Evaluaciones` (`titulo`, `idPerfiles`, `idReseñas`) VALUES ('HungerGames', 'perfil21', 2);

-- COMMIT;


-- -----------------------------------------------------
-- Data for table `FilminProyectoDB`.`ParametrosUsuario`
-- -----------------------------------------------------
-- START TRANSACTION;
-- USE `FilminProyectoDB`;
-- INSERT INTO `FilminProyectoDB`.`ParametrosUsuario` (`correo`, `telefono`, `localidad`, `direccion`) VALUES ('usuario1@gmail.com', NULL, NULL, NULL);
-- INSERT INTO `FilminProyectoDB`.`ParametrosUsuario` (`correo`, `telefono`, `localidad`, `direccion`) VALUES ('usuario2@gmail.com', NULL, NULL, NULL);

-- COMMIT;

