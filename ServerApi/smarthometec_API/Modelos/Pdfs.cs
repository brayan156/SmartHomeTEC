using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace smarthometec_API.Modelos
{
    public class Pdfs
    {

        public int idcliente;
        public byte [] pdf_factura { get; set; }
        public byte [] pdf_garantia { get; set; }

    }
}
