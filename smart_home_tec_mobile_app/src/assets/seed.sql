create table if not exists Regiones(
    pais varchar (60) unique not null,
    continente varchar(30) not null,
    primary key (pais)
);

create table if not exists Tipo(
  nombre varchar(50) unique not null,
  tiempo_de_garantia int not null,
  imagen varchar(600),
  descripcion varchar (400),
  PRIMARY KEY (nombre)
);
create table if not exists Dispositivo_modelo(
  modelo varchar(50) unique not null,
  marca varchar(50),
  imagen varchar(600),
  consumo_electrico int not null,
  tipo varchar(50),
  PRIMARY KEY (modelo),
  foreign key (tipo) references Tipo(nombre)
);

create table if not exists Distribuidor(
  cedula_juridica int unique not null,
  pais varchar(60) not null,
  nombre varchar(50) not null,
  imagen varchar(200) not null,
  PRIMARY KEY (cedula_juridica),
  foreign key (pais) references Regiones (pais)
);

create table if not exists Dispositivo_se_vende_en (
    cj_distribuidor int not null,
    modelo_dispotivo varchar(50) not null,
    precio int not null,
    cantidad int not null,
    primary key (cj_distribuidor,modelo_dispotivo),
    foreign key (cj_distribuidor) references Distribuidor(cedula_juridica),
    foreign key (modelo_dispotivo) references Dispositivo_modelo(modelo)
);

create table if not exists Cliente(
    id int unique not null,
    email varchar(100) not null,
    contrasena varchar(20) not null,
    primer_apellido varchar (50),
    segundo_apellido varchar(50),
    nombre varchar(50) not null ,
    pais varchar(60) not null,
    PRIMARY KEY (id),
    foreign key (pais) references Regiones (pais)
);


create table if not exists Aposento(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_cuarto varchar(50) not null,
  id_cliente int not null,
  foreign key (id_cliente) references Cliente (id)
);

create table if not exists Dispositivo_adquirido (
    n_serie INTEGER PRIMARY KEY AUTOINCREMENT unique not null,
    prendido boolean  default false,
    fecha_prendido timestamp,
    modelo varchar(50) not null,
    id_aposento int,
    foreign key (modelo) references Dispositivo_modelo(modelo),
    foreign key (id_aposento) references Aposento(id)
);

create table  if not exists Cliente_ha_usado(
    n_serie_dispositivo int not null,
    id_cliente int not null,
    propietario_actual boolean default true,
    primary key (n_serie_dispositivo,id_cliente),
    foreign key (n_serie_dispositivo) references Dispositivo_adquirido (n_serie),
    foreign key (id_cliente) references Cliente(id)
);

create table if not exists Historial(
  n_historial INTEGER,
  n_serie int not null,
  dia int ,
  mes int,
  ano int ,
  hora int,
  minutos_de_uso int default 0,
  primary key (n_historial,n_serie),
  foreign key (n_serie) references Dispositivo_adquirido (n_serie)
);

create table if not exists Administrador(
  id int unique not null,
  contrasena varchar(20) not null,
  email varchar(50) unique not null ,
  PRIMARY KEY (id)
);


create table if not exists direccion_entrega (
    direccion_entrega varchar(500) not null,
    id_cliente int not null,
    primary key (direccion_entrega,id_cliente),
    foreign key (id_cliente) references Cliente(id)
);

create table if not exists Pedido(
    id INTEGER PRIMARY KEY AUTOINCREMENT unique not null,
    monto int not null,
    id_cliente int not null,
    n_serie_dispositivo int not null,
    foreign key (id_cliente) references Cliente(id),
    foreign key (n_serie_dispositivo) references Dispositivo_adquirido(n_serie)
             );



create table if not exists Factura(
    n_factura INTEGER PRIMARY KEY AUTOINCREMENT unique not null,
     dia int  ,
     mes int   ,
     ano int  
);

create table if not exists Pedido_Factura(
  id_pedido int unique not null,
  n_factura int unique not null,
  PRIMARY KEY (id_pedido,n_factura),
  foreign key (id_pedido) references Pedido(id),
  foreign key (n_factura) references Factura(n_factura)
);
create table if not exists Certificado_garantia(
    n_factura int unique not null,
    mes_fin_garantia int not null,
    ano_fin_garantia int not null,
    primary key (n_factura,mes_fin_garantia,ano_fin_garantia),
    foreign key (n_factura) references Factura(n_factura)
);


