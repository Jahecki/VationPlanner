// plik: src/app/api/hotels/search/route.ts
import { NextResponse } from "next/server";

// To jest symulacja API. W przyszłości tutaj wstawisz zapytanie do Amadeus/Booking.
// Dzięki temu frontend jest gotowy i niezależny od zewnętrznych kluczy.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query"); // Np. "Paryż"

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  // Symulujemy opóźnienie sieci (żeby zobaczyć loading na froncie)
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Generujemy "fejkowe" wyniki, które wyglądają jak prawdziwe
  const mockHotels = [
    {
      id: "h1",
      name: `Grand Hotel ${query}`,
      address: `Centrum, ${query} 15`,
      price: Math.floor(Math.random() * 500) + 300,
      rating: 5,
      image: "🏢"
    },
    {
      id: "h2",
      name: `${query} City Hostel`,
      address: `Ulica Boczna 4, ${query}`,
      price: Math.floor(Math.random() * 150) + 50,
      rating: 3,
      image: "🛏️"
    },
    {
      id: "h3",
      name: `Apartamenty ${query} View`,
      address: `Rynek Główny 2, ${query}`,
      price: Math.floor(Math.random() * 300) + 200,
      rating: 4.5,
      image: "🌅"
    },
    {
      id: "h4",
      name: `Hotel Pod Różą`,
      address: `Zaułek 5, ${query}`,
      price: Math.floor(Math.random() * 400) + 100,
      rating: 4,
      image: "🌹"
    },
  ];

  return NextResponse.json({ results: mockHotels });
}