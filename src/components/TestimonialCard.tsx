import React from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle } from "lucide-react";

interface TestimonialCardProps {
  title: string;
  location: string;
  avatar: string;
  content: string;
  rating: number;
  stats?: string;
  platform?: "reddit" | "linkedin";
  username?: string;
  verified?: boolean;
  badge?: string;
}

export default function TestimonialCard({ 
  title, 
  location, 
  avatar, 
  content, 
  rating, 
  stats,
  platform,
  username,
  verified,
  badge
}: TestimonialCardProps) {
  const getPlatformIcon = () => {
    if (platform === "reddit") {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.25 1.25 0 0 1 1.249 1.25zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      );
    } else if (platform === "linkedin") {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 h-full"
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col h-full">
        {/* Rating */}
        <div className="flex items-center mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
          ))}
        </div>

        {/* Content */}
        <blockquote className="text-slate-700 leading-relaxed mb-4 flex-1">
          "{content}"
        </blockquote>

        {/* Stats badge */}
        {stats && (
          <div className="mb-4">
            <span className="inline-flex items-center px-2 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-medium">
              {stats}
            </span>
          </div>
        )}

        {/* Author */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {avatar}
            </div>
            <div>
              <div className="font-medium text-slate-800">{title}</div>
              <div className="text-sm text-slate-500">{location}</div>
              {verified && badge && (
                <div className="flex items-center space-x-1 mt-1">
                  <CheckCircle className="w-3 h-3 text-sky-500" />
                  <span className="text-xs text-sky-600 font-medium">{badge}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Platform icon and username */}
          {platform && (
            <div className="flex items-center space-x-2 text-slate-400">
              <div className="text-slate-500">
                {getPlatformIcon()}
              </div>
              {platform === "linkedin" && username && (
                <span className="text-xs font-medium">{username}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 