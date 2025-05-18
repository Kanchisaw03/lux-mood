import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMood } from '../../context/MoodContext';

const AuroraPlayer = ({ onClose, mood }) => {
  const { addXp } = useMood();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolume] = useState(70);
  const [visualizerActive, setVisualizerActive] = useState(true);
  const visualizerRef = useRef(null);
  
  // Mock tracks based on moods
  const tracks = [
    {
      id: 1,
      title: "Tranquil Waters",
      artist: "Aurora Sounds",
      duration: "3:45",
      mood: "calm",
      color: "mystic"
    },
    {
      id: 2,
      title: "Cherry Blossom Dreams",
      artist: "Sakura Beats",
      duration: "4:12",
      mood: "joy",
      color: "sakura"
    },
    {
      id: 3,
      title: "Cosmic Focus",
      artist: "Stellar Mind",
      duration: "5:30",
      mood: "focus",
      color: "ethereal"
    },
    {
      id: 4,
      title: "Ethereal Journey",
      artist: "Dreamscape",
      duration: "6:15",
      mood: "dream",
      color: "dream"
    },
    {
      id: 5,
      title: "Midnight Meditation",
      artist: "Aurora Sounds",
      duration: "4:50",
      mood: "calm",
      color: "mystic"
    },
    {
      id: 6,
      title: "Celebration of Light",
      artist: "Sakura Beats",
      duration: "3:30",
      mood: "joy",
      color: "sakura"
    },
    {
      id: 7,
      title: "Deep Concentration",
      artist: "Stellar Mind",
      duration: "7:20",
      mood: "focus",
      color: "ethereal"
    },
    {
      id: 8,
      title: "Lucid Dreaming",
      artist: "Dreamscape",
      duration: "5:45",
      mood: "dream",
      color: "dream"
    }
  ];
  
  // Filter tracks by current mood
  const moodTracks = tracks.filter(track => track.mood === mood.name.toLowerCase());
  const otherTracks = tracks.filter(track => track.mood !== mood.name.toLowerCase());
  const allTracks = [...moodTracks, ...otherTracks];
  
  // Initialize visualizer
  useEffect(() => {
    if (visualizerRef.current && visualizerActive) {
      const canvas = visualizerRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Animation variables
      let animationId;
      const particles = [];
      
      // Create particles
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          color: getRandomColor(),
          velocity: {
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5
          },
          amplitude: Math.random() * 20 + 5
        });
      }
      
      // Get random color based on mood
      function getRandomColor() {
        const colors = {
          mystic: ['#5c70ff', '#3a4dff', '#2d3ae6'],
          sakura: ['#ff5cb0', '#ff2d8a', '#ff0066'],
          ethereal: ['#9747ff', '#8520ff', '#7a0df5'],
          dream: ['#00d0ff', '#33daff', '#66e4ff']
        };
        
        const colorArray = colors[mood.color] || colors.mystic;
        return colorArray[Math.floor(Math.random() * colorArray.length)];
      }
      
      // Animation function
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
          // Update position
          particle.x += particle.velocity.x;
          particle.y += particle.velocity.y;
          
          // Add some wave motion
          particle.y += Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.2;
          
          // Bounce off edges
          if (particle.x < 0 || particle.x > canvas.width) {
            particle.velocity.x = -particle.velocity.x;
          }
          
          if (particle.y < 0 || particle.y > canvas.height) {
            particle.velocity.y = -particle.velocity.y;
          }
          
          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          
          // Add glow effect
          ctx.shadowBlur = 15;
          ctx.shadowColor = particle.color;
        });
        
        // Add connecting lines between close particles
        particles.forEach((particle, i) => {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particle.x - particles[j].x;
            const dy = particle.y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              ctx.beginPath();
              ctx.strokeStyle = particle.color;
              ctx.globalAlpha = 1 - distance / 100;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
          }
        });
        
        animationId = requestAnimationFrame(animate);
      }
      
      // Start animation
      animate();
      
      // Cleanup
      return () => {
        cancelAnimationFrame(animationId);
      };
    }
  }, [visualizerActive, mood.color]);
  
  // Play a track
  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    // Award XP for playing a track
    addXp(5);
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
  };
  
  // Format time for progress bar
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <motion.div
      className={`h-full w-full bg-${mood.color}-800/30 backdrop-blur-md rounded-xl overflow-hidden border border-${mood.color}-500/30`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className={`p-4 border-b border-${mood.color}-500/30 flex items-center justify-between`}>
        <div className="flex items-center">
          <span className="text-2xl mr-2">🎵</span>
          <h2 className={`text-${mood.color}-100 text-xl font-bold`}>Aurora Player</h2>
        </div>
        
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white"
        >
          Close
        </button>
      </div>
      
      {/* Content */}
      <div className="flex flex-col md:flex-row h-[calc(100%-4rem)]">
        {/* Visualizer and player controls */}
        <div className="md:w-2/3 p-6 flex flex-col">
          {/* Visualizer */}
          <div className="relative flex-1 mb-6 rounded-lg overflow-hidden bg-black/20">
            <canvas 
              ref={visualizerRef} 
              className="w-full h-full"
              style={{ display: visualizerActive ? 'block' : 'none' }}
            />
            
            {!visualizerActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`text-${mood.color}-200 text-lg`}>Visualizer paused</div>
              </div>
            )}
            
            {/* Album art overlay */}
            {currentTrack && (
              <motion.div 
                className="absolute bottom-4 left-4 flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className={`w-16 h-16 rounded-lg bg-${currentTrack.color}-500/50 flex items-center justify-center text-2xl shadow-glow-${currentTrack.color}`}>
                  {currentTrack.mood === 'calm' ? '🌊' : 
                   currentTrack.mood === 'joy' ? '🌸' : 
                   currentTrack.mood === 'focus' ? '✨' : '💫'}
                </div>
                <div className="ml-3">
                  <div className={`text-${mood.color}-100 font-bold`}>{currentTrack.title}</div>
                  <div className="text-white/70 text-sm">{currentTrack.artist}</div>
                </div>
              </motion.div>
            )}
            
            {/* Visualizer toggle */}
            <button 
              className={`absolute top-4 right-4 p-2 rounded-full bg-${mood.color}-900/50 text-${mood.color}-200`}
              onClick={() => setVisualizerActive(!visualizerActive)}
            >
              {visualizerActive ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Player controls */}
          <div className={`p-4 rounded-lg bg-${mood.color}-900/50 border border-${mood.color}-500/30`}>
            {/* Progress bar */}
            <div className="mb-4">
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className={`absolute h-full bg-${mood.color}-500`}
                  initial={{ width: '0%' }}
                  animate={{ width: isPlaying ? '100%' : '0%' }}
                  transition={{ duration: 30, repeat: Infinity, repeatType: 'loop' }}
                  style={{ width: currentTrack ? '30%' : '0%' }}
                />
              </div>
              <div className="flex justify-between text-white/60 text-xs mt-1">
                <span>{currentTrack ? formatTime(60) : '0:00'}</span>
                <span>{currentTrack ? currentTrack.duration : '0:00'}</span>
              </div>
            </div>
            
            {/* Control buttons */}
            <div className="flex items-center justify-center space-x-6">
              <button className="text-white/70 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
              </button>
              
              <button 
                className={`w-12 h-12 rounded-full flex items-center justify-center bg-${mood.color}-500 text-white`}
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
              
              <button className="text-white/70 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                </svg>
              </button>
            </div>
            
            {/* Volume control */}
            <div className="flex items-center mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className={`w-full h-2 mx-2 rounded-full appearance-none bg-white/20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-${mood.color}-400`}
              />
              <span className="text-white/70 text-xs">{volume}%</span>
            </div>
          </div>
        </div>
        
        {/* Playlist */}
        <div className={`md:w-1/3 border-t md:border-t-0 md:border-l border-${mood.color}-500/30 p-6 overflow-y-auto`}>
          <h3 className={`text-${mood.color}-200 text-lg font-medium mb-4`}>Playlist</h3>
          
          {/* Recommended for your mood */}
          <div className="mb-6">
            <h4 className="text-white/70 text-sm mb-2">Recommended for your mood</h4>
            <div className="space-y-2">
              {moodTracks.map(track => (
                <motion.div
                  key={track.id}
                  className={`p-3 rounded-lg ${
                    currentTrack?.id === track.id
                      ? `bg-${track.color}-500/30 border border-${track.color}-400/50`
                      : `bg-${track.color}-900/30 hover:bg-${track.color}-800/30`
                  } cursor-pointer`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => playTrack(track)}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-md bg-${track.color}-500/50 flex items-center justify-center text-lg mr-3`}>
                      {track.mood === 'calm' ? '🌊' : 
                       track.mood === 'joy' ? '🌸' : 
                       track.mood === 'focus' ? '✨' : '💫'}
                    </div>
                    <div className="flex-1">
                      <div className={`text-${mood.color}-100 font-medium ${
                        currentTrack?.id === track.id ? 'font-bold' : ''
                      }`}>
                        {track.title}
                      </div>
                      <div className="text-white/60 text-xs">{track.artist}</div>
                    </div>
                    <div className="text-white/60 text-xs">{track.duration}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Other tracks */}
          <div>
            <h4 className="text-white/70 text-sm mb-2">Other tracks</h4>
            <div className="space-y-2">
              {otherTracks.map(track => (
                <motion.div
                  key={track.id}
                  className={`p-3 rounded-lg ${
                    currentTrack?.id === track.id
                      ? `bg-${track.color}-500/30 border border-${track.color}-400/50`
                      : `bg-${track.color}-900/30 hover:bg-${track.color}-800/30`
                  } cursor-pointer`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => playTrack(track)}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-md bg-${track.color}-500/50 flex items-center justify-center text-lg mr-3`}>
                      {track.mood === 'calm' ? '🌊' : 
                       track.mood === 'joy' ? '🌸' : 
                       track.mood === 'focus' ? '✨' : '💫'}
                    </div>
                    <div className="flex-1">
                      <div className={`text-${mood.color}-100 font-medium ${
                        currentTrack?.id === track.id ? 'font-bold' : ''
                      }`}>
                        {track.title}
                      </div>
                      <div className="text-white/60 text-xs">{track.artist}</div>
                    </div>
                    <div className="text-white/60 text-xs">{track.duration}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuroraPlayer;
