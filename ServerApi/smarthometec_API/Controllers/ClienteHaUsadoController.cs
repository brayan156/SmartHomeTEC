﻿using System;
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
    public class ClienteHaUsadoController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public ClienteHaUsadoController(resthometecdatabaseContext context)
        {
            _context = context;
        }

        /**
       * Funcion Get de Administrador
       * @returns una lista con todos los registros de Administrador
*/
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClienteHaUsado>>> GetClienteHaUsado()
        {
            return await _context.ClienteHaUsado.ToListAsync();
        }

        /**
      * Funcion Get de ClienteHaUsado con parametros de filtro
      * @param id
        * @returns una lista con todos los registros de ClienteHaUsado que contengan el valor de los
       * atributos de los parametros
*/
        [HttpGet("{id}")]
        public async Task<ActionResult<ClienteHaUsado>> GetClienteHaUsado(int id)
        {
            var clienteHaUsado = await _context.ClienteHaUsado.FindAsync(id);

            if (clienteHaUsado == null)
            {
                return NotFound();
            }

            return clienteHaUsado;
        }

        /**
      * Funcion Put de ClienteHaUsado
      * @param ClienteHaUsado
        * @returns una accion del caso sucedido al editar
*/
        [HttpPut()]
        public async Task<IActionResult> PutClienteHaUsado( ClienteHaUsado clienteHaUsado)
        {


            _context.Entry(clienteHaUsado).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) { 

                    throw;
                
            }

            return NoContent();
        }
        /**
      * Funcion Post para agregar un ClienteHaUsado
      * @param ClienteHaUsado
        * @returns una accion del caso sucedido al crear o el ClienteHaUsado creado
*/
        [HttpPost]
        public async Task<ActionResult<ClienteHaUsado>> PostClienteHaUsado(ClienteHaUsado clienteHaUsado)
        {
            _context.ClienteHaUsado.Add(clienteHaUsado);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ClienteHaUsadoExists(clienteHaUsado.NSerieDispositivo))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetClienteHaUsado", new { id = clienteHaUsado.NSerieDispositivo }, clienteHaUsado);
        }


        /**
* Funcion Get para transferir un dispositvo a otro cliente
* @param idactual del cliente/idnuevo del cliente a transferir/nserie del dispositivo"
* @returns una accion del caso sucedido de transferencia
*/
        [HttpGet("transferir/{idactual}/{idnuevo}/{nserie}")]
        public async Task<string> transferir(int idactual, int idnuevo,int nserie)
        {
            ClienteHaUsado clienteusado= new ClienteHaUsado();
            clienteusado.IdCliente = idnuevo;
            clienteusado.NSerieDispositivo = nserie;
            clienteusado.PropietarioActual = true;


            ClienteHaUsado clienteusadoactual = new ClienteHaUsado();
            clienteusadoactual.IdCliente = idactual;
            clienteusadoactual.NSerieDispositivo = nserie;
            clienteusadoactual.PropietarioActual = false;

            if (!_context.Cliente.Any(c => c.Id == idnuevo))
            {
                return "usuario nuevo no existe";
            }
            else {
                if (_context.ClienteHaUsado.Any(c => c.IdCliente == idnuevo & c.NSerieDispositivo == nserie))
                {
                    _context.Entry(clienteusado).State = EntityState.Modified;
                }
                else {
                    _context.ClienteHaUsado.Add(clienteusado);
                }
                _context.Entry(clienteusadoactual).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return "transferido exictosamente";
            }


        }


        /**
* Funcion Post para agregar un dispositivo a un cliente
* @param idcliente, datos del dispositivo 
* @returns una accion del caso sucedido al intentar agregar el dispositivo
*/

        [HttpPost("agregardispositivo/{idcliente}")]
        public async Task<string> agregardispostiivosusuario(int idcliente,dynamic datos)
        {

            string descripcion=datos.descripcion;
            string tipo=datos.tipo;
            string marca=datos.marca;
            int nserie=datos.n_serie;
            int consumo=datos.consumo;
            int idaposento=datos.aposento;


            if (!_context.DispositivoAdquirido.Any(d => d.NSerie == nserie)) {
                return "dispositivo no existe";
                
            }
            else if (_context.ClienteHaUsado.Any(c=> c.NSerieDispositivo==nserie)) {
                return "dispositivo ya ha sido registrado";
            }

            var dispositivo = _context.DispositivoAdquirido.Where(d => d.NSerie == nserie).Join(_context.DispositivoModelo,da=>da.Modelo,dm=>dm.Modelo,(da,dm)=>  
                new { da, dm }).First();

            if (_context.Tipo.Any(t => t.Descripcion == descripcion & t.Nombre == tipo & t.Nombre == dispositivo.dm.Tipo) & dispositivo.dm.ConsumoElectrico == consumo & dispositivo.dm.Marca == marca)
            {
                ClienteHaUsado cliente = new ClienteHaUsado();
                cliente.IdCliente = idcliente;
                cliente.NSerieDispositivo = nserie;
                _context.ClienteHaUsado.Add(cliente);
                dispositivo.da.IdAposento = idaposento;
                _context.Entry(dispositivo.da).State= EntityState.Modified;
                 await _context.SaveChangesAsync();
                return "dispositivo registrado con exito";
            }
            else {
                return "datos invalidos";
            }
        }



        /**
      * Funcion Delete para eliminar un Administrador
      * @param id
        * @returns una accion del caso sucedido al editar o el adminstrador eliminado
*/
        [HttpDelete("{id}")]
        public async Task<ActionResult<ClienteHaUsado>> DeleteClienteHaUsado(int id)
        {
            var clienteHaUsado = await _context.ClienteHaUsado.FindAsync(id);
            if (clienteHaUsado == null)
            {
                return NotFound();
            }

            _context.ClienteHaUsado.Remove(clienteHaUsado);
            await _context.SaveChangesAsync();

            return clienteHaUsado;
        }

        private bool ClienteHaUsadoExists(int id)
        {
            return _context.ClienteHaUsado.Any(e => e.NSerieDispositivo == id);
        }
    }
}
