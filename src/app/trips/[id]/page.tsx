"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import HotelSearch from "./HotelSearch";
import Reviews from "./Reviews";
import { useLanguage } from "@/app/lib/context/LanguageContext";
import { Hotel as ApiHotel } from "@/app/lib/hotelApi";

interface Activity {
  time: string;
  description: string;
  cost?: number;
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
  image?: string;
  checkIn?: string;
  checkOut?: string;
}

interface TripDetails {
  _id: string;
  destination: string;
  startDate: string;
  endDate: string;
  peopleCount: number;
  hotels: Hotel[];
  itinerary: DayPlan[];
  isPublic?: boolean;
  isOwner?: boolean;
}

export default function TripDetailsPage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { t } = useLanguage();

  const [trip, setTrip] = useState<TripDetails | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "hotels" | "plan" | "reviews">("info");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Stany planu dnia
  const [activityInputs, setActivityInputs] = useState<{
    [key: string]: { time: string, text: string, cost: string }
  }>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      // Permit access if public, but API handles logic. If API returns 401/403, we handle it.
      // For now, let's try to fetch.
      fetchTripDetails();
    } else if (status === "authenticated") {
      if (id && id !== "undefined") fetchTripDetails();
    }
  }, [id, status]);

  const fetchTripDetails = async () => {
    try {
      const res = await fetch(`/api/trips/${id}`);
      if (res.status === 401) {
        router.push("/auth");
        return;
      }
      if (!res.ok) {
        setError("Nie znaleziono podróży lub brak dostępu.");
        return;
      }
      const data = await res.json();
      setTrip(data);
    } catch (e) {
      setError("Błąd ładowania danych.");
    }
  };

  const updateTripData = async (newData: Partial<TripDetails>) => {
    if (!trip || !trip.isOwner) return;

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

  const handleSaveTrip = async () => {
    if (!session) {
      alert("Zaloguj się, aby zapisać.");
      return;
    }
    if (!confirm("Skopiować ten plan do Twoich podróży?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/trips/${id}/save`, { method: "POST" });
      if (res.ok) {
        const newTrip = await res.json();
        if (confirm("Plan zapisany! Przejść do edycji?")) {
          router.push(`/trips/${newTrip._id}`);
        }
      } else {
        alert("Błąd zapisu.");
      }
    } catch (e) {
      alert("Wystąpił błąd.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddHotel = (hotel: ApiHotel, checkIn?: Date, checkOut?: Date) => {
    if (!trip || !trip.isOwner) return;

    let totalPrice = hotel.pricePerNight;
    if (checkIn && checkOut) {
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        totalPrice = hotel.pricePerNight * diffDays;
      }
    }

    const newHotel: Hotel = {
      name: hotel.name,
      address: hotel.address,
      price: totalPrice,
      currency: hotel.currency,
      rating: hotel.rating,
      image: hotel.image,
      checkIn: checkIn?.toISOString(),
      checkOut: checkOut?.toISOString()
    };

    const currentHotels = trip.hotels || [];
    const updatedHotels = [...currentHotels, newHotel];
    updateTripData({ hotels: updatedHotels });
  };

  const handleRemoveHotel = (index: number) => {
    if (!trip || !trip.isOwner) return;
    const currentHotels = trip.hotels || [];
    const updatedHotels = currentHotels.filter((_, i) => i !== index);
    updateTripData({ hotels: updatedHotels });
  };

  const getDaysArray = (start: string, end: string) => {
    if (!start || !end) return [];

    let startDate = new Date(start);
    let endDate = new Date(end);

    // Swap if start is after end
    if (startDate > endDate) {
      [startDate, endDate] = [endDate, startDate];
    }

    const arr = [];
    for (let dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt));
    }
    return arr;
  };

  const handleAddActivity = (dateObj: Date) => {
    if (!trip || !trip.isOwner) return;
    const dateKey = dateObj.toISOString().split('T')[0];
    const input = activityInputs[dateKey] || { time: "", text: "", cost: "" };
    if (!input.text) return;

    const currentItinerary = trip.itinerary || [];
    let updatedItinerary = [...currentItinerary];

    const existingDayIndex = updatedItinerary.findIndex(day => day.date && day.date.startsWith(dateKey));

    const newActivity = {
      time: input.time || "00:00",
      description: input.text,
      cost: input.cost ? parseFloat(input.cost) : 0
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
    setActivityInputs(prev => ({ ...prev, [dateKey]: { time: "", text: "", cost: "" } }));
  };

  const handleRemoveActivity = (dateString: string, activityIndex: number) => {
    if (!trip || !trip.isOwner) return;
    const dateKey = dateString.split('T')[0];

    const currentItinerary = trip.itinerary || [];
    let updatedItinerary = [...currentItinerary];

    const dayIndex = updatedItinerary.findIndex(day => day.date && day.date.startsWith(dateKey));

    if (dayIndex >= 0) {
      updatedItinerary[dayIndex].activities = updatedItinerary[dayIndex].activities.filter((_, i) => i !== activityIndex);
      updateTripData({ itinerary: updatedItinerary });
    }
  };

  const handleInputChange = (dateKey: string, field: "time" | "text" | "cost", value: string) => {
    setActivityInputs(prev => ({
      ...prev,
      [dateKey]: { ...prev[dateKey], [field]: value }
    }));
  };

  if (error) return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl text-destructive font-bold">{t("error.generic")} 😕</h2>
      <p className="text-muted-foreground">{error}</p>
      <Link href="/dashboard" className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-all font-bold">
        {t("nav.dashboard")}
      </Link>
    </div>
  );

  if (!trip) return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center flex-col gap-2">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p>{t("loading")}</p>
    </div>
  );

  const safeHotels = trip.hotels || [];
  const safeItinerary = trip.itinerary || [];
  const tripDays = getDaysArray(trip.startDate, trip.endDate);

  // Calculate total budget (Hotels + Activities)
  const hotelBudget = safeHotels.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const activityBudget = safeItinerary.reduce((acc, day) => {
    return acc + (day.activities?.reduce((sum, act) => sum + (act.cost || 0), 0) || 0);
  }, 0);
  const totalBudget = hotelBudget + activityBudget;

  const isOwner = trip.isOwner;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden pb-20">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 dark:opacity-10 pointer-events-none fixed"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground text-sm mb-4 inline-block transition-colors">← {t("community.back")}</Link>

        {/* HEADER */}
        <header className="mb-8 border-b border-border pb-8 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-300 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              {trip.destination}
            </h1>
            <div className="flex gap-4 text-muted-foreground text-sm font-medium">
              <span className="flex items-center gap-1">
                📅 {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">👥 {trip.peopleCount} {t("modal.people")}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <div className="text-left md:text-right bg-card p-4 rounded-xl border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Budżet (Razem)</p>
              <p className="text-2xl font-bold text-green-500">{totalBudget} PLN</p>
              <p className="text-xs text-muted-foreground">Hotele: {hotelBudget} PLN | Atrakcje: {activityBudget} PLN</p>
            </div>

            {isOwner ? (
              <button
                onClick={() => updateTripData({ isPublic: !trip.isPublic })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${trip.isPublic
                  ? "bg-green-500/10 text-green-500 border-green-500/50 hover:bg-green-500/20"
                  : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                  }`}
              >
                <span className={`w-2 h-2 rounded-full ${trip.isPublic ? "bg-green-500 shadow-[0_0_10px_rgba(74,222,128,0.5)]" : "bg-gray-400"}`}></span>
                {trip.isPublic ? "Publiczna (Widoczna)" : "Prywatna"}
              </button>
            ) : (
              <button
                onClick={handleSaveTrip}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:scale-[1.02] rounded-lg font-bold transition-all disabled:opacity-50"
              >
                {saving ? "Zapisywanie..." : "💾 Zapisz ten plan"}
              </button>
            )}
          </div>
        </header>

        {/* TABS */}
        <div className="flex gap-8 border-b border-border mb-8 sticky top-0 bg-background/95 backdrop-blur-xl z-20 pt-4 overflow-x-auto">
          {["info", "hotels", "plan", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab === "info" ? "Informacje" : tab === "hotels" ? "Hotele" : tab === "plan" ? "Plan Dnia" : "Opinie"}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">

          {activeTab === "info" && (
            <div className="bg-card border border-border p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-4">Statystyki podróży</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-muted/50 rounded-xl border border-border">
                  <p className="text-muted-foreground text-xs uppercase mb-1">Status</p>
                  <p className="text-green-500 font-bold">
                    {isOwner ? "Twój plan" : "Plan publiczny"}
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl border border-border">
                  <p className="text-muted-foreground text-xs uppercase mb-1">Długość pobytu</p>
                  <p className="text-foreground font-bold">{tripDays.length} dni</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl border border-border">
                  <p className="text-muted-foreground text-xs uppercase mb-1">Zarezerwowane noclegi</p>
                  <p className="text-foreground font-bold">{safeHotels.length}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "hotels" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className={`space-y-4 ${isOwner ? "order-2 lg:order-1" : "col-span-2"}`}>
                <h3 className="text-xl font-bold mb-4">Rezerwacje</h3>
                {safeHotels.length === 0 && (
                  <div className="p-8 text-center border-2 border-dashed border-border rounded-2xl text-muted-foreground">
                    <p>Brak hoteli.</p>
                  </div>
                )}
                {safeHotels.map((hotel, index) => (
                  <div key={index} className="p-5 bg-card border border-border rounded-xl flex gap-4 group hover:border-primary/50 transition-colors">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                      {hotel.image ? (
                        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🏨</div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-foreground">{hotel.name}</h4>
                          <span className="text-xs text-muted-foreground block mb-1">{hotel.address}</span>
                          {hotel.rating && <span className="text-yellow-500 text-xs">{'★'.repeat(Math.round(hotel.rating))}</span>}
                        </div>
                        {isOwner && (
                          <button onClick={() => handleRemoveHotel(index)} className="text-muted-foreground hover:text-destructive p-1 transition-colors">✕</button>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {hotel.checkIn && (
                          <span className="bg-blue-500/10 text-blue-500 px-2 py-1 rounded border border-blue-500/20">
                            📅 {new Date(hotel.checkIn).toLocaleDateString()}
                          </span>
                        )}
                        {hotel.checkOut && (
                          <span className="bg-blue-500/10 text-blue-500 px-2 py-1 rounded border border-blue-500/20">
                            ➡ {new Date(hotel.checkOut).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-green-500 text-sm font-bold mt-2 text-right">{hotel.price} {hotel.currency}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Wyszukiwarka (Tylko dla właściciela) */}
              {isOwner && (
                <div className="order-1 lg:order-2">
                  <HotelSearch
                    onAddHotel={handleAddHotel}
                    defaultCity={trip.destination}
                    tripStartDate={trip.startDate}
                    tripEndDate={trip.endDate}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "plan" && (
            <div className="space-y-12">
              {tripDays.map((dayDate, index) => {
                const dateKey = dayDate.toISOString().split('T')[0];
                const dayData = safeItinerary.find(d => d.date && d.date.startsWith(dateKey));
                const inputValue = activityInputs[dateKey] || { time: "", text: "", cost: "" };

                return (
                  <div key={dateKey} className="relative pl-8 md:pl-0">
                    <div className="flex items-baseline gap-4 mb-6 md:ml-32">
                      <h3 className="text-2xl font-bold text-foreground">Dzień {index + 1}</h3>
                      <span className="text-muted-foreground text-sm font-medium capitalize">
                        {dayDate.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </span>
                    </div>
                    <div className="relative border-l-2 border-border ml-0 md:ml-[120px] space-y-6 pb-4">
                      {dayData?.activities?.map((activity, actIndex) => (
                        <div key={actIndex} className="relative pl-8 group">
                          <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background z-10"></div>
                          <div className="absolute -left-[110px] top-0.5 w-[80px] text-right font-mono text-sm text-primary font-bold hidden md:block">
                            {activity.time}
                          </div>
                          <div className="bg-card border border-border p-4 rounded-xl hover:border-primary/50 transition-colors flex justify-between items-start">
                            <div>
                              <span className="md:hidden text-primary text-xs font-mono font-bold block mb-1">{activity.time}</span>
                              <div className="flex items-center gap-2">
                                <p className="text-foreground font-medium">{activity.description}</p>
                                {activity.cost && activity.cost > 0 && (
                                  <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20">
                                    {activity.cost} PLN
                                  </span>
                                )}
                              </div>
                            </div>
                            {isOwner && (
                              <button onClick={() => handleRemoveActivity(dayData.date, actIndex)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1">✕</button>
                            )}
                          </div>
                        </div>
                      ))}

                      {isOwner && (
                        <div className="relative pl-8 mt-4">
                          <div className="absolute -left-[5px] top-4 w-2 h-2 rounded-full bg-muted-foreground"></div>
                          <div className="flex flex-col md:flex-row gap-3">
                            <input type="time" value={inputValue.time} onChange={(e) => handleInputChange(dateKey, "time", e.target.value)} className="bg-background/50 border border-input rounded-lg px-3 py-2 text-sm focus:border-primary outline-none text-foreground w-full md:w-32" />
                            <input type="text" placeholder="Dodaj aktywność..." value={inputValue.text} onChange={(e) => handleInputChange(dateKey, "text", e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddActivity(dayDate)} className="bg-background/50 border border-input rounded-lg px-4 py-2 text-sm focus:border-primary outline-none text-foreground flex-grow" />
                            <input
                              type="number"
                              placeholder="Koszt (PLN)"
                              value={inputValue.cost || ""}
                              onChange={(e) => handleInputChange(dateKey, "cost", e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddActivity(dayDate)}
                              className="bg-background/50 border border-input rounded-lg px-3 py-2 text-sm focus:border-primary outline-none text-foreground w-24 md:w-32"
                            />
                            <button onClick={() => handleAddActivity(dayDate)} className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20">+</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "reviews" && (
            <Reviews tripId={trip._id} isOwner={!!isOwner} />
          )}

        </div>
      </div>
    </div>
  );
}