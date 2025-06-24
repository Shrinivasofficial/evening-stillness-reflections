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
      console.log('Saving reflection for verified user:', user.email);
      console.log('Input reflection data:', reflection);
      console.log('Reflection date:', reflection.date);
      console.log('Date type:', typeof reflection.date);

      // Ensure date is properly formatted
      const dateString = reflection.date instanceof Date
        ? format(reflection.date, 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd');

      const reflectionData = {
        user_id: user.id,
        date: dateString,
        mood: reflection.mood,
        well: reflection.well,
        short: reflection.short,
        again: reflection.again,
        tags: reflection.tags || []
      };

      console.log('Formatted reflection data for Supabase:', reflectionData);

      const { data, error } = await supabase
        .from('reflections')
        .upsert(reflectionData, {
          onConflict: 'user_id,date'
        })
        .select();

      if (error) {
        console.error('Supabase error saving reflection:', error);
        throw error;
      }
      
      console.log('Reflection saved successfully:', data);
      await fetchReflections(); // Refresh the list
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
