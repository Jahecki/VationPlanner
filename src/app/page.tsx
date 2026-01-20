"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Plane, Map, Compass, ArrowRight, Star, LogIn, LogOut, Info } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ThemeToggle } from "./components/ThemeToggle";
import { LanguageToggle } from "./components/LanguageToggle";
import { useLanguage } from "./lib/context/LanguageContext";

export default function HomePage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 200]);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      {/* --- WSPÓLNE TŁO --- */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Animowane bloby w tle */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-3xl rotate-45 mix-blend-screen filter blur-3xl opacity-20 dark:opacity-20 animate-float-slow"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-gradient-to-bl from-indigo-600 to-purple-600 rounded-3xl rotate-45 mix-blend-screen filter blur-3xl opacity-20 dark:opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/4 w-64 h-64 bg-gradient-to-tr from-blue-800 to-indigo-500 rounded-3xl rotate-45 mix-blend-screen filter blur-2xl opacity-20 dark:opacity-20 animate-float-fast"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 dark:opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>

      {/* --- NAVBAR --- */}
      <header className="fixed top-0 w-full z-50 transition-all duration-300">
        <div className="mx-auto px-6 py-4 flex justify-between items-center backdrop-blur-md bg-white/5 dark:bg-black/20 border-b border-border shadow-sm">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-wide ml-2 group-hover:text-primary transition-colors">
              Vacation<span className="text-primary">Planner</span>
            </h1>
          </Link>

          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/community" className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Compass className="w-4 h-4" />
              {t("nav.explore")}
            </Link>
            <Link href="/about" className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Info className="w-4 h-4" />
              {t("nav.about")}
            </Link>

            {/* Toggles */}
            <ThemeToggle />
            <LanguageToggle />

            {!session ? (
              <>
                <Link
                  href="/auth"
                  className="px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full border border-primary/10 transition-all hover:scale-105 backdrop-blur-sm"
                >
                  {t("nav.join")}
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <Map className="w-4 h-4" />
                  {t("nav.dashboard")}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs uppercase tracking-wider transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t("nav.logout")}
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* --- GŁÓWNA TREŚĆ HERO --- */}
      <section ref={targetRef} className="relative h-screen flex flex-col items-center justify-center text-center px-4 z-10 pt-20">
        <motion.div
          style={{ opacity, scale, y }}
          className="flex flex-col items-center max-w-5xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 px-5 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wide uppercase backdrop-blur-md flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            <Star className="w-4 h-4 fill-current text-primary" />
            {t("hero.badge")}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-foreground via-primary to-indigo-300 drop-shadow-sm leading-tight py-4"
          >
            {/* Note: This might need more complex splitting if we want line breaks exactly as before, but simple text is fine for now */}
            {t("hero.title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg md:text-2xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
          >
            {!session ? (
              <Link
                href="/auth"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full font-bold text-lg shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300"
              >
                {t("nav.join")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full font-bold text-lg shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300"
              >
                {t("hero.dashboard")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}

            <Link
              href="/community"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-secondary/80 hover:bg-secondary text-foreground border border-input rounded-full font-bold text-lg backdrop-blur-sm transition-all duration-300"
            >
              <Compass className="w-5 h-5" />
              {t("hero.explore")}
            </Link>
          </motion.div>
        </motion.div>

        {/* Wskaźnik scrollowania */}
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-foreground/20 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-foreground rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* --- JAK TO DZIAŁA (SCROLL SECTION) --- */}
      <section className="w-full relative z-10 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-32 text-center text-foreground"
          >
            {t("how.title")}
          </motion.h3>

          <div className="space-y-48">
            {/* KROK 1 */}
            <Step
              number="1"
              title={t("how.step1.title")}
              description={t("how.step1.desc")}
              image="/step1.png"
              imageAlt="Planowanie"
              color="blue"
              align="left"
            />

            {/* KROK 2 */}
            <Step
              number="2"
              title={t("how.step2.title")}
              description={t("how.step2.desc")}
              image="/step2.png"
              imageAlt="Odkrywanie"
              color="purple"
              align="right"
            />

            {/* KROK 3 */}
            <Step
              number="3"
              title={t("how.step3.title")}
              description={t("how.step3.desc")}
              image="/step3.png"
              imageAlt="Udostępnianie"
              color="green"
              align="left"
            />
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="relative z-10 py-32 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto bg-gradient-to-r from-violet-900/90 to-indigo-900/90 dark:from-blue-900/40 dark:to-indigo-900/40 border border-border rounded-3xl p-12 md:p-20 text-center backdrop-blur-md overflow-hidden relative shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">{t("cta.title")}</h2>
            <p className="text-xl text-blue-100/60 mb-10 max-w-2xl mx-auto">{t("cta.subtitle")}</p>
            <Link
              href="/auth"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-blue-900 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-xl"
            >
              {t("cta.button")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 py-12 border-t border-border bg-background/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-muted-foreground text-sm">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} VacationPlanner. {t("footer.rights")}
          </div>
          <div className="flex gap-8">
            <Link href="/about" className="hover:text-foreground transition-colors">{t("nav.about")}</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">{t("footer.privacy")}</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">{t("footer.terms")}</Link>
            <a href="mailto:kontakt@vacationplanner.com" className="hover:text-foreground transition-colors">{t("footer.contact")}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Komponent Pomocniczy dla Kroków ---
function Step({ number, title, description, image, imageAlt, color, align }: { number: string, title: string, description: string, image: string, imageAlt: string, color: string, align: "left" | "right" }) {
  const isLeft = align === "left";

  // Uproszczone kolory dla light/dark mode - używamy opacity i border
  return (
    <div className={`flex flex-col ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12 md:gap-24`}>
      {/* Tekst */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className={`flex-1 text-left ${!isLeft && "md:text-right"} space-y-6`}
      >
        <div className={`w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary font-bold text-2xl border border-border ${!isLeft && "ml-auto"}`}>
          {number}
        </div>
        <h4 className="text-3xl md:text-5xl font-bold text-foreground">{title}</h4>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {description}
        </p>
      </motion.div>

      {/* Obrazek */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: isLeft ? -5 : 5 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="flex-1 relative group w-full"
      >
        <div className={`absolute inset-0 bg-primary/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700`}></div>
        <img
          src={image}
          alt={imageAlt}
          className="relative rounded-3xl border border-border shadow-2xl w-full transform transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2 dark:shadow-none"
        />
      </motion.div>
    </div>
  );
}
