import React, { useState } from "react";
import SoftCard from "./SoftCard";
import SectionHeading from "./SectionHeading";
import { format as formatDate } from "date-fns";
import { Button } from "./ui/button";
import type { MeditationLog as MeditationLogType } from "../hooks/useMeditationLogs";
import { usePositiveNotification } from "../hooks/usePositiveNotification";
import PositiveNotification from "./PositiveNotification";
import { Clock, Music, Calendar, Trash2 } from "lucide-react";

type MeditationLogProps = {
  meditationLogs: MeditationLogType[];
  loading: boolean;
  error: string | null;
  deleteMeditationLog: (id: string) => Promise<void>;
};

export default function MeditationLog({ meditationLogs, loading, error, deleteMeditationLog }: MeditationLogProps) {
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const { notification, showNotification, hideNotification } = usePositiveNotification();

  const handleDelete = async (entryId: string, idx: number) => {
    setDeletingIndex(idx);
    try {
      await deleteMeditationLog(entryId);
      showNotification('Meditation log deleted successfully', 'success');
    } catch (error: any) {
      showNotification('Failed to delete meditation log: ' + (error?.message || error), 'info');
    } finally {
      setDeletingIndex(null);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <SoftCard className="animate-fade-in">
        <SectionHeading title="Meditation Logs" />
        <div className="text-muted-foreground text-sm p-4 text-center">
          Loading your meditation logs...
        </div>
      </SoftCard>
    );
  }

  if (error) {
    return (
      <SoftCard className="animate-fade-in">
        <SectionHeading title="Meditation Logs" />
        <div className="text-red-600 text-sm p-4 text-center">
          <div className="mb-2">❌ Error loading meditation logs</div>
          <div className="text-xs text-gray-600">{error}</div>
          <div className="mt-2 text-xs text-gray-500">
            This might be because the meditation_logs table doesn't exist in your Supabase database.
          </div>
        </div>
      </SoftCard>
    );
  }

  if (!meditationLogs.length) {
    return (
      <SoftCard className="animate-fade-in">
        <SectionHeading title="Meditation Logs" />
        <div className="text-muted-foreground text-sm p-4 text-center">
          <div className="mb-2">🧘‍♀️ No meditation logs yet</div>
          <div className="text-xs">Complete a meditation session to see your logs here</div>
        </div>
      </SoftCard>
    );
  }

  return (
    <SoftCard className="animate-fade-in">
      <SectionHeading title="Meditation Logs" />
      <PositiveNotification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        type={notification.type}
      />
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-sky-600">{meditationLogs.length}</div>
          <div className="text-xs text-gray-600">Total Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-sky-600">
            {formatDuration(meditationLogs.reduce((total, log) => total + log.duration, 0))}
          </div>
          <div className="text-xs text-gray-600">Total Time</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-sky-600">
            {Math.round(meditationLogs.reduce((total, log) => total + log.duration, 0) / meditationLogs.length / 60)}m
          </div>
          <div className="text-xs text-gray-600">Avg Duration</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 text-xs uppercase border-b">
              <th className="py-3 font-medium">Date</th>
              <th className="py-3 font-medium">Duration</th>
              <th className="py-3 font-medium">Music</th>
              <th className="py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meditationLogs.map((entry, idx) => (
              <tr key={entry.id} className="hover:bg-muted transition group border-b border-gray-100">
                <td className="py-3 pr-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{formatDate(new Date(entry.date), "MMM d, yyyy")}</span>
                  </div>
                </td>
                <td className="py-3 pr-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{formatDuration(entry.duration)}</span>
                  </div>
                </td>
                <td className="py-3 pr-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-gray-400" />
                    <span className="max-w-xs truncate">
                      {entry.music && entry.music.length ? entry.music.join(", ") : <span className="text-gray-300">–</span>}
                    </span>
                  </div>
                </td>
                <td className="py-3 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={async () => {
                      await handleDelete(entry.id, idx);
                    }} 
                    disabled={deletingIndex === idx}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    {deletingIndex === idx ? 'Deleting...' : 'Delete'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SoftCard>
  );
} 