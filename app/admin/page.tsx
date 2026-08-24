"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zvydydhdxmivpmmsoietw.supabase.co";
const supabaseAnonKey = "sb_publishable_R06xCVtTHCUo8uejQbhjRA_2almHmeg";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Message {
  id: string;
  text: string;
  created_at: string;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // الباسورد الخاص بيك لرؤية الرسائل
  const ADMIN_PASSWORD = "123"; // تقدر تغير الباسورد ده لأي حاجة تحبها

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      fetchMessages();
    } else {
      alert("الباسورد غير صحيح!");
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
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

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h1 className="text-xl font-bold text-center">لوحة التحكم السريّة 🔐</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="أدخل كلمة المرور"
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none text-center"
          />
          <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-medium">
            دخول
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">الصندوق الخاص بك 📥 ({messages.length})</h1>
          <button onClick={fetchMessages} className="px-4 py-2 bg-slate-800 rounded-lg text-sm hover:bg-slate-700">
            تحديث 🔄
          </button>
        </div>

        {loading ? (
          <p className="text-center text-slate-500">جاري تحميل الرسائل...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-slate-500">لا توجد رسائل جديدة.</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-start gap-4 dir-rtl">
                <div className="space-y-2">
                  <p className="text-slate-200">{msg.text}</p>
                  <span className="text-xs text-slate-500 block">
                    {new Date(msg.created_at).toLocaleString("ar-EG")}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="text-red-400 hover:text-red-300 text-xs px-2 py-1 border border-red-900/50 rounded bg-red-950/30"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
