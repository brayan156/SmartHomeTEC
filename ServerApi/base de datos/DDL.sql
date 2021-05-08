create table Regiones(
    pais varchar (20) unique not null,
    continente varchar(15) not null,
    primary key (pais)
);

create table Tipo(
  nombre varchar(15) unique not null,
  tiempo_de_garantia int not null,
  imagen varchar(200),
  descripcion varchar (50),
  PRIMARY KEY (nombre)
);
create table Dispositivo_modelo(
  modelo varchar(15) unique not null,
  marca varchar(15),
  imagen varchar(200),
  consumo_electrico int not null,
  tipo varchar(15),
  PRIMARY KEY (modelo),
  foreign key (tipo) references Tipo(nombre)
);

create table Distribuidor(
  cedula_juridica int unique not null,
  pais varchar(20) not null,
  nombre varchar(15) not null,
  imagen varchar(200) not null,
  PRIMARY KEY (cedula_juridica),
  foreign key (pais) references Regiones (pais)
);

create table Dispositivo_se_vende_en (
    cj_distribuidor int not null,
    modelo_dispotivo varchar(15) not null,
    precio int not null,
    cantidad int not null,
    primary key (cj_distribuidor,modelo_dispotivo),
    foreign key (cj_distribuidor) references Distribuidor(cedula_juridica),
    foreign key (modelo_dispotivo) references Dispositivo_modelo(modelo)
);

create table Cliente(
    id int unique not null,
    email varchar(20) not null,
    contrasena varchar(15) not null,
    primer_apellido varchar (15),
    segundo_apellido varchar(15),
    nombre varchar(15) not null ,
    pais varchar(20) not null,
    PRIMARY KEY (id),
    foreign key (pais) references Regiones (pais)
);



create table Aposento(
  id serial not null,
  nombre_cuarto varchar(20) not null,
  id_cliente int not null,
  primary key (id),
  foreign key (id_cliente) references Cliente (id)
);

create table Dispositivo_adquirido (
    n_serie serial unique not null,
    prendido boolean  default false,
    fecha_prendido timestamp,
    modelo varchar(15) not null,
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
  n_historial serial not null,
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
  contrasena varchar(15) not null,
  email varchar(20) unique not null ,
  PRIMARY KEY (id)
);





create table direccion_entrega (
    direccion_entrega varchar(20) not null,
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