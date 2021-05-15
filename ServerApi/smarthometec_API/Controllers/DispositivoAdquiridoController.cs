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
    public class DispositivoAdquiridoController : ControllerBase
    {
        private readonly resthometecdatabaseContext _context;

        public DispositivoAdquiridoController(resthometecdatabaseContext context)
        {
            _context = context;
        }
        /**
       * Funcion Get de DispositivoAdquirido
       * @returns una lista con todos los registros de DispositivoAdquirido
*/
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DispositivoAdquirido>>> GetDispositivoAdquirido()
        {
            return await _context.DispositivoAdquirido.ToListAsync();
        }


        /**
      * Funcion Get de DispositivoAdquirido con parametros de filtro
      * @param id
        * @returns una lista con todos los registros de DispositivoAdquirido que contengan el valor de los
       * atributos de los parametros
*/
        [HttpGet("{id}")]
        public async Task<ActionResult<DispositivoAdquirido>> GetDispositivoAdquirido(int id)
        {
            var dispositivoAdquirido = await _context.DispositivoAdquirido.FindAsync(id);

            if (dispositivoAdquirido == null)
            {
                return NotFound();
            }

            return dispositivoAdquirido;
        }

        /**
      * Funcion Get de DispositivoAdquirido que enciende un dispositivo
      * @param id del dispositivo
        * @returns accion del editar del dispositivo
*/
        [HttpGet("encender/{id}")]
        public async Task<IActionResult> Encender(int id)
        {
            var dispositivoAdquirido = _context.DispositivoAdquirido.First(d => d.NSerie == id);

            if (dispositivoAdquirido.Prendido != true)
            {
                dispositivoAdquirido.Prendido = true;
                dispositivoAdquirido.FechaPrendido = DateTime.Now;
            }

            _context.Entry(dispositivoAdquirido).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DispositivoAdquiridoExists(id))
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
* Funcion Get de DispositivoAdquirido que apaga un dispositivo y crea el historial acorde al tiempo encendido
* @param id del dispositivo
* @returns accion del editar del dispositivo
*/
        [HttpGet("apagar/{id}")]
        public async Task<IActionResult> Apagar(int id)
        {
            var dispositivoAdquirido = _context.DispositivoAdquirido.First(d=> d.NSerie==id);

            if (dispositivoAdquirido.Prendido == true)
            {
                int total_dias = (DateTime.Now - dispositivoAdquirido.FechaPrendido.Value).Days;
                int total_minutos = (DateTime.Now - dispositivoAdquirido.FechaPrendido.Value).Minutes;
                Debug.WriteLine(total_dias);
                Historial historial = new Historial();
                historial.Ano = dispositivoAdquirido.FechaPrendido.Value.Year;
                historial.Mes = dispositivoAdquirido.FechaPrendido.Value.Month;
                historial.Dia = dispositivoAdquirido.FechaPrendido.Value.Day;
                historial.Hora = dispositivoAdquirido.FechaPrendido.Value.Hour;
                historial.NSerie = dispositivoAdquirido.NSerie;
                Debug.WriteLine("llego a crear historial");
                if (_context.Historial.Any(hist => hist.NSerie == historial.NSerie & hist.Ano == historial.Ano & hist.Mes == historial.Mes & hist.Dia == historial.Dia & hist.Hora == historial.Hora))
                {
                    Debug.WriteLine("existe historial primera hora");
                    Historial histo = _context.Historial.First(hist =>
                        hist.NSerie == historial.NSerie & hist.Ano == historial.Ano & hist.Mes == historial.Mes &
                        hist.Dia == historial.Dia & hist.Hora == historial.Hora);
                    if (total_minutos+dispositivoAdquirido.FechaPrendido.Value.Minute <= 60 ) histo.MinutosDeUso += total_minutos;
                    else histo.MinutosDeUso += 60-dispositivoAdquirido.FechaPrendido.Value.Minute;
                    _context.Entry(histo).State = EntityState.Modified;
                }
                else
                {
                    if (dispositivoAdquirido.FechaPrendido.Value.Hour == DateTime.Now.Hour) historial.MinutosDeUso = total_minutos;
                    else historial.MinutosDeUso = 60 - dispositivoAdquirido.FechaPrendido.Value.Minute;
                    Debug.WriteLine("hago historial de la hora en la que estoy");
                    _context.Historial.Add(historial);


                }

                DateTime time = dispositivoAdquirido.FechaPrendido.Value;
                var hora_dia = dispositivoAdquirido.FechaPrendido.Value.Hour+1;
                if (time.Date == DateTime.Today & hora_dia > DateTime.Now.Hour) hora_dia = 24;

                for (int i = total_dias; i >= 0; i--)
                {
                    while (hora_dia < 24)
                    {
                        Debug.WriteLine(hora_dia);
                        Historial h = new Historial();
                        h.Dia = time.Day;
                        h.Mes = time.Month;
                        h.Ano = time.Year;
                        h.Hora = hora_dia;
                        h.NSerie = dispositivoAdquirido.NSerie;
                        if (time.Date == DateTime.Today & hora_dia == DateTime.Now.Hour)
                        {
                            Debug.WriteLine(DateTime.Now);
                            h.MinutosDeUso = DateTime.Now.Minute;
                            hora_dia = 24;
                        }
                        else h.MinutosDeUso = 60;
                        _context.Historial.Add(h);
                        hora_dia++;
                    } 
                    time = time.AddDays(1);
                    hora_dia = 0;
                }
                dispositivoAdquirido.Prendido = false;
            }
            await _context.SaveChangesAsync();

            _context.Entry(dispositivoAdquirido).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DispositivoAdquiridoExists(id))
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
      * Funcion Put de DispositivoAdquirido
      * @param id,DispositivoAdquirido
        * @returns una accion del caso sucedido al editar
*/
        [HttpPut("{id}")]
        public async Task<string> PutDispositivoAdquirido(int id, DispositivoAdquirido dispositivoAdquirido)
        {
            if (id != dispositivoAdquirido.NSerie)
            {
                return "dispositivo incorrecto";
            }

            _context.Entry(dispositivoAdquirido).State = EntityState.Modified;
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DispositivoAdquiridoExists(id))
                {
                    return "dispositivo no existe";
                }
                else
                {
                    return "datos invalidos";
                }
            }

            return "dispositivocambiado";
        }
        /**
      * Funcion Post para agregar un DispositivoAdquirido
      * @param DispositivoAdquirido
        * @returns una accion del caso sucedido al crear o el DispositivoAdquirido creado
*/
        [HttpPost]
        public async Task<ActionResult<DispositivoAdquirido>> PostDispositivoAdquirido(DispositivoAdquirido dispositivoAdquirido)
        {
            _context.DispositivoAdquirido.Add(dispositivoAdquirido);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDispositivoAdquirido", new { id = dispositivoAdquirido.NSerie }, dispositivoAdquirido);
        }




        /**
      * Funcion Delete para eliminar un DispositivoAdquirido
      * @param id del DispositivoAdquirido
        * @returns una accion del caso sucedido al eliminar o el DispositivoAdquirido eliminado
*/
        [HttpDelete("{id}")]
        public async Task<ActionResult<DispositivoAdquirido>> DeleteDispositivoAdquirido(int id)
        {
            var dispositivoAdquirido = await _context.DispositivoAdquirido.FindAsync(id);
            if (dispositivoAdquirido == null)
            {
                return NotFound();
            }

            _context.DispositivoAdquirido.Remove(dispositivoAdquirido);
            await _context.SaveChangesAsync();

            return dispositivoAdquirido;
        }

        private bool DispositivoAdquiridoExists(int id)
        {
            return _context.DispositivoAdquirido.Any(e => e.NSerie == id);
        }
    }
}
