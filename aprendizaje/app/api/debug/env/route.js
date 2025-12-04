export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
  const hasMongoUri = Boolean(process.env.MONGO_URI);
  const hasJwtSecret = Boolean(process.env.JWT_SECRET);
  return NextResponse.json({ hasMongoUri, hasJwtSecret });
}
