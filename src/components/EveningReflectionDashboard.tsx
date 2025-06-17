import React from "react";
import WelcomeSection from "./WelcomeSection";
import ReflectionForm from "./ReflectionForm";
import ReflectionLog from "./ReflectionLog";
import WeeklySummary from "./WeeklySummary";
import QuickLinksPanel from "./QuickLinksPanel";
import Footer from "./Footer";
import UserAuthPanel from "./UserAuthPanel";
import BuddhaAnimation from "./BuddhaAnimation";
import { useReflections } from "../hooks/useReflections";

export default function EveningReflectionDashboard() {
  const { reflections, loading, saveReflection, user } = useReflections();

  async function handleSave(entry: any) {
    await saveReflection(entry);
  }

  function handleNew() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!user) {
    return (
      <div className="font-sans bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <header className="w-full px-6 py-6 flex items-center justify-end">
          <UserAuthPanel />
        </header>
        
        <div className="container max-w-4xl mx-auto py-20 px-6 text-center min-h-[80vh] flex flex-col items-center justify-center">
          <div className="mb-12">
            <BuddhaAnimation />
          </div>
          
          <div className="space-y-8 max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-light text-gray-800 leading-tight">
              Evening Reflection
            </h1>
            <p className="text-xl text-gray-600 font-light leading-relaxed">
              A minimalist space for clarity, stillness, and soft resets.
            </p>
            
            <div className="pt-8">
              <blockquote className="text-lg text-gray-500 italic font-light">
                "Clarity comes from reflection. Power comes from stillness."
              </blockquote>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-sans bg-white min-h-screen">
      <header className="w-full px-4 py-4 border-b border-gray-200 bg-white flex items-center justify-between mb-4">
        <div className="font-semibold text-xl tracking-tight text-gray-800">Evening Reflection Journal</div>
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
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
