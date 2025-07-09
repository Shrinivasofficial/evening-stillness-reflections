import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthGuard } from "./useAuthGuard";
import { format } from "date-fns";
import { Database } from "@/integrations/supabase/types";

type MeditationLog = Database["public"]["Tables"]["meditation_logs"]["Row"];

type InsertMeditationLog = Omit<MeditationLog, "id" | "created_at" | "updated_at" | "user_id"> & { date: string | Date };

export interface MeditationStats {
  totalSessions: number;
  totalDuration: number;
  averageDuration: number;
  longestSession: number;
  shortestSession: number;
  sessionsThisWeek: number;
  sessionsThisMonth: number;
  totalDurationThisWeek: number;
  totalDurationThisMonth: number;
}

export type { MeditationLog };
export function useMeditationLogs() {
  const [meditationLogs, setMeditationLogs] = useState<MeditationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthGuard();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchMeditationLogs();
    } else {
      setMeditationLogs([]);
      setLoading(false);
      setError(null);
    }
  }, [user, isAuthenticated]);

  const fetchMeditationLogs = async () => {
    if (!user || !isAuthenticated) {
      setMeditationLogs([]);
      setLoading(false);
      setError(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from("meditation_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });
        
      if (error) {
        console.error('Error fetching meditation logs:', error);
        setError(error.message);
        setMeditationLogs([]);
      } else {
        setMeditationLogs(data || []);
      }
    } catch (err) {
      console.error('Unexpected error fetching meditation logs:', err);
      setError('Failed to load meditation logs');
      setMeditationLogs([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save a meditation log and refresh the logs list after successful insert.
   */
  const saveMeditationLog = async (log: InsertMeditationLog) => {
    if (!user || !isAuthenticated) {
      throw new Error("Not authenticated");
    }
    
    let dateString: string;
    if (Object.prototype.toString.call(log.date) === '[object Date]' && !isNaN(log.date as any)) {
      dateString = format(log.date as Date, "yyyy-MM-dd");
    } else {
      dateString = typeof log.date === 'string' ? log.date : format(new Date(), "yyyy-MM-dd");
    }
    
    const insertData = {
      user_id: user.id,
      date: dateString,
      duration: log.duration,
      music: log.music || [],
    };
    
    try {
      const { data, error } = await supabase
        .from("meditation_logs")
        .insert([insertData])
        .select();
        
      if (error) {
        console.error('Error saving meditation log:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        // Instead of just updating local state, refetch to ensure all consumers are up to date
        await fetchMeditationLogs();
        return data[0];
      } else {
        throw new Error('No data returned from insert');
      }
    } catch (err) {
      console.error('Failed to save meditation log:', err);
      throw err;
    }
  };

  const deleteMeditationLog = async (id: string) => {
    if (!user || !isAuthenticated) throw new Error("Not authenticated");
    
    try {
      const { error } = await supabase
        .from("meditation_logs")
        .delete()
        .eq("id", id);
        
      if (error) {
        console.error('Error deleting meditation log:', error);
        throw error;
      }
      
      setMeditationLogs(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Failed to delete meditation log:', err);
      throw err;
    }
  };

  const calculateStats = (): MeditationStats => {
    if (!meditationLogs.length) {
      return {
        totalSessions: 0,
        totalDuration: 0,
        averageDuration: 0,
        longestSession: 0,
        shortestSession: 0,
        sessionsThisWeek: 0,
        sessionsThisMonth: 0,
        totalDurationThisWeek: 0,
        totalDurationThisMonth: 0,
      };
    }

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalDuration = meditationLogs.reduce((sum, log) => sum + log.duration, 0);
    const durations = meditationLogs.map(log => log.duration);
    
    const sessionsThisWeek = meditationLogs.filter(log => 
      new Date(log.date) >= oneWeekAgo
    ).length;
    
    const sessionsThisMonth = meditationLogs.filter(log => 
      new Date(log.date) >= oneMonthAgo
    ).length;
    
    const totalDurationThisWeek = meditationLogs
      .filter(log => new Date(log.date) >= oneWeekAgo)
      .reduce((sum, log) => sum + log.duration, 0);
      
    const totalDurationThisMonth = meditationLogs
      .filter(log => new Date(log.date) >= oneMonthAgo)
      .reduce((sum, log) => sum + log.duration, 0);

    return {
      totalSessions: meditationLogs.length,
      totalDuration,
      averageDuration: Math.round(totalDuration / meditationLogs.length),
      longestSession: Math.max(...durations),
      shortestSession: Math.min(...durations),
      sessionsThisWeek,
      sessionsThisMonth,
      totalDurationThisWeek,
      totalDurationThisMonth,
    };
  };

  const getLogsByDateRange = (startDate: Date, endDate: Date) => {
    return meditationLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= startDate && logDate <= endDate;
    });
  };

  const getRecentLogs = (count: number = 5) => {
    return meditationLogs.slice(0, count);
  };

  return {
    meditationLogs,
    loading,
    error,
    saveMeditationLog,
    deleteMeditationLog,
    refetch: fetchMeditationLogs,
    calculateStats,
    getLogsByDateRange,
    getRecentLogs,
    isAuthenticated,
    user: isAuthenticated ? user : null,
  };
} 