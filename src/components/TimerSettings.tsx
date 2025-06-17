
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface TimerSettingsProps {
  duration: number;
  onDurationChange: (duration: number) => void;
  onClose: () => void;
}

export default function TimerSettings({ duration, onDurationChange, onClose }: TimerSettingsProps) {
  const minutes = Math.floor(duration / 60);
  
  const presetDurations = [
    { label: "3 min", value: 3 * 60 },
    { label: "5 min", value: 5 * 60 },
    { label: "10 min", value: 10 * 60 },
    { label: "15 min", value: 15 * 60 },
    { label: "20 min", value: 20 * 60 },
    { label: "30 min", value: 30 * 60 }
  ];

  return (
    <div className="space-y-6 p-4 bg-white rounded-xl border border-border shadow-lg">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-sky-600" />
        <h3 className="text-lg font-semibold text-gray-800">Timer Settings</h3>
      </div>
      
      {/* Preset Durations */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Quick Select</Label>
        <div className="grid grid-cols-3 gap-2">
          {presetDurations.map((preset) => (
            <Button
              key={preset.value}
              variant={duration === preset.value ? "default" : "outline"}
              size="sm"
              onClick={() => onDurationChange(preset.value)}
              className="text-sm"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Duration Slider */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Custom Duration: {minutes} minutes
        </Label>
        <Slider
          value={[duration]}
          onValueChange={(value) => onDurationChange(value[0])}
          max={30 * 60}
          min={1 * 60}
          step={60}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1 min</span>
          <span>30 min</span>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button onClick={onClose} className="flex-1">
          Apply
        </Button>
      </div>
    </div>
  );
}
