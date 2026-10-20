"use client";

import { useState, useTransition } from "react";
import { buatDeskripsiProduk } from "@/app/admin/actions";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

export default function DeskripsiProdukAI({ initialValue = "" }) {
  const [deskripsi, setDeskripsi] = useState(initialValue);
  const [pesan, setPesan] = useState("");
  const [terjadiError, setTerjadiError] = useState(false);
  const [sedangMembuat, startTransition] = useTransition();

  function buatDeskripsi(event) {
    const form = event.currentTarget.form;
    const dataForm = new FormData(form);
    const nama = dataForm.get("nama");
    const kategori = dataForm.get("kategori");

    setPesan("");
    setTerjadiError(false);
    startTransition(async () => {
      const hasil = await buatDeskripsiProduk(nama, kategori);

      if (hasil.error) {
        setPesan(hasil.error);
        setTerjadiError(true);
        return;
      }

      setDeskripsi(hasil.deskripsi);
      setPesan("Deskripsi dibuat. Periksa kembali sebelum menyimpan produk.");
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <Input
        label="Deskripsi"
        name="deskripsi"
        textarea
        value={deskripsi}
        onChange={(event) => setDeskripsi(event.target.value)}
      />
      <Tombol type="button" varian="garis" onClick={buatDeskripsi} disabled={sedangMembuat}>
        {sedangMembuat ? "Membuat deskripsi..." : "Buat deskripsi dengan AI"}
      </Tombol>
      {pesan && (
        <p role={terjadiError ? "alert" : "status"} className={`text-sm ${terjadiError ? "text-bahaya" : "text-teks-lembut"}`}>
          {pesan}
        </p>
      )}
    </div>
  );
}
