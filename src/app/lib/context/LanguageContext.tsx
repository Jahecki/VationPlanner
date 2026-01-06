"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "pl" | "en";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const dictionaries: Record<Language, Record<string, string>> = {
    pl: {
        // Navbar
        "nav.explore": "Odkrywaj",
        "nav.about": "O nas",
        "nav.login": "Logowanie",
        "nav.join": "Dołącz do nas",
        "nav.dashboard": "Panel",
        "nav.logout": "Wyloguj",

        // Hero
        "hero.badge": "Inteligentne planowanie podróży",
        "hero.title": "Odkryj świat na swoich zasadach.",
        "hero.subtitle": "Stwórz idealny plan podróży w kilka minut. Organizuj loty, hotele i atrakcje w jednym, pięknym miejscu. Dołącz do społeczności podróżników.",
        "hero.start": "Zacznij za darmo",
        "hero.dashboard": "Przejdź do Panelu",
        "hero.explore": "Odkrywaj Plany",

        // How it works
        "how.title": "Jak to działa?",
        "how.step1.title": "Planuj bez wysiłku",
        "how.step1.desc": "Wybierz cel, daty i dodaj punkty podróży. Nasz inteligentny planer pomoże Ci zorganizować czas i budżet, abyś mógł skupić się na tym, co najważniejsze - przygodzie.",
        "how.step2.title": "Odkrywaj nowe miejsca",
        "how.step2.desc": "Przeglądaj tysiące planów stworzonych przez innych podróżników. Inspiruj się, kopiuj gotowe trasy i dostosowuj je do swoich potrzeb jednym kliknięciem.",
        "how.step3.title": "Dziel się wrażeniami",
        "how.step3.desc": "Udostępniaj swoje plany, zbieraj oceny i pomagaj innym w odkrywaniu świata. Zostań częścią społeczności, która kocha podróże tak samo jak Ty.",

        // CTA
        "cta.title": "Gotowy na podróż życia?",
        "cta.subtitle": "Dołącz do tysięcy użytkowników, którzy planują swoje idealne wakacje z VacationPlanner.",
        "cta.button": "Rozpocznij teraz",

        // Dashboard
        "dash.welcome": "Cześć",
        "dash.traveler": "Podróżniku",
        "dash.subtitle": "Gdzie poniesie Cię dzisiaj wyobraźnia?",
        "dash.main": "Panel główny",
        "dash.stats.planned": "Zaplanowane podróże",
        "dash.stats.favorite": "Ulubiony kierunek",
        "dash.stats.upcoming": "Nadchodząca podróż",
        "dash.stats.noplans": "Brak planów",
        "dash.quickActions": "Szybkie akcje",
        "dash.createTrip": "Stwórz nową podróż",
        "dash.createTripDesc": "Kliknij, aby dodać cel, daty i liczbę osób.",
        "dash.explore": "Odkrywaj",
        "dash.exploreDesc": "Zobacz polecane plany podróży innych użytkowników.",
        "dash.myTrips": "Moje podróże",
        "dash.loading": "Wczytywanie...",
        "dash.noTrips": "Brak podróży. Dodaj pierwszą!",
        "dash.noDate": "Brak daty",

        // Modal
        "modal.newAdventure": "Nowa przygoda",
        "modal.desc": "Wypełnij podstawowe dane. Hotele dodasz później.",
        "modal.destination": "Kierunek",
        "modal.placeholder": "np. Tokio, Japonia",
        "modal.from": "Od",
        "modal.to": "Do",
        "modal.people": "Ilość osób",
        "modal.creating": "Tworzenie...",
        "modal.create": "Stwórz plan",
        "modal.error": "Wystąpił błąd podczas tworzenia wycieczki.",

        // Community
        "community.title": "Społeczność Podróżników",
        "community.subtitle": "Inspiruj się planami innych i ruszaj w świat!",
        "community.search": "Szukaj lokalizacji...",
        "community.back": "Wróć do panelu",
        "community.empty": "Pusto tutaj...",
        "community.emptyDesc": "Bądź pierwszy i udostępnij swoją podróż!",
        "community.saving": "Zapisywanie...",
        "community.save": "Zapisz plan",
        "community.hotels": "Hotele",
        "community.filter.all": "Wszystkie oceny",
        "community.filter.3plus": "3+ Gwiazdki",
        "community.filter.4plus": "4+ Gwiazdki",
        "community.filter.5only": "Tylko 5 Gwiazdek",
        "community.confirm.login": "Musisz być zalogowany, aby zapisać podróż. Przejść do logowania?",
        "community.confirm.save": "Czy na pewno chcesz zapisać tę podróż w swoich planach?",
        "community.confirm.success": "Podróż zapisana! Czy chcesz ją teraz otworzyć?",
        "community.error.save": "Błąd zapisu podróży",

        // Auth Redirect
        "auth.signin": "Zaloguj się",

        // Footer
        "footer.rights": "Wszelkie prawa zastrzeżone.",
        "footer.privacy": "Prywatność",
        "footer.terms": "Regulamin",
        "footer.contact": "Kontakt",
    },
    en: {
        // Navbar
        "nav.explore": "Explore",
        "nav.about": "About Us",
        "nav.login": "Log In",
        "nav.join": "Join Us",
        "nav.dashboard": "Dashboard",
        "nav.logout": "Log Out",

        // Dashboard
        "dash.welcome": "Hello",
        "dash.traveler": "Traveler",
        "dash.subtitle": "Where will your imagination take you today?",
        "dash.main": "Main Dashboard",
        "dash.stats.planned": "Planned Trips",
        "dash.stats.favorite": "Favorite Destination",
        "dash.stats.upcoming": "Upcoming Trip",
        "dash.stats.noplans": "No plans",
        "dash.quickActions": "Quick Actions",
        "dash.createTrip": "Create New Trip",
        "dash.createTripDesc": "Click to add destination, dates, and people count.",
        "dash.explore": "Explore",
        "dash.exploreDesc": "See recommended plans from other users.",
        "dash.myTrips": "My Trips",
        "dash.loading": "Loading...",
        "dash.noTrips": "No trips. Add your first one!",
        "dash.noDate": "No date",

        // Modal
        "modal.newAdventure": "New Adventure",
        "modal.desc": "Fill in basic details. Hotels can be added later.",
        "modal.destination": "Destination",
        "modal.placeholder": "e.g. Tokyo, Japan",
        "modal.from": "From",
        "modal.to": "To",
        "modal.people": "People count",
        "modal.creating": "Creating...",
        "modal.create": "Create Plan",
        "modal.error": "An error occurred while creating the trip.",

        // Community
        "community.title": "Traveler Community",
        "community.subtitle": "Get inspired by others' plans and explore the world!",
        "community.search": "Search location...",
        "community.back": "Back to Dashboard",
        "community.empty": "It's empty here...",
        "community.emptyDesc": "Be the first to share your trip!",
        "community.saving": "Saving...",
        "community.save": "Save Plan",
        "community.hotels": "Hotels",
        "community.filter.all": "All Ratings",
        "community.filter.3plus": "3+ Stars",
        "community.filter.4plus": "4+ Stars",
        "community.filter.5only": "Only 5 Stars",
        "community.confirm.login": "You must be logged in to save a trip. Go to login?",
        "community.confirm.save": "Are you sure you want to save this trip to your plans?",
        "community.confirm.success": "Trip saved! Do you want to open it now?",
        "community.error.save": "Error saving trip",

        // Auth Redirect
        "auth.signin": "Sign In",

        // Hero
        "hero.badge": "Smart Travel Planning",
        "hero.title": "Discover the world on your terms.",
        "hero.subtitle": "Create the perfect travel plan in minutes. Organize flights, hotels, and attractions in one beautiful place. Join the traveler community.",
        "hero.start": "Start for Free",
        "hero.dashboard": "Go to Dashboard",
        "hero.explore": "Explore Plans",

        // How it works
        "how.title": "How it works?",
        "how.step1.title": "Plan effortlessly",
        "how.step1.desc": "Choose your destination, dates, and add travel points. Our smart planner helps you organize time and budget so you can focus on what matters most - the adventure.",
        "how.step2.title": "Discover new places",
        "how.step2.desc": "Browse thousands of plans created by other travelers. Get inspired, copy ready-made routes, and customize them to your needs with one click.",
        "how.step3.title": "Share your experiences",
        "how.step3.desc": "Share your plans, collect ratings, and help others discover the world. Become part of a community that loves travel as much as you do.",

        // CTA
        "cta.title": "Ready for the trip of a lifetime?",
        "cta.subtitle": "Join thousands of users planning their perfect vacations with VacationPlanner.",
        "cta.button": "Start Now",

        // Footer
        "footer.rights": "All rights reserved.",
        "footer.privacy": "Privacy",
        "footer.terms": "Terms",
        "footer.contact": "Contact",
    }
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Language>("pl");

    // Load language from localStorage
    useEffect(() => {
        const savedLang = localStorage.getItem("language") as Language;
        if (savedLang) setLanguage(savedLang);
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    const t = (key: string) => {
        return dictionaries[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
