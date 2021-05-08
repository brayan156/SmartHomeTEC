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

        // GET: api/Historial
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Historial>>> GetHistorial()
        {
            return await _context.Historial.ToListAsync();
        }

        // GET: api/Historial/5
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

        // PUT: api/Historial/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
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

        // POST: api/Historial
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Historial>> PostHistorial(Historial historial)
        {
            _context.Historial.Add(historial);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHistorial", new { id = historial.NHistorial }, historial);
        }

        // DELETE: api/Historial/5
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
