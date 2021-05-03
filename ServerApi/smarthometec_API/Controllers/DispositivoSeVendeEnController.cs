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
    public class DispositivoSeVendeEnController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public DispositivoSeVendeEnController(resthometecdatabaseContext context)
        {
            _context = context;
        }

        // GET: api/DispositivoSeVendeEn
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DispositivoSeVendeEn>>> GetDispositivoSeVendeEn()
        {
            return await _context.DispositivoSeVendeEn.ToListAsync();
        }

        // GET: api/DispositivoSeVendeEn/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DispositivoSeVendeEn>> GetDispositivoSeVendeEn(int id)
        {
            var dispositivoSeVendeEn = await _context.DispositivoSeVendeEn.FindAsync(id);

            if (dispositivoSeVendeEn == null)
            {
                return NotFound();
            }

            return dispositivoSeVendeEn;
        }

        // PUT: api/DispositivoSeVendeEn/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDispositivoSeVendeEn(int id, DispositivoSeVendeEn dispositivoSeVendeEn)
        {
            if (id != dispositivoSeVendeEn.CjDistribuidor)
            {
                return BadRequest();
            }

            _context.Entry(dispositivoSeVendeEn).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DispositivoSeVendeEnExists(id))
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

        // POST: api/DispositivoSeVendeEn
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<DispositivoSeVendeEn>> PostDispositivoSeVendeEn(DispositivoSeVendeEn dispositivoSeVendeEn)
        {
            _context.DispositivoSeVendeEn.Add(dispositivoSeVendeEn);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (DispositivoSeVendeEnExists(dispositivoSeVendeEn.CjDistribuidor))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetDispositivoSeVendeEn", new { id = dispositivoSeVendeEn.CjDistribuidor }, dispositivoSeVendeEn);
        }

        // DELETE: api/DispositivoSeVendeEn/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<DispositivoSeVendeEn>> DeleteDispositivoSeVendeEn(int id)
        {
            var dispositivoSeVendeEn = await _context.DispositivoSeVendeEn.FindAsync(id);
            if (dispositivoSeVendeEn == null)
            {
                return NotFound();
            }

            _context.DispositivoSeVendeEn.Remove(dispositivoSeVendeEn);
            await _context.SaveChangesAsync();

            return dispositivoSeVendeEn;
        }

        private bool DispositivoSeVendeEnExists(int id)
        {
            return _context.DispositivoSeVendeEn.Any(e => e.CjDistribuidor == id);
        }
    }
}
