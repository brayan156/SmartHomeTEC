﻿using System;
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
    public class DispositivoModeloController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public DispositivoModeloController(resthometecdatabaseContext context)
        {
            _context = context;
        }

        // GET: api/DispositivoModelo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DispositivoModelo>>> GetDispositivoModelo()
        {
            return await _context.DispositivoModelo.ToListAsync();
        }

        [HttpGet("join")]
        public async Task<ActionResult<IEnumerable<dynamic>>> getjoin()
        {
            //var result = from d in _context.DispositivoModelo
            //    join t in _context.Tipo on d.Tipo equals t.Nombre
            //    select new { d, t };
            //return result.Take(4).ToList();
            return await _context.DispositivoModelo.Join(_context.Tipo, dir => dir.Tipo, dirtipo => dirtipo.Nombre, (dir, dirtipo) => new { dir, dirtipo }).ToListAsync();
            //return await _context.Tipo.FromSqlRaw("SELECT tipo.nombre, tipo.tiempo_de_garantia, tipo.imagen, tipo.descripcion, dm.modelo, dm.marca, dm.consumo_electrico, dm.tipo from tipo inner join dispositivo_modelo dm on tipo.nombre = dm.tipo").ToListAsync();
        }

        // GET: api/DispositivoModelo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DispositivoModelo>> GetDispositivoModelo(string id)
        {
            var dispositivoModelo = await _context.DispositivoModelo.FindAsync(id);

            if (dispositivoModelo == null)
            {
                return NotFound();
            }

            return dispositivoModelo;
        }

        // PUT: api/DispositivoModelo/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDispositivoModelo(string id, DispositivoModelo dispositivoModelo)
        {
            if (id != dispositivoModelo.Modelo)
            {
                return BadRequest();
            }
            if (_context.DispositivoModelo.Join(_context.DispositivoAdquirido, dmodel => dmodel.Modelo, dadquirido => dadquirido.Modelo, (dmodel, dadquirido) => new { dmodel, dadquirido }).Any())
            {
                return BadRequest("Comprado");
            }

            _context.Entry(dispositivoModelo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DispositivoModeloExists(id))
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

        // POST: api/DispositivoModelo
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<DispositivoModelo>> PostDispositivoModelo(DispositivoModelo dispositivoModelo)
        {
            _context.DispositivoModelo.Add(dispositivoModelo);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (DispositivoModeloExists(dispositivoModelo.Modelo))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetDispositivoModelo", new { id = dispositivoModelo.Modelo }, dispositivoModelo);
        }

        // DELETE: api/DispositivoModelo/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<DispositivoModelo>> DeleteDispositivoModelo(string id)
        {
            var dispositivoModelo = await _context.DispositivoModelo.FindAsync(id);
            if (dispositivoModelo == null)
            {
                return NotFound();
            }
            if (_context.DispositivoModelo.Join(_context.DispositivoAdquirido, dmodel => dmodel.Modelo, dadquirido => dadquirido.Modelo, (dmodel, dadquirido) => new { dmodel, dadquirido }).Any())
            {
                return BadRequest("Comprado");
            }

            _context.DispositivoModelo.Remove(dispositivoModelo);
            await _context.SaveChangesAsync();

            return dispositivoModelo;
        }

        private bool DispositivoModeloExists(string id)
        {
            return _context.DispositivoModelo.Any(e => e.Modelo == id);
        }
    }
}
