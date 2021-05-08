using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace smarthometec_API.Modelos
{
    public partial class Administrador
    {
        public int Id { get; set; }
        public string Contrasena { get; set; }
        public string Email { get; set; }
    }
}
