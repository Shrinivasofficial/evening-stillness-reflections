import React, { useState, useEffect } from "react";
import SoftCard from "./SoftCard";
import SectionHeading from "./SectionHeading";
import type { MeditationStats as MeditationStatsType } from "../hooks/useMeditationLogs";
import {
  Clock,
  Calendar,
  TrendingUp,
  Target,
  Award,
  Activity,
  Flame,
  Zap,
  Heart,
  Star,
  Moon,
  Sun,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { usePositiveNotification } from "../hooks/usePositiveNotification";
import PositiveNotification from "./PositiveNotification";

type MeditationStatsProps = {
  meditationLogs: any[];
  loading: boolean;
  calculateStats: () => MeditationStatsType;
};

export default function MeditationStats({ meditationLogs, loading, calculateStats }: MeditationStatsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'progress'>('overview');
  const { notification, showNotification, hideNotification } = usePositiveNotification();
  const [milestoneShown, setMilestoneShown] = useState<number | null>(null);
  const MILESTONES = [5, 7, 10, 15, 30];

  // Streak calculation logic
  function getStreakInfo() {
    if (!meditationLogs.length) return { currentStreak: 0, longestStreak: 0 };
    const sortedLogs = [...meditationLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const dates = sortedLogs.map(log => new Date(log.date).toDateString());
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

  const { currentStreak, longestStreak } = getStreakInfo();
  const isMilestone = MILESTONES.includes(currentStreak);

  // Show milestone notification only once per milestone per session
  useEffect(() => {
    if (isMilestone && milestoneShown !== currentStreak) {
      let message = `🎉 ${currentStreak}-Day Meditation Streak! You’re on fire!`;
      if (currentStreak === 5) {
        message = "🌟 5-Day Streak! You’re building a beautiful habit!";
      } else if (currentStreak === 7) {
        message = "✨ 7-Day Streak! One mindful week complete!";
      } else if (currentStreak === 10) {
        message = "🏅 10-Day Streak! Double digits! Your dedication shines.";
      }
      showNotification(
        message,
        'success'
      );
      setMilestoneShown(currentStreak);
    }
  }, [isMilestone, currentStreak, milestoneShown, showNotification]);

  if (loading) {
    return (
      <SoftCard className="animate-fade-in">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Moon className="w-6 h-6 text-sky-600 animate-pulse" />
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading your meditation journey...</p>
          </div>
        </div>
      </SoftCard>
    );
  }

  if (!meditationLogs.length) {
    return (
      <SoftCard className="animate-fade-in">
        <div className="text-center py-12">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Moon className="w-12 h-12 text-sky-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Begin Your Journey</h3>
          <p className="text-gray-600 mb-4">Complete your first meditation session to unlock beautiful insights</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-50 to-blue-50 rounded-full">
            <Play className="w-4 h-4 text-sky-600" />
            <span className="text-sm font-medium text-sky-700">Start meditating above</span>
          </div>
        </div>
      </SoftCard>
    );
  }

  const stats = calculateStats();

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds > 0 ? `${remainingSeconds}s` : ''}`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const formatDurationShort = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  const weeklyProgress = Math.min((stats.sessionsThisWeek / 7) * 100, 100);
  const monthlyProgress = Math.min((stats.sessionsThisMonth / 30) * 100, 100);
  const streakProgress = Math.min((currentStreak / Math.max(longestStreak, 1)) * 100, 100);

  const getAchievementLevel = () => {
    if (stats.totalSessions >= 100) return { level: "Master", icon: "👑", color: "from-purple-500 to-pink-500" };
    if (stats.totalSessions >= 50) return { level: "Advanced", icon: "🌟", color: "from-yellow-500 to-orange-500" };
    if (stats.totalSessions >= 20) return { level: "Intermediate", icon: "⭐", color: "from-blue-500 to-cyan-500" };
    if (stats.totalSessions >= 10) return { level: "Beginner", icon: "🌱", color: "from-green-500 to-emerald-500" };
    return { level: "Newcomer", icon: "🌿", color: "from-gray-400 to-gray-600" };
  };

  const achievement = getAchievementLevel();

  return (
    <SoftCard className="animate-fade-in overflow-hidden">
      <PositiveNotification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        type={notification.type}
        milestone={isMilestone && milestoneShown === currentStreak}
      />
      {/* Header with Achievement Badge */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Meditation Journey</h2>
            <p className="text-gray-600">Your mindfulness statistics</p>
          </div>
          <div className="relative">
            <div className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-full flex items-center justify-center shadow-lg`}>
              <span className="text-2xl">{achievement.icon}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
              <Award className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">{achievement.level}</span>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min((stats.totalSessions / 100) * 100, 100)}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-500">{stats.totalSessions}/100</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'insights', label: 'Insights', icon: TrendingUp },
          { id: 'progress', label: 'Progress', icon: Target }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-xl p-4 border border-sky-200 group-hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <Calendar className="w-6 h-6 text-sky-600" />
                  <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-sky-700">{stats.totalSessions}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-sky-700 mb-1">{stats.totalSessions}</div>
                <div className="text-sm text-sky-600">Total Sessions</div>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200 group-hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <Clock className="w-6 h-6 text-green-600" />
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-green-700">{Math.round(stats.totalDuration / 60)}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-700 mb-1">{formatDurationShort(stats.totalDuration)}</div>
                <div className="text-sm text-green-600">Total Time</div>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-4 border border-purple-200 group-hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-700">{Math.round(stats.averageDuration / 60)}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-700 mb-1">{formatDurationShort(stats.averageDuration)}</div>
                <div className="text-sm text-purple-600">Avg Duration</div>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-4 border border-orange-200 group-hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <Flame className="w-6 h-6 text-orange-600" />
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-700">{currentStreak}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-700 mb-1">{currentStreak}</div>
                <div className="text-sm text-orange-600">Day Streak</div>
              </div>
            </div>
          </div>

          {/* Streak Celebration */}
          {currentStreak > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-orange-800">Amazing Streak!</h3>
                  <p className="text-sm text-orange-700">You've meditated for {currentStreak} consecutive days</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">{currentStreak}</div>
                  <div className="text-xs text-orange-500">days</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          {/* Progress Circles */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="3"
                    strokeDasharray={`${weeklyProgress}, 100`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-sky-600">{Math.round(weeklyProgress)}%</span>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700">This Week</div>
              <div className="text-xs text-gray-500">{stats.sessionsThisWeek}/7 days</div>
            </div>

            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray={`${monthlyProgress}, 100`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-600">{Math.round(monthlyProgress)}%</span>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700">This Month</div>
              <div className="text-xs text-gray-500">{stats.sessionsThisMonth}/30 days</div>
            </div>

            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeDasharray={`${streakProgress}, 100`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-orange-600">{Math.round(streakProgress)}%</span>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700">Streak</div>
              <div className="text-xs text-gray-500">{currentStreak}/{longestStreak} days</div>
            </div>
          </div>

          {/* Smart Insights */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Smart Insights
            </h3>

            <div className="space-y-3">
              {currentStreak > 0 && (
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                  <Flame className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">🔥 {currentStreak}-Day Streak Active!</p>
                    <p className="text-xs text-orange-700">You're building a powerful meditation habit</p>
                  </div>
                </div>
              )}

              {stats.sessionsThisWeek > stats.sessionsThisMonth / 4 && (
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <TrendingUp className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">📈 Above Average Week</p>
                    <p className="text-xs text-green-700">You're meditating more than usual this week</p>
                  </div>
                </div>
              )}

              {stats.averageDuration > 10 * 60 && (
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg border border-blue-200">
                  <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">⏱️ Consistent Duration</p>
                    <p className="text-xs text-blue-700">Your {formatDurationShort(stats.averageDuration)} average shows great consistency</p>
                  </div>
                </div>
              )}

              {stats.totalDuration > 60 * 60 && (
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                  <Heart className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">🎯 Milestone Achieved</p>
                    <p className="text-xs text-purple-700">You've meditated for over an hour total!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          {/* Time Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Time Breakdown
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg border border-sky-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                    <Sun className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">This Week</p>
                    <p className="text-sm text-gray-600">{stats.sessionsThisWeek} sessions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sky-600">{formatDurationShort(stats.totalDurationThisWeek)}</p>
                  <p className="text-xs text-gray-500">total time</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Moon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">This Month</p>
                    <p className="text-sm text-gray-600">{stats.sessionsThisMonth} sessions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{formatDurationShort(stats.totalDurationThisMonth)}</p>
                  <p className="text-xs text-gray-500">total time</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Longest Session</p>
                    <p className="text-sm text-gray-600">Personal best</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">{formatDurationShort(stats.longestSession)}</p>
                  <p className="text-xs text-gray-500">duration</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Shortest Session</p>
                    <p className="text-sm text-gray-600">Quick mindfulness</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">{formatDurationShort(stats.shortestSession)}</p>
                  <p className="text-xs text-gray-500">duration</p>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Progress */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Next Milestone
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sessions to next level</span>
                <span className="text-sm font-medium text-gray-800">{Math.max(0, 100 - stats.totalSessions)} more</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min((stats.totalSessions / 100) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                {stats.totalSessions < 100 ? `Complete ${100 - stats.totalSessions} more sessions to reach Master level` : 'You\'ve reached the highest level!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </SoftCard>
  );
} 