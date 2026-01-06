"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors border border-border text-foreground"
            aria-label="Toggle Theme"
        >
            <Moon className="w-5 h-5 hidden dark:block" />
            <Sun className="w-5 h-5 block dark:hidden text-orange-500" />
        </button>
    );
}
