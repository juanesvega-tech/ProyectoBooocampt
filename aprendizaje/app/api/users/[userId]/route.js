export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { connectDB } from "../../_lib/db";
import User from "../../_models/User";
import bcrypt from "bcryptjs";

export async function PUT(req, { params }) {
  await connectDB();
  const { userId } = params;
  const body = await req.json();
  const { name, email, role, password } = body || {};
  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ msg: "Usuario no encontrado" }, { status: 404 });
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (password) user.password = await bcrypt.hash(password, 10);
  await user.save();
  const u = user.toObject(); delete u.password;
  return NextResponse.json(u);
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { userId } = params;
  const deleted = await User.findByIdAndDelete(userId);
  if (!deleted) return NextResponse.json({ msg: "Usuario no encontrado" }, { status: 404 });
  return new Response(null, { status: 204 });
}
