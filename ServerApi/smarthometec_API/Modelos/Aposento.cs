using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace smarthometec_API.Modelos
{
    public partial class Aposento
    {
        public Aposento()
        {
            DispositivoAdquirido = new HashSet<DispositivoAdquirido>();
        }

        public int Id { get; set; }
        public string NombreCuarto { get; set; }
        public int IdCliente { get; set; }

        public virtual Cliente IdClienteNavigation { get; set; }
        public virtual ICollection<DispositivoAdquirido> DispositivoAdquirido { get; set; }
    }
}
