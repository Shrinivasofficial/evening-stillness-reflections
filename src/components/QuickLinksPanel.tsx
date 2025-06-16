
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import SoftCard from "./SoftCard";
import MeditationTimer from "./MeditationTimer";
import MusicTracks from "./MusicTracks";

export default function QuickLinksPanel({ onNew }: { onNew: () => void }) {
  return (
    <SoftCard className="animate-fade-in">
      <div className="flex flex-col gap-5">
        <Button
          variant="secondary"
          className="rounded-full flex gap-2 items-center justify-start"
          onClick={onNew}
        >
          <CalendarPlus size={18} /> New Reflection
        </Button>
        <MeditationTimer />
        <MusicTracks />
      </div>
    </SoftCard>
  );
}
