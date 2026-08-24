"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabaseUrl = "https://zvydydhdxmivpmmsoietw.supabase.co";
const supabaseAnonKey = "sb_publishable_R06xCVtTHCUo8uejQbhjRA_2almHmeg";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", data.user.id)
        .single();

      if (profile) {
        localStorage.setItem("ask_username", profile.username);
      }
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl text-white dir-rtl">
        <h1 className="text-3xl font-black text-center mb-2 tracking-wide">
          تسجيل الدخول 🔑
        </h1>
        <p className="text-center text-rose-100 text-sm mb-6">
          أهلاً بعودتك! ادخل لمتابعة رسائلك
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/30 border border-red-400/40 rounded-xl text-xs text-red-100 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-rose-100">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full p-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-rose-400 dir-ltr text-left"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-rose-100">
              كلمة المرور
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-rose-400 dir-ltr text-left"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white text-rose-600 font-bold rounded-xl shadow-lg hover:bg-rose-50 transition duration-200 disabled:opacity-50 mt-2"
          >
            {loading ? "جاري الدخول..." : "دخول 🚀"}
          </button>
        </form>

        <p className="text-center text-xs text-rose-100/80 mt-6">
          ليس لديك حساب؟{" "}
          <a href="/register" className="underline font-bold text-white">
            إنشاء حساب جديد
          </a>
        </p>
      </div>
    </div>
  );
}
