using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace smarthometec_API.Modelos
{
    public partial class Distribuidor
    {
        public Distribuidor()
        {
            DispositivoSeVendeEn = new HashSet<DispositivoSeVendeEn>();
        }

        public int CedulaJuridica { get; set; }
        public string Pais { get; set; }
        public string Nombre { get; set; }
        public string Imagen { get; set; }

        public virtual Regiones PaisNavigation { get; set; }
        public virtual ICollection<DispositivoSeVendeEn> DispositivoSeVendeEn { get; set; }
    }
}
