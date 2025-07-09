import React, { useRef, useState } from "react";
import SoftCard from "./SoftCard";
import MeditationTimer from "./MeditationTimer";
import MusicTracks from "./MusicTracks";
import MeditationLog from "./MeditationLog";
import MeditationStats from "./MeditationStats";
import { useMeditationLogs } from "../hooks/useMeditationLogs";
import { usePositiveNotification } from "../hooks/usePositiveNotification";

export default function QuickLinksPanel() {
  const [sessionRunning, setSessionRunning] = useState(false);
  const [timerDuration, setTimerDuration] = useState(5 * 60); // default 5 min
  const [currentMusic, setCurrentMusic] = useState<string[]>([]);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const musicRef = useRef<{ stop: () => void } | null>(null);
  const { saveMeditationLog, meditationLogs, loading, error, deleteMeditationLog, calculateStats } = useMeditationLogs();
  const { showNotification } = usePositiveNotification();

  const handleSessionEnd = async () => {
    // Prevent multiple calls
    if (isSaving) {
      console.log('Session end already being processed, skipping...');
      return;
    }
    
    setIsSaving(true);
    setSessionRunning(false);
    musicRef.current?.stop();
    setSessionCompleted(true);
    
    try {
      console.log('Saving meditation session:', { duration: timerDuration, music: currentMusic });
      await saveMeditationLog({
        date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
        duration: timerDuration,
        music: currentMusic,
      });
      showNotification('🎉 Meditation session completed and saved!', 'success');
      
      // Reset session completed state after a delay
      setTimeout(() => setSessionCompleted(false), 3000);
    } catch (error: any) {
      console.error('Failed to save meditation log:', error);
      showNotification('Failed to save meditation log: ' + (error?.message || error), 'info');
      setSessionCompleted(false);
    } finally {
      setIsSaving(false);
    }
  };

  // DEV ONLY: Add test streak logs
  const isDev = import.meta.env?.MODE === 'development' || process.env.NODE_ENV === 'development';

  const addTestStreak = async (days: number) => {
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      await saveMeditationLog({
        date: date.toISOString().split('T')[0],
        duration: 600, // 10 min
        music: [],
      });
    }
    showNotification(`${days}-day test streak logs added!`, 'success');
  };

  return (
    <div className="space-y-6">
      <SoftCard className="animate-fade-in">
        <div className="flex flex-col gap-5">
          <MeditationTimer
            onRunningChange={setSessionRunning}
            onComplete={handleSessionEnd}
            setDuration={setTimerDuration}
            sessionCompleted={sessionCompleted}
          />
          <MusicTracks ref={musicRef} sessionRunning={sessionRunning} setCurrentMusic={setCurrentMusic} />
        </div>
      </SoftCard>
      
      <MeditationStats 
        meditationLogs={meditationLogs}
        loading={loading}
        calculateStats={calculateStats}
      />
      <MeditationLog 
        meditationLogs={meditationLogs}
        loading={loading}
        error={error}
        deleteMeditationLog={deleteMeditationLog}
      />
    </div>
  );
}
