"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, QrCode, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface QRCodeDoc {
  _id: string;
  label: string;
  code: string;
  isActive: boolean;
  expiresAt: string;
  scanCount: number;
  lastScannedAt: string;
  createdAt: string;
}

export default function AdminQRCodesPage() {
  const [qrs, setQrs] = useState<QRCodeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let m = true;
    fetch("/api/qrcodes").then((r) => r.json()).then((d) => { if (m) { if (d?.success) setQrs(d.data); setLoading(false); } }).catch(() => { if (m) { setError("Failed to load"); setLoading(false); } });
    return () => { m = false; };
  }, []);

  const createQR = async () => {
    try {
      const r = await fetch("/api/qrcodes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ label: `QR-${qrs.length + 1}` }) });
      const d = await r.json();
      if (d?.success) setQrs((p) => [d.data, ...p]);
    } catch { console.error("create failed"); }
  };

  const deleteQR = async (id: string) => {
    if (!confirm("Delete this QR code?")) return;
    try { const r = await fetch(`/api/qrcodes/${id}`, { method: "DELETE" }); if (r.ok) setQrs((p) => p.filter((q) => q._id !== id)); } catch { console.error("delete failed"); }
  };

  const toggleQR = async (id: string, isActive: boolean) => {
    try { await fetch(`/api/qrcodes/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive }) }); setQrs((p) => p.map((q) => q._id === id ? { ...q, isActive } : q)); } catch { console.error("toggle failed"); }
  };

  const getFarmUrl = (code: string) => `${window.location.origin}/farm?code=${code}`;

  const copyLink = (code: string) => {
    navigator.clipboard.writeText(getFarmUrl(code));
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 pt-20">
        <div className="px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Admin</span>
              <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">QR Codes</h1>
              <p className="text-sm text-[#444444] mt-1">Generate QR codes for the hidden Farmer Portal.</p>
            </div>
            <Button onClick={createQR} className="bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl">
              <Plus className="h-4 w-4 mr-2" /> Generate QR
            </Button>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm mb-6">{error}</div>}
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#DC0218]" /></div>
          ) : qrs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-[rgba(220,2,24,0.08)] text-center">
              <QrCode className="h-12 w-12 mx-auto mb-3 text-[#444444]" />
              <p className="text-[#444444]">No QR codes yet. Generate one to start.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {qrs.map((qr) => {
                const url = getFarmUrl(qr.code);
                const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
                return (
                  <div key={qr._id} className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(220,2,24,0.08)]">
                    <div className="flex items-start gap-6">
                      <div className="w-24 h-24 shrink-0 bg-white rounded-xl border border-[rgba(220,2,24,0.12)] p-1">
                        <img src={qrImageUrl} alt="QR Code" className="w-full h-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-[#1A1A1A]">{qr.label}</h3>
                          <span className={`${qr.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} text-xs px-2.5 py-1 rounded-full`}>{qr.isActive ? "Active" : "Disabled"}</span>
                        </div>
                        <p className="text-xs text-[#444444] mb-2 break-all">{url}</p>
                        <div className="flex items-center gap-3 text-xs text-[#444444] mb-3">
                          <span>Scans: {qr.scanCount}</span>
                          {qr.lastScannedAt && <span>Last: {new Date(qr.lastScannedAt).toLocaleDateString()}</span>}
                          {qr.expiresAt && <span>Expires: {new Date(qr.expiresAt).toLocaleDateString()}</span>}
                          <span>Created: {new Date(qr.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => copyLink(qr.code)} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[#FFF8F0] hover:bg-[#DC0218]/5 rounded-lg transition-colors">
                            {copied === qr.code ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />} {copied === qr.code ? "Copied!" : "Copy Link"}
                          </button>
                          <a href={url} target="_blank" rel="noopener" className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[#FFF8F0] hover:bg-[#DC0218]/5 rounded-lg transition-colors">
                            <ExternalLink className="h-3 w-3" /> Preview
                          </a>
                          <button onClick={() => toggleQR(qr._id, !qr.isActive)} className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${qr.isActive ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>
                            {qr.isActive ? "Disable" : "Enable"}
                          </button>
                          <button onClick={() => deleteQR(qr._id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
