"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Dodajemy Link, żeby wrócić na główną

// Typ wariantów formularza
type Variant = "LOGIN" | "REGISTER";

export default function AuthPage() {
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // Dodajemy stan błędu

  // Stan formularza (wspólny dla obu)
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const toggleVariant = () => {
    setVariant((current) => (current === "LOGIN" ? "REGISTER" : "LOGIN"));
    setError(""); // Reset błędu przy zmianie zakładki
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (variant === "REGISTER") {
        // --- LOGIKA REJESTRACJI ---
        // (Tutaj jest twoja tymczasowa logika z fake API)
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          alert("Konto założone! Przełączam na logowanie.");
          setVariant("LOGIN");
          setData({ ...data, password: "" }); // Wyczyść hasło
        } else {
          const err = await res.json();
          setError(err.message || "Błąd rejestracji");
        }
      } else {
        // --- LOGIKA LOGOWANIA ---
        const callback = await signIn("credentials", {
          ...data,
          redirect: false,
        });

        if (callback?.error) {
          setError("Błędny email lub hasło.");
        } else if (callback?.ok) {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      setError("Coś poszło nie tak.");
    } finally {
      setIsLoading(false);
    }
  };

  // Kolory akcentów zależne od trybu
  const accentColor = variant === "LOGIN" ? "blue" : "cyan";
  const gradientFrom = variant === "LOGIN" ? "from-blue-600" : "from-cyan-600";
  const gradientTo = variant === "LOGIN" ? "to-indigo-600" : "to-blue-600";

  return (
    // GŁÓWNY KONTENER - CIEMNE TŁO
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden bg-[#0a0e1a] font-sans">
      {/* Link powrotu na górze */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2 transition-colors z-20"
      >
        ← Wróć na stronę główną
      </Link>

      {/* --- TŁO (Lewitujące romby - te same co na Home) --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-600 rounded-3xl rotate-45 mix-blend-screen filter blur-3xl opacity-20 animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-600 rounded-3xl rotate-45 mix-blend-screen filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
        {/* Siatka */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      </div>

      {/* --- GŁÓWNA KARTA (Glassmorphism - Ciemne szkło) --- */}
      <div className="w-full max-w-[450px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        {/* Przełącznik zakładek na górze */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setVariant("LOGIN")}
            className={`w-1/2 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              variant === "LOGIN"
                ? "bg-white/10 text-blue-400 border-b-2 border-blue-400 shadow-[inset_0_-2px_10px_rgba(59,130,246,0.2)]"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
            }`}
          >
            Logowanie
          </button>
          <button
            onClick={() => setVariant("REGISTER")}
            className={`w-1/2 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              variant === "REGISTER"
                ? "bg-white/10 text-cyan-400 border-b-2 border-cyan-400 shadow-[inset_0_-2px_10px_rgba(6,182,212,0.2)]"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
            }`}
          >
            Rejestracja
          </button>
        </div>

        <div className="p-8 pt-10">
          {/* Nagłówek */}
          <div className="text-center mb-8">
            <h2
              className={`text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${gradientFrom} ${gradientTo} mb-3`}
            >
              {variant === "LOGIN" ? "Witaj ponownie!" : "Dołącz do nas"}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {variant === "LOGIN"
                ? "Zaloguj się, aby kontynuować planowanie swojej wymarzonej podróży."
                : "Stwórz konto w kilka sekund i zacznij organizować wyjazdy."}
            </p>
          </div>

          {/* Wyświetlanie błędów */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Pole Imię (tylko dla Rejestracji) - z animacją wejścia */}
            {variant === "REGISTER" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                  Imię
                </label>
                <input
                  type="text"
                  required
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  // STYL INPUTA - Ciemny i przezroczysty
                  className={`w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:ring-2 focus:border-transparent outline-none transition-all duration-300 ${
                    variant === "REGISTER" ? "focus:ring-cyan-500/50" : ""
                  }`}
                  placeholder="Jak masz na imię?"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                Email
              </label>
              <input
                type="email"
                required
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className={`w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:ring-2 focus:border-transparent outline-none transition-all duration-300 ${
                  variant === "LOGIN"
                    ? "focus:ring-blue-500/50"
                    : "focus:ring-cyan-500/50"
                }`}
                placeholder="twoj@email.com"
              />
            </div>

            {/* Hasło */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                Hasło
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className={`w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:ring-2 focus:border-transparent outline-none transition-all duration-300 ${
                  variant === "LOGIN"
                    ? "focus:ring-blue-500/50"
                    : "focus:ring-cyan-500/50"
                }`}
                placeholder="••••••••"
              />
              {variant === "REGISTER" && (
                <p className="text-xs text-gray-500 mt-1 ml-1">
                  Minimum 6 znaków
                </p>
              )}
            </div>

            {/* Przycisk Submit - Gradientowy */}
            <button
              disabled={isLoading}
              type="submit"
              className={`w-full py-4 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-4 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white shadow-${accentColor}-500/25`}
            >
              {isLoading
                ? variant === "LOGIN"
                  ? "Logowanie..."
                  : "Rejestracja..."
                : variant === "LOGIN"
                ? "Zaloguj się"
                : "Załóż konto"}
            </button>
          </form>

          {/* Przełącznik tekstowy na dole */}
          <div className="mt-8 text-center text-sm text-gray-400">
            {variant === "LOGIN"
              ? "Nie masz jeszcze konta?"
              : "Masz już konto?"}{" "}
            <button
              onClick={toggleVariant}
              className={`font-bold hover:underline transition-colors ${
                variant === "LOGIN"
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-cyan-400 hover:text-cyan-300"
              }`}
            >
              {variant === "LOGIN" ? "Zarejestruj się teraz" : "Zaloguj się"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
