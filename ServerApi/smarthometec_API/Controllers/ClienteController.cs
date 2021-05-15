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

        /**
       * Funcion Get de Cliente
       * @returns una lista con todos los registros de Cliente
*/
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetCliente()
        {
            return await _context.Cliente.ToListAsync();
        }


        /**
* Funcion Get de login Cliente
* @param correo, contraseña
* @returns una lista con el Cliente si es validado
*/
        [HttpGet("Cliente/{contrasena}/{correo}")]
        public async Task<ActionResult<List<Cliente>>> Getcontrasena(string contrasena, string correo)
        {
            return await _context.Cliente.Where(d => d.Contrasena == contrasena & d.Email == correo).ToListAsync();
        }
        /**
      * Funcion Get de Cliente con parametros de filtro
      * @param id_cliente
        * @returns una lista con todos los registros de Cliente que contengan el valor de los
       * atributos de los parametros
*/
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

        /**
      * Funcion para obtener el tiempo restante de garantía
      * @param nserie del dispositivo
        * @returns numero enteros con los meses restantes para que se acabe la garantia
*/

        public int gettiempo(int nserie)
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

        /**
* Funcion Get de dispositivos con parametros de filtro por dueño
* @param id_cliente
* @returns una lista con todos los registros de dispositivos del usuario
*/
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


        /**
      * Funcion Put de Cliente
      * @param id,Cliente
        * @returns una accion del caso sucedido al editar
*/

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


            /**
    * Funcion Get de Cliente que envia los datos necesarios para el funcionamiento offline del movil
    * @returns una lista con todos los datos requeridos por sqllite para funcionar bien sin uso del postgres
    */

        [HttpGet("desincronizar")]
        public  dynamic desincronizar() {
            return new
            {
                aposentos = _context.Aposento.ToList(),
                certificados = _context.CertificadoGarantia.ToList(),
                clientes = _context.Cliente.ToList(),
                clientesHanUsado = _context.ClienteHaUsado.ToList(),
                dipositivoAdquiridos = _context.DispositivoAdquirido.ToList(),
                dispositivoModelos = _context.DispositivoModelo.ToList(),
                facturas = _context.Factura.ToList(),
                historiales = _context.Historial.ToList(),
                pedidos = _context.Pedido.ToList(),
                pedidosFacturas = _context.PedidoFactura.ToList(),
                tipos = _context.Tipo.ToList()
            };
        }


            /**
    * Funcion Post de Cliente que resincroniza los datos recopilados por el usuario mientras estuvo offline con la base principal
    * @return un alerta de que se ha sincronizado exitosamente
    */
        [HttpPost("sincronizar/{idcliente}")]
        public async Task<string> sincronizar(Dictionary<string, dynamic> clase, int idcliente)
        {
            Console.WriteLine(clase["dispositivos"]);
            List<Historial> historiales = clase["historiales"].ToObject<List<Historial>>();
            List<ClienteHaUsado> clienteHaUsado = clase["clienteHaUsado"].ToObject<List<ClienteHaUsado>>();
            List<DispositivoAdquirido> dispositivos = clase["dispositivos"].ToObject<List<DispositivoAdquirido>>();
            List<Aposento> aposentos = clase["aposentos"].ToObject<List<Aposento>>();
            Console.WriteLine(clienteHaUsado);

                clienteHaUsado.ForEach(chu =>
                {
                    Console.WriteLine(chu.IdCliente);
                    Console.WriteLine("hola");
                    if (!_context.ClienteHaUsado.Any(clienteha => chu.IdCliente == clienteha.IdCliente & chu.IdCliente == idcliente & chu.NSerieDispositivo == clienteha.NSerieDispositivo))
                    {
                        _context.ClienteHaUsado.Add(chu);
                    }
                });
                _context.SaveChanges();

            var aposentosclientebase = _context.Aposento.Where(ap => ap.IdCliente == idcliente);
            var aposentoseditar = aposentos.Where(aposento => aposentosclientebase.Any(a => a.IdCliente == aposento.IdCliente & a.Id == aposento.Id)).ToList();

            aposentoseditar.ForEach(aposento =>
            {
                _context.Entry(aposento).State = EntityState.Modified;
            });
            _context.SaveChanges();

            var aposentosagregar = aposentos.Where(aposento => aposentosclientebase.All(a => a.IdCliente == aposento.IdCliente & a.Id != aposento.Id));

                aposentosagregar.ToList().ForEach(aposento =>
                {
                    var apagregado = _context.Aposento.Add(aposento).Entity;
                    dispositivos.Where(dispositivo => aposento.Id == dispositivo.IdAposento).ToList().ForEach(dis =>
                    {
                        dis.IdAposento = apagregado.Id;
                        _context.Entry(dis).State = EntityState.Modified;
                    });
                });
            await _context.SaveChangesAsync();
            var clientes = _context.ClienteHaUsado.Where(cu => cu.IdCliente == idcliente & cu.PropietarioActual.Value == true);

                dispositivos.Where(da=> clientes.Any(c=> c.NSerieDispositivo==da.NSerie)).ToList().ForEach(dis =>
                {
                    _context.Entry(dis).State = EntityState.Modified;

                });
            await _context.SaveChangesAsync();

            List<Aposento> aposentoseliminar=new List<Aposento>();

            foreach (var aposento in aposentosclientebase) {
                if (!aposentos.Any(a => a.IdCliente == idcliente & a.Id == aposento.Id)) {
                    aposentoseliminar.Add(aposento);
                }
            }
            
             _context.Aposento.RemoveRange(aposentoseliminar);
                await _context.SaveChangesAsync();

            var dispositivoscliente = _context.ClienteHaUsado.Where(cu => cu.IdCliente == idcliente & cu.PropietarioActual == true).Join(_context.DispositivoAdquirido, cu => cu.NSerieDispositivo, da => da.NSerie, (cu, da) => da);

                historiales.Where(historial => dispositivoscliente.Any(d => d.NSerie == historial.NSerie)).ToList().ForEach(historial =>
                {
                    if (_context.Historial.Any(hist => hist.NSerie == historial.NSerie & hist.Ano == historial.Ano & hist.Mes == historial.Mes & hist.Dia == historial.Dia & hist.Hora == historial.Hora))
                    {
                        _context.Entry(historial).State = EntityState.Modified;
                    }
                    else
                    {
                        _context.Historial.Add(historial);
                    }
                });

            return "sincronizado wapo";
        }



        /**
      * Funcion Post para agregar un Cliente
      * @param Cliente
        * @returns una accion del caso sucedido al crear el cliente
*/
        [HttpPost]
        public async Task<ActionResult<string>> PostCliente(Cliente cliente)
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
                    return "cliente existente";
                }
                else
                {
                    return "datos invalidos";
                }
            }
            return "creado";
        }

        /**
      * Funcion Delete para eliminar un Cliente
      * @param id
        * @returns una accion del caso sucedido al eliminar o el Cliente eliminado
*/
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
