
import React from "react";
import WelcomeSection from "./WelcomeSection";
import ReflectionForm from "./ReflectionForm";
import ReflectionLog from "./ReflectionLog";
import WeeklySummary from "./WeeklySummary";
import QuickLinksPanel from "./QuickLinksPanel";
import Footer from "./Footer";
import UserAuthPanel from "./UserAuthPanel";
import { useReflections } from "../hooks/useReflections";

export default function EveningReflectionDashboard() {
  const { reflections, loading, saveReflection, user } = useReflections();

  function handleSave(entry: any) {
    saveReflection(entry);
  }

  function handleNew() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!user) {
    return (
      <div className="font-sans bg-white min-h-screen">
        <header className="w-full px-4 py-4 border-b border-gray-200 bg-white flex items-center justify-between mb-4">
          <div className="font-semibold text-xl tracking-tight text-gray-800">Evening Reflection Journal</div>
          <UserAuthPanel />
        </header>
        <div className="container max-w-4xl mx-auto py-20 px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Evening Reflection Journal</h1>
          <p className="text-xl text-gray-600 mb-8">
            Reflect on your day, track your mood, and build meaningful habits through daily journaling.
          </p>
          <p className="text-gray-500">Please sign in to start your reflection journey.</p>
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
