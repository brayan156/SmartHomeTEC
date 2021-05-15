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
    public class DispositivoModeloController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public DispositivoModeloController(resthometecdatabaseContext context)
        {
            _context = context;
        }

        /**
       * Funcion Get de DispositivoModelo
       * @returns una lista con todos los registros de DispositivoModelo
*/
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DispositivoModelo>>> GetDispositivoModelo()
        {
            return await _context.DispositivoModelo.ToListAsync();
        }


        /**
* Funcion Get de join DispositivoModelo con tipo
* @returns una lista con todos los registros de DispositivoModelo y su join a tipo
*/
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



        /**
* Funcion Get de Administrador con parametros de filtro por region
* @param pais
* @returns una lista con todos los registros de DispositivoModelo que esten disponibles en el pais
*/

        [HttpGet("region/{pais}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> getbyregion(string pais)
        {
            return await _context.Distribuidor.Join(_context.DispositivoSeVendeEn, dis => dis.CedulaJuridica, dsv => dsv.CjDistribuidor,
                (distribuidor, dispositivoSeVendeEn) => new { distribuidor, dispositivoSeVendeEn }).Where(dd => dd.distribuidor.Pais == pais).Join(
                _context.DispositivoModelo, dd => dd.dispositivoSeVendeEn.ModeloDispotivo, dm => dm.Modelo, (dd, dm) => new { dispositivoSeVendeEn = dd.dispositivoSeVendeEn, dispositivoModelo = dm }).ToListAsync();
        }



        /**
      * Funcion Get de DispositivoModelo con parametros de filtro
      * @param modelo del dispositivo
        * @returns una lista con todos los registros de DispositivoModelo que contengan el valor de los
       * atributos de los parametros
*/
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

        /**
      * Funcion Put de DispositivoModelo para editar
      * @param id,DispositivoModelo
        * @returns una accion del caso sucedido al editar
*/
        [HttpPut("{id}")]
        public async Task<string> PutDispositivoModelo(string id, DispositivoModelo dispositivoModelo)
        {
            if (id != dispositivoModelo.Modelo)
            {
                return "modelo invalido";
            }
            if (_context.DispositivoModelo.Where(t => t.Modelo == id).Join(_context.DispositivoAdquirido, dmodel => dmodel.Modelo, dadquirido => dadquirido.Modelo, (dmodel, dadquirido) => new { dmodel, dadquirido }).Any())
            {
                return "el dispositivo ya ha sido comprado";
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
                    return "modelo no existente";
                }
                else
                {
                    return "datos invalidos";
                }
            }

            return "dispositivo editado";
        }
        /**
      * Funcion Post para agregar un DispositivoModelo
      * @param DispositivoModelo
        * @returns una accion del caso sucedido al crear  el DispositivoModelo
*/
        [HttpPost("crear")]
        public async Task<string> PostDispositivoModelo(DispositivoModelo dispositivoModelo)
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
                    return "Modelo existente";
                }
                else
                {
                    return "datos invalidos";
                }
            }

            return "dispositivo creado";   
        }

        /**
      * Funcion Delete para eliminar un DispositivoModelo
      * @param id de DispositivoModelo
        * @returns una accion del caso sucedido al eliminar o el DispositivoModelo eliminado
*/
        [HttpDelete("{id}")]
        public async Task<string> DeleteDispositivoModelo(string id)
        {
            var dispositivoModelo = await _context.DispositivoModelo.FindAsync(id);
            if (dispositivoModelo == null)
            {
                return "dispositivo no encontrado";
            }
            if (_context.DispositivoModelo.Where(t => t.Modelo == id).Join(_context.DispositivoAdquirido, dmodel => dmodel.Modelo, dadquirido => dadquirido.Modelo, (dmodel, dadquirido) => new { dmodel, dadquirido }).Any())
            {
                return "dispositivo ya comprado";
            }

            _context.DispositivoModelo.Remove(dispositivoModelo);
            await _context.SaveChangesAsync();

            return "dispositivo eliminado";
        }

        private bool DispositivoModeloExists(string id)
        {
            return _context.DispositivoModelo.Any(e => e.Modelo == id);
        }
    }
}
