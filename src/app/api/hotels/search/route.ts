import { NextResponse } from "next/server";
import { searchHotels } from "@/app/lib/hotelApi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchHotels(query);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Hotel search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}