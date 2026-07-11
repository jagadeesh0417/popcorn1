import { connectDB } from "@/lib/db";
import Subscriber from "@/lib/models/Subscriber";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const subscriber = await Subscriber.findByIdAndDelete(id);
    if (!subscriber) return errorResponse("Not found", 404);
    return successResponse({ message: "Deleted" });
  } catch (err) {
    console.error("Failed to delete subscriber", err);
    return errorResponse("Failed to delete subscriber", 500);
  }
}
