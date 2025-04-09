import React from 'react';
import { motion } from 'framer-motion';

interface BackgroundAnimationProps {
  variant?: 'login' | 'converter';
}

export default function BackgroundAnimation({ variant = 'login' }: BackgroundAnimationProps) {
  const gradients = Array.from({ length: 3 }, (_, i) => i);
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {gradients.map((i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${
            variant === 'login' 
              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' 
              : 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20'
          }`}
          style={{
            width: `${600 + i * 100}px`,
            height: `${600 + i * 100}px`,
            left: `${30 + i * 5}%`,
            top: `${20 + i * 5}%`,
            filter: 'blur(100px)',
          }}
          initial={{ opacity: 0.5, scale: 0.8 }}
          animate={{
            opacity: [0.4, 0.6, 0.4],
            scale: [0.8, 1, 0.8],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[100px]" />
    </div>
  );
}