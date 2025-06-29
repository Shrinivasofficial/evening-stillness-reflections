import React, { useState, useEffect } from "react";
import SoftCard from "./SoftCard";
import SectionHeading from "./SectionHeading";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useMeditationLogs } from "../hooks/useMeditationLogs";
import { usePositiveNotification } from "../hooks/usePositiveNotification";
import { Target, Trophy, Calendar, Clock, CheckCircle, Circle } from "lucide-react";

interface MeditationGoal {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number; // minutes
  current: number;
  period: string; // date string for the period
  completed: boolean;
}

export default function MeditationGoals() {
  const { meditationLogs, calculateStats } = useMeditationLogs();
  const [goals, setGoals] = useState<MeditationGoal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<{ type: 'daily' | 'weekly' | 'monthly'; target: number }>({ type: 'daily', target: 10 });
  const { showNotification } = usePositiveNotification();

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('meditation-goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Save goals to localStorage
  useEffect(() => {
    localStorage.setItem('meditation-goals', JSON.stringify(goals));
  }, [goals]);

  // Update goal progress based on meditation logs
  useEffect(() => {
    if (!meditationLogs.length) return;

    const updatedGoals = goals.map(goal => {
      const now = new Date();
      let periodStart: Date;
      let periodEnd: Date;

      switch (goal.type) {
        case 'daily':
          periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          periodEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          break;
        case 'weekly':
          const dayOfWeek = now.getDay();
          const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysToMonday);
          periodEnd = new Date(periodStart.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
          periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          break;
      }

      const relevantLogs = meditationLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= periodStart && logDate < periodEnd;
      });

      const totalMinutes = relevantLogs.reduce((sum, log) => sum + Math.round(log.duration / 60), 0);
      const completed = totalMinutes >= goal.target;

      return {
        ...goal,
        current: totalMinutes,
        period: periodStart.toISOString().split('T')[0],
        completed
      };
    });

    setGoals(updatedGoals);
  }, [meditationLogs, goals.length]);

  const addGoal = () => {
    if (newGoal.target <= 0) {
      showNotification('Please enter a valid target time', 'info');
      return;
    }

    const goal: MeditationGoal = {
      id: Date.now().toString(),
      type: newGoal.type,
      target: newGoal.target,
      current: 0,
      period: new Date().toISOString().split('T')[0],
      completed: false
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({ type: 'daily', target: 10 });
    setShowAddGoal(false);
    showNotification('Goal added successfully!', 'success');
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
    showNotification('Goal deleted', 'success');
  };

  const getProgressPercentage = (goal: MeditationGoal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getPeriodLabel = (goal: MeditationGoal) => {
    const date = new Date(goal.period);
    switch (goal.type) {
      case 'daily':
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      case 'weekly':
        return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      case 'monthly':
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  return (
    <SoftCard className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <SectionHeading title="Meditation Goals" />
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="flex items-center gap-2"
        >
          <Target className="w-4 h-4" />
          Add Goal
        </Button>
      </div>

      {showAddGoal && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="goal-type">Goal Type</Label>
              <select
                id="goal-type"
                value={newGoal.type}
                onChange={(e) => setNewGoal(prev => ({ ...prev, type: e.target.value as 'daily' | 'weekly' | 'monthly' }))}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <Label htmlFor="goal-target">Target (minutes)</Label>
              <Input
                id="goal-target"
                type="number"
                min="1"
                value={newGoal.target}
                onChange={(e) => setNewGoal(prev => ({ ...prev, target: parseInt(e.target.value) || 0 }))}
                className="mt-1"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={addGoal} className="flex-1">
                Add Goal
              </Button>
              <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No goals set yet</p>
          <p className="text-sm">Set meditation goals to track your progress and stay motivated!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map(goal => (
            <div
              key={goal.id}
              className={`p-4 rounded-lg border transition-all ${
                goal.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {goal.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-800 capitalize">
                      {goal.type} Goal: {goal.target} minutes
                    </h3>
                    <p className="text-sm text-gray-600">{getPeriodLabel(goal)}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteGoal(goal.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  ×
                </Button>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{goal.current} / {goal.target} minutes</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      goal.completed ? 'bg-green-500' : 'bg-sky-500'
                    }`}
                    style={{ width: `${getProgressPercentage(goal)}%` }}
                  />
                </div>
              </div>

              {goal.completed && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <Trophy className="w-4 h-4" />
                  <span>Goal completed! 🎉</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {goals.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium text-gray-800 mb-3">Goal Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-sky-600">{goals.length}</div>
              <div className="text-xs text-gray-600">Total Goals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {goals.filter(g => g.completed).length}
              </div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {goals.filter(g => !g.completed).length}
              </div>
              <div className="text-xs text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((goals.filter(g => g.completed).length / goals.length) * 100)}%
              </div>
              <div className="text-xs text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      )}
    </SoftCard>
  );
} 