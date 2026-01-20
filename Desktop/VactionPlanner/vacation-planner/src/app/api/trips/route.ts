import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import Trip from "../../lib/models/trip";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth"; // Upewnij się, że ścieżka do authOptions jest poprawna

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Nieautoryzowany" }, { status: 401 });
    }

    await connectDB();
    // @ts-ignore
    const trips = await Trip.find({ userId: session.user.id }).sort({ startDate: 1 });

    return NextResponse.json(trips);
  } catch (error) {
    console.error("Błąd GET /api/trips:", error);
    return NextResponse.json({ message: "Błąd serwera" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Nieautoryzowany" }, { status: 401 });
    }

    const { destination, startDate, endDate, peopleCount } = await req.json();

    if (!destination) {
      return NextResponse.json({ message: "Podaj cel podróży" }, { status: 400 });
    }

    await connectDB();
    const newTrip = await Trip.create({
      // @ts-ignore
      userId: session.user.id,
      destination,
      startDate,
      endDate,
      peopleCount: peopleCount || 1,
      hotels: [],
      itinerary: []
    });

    // --- KLUCZOWA POPRAWKA ---
    // Konwertujemy dokument Mongoose na zwykły obiekt i wymuszamy konwersję _id na string
    const tripObject = newTrip.toObject();
    return NextResponse.json({ ...tripObject, _id: newTrip._id.toString() }, { status: 201 });

  } catch (error) {
    console.error("Błąd POST /api/trips:", error);
    return NextResponse.json({ message: "Błąd serwera podczas tworzenia" }, { status: 500 });
  }
}