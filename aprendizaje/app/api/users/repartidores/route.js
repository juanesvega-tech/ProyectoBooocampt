export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { connectDB } from "../../_lib/db";
import User from "../../_models/User";

export async function GET() {
  await connectDB();
  const reps = await User.find({ role: "repartidor" }).select("_id name email");
  return NextResponse.json(reps);
}
