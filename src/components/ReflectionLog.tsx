import React, { useState } from "react";
import SoftCard from "./SoftCard";
import SectionHeading from "./SectionHeading";
import { format as formatDate, parseISO } from "date-fns";
import { ArrowDown, ArrowUp } from "lucide-react";
import ReflectionForm from "./ReflectionForm";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { usePositiveNotification } from "../hooks/usePositiveNotification";
import PositiveNotification from "./PositiveNotification";
import { getReflectionStreakInfo } from "../hooks/useReflections";

type Entry = {
  id: string;
  date: Date;
  mood: number;
  well: string;
  short: string;
  again: string;
  tags: string[];
};

type EditableEntry = Omit<Entry, 'date'> & { date?: Date };

export default function ReflectionLog({ reflections, loading, user, isAuthenticated, updateReflection, deleteReflection }: {
  reflections: any[],
  loading: boolean,
  user: any,
  isAuthenticated: boolean,
  updateReflection: Function,
  deleteReflection: Function
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editState, setEditState] = useState<EditableEntry | null>(null);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const { notification, showNotification, hideNotification } = usePositiveNotification();
  const [milestoneShown, setMilestoneShown] = useState<number | null>(null); // NEW

  // Milestone streaks
  const MILESTONES = [5, 7, 10, 15, 30];
  const { currentStreak } = getReflectionStreakInfo(reflections);
  const isMilestone = MILESTONES.includes(currentStreak);

  // Show milestone notification only once per milestone per session
  React.useEffect(() => {
    if (isMilestone && milestoneShown !== currentStreak) {
      showNotification(
        `🎉 ${currentStreak}-Day Reflection Streak! Keep shining your light!`,
        'success'
      );
      setMilestoneShown(currentStreak);
    }
  }, [isMilestone, currentStreak, milestoneShown, showNotification, reflections]);

  const startEdit = (idx: number, entry: Entry) => {
    setEditIndex(idx);
    setEditState({ ...entry, date: entry.date instanceof Date ? entry.date : new Date(entry.date) });
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditState(null);
  };

  const handleEditChange = (field: keyof Entry, value: any) => {
    if (field === 'date') {
      setEditState((prev) => ({ ...prev, date: (typeof value === 'string' && value) ? new Date(value) : undefined }));
    } else {
      setEditState((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    if (editIndex === null || !editState) return;
    setSaving(true);
    try {
      await updateReflection(editState.id!, { ...editState, date: editState.date instanceof Date ? formatDate(editState.date, 'yyyy-MM-dd') : undefined });
      setEditIndex(null);
      setEditState(null);
      showNotification('Reflection updated successfully', 'success');
    } catch (error: any) {
      showNotification('Failed to update reflection: ' + (error?.message || error), 'info');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entryId: string, idx: number) => {
    setDeletingIndex(idx);
    try {
      await deleteReflection(entryId);
      showNotification('Reflection deleted successfully', 'success');
    } catch (error: any) {
      showNotification('Failed to delete reflection: ' + (error?.message || error), 'info');
    } finally {
      setDeletingIndex(null);
    }
  };

  if (loading) {
    return (
      <SoftCard className="animate-fade-in">
        <SectionHeading title="Reflection Log" />
        <div className="text-muted-foreground text-sm p-4 text-center">
          Loading your reflections...
        </div>
      </SoftCard>
    );
  }

  if (!reflections.length) {
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
      <PositiveNotification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        type={notification.type}
        milestone={isMilestone && milestoneShown === currentStreak}
      />
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 text-xs uppercase border-b">
              <th className="py-2 font-medium">Date</th>
              <th className="py-2 font-medium">Mood</th>
              <th className="py-2 font-medium">Tags</th>
              <th className="py-2 font-medium">Highlight</th>
              <th className="py-2 font-medium"></th>
              <th className="py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reflections.map((entry, idx) => (
              <React.Fragment key={idx}>
                {editIndex === idx ? (
                  <tr className="bg-sky-50">
                    <td className="py-2 pr-3 text-sm">
                      <input
                        type="date"
                        className="border rounded px-2 py-1 w-full"
                        value={editState?.date instanceof Date ? formatDate(editState.date, 'yyyy-MM-dd') : ''}
                        onChange={e => handleEditChange('date', e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </td>
                    <td className="py-2 pr-3 text-lg">
                      <select
                        className="border rounded px-2 py-1"
                        value={editState?.mood ?? 3}
                        onChange={e => handleEditChange('mood', Number(e.target.value))}
                      >
                        <option value={1}>😣</option>
                        <option value={2}>😐</option>
                        <option value={3}>🙂</option>
                        <option value={4}>😊</option>
                        <option value={5}>😌</option>
                      </select>
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="text"
                        className="border rounded px-2 py-1 w-full"
                        value={editState?.tags?.join(', ') ?? ''}
                        onChange={e => handleEditChange('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                        placeholder="Comma separated"
                      />
                    </td>
                    <td className="py-2 pr-3 max-w-xs">
                      <input
                        type="text"
                        className="border rounded px-2 py-1 w-full"
                        value={editState?.well ?? ''}
                        onChange={e => handleEditChange('well', e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        className="text-xs text-blue-500 hover:underline flex items-center"
                        onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                        aria-label={expandedIndex === idx ? "Collapse" : "Expand"}
                      >
                        {expandedIndex === idx ? <ArrowUp size={16}/> : <ArrowDown size={16}/>} 
                      </button>
                    </td>
                    <td className="flex gap-2">
                      <Button size="sm" variant="default" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
                    </td>
                  </tr>
                ) : (
                  <tr className="hover:bg-muted transition group">
                    <td className="py-2 pr-3 text-sm">{entry.date instanceof Date ? formatDate(entry.date, "MMM d, yyyy") : ''}</td>
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
                    <td className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(idx, entry)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={async () => {
                        await handleDelete(entry.id, idx);
                      }} disabled={deletingIndex === idx}>{deletingIndex === idx ? 'Deleting...' : 'Delete'}</Button>
                    </td>
                  </tr>
                )}
                {expandedIndex === idx && editIndex !== idx && (
                  <tr>
                    <td colSpan={6} className="bg-muted rounded-lg p-4">
                      <div className="text-sm">
                        <div><strong>Did well:</strong> {entry.well}</div>
                        <div><strong>Fell short:</strong> {entry.short}</div>
                        <div><strong>Try again:</strong> {entry.again}</div>
                      </div>
                    </td>
                  </tr>
                )}
                {editIndex === idx && (
                  <tr>
                    <td colSpan={6} className="bg-muted rounded-lg p-4">
                      <div className="text-sm">
                        <div><strong>Fell short:</strong> <input type="text" className="border rounded px-2 py-1 w-full" value={editState?.short ?? ''} onChange={e => handleEditChange('short', e.target.value)} /></div>
                        <div><strong>Try again:</strong> <input type="text" className="border rounded px-2 py-1 w-full" value={editState?.again ?? ''} onChange={e => handleEditChange('again', e.target.value)} /></div>
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



