using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using smarthometec_API.Modelos;

namespace smarthometec_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportesController : ControllerBase
    {

        private readonly resthometecdatabaseContext _context;

        public ReportesController(resthometecdatabaseContext context)
        {
            _context = context;
        }

        [HttpGet("consumo_mensual/{idcliente}/{ano}/{mes}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> Getdispositvos(int idcliente,int ano, int mes)
        {
            var dipositivos =  _context.ClienteHaUsado.Where(cu => cu.IdCliente == idcliente & cu.PropietarioActual == true).Join(_context.DispositivoAdquirido, cu => cu.NSerieDispositivo, da => da.NSerie, (cu, da) => da);
            var dispositivos_historial = await dipositivos.Join(_context.Historial, d => d.NSerie, h => h.NSerie, (d, h) => new {dispositivoAdquirido=d, historial=h})
                    .Where(dh=>dh.historial.Ano==ano & dh.historial.Mes==mes).ToListAsync();
             
            if (dipositivos == null)
            {
                return NotFound();
            }

            return dispositivos_historial;
        }


        [HttpGet("consumo_mensual/{idcliente}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> Getdispositvos(int idcliente)
        {
            var dipositivos_tipo = _context.ClienteHaUsado.Where(cu => cu.IdCliente == idcliente & cu.PropietarioActual == true).Join(_context.DispositivoAdquirido, cu => cu.NSerieDispositivo, da => da.NSerie, (cu, da) => da)
                .Join(_context.DispositivoModelo,da=>da.Modelo,dm=>dm.Modelo,(da,dm)=>new {dispositivoAdquirido=da,tipo=dm.Tipo});
            var mayor_uso = await dipositivos_tipo.Join(_context.Historial, d => d.dispositivoAdquirido.NSerie, h => h.NSerie, (d, h) => new { tipo = d.tipo, Historial = h })
                .GroupBy(dh=>dh.tipo).Select(dh=>new  {tipo=dh.Key, uso=dh.Sum(x=>x.Historial.MinutosDeUso.Value) }).OrderByDescending(tu=>tu.uso).ToListAsync();

            if (mayor_uso == null)
            {
                return NotFound();
            }

            return mayor_uso;
        }



    }
}