-- insert into Pedido (id, monto, id_cliente, n_serie_dispositivo) values  (1, 2500, 1, 2);
-- insert into Pedido_Factura (id_pedido, n_factura) VALUES (1, 1);
-- insert into Certificado_garantia (n_factura, mes_fin_garantia, ano_fin_garantia) VALUES (1, 7, 2022);

-- insert into Aposento (nombre_cuarto, id_cliente) VALUES('sala', 2);
-- insert into Aposento (nombre_cuarto, id_cliente) values ('cuarto', 2);
-- insert into Aposento (nombre_cuarto, id_cliente) values ('cocina', 2);
-- insert into Aposento (nombre_cuarto, id_cliente) values ('garaje', 2);

-- insert into Cliente VALUES (1, 'juan@gmail', 'blupblup', 'Solis', 'Argueyo', 'Juan', 'Argentina');
-- insert into Cliente VALUES (2, 'brayan@gmail', 'blupblup', 'Leon', 'Urbina', 'Brayan', 'Austria');
-- INSERT INTO Aposento (nombre_cuarto, id_cliente)
-- VALUES ('sala', 1);

-- INSERT INTO Aposento (nombre_cuarto, id_cliente)
-- VALUES ('cocina', 1);

-- INSERT INTO Aposento (nombre_cuarto, id_cliente)
-- VALUES ('cuarto', 1);

-- INSERT INTO Cliente_ha_usado (n_serie_dispositivo, id_cliente, propietario_actual)
-- VALUES (1, 1, true);

-- INSERT INTO Cliente_ha_usado (n_serie_dispositivo, id_cliente, propietario_actual)
-- VALUES (2, 1, true);

-- INSERT INTO Tipo (nombre, tiempo_de_garantia, imagen, descripcion)
-- VALUES ('bombillo', 4,
--         'https://cdn.shopify.com/s/files/1/1161/3498/products/nexxt-solutions-bombillo-inteligente-wi-fi-led-w110-luz-blanca-1_large.jpg?v=1582739721',
--         'Inteligente');

-- INSERT INTO Tipo (nombre, tiempo_de_garantia, imagen, descripcion)
-- VALUES ('socket', 2, 'https://m.media-amazon.com/images/I/51Be65aDXtL._AC_.jpg', 'Inteligente');

-- INSERT INTO Dispositivo_modelo (modelo, marca, imagen, consumo_electrico, tipo)
-- VALUES ('Bombillo3000', 'GE', 'https://cdn.shopify.com/s/files/1/2393/8647/products/5AT1S3-WEN0.jpg?v=1606809887', 20,
--         'bombillo');

-- INSERT INTO Dispositivo_modelo (modelo, marca, imagen, consumo_electrico, tipo)
-- VALUES ('Socket3000', 'Xiaomi', 'https://images-na.ssl-images-amazon.com/images/I/41M5BfLYjQL._AC_SX466_.jpg', 35,
--         'socket');
        
-- INSERT INTO Dispositivo_adquirido (n_serie, prendido, fecha_prendido, modelo, id_aposento)
-- VALUES (1, false, '2021-05-09 21:19:21.000', 'Bombillo3000', null);

-- INSERT INTO Dispositivo_adquirido (n_serie, prendido, fecha_prendido, modelo, id_aposento)
-- VALUES (2, false, '2021-05-09 21:20:06.000', 'Socket3000', null);



-- drop TABLE Aposento;
-- drop TABLE Certificado_garantia;
-- drop TABLE Cliente;
-- drop TABLE Cliente_ha_usado;
-- drop TABLE direccion_entrega;
-- drop TABLE Dispositivo_adquirido;
-- drop TABLE Dispositivo_modelo;
-- drop TABLE Dispositivo_se_vende_en;
-- drop TABLE Distribuidor;
-- drop TABLE Factura;
-- drop TABLE Historial;
-- drop TABLE Pedido;
-- drop TABLE Pedido_Factura;
-- drop TABLE Regiones;
-- drop TABLE Tipo;