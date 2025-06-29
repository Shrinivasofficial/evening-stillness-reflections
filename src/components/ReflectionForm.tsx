import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import SoftCard from "./SoftCard";
import { usePositiveNotification } from "@/hooks/usePositiveNotification";
import PositiveNotification from "./PositiveNotification";

interface ReflectionEntry {
  date: Date;
  mood: number;
  well: string;
  short: string;
  again: string;
  tags: string[];
}

interface ReflectionFormProps {
  onSave: (entry: ReflectionEntry) => Promise<void>;
  initialEntry?: ReflectionEntry;
}

const moodLabels = {
  1: "😔 Struggling",
  2: "😐 Okay",
  3: "🙂 Good",
  4: "😊 Great",
  5: "🌟 Amazing",
};

const presetTags = [
  "Gratitude",
  "Work",
  "Family",
  "Health",
  "Learning",
  "Creativity",
  "Exercise",
  "Mindfulness",
  "Relationships",
  "Goals",
  "Challenges",
  "Growth",
];

export default function ReflectionForm({ onSave, initialEntry }: ReflectionFormProps) {
  const [date, setDate] = useState<Date>(initialEntry?.date ? new Date(initialEntry.date) : new Date());
  const [mood, setMood] = useState(initialEntry?.mood ?? 3);
  const [well, setWell] = useState(initialEntry?.well ?? "");
  const [short, setShort] = useState(initialEntry?.short ?? "");
  const [again, setAgain] = useState(initialEntry?.again ?? "");
  const [tags, setTags] = useState<string[]>(initialEntry?.tags ?? []);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notification, showNotification, hideNotification } =
    usePositiveNotification();

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting || loading) {
      console.log('Form submission blocked - already submitting');
      return;
    }
    
    setIsSubmitting(true);
    setLoading(true);
    
    console.log('=== FORM SUBMISSION START ===');
    
    const entry: ReflectionEntry = {
      date,
      mood,
      well: well.trim(),
      short: short.trim(),
      again: again.trim(),
      tags,
    };
    
    console.log('Form entry to save:', entry);
    
    try {
      await onSave(entry);
      showNotification("Reflection saved successfully");
      if (!initialEntry) {
        setMood(3);
        setWell("");
        setShort("");
        setAgain("");
        setTags([]);
      }
    } catch (error) {
      console.error("Error saving reflection:", error);
      showNotification("Failed to save reflection. Please try again.", "info");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
      console.log('=== FORM SUBMISSION END ===');
    }
  };

  return (
    <>
      <SoftCard className="animate-fade-in px-4 sm:px-6 md:px-8">
        <div className="max-w-screen-sm mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Daily Reflection
            </CardTitle>
            <CardDescription>
              Take a moment to reflect on your day with kindness and awareness.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Reflection Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
  mode="single"
  selected={date}
  onSelect={(selectedDate) => {
    if (selectedDate && selectedDate <= new Date()) {
      setDate(selectedDate);
    }
  }}
  disabled={(date) => date > new Date()}
  initialFocus
  className="p-3 pointer-events-auto"
/>

                  </PopoverContent>
                </Popover>
              </div>

              {/* Mood Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  How are you feeling today?
                </Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(moodLabels).map(([value, label]) => (
                    <Button
                      key={value}
                      type="button"
                      variant={mood === parseInt(value) ? "default" : "outline"}
                      className="text-sm px-3"
                      onClick={() => setMood(parseInt(value))}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Reflection Questions */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="well" className="text-base font-medium">
                    What did I do well today?
                  </Label>
                  <Textarea
                    id="well"
                    value={well}
                    onChange={(e) => setWell(e.target.value)}
                    placeholder="Celebrate your wins, no matter how small..."
                    className="min-h-[100px] resize-none w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short" className="text-base font-medium">
                    Where did I fall short?
                  </Label>
                  <Textarea
                    id="short"
                    value={short}
                    onChange={(e) => setShort(e.target.value)}
                    placeholder="Reflect with compassion, not judgment..."
                    className="min-h-[100px] resize-none w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="again" className="text-base font-medium">
                    What can I try again tomorrow?
                  </Label>
                  <Textarea
                    id="again"
                    value={again}
                    onChange={(e) => setAgain(e.target.value)}
                    placeholder="Focus on growth and learning..."
                    className="min-h-[100px] resize-none w-full"
                    required
                  />
                </div>
              </div>

              {/* Tags Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Select relevant tags</Label>
                <div className="flex flex-wrap gap-2">
                  {presetTags.map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant={tags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTag(tag)}
                      className="text-sm px-3"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>

                {tags.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Selected tags:</p>
                    <div className="flex flex-wrap gap-2 overflow-x-auto">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeTag(tag)}
                          >
                            <X size={12} />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Save Reflection"}
              </Button>
            </form>
          </CardContent>
        </div>
      </SoftCard>

      <PositiveNotification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        type={notification.type}
      />
    </>
  );
}
