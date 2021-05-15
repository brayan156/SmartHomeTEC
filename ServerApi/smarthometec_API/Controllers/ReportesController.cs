using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using smarthometec_API.Modelos;
using smarthometec_API.reportes;
using System.Data;


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

        /**
      * Funcion Get la generacion de reporte de consumo mensual por dispositivo
      * @param id del cliente, mes y año del mes a reportar
        * @returns lista con los datos del reporte
*/
        [HttpGet("consumo_mensual/{idcliente}/{ano}/{mes}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> Getconsumomensual(int idcliente, int ano, int mes)
        {
            var dipositivos = _context.ClienteHaUsado
                .Where(cu => cu.IdCliente == idcliente & cu.PropietarioActual == true).Join(
                    _context.DispositivoAdquirido, cu => cu.NSerieDispositivo, da => da.NSerie, (cu, da) => da);
            var dispositivos_historial =  dipositivos.Join(_context.Historial, d => d.NSerie, h => h.NSerie,
                    (d, h) => new {dispositivoAdquirido = d, historial = h})
                .Where(dh => dh.historial.Ano == ano & dh.historial.Mes == mes);
            var uso_mensual = dispositivos_historial
                .GroupBy(dh => new
                {
                    dh.dispositivoAdquirido.NSerie, dh.dispositivoAdquirido.Modelo, dh.historial.Ano, dh.historial.Mes
                }).Select(dh => new {datos = dh.Key, consumo = dh.Sum(dihi => dihi.historial.MinutosDeUso) });
          var consumo_mensual= await uso_mensual.Select(cm=> new {cm.datos, consumo=(float) cm.consumo*(_context.DispositivoModelo.Where(x=> x.Modelo==cm.datos.Modelo).First().ConsumoElectrico)/ 60.0 }).ToListAsync();
            
            
        if (dipositivos == null)
            {
                return NotFound();
            }

            return consumo_mensual;
        }


        /**
      * Funcion Get la generacion de reporte de consumo mensual por dispositivo
      * @param id del cliente
        * @returns lista con los datos del reporte
*/
        [HttpGet("consumo_tipo/{idcliente}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> Getdconsumotipo(int idcliente)
        {
            var dipositivos_tipo = _context.ClienteHaUsado.Where(cu => cu.IdCliente == idcliente & cu.PropietarioActual == true).Join(_context.DispositivoAdquirido, cu => cu.NSerieDispositivo, da => da.NSerie, (cu, da) => da)
                .Join(_context.DispositivoModelo,da=>da.Modelo,dm=>dm.Modelo,(da,dm)=>new {dispositivoAdquirido=da,tipo=dm.Tipo});
            var mayor_uso =  dipositivos_tipo.Join(_context.Historial, d => d.dispositivoAdquirido.NSerie, h => h.NSerie, (d, h) => new { tipo = d.tipo, Historial = h })
                .GroupBy(dh => dh.tipo).Select(dh => new { tipo = dh.Key, uso = dh.Sum(x => x.Historial.MinutosDeUso.Value) }).OrderByDescending(tu => tu.uso).ToList();

            if (mayor_uso == null)
            {
                return NotFound();
            }

            return mayor_uso;
        }


        /**
      * Funcion Get la generacion de reporte del uso por periodo del dia
      * @param id del cliente, fecha inicial y fecha final
        * @returns lista con los datos del reporte
*/
        [HttpGet("consumo_periodo_dia/{idcliente}/{di}/{mi}/{ai}/{df}/{mf}/{af}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> Getconsumoperiodo(int idcliente, int di, int mi, int ai, int df, int mf, int af)
        {

            DateTime fechai = new DateTime(ai, mi, di);
            DateTime fechaf= new DateTime(af, mf, df);
            List<fecha_historial> fechac = new List<fecha_historial>();
            var dipositivos = _context.ClienteHaUsado
                .Where(cu => cu.IdCliente == idcliente & cu.PropietarioActual == true).Join(
                    _context.DispositivoAdquirido, cu => cu.NSerieDispositivo, da => da.NSerie, (cu, da) => da);
            var dispositivos_historial = dipositivos.Join(_context.Historial, d => d.NSerie, h => h.NSerie,
                    (d, h) => new { dispositivoAdquirido = d, historial = h });

            foreach (var dh in dispositivos_historial)
            {

                fecha_historial fecha = new fecha_historial();
                fecha.fecha = new DateTime(dh.historial.Ano.Value, dh.historial.Mes.Value, dh.historial.Dia.Value);
                fecha.historial = dh.historial;
                fecha.da = dh.dispositivoAdquirido;
                fechac.Add(fecha);
            }

            var dhfiltrado = fechac.Where(dh => dh.fecha >= fechai & dh.fecha <= fechaf);

            var uso = dhfiltrado
                .GroupBy(dh => new
                {
                    dh.historial.Hora
                }).Select(dh => new { hora = dh.Key, promedio_dispositivos = dh.Count()/(fechaf-fechai).Days, cantidadTotalMinutos= dh.Sum(x=>x.historial.MinutosDeUso)}).OrderByDescending(dh=> dh.promedio_dispositivos).ToList();


            if (dipositivos == null)
            {
                return NotFound();
            }
            return uso;
        }

    }
}
