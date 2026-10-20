"use server";

import { redirect } from "next/navigation";
import { createSupabaseSessionClient } from "@/lib/supabase/session";

async function requireAdmin() {
  const supabase = await createSupabaseSessionClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Gagal memverifikasi sesi admin:", error.message);
    redirect("/admin/login");
  }

  if (!data.user) {
    redirect("/admin/login");
  }

  return supabase;
}

function ambilDataProduk(formData) {
  const nama = formData.get("nama");
  const harga = formData.get("harga");
  const kategori = formData.get("kategori");
  const fotoUrl = formData.get("foto_url");
  const deskripsi = formData.get("deskripsi");
  const hargaValid =
    typeof harga === "string" && /^\d+$/.test(harga.trim()) && harga.trim() !== "";
  const hargaAngka = hargaValid ? Number(harga) : NaN;

  if (
    typeof nama !== "string" ||
    !nama.trim() ||
    !Number.isSafeInteger(hargaAngka) ||
    hargaAngka > 2147483647 ||
    hargaAngka < 0 ||
    (kategori !== null && typeof kategori !== "string") ||
    (fotoUrl !== null && typeof fotoUrl !== "string") ||
    (deskripsi !== null && typeof deskripsi !== "string")
  ) {
    return null;
  }

  return {
    nama: nama.trim(),
    harga: hargaAngka,
    kategori: typeof kategori === "string" ? kategori.trim() || null : null,
    foto_url: typeof fotoUrl === "string" ? fotoUrl.trim() || null : null,
    deskripsi: typeof deskripsi === "string" ? deskripsi.trim() || null : null,
  };
}

function idProdukValid(id) {
  return typeof id === "string" && /^[1-9]\d*$/.test(id);
}

export async function masukAdmin(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    redirect("/admin/login?error=login");
  }

  const supabase = await createSupabaseSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Login admin gagal:", error.message);
    redirect("/admin/login?error=login");
  }

  redirect("/admin");
}

export async function keluarAdmin() {
  const supabase = await createSupabaseSessionClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(`Gagal mengakhiri sesi admin: ${error.message}`);
  }

  redirect("/admin/login");
}

export async function gantiPasswordAdmin(formData) {
  const passwordBaru = formData.get("password_baru");
  const konfirmasiPassword = formData.get("konfirmasi_password");

  if (typeof passwordBaru !== "string" || typeof konfirmasiPassword !== "string") {
    redirect("/admin/password?status=input-invalid");
  }

  if (passwordBaru.length < 8) {
    redirect("/admin/password?status=password-too-short");
  }

  if (passwordBaru !== konfirmasiPassword) {
    redirect("/admin/password?status=password-mismatch");
  }

  const supabase = await requireAdmin();

  const { error } = await supabase.auth.updateUser({ password: passwordBaru });

  if (error) {
    console.error("Gagal mengganti password admin:", error.message);
    redirect("/admin/password?status=update-failed");
  }

  redirect("/admin/password?status=success");
}

export async function tambahProduk(formData) {
  const supabase = await requireAdmin();
  const produk = ambilDataProduk(formData);

  if (!produk) {
    redirect("/admin/produk/baru?status=input-invalid");
  }

  const { error } = await supabase.from("produk").insert(produk);

  if (error) {
    console.error("Gagal menambahkan produk:", error.message);
    redirect("/admin/produk/baru?status=save-failed");
  }

  redirect("/admin?status=created");
}

export async function ubahProduk(formData) {
  const supabase = await requireAdmin();
  const id = formData.get("id");
  const produk = ambilDataProduk(formData);

  if (!idProdukValid(id)) {
    redirect("/admin?status=product-not-found");
  }

  if (!produk) {
    redirect(`/admin/produk/${id}/ubah?status=input-invalid`);
  }

  const { data, error } = await supabase
    .from("produk")
    .update(produk)
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Gagal mengubah produk:", error.message);
    redirect(`/admin/produk/${id}/ubah?status=save-failed`);
  }

  if (!data) {
    redirect("/admin?status=product-not-found");
  }

  redirect("/admin?status=updated");
}

export async function hapusProduk(formData) {
  const supabase = await requireAdmin();
  const id = formData.get("id");

  if (!idProdukValid(id)) {
    redirect("/admin?status=product-not-found");
  }

  const { data, error } = await supabase
    .from("produk")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Gagal menghapus produk:", error.message);
    redirect("/admin?status=delete-failed");
  }

  if (!data) {
    redirect("/admin?status=product-not-found");
  }

  redirect("/admin?status=deleted");
}
