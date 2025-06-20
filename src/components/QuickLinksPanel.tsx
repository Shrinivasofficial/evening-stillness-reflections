import React, { useRef, useState } from "react";
import SoftCard from "./SoftCard";
import MeditationTimer from "./MeditationTimer";
import MusicTracks from "./MusicTracks";

export default function QuickLinksPanel() {
  const [sessionRunning, setSessionRunning] = useState(false);
  const musicRef = useRef<{ stop: () => void } | null>(null);

  const handleSessionEnd = () => {
    setSessionRunning(false);
    musicRef.current?.stop();
  };

  return (
    <SoftCard className="animate-fade-in">
      <div className="flex flex-col gap-5">
        <MeditationTimer
          onRunningChange={setSessionRunning}
          onComplete={handleSessionEnd}
        />
        <MusicTracks ref={musicRef} sessionRunning={sessionRunning} />
      </div>
    </SoftCard>
  );
}
