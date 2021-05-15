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
    public class PedidoFacturaController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public PedidoFacturaController(resthometecdatabaseContext context)
        {
            _context = context;
        }

        /**
       * Funcion Get de PedidoFactura
       * @returns una lista con todos los registros de PedidoFactura
*/
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PedidoFactura>>> GetPedidoFactura()
        {
            return await _context.PedidoFactura.ToListAsync();
        }


        /**
      * Funcion Get de PedidoFactura con parametros de filtro
      * @param id_carrito,n_compra
        * @returns registro de PedidoFactura que contenga el valor del
       * atributo
*/
        [HttpGet("{id}")]
        public async Task<ActionResult<PedidoFactura>> GetPedidoFactura(int id)
        {
            var pedidoFactura = await _context.PedidoFactura.FindAsync(id);

            if (pedidoFactura == null)
            {
                return NotFound();
            }

            return pedidoFactura;
        }

        /**
      * Funcion Put de PedidoFactura
      * @param id,PedidoFactura
        * @returns una accion del caso sucedido al editar
*/
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPedidoFactura(int id, PedidoFactura pedidoFactura)
        {
            if (id != pedidoFactura.IdPedido)
            {
                return BadRequest();
            }

            _context.Entry(pedidoFactura).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PedidoFacturaExists(id))
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
      * Funcion Post para agregar un PedidoFactura
      * @param PedidoFactura
        * @returns una accion del caso sucedido al crear o el PedidoFactura creado
*/
        [HttpPost]
        public async Task<ActionResult<PedidoFactura>> PostPedidoFactura(PedidoFactura pedidoFactura)
        {
            _context.PedidoFactura.Add(pedidoFactura);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PedidoFacturaExists(pedidoFactura.IdPedido))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPedidoFactura", new { id = pedidoFactura.IdPedido }, pedidoFactura);
        }

        /**
      * Funcion Delete para eliminar un PedidoFactura
      * @param id
        * @returns una accion del caso sucedido al eliminar o el PedidoFactura eliminado
*/
        [HttpDelete("{id}")]
        public async Task<ActionResult<PedidoFactura>> DeletePedidoFactura(int id)
        {
            var pedidoFactura = await _context.PedidoFactura.FindAsync(id);
            if (pedidoFactura == null)
            {
                return NotFound();
            }

            _context.PedidoFactura.Remove(pedidoFactura);
            await _context.SaveChangesAsync();

            return pedidoFactura;
        }

        private bool PedidoFacturaExists(int id)
        {
            return _context.PedidoFactura.Any(e => e.IdPedido == id);
        }
    }
}
