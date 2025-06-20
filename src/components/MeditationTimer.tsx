
import React, { useState, useRef, useEffect } from "react";
import { Timer as TimerIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimerSettings from "./TimerSettings";

const DEFAULT_DURATION = 5 * 60; // 5 minutes in seconds

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

export default function MeditationTimer() {
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [seconds, setSeconds] = useState(duration);
  const [running, setRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Update seconds when duration changes
  useEffect(() => {
    if (!running) {
      setSeconds(duration);
    }
  }, [duration, running]);

  // Play iPhone-like notification sound when timer completes
  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // iPhone message tone sequence (approximation)
    const playTone = (frequency: number, startTime: number, duration: number, volume: number = 0.3) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + startTime);
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);
      
      oscillator.start(audioContext.currentTime + startTime);
      oscillator.stop(audioContext.currentTime + startTime + duration);
    };

    // iPhone-like tri-tone sequence
    playTone(1000, 0, 0.15, 0.4);      // First tone
    playTone(800, 0.15, 0.15, 0.4);   // Second tone  
    playTone(600, 0.3, 0.4, 0.4);     // Third tone (longer)
    
    // Add a subtle echo effect
    setTimeout(() => {
      playTone(1000, 0, 0.1, 0.15);
      playTone(800, 0.1, 0.1, 0.15);
      playTone(600, 0.2, 0.3, 0.15);
    }, 100);
  };

  // Start/pause timer
  useEffect(() => {
    if (running && seconds > 0) {
      interval.current = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (!running && interval.current) {
      clearInterval(interval.current);
    }
    if (seconds === 0 && interval.current) {
      clearInterval(interval.current);
      setRunning(false);
      playNotificationSound();
    }
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [running, seconds]);

  const handleStart = () => setRunning(true);
  const handlePause = () => setRunning(false);
  const handleReset = () => {
    setRunning(false);
    setSeconds(duration);
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    if (!running) {
      setSeconds(newDuration);
    }
  };

  return (
    <div className="relative">
      <div className="rounded-xl border border-border bg-white px-6 py-5 flex flex-col items-center shadow-card">
        <div className="flex items-center justify-between w-full mb-4">
          <span className="text-gray-800 font-medium text-base flex items-center gap-2">
            <TimerIcon size={18} className="text-sky-600" />
            Meditation Timer
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-500 hover:text-sky-600"
          >
            <Settings size={16} />
          </Button>
        </div>
        
        <div className="mb-4">
          <div
            className={`mx-auto flex items-center justify-center rounded-full transition-all duration-200 ${
              running ? "ring-2 ring-sky-300 animate-pulse bg-sky-50" : "bg-gray-50"
            }`}
            style={{ width: 120, height: 120 }}
          >
            <div className="text-4xl tabular-nums tracking-wide font-semibold text-gray-700 select-none">
              {formatTime(seconds)}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mb-2">
          {running ? (
            <Button variant="secondary" className="rounded-full px-5" onClick={handlePause}>
              Pause
            </Button>
          ) : (
            <Button variant="default" className="rounded-full px-5" onClick={handleStart} disabled={seconds === 0}>
              Start
            </Button>
          )}
          <Button variant="outline" className="rounded-full px-5" onClick={handleReset}>
            Reset
          </Button>
        </div>
        
        {seconds === 0 && (
          <div className="text-center text-green-600 pt-2 text-sm font-medium">
            🙏 Session complete! Well done.
          </div>
        )}
      </div>
      
      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-full mt-2 left-0 right-0 z-10">
          <TimerSettings
            duration={duration}
            onDurationChange={handleDurationChange}
            onClose={() => setShowSettings(false)}
          />
        </div>
      )}
    </div>
  );
}
