
import React, { useState } from "react";
import SoftCard from "./SoftCard";
import SectionHeading from "./SectionHeading";
import { format } from "date-fns";
import { ArrowDown, ArrowUp } from "lucide-react";

type Entry = {
  date: Date;
  mood: number;
  well: string;
  short: string;
  again: string;
  tags: string[];
};

type Props = {
  entries: Entry[];
};

export default function ReflectionLog({ entries }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!entries.length) {
    return (
      <SoftCard className="animate-fade-in">
        <SectionHeading title="Reflection Log" />
        <div className="text-muted-foreground text-sm p-4 text-center">
          No reflections yet. Your logs will appear here.
        </div>
      </SoftCard>
    );
  }

  return (
    <SoftCard className="animate-fade-in">
      <SectionHeading title="Reflection Log" />
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 text-xs uppercase border-b">
              <th className="py-2 font-medium">Date</th>
              <th className="py-2 font-medium">Mood</th>
              <th className="py-2 font-medium">Tags</th>
              <th className="py-2 font-medium">Highlight</th>
              <th className="py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <React.Fragment key={idx}>
                <tr className="hover:bg-muted transition group">
                  <td className="py-2 pr-3 text-sm">{format(new Date(entry.date), "MMM d, yyyy")}</td>
                  <td className="py-2 pr-3 text-lg">{["😣","😐","🙂","😊","😌"][entry.mood-1]}</td>
                  <td className="py-2 pr-3">
                    {entry.tags.length ? entry.tags.join(", ") : <span className="text-gray-300">–</span>}
                  </td>
                  <td className="py-2 pr-3 max-w-xs truncate">{entry.well}</td>
                  <td>
                    <button
                      className="text-xs text-blue-500 hover:underline flex items-center"
                      onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                      aria-label={expandedIndex === idx ? "Collapse" : "Expand"}
                    >
                      {expandedIndex === idx ? <ArrowUp size={16}/> : <ArrowDown size={16}/>}
                    </button>
                  </td>
                </tr>
                {expandedIndex === idx && (
                  <tr>
                    <td colSpan={5} className="bg-muted rounded-lg p-4">
                      <div className="text-sm">
                        <div><strong>Did well:</strong> {entry.well}</div>
                        <div><strong>Fell short:</strong> {entry.short}</div>
                        <div><strong>Try again:</strong> {entry.again}</div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </SoftCard>
  );
}
