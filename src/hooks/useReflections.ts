
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
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
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
      const { data, error } = await supabase
        .from('reflections')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      const transformedData: Reflection[] = data.map(item => ({
        ...item,
        date: new Date(item.date),
        tags: item.tags || []
      }));

      setReflections(transformedData);
    } catch (error) {
      console.error('Error fetching reflections:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveReflection = async (reflection: Omit<Reflection, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('reflections')
        .upsert({
          user_id: user.id,
          date: reflection.date.toISOString().split('T')[0],
          mood: reflection.mood,
          well: reflection.well,
          short: reflection.short,
          again: reflection.again,
          tags: reflection.tags
        });

      if (error) throw error;
      
      await fetchReflections();
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
