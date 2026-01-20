// plik: src/app/lib/auth.ts
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./db";
import User from "./models/user";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Podaj email i hasło");
        }
        
        await connectDB();
        
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("Nie znaleziono użytkownika");
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordsMatch) {
          throw new Error("Błędne hasło");
        }

        // Zwracamy obiekt użytkownika (z ID w bazie jako string)
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    // Dzięki temu ID użytkownika będzie dostępne w session.user.id
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth",
  },
};