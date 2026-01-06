"use client";

import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0a0e1a] text-white font-sans relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none fixed"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                <Link href="/" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Wróć na stronę główną
                </Link>

                <header className="mb-12 border-b border-white/10 pb-8">
                    <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
                        <Scale className="w-10 h-10 text-blue-500" />
                        Regulamin Serwisu
                    </h1>
                    <p className="text-gray-400">Ostatnia aktualizacja: {new Date().toLocaleDateString()}</p>
                </header>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Postanowienia Ogólne</h2>
                        <p>
                            Niniejszy regulamin określa zasady korzystania z serwisu VacationPlanner. Korzystając z serwisu, użytkownik akceptuje warunki tu zawarte.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Usługi</h2>
                        <p>
                            Serwis umożliwia planowanie podróży, wyszukiwanie hoteli oraz dzielenie się planami z innymi użytkownikami. Serwis nie ponosi odpowiedzialności za rzeczywiste rezerwacje, które są dokonywane u zewnętrznych dostawców.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Odpowiedzialność Użytkownika</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Użytkownik zobowiązany jest do podawania prawdziwych danych.</li>
                            <li>Zabrania się publikowania treści obraźliwych lub niezgodnych z prawem.</li>
                            <li>Użytkownik ponosi pełną odpowiedzialność za zabezpieczenie swojego konta.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Postanowienia Końcowe</h2>
                        <p>
                            Właściciel serwisu zastrzega sobie prawo do zmiany regulaminu w dowolnym momencie. Dalsze korzystanie z serwisu oznacza akceptację zmian.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
