create table Regiones(
    pais varchar (60) unique not null,
    continente varchar(30) not null,
    primary key (pais)
);

create table Tipo(
  nombre varchar(50) unique not null,
  tiempo_de_garantia int not null,
  imagen varchar,
  descripcion varchar (400),
  PRIMARY KEY (nombre)
);
create table Dispositivo_modelo(
  modelo varchar(50) unique not null,
  marca varchar(50),
  imagen varchar,
  consumo_electrico int not null,
  tipo varchar(50),
  PRIMARY KEY (modelo),
  foreign key (tipo) references Tipo(nombre)
);

create table Distribuidor(
  cedula_juridica int unique not null,
  pais varchar(60) not null,
  nombre varchar(50) not null,
  imagen varchar not null,
  PRIMARY KEY (cedula_juridica),
  foreign key (pais) references Regiones (pais)
);

create table Dispositivo_se_vende_en (
    cj_distribuidor int not null,
    modelo_dispotivo varchar(50) not null,
    precio int not null,
    cantidad int not null,
    primary key (cj_distribuidor,modelo_dispotivo),
    foreign key (cj_distribuidor) references Distribuidor(cedula_juridica),
    foreign key (modelo_dispotivo) references Dispositivo_modelo(modelo)
);

create table Cliente(
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



create table Aposento(
  id serial unique,
  nombre_cuarto varchar(50) not null,
  id_cliente int not null,
  primary key (id,id_cliente),
  foreign key (id_cliente) references Cliente (id)
);

create table Dispositivo_adquirido (
    n_serie serial unique,
    prendido boolean  default false,
    fecha_prendido timestamp,
    modelo varchar(50) not null,
    id_aposento int,
    primary key (n_serie),
    foreign key (modelo) references Dispositivo_modelo(modelo),
    foreign key (id_aposento) references Aposento(id)
);

create table Cliente_ha_usado(
    n_serie_dispositivo int not null,
    id_cliente int not null,
    propietario_actual boolean default true,
    primary key (n_serie_dispositivo,id_cliente),
    foreign key (n_serie_dispositivo) references Dispositivo_adquirido (n_serie),
    foreign key (id_cliente) references Cliente(id)
);

create table Historial(
  n_historial serial,
  n_serie int not null,
  dia int default extract( day from current_date ),
  mes int default extract( month from current_date ),
  ano int default extract( year from current_date ),
  hora int,
  minutos_de_uso int default 0,
  primary key (n_historial,n_serie),
  foreign key (n_serie) references Dispositivo_adquirido (n_serie)
);

create table Administrador(
  id int unique not null,
  contrasena varchar(20) not null,
  email varchar(50) unique not null ,
  PRIMARY KEY (id)
);





create table direccion_entrega (
    direccion_entrega varchar(500) not null,
    id_cliente int not null,
    primary key (direccion_entrega,id_cliente),
    foreign key (id_cliente) references Cliente(id)
);

create table Pedido(
    id serial unique not null,
    monto int not null,
    id_cliente int not null,
    n_serie_dispositivo int not null,
    primary key (id),
    foreign key (id_cliente) references Cliente(id),
    foreign key (n_serie_dispositivo) references Dispositivo_adquirido(n_serie)
             );



create table Factura(
    n_factura serial unique not null,
     dia int  default extract( day from current_date ),
     mes int  default extract( month from current_date ),
     ano int default extract( year from current_date ),
    PRIMARY KEY (n_factura)
);

create table Pedido_Factura(
  id_pedido int unique not null,
  n_factura int unique not null,
  PRIMARY KEY (id_pedido,n_factura),
  foreign key (id_pedido) references Pedido(id),
  foreign key (n_factura) references Factura(n_factura)
);
create table Certificado_garantia(
    n_factura int unique not null,
    mes_fin_garantia int not null,
    ano_fin_garantia int not null,
    primary key (n_factura,mes_fin_garantia,ano_fin_garantia),
    foreign key (n_factura) references Factura(n_factura)
)