import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { useGetWorkers, useGetCategories } from "@workspace/api-client-react";
import { WorkerCard } from "@/components/WorkerCard";
import { Search as SearchIcon, Filter, MapPin, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Search() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [isEmergency, setIsEmergency] = useState(false);

  // Re-sync state if URL changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") || "");
    setCategory(params.get("category") || "");
  }, [location]);

  const { data: categories } = useGetCategories();
  
  // Using fixed coordinates for mock matching nearby
  const { data: workers, isLoading } = useGetWorkers({
    search: query || undefined,
    category: category || undefined,
    emergency: isEmergency ? true : undefined,
    lat: 17.3850,
    lng: 78.4867
  });

  return (
    <Layout>
      <div className="bg-white border-b border-border sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by skill or name..."
                className="w-full bg-secondary/50 border border-transparent focus:border-primary/50 focus:bg-white focus:outline-none rounded-xl py-3 pl-12 pr-4 text-foreground transition-colors"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
              <select
                className="bg-secondary/50 border border-transparent focus:border-primary/50 rounded-xl py-3 px-4 text-foreground font-medium appearance-none min-w-[160px] cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories?.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <button
                onClick={() => setIsEmergency(!isEmergency)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
                  isEmergency 
                    ? "bg-destructive text-white shadow-lg shadow-destructive/20" 
                    : "bg-secondary/50 text-foreground hover:bg-secondary"
                }`}
              >
                <Zap className="w-4 h-4" />
                Emergency Only
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            {workers?.length || 0} professionals found
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white px-4 py-2 rounded-full border border-border">
            <MapPin className="w-4 h-4" />
            Showing results near <strong className="text-foreground">Current Location</strong>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-5 h-72 animate-pulse border border-border" />
            ))}
          </div>
        ) : workers && workers.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {workers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border border-border border-dashed">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No professionals found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              We couldn't find anyone matching your exact criteria right now.
            </p>
            <button 
              onClick={() => { setQuery(""); setCategory(""); setIsEmergency(false); }}
              className="text-primary font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
