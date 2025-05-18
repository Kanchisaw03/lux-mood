import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FloatingWindow = ({ 
  children, 
  title, 
  width = 'md', 
  height = 'auto', 
  glowColor = 'rgba(255, 255, 255, 0.2)',
  className = '',
  onClose,
  draggable = false,
  borderAnimation = true,
  particleTrail = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  // Width classes based on size prop
  const widthClasses = {
    sm: 'w-full max-w-md',
    md: 'w-full max-w-2xl',
    lg: 'w-full max-w-4xl',
    xl: 'w-full max-w-6xl',
    full: 'w-full'
  };
  
  // Height classes based on height prop
  const heightClasses = {
    auto: 'h-auto',
    sm: 'h-64',
    md: 'h-96',
    lg: 'h-[32rem]',
    xl: 'h-[40rem]',
    full: 'h-full'
  };

  // Border animation
  const borderVariants = {
    animate: {
      backgroundPosition: ['0% 0%', '100% 100%'],
      transition: {
        duration: 8,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'reverse'
      }
    }
  };

  // Particle trail effect
  const ParticleTrail = () => {
    return isDragging && particleTrail ? (
      <motion.div
        className="absolute -z-10 opacity-70"
        initial={{ scale: 0.8, opacity: 0.8 }}
        animate={{ scale: 0, opacity: 0 }}
        transition={{ duration: 1 }}
        style={{
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
          borderRadius: 'inherit'
        }}
      />
    ) : null;
  };

  return (
    <motion.div
      className={`relative ${widthClasses[width]} ${heightClasses[height]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      drag={draggable}
      dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      style={{ zIndex: isDragging ? 50 : 10 }}
    >
      {/* Animated border */}
      {borderAnimation && (
        <motion.div
          className="absolute inset-0 rounded-2xl -z-10"
          variants={borderVariants}
          animate="animate"
          style={{
            padding: '2px',
            background: `linear-gradient(45deg, transparent, ${glowColor}, transparent)`,
            backgroundSize: '400% 400%',
            filter: 'blur(3px)'
          }}
        />
      )}
      
      {/* Particle trail for dragging */}
      <ParticleTrail />
      
      {/* Main window with glassmorphism */}
      <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-full">
        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-lg font-medium text-white/90">{title}</h3>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white/90 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="p-6 h-full overflow-auto custom-scrollbar">
          {children}
        </div>
      </div>
      
      {/* Glow effect */}
      <div
        className="absolute inset-0 -z-20 rounded-2xl opacity-30"
        style={{
          background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
          filter: 'blur(20px)'
        }}
      />
    </motion.div>
  );
};

export default FloatingWindow;
