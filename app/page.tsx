"use client";

import { useState } from "react";
import { Sparkles, ShieldCheck, Heart, Globe2, Inbox, Trash2, Lock, SendHorizontal } from "lucide-react";

interface Question {
  id: string;
  text: string;
  time: string;
}

export default function Home() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [question, setQuestion] = useState("");
  const [sent, setSent] = useState(false);
  const [inbox, setInbox] = useState<Question[]>([]);

  const isAr = lang === "ar";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newQ: Question = {
      id: Date.now().toString(),
      text: question,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setInbox([newQ, ...inbox]);
    setSent(true);
    setQuestion("");
    setTimeout(() => setSent(false), 4000);
  };

  const deleteQuestion = (id: string) => {
    setInbox(inbox.filter((q) => q.id !== id));
  };

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 py-12 transition-all duration-500 relative overflow-hidden"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-7 shadow-[0_0_50px_-12px_rgba(124,58,237,0.25)] space-y-6 relative z-10">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5 text-xs text-purple-400 font-medium px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
            <Lock className="w-3 h-3" /> Anonymous
          </span>
          <button
            type="button"
            onClick={() => setLang(isAr ? "en" : "ar")}
            className="flex items-center gap-1.5 text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-full transition border border-slate-700/60 shadow-sm"
          >
            <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
            {isAr ? "English" : "العربية"}
          </button>
        </div>

        <div className="text-center space-y-3 pt-2">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            {isAr ? "اسألني بحرية 🔒" : "Ask Me Anything"}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            {isAr
              ? "سرية تامة 100%. اكتب كل اللي في قلبك بدون ما أعرف مين أنت!"
              : "100% anonymous & encrypted. Share your thoughts freely!"}
          </p>
        </div>

        {sent && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3.5 rounded-2xl text-center text-xs flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            {isAr ? "وصلت رسالتك بنجاح وبسرية تامة!" : "Delivered securely into the inbox!"}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                isAr
                  ? "اكتب رسالتك السرية أو رأيك هنا بكل صراحة..."
                  : "Write a secret message or constructive feedback..."
              }
              className="w-full h-32 bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/20 transition resize-none text-sm leading-relaxed"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3.5 rounded-2xl transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 active:scale-[0.98]"
          >
            <SendHorizontal className="w-4 h-4" />
            {isAr ? "إرسال بصمت" : "Send Anonymously"}
          </button>
        </form>

        <div className="pt-6 border-t border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-purple-400" />
              {isAr ? "الرسائل الواردة" : "Received Whispers"}
            </div>
            <span className="bg-slate-800 text-purple-300 text-[10px] px-2 py-0.5 rounded-full border border-slate-700">
              {inbox.length}
            </span>
          </div>

          {inbox.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-5 bg-slate-950/40 rounded-2xl border border-slate-800/40">
              {isAr ? "صندوق الرسائل الفخمة فارغ حتى الآن." : "No secret messages received yet."}
            </p>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {inbox.map((q) => (
                <div
                  key={q.id}
                  className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl space-y-2 text-sm backdrop-blur-sm"
                >
                  <p className="text-slate-200 text-xs leading-relaxed break-words">{q.text}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-900">
                    <span>{q.time}</span>
                    <button
                      type="button"
                      onClick={() => deleteQuestion(q.id)}
                      className="text-red-400/80 hover:text-red-300 flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                      {isAr ? "حذف" : "Remove"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
          {isAr ? "صُنِع بإتقان وشياكة" : "Crafted with precision"}
          <Heart className="w-3 h-3 text-purple-500 fill-purple-500 inline" />
        </div>
      </div>
    </main>
  );
}
