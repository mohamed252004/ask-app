"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabaseUrl = "https://zvydydhdxmivpmmsoietw.supabase.co";
const supabaseAnonKey = "sb_publishable_R06xCVtTHCUo8uejQbhjRA_2almHmeg";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Message {
  id: string;
  text: string;
  created_at: string;
}

export default function DashboardPage() {
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("ask_username");
    if (!storedUsername) {
      router.push("/login");
      return;
    }
    setUsername(storedUsername);
    fetchMessages(storedUsername);
  }, [router]);

  const fetchMessages = async (user: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("recipient_username", user.toLowerCase())
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (!error) {
      setMessages(messages.filter((msg) => msg.id !== id));
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("ask_username");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-700 p-4 flex flex-col items-center">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl text-white dir-rtl mt-6">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h1 className="text-xl font-black">أهلاً @{username} 👋</h1>
            <p className="text-xs text-rose-100/80">لوحة تحكم الرسائل الخاصة بيك</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-100 px-3 py-2 rounded-xl border border-red-500/30 transition"
          >
            خروج
          </button>
        </div>

        {/* Share Link Card */}
        <div className="my-6 p-4 bg-black/20 rounded-2xl border border-white/10 text-center space-y-3">
          <p className="text-xs text-rose-100 font-medium">رابط استلام الرسائل الخاص بك:</p>
          <div className="p-3 bg-black/30 rounded-xl text-sm font-mono text-rose-200 dir-ltr truncate">
            {typeof window !== "undefined" ? `${window.location.origin}/${username}` : ""}
          </div>
          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 bg-white text-rose-600 font-bold rounded-xl hover:bg-rose-50 transition shadow"
          >
            {copied ? "تم نسخ الرابط! 📋" : "نسخ الرابط 🔗"}
          </button>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold">الرسائل الواردة ({messages.length})</h2>
            <button
              onClick={() => fetchMessages(username)}
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/10"
            >
              تحديث 🔄
            </button>
          </div>

          {loading ? (
            <p className="text-center text-xs text-rose-200 py-8">جاري تحميل الرسائل...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-xs text-rose-200/80 py-8">لا توجد رسائل جديدة بعد. شارك رابطك مع أصدقائك!</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 bg-black/20 border border-white/10 rounded-2xl flex justify-between items-start gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <p className="text-sm leading-relaxed text-white">{msg.text}</p>
                    <span className="text-[10px] text-rose-200/60 block dir-ltr text-right">
                      {new Date(msg.created_at).toLocaleString("ar-EG")}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="text-red-300 hover:text-red-100 text-xs px-2.5 py-1 bg-red-500/20 border border-red-500/30 rounded-lg shrink-0"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
