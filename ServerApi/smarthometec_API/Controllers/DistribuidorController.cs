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
    public class DistribuidorController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public DistribuidorController(resthometecdatabaseContext context)
        {
            _context = context;
        }

        /**
       * Funcion Get de Distribuidor
       * @returns una lista con todos los registros de Distribuidor
*/
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Distribuidor>>> GetDistribuidor()
        {
            return await _context.Distribuidor.ToListAsync();
        }
        /**
      * Funcion Get de Distribuidor con parametros de filtro
      * @param id de Distribuidor
        * @returns  registro de Distribuidor que contengan el valor del id
        */
        [HttpGet("{id}")]
        public async Task<ActionResult<Distribuidor>> GetDistribuidor(int id)
        {
            var distribuidor = await _context.Distribuidor.FindAsync(id);

            if (distribuidor == null)
            {
                return NotFound();
            }

            return distribuidor;
        }

        /**
      * Funcion Put de Distribuidor
      * @param id,Distribuidor
        * @returns una accion del caso sucedido al editar
*/
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDistribuidor(int id, Distribuidor distribuidor)
        {
            if (id != distribuidor.CedulaJuridica)
            {
                return BadRequest();
            }

            _context.Entry(distribuidor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DistribuidorExists(id))
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


        /**
      * Funcion Post para agregar un Distribuidor
      * @param Distribuidor
        * @returns una accion del caso sucedido al crear el Distribuidor
*/
        [HttpPost]
        public async Task<string> PostDistribuidor(Distribuidor distribuidor)
        {
            _context.Distribuidor.Add(distribuidor);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (DistribuidorExists(distribuidor.CedulaJuridica))
                {
                    return "distribuidor existente";
                }
                else
                {
                    return "datos invalidos";
                }
            }

            return "distribuidor creado";
        }

        /**
      * Funcion Delete para eliminar un Distribuidor
      * @param id de Distribuidor
        * @returns una accion del caso sucedido al eliminar o el Distribuidor eliminado
*/
        [HttpDelete("{id}")]
        public async Task<string> DeleteDistribuidor(int id)
        {
            var distribuidor = await _context.Distribuidor.FindAsync(id);
            if (distribuidor == null)
            {
                return "no existe distribuidor";
            }
            if (_context.DispositivoSeVendeEn.Any(d => d.CjDistribuidor == distribuidor.CedulaJuridica)) {
                return "distribuidor tiene dispositivos asociados";
            }

            _context.Distribuidor.Remove(distribuidor);
            await _context.SaveChangesAsync();

            return "distribuidor eliminado";
        }

        private bool DistribuidorExists(int id)
        {
            return _context.Distribuidor.Any(e => e.CedulaJuridica == id);
        }
    }
}
