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
    const userId = session?.user ? (session.user as any).id : null;

    // Jeśli użytkownik jest niezalogowany, a próbuje wejść na URL, musimy pozwolić sprawdzić czy jest publiczne
    // Ale w Dashboard jest blokada "unauthenticated" -> router.push("/auth").
    // W page.tsx też jest check. Jeśli chcemy publiczne dla niezalogowanych, musimy zdjąć blokadę w page.tsx.
    // Na razie załóżmy, że musi być zalogowany, by korzystać z appki.
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectDB();

    // Pobieramy ID z parametrów URL
    const { id } = await params;

    const trip = await Trip.findById(id).lean();

    if (!trip) {
      return NextResponse.json({ message: "Nie znaleziono" }, { status: 404 });
    }

    const isOwner = userId && trip.userId.toString() === userId.toString();

    // Dostęp jeśli właściciel LUB publiczne
    if (!isOwner && !trip.isPublic) {
      return NextResponse.json({ message: "Brak dostępu" }, { status: 403 });
    }

    return NextResponse.json({ ...trip, isOwner });
  } catch (error) {
    console.error(error);
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