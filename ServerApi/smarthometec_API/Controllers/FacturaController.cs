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
    public class FacturaController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public FacturaController(resthometecdatabaseContext context)
        {
            _context = context;
        }

        /**
       * Funcion Get de Factura
       * @returns una lista con todos los registros de Factura
*/
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Factura>>> GetFactura()
        {
            return await _context.Factura.ToListAsync();
        }
        /**
      * Funcion Get de Factura con parametros de filtro
      * @param id de Factura
        * @returns registro de Administrador que contengan el valor del
       * atributo
*/
        [HttpGet("{id}")]
        public async Task<ActionResult<Factura>> GetFactura(int id)
        {
            var factura = await _context.Factura.FindAsync(id);

            if (factura == null)
            {
                return NotFound();
            }

            return factura;
        }

        /**
      * Funcion Put de Factura para editar
      * @param id,Factura
        * @returns una accion del caso sucedido al editar
*/

        [HttpPut("{id}")]
        public async Task<IActionResult> PutFactura(int id, Factura factura)
        {
            if (id != factura.NFactura)
            {
                return BadRequest();
            }

            _context.Entry(factura).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FacturaExists(id))
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
      * Funcion Post para agregar un Factura
      * @param Factura
        * @returns una accion del caso sucedido al crear o el Factura creado
*/
        [HttpPost]
        public async Task<ActionResult<Factura>> PostFactura(Factura factura)
        {
            _context.Factura.Add(factura);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFactura", new { id = factura.NFactura }, factura);
        }
        /**
      * Funcion Delete para eliminar un Factura
      * @param id
        * @returns una accion del caso sucedido al eliminar o el Factura eliminado
*/
        [HttpDelete("{id}")]
        public async Task<ActionResult<Factura>> DeleteFactura(int id)
        {
            var factura = await _context.Factura.FindAsync(id);
            if (factura == null)
            {
                return NotFound();
            }

            _context.Factura.Remove(factura);
            await _context.SaveChangesAsync();

            return factura;
        }

        private bool FacturaExists(int id)
        {
            return _context.Factura.Any(e => e.NFactura == id);
        }
    }
}
