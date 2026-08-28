import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      revenueResult,
      totalOrders,
      pendingOrders,
      totalCustomers,
      totalProducts,
      lowStock,
      recentOrders,
      monthly,
      topProducts,
      newCustomers,
    ] = await Promise.all([
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
      Order.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Order.distinct("customerDetails.email"),
      Product.countDocuments(),
      Product.countDocuments({ stockQuantity: { $lte: 10 } }),
      Order.find({})
        .sort({ createdAt: -1 })
        .limit(4)
        .select({ orderId: 1, customerDetails: 1, items: 1, total: 1, status: 1, createdAt: 1 })
        .lean(),
      Order.aggregate([
        {
          $project: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            total: 1,
          },
        },
        { $group: { _id: { year: "$year", month: "$month" }, revenue: { $sum: "$total" }, orders: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Order.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productId",
            name: { $first: "$items.name" },
            sold: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          },
        },
        { $sort: { sold: -1 } },
        { $limit: 5 },
      ]),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap = new Map<string, { revenue: number; orders: number }>();
    for (const m of monthly) {
      const key = `${m._id.year}-${m._id.month}`;
      monthlyMap.set(key, { revenue: m.revenue, orders: m.orders });
    }
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      const v = monthlyMap.get(key) || { revenue: 0, orders: 0 };
      monthlyData.push({ month: `${monthNames[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`, revenue: v.revenue, orders: v.orders });
    }
    const monthlyOrders = monthlyData[monthlyData.length - 1];
    const monthlyRevenue = monthlyOrders?.revenue ?? 0;
    const avgOrderValue = monthlyOrders?.orders ? Math.round(monthlyRevenue / monthlyOrders.orders) : 0;

    return successResponse({
      totalRevenue: revenueResult[0]?.total ?? 0,
      totalOrders,
      pendingOrders,
      totalCustomers: totalCustomers.length,
      totalProducts: totalProducts,
      lowStock: lowStock,
      newCustomers,
      monthlyRevenue,
      monthlyOrders: monthlyOrders?.orders ?? 0,
      avgOrderValue,
      monthlyData,
      topProducts: topProducts.map((p: { name?: string; sold?: number; revenue?: number }) => ({
        name: p.name || "Product",
        sold: p.sold || 0,
        revenue: Math.round(p.revenue || 0),
      })),
      recentOrders: recentOrders.map((o: {
        orderId: string;
        customerDetails?: { firstName?: string; lastName?: string };
        items?: { quantity?: number }[];
        total?: number;
        status?: string;
        createdAt?: Date | string;
      }) => ({
        orderId: o.orderId,
        customer: `${o.customerDetails?.firstName || ""} ${o.customerDetails?.lastName || ""}`.trim(),
        items: (o.items || []).reduce((s: number, i: { quantity?: number }) => s + (i.quantity || 0), 0),
        total: o.total || 0,
        status: o.status || "",
        createdAt: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "",
      })),
    });
  } catch (err) {
    console.error("Failed to fetch stats", err);
    return errorResponse("Failed to fetch stats", 500);
  }
}
