"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState("1");
  const jumlahAngka = Number(jumlah);
  const totalHarga = produk.harga * jumlahAngka;
  const jumlahValid =
    Number.isSafeInteger(jumlahAngka) &&
    jumlahAngka > 0 &&
    Number.isSafeInteger(totalHarga);
  const nomorWhatsApp = toko.nomorWhatsApp.replace(/\D/g, "").replace(/^0/, "62");
  const pesan = `Halo, saya ingin memesan ${produk.nama} sebanyak ${jumlahAngka} dengan total harga ${formatRupiah(totalHarga)}.`;
  const urlWhatsApp = `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col items-start gap-3">
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Jumlah
        <input
          type="number"
          min="1"
          step="1"
          required
          value={jumlah}
          onChange={(event) => setJumlah(event.target.value)}
          className="w-28 rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none"
        />
      </label>
      <a
        href={jumlahValid ? urlWhatsApp : undefined}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!jumlahValid}
        onClick={(event) => {
          if (!jumlahValid) event.preventDefault();
        }}
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp
      </a>
    </div>
  );
}
