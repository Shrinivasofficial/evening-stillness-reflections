import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import CTAButton from "./CTAButton";
import { 
  BookOpen, 
  BarChart3, 
  Calendar, 
  Music,
  CheckCircle,
  TrendingUp,
  Play,
  Plus
} from "lucide-react";

interface ParallaxHeroProps {
  onGetStarted: () => void;
}

interface MockupSlide {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  status: string;
  content: React.ReactNode;
}

export default function ParallaxHero({ onGetStarted }: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: MockupSlide[] = [
    {
      id: "reflections",
      title: "Daily Reflections",
      icon: BookOpen,
      description: "Capture your thoughts and insights",
      status: "Journal your daily experiences",
      content: (
        <div className="relative bg-slate-800 rounded-3xl p-2 shadow-2xl w-80 h-96">
          <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col">
            <div className="bg-gradient-to-r from-sky-400 to-blue-500 px-4 py-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-base">Today's Reflection</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-1 flex-shrink-0"></div>
                  <span className="text-slate-700 font-medium text-sm">How are you feeling today?</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 ml-4">
                  <p className="text-slate-700 italic text-xs leading-relaxed">"Today I felt grateful for the small moments of peace and the gentle reminder to slow down..."</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-1 flex-shrink-0"></div>
                  <span className="text-slate-700 font-medium text-sm">What went well?</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 ml-4">
                  <p className="text-slate-700 italic text-xs leading-relaxed">"I managed to stay present during my morning walk and noticed the beauty of the sunrise..."</p>
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <button className="bg-gradient-to-r from-sky-400 to-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                  Save Reflection
                </button>
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
      status: "Track your mindfulness progress",
      content: (
        <div className="relative bg-slate-800 rounded-3xl p-2 shadow-2xl w-80 h-96">
          <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col">
            <div className="bg-gradient-to-r from-sky-400 to-blue-500 px-4 py-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-base">Weekly Overview</h3>
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center bg-sky-50 rounded-lg p-3">
                  <div className="text-xl font-bold text-sky-600">7</div>
                  <div className="text-xs text-slate-600">Days Streak</div>
                </div>
                <div className="text-center bg-sky-50 rounded-lg p-3">
                  <div className="text-xl font-bold text-sky-600">85%</div>
                  <div className="text-xs text-slate-600">Completion</div>
                </div>
                <div className="text-center bg-sky-50 rounded-lg p-3">
                  <div className="text-xl font-bold text-sky-600">4.2</div>
                  <div className="text-xs text-slate-600">Avg Mood</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 text-xs font-medium">Weekly Goal</span>
                  <span className="text-sky-600 font-medium text-xs">5/7 days</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-sky-400 to-blue-500 h-1.5 rounded-full" style={{ width: '71%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-slate-800 text-sm">Recent Activity</h4>
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs">
                    <CheckCircle className="w-3 h-3 text-sky-400 flex-shrink-0" />
                    <span className="text-slate-600">Completed reflection</span>
                    <span className="text-slate-400 text-xs ml-auto">2h ago</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <CheckCircle className="w-3 h-3 text-sky-400 flex-shrink-0" />
                    <span className="text-slate-600">Meditation session</span>
                    <span className="text-slate-400 text-xs ml-auto">1d ago</span>
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
      status: "Build lasting mindfulness habits",
      content: (
        <div className="relative bg-slate-800 rounded-3xl p-2 shadow-2xl w-80 h-96">
          <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col">
            <div className="bg-gradient-to-r from-sky-400 to-blue-500 px-4 py-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-base">Habit Tracker</h3>
                <Plus className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
                  <div className="flex-1">
                    <span className="text-slate-700 font-medium text-sm">Evening Reflection</span>
                    <p className="text-xs text-slate-500">5 day streak</p>
                  </div>
                  <div className="flex space-x-0.5 ml-2">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i < 5 ? 'bg-sky-400' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
                  <div className="flex-1">
                    <span className="text-slate-700 font-medium text-sm">Morning Gratitude</span>
                    <p className="text-xs text-slate-500">3 day streak</p>
                  </div>
                  <div className="flex space-x-0.5 ml-2">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i < 3 ? 'bg-sky-400' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-slate-800 text-sm">Today's Tasks</h4>
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 p-2">
                    <CheckCircle className="w-3 h-3 text-sky-400 flex-shrink-0" />
                    <span className="text-slate-600 text-xs">Evening reflection</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2">
                    <div className="w-3 h-3 border-2 border-slate-300 rounded-full flex-shrink-0"></div>
                    <span className="text-slate-600 text-xs">Morning gratitude</span>
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
      status: "Find peace through guided meditation",
      content: (
        <div className="relative bg-slate-800 rounded-3xl p-2 shadow-2xl w-80 h-96">
          <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col">
            <div className="bg-gradient-to-r from-sky-400 to-blue-500 px-4 py-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-base">Meditation</h3>
                <Music className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg p-3 border border-sky-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-800 text-sm">Evening Wind Down</h4>
                  <span className="text-xs text-slate-500">10 min</span>
                </div>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">Gentle breathing and relaxation techniques to help you unwind</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-slate-600">Ready to start</span>
                  </div>
                  <button className="bg-gradient-to-r from-sky-400 to-blue-500 text-white p-1.5 rounded-full">
                    <Play className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-slate-800 text-sm">Available Sessions</h4>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-700">Morning Calm</span>
                      <p className="text-xs text-slate-500">5 minutes</p>
                    </div>
                    <Play className="w-3 h-3 text-sky-400 flex-shrink-0" />
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-700">Stress Relief</span>
                      <p className="text-xs text-slate-500">15 minutes</p>
                    </div>
                    <Play className="w-3 h-3 text-sky-400 flex-shrink-0" />
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-700">Deep Sleep</span>
                      <p className="text-xs text-slate-500">20 minutes</p>
                    </div>
                    <Play className="w-3 h-3 text-sky-400 flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Background with parallax effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-slate-50 via-sky-50/30 to-blue-50/20"
      />
      
      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-sky-200/20 to-blue-300/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-blue-200/30 to-sky-300/30 rounded-full blur-2xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content - Centered Text */}
            <motion.div 
              className="text-center lg:text-left space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-light text-slate-800 leading-tight tracking-tight" 
                style={{ fontFamily: "'Crimson Text', serif" }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                A Space for Your
                <br />
                <span className="text-gradient">Mind, Body & Soul</span>
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-slate-600 leading-relaxed font-light max-w-2xl mx-auto lg:mx-0" 
                style={{ fontFamily: "'Inter', sans-serif" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Join 1,200+ visitors from 12 countries who have discovered the power of 
                evening reflection and mindfulness practice. Experience guided meditation 
                and peaceful moments designed for inner clarity.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <CTAButton onClick={onGetStarted} size="lg">
                  Start Your Journey
                </CTAButton>
              </motion.div>
            </motion.div>

            {/* Right Content - Tablet Mockup Carousel */}
            <motion.div 
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative w-80 h-96">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    {slides[currentSlide].content}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Status Indicators */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="flex flex-wrap justify-center gap-8">
              {slides.map((slide, index) => (
                <motion.div
                  key={slide.id}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === index 
                      ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-lg' 
                      : 'bg-white/60 text-slate-600 hover:bg-white/80'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setCurrentSlide(index)}
                >
                  <slide.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{slide.status}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </motion.div>
    </div>
  );
} 