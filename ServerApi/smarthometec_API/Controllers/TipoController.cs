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
    public class TipoController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public TipoController(resthometecdatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Tipo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tipo>>> GetTipo()
        {
            return await _context.Tipo.ToListAsync();
        }

        // GET: api/Tipo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Tipo>> GetTipo(string id)
        {
            var tipo = await _context.Tipo.FindAsync(id);

            if (tipo == null)
            {
                return NotFound();
            }

            return tipo;
        }

        // PUT: api/Tipo/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTipo(string id, Tipo tipo)
        {
            if (id != tipo.Nombre)
            {
                return BadRequest();
            }

            // if (_context.Tipo.Join(_context.DispositivoModelo, tp => tp.Nombre, dm => dm.Tipo,
            //     (tp, dm) => new {tp, dm}).Join(_context.DispositivoAdquirido, td => td.dm.Modelo, da => da.Modelo,
            //     (td, dm) => new { td, dm }).Any())
            // {
            //     return BadRequest("Comprado");
            // }

            _context.Entry(tipo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TipoExists(id))
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

        // POST: api/Tipo
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Tipo>> PostTipo(Tipo tipo)
        {
            _context.Tipo.Add(tipo);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TipoExists(tipo.Nombre))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetTipo", new { id = tipo.Nombre }, tipo);
        }

        // DELETE: api/Tipo/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Tipo>> DeleteTipo(string id)
        {
            var tipo = await _context.Tipo.FindAsync(id);
            if (tipo == null)
            {
                return NotFound();
            }

            if (_context.Tipo.Join(_context.DispositivoModelo, tp => tp.Nombre, dm => dm.Tipo,
                (tp, dm) => new { tp, dm }).Any())
            {
                return BadRequest("Usado");
            }

            _context.Tipo.Remove(tipo);
            await _context.SaveChangesAsync();

            return tipo;
        }

        private bool TipoExists(string id)
        {
            return _context.Tipo.Any(e => e.Nombre == id);
        }
    }
}
