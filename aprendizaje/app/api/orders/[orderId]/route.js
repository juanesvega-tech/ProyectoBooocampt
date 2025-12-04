export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { connectDB } from "../../_lib/db";
import Order from "../../_models/Order";

export async function DELETE(req, { params }) {
  await connectDB();
  const { orderId } = params;
  const deleted = await Order.findByIdAndDelete(orderId);
  if (!deleted) return NextResponse.json({ msg: "Orden no encontrada" }, { status: 404 });
  return new Response(null, { status: 204 });
}
