import React, { useState } from "react";
import SoftCard from "./SoftCard";
import { Button } from "./ui/button";
import { useMeditationLogs } from "../hooks/useMeditationLogs";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { supabase } from "@/integrations/supabase/client";

export default function MeditationDebug() {
  const { user, isAuthenticated } = useAuthGuard();
  const { meditationLogs, loading, error, saveMeditationLog, refetch } = useMeditationLogs();
  const [testResult, setTestResult] = useState<string>('');

  const testTableExists = async () => {
    try {
      setTestResult('Testing table existence...');
      const { data, error } = await supabase
        .from('meditation_logs')
        .select('count')
        .limit(1);
      
      if (error) {
        setTestResult(`Error: ${error.message}`);
      } else {
        setTestResult(`Table exists! Found ${data?.length || 0} records`);
      }
    } catch (err) {
      setTestResult(`Exception: ${err}`);
    }
  };

  const testInsert = async () => {
    if (!user) {
      setTestResult('No user logged in');
      return;
    }

    try {
      setTestResult('Testing insert...');
      const testLog = {
        date: new Date().toISOString().split('T')[0],
        duration: 300, // 5 minutes
        music: ['Test Track']
      };

      await saveMeditationLog(testLog);
      setTestResult('Insert successful! Check the logs above.');
      await refetch();
    } catch (err: any) {
      setTestResult(`Insert failed: ${err.message}`);
    }
  };

  const clearTestData = async () => {
    if (!user) {
      setTestResult('No user logged in');
      return;
    }

    try {
      setTestResult('Clearing test data...');
      
      // First, get all logs for the user to find test entries
      const { data: logs, error: fetchError } = await supabase
        .from('meditation_logs')
        .select('id, music')
        .eq('user_id', user.id);
      
      if (fetchError) {
        setTestResult(`Fetch failed: ${fetchError.message}`);
        return;
      }

      // Find test entries (those with 'Test Track' in music array)
      const testLogIds = logs
        ?.filter(log => log.music && log.music.includes('Test Track'))
        .map(log => log.id) || [];

      if (testLogIds.length === 0) {
        setTestResult('No test data found to clear');
        return;
      }

      // Delete the test entries
      const { error: deleteError } = await supabase
        .from('meditation_logs')
        .delete()
        .in('id', testLogIds);
      
      if (deleteError) {
        setTestResult(`Clear failed: ${deleteError.message}`);
      } else {
        setTestResult(`Cleared ${testLogIds.length} test entries!`);
        await refetch();
      }
    } catch (err: any) {
      setTestResult(`Clear failed: ${err.message}`);
    }
  };

  return (
    <SoftCard className="animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Meditation Debug Panel</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Auth Status:</strong> {isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated'}
          </div>
          <div>
            <strong>User ID:</strong> {user?.id || 'None'}
          </div>
          <div>
            <strong>Loading:</strong> {loading ? '✅ Yes' : '❌ No'}
          </div>
          <div>
            <strong>Error:</strong> {error || 'None'}
          </div>
          <div>
            <strong>Logs Count:</strong> {meditationLogs.length}
          </div>
        </div>

        <div className="space-y-2">
          <Button onClick={testTableExists} variant="outline" size="sm">
            Test Table Exists
          </Button>
          <Button onClick={testInsert} variant="outline" size="sm">
            Test Insert
          </Button>
          <Button onClick={clearTestData} variant="outline" size="sm">
            Clear Test Data
          </Button>
          <Button onClick={refetch} variant="outline" size="sm">
            Refresh Logs
          </Button>
        </div>

        {testResult && (
          <div className="p-3 bg-gray-100 rounded text-sm">
            <strong>Test Result:</strong> {testResult}
          </div>
        )}

        {meditationLogs.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Current Logs:</h4>
            <div className="space-y-1 text-xs">
              {meditationLogs.slice(0, 5).map((log, idx) => (
                <div key={log.id} className="p-2 bg-gray-50 rounded">
                  {idx + 1}. {log.date} - {log.duration}s - {log.music?.join(', ') || 'No music'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SoftCard>
  );
} 