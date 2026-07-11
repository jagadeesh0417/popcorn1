"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Loader2 } from "lucide-react";

interface Subscriber {
  _id: string;
  email: string;
  phone?: string;
  name?: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    fetch("/api/subscribers").then((r) => r.json()).then((data) => { if (mounted) { if (Array.isArray(data)) setSubscribers(data); setLoading(false); } }).catch(() => { if (mounted) { setError("Failed to load subscribers"); setLoading(false); } });
    return () => { mounted = false; };
  }, []);

  const deleteSubscriber = async (id: string) => {
    if (!confirm("Delete this subscriber?")) return;
    try {
      const res = await fetch(`/api/subscribers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s._id !== id));
      }
    } catch {
      console.error("Failed to delete");
    }
  };

  const exportCSV = () => {
    const headers = "Email,Name,Phone,Active,Created At\n";
    const rows = subscribers.map((s) => `${s.email},${s.name || ""},${s.phone || ""},${s.isActive},${new Date(s.createdAt).toLocaleDateString()}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "poprika-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 pt-20">
        <div className="px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Admin</span>
              <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Subscribers</h1>
            </div>
            <Button onClick={exportCSV} className="bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl">
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm mb-6">{error}</div>}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#DC0218]" />
            </div>
          ) : subscribers.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-[rgba(220,2,24,0.08)] text-center">
              <p className="text-[#444444]">No subscribers yet. They will appear when users sign up via the newsletter.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(220,2,24,0.08)] overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(220,2,24,0.08)] text-left text-[#444444]">
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Phone</th>
                    <th className="pb-3 font-medium">Active</th>
                    <th className="pb-3 font-medium">Subscribed On</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((s) => (
                      <tr key={s._id} className="border-b border-[rgba(220,2,24,0.06)] last:border-0">
                        <td className="py-3 font-medium text-[#1A1A1A]">{s.email}</td>
                        <td className="py-3 text-[#444444]">{s.name || "-"}</td>
                        <td className="py-3 text-[#444444]">{s.phone || "-"}</td>
                        <td className="py-3">
                          <span className={`${s.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"} text-xs font-medium px-2.5 py-1 rounded-full`}>
                            {s.isActive ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="py-3 text-[#444444]">{new Date(s.createdAt).toLocaleDateString()}</td>
                        <td className="py-3">
                          <button onClick={() => deleteSubscriber(s._id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
