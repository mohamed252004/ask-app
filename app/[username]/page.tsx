"use client";

import { useState, use } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zvydydhdxmivpmmsoietw.supabase.co";
const supabaseAnonKey = "sb_publishable_R06xCVtTHCUo8uejQbhjRA_2almHmeg";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function UserPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("messages").insert([
      {
        recipient_username: username.toLowerCase(),
        text: message,
      },
    ]);

    setLoading(false);

    if (!error) {
      setSent(true);
      setMessage("");
      setTimeout(() => setSent(false), 4000);
    } else {
      alert("حدث خطأ أثناء الإرسال، حاول مجدداً");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-700 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl text-white dir-rtl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-3 border border-white/30 shadow-inner">
            👤
          </div>
          <h1 className="text-xl font-black">@{username}</h1>
          <p className="text-xs text-rose-100/80 mt-1">
            أرسل لي رسالة مجهولة وصريحة! 🤫
          </p>
        </div>

        <form onSubmit={handleSend} className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا بكل صراحة..."
            rows={4}
            className="w-full p-4 bg-black/20 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none text-right dir-rtl"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white text-rose-600 font-black rounded-2xl shadow-xl hover:bg-rose-50 transition duration-200 disabled:opacity-50"
          >
            {loading ? "جاري الإرسال..." : "إرسال كمجهول 🚀"}
          </button>
        </form>

        {sent && (
          <div className="mt-4 p-3 bg-emerald-500/30 border border-emerald-400/40 text-emerald-100 rounded-xl text-center text-xs">
            تم إرسال رسالتك بنجاح وسريّة! ✨
          </div>
        )}
      </div>
    </div>
  );
}
