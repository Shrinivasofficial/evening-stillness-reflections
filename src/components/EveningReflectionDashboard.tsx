import React, { useState } from "react";
import WelcomeSection from "./WelcomeSection";
import ReflectionForm from "./ReflectionForm";
import ReflectionLog from "./ReflectionLog";
import WeeklySummary from "./WeeklySummary";
import VoiceNotes from "./VoiceNotes";
import QuickLinksPanel from "./QuickLinksPanel";
import Footer from "./Footer";

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
    setEntries(prev => [...prev, entry].sort((a, b) => +new Date(b.date) - +new Date(a.date)));
  }

  function handleNew() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Layout: 2-column on desktop, stacked mobile. Keep max-w-4xl for comfort.
  return (
    <div className="font-sans bg-white min-h-screen">
      <div className="container max-w-4xl py-8">
        <WelcomeSection />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start w-full">
          <div className="md:col-span-2 space-y-6">
            <ReflectionForm onSave={handleSave} />
            <WeeklySummary entries={entries} />
            <ReflectionLog entries={entries} />
          </div>
          <div className="md:col-span-1 space-y-6">
            <QuickLinksPanel onNew={handleNew} />
            <VoiceNotes />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
