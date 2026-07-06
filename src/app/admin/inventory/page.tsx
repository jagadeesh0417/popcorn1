import { products } from "@/lib/data";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminInventoryPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 pt-20">
        <div className="px-8 py-8">
          <div className="mb-8">
            <span className="text-[#B71C1C] font-semibold text-sm uppercase tracking-[0.2em]">Admin</span>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Inventory</h1>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(183,28,28,0.08)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(183,28,28,0.08)] text-left text-[#666666]">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Weight</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-[rgba(183,28,28,0.06)] last:border-0">
                    <td className="py-3 font-medium text-[#1A1A1A]">{p.name}</td>
                    <td className="py-3 text-[#666666]">{p.category}</td>
                    <td className="py-3 text-[#666666]">{p.weight}</td>
                    <td className="py-3 font-medium text-[#B71C1C]">₹{p.price}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-[#FFF8F0] rounded-full h-2 max-w-[120px]">
                          <div className="bg-[#B71C1C] h-2 rounded-full" style={{ width: `${Math.min(100, (p.stockQuantity / 200) * 100)}%` }} />
                        </div>
                        <span className="text-xs text-[#666666]">{p.stockQuantity}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.stockQuantity > 50 ? "bg-green-100 text-green-700" : p.stockQuantity > 10 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                        {p.stockQuantity > 50 ? "In Stock" : p.stockQuantity > 10 ? "Low Stock" : "Critical"}
                      </span>
                    </td>
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
