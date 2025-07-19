import React from "react";
import EveningReflectionDashboard from "../components/EveningReflectionDashboard";
import EnhancedLandingPage from "../components/EnhancedLandingPage";
import { useReflections } from "../hooks/useReflections";
import { Loader2 } from "lucide-react";

export default function Index() {
  const { isAuthenticated, loading } = useReflections();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-blue-50/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-sky-500" />
          <p className="mt-4 text-slate-600 font-light">Loading your peaceful space...</p>
        </div>
      </div>
    );
  }

  // Show enhanced landing page for unauthenticated users
  if (!isAuthenticated) {
    return <EnhancedLandingPage />;
  }

  // Show dashboard for authenticated users
  return <EveningReflectionDashboard />;
}
