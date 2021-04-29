import { ClienteEntregaEn } from "./cliente_entrega_en";
import { Dispositivo } from "./dispositivo";

export class Cliente {
  N_cliente: number;
  email: string;
  password: string;
  primer_apellido: string;
  segundo_apellido: string;
  nombre: string;
  dispositivos_activos: Dispositivo[];
  continente: string;
  pais: string;
  direcciones_entrega: ClienteEntregaEn[];
  total_dispositivos: number;
  img: string;
}