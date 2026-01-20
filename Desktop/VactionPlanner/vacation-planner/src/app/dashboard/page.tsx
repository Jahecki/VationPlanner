"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Trip {
  _id: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  peopleCount?: number;
  status: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // --- STANY DANYCH ---
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STANY FORMULARZA (MODAL) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDestination, setNewDestination] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newPeopleCount, setNewPeopleCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    } else if (status === "authenticated") {
      fetchTrips();
    }
  }, [status, router]);

  const fetchTrips = async () => {
    try {
      const res = await fetch("/api/trips");
      if (res.ok) {
        const data = await res.json();
        setTrips(data);
      }
    } catch (error) {
      console.error("Błąd pobierania wycieczek:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: newDestination,
          startDate: newStartDate,
          endDate: newEndDate,
          peopleCount: newPeopleCount
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Otrzymano odpowiedź z API:", data); // Debug w konsoli

        // --- KLUCZOWA POPRAWKA ---
        // Sprawdzamy czy ID faktycznie istnieje przed przekierowaniem
        if (data && data._id) {
          router.push(`/trips/${data._id}`);
        } else {
          console.error("Błąd: Brak ID w odpowiedzi API. Odświeżam listę.");
          setIsModalOpen(false);
          setNewDestination("");
          fetchTrips(); // Fallback: jeśli brak ID, po prostu odśwież dashboard
        }
      } else {
        alert("Wystąpił błąd podczas tworzenia wycieczki.");
      }
    } catch (error) {
      console.error("Błąd wysyłania formularza:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen bg-[#0a0e1a] text-white flex items-center justify-center">Ładowanie...</div>;
  }

  // Obliczanie statystyk
  const upcomingTrip = trips.length > 0 ? trips[0] : null;
  const tripsCount = trips.length;

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white font-sans relative overflow-hidden">
      {/* --- TŁO --- */}
      <div className="absolute inset-0 pointer-events-none fixed">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-900/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* --- NAGŁÓWEK --- */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Panel główny</p>
            <h1 className="text-4xl font-bold">
              Cześć, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{session?.user?.name || "Podróżniku"}</span>! 👋
            </h1>
            <p className="text-gray-400 mt-2">Gdzie poniesie Cię dzisiaj wyobraźnia?</p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => signOut()} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                Wyloguj
             </button>
          </div>
        </header>

        {/* --- STATYSTYKI --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Karta 1 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all cursor-default group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Zaplanowane podróże</p>
                <h3 className="text-4xl font-bold text-white group-hover:text-blue-400 transition-colors">{tripsCount}</h3>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400 text-xl">🗺️</div>
            </div>
          </div>

          {/* Karta 2 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all cursor-default group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Ulubiony kierunek</p>
                <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">Włochy 🍕</h3>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400 text-xl">🚩</div>
            </div>
          </div>

          {/* Karta 3 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all cursor-default group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Nadchodząca podróż</p>
                <h3 className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors">
                  {upcomingTrip ? upcomingTrip.destination : "Brak planów"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {upcomingTrip?.startDate ? new Date(upcomingTrip.startDate).toLocaleDateString() : "--"}
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg text-green-400 text-xl">📅</div>
            </div>
          </div>
        </div>

        {/* --- GRID GŁÓWNY --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEWA STRONA (Akcje) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">🚀 Szybkie akcje</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Przycisk OTWIERAJĄCY MODAL */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-blue-600 to-indigo-700 hover:scale-[1.02] transition-all shadow-lg shadow-blue-900/30 text-left w-full"
              >
                <div className="relative z-10">
                  <div className="mb-4 text-4xl">✨</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Stwórz nową podróż</h3>
                  <p className="text-blue-100/80 text-sm">Kliknij, aby dodać cel, daty i liczbę osób.</p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              </button>

              {/* Placeholder Inspiracje */}
              <div className="group relative overflow-hidden rounded-2xl p-8 bg-[#111625] border border-white/10 hover:border-purple-500/50 hover:scale-[1.02] transition-all">
                <div className="relative z-10">
                  <div className="mb-4 text-4xl">🌍</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Odkrywaj</h3>
                  <p className="text-gray-400 text-sm">Zobacz polecane hotele i atrakcje (Wkrótce).</p>
                </div>
              </div>
            </div>
          </div>

          {/* PRAWA STRONA (Lista z Bazy) */}
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Moje podróże</h2>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden max-h-[400px] overflow-y-auto">
              <div className="divide-y divide-white/5">
                {isLoading ? (
                  <p className="p-4 text-center text-gray-500">Wczytywanie...</p>
                ) : trips.length === 0 ? (
                  <p className="p-4 text-center text-gray-500">Brak podróży. Dodaj pierwszą!</p>
                ) : (
                  trips.map((trip) => (
                    <Link href={`/trips/${trip._id}`} key={trip._id}>
                        <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {trip.destination}
                            </h4>
                            <span className="text-[10px] bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                            {trip.peopleCount} os.
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">
                            {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : "Brak daty"}
                        </p>
                        </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL DODAWANIA (Overlay) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-bold mb-1">Nowa przygoda ✈️</h2>
            <p className="text-gray-400 text-sm mb-6">Wypełnij podstawowe dane. Hotele dodasz później.</p>

            <form onSubmit={handleAddTrip} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">Kierunek</label>
                <input 
                  type="text" 
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  placeholder="np. Tokio, Japonia"
                  className="w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-blue-500 outline-none text-white placeholder-gray-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase font-bold">Od</label>
                  <input 
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-blue-500 outline-none text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase font-bold">Do</label>
                  <input 
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-blue-500 outline-none text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">Ilość osób</label>
                <input 
                  type="number"
                  min="1"
                  value={newPeopleCount}
                  onChange={(e) => setNewPeopleCount(parseInt(e.target.value))}
                  className="w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-blue-500 outline-none text-white"
                />
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full py-3 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] rounded-lg font-bold transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Tworzenie..." : "Stwórz plan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}