using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace smarthometec_API.Modelos
{
    public partial class DispositivoModelo
    {
        public DispositivoModelo()
        {
            DispositivoAdquirido = new HashSet<DispositivoAdquirido>();
            DispositivoSeVendeEn = new HashSet<DispositivoSeVendeEn>();
        }

        public string Modelo { get; set; }
        public string Marca { get; set; }
        public string Imagen { get; set; }
        public int ConsumoElectrico { get; set; }
        public string Tipo { get; set; }

        public virtual Tipo TipoNavigation { get; set; }
        public virtual ICollection<DispositivoAdquirido> DispositivoAdquirido { get; set; }
        public virtual ICollection<DispositivoSeVendeEn> DispositivoSeVendeEn { get; set; }
    }
}
