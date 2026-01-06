import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Upewnij się, że ta ścieżka jest poprawna!
// Jeśli plik Providers.tsx masz w folderze app, zmień na: "./Providers"
import { Providers } from "../app/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vacation Planner",
  description: "Zaplanuj swoją wymarzoną podróż",
};

// --- TU BYŁ PRAWDOPODOBNIE BŁĄD ---
// Musi być "export default function"
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
