using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace smarthometec_API.Modelos
{
    public partial class Tipo
    {
        public Tipo()
        {
            DispositivoModelo = new HashSet<DispositivoModelo>();
        }

        public string Nombre { get; set; }
        public int TiempoDeGarantia { get; set; }
        public string Imagen { get; set; }
        public string Descripcion { get; set; }

        public virtual ICollection<DispositivoModelo> DispositivoModelo { get; set; }
    }
}
