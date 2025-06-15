
import React, { useState } from "react";
import WelcomeSection from "./WelcomeSection";
import ReflectionForm from "./ReflectionForm";
import ReflectionLog from "./ReflectionLog";
import WeeklySummary from "./WeeklySummary";
import QuickLinksPanel from "./QuickLinksPanel";
import Footer from "./Footer";
import UserAuthPanel from "./UserAuthPanel";

type Entry = {
  date: Date;
  mood: number;
  well: string;
  short: string;
  again: string;
  tags: string[];
};

export default function EveningReflectionDashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);

  function handleSave(entry: Entry) {
    setEntries((prev) =>
      [...prev, entry].sort((a, b) => +new Date(b.date) - +new Date(a.date))
    );
  }

  function handleNew() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="font-sans bg-white min-h-screen">
      {/* Topbar with platform name and login panel */}
      <header className="w-full px-4 py-4 border-b border-gray-200 bg-white flex items-center justify-between mb-4">
        <div className="font-semibold text-xl tracking-tight text-gray-800">Evening Reflection Journal</div>
        <UserAuthPanel />
      </header>
      <div className="container max-w-6xl py-12 px-2 md:px-6 lg:px-8">
        <WelcomeSection />
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 items-start w-full">
          <div className="space-y-8">
            <ReflectionForm onSave={handleSave} />
            <WeeklySummary entries={entries} />
            <ReflectionLog entries={entries} />
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
