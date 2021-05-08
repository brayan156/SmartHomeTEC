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
    public class DispositivoSeVendeEnController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public DispositivoSeVendeEnController(resthometecdatabaseContext context)
        {
            _context = context;
        }

        // GET: api/DispositivoSeVendeEn
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DispositivoSeVendeEn>>> GetDispositivoSeVendeEn()
        {
            return await _context.DispositivoSeVendeEn.ToListAsync();
        }

        // GET: api/DispositivoSeVendeEn/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DispositivoSeVendeEn>> GetDispositivoSeVendeEn(int id)
        {
            var dispositivoSeVendeEn = await _context.DispositivoSeVendeEn.FindAsync(id);

            if (dispositivoSeVendeEn == null)
            {
                return NotFound();
            }

            return dispositivoSeVendeEn;
        }

        // PUT: api/DispositivoSeVendeEn/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDispositivoSeVendeEn(int id, DispositivoSeVendeEn dispositivoSeVendeEn)
        {
            if (id != dispositivoSeVendeEn.CjDistribuidor)
            {
                return BadRequest();
            }

            _context.Entry(dispositivoSeVendeEn).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DispositivoSeVendeEnExists(id))
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

        // POST: api/DispositivoSeVendeEn
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<DispositivoSeVendeEn>> PostDispositivoSeVendeEn(DispositivoSeVendeEn dispositivoSeVendeEn)
        {
            _context.DispositivoSeVendeEn.Add(dispositivoSeVendeEn);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (DispositivoSeVendeEnExists(dispositivoSeVendeEn.CjDistribuidor))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetDispositivoSeVendeEn", new { id = dispositivoSeVendeEn.CjDistribuidor }, dispositivoSeVendeEn);
        }



        [HttpPost("comprar/{idcliente}")]
        public  dynamic comprar(int idcliente,DispositivoSeVendeEn dispositivoSeVendeEn)
        {

            DispositivoAdquirido adquirido = new DispositivoAdquirido();
            adquirido.Modelo = dispositivoSeVendeEn.ModeloDispotivo;
            adquirido = _context.DispositivoAdquirido.Add(adquirido).Entity;
             _context.SaveChanges();
            Pedido pedido = new Pedido();
            pedido.IdCliente = idcliente;
            pedido.Monto = dispositivoSeVendeEn.Precio;
            pedido.NSerieDispositivo = adquirido.NSerie;
            pedido = _context.Pedido.Add(pedido).Entity;
             _context.SaveChanges();
            Factura factura = new Factura();
            factura.Dia = DateTime.Now.Day;
            factura.Ano = DateTime.Now.Year;
            factura.Mes = DateTime.Now.Month;
            factura = _context.Factura.Add(factura).Entity;
             _context.SaveChanges();
            PedidoFactura pedidoFactura = new PedidoFactura();
            pedidoFactura.IdPedido = pedido.Id;
            pedidoFactura.NFactura = factura.NFactura;
            _context.PedidoFactura.Add(pedidoFactura);
            CertificadoGarantia certificado = new CertificadoGarantia();
            Tipo tipo = _context.Tipo.Find(_context.DispositivoModelo.Find(dispositivoSeVendeEn.ModeloDispotivo).Tipo);
            certificado.NFactura = factura.NFactura;
            certificado.MesFinGarantia = DateTime.Now.AddMonths(tipo.TiempoDeGarantia).Month;
            certificado.AnoFinGarantia = DateTime.Now.AddMonths(tipo.TiempoDeGarantia).Year;
            certificado = _context.CertificadoGarantia.Add(certificado).Entity;
             _context.SaveChanges();



            try
            {
              
            }
            catch (DbUpdateException)
            {
                if (DispositivoSeVendeEnExists(dispositivoSeVendeEn.CjDistribuidor))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return new {pedido,factura,certificado};
        }






        // DELETE: api/DispositivoSeVendeEn/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<DispositivoSeVendeEn>> DeleteDispositivoSeVendeEn(int id)
        {
            var dispositivoSeVendeEn = await _context.DispositivoSeVendeEn.FindAsync(id);
            if (dispositivoSeVendeEn == null)
            {
                return NotFound();
            }

            _context.DispositivoSeVendeEn.Remove(dispositivoSeVendeEn);
            await _context.SaveChangesAsync();

            return dispositivoSeVendeEn;
        }

        private bool DispositivoSeVendeEnExists(int id)
        {
            return _context.DispositivoSeVendeEn.Any(e => e.CjDistribuidor == id);
        }
    }
}
