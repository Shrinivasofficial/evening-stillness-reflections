import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  BarChart3, 
  Calendar, 
  Music,
  X,
  Plus,
  CheckCircle,
  TrendingUp,
  Play
} from "lucide-react";

interface Tab {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  content: React.ReactNode;
  color: string;
}

export default function AnimatedTabs() {
  const [activeTab, setActiveTab] = useState("reflections");

  const tabs: Tab[] = [
    {
      id: "reflections",
      title: "Daily Reflections",
      icon: BookOpen,
      description: "Capture your thoughts and insights",
      color: "from-sky-400 to-blue-500",
      content: (
        <div className="space-y-4">
          {/* Tablet Mockup */}
          <div className="relative mx-auto max-w-md">
            {/* Tablet Frame */}
            <div className="relative bg-slate-800 rounded-3xl p-2 shadow-2xl">
              <div className="bg-white rounded-2xl overflow-hidden">
                {/* App Header */}
                <div className="bg-gradient-to-r from-sky-400 to-blue-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold text-lg">Today's Reflection</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* App Content */}
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-sky-400 rounded-full"></div>
                      <span className="text-slate-700 font-medium">How are you feeling today?</span>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <p className="text-slate-700 italic text-sm">"Today I felt grateful for the small moments of peace and the gentle reminder to slow down..."</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-sky-400 rounded-full"></div>
                      <span className="text-slate-700 font-medium">What went well?</span>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <p className="text-slate-700 italic text-sm">"I managed to stay present during my morning walk and noticed the beauty of the sunrise..."</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button className="bg-gradient-to-r from-sky-400 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Save Reflection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "insights",
      title: "Progress Insights",
      icon: BarChart3,
      description: "Visualize your growth journey",
      color: "from-sky-400 to-blue-500",
      content: (
        <div className="space-y-4">
          {/* Tablet Mockup */}
          <div className="relative mx-auto max-w-md">
            <div className="relative bg-slate-800 rounded-3xl p-2 shadow-2xl">
              <div className="bg-white rounded-2xl overflow-hidden">
                {/* App Header */}
                <div className="bg-gradient-to-r from-sky-400 to-blue-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold text-lg">Weekly Overview</h3>
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                {/* App Content */}
                <div className="p-6 space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center bg-sky-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-sky-600">7</div>
                      <div className="text-xs text-slate-600">Days Streak</div>
                    </div>
                    <div className="text-center bg-sky-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-sky-600">85%</div>
                      <div className="text-xs text-slate-600">Completion</div>
                    </div>
                    <div className="text-center bg-sky-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-sky-600">4.2</div>
                      <div className="text-xs text-slate-600">Avg Mood</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-700">Weekly Goal</span>
                      <span className="text-sky-600 font-medium">5/7 days</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-sky-400 to-blue-500 h-2 rounded-full" style={{ width: '71%' }}></div>
                    </div>
                  </div>
                  
                  {/* Recent Activity */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-800">Recent Activity</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-sky-400" />
                        <span className="text-slate-600">Completed reflection</span>
                        <span className="text-slate-400 text-xs">2h ago</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-sky-400" />
                        <span className="text-slate-600">Meditation session</span>
                        <span className="text-slate-400 text-xs">1d ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "habits",
      title: "Habit Tracking",
      icon: Calendar,
      description: "Build consistent mindfulness habits",
      color: "from-sky-400 to-blue-500",
      content: (
        <div className="space-y-4">
          {/* Tablet Mockup */}
          <div className="relative mx-auto max-w-md">
            <div className="relative bg-slate-800 rounded-3xl p-2 shadow-2xl">
              <div className="bg-white rounded-2xl overflow-hidden">
                {/* App Header */}
                <div className="bg-gradient-to-r from-sky-400 to-blue-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold text-lg">Habit Tracker</h3>
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                {/* App Content */}
                <div className="p-6 space-y-6">
                  {/* Current Streaks */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-800">Current Streaks</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
                        <div>
                          <span className="text-slate-700 font-medium">Evening Reflection</span>
                          <p className="text-xs text-slate-500">5 day streak</p>
                        </div>
                        <div className="flex space-x-1">
                          {[...Array(7)].map((_, i) => (
                            <div key={i} className={`w-3 h-3 rounded-full ${i < 5 ? 'bg-sky-400' : 'bg-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
                        <div>
                          <span className="text-slate-700 font-medium">Morning Gratitude</span>
                          <p className="text-xs text-slate-500">3 day streak</p>
                        </div>
                        <div className="flex space-x-1">
                          {[...Array(7)].map((_, i) => (
                            <div key={i} className={`w-3 h-3 rounded-full ${i < 3 ? 'bg-sky-400' : 'bg-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Today's Tasks */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-800">Today's Tasks</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 p-2">
                        <CheckCircle className="w-4 h-4 text-sky-400" />
                        <span className="text-sm text-slate-600">Evening reflection</span>
                      </div>
                      <div className="flex items-center space-x-3 p-2">
                        <div className="w-4 h-4 border-2 border-slate-300 rounded-full"></div>
                        <span className="text-sm text-slate-600">Morning gratitude</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "meditation",
      title: "Guided Sessions",
      icon: Music,
      description: "Peaceful meditation experiences",
      color: "from-sky-400 to-blue-500",
      content: (
        <div className="space-y-4">
          {/* Tablet Mockup */}
          <div className="relative mx-auto max-w-md">
            <div className="relative bg-slate-800 rounded-3xl p-2 shadow-2xl">
              <div className="bg-white rounded-2xl overflow-hidden">
                {/* App Header */}
                <div className="bg-gradient-to-r from-sky-400 to-blue-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold text-lg">Meditation</h3>
                    <Music className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                {/* App Content */}
                <div className="p-6 space-y-6">
                  {/* Featured Session */}
                  <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg p-4 border border-sky-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-slate-800">Evening Wind Down</h4>
                      <span className="text-xs text-slate-500">10 min</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">Gentle breathing and relaxation techniques to help you unwind</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-slate-600">Ready to start</span>
                      </div>
                      <button className="bg-gradient-to-r from-sky-400 to-blue-500 text-white p-2 rounded-full">
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Session List */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-800">Available Sessions</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-slate-700">Morning Calm</span>
                          <p className="text-xs text-slate-500">5 minutes</p>
                        </div>
                        <Play className="w-4 h-4 text-sky-400" />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-slate-700">Stress Relief</span>
                          <p className="text-xs text-slate-500">15 minutes</p>
                        </div>
                        <Play className="w-4 h-4 text-sky-400" />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-slate-700">Deep Sleep</span>
                          <p className="text-xs text-slate-500">20 minutes</p>
                        </div>
                        <Play className="w-4 h-4 text-sky-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'text-white shadow-lg'
                : 'text-slate-600 hover:text-slate-800 bg-white/60 hover:bg-white/80'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {activeTab === tab.id && (
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-full`}
                layoutId="activeTab"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center space-x-2">
              <tab.icon className="w-4 h-4" />
              <span>{tab.title}</span>
            </span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="relative min-h-[450px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {tabs.find(tab => tab.id === activeTab)?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 