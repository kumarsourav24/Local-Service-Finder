import { useLocation } from "wouter";
import { useGetCategories, useRegisterWorker } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Briefcase, MapPin, DollarSign, Image as ImageIcon } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  categoryId: z.string().min(1, "Category is required"),
  experience: z.coerce.number().min(0, "Experience must be 0 or more"),
  pricePerHour: z.coerce.number().min(50, "Minimum rate is 50"),
  serviceArea: z.string().min(3, "Service area is required"),
  bio: z.string().min(20, "Please provide a brief bio (min 20 chars)"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  skillsText: z.string().optional(), // Will be split by comma
  isAvailableEmergency: z.boolean().default(false),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: categories } = useGetCategories();
  const registerMutation = useRegisterWorker();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      experience: 1,
      pricePerHour: 200,
      serviceArea: "",
      bio: "",
      phone: "",
      email: "",
      skillsText: "",
      isAvailableEmergency: false,
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const skills = data.skillsText ? data.skillsText.split(',').map(s => s.trim()) : [];
      
      const res = await registerMutation.mutateAsync({
        data: {
          name: data.name,
          categoryId: data.categoryId,
          experience: data.experience,
          pricePerHour: data.pricePerHour,
          serviceArea: data.serviceArea,
          bio: data.bio,
          phone: data.phone,
          email: data.email,
          isAvailableEmergency: data.isAvailableEmergency,
          skills: skills,
          lat: 17.3850, // Mock coordinates
          lng: 78.4867
        }
      });
      
      toast({
        title: "Registration Successful!",
        description: "Welcome to LocalPro. Redirecting to your dashboard...",
      });
      
      setTimeout(() => setLocation(`/dashboard?workerId=${res.id}`), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Please check your inputs and try again.",
      });
    }
  };

  return (
    <Layout>
      <div className="bg-secondary/20 py-12 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-display font-bold text-foreground">Become a Professional</h1>
            <p className="text-muted-foreground mt-2">Join thousands of workers earning daily on LocalPro.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-border shadow-xl shadow-black/5">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-bold border-b border-border pb-2 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" /> Professional Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && <p className="text-destructive text-xs mt-1">{form.formState.errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1">Category</label>
                    <select
                      className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none bg-white appearance-none"
                      {...form.register("categoryId")}
                    >
                      <option value="">Select a category</option>
                      {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {form.formState.errors.categoryId && <p className="text-destructive text-xs mt-1">{form.formState.errors.categoryId.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none"
                      {...form.register("experience")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1">Hourly Rate (₹)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                      <input
                        type="number"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none"
                        {...form.register("pricePerHour")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Location */}
              <div>
                <h3 className="text-lg font-bold border-b border-border pb-2 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Contact & Location
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none"
                      {...form.register("phone")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none"
                      {...form.register("email")}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-foreground mb-1">Primary Service Area (Neighborhood/City)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none"
                      {...form.register("serviceArea")}
                    />
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div>
                <h3 className="text-lg font-bold border-b border-border pb-2 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" /> Profile Details
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1">About You (Bio)</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none resize-none"
                      placeholder="Tell customers about your expertise and why they should hire you..."
                      {...form.register("bio")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1">Specific Skills (comma separated)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none"
                      placeholder="e.g. Pipe fitting, Sink repair, Water heater installation"
                      {...form.register("skillsText")}
                    />
                  </div>
                  
                  <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-border bg-background/50 cursor-pointer hover:bg-secondary/20 transition-colors">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded text-primary focus:ring-primary/50"
                      {...form.register("isAvailableEmergency")}
                    />
                    <div>
                      <p className="font-bold text-foreground">Available for Emergency Services</p>
                      <p className="text-sm text-muted-foreground">I can respond quickly to urgent requests (extra earnings apply).</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none text-lg"
                >
                  {registerMutation.isPending ? (
                    <><Loader2 className="w-6 h-6 animate-spin" /> Registering...</>
                  ) : (
                    "Create Professional Profile"
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
