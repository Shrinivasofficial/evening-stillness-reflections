import React from "react";
import { motion } from "framer-motion";
import { Users, Globe, Calendar, Clock } from "lucide-react";

interface StatCardProps {
  icon: React.ComponentType<any>;
  value: string;
  label: string;
  description?: string;
}

function StatCard({ icon: Icon, value, label, description }: StatCardProps) {
  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-500 group h-full"
      whileHover={{ scale: 1.03, y: -5 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col h-full">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        {/* Value */}
        <div className="text-3xl md:text-4xl font-bold text-slate-800 mb-3 group-hover:text-sky-700 transition-colors duration-300">
          {value}
        </div>
        
        {/* Label */}
        <div className="text-lg font-semibold text-slate-700 mb-4 group-hover:text-sky-600 transition-colors duration-300">
          {label}
        </div>
        
        {/* Description */}
        {description && (
          <div className="text-slate-600 leading-relaxed text-sm flex-1">
            {description}
          </div>
        )}
        
        {/* Decorative element */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-sky-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "1,200+",
      label: "Active Visits",
      description: "Growing community of mindful individuals discovering inner peace"
    },
    {
      icon: Globe,
      value: "12",
      label: "Countries",
      description: "Global reach spanning diverse cultures and continents"
    },
    {
      icon: Calendar,
      value: "15 Days",
      label: "Longest Streak",
      description: "Consistent daily practice building lasting mindfulness habits"
    },
    {
      icon: Clock,
      value: "300+",
      label: "Minutes Meditated",
      description: "Collective mindfulness time fostering inner tranquility"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-sky-50/40 to-blue-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-sky-200/20 to-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-blue-200/30 to-sky-300/30 rounded-full blur-2xl" />
      
      <div className="container max-w-7xl mx-auto px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-slate-800 mb-6 leading-tight">
            Trusted by Mindful Souls
            <br />
            <span className="text-gradient bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Worldwide
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Join a growing community of individuals who have discovered the power of 
            evening reflection and mindfulness practice.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-slate-200/50">
            <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
            <span className="text-slate-600 font-medium text-sm">Stats updated in real-time from our global community</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 