import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "../../../lib/db";
import User from "../../../lib/models/user";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  // Tutaj konfigurujemy, że używamy bazy danych
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Sprawdź czy dane przyszły
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Podaj email i hasło");
        }

        // 2. Połącz z bazą
        await connectDB();

        // 3. Znajdź użytkownika
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Nie znaleziono użytkownika o tym emailu");
        }

        // 4. Sprawdź hasło (porównaj wpisane z tym zaszyfrowanym w bazie)
        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordsMatch) {
          throw new Error("Błędne hasło");
        }

        // 5. Zwróć użytkownika (to trafi do sesji)
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth", // Mówimy NextAuth, że nasza strona logowania to /auth
  },
});

export { handler as GET, handler as POST };
