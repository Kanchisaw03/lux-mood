import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useMood } from '../../context/MoodContext';

const SpiritAvatar = ({ level = 1, size = 'md', showEmotions = true }) => {
  const { currentMood, moodTypes } = useMood();
  const controls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Size classes
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };
  
  // Spirit evolution based on level
  const spiritEvolution = {
    1: {
      name: 'Luminite',
      baseColor: '#8b5cf6',
      features: ['basic glow', 'simple animations']
    },
    2: {
      name: 'Aetheron',
      baseColor: '#6366f1',
      features: ['particle trail', 'mood reactions']
    },
    3: {
      name: 'Celestia',
      baseColor: '#ec4899',
      features: ['complex animations', 'ambient effects']
    },
    4: {
      name: 'Ethereal',
      baseColor: '#06b6d4',
      features: ['full emotion set', 'interactive responses']
    },
    5: {
      name: 'Transcendent',
      baseColor: '#f59e0b',
      features: ['custom animations', 'special effects']
    }
  };
  
  // Current spirit data
  const currentSpirit = spiritEvolution[level] || spiritEvolution[1];
  
  // Idle animation sequence
  useEffect(() => {
    const idleSequence = async () => {
      while (true) {
        // Float up and down
        await controls.start({
          y: [0, -10, 0],
          transition: { duration: 4, ease: "easeInOut", repeat: 1, repeatType: "reverse" }
        });
        
        // Wait a bit
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Random sparkle animation
        if (Math.random() > 0.5) {
          setIsAnimating(true);
          await controls.start({
            scale: [1, 1.05, 1],
            filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
            transition: { duration: 1.5 }
          });
          setIsAnimating(false);
        }
        
        // Wait again
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    };
    
    idleSequence();
  }, [controls]);
  
  // Mood reaction animation
  useEffect(() => {
    if (currentMood) {
      controls.start({
        scale: [1, 1.2, 1],
        rotate: [0, 5, -5, 0],
        transition: { duration: 0.8 }
      });
    }
  }, [currentMood, controls]);
  
  // Get mood color or default
  const moodColor = currentMood && moodTypes[currentMood] 
    ? moodTypes[currentMood].color 
    : currentSpirit.baseColor;
  
  // Get mood emoji or default
  const moodEmoji = currentMood && moodTypes[currentMood] 
    ? moodTypes[currentMood].emoji 
    : '✨';
  
  return (
    <div className="relative">
      {/* Main spirit avatar */}
      <motion.div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center relative`}
        animate={controls}
      >
        {/* Base spirit shape */}
        <motion.div 
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: isAnimating 
              ? [
                  `0 0 20px ${moodColor}50, inset 0 0 10px ${moodColor}80`,
                  `0 0 30px ${moodColor}70, inset 0 0 15px ${moodColor}90`,
                  `0 0 20px ${moodColor}50, inset 0 0 10px ${moodColor}80`
                ]
              : `0 0 20px ${moodColor}50, inset 0 0 10px ${moodColor}80`
          }}
          style={{
            background: `radial-gradient(circle, ${moodColor}30 0%, ${moodColor}10 70%, transparent 100%)`,
          }}
        />
        
        {/* Spirit core */}
        <motion.div 
          className="w-3/4 h-3/4 rounded-full flex items-center justify-center"
          animate={{
            background: [
              `radial-gradient(circle, white 0%, ${moodColor}80 60%, ${moodColor}40 100%)`,
              `radial-gradient(circle, white 10%, ${moodColor}90 70%, ${moodColor}50 100%)`,
              `radial-gradient(circle, white 0%, ${moodColor}80 60%, ${moodColor}40 100%)`
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          {/* Spirit face/emotion */}
          {showEmotions && (
            <motion.div 
              className="text-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {moodEmoji}
            </motion.div>
          )}
        </motion.div>
        
        {/* Particle effects for higher level spirits */}
        {level >= 2 && (
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white"
                initial={{ 
                  x: '50%', 
                  y: '50%', 
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  x: `${50 + (Math.random() * 100 - 50)}%`,
                  y: `${50 + (Math.random() * 100 - 50)}%`,
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
      
      {/* Level indicator */}
      <motion.div 
        className="absolute -bottom-1 -right-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white text-xs font-bold flex items-center justify-center"
        style={{ width: '40%', height: '40%' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {level}
      </motion.div>
      
      {/* Spirit name tooltip on hover */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs text-white/80 pointer-events-none">
        {currentSpirit.name}
      </div>
    </div>
  );
};

export default SpiritAvatar;
