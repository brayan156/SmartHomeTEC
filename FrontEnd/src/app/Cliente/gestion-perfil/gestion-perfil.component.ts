import { Component, OnInit } from '@angular/core';
import {Cliente} from '../../Comunicacion/cliente';
import {ServiciosService} from '../../servicios.service';
import {ClienteEntregaEn} from '../../Comunicacion/cliente-entrega-en';
import {NgModel} from '@angular/forms';
import {Regiones} from '../../Comunicacion/regiones';

@Component({
  selector: 'app-gestion-perfil',
  templateUrl: './gestion-perfil.component.html',
  styleUrls: ['./gestion-perfil.component.css']
})
export class GestionPerfilComponent implements OnInit {

  constructor(private service: ServiciosService ) { }

  // tslint:disable-next-line:new-parens
  cliente: Cliente = new Cliente;
  // tslint:disable-next-line:new-parens
  newCliente: Cliente = new Cliente;
  // tslint:disable-next-line:new-parens
  direccionEntrega: ClienteEntregaEn = new ClienteEntregaEn;
  dirrecionesEntrega: ClienteEntregaEn[] = [];


  listaDeRegiones: Regiones[] = [] ;

  /**
   * Recargan los datos del componete gertion de perfil para que estos se visualicen dentro del HTML
   */
  ngOnInit(): void {
    this.cliente = this.service.cliente;
    this.service.getCliente().subscribe(clienteAux =>
    {this.cliente = clienteAux;
     this.service.leerDirrecionEntrega(this.cliente.id).subscribe(lista => {this.dirrecionesEntrega = lista ;
                                                                            console.log(this.dirrecionesEntrega); });
     this.service.getRegiones().subscribe(lista => {this.listaDeRegiones = lista;
                                                    console.log(lista);
      });
    });

    console.log(this.cliente);
    console.log(this.dirrecionesEntrega);
  }

  /**
   * Imprime el primerApellido del cliente
   */
  public prueba(): void{
  console.log(this.cliente.primerApellido);
  }

  /**
   * Anande una nueva dirreccion de entrega
   * @param direccionEntrega
   */
  // tslint:disable-next-line:typedef
  anadirUbicacion(direccionEntrega: ClienteEntregaEn){
    if (direccionEntrega.direccionEntrega1 !== ''){
      direccionEntrega.idCliente = this.cliente.id;
      this.service.crearDirrecionEntrega(direccionEntrega).subscribe(c => console.log(c));
    }else{
      console.log('Valor nulo');
    }
  }

  /**
   * Funciones para editar las direferntes variables en la base de datos
   */
  public editarClienteNombre(): void {
    this.cliente.nombre = this.newCliente.nombre;
    this.service.editarCliente(this.cliente.id, this.cliente).subscribe( a => console.log(a));
  }
  /**
   * Funciones para editar las direferntes variables en la base de datos
   */
  public editarClienteApellido(): void{
    this.cliente.primerApellido = this.newCliente.primerApellido;
    this.service.editarCliente(this.cliente.id, this.cliente).subscribe( a => console.log(a));
  }
  /**
   * Funciones para editar las direferntes variables en la base de datos
   */
  public editarClienteApellido2(): void{
    this.cliente.segundoApellido = this.newCliente.segundoApellido;
    this.service.editarCliente(this.cliente.id, this.cliente).subscribe( a => console.log(a));
  }
  /**
   * Funciones para editar las direferntes variables en la base de datos
   */
  public editarClienteContrasena(): void{
    this.cliente.contrasena = this.newCliente.contrasena;
    this.service.editarCliente(this.cliente.id, this.cliente).subscribe( a => console.log(a));
  }
  /**
   * Funciones para editar las direferntes variables en la base de datos
   */
  public editarClientePais(): void{
    this.cliente.pais = this.newCliente.pais;
    this.service.editarCliente(this.cliente.id, this.cliente).subscribe( a => console.log(a));
  }
}
