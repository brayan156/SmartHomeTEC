using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using smarthometec_API.Modelos;

namespace smarthometec_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AposentoController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public AposentoController(resthometecdatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Aposento
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Aposento>>> GetAposento()
        {
            return await _context.Aposento.ToListAsync();
        }

        // GET: api/Aposento/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Aposento>> GetAposento(int id)
        {
            var aposento = await _context.Aposento.FindAsync(id);

            if (aposento == null)
            {
                return NotFound();
            }

            return aposento;
        }

        // PUT: api/Aposento/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAposento(int id, Aposento aposento)
        {
            if (id != aposento.Id)
            {
                return BadRequest();
            }

            _context.Entry(aposento).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AposentoExists(id))
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

        // POST: api/Aposento
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Aposento>> PostAposento(Aposento aposento)
        {
            _context.Aposento.Add(aposento);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAposento", new { id = aposento.Id }, aposento);
        }


        [HttpPost("Default")]
        public async Task<IActionResult> PostAposento(int idCliente)
        {
            string[] aposentos_nombre = {"dormitorio","cocina","sala","comedor"};
            foreach (var aposento_nombre in aposentos_nombre)
            {
                Aposento aposento = new Aposento();
                aposento.NombreCuarto = aposento_nombre;
                aposento.IdCliente = idCliente;
                _context.Aposento.Add(aposento);
            }

            await _context.SaveChangesAsync();

            return Ok("creados");
        }


        // DELETE: api/Aposento/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Aposento>> DeleteAposento(int id)
        {
            var aposento = await _context.Aposento.FindAsync(id);
            if (aposento == null)
            {
                return NotFound();
            }

            _context.Aposento.Remove(aposento);
            await _context.SaveChangesAsync();

            return aposento;
        }

        private bool AposentoExists(int id)
        {
            return _context.Aposento.Any(e => e.Id == id);
        }
    }
}
