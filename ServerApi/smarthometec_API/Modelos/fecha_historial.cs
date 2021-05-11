using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace smarthometec_API.Modelos
{
    public class fecha_historial
    {
        public DispositivoAdquirido da { get; set; }
        public Historial historial { get; set; }
        public  DateTime fecha { get; set; }
    }
}
