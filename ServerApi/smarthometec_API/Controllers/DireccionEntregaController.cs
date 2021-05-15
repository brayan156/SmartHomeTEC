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

        // GET: api/DireccionEntrega
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DireccionEntrega>>> GetDireccionEntrega()
        {
            return await _context.DireccionEntrega.ToListAsync();
        }

        // GET: api/DireccionEntrega/5
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

        // PUT: api/DireccionEntrega/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
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

        // POST: api/DireccionEntrega
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
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

        // DELETE: api/DireccionEntrega/5
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
