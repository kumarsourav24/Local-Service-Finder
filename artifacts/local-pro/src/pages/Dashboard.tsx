import { useLocation } from "wouter";
import { useGetWorkerDashboard, useUpdateBookingStatus } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { formatCurrency } from "@/lib/utils";
import { Wallet, Briefcase, CheckCircle, Clock, ChevronDown, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const searchParams = new URLSearchParams(window.location.search);
  const workerId = Number(searchParams.get("workerId")) || 1; // Default to 1 for demo
  
  const queryClient = useQueryClient();
  const { data: dashboard, isLoading } = useGetWorkerDashboard(workerId);
  const updateStatusMutation = useUpdateBookingStatus();

  if (isLoading) return <Layout><div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></Layout>;
  if (!dashboard) return <Layout><div className="p-20 text-center">Dashboard not found</div></Layout>;

  const handleStatusChange = async (bookingId: number, status: any) => {
    await updateStatusMutation.mutateAsync({
      bookingId,
      data: { status }
    });
    queryClient.invalidateQueries({ queryKey: [`/api/workers/${workerId}/dashboard`] });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in_progress': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="relative pt-12 pb-24 overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0 opacity-20">
           <img src={`${import.meta.env.BASE_URL}images/dashboard-bg.png`} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground mt-2 text-lg">Here's what's happening with your business today.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-20">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-6 border border-border shadow-md shadow-black/5 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
              <Wallet className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-1">Total Earnings</p>
              <h3 className="text-2xl font-display font-bold text-foreground">{formatCurrency(dashboard.totalEarnings)}</h3>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-border shadow-md shadow-black/5 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-1">Total Jobs</p>
              <h3 className="text-2xl font-display font-bold text-foreground">{dashboard.totalJobs}</h3>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-border shadow-md shadow-black/5 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-1">Pending Jobs</p>
              <h3 className="text-2xl font-display font-bold text-foreground">{dashboard.pendingJobs}</h3>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-border shadow-md shadow-black/5 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-1">Completed Jobs</p>
              <h3 className="text-2xl font-display font-bold text-foreground">{dashboard.completedJobs}</h3>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Table Area */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-border shadow-md shadow-black/5 overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
              <h2 className="text-xl font-bold font-display">Recent Bookings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/20 text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="p-5 font-semibold">Client</th>
                    <th className="p-5 font-semibold">Date & Time</th>
                    <th className="p-5 font-semibold">Amount</th>
                    <th className="p-5 font-semibold">Status</th>
                    <th className="p-5 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-border">
                  {dashboard.recentBookings?.map((booking) => (
                    <tr key={booking.id} className="hover:bg-secondary/10 transition-colors">
                      <td className="p-5">
                        <p className="font-bold text-foreground">{booking.userName}</p>
                        <p className="text-muted-foreground text-xs">{booking.userPhone}</p>
                      </td>
                      <td className="p-5">
                        <p className="font-medium">{format(new Date(booking.serviceDate), 'MMM d, yyyy')}</p>
                        <p className="text-muted-foreground text-xs">{booking.serviceTime}</p>
                      </td>
                      <td className="p-5 font-bold">
                        {formatCurrency(booking.totalAmount)}
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-5">
                        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                           <div className="relative group">
                             <select 
                               className="appearance-none bg-background border border-border rounded-lg px-3 py-1.5 pr-8 text-xs font-semibold cursor-pointer outline-none focus:border-primary"
                               value={booking.status}
                               onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                             >
                               <option value="pending">Pending</option>
                               <option value="confirmed">Confirm</option>
                               <option value="in_progress">In Progress</option>
                               <option value="completed">Complete</option>
                               <option value="cancelled">Cancel</option>
                             </select>
                             <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                           </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {(!dashboard.recentBookings || dashboard.recentBookings.length === 0) && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No recent bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chart Area */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-3xl border border-border shadow-md shadow-black/5 p-6">
              <h2 className="text-xl font-bold font-display mb-6">Weekly Earnings</h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboard.weeklyEarnings}>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [formatCurrency(value), 'Earnings']}
                    />
                    <Bar 
                      dataKey="earnings" 
                      fill="hsl(var(--primary))" 
                      radius={[6, 6, 6, 6]} 
                      barSize={30}
                      animationDuration={1000}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-foreground text-white rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] text-white/5">
                <Briefcase className="w-40 h-40" />
              </div>
              <h3 className="text-xl font-bold font-display mb-2 relative z-10">Grow your business</h3>
              <p className="text-white/70 text-sm mb-6 relative z-10">Complete more jobs quickly and maintain a 5-star rating to appear higher in search results.</p>
              <button className="bg-primary text-white w-full py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors relative z-10">
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
