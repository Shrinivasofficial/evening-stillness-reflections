
import React, { useState } from "react";
import { CalendarIcon, ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import SoftCard from "./SoftCard";
import SectionHeading from "./SectionHeading";

const TAGS = ["Focus", "Energy", "Discipline", "Relationships", "Creativity"];

type ReflectionEntry = {
  date: Date;
  mood: number;
  well: string;
  short: string;
  again: string;
  tags: string[];
};

type Props = {
  onSave: (entry: ReflectionEntry) => void;
};

export default function ReflectionForm({ onSave }: Props) {
  const today = new Date();
  const [date, setDate] = useState<Date>(today);
  const [mood, setMood] = useState<number>(3);
  const [well, setWell] = useState("");
  const [short, setShort] = useState("");
  const [again, setAgain] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      onSave({ date, mood, well, short, again, tags });
      setSaving(false);
      setWell(""); setShort(""); setAgain(""); setTags([]); setMood(3); setDate(today);
    }, 600); // fake delay
  }

  const moodEmojis = ["😣", "😐", "🙂", "😊", "😌"];

  return (
    <SoftCard className="animate-fade-in">
      <SectionHeading title="Today's Reflection" />
      <form onSubmit={handleSave} className="space-y-6">
        {/* Date Picker */}
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" className="w-full text-left pl-3 justify-start font-normal">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(dt: Date | undefined) => dt && setDate(dt)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* Mood Selector */}
        <div>
          <label className="block text-sm font-medium mb-1">Mood</label>
          <div className="flex items-center space-x-2">
            <Button type="button" variant="ghost" disabled={mood === 1} onClick={() => setMood((m) => Math.max(1, m - 1))}><ArrowDown size={18}/></Button>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={mood}
              className="w-full accent-blue-300"
              onChange={e => setMood(Number(e.target.value))}
              aria-label="Mood"
            />
            <Button type="button" variant="ghost" disabled={mood === 5} onClick={() => setMood((m) => Math.min(5, m + 1))}><ArrowUp size={18}/></Button>
            <span className="text-xl ml-2" aria-label="Mood">{moodEmojis[mood - 1]}</span>
          </div>
        </div>
        {/* Text Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">What did I do well today?</label>
            <textarea
              className="w-full border rounded-md p-2 bg-muted outline-none min-h-[60px] focus:ring-2"
              value={well}
              onChange={e => setWell(e.target.value)}
              required
              maxLength={500}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Where did I fall short?</label>
            <textarea
              className="w-full border rounded-md p-2 bg-muted outline-none min-h-[60px] focus:ring-2"
              value={short}
              onChange={e => setShort(e.target.value)}
              required
              maxLength={500}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">What can I try again tomorrow?</label>
            <textarea
              className="w-full border rounded-md p-2 bg-muted outline-none min-h-[60px] focus:ring-2"
              value={again}
              onChange={e => setAgain(e.target.value)}
              required
              maxLength={500}
            />
          </div>
        </div>
        {/* Tags Multi-select */}
        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex flex-wrap gap-2">
            {TAGS.map(tag => (
              <button
                type="button"
                key={tag}
                onClick={() =>
                  setTags(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag])
                }
                className={cn(
                  "px-3 py-1 rounded-full text-sm border transition-colors",
                  tags.includes(tag)
                    ? "bg-blue-50 border-blue-300 text-blue-600"
                    : "bg-muted border-gray-300 text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                )}
                aria-pressed={tags.includes(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        {/* Save Button */}
        <div>
          <Button type="submit" className="w-full rounded-full shadow-soft text-base py-2 px-8 disabled:opacity-60">
            {saving ? "Saving..." : "Save Reflection"}
          </Button>
        </div>
      </form>
    </SoftCard>
  );
}
