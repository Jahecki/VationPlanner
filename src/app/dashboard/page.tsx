"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Map, Calendar, Users, Plus, Compass, LogOut, ArrowRight, MapPin, Flag, Briefcase } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { LanguageToggle } from "../components/LanguageToggle";
import { useLanguage } from "../lib/context/LanguageContext";

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
  const { t } = useLanguage();

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
        if (data && data._id) {
          router.push(`/trips/${data._id}`);
        } else {
          console.error("Błąd: Brak ID w odpowiedzi API. Odświeżam listę.");
          setIsModalOpen(false);
          setNewDestination("");
          fetchTrips();
        }
      } else {
        alert(t("modal.error"));
      }
    } catch (error) {
      console.error("Błąd wysyłania formularza:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">{t("dash.loading")}</div>;
  }

  // Obliczanie statystyk
  const upcomingTrip = trips.length > 0 ? trips[0] : null;
  const tripsCount = trips.length;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden transition-colors duration-300">
      {/* --- TŁO --- */}
      <div className="absolute inset-0 pointer-events-none fixed">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-900/40 rounded-full blur-[100px] animate-pulse dark:bg-purple-900/20"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[100px] animate-pulse delay-1000 dark:bg-blue-900/20"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 dark:opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* --- NAGŁÓWEK --- */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <p className="text-muted-foreground text-sm uppercase tracking-wider mb-1">{t("dash.main")}</p>
            <h1 className="text-4xl font-bold">
              {t("dash.welcome")}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{session?.user?.name || t("dash.traveler")}</span>! 👋
            </h1>
            <p className="text-muted-foreground mt-2">{t("dash.subtitle")}</p>
          </div>
          <div className="flex gap-4 items-center">
            {/* Import Toggles locally if needed or just use logic */}
            {/* Ideally we should import them. I will assume imports are added at top */}
            <ThemeToggle />
            <LanguageToggle />

            <button onClick={() => signOut()} className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="w-4 h-4" />
              {t("nav.logout")}
            </button>
          </div>
        </header>

        {/* --- STATYSTYKI --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Karta 1 */}
          <div className="p-6 rounded-2xl bg-card border border-border backdrop-blur-lg hover:border-primary/50 transition-all cursor-default group shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">{t("dash.stats.planned")}</p>
                <h3 className="text-4xl font-bold text-foreground group-hover:text-blue-400 transition-colors">{tripsCount}</h3>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                <Map className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Karta 2 */}
          <div className="p-6 rounded-2xl bg-card border border-border backdrop-blur-lg hover:border-primary/50 transition-all cursor-default group shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">{t("dash.stats.favorite")}</p>
                <h3 className="text-2xl font-bold text-foreground group-hover:text-purple-400 transition-colors">Europa 🍕</h3>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                <Flag className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Karta 3 */}
          <div className="p-6 rounded-2xl bg-card border border-border backdrop-blur-lg hover:border-primary/50 transition-all cursor-default group shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">{t("dash.stats.upcoming")}</p>
                <h3 className="text-2xl font-bold text-foreground group-hover:text-green-400 transition-colors">
                  {upcomingTrip ? upcomingTrip.destination : t("dash.stats.noplans")}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {upcomingTrip?.startDate ? new Date(upcomingTrip.startDate).toLocaleDateString() : "--"}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* --- GRID GŁÓWNY --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEWA STRONA (Akcje) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">🚀 {t("dash.quickActions")}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Przycisk OTWIERAJĄCY MODAL */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-violet-600 to-indigo-600 hover:scale-[1.02] transition-all shadow-lg shadow-violet-500/20 text-left w-full"
              >
                <div className="relative z-10">
                  <div className="mb-4 bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{t("dash.createTrip")}</h3>
                  <p className="text-blue-100/80 text-sm">{t("dash.createTripDesc")}</p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              </button>

              {/* Link do Odkrywaj */}
              <Link href="/community" className="group relative overflow-hidden rounded-2xl p-8 bg-card border border-border hover:border-purple-500/50 hover:scale-[1.02] transition-all block shadow-sm">
                <div className="relative z-10">
                  <div className="mb-4 bg-purple-500/10 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Compass className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{t("dash.explore")}</h3>
                  <p className="text-muted-foreground text-sm">{t("dash.exploreDesc")}</p>
                </div>
              </Link>
            </div>
          </div>

          {/* PRAWA STRONA (Lista z Bazy) */}
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">{t("dash.myTrips")}</h2>
            </div>

            <div className="bg-card border border-border rounded-2xl backdrop-blur-md overflow-hidden max-h-[400px] overflow-y-auto shadow-sm">
              <div className="divide-y divide-border">
                {isLoading ? (
                  <p className="p-4 text-center text-muted-foreground">{t("dash.loading")}</p>
                ) : trips.length === 0 ? (
                  <p className="p-4 text-center text-muted-foreground">{t("dash.noTrips")}</p>
                ) : (
                  trips.map((trip) => (
                    <Link href={`/trips/${trip._id}`} key={trip._id}>
                      <div className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-semibold text-foreground group-hover:text-blue-500 transition-colors flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            {trip.destination}
                          </h4>
                          <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {trip.peopleCount}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground pl-5">
                          {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : t("dash.noDate")}
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
          <div className="bg-popover border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2 text-foreground">
              <Briefcase className="w-6 h-6 text-blue-500" />
              {t("modal.newAdventure")}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">{t("modal.desc")}</p>

            <form onSubmit={handleAddTrip} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase font-bold">{t("modal.destination")}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    placeholder={t("modal.placeholder")}
                    className="w-full mt-1 bg-background/50 border border-input rounded-lg pl-10 pr-4 py-3 focus:border-blue-500 outline-none text-foreground placeholder-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase font-bold">{t("modal.from")}</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full mt-1 bg-background/50 border border-input rounded-lg px-4 py-3 focus:border-blue-500 outline-none text-foreground text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase font-bold">{t("modal.to")}</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full mt-1 bg-background/50 border border-input rounded-lg px-4 py-3 focus:border-blue-500 outline-none text-foreground text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground uppercase font-bold">{t("modal.people")}</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="number"
                    min="1"
                    value={newPeopleCount}
                    onChange={(e) => setNewPeopleCount(parseInt(e.target.value))}
                    className="w-full mt-1 bg-background/50 border border-input rounded-lg pl-10 pr-4 py-3 focus:border-blue-500 outline-none text-foreground"
                  />
                </div>
              </div>

              <button
                disabled={isSubmitting}
                className="w-full py-3 mt-2 bg-primary text-primary-foreground hover:scale-[1.02] rounded-lg font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                {isSubmitting ? t("modal.creating") : (
                  <>
                    {t("modal.create")} <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}