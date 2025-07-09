import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthGuard } from "./useAuthGuard";
import { format } from 'date-fns';

export type Reflection = {
  id: string;
  date: Date;
  mood: number;
  well: string;
  short: string;
  again: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export function useReflections() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuthGuard();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchReflections();
    } else {
      setReflections([]);
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const fetchReflections = async () => {
    if (!user || !isAuthenticated) {
      console.log('No authenticated user, skipping fetch');
      setReflections([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching reflections for verified user:', user.email);
      
      const { data, error } = await supabase
        .from('reflections')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching reflections:', error);
        throw error;
      }

      console.log('Raw data from Supabase:', data);
      console.log('Fetched reflections:', data?.length || 0, 'items');

      const transformedData: Reflection[] = (data || []).map(item => ({
        ...item,
        date: new Date(item.date),
        tags: item.tags || []
      }));

      console.log('Transformed reflections:', transformedData);
      setReflections(transformedData);
    } catch (error) {
      console.error('Error fetching reflections:', error);
      setReflections([]);
    } finally {
      setLoading(false);
    }
  };

  const saveReflection = async (reflection: Omit<Reflection, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user || !isAuthenticated) {
      console.error('No authenticated user when trying to save reflection');
      throw new Error('You must be logged in with a verified email to save reflections');
    }

    try {
      console.log('=== SAVE REFLECTION START ===');
      console.log('Saving reflection for verified user:', user.email);
      console.log('Input reflection data:', reflection);

      // Ensure date is properly formatted as YYYY-MM-DD
      const dateString = reflection.date instanceof Date
        ? format(reflection.date, 'yyyy-MM-dd')
        : typeof reflection.date === 'string' 
          ? reflection.date 
          : format(new Date(), 'yyyy-MM-dd');

      console.log('Formatted date string:', dateString);

      const reflectionData = {
        user_id: user.id,
        date: dateString,
        mood: reflection.mood,
        well: reflection.well.trim(),
        short: reflection.short.trim(),
        again: reflection.again.trim(),
        tags: reflection.tags || []
      };

      console.log('Formatted reflection data for Supabase:', reflectionData);

      // Use upsert to ensure only one reflection per day
      const { data, error } = await supabase
        .from('reflections')
        .upsert(reflectionData, {
          onConflict: 'user_id,date'
        })
        .select();

      console.log('Upsert result:', { data, error });

      if (error) {
        console.error('Supabase error saving reflection:', error);
        throw error;
      }
      
      console.log('Reflection saved successfully:', data);
      console.log('=== SAVE REFLECTION END ===');
      
      // Update local state instead of refetching to avoid race conditions
      if (data && data.length > 0) {
        const savedReflection = data[0];
        setReflections(prev => {
          // Remove any existing reflection for the same date
          const filtered = prev.filter(r => {
            const rDate = r.date instanceof Date ? format(r.date, 'yyyy-MM-dd') : r.date;
            return rDate !== dateString;
          });
          // Add the new/updated reflection at the beginning, ensure date is a Date object
          return [{
            ...savedReflection,
            date: new Date(savedReflection.date),
            tags: savedReflection.tags || []
          }, ...filtered];
        });
        return {
          ...savedReflection,
          date: new Date(savedReflection.date),
          tags: savedReflection.tags || []
        };
      }
      return null;
    } catch (error) {
      console.error('Error saving reflection:', error);
      throw error;
    }
  };

  const updateReflection = async (
    id: string,
    updates: Partial<Omit<Reflection, 'id' | 'created_at' | 'updated_at' | 'date'> & { date?: string }>
  ) => {
    if (!user || !isAuthenticated) {
      throw new Error('You must be logged in with a verified email to update reflections');
    }
    try {
      const { data, error } = await supabase
        .from('reflections')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        setReflections((prev) => prev.map(r => r.id === id ? { ...r, ...updates, date: updates.date ? new Date(updates.date) : r.date, updated_at: new Date().toISOString() } : r));
      }
      return id;
    } catch (error) {
      console.error('Error updating reflection:', error);
      throw error;
    }
  };

  const deleteReflection = async (id: string) => {
    if (!user || !isAuthenticated) {
      throw new Error('You must be logged in with a verified email to delete reflections');
    }
    try {
      const { error } = await supabase
        .from('reflections')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setReflections((prev) => prev.filter(r => r.id !== id));
      return id;
    } catch (error) {
      console.error('Error deleting reflection:', error);
      throw error;
    }
  };

  return {
    reflections,
    loading,
    saveReflection,
    updateReflection,
    deleteReflection,
    user: isAuthenticated ? user : null,
    refetch: fetchReflections,
    isAuthenticated
  };
}

// Utility to calculate current and longest streaks for reflections
type StreakInfo = { currentStreak: number; longestStreak: number };

export function getReflectionStreakInfo(reflections: Reflection[]): StreakInfo {
  if (!reflections.length) return { currentStreak: 0, longestStreak: 0 };
  const sorted = [...reflections].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const dates = sorted.map(r => new Date(r.date).toDateString());
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = new Date();
  let currentDate = new Date(today);
  // Calculate current streak
  for (let i = 0; i < 365; i++) {
    const dateStr = currentDate.toDateString();
    if (dates.includes(dateStr)) {
      currentStreak++;
      tempStreak++;
    } else {
      break;
    }
    currentDate.setDate(currentDate.getDate() - 1);
  }
  // Calculate longest streak
  tempStreak = 0;
  for (let i = 0; i < dates.length; i++) {
    const currentDate = new Date(dates[i]);
    const nextDate = i < dates.length - 1 ? new Date(dates[i + 1]) : null;
    if (nextDate) {
      const diffTime = currentDate.getTime() - nextDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak + 1);
        tempStreak = 0;
      }
    } else {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    }
  }
  return { currentStreak, longestStreak };
}
