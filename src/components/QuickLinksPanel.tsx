
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Download, Share } from "lucide-react";
import SoftCard from "./SoftCard";

export default function QuickLinksPanel({ onNew }: { onNew: () => void }) {
  return (
    <SoftCard className="animate-fade-in">
      <div className="flex flex-col gap-3">
        <Button variant="secondary" className="rounded-full flex gap-2 items-center justify-start" onClick={onNew}>
          <CalendarPlus size={18} /> New Reflection
        </Button>
        <a
          href="https://www.youtube.com/watch?v=inpok4MKVLM"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full flex gap-2 items-center text-gray-600 py-2 px-4 hover:bg-blue-50 transition"
        >
          🧘 Breathing Timer / Meditation
        </a>
        <Button
          variant="outline"
          className="rounded-full flex items-center gap-2"
          disabled
        >
          <Download size={18} /> Download Journal (PDF)
        </Button>
        <Button
          variant="outline"
          className="rounded-full flex items-center gap-2"
          disabled
        >
          <Share size={18} /> Share / Feedback
        </Button>
      </div>
    </SoftCard>
  );
}
