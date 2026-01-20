import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db"; // Import twojego połączenia
import User from "../../lib/models/user"; // Import twojego modelu
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Wypełnij wszystkie pola." },
        { status: 400 }
      );
    }

    // 1. Połącz z bazą
    await connectDB();

    // 2. Sprawdź czy użytkownik już istnieje
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Użytkownik o tym emailu już istnieje." },
        { status: 400 }
      );
    }

    // 3. Zaszyfruj hasło
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Stwórz użytkownika w bazie
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Rejestracja udana!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Błąd rejestracji:", error);
    return NextResponse.json(
      { message: "Błąd serwera podczas rejestracji." },
      { status: 500 }
    );
  }
}
