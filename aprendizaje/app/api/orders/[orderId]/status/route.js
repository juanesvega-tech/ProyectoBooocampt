import { NextResponse } from "next/server";
import { connectDB } from "../../../_lib/db";
import Order from "../../../_models/Order";

export async function PUT(req, { params }) {
  await connectDB();
  const { orderId } = params;
  const body = await req.json();
  const { estado } = body || {};
  if (!estado || !["Pendiente", "En camino", "Entregado"].includes(estado)) {
    return NextResponse.json({ msg: "Estado inválido" }, { status: 400 });
  }
  const updated = await Order.findByIdAndUpdate(orderId, { estado }, { new: true });
  if (!updated) return NextResponse.json({ msg: "Orden no encontrada" }, { status: 404 });
  return NextResponse.json(updated);
}
