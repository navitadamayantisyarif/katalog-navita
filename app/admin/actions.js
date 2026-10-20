"use server";

import { redirect } from "next/navigation";
import { createSupabaseSessionClient } from "@/lib/supabase/session";

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

  const supabase = await createSupabaseSessionClient();
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data.user) {
    redirect("/admin/password?status=session-invalid");
  }

  const { error } = await supabase.auth.updateUser({ password: passwordBaru });

  if (error) {
    console.error("Gagal mengganti password admin:", error.message);
    redirect("/admin/password?status=update-failed");
  }

  redirect("/admin/password?status=success");
}
