import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { ubahProduk } from "@/app/admin/actions";
import { createSupabaseSessionClient } from "@/lib/supabase/session";

const pesanStatus = {
  "input-invalid": "Data produk tidak valid. Periksa nama dan harga produk.",
  "save-failed": "Perubahan produk gagal disimpan. Silakan coba lagi.",
};

export default async function HalamanUbahProduk({ params, searchParams }) {
  const { id } = await params;
  const { status } = await searchParams;
  const supabase = await createSupabaseSessionClient();
  const { data: produk, error } = await supabase
    .from("produk")
    .select("id, nama, harga, deskripsi, foto_url, kategori")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Gagal mengambil data produk untuk diubah:", error.message);
    throw new Error("Data produk gagal dimuat. Silakan coba lagi.");
  }

  if (!produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      {pesanStatus[status] && (
        <p role="alert" className="text-sm text-bahaya">
          {pesanStatus[status]}
        </p>
      )}
      <FormProduk action={ubahProduk} produk={produk} labelTombol="Simpan perubahan" />
    </div>
  );
}
