import NavAdmin from "@/components/NavAdmin";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { gantiPasswordAdmin } from "@/app/admin/actions";

const pesanStatus = {
  success: { teks: "Password berhasil diganti.", kelas: "text-utama" },
  "input-invalid": { teks: "Isi password baru dan konfirmasinya dengan benar.", kelas: "text-bahaya" },
  "password-too-short": {
    teks: "Password baru harus terdiri dari minimal 8 karakter.",
    kelas: "text-bahaya",
  },
  "password-mismatch": { teks: "Konfirmasi password tidak sama dengan password baru.", kelas: "text-bahaya" },
  "session-invalid": {
    teks: "Sesi admin tidak valid. Silakan masuk kembali.",
    kelas: "text-bahaya",
  },
  "update-failed": {
    teks: "Password gagal diganti. Silakan coba lagi.",
    kelas: "text-bahaya",
  },
};

export default async function HalamanGantiPassword({ searchParams }) {
  const { status } = await searchParams;
  const pesan = pesanStatus[status];

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold">Ganti password</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Ganti password bawaan segera setelah pertama kali masuk. Minimal 8 karakter.
        </p>
      </div>
      <form action={gantiPasswordAdmin} className="flex max-w-sm flex-col gap-4">
        <Input
          label="Password baru"
          name="password_baru"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <Input
          label="Ulangi password baru"
          name="konfirmasi_password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <Tombol type="submit" className="self-start">
          Simpan password
        </Tombol>
      </form>
      {pesan && (
        <p role={status === "success" ? "status" : "alert"} className={`text-sm ${pesan.kelas}`}>
          {pesan.teks}
        </p>
      )}
    </div>
  );
}
