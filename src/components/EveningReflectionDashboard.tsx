
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
      <div className="font-sans bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-screen">
        {/* Header */}
        <header className="w-full px-6 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">☯</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">Peace</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Home</a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">Classes</a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">About</a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">Blog</a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">Contact</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowAuth(true)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Sign In
              </button>
              <Button 
                onClick={() => setShowAuth(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-full transition-all duration-300"
              >
                Start Reflecting
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              onClick={() => setShowAuth(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-full text-sm"
            >
              Start Reflecting
            </Button>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="container max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  A Space for Your Mind, Body & Soul
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                  Join thousands of people embracing mindfulness and relaxation. 
                  Discover guided meditation and reflection sessions designed for all levels.
                </p>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={() => setShowAuth(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started
                  <span className="ml-2">→</span>
                </Button>
              </div>
            </div>

            {/* Right Content - Buddha Animation */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-96 h-96 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center shadow-2xl">
                  <BuddhaAnimation />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-200 rounded-full opacity-60"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-emerald-200 rounded-full opacity-40"></div>
                <div className="absolute top-1/2 -left-8 w-6 h-6 bg-teal-200 rounded-full opacity-50"></div>
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
    <div className="font-sans bg-white min-h-screen">
      <header className="w-full px-4 py-4 border-b border-gray-200 bg-white flex items-center justify-between mb-4">
        <div className="font-semibold text-xl tracking-tight text-gray-800">Peace - Evening Reflection Journal</div>
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
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
