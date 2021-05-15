using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using smarthometec_API.Modelos;

namespace smarthometec_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AposentoController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public AposentoController(resthometecdatabaseContext context)
        {
            _context = context;
        }
        /**
       * Funcion Get de Aposento
       * @returns una lista con todos los registros de Aposento
*/
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Aposento>>> GetAposento()
        {
            return await _context.Aposento.ToListAsync();
        }

        /**
      * Funcion Get de Aposento con parametros de filtro
      * @param id del aposento
        * @returns una lista con todos los registros de Aposento que contengan el valor de los
       * atributos de los parametros
*/
        [HttpGet("{id}")]
        public async Task<ActionResult<Aposento>> GetAposento(int id)
        {
            var aposento = await _context.Aposento.FindAsync(id);

            if (aposento == null)
            {
                return NotFound();
            }

            return aposento;
        }


        /**
      * Funcion para obtener el tiempo restante de garantía
      * @param nserie del dispositivo
        * @returns numero enteros con los meses restantes para que se acabe la garantia
*/
        public int gettiempo(int nserie)
        {
            var pedido = _context.Pedido.First(p => p.NSerieDispositivo == nserie);
            var pfactura = _context.PedidoFactura.First(pf => pf.IdPedido == pedido.Id);
            var factura = _context.Factura.First(f => f.NFactura == pfactura.NFactura);
            var garantia = _context.CertificadoGarantia.First(f => f.NFactura == factura.NFactura);
            var fechafinal = new DateTime(garantia.AnoFinGarantia, garantia.MesFinGarantia, factura.Dia.Value);
            var mesesrestantes = ((fechafinal.Year - DateTime.Now.Year) * 12) + fechafinal.Month - DateTime.Now.Month;

            if (mesesrestantes < 0)
            {
                return 0;
            }

            return mesesrestantes;
        }





        /**
* Funcion Get que obtienes los dispositivos de un aposento
* @param id del aposento
* @returns una lista con todos los dispositivos del aposento con el tiempo restante de garantia y otras caracteristicas
*/

        [HttpGet("dispositivos/{id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> Getdispositivos(int id)
        {
            var dipositivos = _context.DispositivoAdquirido.Where(cu => cu.IdAposento == id);
            var dis_modelo = dipositivos.Join(_context.DispositivoModelo, d => d.Modelo, m => m.Modelo, (d, m) => new
            { d, m });
            List<dynamic> lista = new List<dynamic>();

            dis_modelo.ToList().ForEach(dm => {
                var meses = this.gettiempo(dm.d.NSerie);
                var mesfin = meses - meses / 12;
                var anofin = meses / 12;
                var dmh = new { modelo = dm.m.Modelo, marca = dm.m.Marca, consumoElectrico = dm.m.ConsumoElectrico, tipo = dm.m.Tipo, imagen = dm.m.Imagen, n_serie = dm.d.NSerie, prendido = dm.d.Prendido, mes_fin_garantia = meses, ano_fin_garantia = anofin };
                lista.Add(dmh);
            });


            if (dipositivos == null)
            {
                return NotFound();
            }

            return lista;
        }

        /**
* Funcion Get de Aposento con parametros de filtro
* @param id del cliente
* @returns una lista con todos los registros de Aposento que contengan el valor de los
* atributos de los parametros
*/
        [HttpGet("aposentoscliente/{idcliente}")]
        public async Task<ActionResult<IEnumerable<Aposento>>> GetAposentocliente(int idcliente)
        {
            var aposento = await _context.Aposento.Where(a=>a.IdCliente==idcliente).ToListAsync();

            if (aposento == null)
            {
                return NotFound();
            }

            return aposento;
        }

        /**
* Funcion Put de Aposento
* @param id,Aposento
* @returns una accion del caso sucedido al editar
*/
        [HttpPut("{id}")]
        public async Task<string> PutAposento(int id, Aposento aposento)
        {
            if (id != aposento.Id)
            {
                return "aposento incorrecto";
            }

            if (_context.Aposento.Any(a => a.IdCliente == aposento.IdCliente & a.NombreCuarto == aposento.NombreCuarto))
            {
                return "ya existe aposento";
            }

            _context.Entry(aposento).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AposentoExists(id))
                {
                    return "aposento no existe";
                }
                else
                {
                    return "datos invalidos";
                }
            }

            return "aposento editado";
        }


        /**
      * Funcion Post para agregar un Aposento
      * @param Aposento
        * @returns una accion del caso sucedido al editar o el Aposento 
*/
        [HttpPost]
        public async Task<string> PostAposento(Aposento aposento)
        {

            if (_context.Aposento.Any(a => a.IdCliente == aposento.IdCliente & a.NombreCuarto == aposento.NombreCuarto))
            {
                return "ya existe aposento";
            }

            _context.Aposento.Add(aposento);
            await _context.SaveChangesAsync();

            return "aposento creado";
        }

        /**
* Funcion Post para agregar los aposentos por default del cliente
* @param id del cliente
* @returns una accion del caso sucedido al crear el Aposento 
*/
        [HttpGet("Default/{idCliente}")]
        public async Task<IActionResult> PostAposento(int idCliente)
        {
            Debug.WriteLine(idCliente);
            Debug.WriteLine(_context.Cliente.Any(c=> c.Id==idCliente));
            string[] aposentos_nombre = {"dormitorio","cocina","sala","comedor"};
            foreach (var aposento_nombre in aposentos_nombre)
            {
                Aposento aposento = new Aposento();
                aposento.NombreCuarto = aposento_nombre;
                aposento.IdCliente = idCliente;
                _context.Aposento.Add(aposento);
            }

            await _context.SaveChangesAsync();

            return Ok("creados");
        }


        /**
      * Funcion Delete para eliminar un Aposento
      * @param id del cliente y del aposento
        * @returns una accion del caso sucedido al eliminar o el adminstrador eliminado
*/
        [HttpDelete("{id}/{idcliente}")]
        public async Task<string> DeleteAposento(int id,int idcliente)
        {
            var aposento =  _context.Aposento.First(a=> a.Id==id & a.IdCliente==idcliente);
            if (aposento == null)
            {
                return "aposento no encontrado";
            }

            _context.Aposento.Remove(aposento);
            await _context.SaveChangesAsync();

            return "dispositivo eliminado";
        }

        private bool AposentoExists(int id)
        {
            return _context.Aposento.Any(e => e.Id == id);
        }
    }
}
