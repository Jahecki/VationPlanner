"use client";

import { useState } from "react";
import { Hotel } from "@/app/lib/hotelApi";
import { Hotel as HotelIcon } from "lucide-react";
import { useLanguage } from "@/app/lib/context/LanguageContext";

interface HotelSearchProps {
    onAddHotel: (hotel: Hotel, checkIn?: Date, checkOut?: Date) => void;
    defaultCity?: string;
    tripStartDate?: string;
    tripEndDate?: string;
}

export default function HotelSearch({ onAddHotel, defaultCity, tripStartDate, tripEndDate }: HotelSearchProps) {
    const { t } = useLanguage();
    const [city, setCity] = useState(defaultCity || "");
    const [results, setResults] = useState<Hotel[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Selection state for adding
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
    const [dates, setDates] = useState({
        checkIn: tripStartDate ? new Date(tripStartDate).toISOString().split('T')[0] : "",
        checkOut: tripEndDate ? new Date(tripEndDate).toISOString().split('T')[0] : ""
    });

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!city) return;
        setIsSearching(true);
        setSelectedHotel(null);

        try {
            const res = await fetch(`/api/hotels/search?query=${encodeURIComponent(city)}`);
            const data = await res.json();
            setResults(data.results || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };

    const confirmAdd = () => {
        if (selectedHotel) {
            onAddHotel(
                selectedHotel,
                dates.checkIn ? new Date(dates.checkIn) : undefined,
                dates.checkOut ? new Date(dates.checkOut) : undefined
            );
            setSelectedHotel(null);
        }
    };

    return (
        <div className="bg-card border border-border p-6 rounded-2xl h-fit shadow-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <HotelIcon className="w-5 h-5 text-blue-500" />
                {t("hotel.title")}
            </h3>
            <div className="flex gap-2 mb-4"> {/* Changed from form to div */}
                <input
                    type="text"
                    value={city} // Changed query to city
                    onChange={(e) => setCity(e.target.value)} // Changed setQuery to setCity
                    placeholder={t("hotel.city")} // Changed placeholder
                    className="flex-grow bg-background/50 border border-input rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-colors text-foreground" // Changed bg-black/30, border-white/10, text-white
                />
                <button
                    disabled={isSearching}
                    onClick={handleSearch} // Added onClick for search
                    className="bg-blue-600 hover:bg-blue-500 px-4 rounded-lg font-bold transition-all disabled:opacity-50 text-white text-sm"
                >
                    {isSearching ? "..." : t("common.search")} {/* Changed "Szukaj" to t("common.search") */}
                </button>
            </div>

            {/* Selected Hotel Confirmation Overlay/Area */}
            {selectedHotel && (
                <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl animate-in fade-in zoom-in duration-200">
                    <h5 className="font-bold text-blue-100 mb-2">Rezerwacja: {selectedHotel.name}</h5>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="text-xs text-gray-400 block mb-1">Zameldowanie</label>
                            <input
                                type="date"
                                value={dates.checkIn}
                                onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
                                className="w-full bg-background/50 border border-input rounded px-2 py-1 text-sm text-foreground focus:border-primary outline-none" // Added missing classes
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 block mb-1">Wymeldowanie</label>
                            <input
                                type="date"
                                value={dates.checkOut}
                                onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
                                className="w-full bg-background/50 border border-input rounded px-2 py-1 text-sm text-foreground focus:border-primary outline-none" // Added missing classes
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={confirmAdd}
                            className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-bold text-sm transition-colors"
                        >
                            Potwierdź
                        </button>
                        <button
                            onClick={() => setSelectedHotel(null)}
                            className="px-3 bg-white/5 hover:bg-white/10 text-gray-300 py-2 rounded-lg font-bold text-sm transition-colors"
                        >
                            Anuluj
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {results.length > 0 ? (
                    results.map((result) => (
                        <div key={result.id} className="group p-3 bg-card hover:border-primary border border-border rounded-xl transition-all shadow-sm">
                            <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                                <img
                                    src={result.image}
                                    alt={result.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-yellow-500 border border-border"> {/* Changed bg-black/60, text-yellow-400, border-white/10 */}
                                    ★ {result.rating}
                                </div>
                            </div>

                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h5 className="font-bold text-white text-sm leading-tight mb-1">{result.name}</h5>
                                    <p className="text-xs text-gray-400">{result.address}</p>
                                </div>
                                <p className="text-green-400 font-bold text-sm whitespace-nowrap">{result.pricePerNight} {result.currency}<span className="text-xs text-gray-500 font-normal">/noc</span></p>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-3">
                                {result.amenities.slice(0, 3).map(am => (
                                    <span key={am} className="text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground border border-border">{am}</span>
                                ))}
                            </div>

                            <button
                                onClick={() => setSelectedHotel(result)}
                                className="w-full bg-white/10 hover:bg-blue-600 hover:text-white text-gray-300 py-2 rounded-lg transition-colors font-bold text-sm flex items-center justify-center gap-2"
                            >
                                <span>Wybierz daty</span>
                                <span className="text-lg leading-none">+</span>
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-3 opacity-20">🏨</div>
                        <p className="text-gray-600 text-sm">Wpisz miasto i kliknij Szukaj.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
