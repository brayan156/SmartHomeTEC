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
    public class RegionesController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public RegionesController(resthometecdatabaseContext context)
        {
            _context = context;
        }

        /**
       * Funcion Get de Regiones
       * @returns una lista con todos los registros de Regiones
*/
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Regiones>>> GetRegiones()
        {
            return await _context.Regiones.ToListAsync();
        }


        /**
      * Funcion Get de Regiones con parametros de filtro
      * @param id de Regiones
        * @returns registro de Regiones que contengan el valor del
       * atributo
*/
        [HttpGet("{id}")]
        public async Task<ActionResult<Regiones>> GetRegiones(string id)
        {
            var regiones = await _context.Regiones.FindAsync(id);

            if (regiones == null)
            {
                return NotFound();
            }

            return regiones;
        }

        /**
      * Funcion Put de Regiones
      * @param id,Regiones
        * @returns una accion del caso sucedido al editar
*/
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRegiones(string id, Regiones regiones)
        {
            if (id != regiones.Pais)
            {
                return BadRequest();
            }

            _context.Entry(regiones).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RegionesExists(id))
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
      * Funcion Post para agregar un Regiones
      * @param Region
        * @returns una accion del caso sucedido al crear o el adminstrador creado
*/
        [HttpPost]
        public async Task<ActionResult<Regiones>> PostRegiones(Regiones regiones)
        {
            _context.Regiones.Add(regiones);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RegionesExists(regiones.Pais))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetRegiones", new { id = regiones.Pais }, regiones);
        }

        /**
      * Funcion Delete para eliminar un Regiones
      * @param pais de Regiones
        * @returns una accion del caso sucedido al eliminar o el Regiones eliminado
*/
        [HttpDelete("{id}")]
        public async Task<ActionResult<Regiones>> DeleteRegiones(string id)
        {
            var regiones = await _context.Regiones.FindAsync(id);
            if (regiones == null)
            {
                return NotFound();
            }

            _context.Regiones.Remove(regiones);
            await _context.SaveChangesAsync();

            return regiones;
        }

        private bool RegionesExists(string id)
        {
            return _context.Regiones.Any(e => e.Pais == id);
        }
    }
}
