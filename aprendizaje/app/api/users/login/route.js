export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { connectDB } from "../../_lib/db";
import User from "../../_models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password } = body || {};
    if (!email || !password) {
      return NextResponse.json({ msg: "Faltan campos: email o password" }, { status: 400 });
    }
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ msg: "Usuario no encontrado" }, { status: 404 });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return NextResponse.json({ msg: "Contraseña incorrecta" }, { status: 400 });
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      const u = user.toObject(); delete u.password;
      return NextResponse.json({ msg: "JWT_SECRET no definida en el servidor", user: u }, { status: 500 });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: "7d" });
    const u = user.toObject(); delete u.password;
    return NextResponse.json({ token, user: u });
  } catch (err) {
    return NextResponse.json({ msg: "Error en login", error: err?.message || String(err) }, { status: 500 });
  }
}
