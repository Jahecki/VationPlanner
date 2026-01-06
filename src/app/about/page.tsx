"use client";

import Link from "next/link";
import { ArrowLeft, Globe, Heart, Shield, Users } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0a0e1a] text-white font-sans relative overflow-hidden">
            {/* Tło */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none fixed"></div>

            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                <Link href="/" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Wróć na stronę główną
                </Link>

                <header className="text-center mb-20 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                        O Nas
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Tworzymy przyszłość planowania podróży. Łączymy technologię z pasją do odkrywania świata.
                    </p>
                </header>

                <section className="grid md:grid-cols-2 gap-12 mb-24">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-white mb-6">Nasza Misja</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Wierzymy, że podróżowanie to coś więcej niż tylko przemieszczanie się z punktu A do punktu B. To wspomnienia, emocje i odkrywanie siebie.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            Naszym celem jest usunięcie stresu z procesu planowania, abyś mógł skupić się na tym, co najważniejsze - czerpaniu radości z przygody.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <Globe className="w-8 h-8 text-blue-400 mb-4" />
                            <h3 className="font-bold text-lg mb-2">Globalny Zasięg</h3>
                            <p className="text-sm text-gray-400">Dostęp do tysięcy destynacji na całym świecie.</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <Heart className="w-8 h-8 text-pink-400 mb-4" />
                            <h3 className="font-bold text-lg mb-2">Z Pasji</h3>
                            <p className="text-sm text-gray-400">Stworzone przez podróżników dla podróżników.</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <Shield className="w-8 h-8 text-green-400 mb-4" />
                            <h3 className="font-bold text-lg mb-2">Bezpieczeństwo</h3>
                            <p className="text-sm text-gray-400">Twoje dane i plany są u nas bezpieczne.</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <Users className="w-8 h-8 text-purple-400 mb-4" />
                            <h3 className="font-bold text-lg mb-2">Społeczność</h3>
                            <p className="text-sm text-gray-400">Dziel się planami i inspiruj innych.</p>
                        </div>
                    </div>
                </section>

                <section className="text-center bg-white/5 rounded-3xl p-12 border border-white/10">
                    <h2 className="text-3xl font-bold mb-6">Masz pytania?</h2>
                    <p className="text-gray-400 mb-8">Nasz zespół chętnie pomoże Ci w każdej kwestii.</p>
                    <a href="mailto:kontakt@vacationplanner.com" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-bold transition-all hover:scale-105 shadow-lg shadow-blue-500/25">
                        <Users className="w-5 h-5" />
                        Skontaktuj się z nami
                    </a>
                </section>
            </div>
        </div>
    );
}
