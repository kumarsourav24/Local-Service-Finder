import { useParams, Link } from "wouter";
import { useGetWorker, useGetReviews } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { formatCurrency, formatDistance } from "@/lib/utils";
import { Star, MapPin, CheckCircle, ShieldCheck, MessageCircle, Phone, Clock, Zap } from "lucide-react";
import { format } from "date-fns";

export default function WorkerProfile() {
  const params = useParams();
  const workerId = Number(params.id);

  const { data: worker, isLoading: isLoadingWorker } = useGetWorker(workerId);
  const { data: reviews, isLoading: isLoadingReviews } = useGetReviews({ workerId });

  if (isLoadingWorker) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-8 animate-pulse">
          <div className="h-64 bg-secondary rounded-3xl mb-8"></div>
          <div className="h-8 bg-secondary rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-secondary rounded-xl mb-8"></div>
        </div>
      </Layout>
    );
  }

  if (!worker) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Worker Not Found</h2>
          <Link href="/search" className="text-primary hover:underline">Back to search</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative shrink-0">
              <img
                src={worker.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${worker.name}&backgroundColor=fce6d5`}
                alt={worker.name}
                className="w-32 h-32 md:w-48 md:h-48 rounded-3xl object-cover shadow-xl"
              />
              {worker.isOnline && (
                <div className="absolute -bottom-2 -right-2 bg-success text-white text-xs font-bold px-3 py-1 rounded-full border-4 border-white shadow-sm flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> Online
                </div>
              )}
            </div>

            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground flex items-center gap-2">
                    {worker.name}
                    <ShieldCheck className="w-6 h-6 text-accent" />
                  </h1>
                  <p className="text-lg text-muted-foreground mt-1 flex items-center gap-2">
                    {worker.category} • {worker.experience} years experience
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="p-3 rounded-full bg-secondary/50 text-foreground hover:bg-secondary transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button className="p-3 rounded-full bg-secondary/50 text-foreground hover:bg-secondary transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <Link
                    href={`/book/${worker.id}`}
                    className="px-6 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    Book Now
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-base">{worker.rating.toFixed(1)}</span>
                  <span>({worker.reviewCount} reviews)</span>
                </div>
                
                <div className="flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-slate-400" />
                  {worker.completedJobs} Jobs Completed
                </div>

                <div className="flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {worker.serviceArea} ({formatDistance(worker.distance)})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-4">About Me</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {worker.bio}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {worker.skills?.map((skill, idx) => (
                <span key={idx} className="px-4 py-2 bg-secondary/50 border border-border/50 rounded-xl text-sm font-semibold text-foreground">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              Reviews <span className="text-muted-foreground text-lg font-normal">({worker.reviewCount})</span>
            </h2>
            
            {isLoadingReviews ? (
              <div className="animate-pulse space-y-4">
                {[1,2].map(i => <div key={i} className="h-24 bg-white border border-border rounded-2xl" />)}
              </div>
            ) : reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-2xl border border-border/60 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{review.userName}</p>
                          <p className="text-xs text-muted-foreground">{format(new Date(review.createdAt), 'MMM d, yyyy')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-border"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No reviews yet.</p>
            )}
          </section>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-border shadow-lg shadow-black/5 sticky top-[100px]">
            <div className="mb-6 pb-6 border-b border-border">
              <p className="text-muted-foreground text-sm font-medium mb-1">Service Rate</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-display font-bold text-foreground">{formatCurrency(worker.pricePerHour)}</span>
                <span className="text-muted-foreground">/ hour</span>
              </div>
            </div>

            {worker.isAvailableEmergency && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <Zap className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-destructive text-sm mb-1">Emergency Available</p>
                  <p className="text-xs text-destructive/80 leading-snug">Can arrive within 30-45 minutes for urgent tasks. Extra charges may apply.</p>
                </div>
              </div>
            )}

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-foreground">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Usually responds in 10 mins</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>Serves {worker.serviceArea}</span>
              </div>
            </div>

            <Link
              href={`/book/${worker.id}`}
              className="w-full block text-center py-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Continue to Booking
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
