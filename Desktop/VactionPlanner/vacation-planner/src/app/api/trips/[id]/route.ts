// plik: src/app/api/trips/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Trip from "../../../lib/models/trip";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

// POBIERZ SZCZEGÓŁY WYCIECZKI
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 });

    await connectDB();
    
    // Pobieramy ID z parametrów URL (await params jest wymagane w nowszych Next.js)
    const { id } = await params;

    // Szukamy wycieczki po ID oraz czy należy do zalogowanego usera
    // @ts-ignore
    const trip = await Trip.findOne({ _id: id, userId: session.user.id });

    if (!trip) {
      return NextResponse.json({ message: "Nie znaleziono" }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    return NextResponse.json({ message: "Błąd serwera" }, { status: 500 });
  }
}

// AKTUALIZUJ WYCIECZKĘ (Dodawanie hoteli, planu dnia)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 });

    const { id } = await params;
    const body = await req.json(); // Tu będą nowe dane (np. nowy hotel)

    await connectDB();

    // Aktualizujemy wycieczkę
    const updatedTrip = await Trip.findOneAndUpdate(
      // @ts-ignore
      { _id: id, userId: session.user.id },
      { $set: body }, // Nadpisz pola, które przyszły w body
      { new: true }   // Zwróć zaktualizowany dokument
    );

    return NextResponse.json(updatedTrip);
  } catch (error) {
    return NextResponse.json({ message: "Błąd aktualizacji" }, { status: 500 });
  }
}