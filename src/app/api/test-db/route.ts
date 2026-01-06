import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: "Połączono z MongoDB 👍" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Błąd połączenia" }, { status: 500 });
  }
}
