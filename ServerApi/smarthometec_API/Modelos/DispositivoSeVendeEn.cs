using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace smarthometec_API.Modelos
{
    public partial class DispositivoSeVendeEn
    {
        public int CjDistribuidor { get; set; }
        public string ModeloDispotivo { get; set; }
        public int Precio { get; set; }
        public int Cantidad { get; set; }

        public virtual Distribuidor CjDistribuidorNavigation { get; set; }
        public virtual DispositivoModelo ModeloDispotivoNavigation { get; set; }
    }
}
