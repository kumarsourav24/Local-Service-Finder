import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center flex-1 text-center px-4 py-20">
        <h1 className="text-9xl font-display font-extrabold text-muted-foreground/20">404</h1>
        <h2 className="text-3xl font-bold mt-4 mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Link href="/" className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors">
          Return Home
        </Link>
      </div>
    </Layout>
  );
}
