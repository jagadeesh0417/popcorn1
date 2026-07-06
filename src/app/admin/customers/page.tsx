import { customers } from "@/lib/data";

export default function AdminCustomersPage() {
  return (
    <div className="min-h-screen pt-20 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[#B71C1C] font-semibold text-sm uppercase tracking-[0.2em]">Admin</span>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Customers</h1>
          </div>
          <span className="bg-[#B71C1C] text-white text-sm font-medium px-4 py-2 rounded-xl">{customers.length} customers</span>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(183,28,28,0.08)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(183,28,28,0.08)] text-left text-[#666666]">
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
                <tr key={c.email} className="border-b border-[rgba(183,28,28,0.06)] last:border-0">
                  <td className="py-3 font-medium text-[#1A1A1A]">{c.name}</td>
                  <td className="py-3 text-[#666666]">{c.email}</td>
                  <td className="py-3 text-[#666666]">{c.phone}</td>
                  <td className="py-3 text-[#666666]">{c.orders}</td>
                  <td className="py-3 font-medium text-[#B71C1C]">₹{c.totalSpent}</td>
                  <td className="py-3 text-[#666666]">{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
