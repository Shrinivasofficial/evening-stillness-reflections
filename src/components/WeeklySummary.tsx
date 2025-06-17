
import React from "react";
import SoftCard from "./SoftCard";
import SectionHeading from "./SectionHeading";
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Tag, TrendingUp, Calendar } from "lucide-react";

type Entry = {
  date: Date;
  mood: number;
  tags: string[];
};

type Props = {
  entries: Entry[];
};

function getWeeklyData(entries: Entry[]) {
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
  days.forEach((d) => {
    const found = entries.find((e) =>
      new Date(e.date).toLocaleDateString() === d.date.toLocaleDateString()
    );
    if (found) d.mood = found.mood;
  });
  return days;
}

function getMoodEmoji(mood: number) {
  const moodEmojis = {
    1: "😔",
    2: "😐", 
    3: "🙂",
    4: "😊",
    5: "🌟"
  };
  return moodEmojis[mood as keyof typeof moodEmojis] || "😐";
}

export default function WeeklySummary({ entries }: Props) {
  if (entries.length === 0) return null;
  
  const data = getWeeklyData(entries);
  const recentEntries = entries.slice(-7);
  
  // Calculate average mood
  const validMoods = data.filter(d => d.mood !== null).map(d => d.mood!);
  const avgMood = validMoods.length > 0 ? (validMoods.reduce((a, b) => a + b, 0) / validMoods.length).toFixed(1) : 0;
  
  // Tags count
  const tagCounts: Record<string, number> = {};
  recentEntries.forEach(e =>
    e.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1 })
  );
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <SoftCard className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-sky-600" />
        <h3 className="text-lg font-semibold text-gray-800">Weekly Summary</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mood Trend Chart */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Mood Trend</h4>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>Avg: {avgMood}/5 {getMoodEmoji(Math.round(Number(avgMood)))}</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis 
                  domain={[1, 5]} 
                  ticks={[1,2,3,4,5]} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  fill="url(#moodGradient)"
                  dot={{ r: 4, fill: '#0ea5e9' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Tags */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-sky-600" />
            <h4 className="text-sm font-medium text-gray-700">Top Themes</h4>
          </div>
          <div className="space-y-3">
            {topTags.length > 0 ? (
              topTags.map(([tag, count], index) => (
                <div key={tag} className="flex items-center justify-between p-3 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg border border-sky-100">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      index === 0 ? 'bg-sky-500' : 
                      index === 1 ? 'bg-sky-400' : 'bg-sky-300'
                    }`} />
                    <span className="text-sm font-medium text-gray-700">{tag}</span>
                  </div>
                  <span className="text-xs font-semibold text-sky-600 bg-sky-100 px-2 py-1 rounded-full">
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400">
                <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No tags yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SoftCard>
  );
}
