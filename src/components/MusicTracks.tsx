import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

const calmTracks = [
  { name: "Rain Sound", url: "https://www.soundjay.com/nature/sounds/rain-01.mp3", duration: "∞" },
  { name: "Lake Sound", url: "https://www.soundjay.com/nature/sounds/lake-waves-01.mp3", duration: "∞" },
  { name: "River Sound", url: "https://www.soundjay.com/nature/sounds/river-2.mp3", duration: "∞" },
  { name: "Stream Sound", url: "https://www.soundjay.com/nature/sounds/stream-3.mp3", duration: "∞" },
  { name: "Ocean Sound", url: "https://www.soundjay.com/nature/sounds/ocean-wave-1.mp3", duration: "∞" },
];

const MusicTracks = forwardRef(({ sessionRunning, setCurrentMusic }: { sessionRunning: boolean; setCurrentMusic?: (music: string[]) => void }, ref) => {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // expose stop()
  useImperativeHandle(ref, () => ({
    stop: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setCurrentTrack(null);
    },
  }));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || currentTrack === null) return;

    audio.src = calmTracks[currentTrack].url;
    audio.muted = isMuted;
    audio.loop = false;

    const playAudio = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.error("Playback error:", err);
      }
    };

    if (sessionRunning) {
      playAudio();
    } else {
      audio.pause();
    }
  }, [currentTrack, sessionRunning, isMuted]);

  // 🔁 Replays track if it ends before session
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (sessionRunning && currentTrack !== null) {
        audio.currentTime = 0;
        audio.play();
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [sessionRunning, currentTrack]);

  const playTrack = (index: number) => {
    setCurrentTrack((prev) => {
      const newTrack = prev === index ? null : index;
      if (setCurrentMusic) {
        setCurrentMusic(newTrack !== null ? [calmTracks[newTrack].name] : []);
      }
      return newTrack;
    });
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMute = !prev;
      if (audioRef.current) audioRef.current.muted = newMute;
      return newMute;
    });
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
                ? "bg-blue-50 border-blue-200"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
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
              {currentTrack === index ? <Pause /> : <Play />}
            </Button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 text-center">
        Start your meditation timer and play calming sounds
      </p>

      <audio ref={audioRef} />
    </div>
  );
});

export default MusicTracks;
