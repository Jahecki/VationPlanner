"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "../lib/context/LanguageContext";
import { ArrowLeft, Search, Star, Calendar, Hotel, Globe, User, Download } from "lucide-react";

interface PublicTrip {
    _id: string;
    destination: string;
    startDate: string;
    endDate: string;
    hotels: any[];
    userId: {
        name: string;
        email: string;
        image?: string;
    };
    averageRating?: number;
    reviewsCount?: number;
}

export default function CommunityPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { t } = useLanguage();
    const [trips, setTrips] = useState<PublicTrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);

    // Filtry
    const [search, setSearch] = useState("");
    const [minRating, setMinRating] = useState(0);

    // Debounce wyszukiwania
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTrips();
        }, 500);
        return () => clearTimeout(timer);
    }, [search, minRating]);

    const fetchTrips = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (minRating > 0) params.append("minRating", minRating.toString());

            const res = await fetch(`/api/trips/public?${params.toString()}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setTrips(data);
            } else {
                setTrips([]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTrip = async (tripId: string) => {
        if (!session) {
            if (confirm(t("community.confirm.login"))) {
                router.push("/auth");
            }
            return;
        }

        if (!confirm(t("community.confirm.save"))) return;

        setSavingId(tripId);
        try {
            const res = await fetch(`/api/trips/${tripId}/save`, {
                method: "POST",
            });

            if (res.ok) {
                const newTrip = await res.json();
                if (confirm(t("community.confirm.success"))) {
                    router.push(`/trips/${newTrip._id}`);
                }
            } else {
                const err = await res.json();
                alert(err.error || t("community.error.save"));
            }
        } catch (error) {
            console.error("Błąd zapisu:", error);
            alert("Error.");
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden transition-colors duration-300">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 dark:opacity-10 pointer-events-none fixed"></div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
                <div className="flex justify-between items-center mb-8">
                    <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm inline-block transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        {t("community.back")}
                    </Link>

                    {/* Toggles if needed here, but usually in Navbar. 
                        Since Community page doesn't have the main Navbar from Homepage, 
                        we should ideally import Navbar component. 
                        For now, assuming users navigate from Homepage/Dashboard where they set preference.
                        But let's add them for consistency if space allows or just rely on global setting.
                    */}
                </div>

                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        {t("community.title")}
                    </h1>
                    <p className="text-muted-foreground text-lg mb-8">{t("community.subtitle")}</p>

                    {/* FILTRY */}
                    <div className="flex flex-col md:flex-row justify-center gap-4 max-w-2xl mx-auto bg-card/50 p-4 rounded-2xl border border-border backdrop-blur-md">
                        <div className="flex-grow relative">
                            <Search className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder={t("community.search")}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-background/50 border border-input rounded-xl pl-10 pr-4 py-3 focus:border-primary outline-none text-foreground placeholder-muted-foreground transition-all"
                            />
                        </div>
                        <div className="flex-shrink-0 relative">
                            <Star className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                            <select
                                value={minRating}
                                onChange={(e) => setMinRating(Number(e.target.value))}
                                className="w-full md:w-auto bg-background/50 border border-input rounded-xl pl-10 pr-8 py-3 focus:border-primary outline-none text-foreground appearance-none cursor-pointer"
                            >
                                <option value="0">{t("community.filter.all")}</option>
                                <option value="3">{t("community.filter.3plus")}</option>
                                <option value="4">{t("community.filter.4plus")}</option>
                                <option value="5">{t("community.filter.5only")}</option>
                            </select>
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : trips.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
                        <p className="text-2xl text-muted-foreground mb-2">{t("community.empty")}</p>
                        <p className="text-muted-foreground">{t("community.emptyDesc")}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trips.map((trip) => (
                            <div key={trip._id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 flex flex-col">
                                <Link href={`/trips/${trip._id}`} className="block relative h-40 bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center overflow-hidden">
                                    <Globe className="w-16 h-16 text-white/20 absolute rotate-12" />
                                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent z-20"></div>
                                    <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white drop-shadow-lg z-30">{trip.destination}</h3>
                                </Link>

                                <div className="p-6 flex-grow flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-xs font-bold text-white shadow-md">
                                                {trip.userId?.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{trip.userId?.name || "Nieznany"}</p>
                                                <div className="flex items-center gap-1 text-xs text-yellow-500">
                                                    <Star className="w-3 h-3 fill-yellow-500" />
                                                    <span>{trip.averageRating ? trip.averageRating.toFixed(1) : "0.0"}</span>
                                                    <span className="text-muted-foreground">({trip.reviewsCount || 0})</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-sm text-muted-foreground border-t border-border pt-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{new Date(trip.startDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Hotel className="w-3 h-3" />
                                                <span>{trip.hotels?.length || 0} {t("community.hotels")}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleSaveTrip(trip._id)}
                                        disabled={savingId === trip._id}
                                        className="mt-6 w-full py-2 bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground border border-input rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        {savingId === trip._id ? t("community.saving") : t("community.save")}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
