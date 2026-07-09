import { customers } from "@/lib/data";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminCustomersPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 pt-20">
        <div className="px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Admin</span>
              <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Customers</h1>
            </div>
            <span className="bg-[#DC0218] text-white text-sm font-medium px-4 py-2 rounded-xl">{customers.length} customers</span>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(220,2,24,0.08)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(220,2,24,0.08)] text-left text-[#666666]">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Phone</th>
                  <th className="pb-3 font-medium">Orders</th>
                  <th className="pb-3 font-medium">Total Spent</th>
                  <th className="pb-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.email} className="border-b border-[rgba(220,2,24,0.06)] last:border-0">
                    <td className="py-3 font-medium text-[#1A1A1A]">{c.name}</td>
                    <td className="py-3 text-[#666666]">{c.email}</td>
                    <td className="py-3 text-[#666666]">{c.phone}</td>
                    <td className="py-3 text-[#666666]">{c.orders}</td>
                    <td className="py-3 font-medium text-[#DC0218]">₹{c.totalSpent}</td>
                    <td className="py-3 text-[#666666]">{c.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
