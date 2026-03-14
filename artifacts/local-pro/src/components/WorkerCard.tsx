import { Link } from "wouter";
import { Star, MapPin, ShieldCheck, Zap } from "lucide-react";
import { formatCurrency, formatDistance } from "@/lib/utils";
import type { WorkerSummary } from "@workspace/api-client-react";

export function WorkerCard({ worker }: { worker: WorkerSummary }) {
  return (
    <Link
      href={`/worker/${worker.id}`}
      className="group bg-card rounded-3xl p-5 border border-border/60 shadow-md shadow-black/5 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 flex flex-col block"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={worker.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${worker.name}&backgroundColor=fce6d5`}
              alt={worker.name}
              className="w-16 h-16 rounded-2xl object-cover bg-secondary"
            />
            {worker.isOnline && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-card rounded-full" title="Online now" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              {worker.name}
              <ShieldCheck className="w-4 h-4 text-accent" />
            </h3>
            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground mt-1">
              {worker.category}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-amber-500 font-bold">
            <Star className="w-4 h-4 fill-current" />
            <span>{worker.rating.toFixed(1)}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            ({worker.reviewCount} reviews)
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
        {worker.bio}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {worker.serviceArea} • {formatDistance(worker.distance)}
          </span>
          <span className="font-bold text-foreground">
            {formatCurrency(worker.pricePerHour)}<span className="text-muted-foreground text-xs font-normal">/hr</span>
          </span>
        </div>
        
        {worker.isAvailableEmergency ? (
          <div className="flex items-center gap-1 text-xs font-bold text-destructive bg-destructive/10 px-3 py-1.5 rounded-full">
            <Zap className="w-3 h-3 fill-current" />
            Fast
          </div>
        ) : (
          <div className="text-xs font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
            View Profile
          </div>
        )}
      </div>
    </Link>
  );
}
