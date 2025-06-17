
import React, { useState } from "react";
import WelcomeSection from "./WelcomeSection";
import ReflectionForm from "./ReflectionForm";
import ReflectionLog from "./ReflectionLog";
import WeeklySummary from "./WeeklySummary";
import QuickLinksPanel from "./QuickLinksPanel";
import Footer from "./Footer";
import UserAuthPanel from "./UserAuthPanel";
import BuddhaAnimation from "./BuddhaAnimation";
import { Button } from "@/components/ui/button";
import { useReflections } from "../hooks/useReflections";

export default function EveningReflectionDashboard() {
  const { reflections, loading, saveReflection, user } = useReflections();
  const [showAuth, setShowAuth] = useState(false);

  async function handleSave(entry: any) {
    await saveReflection(entry);
  }

  function handleNew() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!user) {
    return (
      <div className="font-serif bg-white min-h-screen">
        {/* Header */}
        <header className="w-full px-6 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-3xl font-light text-gray-800 tracking-wide">Peace</h1>
          </div>
          
          <Button 
            onClick={() => setShowAuth(true)}
            className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Start Reflecting
          </Button>
        </header>
        
        {/* Main Content */}
        <div className="container max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
            {/* Left Content */}
            <div className="space-y-10">
              <div className="space-y-8">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-gray-900 leading-tight tracking-tight">
                  A Space for Your Mind, Body & Soul
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light max-w-2xl">
                  Join thousands of people embracing mindfulness and relaxation. 
                  Discover guided meditation and reflection sessions designed for all levels.
                </p>
              </div>
              
              <div className="pt-6">
                <Button 
                  onClick={() => setShowAuth(true)}
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white px-10 py-4 rounded-full text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started
                  <span className="ml-3">→</span>
                </Button>
              </div>
            </div>

            {/* Right Content - Girl Image with Gradient Background */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-96 h-96 bg-gradient-to-br from-emerald-100 via-teal-50 to-green-100 rounded-full flex items-center justify-center shadow-2xl">
                  <BuddhaAnimation />
                </div>
                {/* Decorative gradient elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full opacity-70"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-teal-200 to-green-200 rounded-full opacity-50"></div>
                <div className="absolute top-1/2 -left-8 w-6 h-6 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full opacity-60"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        {showAuth && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative">
              <button 
                onClick={() => setShowAuth(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
              <div className="p-6">
                <UserAuthPanel />
              </div>
            </div>
          </div>
        )}
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-serif bg-white min-h-screen">
      <header className="w-full px-4 py-4 border-b border-gray-200 bg-white flex items-center justify-between mb-4">
        <div className="font-light text-2xl tracking-wide text-gray-800">Peace - Evening Reflection Journal</div>
        <UserAuthPanel />
      </header>
      <div className="container max-w-6xl py-12 px-2 md:px-6 lg:px-8">
        <WelcomeSection />
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 items-start w-full">
          <div className="space-y-8">
            <ReflectionForm onSave={handleSave} />
            <WeeklySummary entries={reflections} />
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading your reflections...</p>
              </div>
            ) : (
              <ReflectionLog entries={reflections} />
            )}
          </div>
          <div className="space-y-8">
            <QuickLinksPanel onNew={handleNew} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
