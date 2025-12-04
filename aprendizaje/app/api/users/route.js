export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { connectDB } from "../_lib/db";
import User from "../_models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select("-password");
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ msg: "Error usuarios", error: err?.message || String(err) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password } = body || {};
    if (!name || !email || !password) {
      return NextResponse.json({ msg: "Faltan campos: name, email o password" }, { status: 400 });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ msg: "Email ya registrado" }, { status: 400 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed });
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      const u = newUser.toObject(); delete u.password;
      return NextResponse.json({ msg: "JWT_SECRET no definida en el servidor", user: u }, { status: 500 });
    }
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, jwtSecret, { expiresIn: "7d" });
    const u = newUser.toObject(); delete u.password;
    return NextResponse.json({ token, user: u }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ msg: "Error en registro", error: err?.message || String(err) }, { status: 500 });
  }
}
