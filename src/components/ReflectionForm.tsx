
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
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
}

const moodLabels = {
  1: "😔 Struggling",
  2: "😐 Okay", 
  3: "🙂 Good",
  4: "😊 Great",
  5: "🌟 Amazing"
};

const presetTags = [
  "Gratitude", "Work", "Family", "Health", "Learning", "Creativity", 
  "Exercise", "Mindfulness", "Relationships", "Goals", "Challenges", "Growth"
];

export default function ReflectionForm({ onSave }: ReflectionFormProps) {
  const [mood, setMood] = useState(3);
  const [well, setWell] = useState("");
  const [short, setShort] = useState("");
  const [again, setAgain] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { notification, showNotification, hideNotification } = usePositiveNotification();

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const entry: ReflectionEntry = {
      date: new Date(),
      mood,
      well: well.trim(),
      short: short.trim(),
      again: again.trim(),
      tags
    };

    console.log('Submitting reflection entry:', entry);

    try {
      await onSave(entry);
      showNotification('Reflection saved successfully');
      
      // Reset form
      setMood(3);
      setWell("");
      setShort("");
      setAgain("");
      setTags([]);
    } catch (error) {
      console.error('Error saving reflection:', error);
      showNotification('Failed to save reflection. Please try again.', 'info');
    }
    
    setLoading(false);
  };

  return (
    <>
      <SoftCard className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Today's Reflection</CardTitle>
          <CardDescription>
            Take a moment to reflect on your day with kindness and awareness.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mood Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">How are you feeling today?</Label>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(moodLabels).map(([value, label]) => (
                  <Button
                    key={value}
                    type="button"
                    variant={mood === parseInt(value) ? "default" : "outline"}
                    className="flex-1 min-w-fit text-sm"
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
                  className="min-h-[100px] resize-none"
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
                  className="min-h-[100px] resize-none"
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
                  className="min-h-[100px] resize-none"
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
                    className="text-sm"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
              {tags.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Selected tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
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
