using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using AspNetCore.Reporting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using smarthometec_API.Modelos;
using smarthometec_API.reportes;

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
        [HttpPut()]
        public async Task<IActionResult> PutDispositivoSeVendeEn( DispositivoSeVendeEn dispositivoSeVendeEn)
        {

            _context.Entry(dispositivoSeVendeEn).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
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


        [HttpPost("excel")]
        public async Task<ActionResult<IEnumerable<DispositivoSeVendeEn>>> posttodos(DispositivoSeVendeEn[] dispositivoSeVendeEn)
        {

            _context.DispositivoSeVendeEn.RemoveRange(_context.DispositivoSeVendeEn.ToList());
            _context.DispositivoSeVendeEn.AddRange(dispositivoSeVendeEn);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                    return Conflict();        
              
            }

            return _context.DispositivoSeVendeEn.ToList();
        }




        static public List<Pdfs> pdfslista = new List<Pdfs>();

        [HttpPost("comprar/{idcliente}")]
        public dynamic comprar(int idcliente, DispositivoSeVendeEn dispositivoSeVendeEn)
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
            DispositivoModelo modelo = _context.DispositivoModelo.Find(dispositivoSeVendeEn.ModeloDispotivo);
            Tipo tipo = _context.Tipo.Find(modelo.Tipo);
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





            Dictionary<string, string> parametersFactura = new Dictionary<string, string>();
            parametersFactura.Add("fechacompra", factura.Dia + "/" + factura.Mes + "/" + factura.Ano);
            parametersFactura.Add("nfactura", factura.NFactura + "");
            parametersFactura.Add("tipo", tipo.Nombre);
            parametersFactura.Add("modelo", adquirido.Modelo);
            parametersFactura.Add("precio", dispositivoSeVendeEn.Precio + "");




            facturaset ds = new facturaset(); ;
            DataTable t = ds.Tables.Add("Items");
            DataRow r;


            t.Columns.Add("fechacompra", Type.GetType("System.String"));
            t.Columns.Add("nfactura", Type.GetType("System.String"));
            t.Columns.Add("tipo", Type.GetType("System.String"));
            t.Columns.Add("modelo", Type.GetType("System.String"));
            t.Columns.Add("precio", Type.GetType("System.String"));


            Debug.WriteLine("otro mas");
            r = t.NewRow();
            r["fechacompra"]= factura.Dia + "/" + factura.Mes + "/" + factura.Ano;
            r["nfactura"]= factura.NFactura + "";
            r["tipo"]= tipo.Nombre;
            r["modelo"]= adquirido.Modelo;
            r["precio"]= dispositivoSeVendeEn.Precio + "";


            t.Rows.Add(r);




            string nombrereportefactura = "Factura";

            var stringfactura = GenerateReportAsync(nombrereportefactura, t);
           // var juan = File(stringfactura, System.Net.Mime.MediaTypeNames.Application.Octet, nombrereportefactura + ".pdf");
            // SendIt(stringfactura, nombrereportefactura);

            Cliente cliente = _context.Cliente.Find(idcliente);




            garantiaset dsg = new garantiaset(); ;
            DataTable t2 = dsg.Tables.Add("Items");
            DataRow r2;


            t2.Columns.Add("nombre", Type.GetType("System.String"));
            t2.Columns.Add("fechacompra", Type.GetType("System.String"));
            t2.Columns.Add("fechafin", Type.GetType("System.String"));
            t2.Columns.Add("nserie", Type.GetType("System.String"));
            t2.Columns.Add("tipo", Type.GetType("System.String"));
            t2.Columns.Add("modelo", Type.GetType("System.String"));
            t2.Columns.Add("marca", Type.GetType("System.String"));

            Debug.WriteLine("otro mas");
            r2 = t2.NewRow();
            r2["nombre"] = cliente.Nombre + " " + cliente.PrimerApellido + " " + cliente.SegundoApellido;
            r2["fechacompra"] = "" + factura.Dia + "/" + factura.Mes + "/" + factura.Ano;
            r2["fechafin"] = certificado.MesFinGarantia + "/" + certificado.AnoFinGarantia;
            r2["nserie"] = pedido.NSerieDispositivo + "";
            r2["tipo"] = modelo.Tipo;
            r2["modelo"] = modelo.Modelo;
            r2["marca"] = modelo.Marca;

            t2.Rows.Add(r2);




            string nombrereportegarantia = "Garantia";

            byte[] pdfcertificado = GenerateReportAsync(nombrereportegarantia, t2);
         //   var file = File(pdfcertificado, System.Net.Mime.MediaTypeNames.Application.Octet, nombrereportegarantia + ".pdf");

            enviaremail(stringfactura, pdfcertificado,cliente.Email);






            //Pdfs pdfs = new Pdfs();
            //pdfs.pdf_factura = stringfactura;
            //pdfs.idcliente = idcliente;
            //pdfslista.Add(pdfs);
           // Debug.WriteLine(pdfslista.First(pdfs => pdfs.idcliente == idcliente).idcliente);

            return new { pedido, factura, certificado };
        }

            private void enviaremail(byte[] pdfFactura, byte[] pdfCertificado, string email)
        {


            var fromAddress = "smarthometecbjt@gmail.com";
            var toAddress = email;
            //Password of your gmail address
            const string fromPassword = "1seguridad.";
            // smtp settings
            var smtp = new SmtpClient();
            
                
                smtp.Host = "smtp.gmail.com";
                smtp.Port = 587;
                smtp.EnableSsl = true;
                smtp.UseDefaultCredentials = false;
                smtp.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;
                smtp.Credentials = new NetworkCredential(fromAddress, fromPassword);
                smtp.Timeout = 50000;
            
            var msg = new MailMessage();

            MailAddress ma = new MailAddress(fromAddress);
            msg.To.Add(toAddress);
            msg.From = ma;
            msg.Attachments.Add(new Attachment(new MemoryStream(pdfFactura), "Factura"+".pdf"));
            msg.Attachments.Add(new Attachment(new MemoryStream(pdfCertificado), "Garantia" + ".pdf"));
            msg.Body = "compra realizada";
            msg.Subject = "adjuntado los pdf de su compra";
            smtp.Send(msg);
        }


        public  byte[] GenerateReportAsync(string reportName, DataTable t)
        {
            string fileDirPath = Assembly.GetExecutingAssembly().Location.Replace("smarthometec_API.dll", string.Empty);
            string rdlcFilePath = string.Format("{0}reportes\\{1}.rdlc", fileDirPath, reportName);

            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            Encoding.GetEncoding("windows-1252");
            LocalReport report = new LocalReport(rdlcFilePath);
            

            Debug.WriteLine("llego aca");
            report.AddDataSource("DataSet1", t);
            var result = report.Execute(GetRenderType("pdf"));
            return result.MainStream;
        }

            private RenderType GetRenderType(string reportType)
        {
            var renderType = RenderType.Pdf;
            switch (reportType.ToLower())
            {
                default:
                case "pdf":
                    renderType = RenderType.Pdf;
                    break;
                case "word":
                    renderType = RenderType.Word;
                    break;
                case "excel":
                    renderType = RenderType.Excel;
                    break;
            }

            return renderType;
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
