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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-blue-50/20">
        {/* Header */}
        <header className="w-full px-8 py-6 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-sky-100">
          <div className="flex items-center">
            <h1 className="text-3xl font-light text-slate-800 tracking-wide" style={{ fontFamily: "'Crimson Text', serif" }}>
              Still
            </h1>
          </div>
          
          <Button 
            onClick={() => setShowAuth(true)}
            className="px-8 py-3 rounded-full font-medium shadow-lg"
          >
            Start Reflecting
          </Button>
        </header>
        
        {/* Main Content */}
        <div className="container max-w-7xl mx-auto px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center min-h-[70vh]">
            {/* Left Content */}
            <div className="space-y-12">
              <div className="space-y-8">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-slate-800 leading-tight tracking-tight" style={{ fontFamily: "'Crimson Text', serif" }}>
                  A Space for Your Mind, Body & Soul
                </h1>
                <p className="text-md md:text-lg text-slate-600 leading-relaxed font-light max-w-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Join thousands of people embracing mindfulness and reflection. 
                  Discover guided meditation and peaceful moments designed for inner clarity.
                </p>
              </div>
              
              <div className="pt-2">
                <Button 
                  onClick={() => setShowAuth(true)}
                  size="lg"
                  className="px-12 py-4 rounded-full text-lg font-medium shadow-xl"
                >
                  Get Started
                  <span className="ml-3 text-xl">→</span>
                </Button>
              </div>
            </div>

            {/* Right Content - Clean circular background with image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-96 h-96 bg-calm-gradient rounded-full flex items-center justify-center shadow-2xl border border-sky-200/50 overflow-hidden">
                  <BuddhaAnimation/>
                </div>
                {/* Subtle decorative elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-sky-200/60 to-blue-200/60 rounded-full opacity-70 blur-sm"></div>
                <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-br from-blue-200/40 to-sky-300/40 rounded-full opacity-50 blur-sm"></div>
                <div className="absolute top-1/2 -left-10 w-8 h-8 bg-gradient-to-br from-sky-300/50 to-blue-200/50 rounded-full opacity-60 blur-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        {showAuth && (
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full relative border border-sky-100">
              <button 
                onClick={() => setShowAuth(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl transition-colors"
              >
                ×
              </button>
              <div className="p-8">
                <UserAuthPanel />
              </div>
            </div>
          </div>
        )}
        
        <Footer />
      </div>
    );
  }

  // Loading state for authenticated users
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
