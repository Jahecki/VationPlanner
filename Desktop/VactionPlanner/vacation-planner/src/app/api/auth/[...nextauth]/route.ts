// plik: src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "../../../lib/auth"; // Importujemy to, co stworzyliśmy wyżej

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };