"use client";

import { useLanguage } from "../lib/context/LanguageContext";

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-1 bg-secondary p-1 rounded-lg border border-border">
            <button
                onClick={() => setLanguage("pl")}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${language === "pl"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
            >
                PL
            </button>
            <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${language === "en"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
            >
                EN
            </button>
        </div>
    );
}
