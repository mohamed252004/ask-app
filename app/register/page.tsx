"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabaseUrl = "https://zvydydhdxmivpmmsoietw.supabase.co";
const supabaseAnonKey = "sb_publishable_R06xCVtTHCUo8uejQbhjRA_2almHmeg";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, "");

    if (!cleanUsername) {
      setErrorMsg("يرجى كتابة اسم مستخدم صحيح");
      setLoading(false);
      return;
    }

    // 1. إنشاء حساب في Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setErrorMsg(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // 2. ربط الـ Username بالبروفايل
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          username: cleanUsername,
        },
      ]);

      if (profileError) {
        if (profileError.code === "23505") {
          setErrorMsg("اسم المستخدم هذا مأخوذ بالفعل، جرب اسماً آخر");
        } else {
          setErrorMsg(profileError.message);
        }
        setLoading(false);
        return;
      }

      // حفظ الـ username في الـ localStorage لتسهيل الجلسة
      localStorage.setItem("ask_username", cleanUsername);
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl text-white dir-rtl">
        <h1 className="text-3xl font-black text-center mb-2 tracking-wide">
          أنشئ حسابك 🚀
        </h1>
        <p className="text-center text-rose-100 text-sm mb-6">
          احصل على رابطك الخاص وابدأ في استقبال الرسائل المجهولة!
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/30 border border-red-400/40 rounded-xl text-xs text-red-100 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-rose-100">
              اسم المستخدم (Username)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-white/50 text-sm">
                @
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="mohamed"
                className="w-full p-3 pl-8 bg-black/20 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-rose-400 text-left dir-ltr"
              />
            </div>
          </div>

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
            {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب ✨"}
          </button>
        </form>

        <p className="text-center text-xs text-rose-100/80 mt-6">
          لديك حساب بالفعل؟{" "}
          <a href="/login" className="underline font-bold text-white">
            تسجيل الدخول
          </a>
        </p>
      </div>
    </div>
  );
}
