using System;
using System.Collections.Generic;
using System.Diagnostics;
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
    public class ClienteHaUsadoController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public ClienteHaUsadoController(resthometecdatabaseContext context)
        {
            _context = context;
        }

        // GET: api/ClienteHaUsado
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClienteHaUsado>>> GetClienteHaUsado()
        {
            return await _context.ClienteHaUsado.ToListAsync();
        }

        // GET: api/ClienteHaUsado/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ClienteHaUsado>> GetClienteHaUsado(int id)
        {
            var clienteHaUsado = await _context.ClienteHaUsado.FindAsync(id);

            if (clienteHaUsado == null)
            {
                return NotFound();
            }

            return clienteHaUsado;
        }

        // PUT: api/ClienteHaUsado/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClienteHaUsado(int id, ClienteHaUsado clienteHaUsado)
        {
            if (id != clienteHaUsado.NSerieDispositivo)
            {
                return BadRequest();
            }

            _context.Entry(clienteHaUsado).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteHaUsadoExists(id))
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

        // POST: api/ClienteHaUsado
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<ClienteHaUsado>> PostClienteHaUsado(ClienteHaUsado clienteHaUsado)
        {
            _context.ClienteHaUsado.Add(clienteHaUsado);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ClienteHaUsadoExists(clienteHaUsado.NSerieDispositivo))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetClienteHaUsado", new { id = clienteHaUsado.NSerieDispositivo }, clienteHaUsado);
        }

        // DELETE: api/ClienteHaUsado/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ClienteHaUsado>> DeleteClienteHaUsado(int id)
        {
            var clienteHaUsado = await _context.ClienteHaUsado.FindAsync(id);
            if (clienteHaUsado == null)
            {
                return NotFound();
            }

            _context.ClienteHaUsado.Remove(clienteHaUsado);
            await _context.SaveChangesAsync();

            return clienteHaUsado;
        }

        private bool ClienteHaUsadoExists(int id)
        {
            return _context.ClienteHaUsado.Any(e => e.NSerieDispositivo == id);
        }
    }
}
