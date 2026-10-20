import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { tambahProduk } from "@/app/admin/actions";

const pesanStatus = {
  "input-invalid": "Data produk tidak valid. Periksa nama dan harga produk.",
  "save-failed": "Produk gagal disimpan. Silakan coba lagi.",
};

export default async function HalamanTambahProduk({ searchParams }) {
  const { status } = await searchParams;

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Tambah produk</h1>
      {pesanStatus[status] && (
        <p role="alert" className="text-sm text-bahaya">
          {pesanStatus[status]}
        </p>
      )}
      <FormProduk action={tambahProduk} labelTombol="Simpan produk" />
    </div>
  );
}
