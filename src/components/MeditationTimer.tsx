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

export default function MeditationTimer({
  onComplete,
  onRunningChange,
  setDuration: setDurationProp,
  sessionCompleted,
}: {
  onComplete?: () => void;
  onRunningChange?: (running: boolean) => void;
  setDuration?: (duration: number) => void;
  sessionCompleted?: boolean;
}) {
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [seconds, setSeconds] = useState(duration);
  const [running, setRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep seconds in sync with duration when not running
  useEffect(() => {
    if (!running) {
      setSeconds(duration);
    }
  }, [duration, running]);

  // 🔄 Inform parent of running state
  useEffect(() => {
    if (onRunningChange) onRunningChange(running);
  }, [running]);

  // 🔔 Timer logic + audio notification
  useEffect(() => {
    if (running && seconds > 0) {
      interval.current = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (!running && interval.current) {
      clearInterval(interval.current);
    }

    if (seconds === 0 && interval.current && !hasCompleted) {
      clearInterval(interval.current);
      setRunning(false);
      setHasCompleted(true);
      playNotificationSound();
      if (onComplete) onComplete();
    }

    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [running, seconds, hasCompleted]);

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    const playTone = (frequency: number, startTime: number, duration: number, volume = 0.3) => {
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

    playTone(1000, 0, 0.15, 0.4); // tri-tone
    playTone(800, 0.15, 0.15, 0.4);
    playTone(600, 0.3, 0.4, 0.4);

    setTimeout(() => {
      playTone(1000, 0, 0.1, 0.15);
      playTone(800, 0.1, 0.1, 0.15);
      playTone(600, 0.2, 0.3, 0.15);
    }, 100);
  };

  const handleStart = () => {
    setRunning(true);
    setHasCompleted(false); // Reset completion state when starting
  };
  
  const handlePause = () => setRunning(false);
  
  const handleReset = () => {
    setRunning(false);
    setSeconds(duration);
    setHasCompleted(false); // Reset completion state when resetting
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    if (setDurationProp) setDurationProp(newDuration);
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
            <Button
              variant="default"
              className="rounded-full px-5"
              onClick={handleStart}
              disabled={seconds === 0}
            >
              Start
            </Button>
          )}
          <Button variant="outline" className="rounded-full px-5" onClick={handleReset}>
            Reset
          </Button>
        </div>

        {seconds === 0 && (
          <div className="text-center pt-2 text-sm font-medium">
            {sessionCompleted ? (
              <div className="text-green-600 animate-pulse">
                🎉 Session saved! Great job!
              </div>
            ) : (
              <div className="text-green-600">
                🙏 Session complete! Well done.
              </div>
            )}
          </div>
        )}
      </div>

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
