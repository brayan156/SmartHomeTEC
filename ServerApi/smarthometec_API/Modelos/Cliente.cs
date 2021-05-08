using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace smarthometec_API.Modelos
{
    public partial class Cliente
    {
        public Cliente()
        {
            Aposento = new HashSet<Aposento>();
            ClienteHaUsado = new HashSet<ClienteHaUsado>();
            DireccionEntrega = new HashSet<DireccionEntrega>();
            Pedido = new HashSet<Pedido>();
        }

        public int Id { get; set; }
        public string Email { get; set; }
        public string Contrasena { get; set; }
        public string PrimerApellido { get; set; }
        public string SegundoApellido { get; set; }
        public string Nombre { get; set; }
        public string Pais { get; set; }

        public virtual Regiones PaisNavigation { get; set; }
        public virtual ICollection<Aposento> Aposento { get; set; }
        public virtual ICollection<ClienteHaUsado> ClienteHaUsado { get; set; }
        public virtual ICollection<DireccionEntrega> DireccionEntrega { get; set; }
        public virtual ICollection<Pedido> Pedido { get; set; }
    }
}
