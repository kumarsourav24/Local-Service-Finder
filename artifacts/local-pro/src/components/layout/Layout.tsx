import { ReactNode } from "react";
import { Navbar } from "./Navbar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-1 flex flex-col pt-[80px]">
        {children}
      </main>
      <footer className="bg-foreground text-white/70 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <span className="font-display font-bold text-2xl tracking-tight text-white mb-4 block">
              Local<span className="text-primary">Pro</span>
            </span>
            <p className="max-w-xs text-sm">
              Connecting communities with trusted local professionals for everyday needs and emergencies.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/search" className="hover:text-primary transition-colors">Find Services</a></li>
              <li><a href="/register" className="hover:text-primary transition-colors">Become a Pro</a></li>
              <li><a href="/emergency" className="hover:text-destructive transition-colors">Emergency Services</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Trust & Safety</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
