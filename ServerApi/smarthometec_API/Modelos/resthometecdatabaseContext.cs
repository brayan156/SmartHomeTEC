using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace smarthometec_API.Modelos
{
    public partial class resthometecdatabaseContext : DbContext
    {
        public resthometecdatabaseContext()
        {
        }

        public resthometecdatabaseContext(DbContextOptions<resthometecdatabaseContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Administrador> Administrador { get; set; }
        public virtual DbSet<Aposento> Aposento { get; set; }
        public virtual DbSet<CertificadoGarantia> CertificadoGarantia { get; set; }
        public virtual DbSet<Cliente> Cliente { get; set; }
        public virtual DbSet<ClienteHaUsado> ClienteHaUsado { get; set; }
        public virtual DbSet<DireccionEntrega> DireccionEntrega { get; set; }
        public virtual DbSet<DispositivoAdquirido> DispositivoAdquirido { get; set; }
        public virtual DbSet<DispositivoModelo> DispositivoModelo { get; set; }
        public virtual DbSet<DispositivoSeVendeEn> DispositivoSeVendeEn { get; set; }
        public virtual DbSet<Distribuidor> Distribuidor { get; set; }
        public virtual DbSet<Factura> Factura { get; set; }
        public virtual DbSet<Historial> Historial { get; set; }
        public virtual DbSet<Pedido> Pedido { get; set; }
        public virtual DbSet<PedidoFactura> PedidoFactura { get; set; }
        public virtual DbSet<Regiones> Regiones { get; set; }
        public virtual DbSet<Tipo> Tipo { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseNpgsql("Host=localhost;Database=resthometecdatabase;Username=postgres;Password=12345");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Administrador>(entity =>
            {
                entity.ToTable("administrador");

                entity.HasIndex(e => e.Email)
                    .HasName("administrador_email_key")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Contrasena)
                    .IsRequired()
                    .HasColumnName("contrasena")
                    .HasMaxLength(15);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasColumnName("email")
                    .HasMaxLength(20);
            });

            modelBuilder.Entity<Aposento>(entity =>
            {
                entity.ToTable("aposento");

                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();

                entity.Property(e => e.IdCliente).HasColumnName("id_cliente");

                entity.Property(e => e.NombreCuarto)
                    .IsRequired()
                    .HasColumnName("nombre_cuarto")
                    .HasMaxLength(20);

                entity.HasOne(d => d.IdClienteNavigation)
                    .WithMany(p => p.Aposento)
                    .HasForeignKey(d => d.IdCliente)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("aposento_id_cliente_fkey");
            });

            modelBuilder.Entity<CertificadoGarantia>(entity =>
            {
                entity.HasKey(e => new { e.NFactura, e.MesFinGarantia, e.AnoFinGarantia })
                    .HasName("certificado_garantia_pkey");

                entity.ToTable("certificado_garantia");

                entity.HasIndex(e => e.NFactura)
                    .HasName("certificado_garantia_n_factura_key")
                    .IsUnique();

                entity.Property(e => e.NFactura).HasColumnName("n_factura");

                entity.Property(e => e.MesFinGarantia).HasColumnName("mes_fin_garantia");

                entity.Property(e => e.AnoFinGarantia).HasColumnName("ano_fin_garantia");

                entity.HasOne(d => d.NFacturaNavigation)
                    .WithOne(p => p.CertificadoGarantia)
                    .HasForeignKey<CertificadoGarantia>(d => d.NFactura)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("certificado_garantia_n_factura_fkey");
            });

            modelBuilder.Entity<Cliente>(entity =>
            {
                entity.ToTable("cliente");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Contrasena)
                    .IsRequired()
                    .HasColumnName("contrasena")
                    .HasMaxLength(15);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasColumnName("email")
                    .HasMaxLength(20);

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasColumnName("nombre")
                    .HasMaxLength(15);

                entity.Property(e => e.Pais)
                    .IsRequired()
                    .HasColumnName("pais")
                    .HasMaxLength(20);

                entity.Property(e => e.PrimerApellido)
                    .HasColumnName("primer_apellido")
                    .HasMaxLength(15);

                entity.Property(e => e.SegundoApellido)
                    .HasColumnName("segundo_apellido")
                    .HasMaxLength(15);

                entity.HasOne(d => d.PaisNavigation)
                    .WithMany(p => p.Cliente)
                    .HasForeignKey(d => d.Pais)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("cliente_pais_fkey");
            });

            modelBuilder.Entity<ClienteHaUsado>(entity =>
            {
                entity.HasKey(e => new { e.NSerieDispositivo, e.IdCliente })
                    .HasName("cliente_ha_usado_pkey");

                entity.ToTable("cliente_ha_usado");

                entity.Property(e => e.NSerieDispositivo).HasColumnName("n_serie_dispositivo");

                entity.Property(e => e.IdCliente).HasColumnName("id_cliente");

                entity.Property(e => e.PropietarioActual)
                    .HasColumnName("propietario_actual")
                    .HasDefaultValueSql("true");

                entity.HasOne(d => d.IdClienteNavigation)
                    .WithMany(p => p.ClienteHaUsado)
                    .HasForeignKey(d => d.IdCliente)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("cliente_ha_usado_id_cliente_fkey");

                entity.HasOne(d => d.NSerieDispositivoNavigation)
                    .WithMany(p => p.ClienteHaUsado)
                    .HasForeignKey(d => d.NSerieDispositivo)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("cliente_ha_usado_n_serie_dispositivo_fkey");
            });

            modelBuilder.Entity<DireccionEntrega>(entity =>
            {
                entity.HasKey(e => new { e.DireccionEntrega1, e.IdCliente })
                    .HasName("direccion_entrega_pkey");

                entity.ToTable("direccion_entrega");

                entity.Property(e => e.DireccionEntrega1)
                    .HasColumnName("direccion_entrega")
                    .HasMaxLength(20);

                entity.Property(e => e.IdCliente).HasColumnName("id_cliente");

                entity.HasOne(d => d.IdClienteNavigation)
                    .WithMany(p => p.DireccionEntrega)
                    .HasForeignKey(d => d.IdCliente)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("direccion_entrega_id_cliente_fkey");
            });

            modelBuilder.Entity<DispositivoAdquirido>(entity =>
            {
                entity.HasKey(e => e.NSerie)
                    .HasName("dispositivo_adquirido_pkey");

                entity.ToTable("dispositivo_adquirido");

                entity.Property(e => e.NSerie).HasColumnName("n_serie").ValueGeneratedOnAdd();

                entity.Property(e => e.IdAposento).HasColumnName("id_aposento");

                entity.Property(e => e.Modelo)
                    .IsRequired()
                    .HasColumnName("modelo")
                    .HasMaxLength(15);

                entity.Property(e => e.Prendido)
                    .HasColumnName("prendido")
                    .HasDefaultValueSql("false");

                entity.HasOne(d => d.IdAposentoNavigation)
                    .WithMany(p => p.DispositivoAdquirido)
                    .HasForeignKey(d => d.IdAposento)
                    .HasConstraintName("dispositivo_adquirido_id_aposento_fkey");

                entity.HasOne(d => d.ModeloNavigation)
                    .WithMany(p => p.DispositivoAdquirido)
                    .HasForeignKey(d => d.Modelo)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("dispositivo_adquirido_modelo_fkey");
            });

            modelBuilder.Entity<DispositivoModelo>(entity =>
            {
                entity.HasKey(e => e.Modelo)
                    .HasName("dispositivo_modelo_pkey");

                entity.ToTable("dispositivo_modelo");

                entity.Property(e => e.Modelo)
                    .HasColumnName("modelo")
                    .HasMaxLength(15);

                entity.Property(e => e.ConsumoElectrico).HasColumnName("consumo_electrico");

                entity.Property(e => e.Imagen)
                    .HasColumnName("imagen")
                    .HasMaxLength(200);

                entity.Property(e => e.Marca)
                    .HasColumnName("marca")
                    .HasMaxLength(15);

                entity.Property(e => e.Tipo)
                    .HasColumnName("tipo")
                    .HasMaxLength(15);

                entity.HasOne(d => d.TipoNavigation)
                    .WithMany(p => p.DispositivoModelo)
                    .HasForeignKey(d => d.Tipo)
                    .HasConstraintName("dispositivo_modelo_tipo_fkey");
            });

            modelBuilder.Entity<DispositivoSeVendeEn>(entity =>
            {
                entity.HasKey(e => new { e.CjDistribuidor, e.ModeloDispotivo })
                    .HasName("dispositivo_se_vende_en_pkey");

                entity.ToTable("dispositivo_se_vende_en");

                entity.Property(e => e.CjDistribuidor).HasColumnName("cj_distribuidor");

                entity.Property(e => e.ModeloDispotivo)
                    .HasColumnName("modelo_dispotivo")
                    .HasMaxLength(15);

                entity.Property(e => e.Cantidad).HasColumnName("cantidad");

                entity.Property(e => e.Precio).HasColumnName("precio");

                entity.HasOne(d => d.CjDistribuidorNavigation)
                    .WithMany(p => p.DispositivoSeVendeEn)
                    .HasForeignKey(d => d.CjDistribuidor)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("dispositivo_se_vende_en_cj_distribuidor_fkey");

                entity.HasOne(d => d.ModeloDispotivoNavigation)
                    .WithMany(p => p.DispositivoSeVendeEn)
                    .HasForeignKey(d => d.ModeloDispotivo)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("dispositivo_se_vende_en_modelo_dispotivo_fkey");
            });

            modelBuilder.Entity<Distribuidor>(entity =>
            {
                entity.HasKey(e => e.CedulaJuridica)
                    .HasName("distribuidor_pkey");

                entity.ToTable("distribuidor");

                entity.Property(e => e.CedulaJuridica)
                    .HasColumnName("cedula_juridica")
                    .ValueGeneratedNever();

                entity.Property(e => e.Imagen)
                    .IsRequired()
                    .HasColumnName("imagen")
                    .HasMaxLength(200);

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasColumnName("nombre")
                    .HasMaxLength(15);

                entity.Property(e => e.Pais)
                    .IsRequired()
                    .HasColumnName("pais")
                    .HasMaxLength(20);

                entity.HasOne(d => d.PaisNavigation)
                    .WithMany(p => p.Distribuidor)
                    .HasForeignKey(d => d.Pais)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("distribuidor_pais_fkey");
            });

            modelBuilder.Entity<Factura>(entity =>
            {
                entity.HasKey(e => e.NFactura)
                    .HasName("factura_pkey");

                entity.ToTable("factura");

                entity.Property(e => e.NFactura).HasColumnName("n_factura").ValueGeneratedOnAdd();

                entity.Property(e => e.Ano)
                    .HasColumnName("ano")
                    .HasDefaultValueSql("date_part('year'::text, CURRENT_DATE)");

                entity.Property(e => e.Dia)
                    .HasColumnName("dia")
                    .HasDefaultValueSql("date_part('day'::text, CURRENT_DATE)");

                entity.Property(e => e.Mes)
                    .HasColumnName("mes")
                    .HasDefaultValueSql("date_part('month'::text, CURRENT_DATE)");
            });

            modelBuilder.Entity<Historial>(entity =>
            {
                entity.HasKey(e => new { e.NHistorial, e.NSerie })
                    .HasName("historial_pkey");

                entity.ToTable("historial");

                entity.Property(e => e.NHistorial)
                    .HasColumnName("n_historial")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.NSerie).HasColumnName("n_serie");

                entity.Property(e => e.Ano)
                    .HasColumnName("ano")
                    .HasDefaultValueSql("date_part('year'::text, CURRENT_DATE)");

                entity.Property(e => e.Dia)
                    .HasColumnName("dia")
                    .HasDefaultValueSql("date_part('day'::text, CURRENT_DATE)");

                entity.Property(e => e.MinutosDeUso)
                    .HasColumnName("horas_de_uso")
                    .HasDefaultValueSql("0");

                entity.Property(e => e.Mes)
                    .HasColumnName("mes")
                    .HasDefaultValueSql("date_part('month'::text, CURRENT_DATE)");

                entity.HasOne(d => d.NSerieNavigation)
                    .WithMany(p => p.Historial)
                    .HasForeignKey(d => d.NSerie)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("historial_n_serie_fkey");
            });

            modelBuilder.Entity<Pedido>(entity =>
            {
                entity.ToTable("pedido");

                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();

                entity.Property(e => e.IdCliente).HasColumnName("id_cliente");

                entity.Property(e => e.Monto).HasColumnName("monto");

                entity.Property(e => e.NSerieDispositivo).HasColumnName("n_serie_dispositivo");

                entity.HasOne(d => d.IdClienteNavigation)
                    .WithMany(p => p.Pedido)
                    .HasForeignKey(d => d.IdCliente)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("pedido_id_cliente_fkey");

                entity.HasOne(d => d.NSerieDispositivoNavigation)
                    .WithMany(p => p.Pedido)
                    .HasForeignKey(d => d.NSerieDispositivo)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("pedido_n_serie_dispositivo_fkey");
            });

            modelBuilder.Entity<PedidoFactura>(entity =>
            {
                entity.HasKey(e => new { e.IdPedido, e.NFactura })
                    .HasName("pedido_factura_pkey");

                entity.ToTable("pedido_factura");

                entity.HasIndex(e => e.IdPedido)
                    .HasName("pedido_factura_id_pedido_key")
                    .IsUnique();

                entity.HasIndex(e => e.NFactura)
                    .HasName("pedido_factura_n_factura_key")
                    .IsUnique();

                entity.Property(e => e.IdPedido).HasColumnName("id_pedido");

                entity.Property(e => e.NFactura).HasColumnName("n_factura")
                    .ValueGeneratedOnAdd();

                entity.HasOne(d => d.IdPedidoNavigation)
                    .WithOne(p => p.PedidoFactura)
                    .HasForeignKey<PedidoFactura>(d => d.IdPedido)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("pedido_factura_id_pedido_fkey");

                entity.HasOne(d => d.NFacturaNavigation)
                    .WithOne(p => p.PedidoFactura)
                    .HasForeignKey<PedidoFactura>(d => d.NFactura)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("pedido_factura_n_factura_fkey");
            });

            modelBuilder.Entity<Regiones>(entity =>
            {
                entity.HasKey(e => e.Pais)
                    .HasName("regiones_pkey");

                entity.ToTable("regiones");

                entity.Property(e => e.Pais)
                    .HasColumnName("pais")
                    .HasMaxLength(20);

                entity.Property(e => e.Continente)
                    .IsRequired()
                    .HasColumnName("continente")
                    .HasMaxLength(15);
            });

            modelBuilder.Entity<Tipo>(entity =>
            {
                entity.HasKey(e => e.Nombre)
                    .HasName("tipo_pkey");

                entity.ToTable("tipo");

                entity.Property(e => e.Nombre)
                    .HasColumnName("nombre")
                    .HasMaxLength(15);

                entity.Property(e => e.Descripcion)
                    .HasColumnName("descripcion")
                    .HasMaxLength(50);

                entity.Property(e => e.Imagen)
                    .HasColumnName("imagen")
                    .HasMaxLength(200);

                entity.Property(e => e.TiempoDeGarantia).HasColumnName("tiempo_de_garantia");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
