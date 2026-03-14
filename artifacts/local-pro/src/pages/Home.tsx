import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { 
  Search, AlertTriangle, Wrench, Zap, BookOpen, 
  PaintRoller, Hammer, Droplet, ArrowRight, Star
} from "lucide-react";
import { useGetWorkers } from "@workspace/api-client-react";
import { WorkerCard } from "@/components/WorkerCard";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "electrician", name: "Electrician", icon: Zap, color: "bg-amber-100 text-amber-600" },
  { id: "plumber", name: "Plumber", icon: Droplet, color: "bg-blue-100 text-blue-600" },
  { id: "mechanic", name: "Mechanic", icon: Wrench, color: "bg-slate-100 text-slate-600" },
  { id: "tutor", name: "Tutor", icon: BookOpen, color: "bg-emerald-100 text-emerald-600" },
  { id: "painter", name: "Painter", icon: PaintRoller, color: "bg-purple-100 text-purple-600" },
  { id: "carpenter", name: "Carpenter", icon: Hammer, color: "bg-orange-100 text-orange-600" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const { data: topWorkers, isLoading } = useGetWorkers({ lat: 17.3850, lng: 78.4867 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Layout>
      {/* Emergency Banner */}
      <div className="bg-destructive text-white py-3 px-4 relative overflow-hidden">
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10 text-center sm:text-left">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            Need urgent help right now?
          </div>
          <Link 
            href="/emergency" 
            className="bg-white text-destructive px-4 py-1.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform"
          >
            Find Emergency Services
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-secondary/50 to-transparent -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-foreground leading-[1.1] mb-6 text-balance">
              Find trusted local <span className="text-primary relative whitespace-nowrap">
                professionals
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span> in minutes.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              From quick plumbing fixes to long-term tutoring. Connect with verified skilled workers in your neighborhood instantly.
            </p>

            <form onSubmit={handleSearch} className="relative max-w-xl">
              <div className="glass p-2 rounded-full flex items-center shadow-xl shadow-primary/10 border-border/80">
                <div className="pl-4 text-muted-foreground">
                  <Search className="w-5 h-5" />
                </div>
                <input 
                  type="text"
                  placeholder="What service do you need? (e.g., Electrician)"
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 px-4 py-3 text-foreground placeholder:text-muted-foreground/70"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-8 flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}`} alt="user" className="w-8 h-8 rounded-full border-2 border-white bg-secondary" />
                ))}
              </div>
              <p>Trusted by <span className="text-foreground font-bold">10,000+</span> locals</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[3rem] rotate-3 blur-2xl" />
            <img 
              src={`${import.meta.env.BASE_URL}images/hero-community.png`}
              alt="Community Services" 
              className="relative w-full h-[500px] object-cover rounded-[3rem] shadow-2xl border border-white/50"
            />
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="bg-success/20 text-success p-3 rounded-full">
                <Star className="w-6 h-6 fill-current" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Top Rated</p>
                <p className="text-xs text-muted-foreground">4.9/5 Average</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">Browse Services</h2>
              <p className="text-muted-foreground">Find exactly what you're looking for</p>
            </div>
            <Link href="/search" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={`/search?category=${cat.id}`}
                    className="flex flex-col items-center justify-center gap-4 p-6 rounded-3xl bg-secondary/30 hover:bg-white hover:shadow-xl hover:shadow-black/5 border border-transparent hover:border-border/50 transition-all duration-300 group text-center h-full"
                  >
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:-translate-y-2", cat.color)}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">{cat.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Workers */}
      <section className="py-20 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">Top Rated Near You</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Discover the most highly recommended professionals in your neighborhood.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-5 h-64 animate-pulse border border-border" />
              ))}
            </div>
          ) : topWorkers && topWorkers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topWorkers.slice(0, 6).map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass rounded-3xl">
              <p className="text-muted-foreground">No workers found nearby. Try expanding your search area.</p>
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link 
              href="/search" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-primary/20 text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300"
            >
              Explore All Professionals
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
