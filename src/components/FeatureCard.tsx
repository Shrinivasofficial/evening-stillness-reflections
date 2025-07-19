import React from "react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  stats?: string;
  color?: string;
}

export default function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  stats,
  color = "from-sky-400 to-blue-500"
}: FeatureCardProps) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 h-full"
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start space-x-4 mb-4">
          <div className={`bg-gradient-to-br ${color} p-3 rounded-xl flex-shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-slate-800 mb-2 leading-tight">{title}</h3>
            {stats && (
              <div className="inline-flex items-center px-2 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-medium mb-2">
                {stats}
              </div>
            )}
          </div>
        </div>
        
        <p className="text-slate-600 leading-relaxed flex-1">
          {description}
        </p>
      </div>
    </motion.div>
  );
} 