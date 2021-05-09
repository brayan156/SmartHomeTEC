using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace smarthometec_API.Modelos
{
    public partial class Historial
    {
        public int NHistorial { get; set; }
        public int NSerie { get; set; }
        public int? Dia { get; set; }
        public int? Mes { get; set; }
        public int? Ano { get; set; }
        public int? Hora { get; set; }
        public int? MinutosDeUso { get; set; }

        public virtual DispositivoAdquirido NSerieNavigation { get; set; }
    }
}
