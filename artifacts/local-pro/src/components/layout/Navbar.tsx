import { Link, useLocation } from "wouter";
import { Search, MapPin, UserCircle, Briefcase, Menu, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/search", label: "Find Services", icon: Search },
    { href: "/register", label: "Join as Worker", icon: Briefcase },
    { href: "/dashboard?workerId=1", label: "My Dashboard", icon: UserCircle },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          isScrolled ? "glass py-3 border-border/50" : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-foreground">
              Local<span className="text-primary">Pro</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-semibold transition-colors hover:text-primary",
                  location === link.href || (link.href.includes('?') && location === link.href.split('?')[0])
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/emergency"
              className="px-5 py-2.5 rounded-full bg-destructive/10 text-destructive font-bold text-sm flex items-center gap-2 hover:bg-destructive hover:text-white transition-colors duration-300"
            >
              <AlertTriangle className="w-4 h-4" />
              Emergency
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md pt-24 px-4 pb-6 flex flex-col md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm border border-border/50 text-foreground font-semibold"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/emergency"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-destructive text-white font-bold shadow-lg shadow-destructive/20 mt-4"
              >
                <AlertTriangle className="w-6 h-6" />
                Emergency Services
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
