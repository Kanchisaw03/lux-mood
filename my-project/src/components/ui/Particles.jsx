import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Particles = ({ type = 'sparkles', count = 30, color = 'white' }) => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // random position as percentage of container
      y: Math.random() * 100,
      size: Math.random() * 10 + 5, // random size between 5-15px
      duration: Math.random() * 20 + 10, // random animation duration
      delay: Math.random() * 5,
    }));
    
    setParticles(newParticles);
  }, [count]);
  
  // Render different particle types
  const renderParticle = (particle) => {
    switch (type) {
      case 'sparkles':
        return (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.7, 0],
              scale: [0, 1, 0],
              y: [0, -50, -100],
              x: [0, particle.id % 2 === 0 ? 20 : -20, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className={`w-full h-full rounded-full bg-${color}/30 shadow-glow`} />
          </motion.div>
        );
        
      case 'petals':
        return (
          <motion.div
            key={particle.id}
            className="absolute text-sakura-300"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              fontSize: `${particle.size}px`,
            }}
            initial={{ opacity: 0, rotate: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              rotate: [0, 360],
              y: [0, 100],
              x: [0, particle.id % 2 === 0 ? 50 : -50],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🌸
          </motion.div>
        );
        
      case 'bubbles':
        return (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              bottom: `-${particle.size}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 0.7, 0],
              scale: [0.5, 1, 1.2],
              y: [0, -particle.y * 5],
              x: [0, (particle.id % 2 === 0 ? 20 : -20) * (particle.x / 50)],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className={`w-full h-full rounded-full border border-mystic-300/30 bg-mystic-300/10 shadow-glow-mystic`} />
          </motion.div>
        );
        
      case 'stars':
        return (
          <motion.div
            key={particle.id}
            className="absolute text-ethereal-300"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              fontSize: `${particle.size}px`,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 0.9, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: particle.duration / 2,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ✨
          </motion.div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(renderParticle)}
    </div>
  );
};

export default Particles;
