using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace smarthometec_API.Modelos
{
    public partial class DispositivoAdquirido
    {
        public DispositivoAdquirido()
        {
            ClienteHaUsado = new HashSet<ClienteHaUsado>();
            Historial = new HashSet<Historial>();
            Pedido = new HashSet<Pedido>();
        }

        public int NSerie { get; set; }
        public bool? Prendido { get; set; }
        public string Modelo { get; set; }
        public int? IdAposento { get; set; }
        public DateTime? FechaPrendido { get; set; }

        public virtual Aposento IdAposentoNavigation { get; set; }
        public virtual DispositivoModelo ModeloNavigation { get; set; }
        public virtual ICollection<ClienteHaUsado> ClienteHaUsado { get; set; }
        public virtual ICollection<Historial> Historial { get; set; }
        public virtual ICollection<Pedido> Pedido { get; set; }
    }
}
