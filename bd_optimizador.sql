
CREATE DATABASE optimizador;

USE optimizador;

CREATE TABLE cortes (
  referencia varchar(30) NOT NULL,
  longitud int(10) DEFAULT NULL,
  cantidad int(10) DEFAULT NULL,
  id_especificaciones int(10) DEFAULT NULL,
  numero_corte int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE especificaciones (
  id_especificaciones int(10) NOT NULL,
  descripcion_material varchar(30) DEFAULT NULL,
  longitud_material int(10) DEFAULT NULL,
  unidades_medida enum('metros','centimetros','milimetros') DEFAULT NULL,
  despunteIzq int(10) DEFAULT NULL,
  despunteDer int(10) DEFAULT NULL,
  grosorHta int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tubos (
  numero_corte int(10) NOT NULL,
  referencia varchar(30) DEFAULT NULL,
  longitud_medida int(10) DEFAULT NULL,
  cantidad int(10) DEFAULT NULL,
  desperdicio int(10) DEFAULT NULL,
  descripcion_material varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE usuarios (
  cedula int(20) NOT NULL,
  nombre varchar(30) DEFAULT NULL,
  email varchar(30) DEFAULT NULL,
  contrasena varchar(255) DEFAULT NULL,
  perfil enum('Empleado','Administrador') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO usuarios (`cedula`, `nombre`, `email`, `contrasena`, `perfil`) VALUES
(15374385, 'hernan', 'hernanvargasrivera@gmail.com', '$2a$08$P0/uJ7bQHeO2/lrvEVS.mOXI/TXswmWKIaeOOtuFht6GiikrQc0tq', NULL);


ALTER TABLE cortes
  ADD PRIMARY KEY (referencia),
  ADD KEY id_especificaciones (id_especificaciones),
  ADD KEY numero_corte (numero_corte);

ALTER TABLE especificaciones
  ADD PRIMARY KEY (id_especificaciones);

ALTER TABLE tubos
  ADD PRIMARY KEY (numero_corte);

ALTER TABLE usuarios
  ADD PRIMARY KEY (cedula);

ALTER TABLE especificaciones
  MODIFY id_especificaciones int(10) NOT NULL AUTO_INCREMENT;

ALTER TABLE tubos
  MODIFY numero_corte int(10) NOT NULL AUTO_INCREMENT;

ALTER TABLE cortes
  ADD CONSTRAINT especificaciones_ibfk_1 FOREIGN KEY (id_especificaciones) REFERENCES especificaciones (id_especificaciones) ON UPDATE CASCADE,
  ADD CONSTRAINT especificaciones_ibfk_2 FOREIGN KEY (numero_corte) REFERENCES tubos(numero_corte) ON UPDATE CASCADE;
