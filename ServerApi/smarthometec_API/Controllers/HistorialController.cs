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
    public class HistorialController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public HistorialController(resthometecdatabaseContext context)
        {
            _context = context;
        }

        /**
       * Funcion Get de Historial
       * @returns una lista con todos los registros de AdmiHistorialnistrador
*/
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Historial>>> GetHistorial()
        {
            return await _context.Historial.ToListAsync();
        }

        /**
      * Funcion Get de Administrador con parametros de filtro
      * @param id_carrito,n_compra
        * @returns registro de Administrador que contengan el valor del
       * atributo
*/
        [HttpGet("{id}")]
        public async Task<ActionResult<Historial>> GetHistorial(int id)
        {
            var historial = await _context.Historial.FindAsync(id);

            if (historial == null)
            {
                return NotFound();
            }

            return historial;
        }

        /**
      * Funcion Put de Historial para editar
      * @param id,Historial
        * @returns una accion del caso sucedido al editar
*/
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHistorial(int id, Historial historial)
        {
            if (id != historial.NHistorial)
            {
                return BadRequest();
            }

            _context.Entry(historial).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HistorialExists(id))
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
      * Funcion Post para agregar un Historial
      * @param Historial
        * @returns una accion del caso sucedido al crear o el Historial creado
*/
        [HttpPost]
        public async Task<ActionResult<Historial>> PostHistorial(Historial historial)
        {
            _context.Historial.Add(historial);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHistorial", new { id = historial.NHistorial }, historial);
        }

        /**
      * Funcion Delete para eliminar un Historial
      * @param id
        * @returns una accion del caso sucedido al eliminar o el Historial eliminado
*/
        [HttpDelete("{id}")]
        public async Task<ActionResult<Historial>> DeleteHistorial(int id)
        {
            var historial = await _context.Historial.FindAsync(id);
            if (historial == null)
            {
                return NotFound();
            }

            _context.Historial.Remove(historial);
            await _context.SaveChangesAsync();

            return historial;
        }

        private bool HistorialExists(int id)
        {
            return _context.Historial.Any(e => e.NHistorial == id);
        }
    }
}
