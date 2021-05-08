using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace smarthometec_API.Modelos
{
    public partial class ClienteHaUsado
    {
        public int NSerieDispositivo { get; set; }
        public int IdCliente { get; set; }
        public bool? PropietarioActual { get; set; }

        public virtual Cliente IdClienteNavigation { get; set; }
        public virtual DispositivoAdquirido NSerieDispositivoNavigation { get; set; }
    }
}
