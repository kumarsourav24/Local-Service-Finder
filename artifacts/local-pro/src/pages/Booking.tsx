import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useGetWorker, useCreateBooking } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, Clock, MapPin, CreditCard, AlertTriangle, ChevronRight, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const bookingSchema = z.object({
  userName: z.string().min(2, "Name is required"),
  userPhone: z.string().min(10, "Valid phone number required"),
  serviceDate: z.string().min(1, "Please select a date"),
  serviceTime: z.string().min(1, "Please select a time"),
  address: z.string().min(10, "Detailed address is required"),
  description: z.string().min(10, "Please describe the job briefly"),
  paymentMethod: z.enum(["upi", "card", "cash"]),
  isEmergency: z.boolean().default(false),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function Booking() {
  const params = useParams();
  const workerId = Number(params.id);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: worker, isLoading: isLoadingWorker } = useGetWorker(workerId);
  const createBookingMutation = useCreateBooking();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      userName: "",
      userPhone: "",
      serviceDate: new Date().toISOString().split('T')[0],
      serviceTime: "10:00",
      address: "",
      description: "",
      paymentMethod: "cash",
      isEmergency: false,
    }
  });

  const isEmergency = form.watch("isEmergency");

  const onSubmit = async (data: BookingFormValues) => {
    try {
      await createBookingMutation.mutateAsync({
        data: {
          workerId,
          userId: "mock-user-123", // In a real app, from auth context
          ...data,
        }
      });
      
      toast({
        title: "Booking Confirmed!",
        description: `Your request has been sent to ${worker?.name}.`,
      });
      
      // Redirect to some success page or back to home
      setTimeout(() => setLocation("/"), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: "Please try again later.",
      });
    }
  };

  if (isLoadingWorker) {
    return <Layout><div className="flex items-center justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></Layout>;
  }

  if (!worker) return <Layout><div>Worker not found</div></Layout>;

  // Mock calculation: 2 hours min booking
  const estimatedHours = 2;
  const subtotal = worker.pricePerHour * estimatedHours;
  const emergencyFee = isEmergency ? 500 : 0;
  const total = subtotal + emergencyFee;

  return (
    <Layout>
      <div className="bg-secondary/30 py-10 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
          
          {/* Main Form Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-border shadow-sm">
              <h1 className="text-3xl font-display font-bold mb-2">Request Service</h1>
              <p className="text-muted-foreground mb-8">Fill in details to book {worker.name} for your job.</p>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {worker.isAvailableEmergency && (
                  <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5">
                    <label className="flex items-start gap-4 cursor-pointer">
                      <div className="flex items-center h-6">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded text-destructive focus:ring-destructive/50"
                          {...form.register("isEmergency")}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-destructive flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Emergency Request (ASAP)
                        </p>
                        <p className="text-sm text-destructive/80 mt-1">
                          Check this if you need immediate assistance. An additional {formatCurrency(500)} fee applies.
                        </p>
                      </div>
                    </label>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" /> Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-background/50"
                      {...form.register("serviceDate")}
                      disabled={isEmergency}
                    />
                    {form.formState.errors.serviceDate && (
                      <p className="text-destructive text-xs">{form.formState.errors.serviceDate.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" /> Time
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-background/50"
                      {...form.register("serviceTime")}
                      disabled={isEmergency}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold border-b border-border pb-2">Your Details</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
                        {...form.register("userName")}
                      />
                      {form.formState.errors.userName && (
                        <p className="text-destructive text-xs mt-1">{form.formState.errors.userName.message}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
                        {...form.register("userPhone")}
                      />
                      {form.formState.errors.userPhone && (
                        <p className="text-destructive text-xs mt-1">{form.formState.errors.userPhone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Full Address (House/Flat No, Street, Landmark)"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
                        {...form.register("address")}
                      />
                    </div>
                    {form.formState.errors.address && (
                      <p className="text-destructive text-xs mt-1">{form.formState.errors.address.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold border-b border-border pb-2">Job Description</h3>
                  <textarea
                    rows={4}
                    placeholder="Describe what needs to be done. E.g., Kitchen sink is leaking heavily..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none resize-none"
                    {...form.register("description")}
                  />
                  {form.formState.errors.description && (
                    <p className="text-destructive text-xs mt-1">{form.formState.errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold border-b border-border pb-2 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" /> Payment Method
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {["upi", "card", "cash"].map((method) => (
                      <label key={method} className="relative cursor-pointer">
                        <input
                          type="radio"
                          value={method}
                          className="peer sr-only"
                          {...form.register("paymentMethod")}
                        />
                        <div className="w-full text-center py-4 rounded-xl border-2 border-border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-secondary/50 transition-all uppercase font-bold text-sm tracking-wider text-muted-foreground peer-checked:text-primary">
                          {method}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

              </form>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-foreground text-white rounded-3xl p-6 sticky top-[100px] shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Booking Summary</h3>
              
              <div className="flex items-center gap-4 pb-6 border-b border-white/10 mb-6">
                <img src={worker.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${worker.name}`} alt="worker" className="w-16 h-16 rounded-xl object-cover bg-white/10" />
                <div>
                  <p className="font-bold text-lg">{worker.name}</p>
                  <p className="text-white/60 text-sm">{worker.category}</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-white/80 mb-6">
                <div className="flex justify-between">
                  <span>Base Rate</span>
                  <span>{formatCurrency(worker.pricePerHour)}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Duration</span>
                  <span>~2 hours</span>
                </div>
                {isEmergency && (
                  <div className="flex justify-between text-destructive bg-destructive/20 px-3 py-2 rounded-lg -mx-3 font-medium">
                    <span>Emergency Fee</span>
                    <span>{formatCurrency(emergencyFee)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-white/20 pt-6 mb-8">
                <div className="flex justify-between items-baseline">
                  <span className="text-white/80 font-medium">Estimated Total</span>
                  <span className="text-3xl font-display font-bold text-primary">{formatCurrency(total)}</span>
                </div>
                <p className="text-xs text-white/50 mt-2 text-right">Final price depends on actual time taken.</p>
              </div>

              <button
                onClick={form.handleSubmit(onSubmit)}
                disabled={createBookingMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
              >
                {createBookingMutation.isPending ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  <>Confirm Booking <ChevronRight className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
