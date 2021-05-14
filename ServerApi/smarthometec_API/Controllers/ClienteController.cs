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
    public class ClienteController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public ClienteController(resthometecdatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Cliente
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetCliente()
        {
            return await _context.Cliente.ToListAsync();
        }

        [HttpGet("Cliente/{contrasena}/{correo}")]
        public async Task<ActionResult<List<Cliente>>> Getcontrasena(string contrasena, string correo)
        {
            return await _context.Cliente.Where(d => d.Contrasena == contrasena & d.Email == correo).ToListAsync();
        }

        // GET: api/Cliente/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            var cliente = await _context.Cliente.FindAsync(id);

            if (cliente == null)
            {
                return NotFound();
            }

            return cliente;
        }

        public  int gettiempo(int nserie)
        {
            var pedido = _context.Pedido.First(p => p.NSerieDispositivo == nserie);
            var pfactura = _context.PedidoFactura.First(pf => pf.IdPedido == pedido.Id);
            var factura = _context.Factura.First(f => f.NFactura == pfactura.NFactura);
            var garantia = _context.CertificadoGarantia.First(f => f.NFactura == factura.NFactura);
            var fechafinal = new DateTime(garantia.AnoFinGarantia, garantia.MesFinGarantia, factura.Dia.Value);
            var mesesrestantes = ((fechafinal.Year - DateTime.Now.Year) * 12) + fechafinal.Month - DateTime.Now.Month;

            if (mesesrestantes < 0)
            {
                return 0;
            }

            return mesesrestantes;
        }


        [HttpGet("dispositivosDueno/{id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> Getdispositvos(int id)
        {
            var dipositivos =  _context.ClienteHaUsado.Where(cu=>cu.IdCliente==id & cu.PropietarioActual==true).Join(_context.DispositivoAdquirido,cu=>cu.NSerieDispositivo,da=>da.NSerie,(cu,da)=>da);
            var dis_modelo = dipositivos.Join(_context.DispositivoModelo,d=> d.Modelo,m=>m.Modelo, (d,m)=>new
            {d,m });
            List<dynamic> lista = new List<dynamic>();

            dis_modelo.ToList().ForEach(dm => {
                var meses = this.gettiempo(dm.d.NSerie);
                var mesfin = meses - meses / 12;
                var anofin = meses / 12;
                var dmh = new { modelo = dm.m.Modelo, marca = dm.m.Marca, consumoElectrico = dm.m.ConsumoElectrico, tipo = dm.m.Tipo, imagen = dm.m.Imagen, n_serie = dm.d.NSerie, prendido = dm.d.Prendido, mes_fin_garantia= meses, ano_fin_garantia=anofin };
                lista.Add(dmh);
            });


            if (dipositivos == null)
            {
                return NotFound();
            }

            return lista;
        }


        // PUT: api/Cliente/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(int id, Cliente cliente)
        {
            if (id != cliente.Id)
            {
                return BadRequest();
            }

            _context.Entry(cliente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id))
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




        [HttpPost("sincronizar/{idcliente}")]
        public string PostCliente(Dictionary<string, dynamic> clase, int idcliente)
        {

            List<Historial> historiales = clase["historiales"];
            List<ClienteHaUsado> clienteHaUsado = clase["clienteHaUsado"];
            List<DispositivoAdquirido> dispositivos = clase["dispositivos"];
            List<Aposento> aposentos = clase["aposentos"];

            clienteHaUsado.ForEach(chu => {
                if (!_context.ClienteHaUsado.Any(clienteha => chu.IdCliente == clienteha.IdCliente & chu.IdCliente == idcliente & chu.NSerieDispositivo == clienteha.NSerieDispositivo)) {
                    _context.ClienteHaUsado.Add(chu);
                }
            });
            _context.SaveChanges();

           
            var aposentosclientebase = _context.Aposento.Where(ap => ap.IdCliente == idcliente);

            var aposentoseditar = aposentos.Where(aposento => aposentosclientebase.Any(a => a.IdCliente == aposento.IdCliente & a.Id == aposento.Id)).ToList();
            var aposentosagregar = aposentos.Where(aposento => aposentosclientebase.All(a => a.IdCliente == aposento.IdCliente & a.Id != aposento.Id));
            var aposentoseliminar = aposentosclientebase.Where(aposento => aposentos.Where(a => a.IdCliente == idcliente).All(a => a.Id != aposento.Id));

            aposentoseditar.ForEach(aposento =>
            {
                _context.Entry(aposento).State = EntityState.Modified;
            });
            _context.SaveChanges();

            aposentosagregar.ToList().ForEach(aposento =>
            {
                var apagregado = _context.Aposento.Add(aposento).Entity;
                dispositivos.Where(dispositivo => aposento.Id == dispositivo.IdAposento).ToList().ForEach(dis=>{
                    dis.IdAposento = apagregado.Id;
                    _context.Entry(dis).State= EntityState.Modified;
                });
            });
            _context.SaveChanges();


            _context.ClienteHaUsado.Where(cu => cu.IdCliente == idcliente & cu.PropietarioActual == true).Join(dispositivos, cu => cu.NSerieDispositivo, da => da.NSerie, (cu, da) => da).ToList().ForEach(dis=> {
                _context.Entry(dis).State = EntityState.Modified;

            });
            _context.SaveChanges();

            _context.Aposento.RemoveRange(aposentoseliminar);
            _context.SaveChanges();

            var dispositivoscliente=_context.ClienteHaUsado.Where(cu => cu.IdCliente == idcliente & cu.PropietarioActual == true).Join(_context.DispositivoAdquirido, cu => cu.NSerieDispositivo, da => da.NSerie, (cu, da) => da);
            historiales.Where(historial => dispositivoscliente.Any(d => d.NSerie == historial.NSerie)).ToList().ForEach(historial => {
                if (_context.Historial.Any(hist => hist.NSerie == historial.NSerie & hist.Ano == historial.Ano & hist.Mes == historial.Mes & hist.Dia == historial.Dia & hist.Hora == historial.Hora))
                {
                    _context.Entry(historial).State = EntityState.Modified;
                }
                else {
                    _context.Historial.Add(historial);
                }
            });
            _context.SaveChanges();

            return "sincronizado wapo";
        }




        // POST: api/Cliente
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente(Cliente cliente)
        {
            Debug.WriteLine(cliente);
            _context.Cliente.Add(cliente);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ClienteExists(cliente.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetCliente", new { id = cliente.Id }, cliente);
        }

        // DELETE: api/Cliente/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Cliente>> DeleteCliente(int id)
        {
            var cliente = await _context.Cliente.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }

            _context.Cliente.Remove(cliente);
            await _context.SaveChangesAsync();

            return cliente;
        }

        private bool ClienteExists(int id)
        {
            return _context.Cliente.Any(e => e.Id == id);
        }
    }
}
