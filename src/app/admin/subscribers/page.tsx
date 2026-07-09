"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Subscriber {
  email: string;
  whatsappNumber: string;
  consent: boolean;
  createdAt: string;
}

const mockSubscribers: Subscriber[] = [
  { email: "priya@example.com", whatsappNumber: "+91 9876543210", consent: true, createdAt: "2026-07-01" },
  { email: "arjun@example.com", whatsappNumber: "+91 8765432109", consent: true, createdAt: "2026-06-28" },
];

export default function AdminSubscribersPage() {
  const [subscribers] = useState<Subscriber[]>(mockSubscribers);

  const exportCSV = () => {
    const headers = "Email,WhatsApp,Consent,Created At\n";
    const rows = subscribers.map((s) => `${s.email},${s.whatsappNumber},${s.consent},${s.createdAt}`).join("\n");
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
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(220,2,24,0.08)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(220,2,24,0.08)] text-left text-[#666666]">
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">WhatsApp</th>
                  <th className="pb-3 font-medium">Consent</th>
                  <th className="pb-3 font-medium">Subscribed On</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-[#999999] text-sm">No subscribers yet.</td></tr>
                ) : (
                  subscribers.map((s, i) => (
                    <tr key={i} className="border-b border-[rgba(220,2,24,0.06)] last:border-0">
                      <td className="py-3 font-medium text-[#1A1A1A]">{s.email}</td>
                      <td className="py-3 text-[#666666]">{s.whatsappNumber}</td>
                      <td className="py-3">
                        <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">Yes</span>
                      </td>
                      <td className="py-3 text-[#666666]">{s.createdAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="text-[#999999] text-xs mt-4">
            {/* TODO: connect MongoDB — replace mockSubscribers with live data from DB */}
            Showing {subscribers.length} mock subscribers. Connect MongoDB to see live data.
          </p>
        </div>
      </div>
    </div>
  );
}
