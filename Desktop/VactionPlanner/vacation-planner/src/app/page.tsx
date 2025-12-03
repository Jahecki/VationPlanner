"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0a0e1a] overflow-hidden font-sans text-white">
      {/* --- NOWOCZESNE TŁO (Latające Romby) --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Romb 1 (Lewy górny, Niebieski/Cyjan) */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-3xl rotate-45 mix-blend-screen filter blur-2xl opacity-30 animate-float-slow"></div>

        {/* Romb 2 (Prawy środkowy, Fiolet/Indigo) */}
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-gradient-to-bl from-indigo-600 to-purple-600 rounded-3xl rotate-45 mix-blend-screen filter blur-2xl opacity-30 animate-float animation-delay-2000"></div>

        {/* Romb 3 (Dolny lewy, Ciemniejszy niebieski) */}
        <div className="absolute -bottom-32 left-1/4 w-64 h-64 bg-gradient-to-tr from-blue-800 to-indigo-500 rounded-3xl rotate-45 mix-blend-screen filter blur-xl opacity-25 animate-float-fast"></div>

        {/* Siatka dla tekstury */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>

      {/* --- NAVBAR --- */}
      <header className="fixed top-0 w-full z-50 transition-all duration-300">
        <div className="mx-auto px-6 py-4 flex justify-between items-center backdrop-blur-md bg-white/5 border-b border-white/10 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg rotate-45 shadow-lg shadow-blue-500/20"></div>
            <h1 className="text-xl font-bold tracking-wide ml-2">
              Vacation<span className="text-blue-400">Planner</span>
            </h1>
          </div>

          <nav className="flex items-center space-x-6 text-sm font-medium">
            {!session ? (
              <>
                {/* Zmiana: Link prowadzi do /auth */}
                <Link
                  href="/auth"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Logowanie
                </Link>
                {/* Zmiana: Link prowadzi do /auth */}
                <Link
                  href="/auth"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full border border-white/10 transition-all hover:scale-105"
                >
                  Dołącz do nas
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/trips"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Moje plany
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-400 hover:text-white text-xs uppercase tracking-wider"
                >
                  Wyloguj
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* --- GŁÓWNA TREŚĆ --- */}
      <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-4 text-center mt-16">
        <div className="mb-6 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-950/50 text-blue-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm animate-pulse">
          ✈️ Planuj podróże mądrzej
        </div>

        <h2 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-indigo-300 drop-shadow-sm leading-tight max-w-4xl py-2">
          Odkryj świat <br /> na swoich zasadach.
        </h2>

        <p className="mt-6 text-lg md:text-xl text-blue-100/70 max-w-2xl leading-relaxed">
          Stwórz idealny plan podróży w kilka minut. Organizuj loty, hotele i
          atrakcje w jednym, pięknym miejscu.
        </p>

        {!session && (
          <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Zmiana: Główny przycisk prowadzi do /auth */}
            <Link
              href="/auth"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
            >
              Zacznij za darmo
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-bold text-lg backdrop-blur-sm transition-all duration-300"
            >
              Zobacz jak to działa
            </Link>
          </div>
        )}
      </main>

      <footer className="relative z-10 py-6 text-center text-blue-200/40 text-sm">
        &copy; {new Date().getFullYear()} Vacation Planner.
      </footer>
    </div>
  );
}
