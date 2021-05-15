using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using smarthometec_API.Modelos;

namespace smarthometec_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CertificadoGarantiaController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public CertificadoGarantiaController(resthometecdatabaseContext context)
        {
            _context = context;
        }
        /**
       * Funcion Get de GetCertificadoGarantia
       * @returns una lista con todos los registros de CertificadoGarantia
*/
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CertificadoGarantia>>> GetCertificadoGarantia()
        {
            return await _context.CertificadoGarantia.ToListAsync();
        }



        /**
      * Funcion para obtener el tiempo restante de garantía
      * @param nserie del dispositivo
        * @returns numero enteros con los meses restantes para que se acabe la garantia
*/
        [HttpGet("tiempo_restante/{nserie}")]
        public   int gettiempo(int nserie)
        {
            var pedido =  _context.Pedido.First(p=>p.NSerieDispositivo==nserie);
            var pfactura = _context.PedidoFactura.First(pf => pf.IdPedido == pedido.Id);
            var factura= _context.Factura.First(f => f.NFactura == pfactura.NFactura);
            var garantia= _context.CertificadoGarantia.First(f => f.NFactura == factura.NFactura);
            var fechafinal = new DateTime(garantia.AnoFinGarantia,garantia.MesFinGarantia,factura.Dia.Value);
            var mesesrestantes = ((fechafinal.Year - DateTime.Now.Year) * 12) + fechafinal.Month - DateTime.Now.Month;

            if (mesesrestantes < 0)
            {
                return 0;
            }

            return mesesrestantes;
        }


        /**
      * Funcion Put de CertificadoGarantia
      * @param id,CertificadoGarantia
        * @returns una accion del caso sucedido al editar
*/

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCertificadoGarantia(int id, CertificadoGarantia certificadoGarantia)
        {
            if (id != certificadoGarantia.NFactura)
            {
                return BadRequest();
            }

            _context.Entry(certificadoGarantia).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CertificadoGarantiaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        /**
       * Funcion Post para agregar un CertificadoGarantia
       * @param CertificadoGarantia
         * @returns una accion del caso sucedido al crear o el CertificadoGarantia creado
*/
        [HttpPost]
        public async Task<ActionResult<CertificadoGarantia>> PostCertificadoGarantia(CertificadoGarantia certificadoGarantia)
        {
            _context.CertificadoGarantia.Add(certificadoGarantia);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CertificadoGarantiaExists(certificadoGarantia.NFactura))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetCertificadoGarantia", new { id = certificadoGarantia.NFactura }, certificadoGarantia);
        }

        /**
      * Funcion Delete para eliminar un CertificadoGarantia
      * @param id
        * @returns una accion del caso sucedido al eliminar o el CertificadoGarantia eliminado
*/
        [HttpDelete("{id}")]
        public async Task<ActionResult<CertificadoGarantia>> DeleteCertificadoGarantia(int id)
        {
            var certificadoGarantia = await _context.CertificadoGarantia.FindAsync(id);
            if (certificadoGarantia == null)
            {
                return NotFound();
            }

            _context.CertificadoGarantia.Remove(certificadoGarantia);
            await _context.SaveChangesAsync();

            return certificadoGarantia;
        }

        private bool CertificadoGarantiaExists(int id)
        {
            return _context.CertificadoGarantia.Any(e => e.NFactura == id);
        }
    }
}
