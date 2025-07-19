import React, { useState } from "react";
import WelcomeSection from "./WelcomeSection";
import ReflectionForm from "./ReflectionForm";
import ReflectionLog from "./ReflectionLog";
import WeeklySummary from "./WeeklySummary";
import QuickLinksPanel from "./QuickLinksPanel";
import Footer from "./Footer";
import UserAuthPanel from "./UserAuthPanel";
import { Button } from "@/components/ui/button";
import { useReflections } from "../hooks/useReflections";
import { Loader2 } from "lucide-react";
import BuddhaAnimation from "./BuddhaAnimation";

export default function EveningReflectionDashboard() {
  const { reflections, loading, saveReflection, updateReflection, deleteReflection, user, isAuthenticated } = useReflections();
  const [showAuth, setShowAuth] = useState(false);

  async function handleSave(entry: any) {
    try {
      await saveReflection(entry);
    } catch (error) {
      console.error('Failed to save reflection:', error);
      // Error handling is done in the form component
    }
  }

  // DEV ONLY: Add test reflection streak logs
  const isDev = import.meta.env?.MODE === 'development' || process.env.NODE_ENV === 'development';

  const addTestReflectionStreak = async (days: number) => {
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      await saveReflection({
        date,
        mood: 3,
        well: `Test well ${i+1}`,
        short: `Test short ${i+1}`,
        again: `Test again ${i+1}`,
        tags: ['test'],
      });
    }
    // Optionally show a notification here if you want
  };

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

  // Get current date for display
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-blue-50/20">
      <header className="w-full px-6 py-5 border-b border-sky-100 bg-white/90 backdrop-blur-sm flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <div className="text-2xl font-light tracking-wide text-slate-800" style={{ fontFamily: "'Crimson Text', serif" }}>
            Still - Evening Reflection Journal
          </div>
          <div className="text-sm text-slate-500 mt-1">
            {currentDate}
          </div>
        </div>
        <UserAuthPanel />
      </header>
      <div className="container max-w-6xl py-12 px-4 md:px-6 lg:px-8">
        <WelcomeSection />
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 items-start w-full">
          <div className="space-y-10">
            <ReflectionForm onSave={handleSave} />
            <WeeklySummary />

            <ReflectionLog 
              reflections={reflections}
              loading={loading}
              user={user}
              isAuthenticated={isAuthenticated}
              updateReflection={updateReflection}
              deleteReflection={deleteReflection}
            />
          </div>
          <div className="space-y-8">
            <QuickLinksPanel />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
