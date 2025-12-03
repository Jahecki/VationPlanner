"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Zabezpieczenie: Jeśli brak sesji, przekieruj do logowania
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center text-white">
        Ładowanie...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white font-sans relative overflow-hidden">
      {/* --- TŁO (Spójne z resztą aplikacji) --- */}
      <div className="absolute inset-0 pointer-events-none fixed">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-900/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* --- NAGŁÓWEK --- */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">
              Panel główny
            </p>
            <h1 className="text-4xl font-bold">
              Cześć,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                {session?.user?.name || "Podróżniku"}
              </span>
              ! 👋
            </h1>
            <p className="text-gray-400 mt-2">
              Gdzie poniesie Cię dzisiaj wyobraźnia?
            </p>
          </div>

          {/* Przycisk akcji w nagłówku (opcjonalny) */}
          <Link
            href="/trips/new"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all font-medium flex items-center gap-2 backdrop-blur-md"
          >
            <span>⚙️</span> Ustawienia konta
          </Link>
        </header>

        {/* --- STATYSTYKI (GRID) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Karta 1 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all cursor-default group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                  Zaplanowane podróże
                </p>
                <h3 className="text-4xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  3
                </h3>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400 text-xl">
                🗺️
              </div>
            </div>
          </div>

          {/* Karta 2 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all cursor-default group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                  Odwiedzone kraje
                </p>
                <h3 className="text-4xl font-bold text-white group-hover:text-purple-400 transition-colors">
                  12
                </h3>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400 text-xl">
                🚩
              </div>
            </div>
          </div>

          {/* Karta 3 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all cursor-default group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                  Nadchodząca podróż
                </p>
                <h3 className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors">
                  Japonia 🇯🇵
                </h3>
                <p className="text-xs text-gray-500 mt-1">Za 14 dni</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg text-green-400 text-xl">
                📅
              </div>
            </div>
          </div>
        </div>

        {/* --- SEKCJA GŁÓWNA (Dwie kolumny) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEWA STRONA (Szybkie akcje - zajmuje 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🚀 Szybkie akcje
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Przycisk Stwórz Nową */}
              <Link
                href="/trips/new"
                className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-blue-600 to-indigo-700 hover:scale-[1.02] transition-all shadow-lg shadow-blue-900/30"
              >
                <div className="relative z-10">
                  <div className="mb-4 text-4xl">✨</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Stwórz nową podróż
                  </h3>
                  <p className="text-blue-100/80 text-sm">
                    Użyj AI lub zaplanuj ręcznie każdy szczegół swojej wyprawy.
                  </p>
                </div>
                {/* Ozdobne kółka w tle przycisku */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              </Link>

              {/* Przycisk Odkrywaj */}
              <Link
                href="/explore"
                className="group relative overflow-hidden rounded-2xl p-8 bg-[#111625] border border-white/10 hover:border-purple-500/50 hover:scale-[1.02] transition-all"
              >
                <div className="relative z-10">
                  <div className="mb-4 text-4xl">🌍</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Inspiracje
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Zobacz plany innych podróżników i skopiuj je do siebie.
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* PRAWA STRONA (Lista Ostatnich - zajmuje 1/3) */}
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Moje podróże</h2>
              <Link
                href="/trips"
                className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
              >
                Zobacz wszystkie →
              </Link>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden">
              {/* Tutaj będziemy mapować dane z bazy, na razie mockupy */}
              <div className="divide-y divide-white/5">
                {/* Item 1 */}
                <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      Wakacje w Rzymie
                    </h4>
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                      Aktywna
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    15.08.2025 - 22.08.2025
                  </p>
                </div>

                {/* Item 2 */}
                <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      Weekend w Tatrach
                    </h4>
                    <span className="text-[10px] bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                      Szkic
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Brak daty</p>
                </div>

                {/* Item 3 */}
                <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      Eurotrip 2026
                    </h4>
                    <span className="text-[10px] bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                      Szkic
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Lato 2026</p>
                </div>
              </div>

              {/* Footer listy asd*/}
              <div className="p-3 text-center border-t border-white/5">
                <Link
                  href="/trips/new"
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  + Dodaj kolejną podróż
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
