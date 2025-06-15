
import React from "react";
import SoftCard from "./SoftCard";
import SectionHeading from "./SectionHeading";
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, ResponsiveContainer } from "recharts";
import { Tag } from "lucide-react";

type Entry = {
  date: Date;
  mood: number;
  tags: string[];
};

type Props = {
  entries: Entry[];
};

function getWeeklyData(entries: Entry[]) {
  // Show last 7 days' moods + fill missing days as null.
  const today = new Date();
  let days: { date: Date; label: string; mood: number | null }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dt = new Date(today);
    dt.setDate(today.getDate() - i);
    days.push({
      date: dt,
      label: dt.toLocaleDateString(undefined, { weekday: "short" }),
      mood: null,
    });
  }
  // Overwrite moods for matching entries
  days.forEach((d) => {
    const found = entries.find((e) =>
      new Date(e.date).toLocaleDateString() === d.date.toLocaleDateString()
    );
    if (found) d.mood = found.mood;
  });
  return days;
}

export default function WeeklySummary({ entries }: Props) {
  if (entries.length === 0) return null;
  const data = getWeeklyData(entries);

  // Tags count
  const tagCounts: Record<string, number> = {};
  entries.slice(-7).forEach(e =>
    e.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1 })
  );
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <SoftCard className="animate-fade-in">
      <SectionHeading title="Weekly Summary" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium mb-1">Mood Trend</h4>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" />
              <YAxis domain={[1, 5]} ticks={[1,2,3,4,5]} hide={false} />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#3B82F6" dot={{ r: 5 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-1">Top Tags</h4>
          <div className="flex gap-2 flex-wrap">
            {topTags.length
              ? topTags.map(([t, c]) => (
                  <span key={t} className="bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3 py-1 text-xs flex items-center gap-1 font-semibold">
                    <Tag className="w-4 h-4" /> {t} <span className="ml-1 text-blue-400 font-medium">×{c}</span>
                  </span>
                ))
              : <span className="text-gray-300">–</span>}
          </div>
        </div>
      </div>
    </SoftCard>
  );
}
