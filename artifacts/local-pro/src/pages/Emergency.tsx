import { useState } from "react";
import { Link, useLocation } from "wouter";
import { AlertTriangle, MapPin, Search, ArrowLeft } from "lucide-react";

export default function Emergency() {
  const [address, setAddress] = useState("");
  const [, setLocation] = useLocation();

  const handleFind = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      // Route to search with emergency flag on
      setLocation(`/search?q=emergency&emergency=true`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0">
        <img 
          src={`${import.meta.env.BASE_URL}images/emergency-bg.png`} 
          className="w-full h-full object-cover opacity-50" 
          alt="Emergency Background" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      <header className="relative z-10 p-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
      </header>

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 text-center max-w-3xl mx-auto w-full">
        <div className="w-24 h-24 bg-red-500/20 border-2 border-red-500 rounded-full flex items-center justify-center mb-8 animate-pulse shadow-[0_0_50px_rgba(239,68,68,0.5)]">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-display font-bold mb-4 tracking-tight">
          Emergency Services
        </h1>
        <p className="text-xl text-white/70 mb-10 max-w-xl">
          Get immediate help for critical plumbing, electrical, or structural issues. Pros arrive in under 45 mins.
        </p>

        <form onSubmit={handleFind} className="w-full max-w-xl relative">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-2xl flex flex-col sm:flex-row gap-2 shadow-2xl">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Enter your exact location..."
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-white/40 px-12 py-4 outline-none font-medium"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Find Now
            </button>
          </div>
        </form>

        <div className="mt-16 grid grid-cols-3 gap-6 w-full max-w-lg border-t border-white/10 pt-8">
          <div className="text-center">
            <p className="text-3xl font-display font-bold text-red-500 mb-1">24/7</p>
            <p className="text-xs text-white/50 uppercase tracking-wider">Availability</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-display font-bold text-red-500 mb-1">&lt;45m</p>
            <p className="text-xs text-white/50 uppercase tracking-wider">Avg Arrival</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-display font-bold text-red-500 mb-1">100%</p>
            <p className="text-xs text-white/50 uppercase tracking-wider">Verified Pros</p>
          </div>
        </div>
      </main>
    </div>
  );
}
