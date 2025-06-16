
import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

const calmTracks = [
  { name: "Rain Sounds", url: "https://www.soundjay.com/misc/sounds/rain-01.wav", duration: "∞" },
  { name: "Ocean Waves", url: "https://www.soundjay.com/nature/sounds/ocean-1.wav", duration: "∞" },
  { name: "Forest Birds", url: "https://www.soundjay.com/nature/sounds/forest-1.wav", duration: "∞" },
  { name: "Tibetan Bowls", url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", duration: "∞" },
];

export default function MusicTracks() {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrack = (index: number) => {
    if (currentTrack === index && isPlaying) {
      // Pause current track
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      // Play new track or resume
      if (currentTrack !== index) {
        setCurrentTrack(index);
        // Note: Using placeholder audio since we can't load external audio files
        // In a real app, you'd have your own audio files
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800">Calming Sounds</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          className="h-8 w-8 p-0"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
      </div>
      
      <div className="space-y-2">
        {calmTracks.map((track, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              currentTrack === index 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">{track.name}</p>
              <p className="text-xs text-gray-500">{track.duration}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => playTrack(index)}
              className="h-8 w-8 p-0"
            >
              {currentTrack === index && isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 text-center">
        Start your meditation timer and play calming sounds
      </p>
      
      {/* Hidden audio element for future implementation */}
      <audio ref={audioRef} loop muted={isMuted} />
    </div>
  );
}
