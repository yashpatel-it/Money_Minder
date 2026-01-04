import { Sidebar } from "./Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading your finance dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect logic handled in AuthPage, but here we can just return null or a loader 
    // while the redirect happens if useAuth doesn't handle it (but it does via login flow)
    // Actually, simple protection:
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      <Sidebar />
      <main className="lg:pl-[280px] min-h-screen">
        <div className="container max-w-7xl mx-auto p-4 md:p-8 pt-20 lg:pt-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
