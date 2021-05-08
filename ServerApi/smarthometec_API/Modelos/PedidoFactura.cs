using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace smarthometec_API.Modelos
{
    public partial class PedidoFactura
    {
        public int IdPedido { get; set; }
        public int NFactura { get; set; }

        public virtual Pedido IdPedidoNavigation { get; set; }
        public virtual Factura NFacturaNavigation { get; set; }
    }
}
