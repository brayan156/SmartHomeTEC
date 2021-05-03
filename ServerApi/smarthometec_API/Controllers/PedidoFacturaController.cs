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

        // GET: api/PedidoFactura
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PedidoFactura>>> GetPedidoFactura()
        {
            return await _context.PedidoFactura.ToListAsync();
        }

        // GET: api/PedidoFactura/5
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

        // PUT: api/PedidoFactura/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
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

        // POST: api/PedidoFactura
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
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

        // DELETE: api/PedidoFactura/5
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
