
import React from "react";
import SoftCard from "./SoftCard";
import MeditationTimer from "./MeditationTimer";
import MusicTracks from "./MusicTracks";

export default function QuickLinksPanel() {
  return (
    <SoftCard className="animate-fade-in">
      <div className="flex flex-col gap-5">
        <MeditationTimer />
        <MusicTracks />
      </div>
    </SoftCard>
  );
}
