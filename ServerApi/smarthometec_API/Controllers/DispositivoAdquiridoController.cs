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
    public class DispositivoAdquiridoController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public DispositivoAdquiridoController(resthometecdatabaseContext context)
        {
            _context = context;
        }

        // GET: api/DispositivoAdquirido
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DispositivoAdquirido>>> GetDispositivoAdquirido()
        {
            return await _context.DispositivoAdquirido.ToListAsync();
        }

        // GET: api/DispositivoAdquirido/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DispositivoAdquirido>> GetDispositivoAdquirido(int id)
        {
            var dispositivoAdquirido = await _context.DispositivoAdquirido.FindAsync(id);

            if (dispositivoAdquirido == null)
            {
                return NotFound();
            }

            return dispositivoAdquirido;
        }

        // PUT: api/DispositivoAdquirido/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDispositivoAdquirido(int id, DispositivoAdquirido dispositivoAdquirido)
        {
            if (id != dispositivoAdquirido.NSerie)
            {
                return BadRequest();
            }

            _context.Entry(dispositivoAdquirido).State = EntityState.Modified;
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DispositivoAdquiridoExists(id))
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

        // POST: api/DispositivoAdquirido
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<DispositivoAdquirido>> PostDispositivoAdquirido(DispositivoAdquirido dispositivoAdquirido)
        {
            _context.DispositivoAdquirido.Add(dispositivoAdquirido);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDispositivoAdquirido", new { id = dispositivoAdquirido.NSerie }, dispositivoAdquirido);
        }

        // DELETE: api/DispositivoAdquirido/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<DispositivoAdquirido>> DeleteDispositivoAdquirido(int id)
        {
            var dispositivoAdquirido = await _context.DispositivoAdquirido.FindAsync(id);
            if (dispositivoAdquirido == null)
            {
                return NotFound();
            }

            _context.DispositivoAdquirido.Remove(dispositivoAdquirido);
            await _context.SaveChangesAsync();

            return dispositivoAdquirido;
        }

        private bool DispositivoAdquiridoExists(int id)
        {
            return _context.DispositivoAdquirido.Any(e => e.NSerie == id);
        }
    }
}
