using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace smarthometec_API.Modelos
{
    public partial class CertificadoGarantia
    {
        public int NFactura { get; set; }
        public int MesFinGarantia { get; set; }
        public int AnoFinGarantia { get; set; }

        public virtual Factura NFacturaNavigation { get; set; }
    }
}
