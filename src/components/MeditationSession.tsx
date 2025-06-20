import React, { useRef, useState } from "react";
import MeditationTimer from "./MeditationTimer";
import MusicTracks from "./MusicTracks";

export default function MeditationSession() {
  const musicRef = useRef<any>(null);
  const [sessionRunning, setSessionRunning] = useState(false);

  const handleTimerComplete = () => {
    if (musicRef.current) musicRef.current.stop();
    setSessionRunning(false);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 items-start">
      <MeditationTimer
        onComplete={handleTimerComplete}
        onRunningChange={setSessionRunning}
      />
      <MusicTracks ref={musicRef} sessionRunning={sessionRunning} />
    </div>
  );
}
