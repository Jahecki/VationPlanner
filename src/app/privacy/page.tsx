"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
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
                        <Shield className="w-10 h-10 text-green-500" />
                        Polityka Prywatności
                    </h1>
                    <p className="text-gray-400">Dbamy o Twoje dane.</p>
                </header>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Jakie dane zbieramy?</h2>
                        <p>
                            Zbieramy jedynie niezbędne dane do funkcjonowania serwisu: adres email, nazwę użytkownika oraz hasło (w formie zaszyfrowanej).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Wykorzystanie danych</h2>
                        <p>
                            Twoje dane są wykorzystywane wyłącznie do:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Umożliwienia logowania i dostępu do Twoich planów.</li>
                            <li>Personalizacji doświadczeń w serwisie.</li>
                            <li>Komunikacji technicznej (np. reset hasła).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Pliki Cookies</h2>
                        <p>
                            Serwis wykorzystuje pliki cookies w celu utrzymania sesji użytkownika. Możesz je wyłączyć w ustawieniach przeglądarki, co może jednak wpłynąć na funkcjonalność strony.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Kontakt</h2>
                        <p>
                            W sprawach dotyczących danych osobowych prosimy o kontakt pod adresem: <a href="mailto:privacy@vacationplanner.com" className="text-blue-400 hover:underline">privacy@vacationplanner.com</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
