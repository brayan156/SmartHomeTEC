create table IF NOT EXISTS Regiones(
    pais varchar (20) unique not null,
    continente varchar(15) not null,
    primary key (pais)
);

create table IF NOT EXISTS Tipo(
  nombre varchar(15) unique not null,
  tiempo_de_garantia int not null,
  imagen varchar(200),
  descripcion varchar (50),
  PRIMARY KEY (nombre)
);

create table  IF NOT EXISTS Dispositivo_modelo(
  modelo varchar(15) unique not null,
  marca varchar(15),
  imagen varchar(200),
  consumo_electrico int not null,
  tipo varchar(15),
  PRIMARY KEY (modelo),
  foreign key (tipo) references Tipo(nombre)
);

create table  IF NOT EXISTS Distribuidor(
  cedula_juridica int unique not null,
  pais varchar(20) not null,
  nombre varchar(15) not null,
  imagen varchar(200) not null,
  PRIMARY KEY (cedula_juridica),
  foreign key (pais) references Regiones (pais)
);

create table  IF NOT EXISTS Dispositivo_se_vende_en (
    cj_distribuidor int not null,
    modelo_dispotivo varchar(15) not null,
    precio int not null,
    cantidad int not null,
    primary key (cj_distribuidor,modelo_dispotivo),
    foreign key (cj_distribuidor) references Distribuidor(cedula_juridica),
    foreign key (modelo_dispotivo) references Dispositivo_modelo(modelo)
);

create table  IF NOT EXISTS Cliente(
    id int unique not null,
    email varchar(50) not null,
    contrasena varchar(20) not null,
    primer_apellido varchar (15),
    segundo_apellido varchar(15),
    nombre varchar(15) not null ,
    pais varchar(20) not null,
    PRIMARY KEY (id),
    foreign key (pais) references Regiones (pais)
);



create table IF NOT EXISTS  Aposento(
  id serial not null,
  nombre_cuarto varchar(20) not null,
  id_cliente int not null,
  primary key (id),
  foreign key (id_cliente) references Cliente (id)
);

create table IF NOT EXISTS  Dispositivo_adquirido (
    n_serie serial unique not null,
    prendido boolean  default false,
    fecha_prendido timestamp,
    modelo varchar(15) not null,
    id_aposento int,
    primary key (n_serie),
    foreign key (modelo) references Dispositivo_modelo(modelo),
    foreign key (id_aposento) references Aposento(id)
);

create table IF NOT EXISTS  Cliente_ha_usado(
    n_serie_dispositivo int not null,
    id_cliente int not null,
    propietario_actual boolean default true,
    primary key (n_serie_dispositivo,id_cliente),
    foreign key (n_serie_dispositivo) references Dispositivo_adquirido (n_serie),
    foreign key (id_cliente) references Cliente(id)
);

create table IF NOT EXISTS  Historial(
  n_historial serial not null,
  n_serie int not null,
  dia int ,
  mes int ,
  ano int ,
  hora int,
  minutos_de_uso int default 0,
  primary key (n_historial,n_serie),
  foreign key (n_serie) references Dispositivo_adquirido (n_serie)
);

create table IF NOT EXISTS  Administrador(
  id int unique not null,
  contrasena varchar(20) not null,
  email varchar(50) unique not null ,
  PRIMARY KEY (id)
);


create table IF NOT EXISTS  direccion_entrega (
    direccion_entrega varchar(50) not null,
    id_cliente int not null,
    primary key (direccion_entrega,id_cliente),
    foreign key (id_cliente) references Cliente(id)
);

create table IF NOT EXISTS  Pedido(
    id serial unique not null,
    monto int not null,
    id_cliente int not null,
    n_serie_dispositivo int not null,
    primary key (id),
    foreign key (id_cliente) references Cliente(id),
    foreign key (n_serie_dispositivo) references Dispositivo_adquirido(n_serie)
);



create table IF NOT EXISTS  Factura(
    n_factura serial unique not null,
     dia int ,
     mes int ,
     ano int,
    PRIMARY KEY (n_factura)
);

create table IF NOT EXISTS  Pedido_Factura(
  id_pedido int unique not null,
  n_factura int unique not null,
  PRIMARY KEY (id_pedido,n_factura),
  foreign key (id_pedido) references Pedido(id),
  foreign key (n_factura) references Factura(n_factura)
);
create table  IF NOT EXISTS Certificado_garantia(
    n_factura int unique not null,
    mes_fin_garantia int not null,
    ano_fin_garantia int not null,
    primary key (n_factura,mes_fin_garantia,ano_fin_garantia),
    foreign key (n_factura) references Factura(n_factura)
);

-- insert into Cliente VALUES (1, 'tomas@gmail', 'blupblup', 'Segura', 'Monge', 'Tomas', 'CR');

-- INSERT INTO Aposento (id, nombre_cuarto, id_cliente)
-- VALUES (1, 'sala', 1);

-- INSERT INTO Aposento (id, nombre_cuarto, id_cliente)
-- VALUES (2, 'cocina', 1);

-- INSERT INTO Aposento (id, nombre_cuarto, id_cliente)
-- VALUES (3, 'cuarto', 1);

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
-- VALUES (3, false, '2021-05-09 21:19:21.000', 'Bombillo3000', null);

-- INSERT INTO Dispositivo_adquirido (n_serie, prendido, fecha_prendido, modelo, id_aposento)
-- VALUES (4, false, '2021-05-09 21:20:06.000', 'Socket3000', null);