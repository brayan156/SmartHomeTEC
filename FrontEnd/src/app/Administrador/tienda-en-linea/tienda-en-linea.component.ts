import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import {ServiciosService} from '../../servicios.service';
import {DispositivoSeVendeEn} from '../../Comunicacion/dispositivo-se-vende-en';

@Component({
  selector: 'app-tienda-en-linea',
  templateUrl: './tienda-en-linea.component.html',
  styleUrls: ['./tienda-en-linea.component.css']
})

export class TiendaEnLineaComponent implements OnInit {

  ListadispositivosSeVendenEn: DispositivoSeVendeEn[] = [];
  listaDispositivosSeVendenEnBaseDatos: DispositivoSeVendeEn[] = [];
  // tslint:disable-next-line:new-parens
  dispositivosSeVendenEn: DispositivoSeVendeEn = new DispositivoSeVendeEn();
  data: [][];

  dispositivoActual: DispositivoSeVendeEn = new DispositivoSeVendeEn();
  constructor(private service: ServiciosService) {
  }
  ngOnInit(): void {
    this.service.getDispositivosSeVende().subscribe(lista => this.ListadispositivosSeVendenEn = lista);
  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);

    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];

      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      console.log(ws);

      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

      let x = this.data.slice(1);
      console.log(x);
      this.ListadispositivosSeVendenEn = [];
      this.asociarDispositivos();
    };

    reader.readAsBinaryString(target.files[0]);
  }

  public asociarDispositivos(): void{
    this.data = this.data.slice(1);
    this.data.forEach(i => {
      this.dispositivosSeVendenEn = new DispositivoSeVendeEn();
      this.dispositivosSeVendenEn.cjDistribuidor = i.slice(0, 1)[0];
      this.dispositivosSeVendenEn.modeloDispotivo = i.slice(1, 2)[0];
      this.dispositivosSeVendenEn.precio = i.slice(2, 3)[0];
      this.dispositivosSeVendenEn.cantidad = i.slice(3, 4)[0];
      console.log(this.dispositivosSeVendenEn);
      this.ListadispositivosSeVendenEn.push(this.dispositivosSeVendenEn);
    });
  }

  // tslint:disable-next-line:typedef
  public guardardatos() {
    try {
      this.service.guardardatosexcel(this.ListadispositivosSeVendenEn).subscribe(r => {
        console.log(r);
        this.ngOnInit();
      });
    } catch (e){
      alert('Error en datos ingresados');
    }

  }

  public itemActual(itemActual: DispositivoSeVendeEn): void{
    this.dispositivoActual = itemActual;
  }
  public editarDispositvo(item: DispositivoSeVendeEn): void{
    console.log(this.ListadispositivosSeVendenEn);
  }

  public eliminarDispositivo(item: DispositivoSeVendeEn): void{
    // tslint:disable-next-line:prefer-for-of
     for (let i = 0; i < this.ListadispositivosSeVendenEn.length; i++){
       // tslint:disable-next-line:no-unused-expression max-line-length
       // tslint:disable-next-line:max-line-length
       if (this.ListadispositivosSeVendenEn[i].cjDistribuidor === item.cjDistribuidor && this.ListadispositivosSeVendenEn[i].modeloDispotivo === item.modeloDispotivo){
         console.log(i);
         this.ListadispositivosSeVendenEn.splice(i , 1);
       }
       console.log(this.ListadispositivosSeVendenEn);
     }
  }
}
