
import React, { useState, useRef, useEffect } from "react";
import { Timer as TimerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const FIVE_MINUTES = 5 * 60; // seconds

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

export default function MeditationTimer() {
  const [seconds, setSeconds] = useState(FIVE_MINUTES);
  const [running, setRunning] = useState(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

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
    }
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [running, seconds]);

  const handleStart = () => setRunning(true);
  const handlePause = () => setRunning(false);
  const handleReset = () => {
    setRunning(false);
    setSeconds(FIVE_MINUTES);
  };

  return (
    <div className="rounded-xl border border-border bg-white px-6 py-5 flex flex-col items-center shadow-card relative">
      <span className="text-gray-800 font-medium text-base flex items-center gap-2 pb-2">
        <TimerIcon size={18} className="mr-1 text-primary/80" />
        5 Min Meditation
      </span>
      <div className="text-3xl tabular-nums tracking-wide font-semibold mb-4 text-gray-700 select-none">
        {formatTime(seconds)}
      </div>
      <div className="flex gap-2">
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
        <span className="absolute left-0 right-0 text-center text-green-600 pt-2 text-sm font-medium">
          Session complete!
        </span>
      )}
    </div>
  );
}

