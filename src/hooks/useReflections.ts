
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      console.log('Initial user check:', data?.user?.email || 'No user');
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      console.log('Auth state changed:', session?.user?.email || 'No user');
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchReflections();
    } else {
      setReflections([]);
      setLoading(false);
    }
  }, [user]);

  const fetchReflections = async () => {
    try {
      setLoading(true);
      console.log('Fetching reflections for user:', user?.email);
      
      const { data, error } = await supabase
        .from('reflections')
        .select('*')
        .eq('user_id', user?.id)
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
    if (!user) {
      console.error('No user found when trying to save reflection');
      throw new Error('You must be logged in to save reflections');
    }

    try {
      console.log('Saving reflection for user:', user.email);
      console.log('Input reflection data:', reflection);
      console.log('Reflection date:', reflection.date);
      console.log('Date type:', typeof reflection.date);

      // Ensure date is properly formatted
      const dateString = reflection.date instanceof Date 
        ? reflection.date.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

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

  return {
    reflections,
    loading,
    saveReflection,
    user,
    refetch: fetchReflections
  };
}
