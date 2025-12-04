export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { connectDB } from "../_lib/db";
import Order from "../_models/Order";

export async function GET() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { cliente, destinoAddress, destino } = body || {};
  if (!cliente || !destinoAddress || !destino) {
    return NextResponse.json({ msg: "Faltan campos requeridos" }, { status: 400 });
  }
  const newOrder = await Order.create({
    cliente,
    origenAddress: "Pendiente de recoger",
    destinoAddress,
    origen: { lat: -34.6, lng: -58.38 },
    destino,
    estado: "Pendiente",
    repartidor: null,
  });
  return NextResponse.json(newOrder, { status: 201 });
}
