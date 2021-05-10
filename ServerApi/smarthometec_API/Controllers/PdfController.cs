using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Reflection;
using System.Text;
using AspNetCore.Reporting;
using System.Diagnostics;
using System.Data;
using smarthometec_API.reportes;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace smarthometec_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PdfController : ControllerBase
    {

        

        // POST api/<PdfController>
        [HttpPost("consumo_tipo/{nombre}/{apellido1}/{apellido2}")]
        public FileContentResult consumoTipo(List<dynamic> datos, string nombre, string apellido1, string apellido2)
        {


            DataSet1 ds = new DataSet1(); ;
            DataTable t = ds.Tables.Add("Items");
            DataRow r;



            t.Columns.Add("tipo_de_dispositivo", Type.GetType("System.String"));
            t.Columns.Add("cantidad_de_uso", Type.GetType("System.String"));

            foreach (var tp in datos)
            {
                Debug.WriteLine("otro mas");
                r = t.NewRow();
                r["tipo_de_dispositivo"] = tp.tipo;
                r["cantidad_de_uso"] = tp.uso;
                t.Rows.Add(r);
            }

            string nombrereporte = "Usodetipos";


            var returnString = GenerateReportAsync(nombrereporte, t,  nombre,  apellido1,  apellido2);
            return File(returnString, System.Net.Mime.MediaTypeNames.Application.Octet, nombrereporte + ".pdf");

        }


        public byte[] GenerateReportAsync(string reportName, DataTable datos, string nombre, string apellido1, string apellido2)
        {
            string fileDirPath = Assembly.GetExecutingAssembly().Location.Replace("smarthometec_API.dll", string.Empty);
            string rdlcFilePath = string.Format("{0}reportes\\{1}.rdlc", fileDirPath, reportName);
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            Encoding.GetEncoding("windows-1252");
            LocalReport report = new LocalReport(rdlcFilePath);


            Debug.WriteLine("llego aca");
            
            report.AddDataSource("DataSet1", datos);
            parameters.Add("nombre", nombre + " " + apellido1 + " " + apellido2);
            var result = report.Execute(GetRenderType("pdf"), 1, parameters);
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



    }
}
