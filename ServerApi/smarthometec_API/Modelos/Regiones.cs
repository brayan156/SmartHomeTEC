using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace smarthometec_API.Modelos
{
    public partial class Regiones
    {
        public Regiones()
        {
            Cliente = new HashSet<Cliente>();
            Distribuidor = new HashSet<Distribuidor>();
        }

        public string Pais { get; set; }
        public string Continente { get; set; }

        public virtual ICollection<Cliente> Cliente { get; set; }
        public virtual ICollection<Distribuidor> Distribuidor { get; set; }
    }
}
