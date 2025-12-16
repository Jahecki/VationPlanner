// plik: src/app/trips/[id]/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// --- TYPY DANYCH ---
interface Activity {
  time: string;
  description: string;
}

interface DayPlan {
  date: string; 
  activities: Activity[];
}

interface Hotel {
  name: string;
  address: string;
  price: number;
  currency: string;
  rating?: number;
}

interface HotelSearchResult {
  id: string;
  name: string;
  address: string;
  price: number;
  rating: number;
  image: string;
}

interface TripDetails {
  _id: string;
  destination: string;
  startDate: string;
  endDate: string;
  peopleCount: number;
  hotels: Hotel[];
  itinerary: DayPlan[];
}

export default function TripDetailsPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [trip, setTrip] = useState<TripDetails | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "hotels" | "plan">("info");
  const [error, setError] = useState("");

  // Stany wyszukiwarki hoteli
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HotelSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Stany planu dnia
  const [activityInputs, setActivityInputs] = useState<{ 
    [key: string]: { time: string, text: string } 
  }>({});

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth");
    // Zabezpieczenie przed błędnym ID
    if (id && id !== "undefined") fetchTripDetails();
  }, [id, status]);

  const fetchTripDetails = async () => {
    try {
      const res = await fetch(`/api/trips/${id}`);
      if (!res.ok) {
        setError("Nie znaleziono podróży lub błąd serwera.");
        return;
      }
      const data = await res.json();
      setTrip(data);
      if (data.destination) setSearchQuery(data.destination);
    } catch (e) {
      setError("Błąd ładowania danych.");
    }
  };

  const updateTripData = async (newData: Partial<TripDetails>) => {
    if (!trip) return;
    // Optymistyczna aktualizacja UI
    setTrip({ ...trip, ...newData });

    try {
      await fetch(`/api/trips/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
    } catch (e) {
      console.error("Błąd zapisu", e);
      alert("Nie udało się zapisać zmian.");
    }
  };

  // --- HOTELE ---
  const handleSearchHotels = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    
    try {
      const res = await fetch(`/api/hotels/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddHotelFromSearch = (result: HotelSearchResult) => {
    if (!trip) return;
    const newHotel: Hotel = {
      name: result.name,
      address: result.address,
      price: result.price,
      currency: "PLN",
      rating: result.rating
    };
    
    // Używamy bezpiecznej tablicy (jeśli hotels jest undefined, użyj [])
    const currentHotels = trip.hotels || [];
    const updatedHotels = [...currentHotels, newHotel];
    updateTripData({ hotels: updatedHotels });
  };

  const handleRemoveHotel = (index: number) => {
    if (!trip) return;
    const currentHotels = trip.hotels || [];
    const updatedHotels = currentHotels.filter((_, i) => i !== index);
    updateTripData({ hotels: updatedHotels });
  };

  // --- PLAN DNIA ---
  const getDaysArray = (start: string, end: string) => {
    if (!start || !end) return [];
    const arr = [];
    const endDate = new Date(end);
    for (let dt = new Date(start); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt));
    }
    return arr;
  };

  const handleAddActivity = (dateObj: Date) => {
    if (!trip) return;
    const dateKey = dateObj.toISOString().split('T')[0];
    const input = activityInputs[dateKey] || { time: "", text: "" };
    if (!input.text) return;

    // Bezpieczne pobranie itinerary
    const currentItinerary = trip.itinerary || [];
    let updatedItinerary = [...currentItinerary];
    
    const existingDayIndex = updatedItinerary.findIndex(day => day.date && day.date.startsWith(dateKey));

    const newActivity = { 
      time: input.time || "00:00", 
      description: input.text 
    };

    if (existingDayIndex >= 0) {
      updatedItinerary[existingDayIndex].activities.push(newActivity);
      updatedItinerary[existingDayIndex].activities.sort((a, b) => a.time.localeCompare(b.time));
    } else {
      updatedItinerary.push({
        date: dateObj.toISOString(),
        activities: [newActivity]
      });
    }

    updateTripData({ itinerary: updatedItinerary });
    setActivityInputs(prev => ({ ...prev, [dateKey]: { time: "", text: "" } }));
  };

  const handleRemoveActivity = (dateString: string, activityIndex: number) => {
    if (!trip) return;
    const dateKey = dateString.split('T')[0];
    
    const currentItinerary = trip.itinerary || [];
    let updatedItinerary = [...currentItinerary];
    
    const dayIndex = updatedItinerary.findIndex(day => day.date && day.date.startsWith(dateKey));

    if (dayIndex >= 0) {
      updatedItinerary[dayIndex].activities = updatedItinerary[dayIndex].activities.filter((_, i) => i !== activityIndex);
      updateTripData({ itinerary: updatedItinerary });
    }
  };

  const handleInputChange = (dateKey: string, field: "time" | "text", value: string) => {
    setActivityInputs(prev => ({
      ...prev,
      [dateKey]: { ...prev[dateKey], [field]: value }
    }));
  };

  // --- RENDEROWANIE ---
  if (error) return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl text-red-400 font-bold">Wystąpił błąd 😕</h2>
      <p className="text-gray-400">{error}</p>
      <Link href="/dashboard" className="px-6 py-2 bg-blue-600 rounded-full hover:bg-blue-500 transition-all font-bold">
        Wróć do pulpitu
      </Link>
    </div>
  );

  if (!trip) return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex items-center justify-center flex-col gap-2">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p>Ładowanie Twojej podróży...</p>
    </div>
  );

  // --- ZMIENNE POMOCNICZE (BEZPIECZNE) ---
  const safeHotels = trip.hotels || [];
  const safeItinerary = trip.itinerary || [];
  const tripDays = getDaysArray(trip.startDate, trip.endDate);
  const totalBudget = safeHotels.reduce((acc, curr) => acc + (curr.price || 0), 0);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white font-sans relative overflow-hidden pb-20">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none fixed"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm mb-4 inline-block transition-colors">← Wróć do panelu</Link>
        
        <header className="mb-8 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-indigo-200">
              {trip.destination}
            </h1>
            <div className="flex gap-4 text-gray-400 text-sm font-medium">
              <span className="flex items-center gap-1">
                📅 {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">👥 {trip.peopleCount} osób</span>
            </div>
          </div>
          <div className="text-left md:text-right bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Budżet (noclegi)</p>
            <p className="text-2xl font-bold text-green-400">{totalBudget} PLN</p>
          </div>
        </header>

        <div className="flex gap-8 border-b border-white/10 mb-8 sticky top-0 bg-[#0a0e1a]/95 backdrop-blur-xl z-20 pt-4 overflow-x-auto">
          {["info", "hotels", "plan"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab === "info" ? "Informacje" : tab === "hotels" ? "Hotele" : "Plan Dnia"}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* 1. INFORMACJE */}
          {activeTab === "info" && (
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-4">Statystyki podróży</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                  <p className="text-gray-400 text-xs uppercase mb-1">Status</p>
                  <p className="text-green-400 font-bold">W trakcie planowania</p>
                </div>
                <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                  <p className="text-gray-400 text-xs uppercase mb-1">Długość pobytu</p>
                  <p className="text-white font-bold">{tripDays.length} dni</p>
                </div>
                <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                  <p className="text-gray-400 text-xs uppercase mb-1">Zarezerwowane noclegi</p>
                  <p className="text-white font-bold">{safeHotels.length}</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. HOTELE */}
          {activeTab === "hotels" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4 order-2 lg:order-1">
                <h3 className="text-xl font-bold mb-4">Twoje rezerwacje</h3>
                {safeHotels.length === 0 && (
                  <div className="p-8 text-center border-2 border-dashed border-white/10 rounded-2xl text-gray-500">
                    <p>Brak hoteli.</p>
                    <p className="text-sm">Użyj wyszukiwarki obok, aby coś dodać.</p>
                  </div>
                )}
                {safeHotels.map((hotel, index) => (
                  <div key={index} className="p-5 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center group hover:bg-white/10 transition-colors">
                    <div className="flex gap-4 items-center">
                      <div className="text-2xl bg-blue-500/20 p-2 rounded-lg">🏨</div>
                      <div>
                        <h4 className="font-bold text-blue-100">{hotel.name}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-gray-400">
                          <span>{hotel.address}</span>
                          {hotel.rating && <span className="text-yellow-500">{'★'.repeat(hotel.rating)}</span>}
                        </div>
                        <p className="text-green-400 text-sm font-bold mt-1">{hotel.price} PLN</p>
                      </div>
                    </div>
                    <button onClick={() => handleRemoveHotel(index)} className="text-gray-500 hover:text-red-400 p-2 transition-colors">Usuń</button>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-[#1a1f2e] to-[#11151f] border border-white/10 p-6 rounded-2xl h-fit shadow-xl order-1 lg:order-2">
                <h4 className="font-bold mb-4 flex items-center gap-2 text-blue-200">🔍 Znajdź nocleg</h4>
                <form onSubmit={handleSearchHotels} className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Miasto (np. Paryż)..."
                    className="flex-grow bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors text-white"
                  />
                  <button disabled={isSearching} className="bg-blue-600 hover:bg-blue-500 px-4 rounded-lg font-bold transition-all disabled:opacity-50 text-white text-sm">
                    {isSearching ? "..." : "Szukaj"}
                  </button>
                </form>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <div key={result.id} className="p-3 bg-black/20 hover:bg-black/40 border border-white/5 rounded-xl flex items-center gap-3 transition-colors">
                        <div className="text-2xl">{result.image}</div>
                        <div className="flex-grow">
                          <p className="font-bold text-sm text-white">{result.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[150px]">{result.address}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-yellow-500 text-xs">{'★'.repeat(result.rating)}</span>
                            <span className="text-green-400 text-xs font-bold">{result.price} PLN</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleAddHotelFromSearch(result)}
                          className="bg-white/10 hover:bg-green-600 hover:text-white text-gray-300 p-2 rounded-lg transition-colors font-bold"
                        >
                          +
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-600 text-sm py-4">Wpisz miasto i kliknij Szukaj, aby zobaczyć przykładowe oferty.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. PLAN DNIA */}
          {activeTab === "plan" && (
            <div className="space-y-12">
              {tripDays.map((dayDate, index) => {
                const dateKey = dayDate.toISOString().split('T')[0];
                
                // --- TUTAJ BYŁ BŁĄD, TERAZ JEST NAPRAWIONY ---
                // Używamy bezpiecznej zmiennej safeItinerary
                const dayData = safeItinerary.find(d => d.date && d.date.startsWith(dateKey));
                const inputValue = activityInputs[dateKey] || { time: "", text: "" };

                return (
                  <div key={dateKey} className="relative pl-8 md:pl-0">
                    <div className="flex items-baseline gap-4 mb-6 md:ml-32">
                      <h3 className="text-2xl font-bold text-white">Dzień {index + 1}</h3>
                      <span className="text-gray-500 text-sm font-medium capitalize">
                        {dayDate.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </span>
                    </div>
                    <div className="relative border-l-2 border-white/10 ml-0 md:ml-[120px] space-y-6 pb-4">
                      {/* Bezpieczne mapowanie opcjonalne ?. */}
                      {dayData?.activities?.map((activity, actIndex) => (
                        <div key={actIndex} className="relative pl-8 group">
                          <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-[#0a0e1a] z-10"></div>
                          <div className="absolute -left-[110px] top-0.5 w-[80px] text-right font-mono text-sm text-blue-400 font-bold hidden md:block">
                            {activity.time}
                          </div>
                          <div className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors flex justify-between items-start">
                            <div>
                              <span className="md:hidden text-blue-400 text-xs font-mono font-bold block mb-1">{activity.time}</span>
                              <p className="text-gray-200">{activity.description}</p>
                            </div>
                            <button onClick={() => handleRemoveActivity(dayData.date, actIndex)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1">✕</button>
                          </div>
                        </div>
                      ))}
                      <div className="relative pl-8 mt-4">
                        <div className="absolute -left-[5px] top-4 w-2 h-2 rounded-full bg-gray-600"></div>
                        <div className="flex flex-col md:flex-row gap-3">
                          <input type="time" value={inputValue.time} onChange={(e) => handleInputChange(dateKey, "time", e.target.value)} className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none text-white w-full md:w-32" />
                          <input type="text" placeholder="Dodaj aktywność..." value={inputValue.text} onChange={(e) => handleInputChange(dateKey, "text", e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddActivity(dayDate)} className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-blue-500 outline-none text-white flex-grow" />
                          <button onClick={() => handleAddActivity(dayDate)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-900/20">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}