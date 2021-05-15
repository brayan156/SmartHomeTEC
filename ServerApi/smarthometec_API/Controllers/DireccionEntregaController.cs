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
    public class DireccionEntregaController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public DireccionEntregaController(resthometecdatabaseContext context)
        {
            _context = context;
        }

        /**
       * Funcion Get de DireccionEntrega
       * @returns una lista con todos los registros de DireccionEntrega
*/
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DireccionEntrega>>> GetDireccionEntrega()
        {
            return await _context.DireccionEntrega.ToListAsync();
        }

        /**
      * Funcion Get de Administrador con parametros de filtro
      * @param id del cliente
        * @returns una lista con todos los registros de Administrador que contengan el valor de los
       * atributos de los parametros
*/
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<DireccionEntrega>>> GetDireccionEntrega(int id)
        {
            var direccionEntrega = await _context.DireccionEntrega.Where(direccion=> direccion.IdCliente==id).ToListAsync();

            if (direccionEntrega == null)
            {
                return NotFound();
            }

            return direccionEntrega;
        }
        /**
      * Funcion Put de DireccionEntrega
      * @param id,DireccionEntrega
        * @returns una accion del caso sucedido al editar
*/
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDireccionEntrega(string id, DireccionEntrega direccionEntrega)
        {
            if (id != direccionEntrega.DireccionEntrega1)
            {
                return BadRequest();
            }

            _context.Entry(direccionEntrega).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DireccionEntregaExists(id))
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
      * Funcion Post para agregar un DireccionEntrega
      * @param DireccionEntrega
        * @returns una accion del caso sucedido al editar o el DireccionEntrega creado
*/
        [HttpPost]
        public async Task<ActionResult<DireccionEntrega>> PostDireccionEntrega(DireccionEntrega direccionEntrega)
        {
            _context.DireccionEntrega.Add(direccionEntrega);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (DireccionEntregaExists(direccionEntrega.DireccionEntrega1))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetDireccionEntrega", new { id = direccionEntrega.DireccionEntrega1 }, direccionEntrega);
        }

        /**
      * Funcion Delete para eliminar un DireccionEntrega
      * @param id
        * @returns una accion del caso sucedido al editar o el DireccionEntrega eliminado
*/
        [HttpDelete("{id}")]
        public async Task<ActionResult<DireccionEntrega>> DeleteDireccionEntrega(string id)
        {
            var direccionEntrega = await _context.DireccionEntrega.FindAsync(id);
            if (direccionEntrega == null)
            {
                return NotFound();
            }

            _context.DireccionEntrega.Remove(direccionEntrega);
            await _context.SaveChangesAsync();

            return direccionEntrega;
        }

        private bool DireccionEntregaExists(string id)
        {
            return _context.DireccionEntrega.Any(e => e.DireccionEntrega1 == id);
        }
    }
}
