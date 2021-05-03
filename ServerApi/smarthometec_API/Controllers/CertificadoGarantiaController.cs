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
    public class CertificadoGarantiaController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public CertificadoGarantiaController(resthometecdatabaseContext context)
        {
            _context = context;
        }

        // GET: api/CertificadoGarantia
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CertificadoGarantia>>> GetCertificadoGarantia()
        {
            return await _context.CertificadoGarantia.ToListAsync();
        }

        // GET: api/CertificadoGarantia/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CertificadoGarantia>> GetCertificadoGarantia(int id)
        {
            var certificadoGarantia = await _context.CertificadoGarantia.FindAsync(id);

            if (certificadoGarantia == null)
            {
                return NotFound();
            }

            return certificadoGarantia;
        }

        // PUT: api/CertificadoGarantia/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCertificadoGarantia(int id, CertificadoGarantia certificadoGarantia)
        {
            if (id != certificadoGarantia.NFactura)
            {
                return BadRequest();
            }

            _context.Entry(certificadoGarantia).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CertificadoGarantiaExists(id))
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

        // POST: api/CertificadoGarantia
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<CertificadoGarantia>> PostCertificadoGarantia(CertificadoGarantia certificadoGarantia)
        {
            _context.CertificadoGarantia.Add(certificadoGarantia);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CertificadoGarantiaExists(certificadoGarantia.NFactura))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetCertificadoGarantia", new { id = certificadoGarantia.NFactura }, certificadoGarantia);
        }

        // DELETE: api/CertificadoGarantia/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<CertificadoGarantia>> DeleteCertificadoGarantia(int id)
        {
            var certificadoGarantia = await _context.CertificadoGarantia.FindAsync(id);
            if (certificadoGarantia == null)
            {
                return NotFound();
            }

            _context.CertificadoGarantia.Remove(certificadoGarantia);
            await _context.SaveChangesAsync();

            return certificadoGarantia;
        }

        private bool CertificadoGarantiaExists(int id)
        {
            return _context.CertificadoGarantia.Any(e => e.NFactura == id);
        }
    }
}
