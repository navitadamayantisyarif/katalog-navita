import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createSupabaseSessionClient } from "@/lib/supabase/session";

const pesanStatus = {
  created: "Produk berhasil ditambahkan.",
  updated: "Produk berhasil diperbarui.",
  deleted: "Produk berhasil dihapus.",
  "delete-failed": "Produk gagal dihapus. Silakan coba lagi.",
  "product-not-found": "Produk tidak ditemukan atau sudah tidak tersedia.",
};

export default async function HalamanAdmin({ searchParams }) {
  const { status } = await searchParams;
  const supabase = await createSupabaseSessionClient();
  const { data: daftarProduk, error } = await supabase
    .from("produk")
    .select("id, nama, harga, foto_url, kategori")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil daftar produk admin:", error.message);
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>
      {pesanStatus[status] && (
        <p
          role={status === "created" || status === "updated" || status === "deleted" ? "status" : "alert"}
          className={`text-sm ${
            status === "created" || status === "updated" || status === "deleted"
              ? "text-utama"
              : "text-bahaya"
          }`}
        >
          {pesanStatus[status]}
        </p>
      )}
      {error ? (
        <p role="alert" className="text-sm text-bahaya">
          Daftar produk gagal dimuat. Silakan muat ulang halaman atau coba lagi nanti.
        </p>
      ) : daftarProduk.length === 0 ? (
        <p className="text-teks-lembut">Belum ada produk.</p>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
