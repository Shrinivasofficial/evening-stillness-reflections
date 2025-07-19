import React from "react";
import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";
import { BookOpen, BarChart3, Calendar, Music, Users, Globe } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: BookOpen,
      title: "Daily Reflections",
      description: "Capture your thoughts and insights in a peaceful space. Join 1,200+ visitors who have found clarity through daily reflection.",
      stats: "1,200+ active visits",
      color: "from-sky-400 to-blue-500"
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Visualize your mindfulness journey with detailed insights. Track your streaks and celebrate your growth.",
      stats: "15 days longest streak",
      color: "from-sky-400 to-blue-500"
    },
    {
      icon: Calendar,
      title: "Habit Building",
      description: "Build consistent mindfulness habits that last. Create routines that support your mental well-being.",
      stats: "12 countries reached",
      color: "from-sky-400 to-blue-500"
    },
    {
      icon: Music,
      title: "Guided Meditation",
      description: "Access peaceful meditation sessions designed for evening relaxation and mental clarity.",
      stats: "300+ minutes meditated",
      color: "from-sky-400 to-blue-500"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with like-minded individuals from around the world who share your mindfulness journey.",
      stats: "Global community",
      color: "from-sky-400 to-blue-500"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Available to visitors across 12 countries, bringing mindfulness practices to diverse cultures worldwide.",
      stats: "12 countries served",
      color: "from-sky-400 to-blue-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container max-w-6xl mx-auto px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-light text-slate-800 mb-4">
            Everything You Need for Mindful Living
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover tools and features designed to support your mindfulness journey, 
            trusted by visitors from 12 countries worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-8 border border-sky-200/50">
            <h3 className="text-2xl font-light text-slate-800 mb-4">
              Join Our Growing Community
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Be part of a global movement towards mindfulness and self-reflection. 
              Start your journey today and connect with 1,200+ like-minded individuals.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
              <span className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>1,200+ Active Visits</span>
              </span>
              <span className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>12 Countries</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>15 Days Max Streak</span>
              </span>
              <span className="flex items-center space-x-1">
                <Music className="w-4 h-4" />
                <span>300+ Minutes Meditated</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 