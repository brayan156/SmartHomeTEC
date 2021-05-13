using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace smarthometec_API.Modelos
{
    public partial class Pedido
    {
        public int Id { get; set; }
        public int Monto { get; set; }
        public int IdCliente { get; set; }
        public int NSerieDispositivo { get; set; }

        public virtual Cliente IdClienteNavigation { get; set; }
        public virtual DispositivoAdquirido NSerieDispositivoNavigation { get; set; }
        public virtual PedidoFactura PedidoFactura { get; set; }
    }
}
