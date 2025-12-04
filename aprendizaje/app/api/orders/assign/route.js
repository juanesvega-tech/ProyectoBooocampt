export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { connectDB } from "../../_lib/db";
import Order from "../../_models/Order";

export async function PUT(req) {
  await connectDB();
  const body = await req.json();
  const { orderId, repartidor, origenAddress } = body || {};
  if (!orderId || !repartidor || !origenAddress) {
    return NextResponse.json({ msg: "Faltan campos requeridos" }, { status: 400 });
  }
  const updated = await Order.findByIdAndUpdate(
    orderId,
    { estado: "En camino", repartidor, origenAddress },
    { new: true }
  );
  if (!updated) return NextResponse.json({ msg: "Orden no encontrada" }, { status: 404 });
  return NextResponse.json(updated);
}
