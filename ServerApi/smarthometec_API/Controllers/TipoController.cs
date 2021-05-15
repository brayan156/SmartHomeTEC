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

        /**
       * Funcion Get de Tipo
       * @returns una lista con todos los registros de Administrador
*/
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tipo>>> GetTipo()
        {
            return await _context.Tipo.ToListAsync();
        }

        /**
      * Funcion Get de Tipo con parametros de filtro
      * @param id de tipo 
        * @returns registro de Tipo que contengan el valor del
       * atributo
*/
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


        /**
      * Funcion Put de Tipo para editar
      * @param id,Tipo
        * @returns una accion del caso sucedido al editar
*/

        [HttpPut("{id}")]
        public async Task<string> PutTipo(string id, Tipo tipo)
        {
            if (id != tipo.Nombre)
            {
                return "tipo incorrecto";
            }

            if (_context.Tipo.Where(t => t.Nombre == id).Join(_context.DispositivoModelo, tp => tp.Nombre, dm => dm.Tipo,
                (tp, dm) => new { tp, dm }).Join(_context.DispositivoAdquirido, td => td.dm.Modelo, da => da.Modelo,
                (td, dm) => new { td, dm }).Any())
            {
                return "tipo tiene registrado un dispositivo comprado";
            }

            _context.Entry(tipo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TipoExists(id))
                {
                    return "tipo no encontrado";
                }
                else
                {
                    return "datos invalidos";
                }
            }

            return "dispositivo editado";
        }

        /**
      * Funcion Post para agregar un Tipo
      * @param Tipo
        * @returns una accion del caso sucedido al crear o el Tipo creado
*/
        [HttpPost]
        public async Task<string> PostTipo(Tipo tipo)
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
                    return "tipo ya existe";
                }
                else
                {
                    throw;
                }
            }

            return "tipo creado";
        }

        /**
      * Funcion Delete para eliminar un Tipo
      * @param id
        * @returns una accion del caso sucedido al eliminar o el Tipo eliminado
*/
        [HttpDelete("{id}")]
        public async Task<string> DeleteTipo(string id)
        {
            var tipo = await _context.Tipo.FindAsync(id);
            if (tipo == null)
            {
                return "tipo incorrecto";
            }

            if (_context.Tipo.Where(t=>t.Nombre==id).Join(_context.DispositivoModelo, tp => tp.Nombre, dm => dm.Tipo,
                (tp, dm) => new { tp, dm }).Any())
            {
                return "tipo tiene registrado un dispositivo comprado";
            }

            _context.Tipo.Remove(tipo);
            await _context.SaveChangesAsync();

            return "tipo eliminado";
        }

        private bool TipoExists(string id)
        {
            return _context.Tipo.Any(e => e.Nombre == id);
        }
    }
}
