using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using smarthometec_API.Modelos;

namespace smarthometec_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase


    {
        private readonly resthometecdatabaseContext _context;

        public DashboardController(resthometecdatabaseContext context)
        {
            _context = context;
        }




        /**
* Funcion de dashboard para obtener los dispositivos asociados
* @return un número con la cantidad de dispositivos asociados a clientes
*/
        [HttpGet("dispositivos_asociados")]
        public async Task<int> Getdispositvosasociados()
        {
            var dipositivos =  await _context.ClienteHaUsado.Where(cu => cu.PropietarioActual == true)
                .Join(_context.DispositivoAdquirido, cu => cu.NSerieDispositivo, da => da.NSerie, (cu, da) => da).CountAsync();


            if (dipositivos == null)
            {
                return 0;
            }

            return dipositivos;
        }


        /**
* Funcion de dashboard para obtener los dispositivos por región
* @returnuna lista con la cantidad de dispositivos asociados a clientes por region
*/
        [HttpGet("dispositivos_region")]
        public async Task<ActionResult<IEnumerable<dynamic>>> Getdispositvosregion()
        {

            var dipositivos = await _context.Cliente.Join(_context.ClienteHaUsado, c => c.Id, cu => cu.IdCliente,
                    (cu, da) => new {cu, da}).Where(cd => cd.da.PropietarioActual.Value)
                .GroupBy(cd => cd.cu.Pais).Select(cd => new {pais=cd.Key, cantidad = cd.Count()}).ToListAsync();

            if (dipositivos == null)
            {
                return NotFound();
            }

            return dipositivos;

        }


        /**
* Funcion de dashboard para obtener los dispositivos por usuario
* @return un número con la cantidad de dispositivos promedio asociados a clientes
*/
        [HttpGet("dispositivos_promedio")]
        public float Getdispositvospromedio()
        {

            var cliente_cantidad =  _context.Cliente.Join(_context.ClienteHaUsado, c => c.Id, cu => cu.IdCliente,
                    (cu, da) => new {cu, da}).Where(cd => cd.da.PropietarioActual.Value)
                .GroupBy(cd => cd.cu.Id).Select(cd => new {cliente_id = cd.Key, cantidad = cd.Count()}).ToList();
            float promedio;
            Debug.WriteLine(cliente_cantidad.Count);
            if (cliente_cantidad.Count() != 0)
            {
                promedio = (float) cliente_cantidad.Sum(x => x.cantidad) / (float) cliente_cantidad.Count() ;
            }
            else
            {
                promedio=0;
            }

            if (cliente_cantidad == null)
            {
                return 0;
            }

            return promedio;

        }


        /**
* Funcion de dashboard para obtener los asociados y no asociados y diferenciarlos
* @return una lista con todos los dispositivos con su n_serie e indicado si estan asociados o no
*/

        [HttpGet("dispositivos")]
        public async Task<ActionResult<IEnumerable<dynamic>>> Getdispositvos()
        {
            var Usado =  _context.ClienteHaUsado.Where(cu => cu.PropietarioActual == true);
            var dipositivos = await _context.DispositivoAdquirido
                .GroupJoin(Usado, da => da.NSerie, u => u.NSerieDispositivo,
                    (da, cu) => new {dispositivoAdquirido = da, clienteHaUsado = cu})
                .SelectMany(dc => dc.clienteHaUsado.DefaultIfEmpty(), (dc,c) => new {dc.dispositivoAdquirido, dueno = c==null?"no asociado":"asociado" })
                .ToListAsync();

            if (dipositivos == null)
            {
                return NotFound();
            }

            return dipositivos;
        }


    }

}
