import React from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function FloatingParticles() {
  const particles: Particle[] = [
    { id: 1, x: 10, y: 20, size: 4, duration: 6, delay: 0 },
    { id: 2, x: 20, y: 80, size: 6, duration: 8, delay: 1 },
    { id: 3, x: 70, y: 10, size: 3, duration: 7, delay: 2 },
    { id: 4, x: 80, y: 60, size: 5, duration: 9, delay: 0.5 },
    { id: 5, x: 40, y: 90, size: 4, duration: 6, delay: 1.5 },
    { id: 6, x: 90, y: 30, size: 3, duration: 8, delay: 2.5 },
    { id: 7, x: 15, y: 70, size: 5, duration: 7, delay: 0.8 },
    { id: 8, x: 85, y: 85, size: 4, duration: 9, delay: 1.2 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-br from-sky-200/40 to-blue-300/40"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
} 