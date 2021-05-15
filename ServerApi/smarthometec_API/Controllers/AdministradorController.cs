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
    public class AdministradorController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;



        public AdministradorController(resthometecdatabaseContext context)
        {
            _context = context;
        }

 /**
* Funcion Get de Administrador
* @returns una lista con todos los registros de Administrador
*/
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Administrador>>> GetAdministrador()
        {
            return await _context.Administrador.ToListAsync();
        }

        /**
* Funcion Get de login Administrador
* @param correo, contraseña
* @returns una lista con el Administrador si es validado
*/
        [HttpGet("validar/{contrasena}/{correo}")]
        public async Task<ActionResult<List<Administrador>>> Getcontrasena(string contrasena,string correo)
        {
            return await _context.Administrador.Where(d => d.Contrasena == contrasena & d.Email==correo).ToListAsync();
        }

        /**
      * Funcion Get de Administrador con parametros de filtro
      * @param id de Administrador
        * @returns  registro de Administrador que contenga el valor del
       * atributo
*/
        [HttpGet("{id}")]
        public async Task<ActionResult<Administrador>> GetAdministrador(int id)
        {
            var administrador = await _context.Administrador.FindAsync(id);

            if (administrador == null)
            {
                return NotFound();
            }

            return administrador;
        }

        /**
      * Funcion Put de Administrador
      * @param id,administrador
        * @returns una accion del caso sucedido al editar
*/

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAdministrador(int id, Administrador administrador)
        {
            if (id != administrador.Id)
            {
                return BadRequest();
            }

            _context.Entry(administrador).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AdministradorExists(id))
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
      * Funcion Post para agregar un Administrador
      * @param administrador
        * @returns una accion del caso sucedido al crear o el adminstrador creado
*/
        [HttpPost]
        public async Task<ActionResult<Administrador>> PostAdministrador(Administrador administrador)
        {
            _context.Administrador.Add(administrador);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (AdministradorExists(administrador.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetAdministrador", new { id = administrador.Id }, administrador);
        }

        /**
      * Funcion Delete para eliminar un Administrador
      * @param id
        * @returns una accion del caso sucedido al eliminar o el adminstrador eliminado
*/
        [HttpDelete("{id}")]
        public async Task<ActionResult<Administrador>> DeleteAdministrador(int id)
        {
            var administrador = await _context.Administrador.FindAsync(id);
            if (administrador == null)
            {
                return NotFound();
            }

            _context.Administrador.Remove(administrador);
            await _context.SaveChangesAsync();

            return administrador;
        }

        private bool AdministradorExists(int id)
        {
            return _context.Administrador.Any(e => e.Id == id);
        }
    }
}
