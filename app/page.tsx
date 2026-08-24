"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zvydydhdxmivpmmsoietw.supabase.co";
const supabaseAnonKey = "sb_publishable_R06xCVtTHCUo8uejQbhjRA_2almHmeg";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [question, setQuestion] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    const { error } = await supabase
      .from("messages")
      .insert([{ text: question }]);

    setLoading(false);
    if (!error) {
      setSent(true);
      setQuestion("");
      setTimeout(() => setSent(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-md bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Ask Me Anything
        </h1>
        <p className="text-slate-400 text-sm text-center mb-6">
          إرسال رسائل وأسئلة مجهولة المصدر
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="اكتب رسالتك السرية هنا..."
            className="w-full h-32 p-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-slate-200 placeholder-slate-500 resize-none dir-rtl"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-medium rounded-xl transition duration-200 text-white shadow-lg shadow-purple-900/30 disabled:opacity-50"
          >
            {loading ? "جاري الإرسال..." : "إرسال كمجهول 🚀"}
          </button>
        </form>

        {sent && (
          <div className="mt-4 p-3 bg-emerald-950/50 border border-emerald-800 text-emerald-400 rounded-xl text-center text-sm">
            تم إرسال رسالتك بنجاح وسريّة! ✨
          </div>
        )}
      </main>
    </div>
  );
}
