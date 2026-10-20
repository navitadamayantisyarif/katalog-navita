"use client";

import { useMemo, useState } from "react";
import KartuProduk from "@/components/KartuProduk";

export default function FilterProduk({ daftarProduk }) {
  const [pencarian, setPencarian] = useState("");
  const [kategoriDipilih, setKategoriDipilih] = useState("");
  const kategori = useMemo(
    () =>
      [...new Set(daftarProduk.map((produk) => produk.kategori).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b, "id")
      ),
    [daftarProduk]
  );
  const produkTersaring = daftarProduk.filter((produk) => {
    const namaCocok = produk.nama.toLocaleLowerCase("id").includes(pencarian.trim().toLocaleLowerCase("id"));
    const kategoriCocok = !kategoriDipilih || produk.kategori === kategoriDipilih;

    return namaCocok && kategoriCocok;
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Cari produk
          <input
            type="search"
            value={pencarian}
            onChange={(event) => setPencarian(event.target.value)}
            placeholder="Nama produk"
            className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Kategori
          <select
            value={kategoriDipilih}
            onChange={(event) => setKategoriDipilih(event.target.value)}
            className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none"
          >
            <option value="">Semua kategori</option>
            {kategori.map((namaKategori) => (
              <option key={namaKategori} value={namaKategori}>
                {namaKategori}
              </option>
            ))}
          </select>
        </label>
      </div>
      {produkTersaring.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {produkTersaring.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      ) : (
        <p className="text-teks-lembut">Tidak ada produk yang sesuai dengan pencarian atau kategori.</p>
      )}
    </div>
  );
}
