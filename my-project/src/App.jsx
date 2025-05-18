import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodProvider } from './context/MoodContext';
import './App.css';

function App() {
  const [appState, setAppState] = useState('start') // start, moodSelection, dashboard
  const [currentMood, setCurrentMood] = useState(null)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [moodHistory, setMoodHistory] = useState([])
  const [activeModule, setActiveModule] = useState(null)
  const [notes, setNotes] = useState([])
  const [tasks, setTasks] = useState([])
  const [memories, setMemories] = useState([])
  const [musicPlaying, setMusicPlaying] = useState(false)

  // Handle state transitions with animations
  const handleEnterOS = () => {
    // Play entrance sound if audio is enabled
    if (audioEnabled) {
      const sound = new Audio('/sounds/enter.mp3')
      sound.volume = 0.5
      sound.play().catch(e => console.log('Audio play failed:', e))
    }
    setAppState('moodSelection')
  }

  const handleMoodSelected = (mood) => {
    // Play mood selection sound if audio is enabled
    if (audioEnabled) {
      const sound = new Audio('/sounds/mood-select.mp3')
      sound.volume = 0.5
      sound.play().catch(e => console.log('Audio play failed:', e))
    }
    
    setCurrentMood(mood)
    // Add to mood history
    setMoodHistory(prev => [
      ...prev, 
      { mood, timestamp: new Date().toISOString() }
    ])
    setAppState('dashboard')
  }

  const handleLogout = () => {
    setActiveModule(null)
    setAppState('start')
  }

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
  }
  
  // XP and leveling system
  const addXp = (amount) => {
    const newXp = xp + amount
    setXp(newXp)
    
    // Level up if XP reaches threshold
    const newLevel = Math.floor(newXp / 100) + 1
    if (newLevel > level) {
      setLevel(newLevel)
      // Play level up sound if audio is enabled
      if (audioEnabled) {
        const sound = new Audio('/sounds/level-up.mp3')
        sound.volume = 0.5
        sound.play().catch(e => console.log('Audio play failed:', e))
      }
    }
  }
  
  // Module management
  const openModule = (moduleId) => {
    console.log('App.openModule called with:', moduleId);
    // Add XP for opening a module
    addXp(5);
    setActiveModule(moduleId);
    console.log('activeModule set to:', moduleId);
  }
  
  const closeModule = () => {
    setActiveModule(null)
  }
  
  // Notes and tasks management
  const addNote = (content) => {
    const newNote = {
      id: Date.now(),
      content,
      color: getRandomNeonColor(),
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      rotation: Math.random() * 10 - 5,
      created: new Date().toISOString()
    }
    setNotes(prev => [...prev, newNote])
    addXp(10)
  }
  
  const addTask = (title, description = '', priority = 'medium') => {
    const newTask = {
      id: Date.now(),
      title,
      description,
      priority,
      completed: false,
      created: new Date().toISOString()
    }
    setTasks(prev => [...prev, newTask])
    addXp(10)
  }
  
  const toggleTaskCompletion = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        // Add XP when completing a task
        if (!task.completed) {
          addXp(20)
        }
        return { ...task, completed: !task.completed }
      }
      return task
    }))
  }
  
  const addMemory = (title, content) => {
    const newMemory = {
      id: Date.now(),
      title,
      content,
      mood: currentMood,
      created: new Date().toISOString()
    }
    setMemories(prev => [...prev, newMemory])
    addXp(15)
  }
  
  // Helper function for random neon colors
  const getRandomNeonColor = () => {
    const neonColors = [
      '#ff00ff', // Magenta
      '#00ffff', // Cyan
      '#ff3377', // Pink
      '#39ff14', // Green
      '#ff9933', // Orange
      '#ff3366', // Rose
      '#cc33ff'  // Purple
    ]
    return neonColors[Math.floor(Math.random() * neonColors.length)]
  }

  // Mood types with enhanced visuals and themes
  const moodTypes = {
    calm: {
      name: 'Calm',
      emoji: '😌',
      color: 'blue',
      gradient: 'from-blue-900 via-indigo-800 to-blue-700',
      glow: '0 0 15px rgba(59, 130, 246, 0.7), 0 0 30px rgba(59, 130, 246, 0.4)',
      accent: '#3b82f6',
      description: 'A tranquil state of mind, like a serene lake at dawn.',
      theme: 'Midnight Serenity',
      particleColor: '#3b82f6',
      bgImage: 'url(/images/calm-bg.jpg)'
    },
    joy: {
      name: 'Joy',
      emoji: '😊',
      color: 'pink',
      gradient: 'from-pink-900 via-rose-800 to-pink-700',
      glow: '0 0 15px rgba(244, 114, 182, 0.7), 0 0 30px rgba(244, 114, 182, 0.4)',
      accent: '#f472b6',
      description: 'Pure happiness, like cherry blossoms dancing in spring.',
      theme: 'Neon Sakura',
      particleColor: '#f472b6',
      bgImage: 'url(/images/joy-bg.jpg)'
    },
    focus: {
      name: 'Focus',
      emoji: '🧠',
      color: 'purple',
      gradient: 'from-purple-900 via-violet-800 to-purple-700',
      glow: '0 0 15px rgba(139, 92, 246, 0.7), 0 0 30px rgba(139, 92, 246, 0.4)',
      accent: '#8b5cf6',
      description: 'Deep concentration, like stars aligning in perfect clarity.',
      theme: 'Cosmic Nexus',
      particleColor: '#8b5cf6',
      bgImage: 'url(/images/focus-bg.jpg)'
    },
    dream: {
      name: 'Dream',
      emoji: '✨',
      color: 'cyan',
      gradient: 'from-cyan-900 via-teal-800 to-cyan-700',
      glow: '0 0 15px rgba(34, 211, 238, 0.7), 0 0 30px rgba(34, 211, 238, 0.4)',
      accent: '#22d3ee',
      description: 'Imagination unbound, like floating through a fantasy realm.',
      theme: 'Ethereal Dreamscape',
      particleColor: '#22d3ee',
      bgImage: 'url(/images/dream-bg.jpg)'
    },
    mystery: {
      name: 'Mystery',
      emoji: '🌌',
      color: 'indigo',
      gradient: 'from-indigo-900 via-violet-900 to-purple-800',
      glow: '0 0 15px rgba(129, 140, 248, 0.7), 0 0 30px rgba(129, 140, 248, 0.4)',
      accent: '#818cf8',
      description: 'Enigmatic and profound, like the depths of the cosmos.',
      theme: 'Void Walker',
      particleColor: '#818cf8',
      bgImage: 'url(/images/mystery-bg.jpg)'
    },
    energy: {
      name: 'Energy',
      emoji: '⚡',
      color: 'amber',
      gradient: 'from-amber-900 via-orange-800 to-amber-700',
      glow: '0 0 15px rgba(251, 191, 36, 0.7), 0 0 30px rgba(251, 191, 36, 0.4)',
      accent: '#fbbf24',
      description: 'Vibrant and electric, like lightning across the night sky.',
      theme: 'Voltage Surge',
      particleColor: '#fbbf24',
      bgImage: 'url(/images/energy-bg.jpg)'
    }
  }

  // Animated particles background component
  const ParticlesBackground = ({ color = '#ffffff', count = 50 }) => {
    const particles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10
    }))
    
    return (
      <div className="absolute inset-0 overflow-hidden">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              backgroundColor: color,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              boxShadow: `0 0 ${particle.size * 2}px ${color}`,
              opacity: particle.size / 4
            }}
            animate={{
              x: [`${particle.x - 10}%`, `${particle.x + 10}%`],
              y: [`${particle.y - 10}%`, `${particle.y + 10}%`],
              opacity: [particle.size / 4, particle.size / 2, particle.size / 4]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    )
  }
  
  // Neon text component with glow effect
  const NeonText = ({ text, color = '#ff00ff', className = '', size = 'text-4xl' }) => (
    <motion.div
      className={`${size} font-bold ${className}`}
      style={{
        color: color,
        textShadow: `0 0 5px ${color}, 0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`
      }}
      initial={{ opacity: 0.8 }}
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {text}
    </motion.div>
  )
  
  // Glass panel component with neon border
  const GlassPanel = ({ children, color = '#ff00ff', className = '' }) => (
    <div 
      className={`bg-black/30 backdrop-blur-md rounded-xl border border-opacity-30 ${className}`}
      style={{
        borderColor: color,
        boxShadow: `0 0 10px ${color}40, inset 0 0 10px ${color}20`
      }}
    >
      {children}
    </div>
  )

  // Start Screen Component with enhanced visuals
  const StartScreen = () => {
    // Reference for the canvas element
    const canvasRef = useRef(null)
    
    // Animation for the title
    const titleVariants = {
      hidden: { y: -50, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1,
        transition: { 
          duration: 1,
          ease: 'easeOut'
        }
      }
    }
    
    // Animation for the button
    const buttonVariants = {
      initial: { scale: 1 },
      hover: { 
        scale: 1.05,
        boxShadow: '0 0 25px rgba(255, 0, 255, 0.7)',
        transition: { 
          duration: 0.3,
          yoyo: Infinity,
          ease: 'easeInOut'
        }
      },
      tap: { scale: 0.95 }
    }
    
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-black via-purple-950 to-indigo-950 flex items-center justify-center overflow-hidden relative">
        {/* Animated background particles */}
        <ParticlesBackground color="#8b5cf6" count={30} />
        <ParticlesBackground color="#ec4899" count={20} />
        
        {/* Circular gradient overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black opacity-70"></div>
        
        {/* Grid lines for cyberpunk effect */}
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        
        <motion.div 
          className="relative z-10 text-center max-w-2xl px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div 
            className="mb-12"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            <NeonText 
              text="LUX" 
              color="#ec4899" 
              size="text-8xl" 
              className="font-black tracking-wider mb-2"
            />
            
            <motion.div 
              className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full mx-auto w-64"
              initial={{ width: 0 }}
              animate={{ width: 256 }}
              transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
            />
            
            <motion.h2 
              className="text-white text-2xl mt-6 font-light tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              THE MOOD<span className="text-pink-500">OS</span> SIMULATOR
            </motion.h2>
          </motion.div>
          
          <GlassPanel color="#8b5cf6" className="p-6 mb-12">
            <p className="text-white/90 leading-relaxed">
              A futuristic operating system that adapts to your emotional state.
              Discover a new way to interact with technology through the lens of your mood.
              <span className="block mt-2 text-purple-300 font-medium">Immerse yourself in a world where technology responds to your emotions.</span>
            </p>
          </GlassPanel>
          
          <motion.button
            onClick={handleEnterOS}
            className="px-10 py-5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-white font-bold text-lg relative overflow-hidden group"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/50 to-purple-500/50 blur-xl group-hover:opacity-80 opacity-0 transition-opacity duration-300"></div>
            
            {/* Button content */}
            <div className="relative z-10 flex items-center justify-center">
              <span>ENTER MOODOS</span>
              <motion.span 
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className="absolute inset-0 animate-border-flow"></div>
            </div>
          </motion.button>
          
          <motion.div 
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <button 
              className="text-white/70 hover:text-white flex items-center justify-center gap-2 mx-auto transition-all duration-300 hover:gap-3"
              onClick={toggleAudio}
            >
              <span className="text-xl">{audioEnabled ? '🔊' : '🔇'}</span>
              <span className="tracking-wider">{audioEnabled ? 'SOUND ON' : 'SOUND OFF'}</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Mood Selection Component with enhanced visuals
  const MoodSelection = () => {
    // Animation variants for the container
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { 
          duration: 0.5,
          when: 'beforeChildren',
          staggerChildren: 0.1
        }
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.3 }
      }
    }
    
    // Animation variants for the cards
    const cardVariants = {
      hidden: { y: 50, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' }
      },
      hover: {
        y: -10,
        scale: 1.03,
        transition: { duration: 0.3, ease: 'easeOut' }
      },
      tap: { scale: 0.98 }
    }
    
    // Animation variants for the header
    const headerVariants = {
      hidden: { y: -30, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' }
      }
    }
    
    return (
      <motion.div 
        className="h-screen w-screen bg-gradient-to-br from-black via-purple-950 to-indigo-950 flex flex-col items-center justify-center p-6 overflow-hidden relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Animated background particles */}
        <ParticlesBackground color="#8b5cf6" count={20} />
        <ParticlesBackground color="#ec4899" count={15} />
        
        {/* Circular gradient overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black opacity-70"></div>
        
        {/* Grid lines for cyberpunk effect */}
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        
        <motion.div 
          className="text-center mb-12 relative z-10"
          variants={headerVariants}
        >
          <NeonText 
            text="Choose Your Mood Spirit" 
            color="#8b5cf6" 
            size="text-4xl" 
            className="mb-4"
          />
          <GlassPanel color="#ec4899" className="p-4 max-w-md mx-auto">
            <p className="text-white/90">
              Select a mood that resonates with your current emotional state.
              Each mood unlocks a unique experience tailored to your feelings.
            </p>
          </GlassPanel>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl relative z-10">
          {Object.entries(moodTypes).map(([key, mood]) => (
            <motion.div
              key={key}
              className="cursor-pointer"
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleMoodSelected(key)}
            >
              <div 
                className="h-full backdrop-blur-md rounded-xl overflow-hidden relative group"
                style={{
                  background: `linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.4))`,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: `${mood.accent}50`,
                  boxShadow: `0 0 20px ${mood.accent}30`
                }}
              >
                {/* Glow effect on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: `inset 0 0 30px ${mood.accent}50`,
                    background: `linear-gradient(135deg, ${mood.accent}10, transparent)`
                  }}
                ></div>
                
                <div className="p-6 flex flex-col items-center text-center h-full relative z-10">
                  {/* Emoji with glow */}
                  <motion.div 
                    className="text-6xl mb-5 relative"
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                    style={{
                      filter: `drop-shadow(0 0 10px ${mood.accent})`
                    }}
                  >
                    {mood.emoji}
                  </motion.div>
                  
                  {/* Name with neon effect */}
                  <h3 
                    className="text-xl font-bold mb-3"
                    style={{
                      color: mood.accent,
                      textShadow: `0 0 5px ${mood.accent}, 0 0 10px ${mood.accent}80`
                    }}
                  >
                    {mood.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/80 text-sm mb-5">{mood.description}</p>
                  
                  {/* Theme badge */}
                  <div 
                    className="mt-auto px-4 py-2 rounded-full text-white text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all duration-300"
                    style={{
                      background: `linear-gradient(90deg, ${mood.accent}40, ${mood.accent}20)`,
                      boxShadow: `0 0 10px ${mood.accent}30`
                    }}
                  >
                    <span>{mood.theme}</span>
                    <motion.span 
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  // Clock component with real-time updates
  const Clock = () => {
    const [time, setTime] = useState(new Date())
    
    useEffect(() => {
      const timer = setInterval(() => {
        setTime(new Date())
      }, 1000)
      return () => clearInterval(timer)
    }, [])
    
    return (
      <div className="text-white/80 text-sm">
        <div className="font-medium">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        <div className="text-xs opacity-70">{time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      </div>
    )
  }
  
  // XP Progress bar component
  const XpProgressBar = ({ level, xp }) => {
    const nextLevelXp = level * 100
    const currentLevelXp = (level - 1) * 100
    const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100
    
    return (
      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
        <motion.div 
          className="h-full"
          style={{ 
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #ec4899, #8b5cf6)'
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    );
  };
  
  // Dashboard Component with enhanced UI
  const Dashboard = () => {
    const mood = moodTypes[currentMood] || moodTypes.calm;
    const [showNotification, setShowNotification] = useState(false);
    const [notification, setNotification] = useState({ title: '', message: '' });
    
    // Show notification function
    const notify = (title, message) => {
      setNotification({ title, message });
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };
    
    // Function to handle module opening
    const handleOpenModule = (moduleId) => {
      console.log('Opening module:', moduleId);
      setActiveModule(moduleId);
      addXp(5); // Award XP for opening a module
      notify('Module Opened', `You've opened the ${moduleId} module`);
    };
    
    // Update time every second
    useEffect(() => {
      // Show welcome notification
      setTimeout(() => {
        notify(`Welcome to ${mood.theme}`, `Your MoodOS is now tuned to your ${mood.name.toLowerCase()} state.`);
      }, 1000);
    }, []);
    
    return (
      <motion.div 
        className="h-screen w-screen overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: `linear-gradient(135deg, #000000, ${mood.accent}40)`,
        }}
      >
        {/* Background elements */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: `url(/images/grid.svg)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        <ParticlesBackground color={mood.particleColor} count={15} />
        
        {/* Top bar with glassmorphism */}
        <div 
          className="absolute top-0 left-0 right-0 h-16 z-20 flex items-center justify-between px-6"
          style={{
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${mood.accent}30`,
            boxShadow: `0 4px 20px rgba(0,0,0,0.2)`
          }}
        >
          <div className="flex items-center">
            <NeonText 
              text="LUX" 
              color={mood.accent} 
              size="text-2xl" 
              className="mr-4"
            />
            <Clock />
          </div>
          
          <div className="flex items-center">
            <div className="text-white/80 text-sm text-right mr-4">
              <div className="flex items-center">
                <span className="text-xs opacity-70 mr-2">Current Mood:</span>
                <span 
                  className="font-medium"
                  style={{ 
                    color: mood.accent,
                    textShadow: `0 0 5px ${mood.accent}50`
                  }}
                >
                  {mood.name}
                </span>
                <span className="ml-1">{mood.emoji}</span>
              </div>
              <div className="flex flex-col">
                <div className="text-xs opacity-70 flex items-center justify-end">
                  Level {level} • {xp} XP
                </div>
                <XpProgressBar level={level} xp={xp} />
              </div>
            </div>
            
            <motion.div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${mood.accent}40, ${mood.accent}10)`,
                border: `1px solid ${mood.accent}50`,
                boxShadow: `0 0 10px ${mood.accent}30`
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">{mood.emoji}</span>
            </motion.div>
            
            <motion.button 
              onClick={handleLogout} 
              className="ml-4 text-white/60 hover:text-white text-sm px-3 py-1 rounded-full"
              whileHover={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#ffffff'
              }}
              whileTap={{ scale: 0.95 }}
            >
              Exit
            </motion.button>
          </div>
        </div>
        
        {/* Notification component */}
        <AnimatePresence>
          {showNotification && (
            <motion.div 
              className="absolute top-20 right-6 z-30 max-w-sm"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <GlassPanel color={mood.accent} className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-2xl mr-3">{mood.emoji}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-1">{notification.title}</h4>
                    <p className="text-white/80 text-sm">{notification.message}</p>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main content */}
        <div className="pt-24 px-6 pb-6 h-full overflow-auto">
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 
              className="text-5xl font-bold mb-3"
              style={{ 
                color: 'white',
                textShadow: `0 0 10px ${mood.accent}50`
              }}
            >
              Welcome to your {mood.theme}
            </h1>
            <GlassPanel color={mood.accent} className="p-4 max-w-2xl">
              <p className="text-white/90">
                Your MoodOS is currently tuned to your {mood.name.toLowerCase()} state. 
                Explore the modules below to enhance your experience and earn XP.
              </p>
            </GlassPanel>
          </motion.div>
        
        {/* Module grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              id: 'dreamvault', 
              name: 'DreamVault', 
              icon: '📓', 
              description: 'Journal your thoughts and visualize memories',
              color: '#22d3ee',
              glow: '0 0 20px rgba(34, 211, 238, 0.4)'
            },
            { 
              id: 'auroraplayer', 
              name: 'Aurora Player', 
              icon: '🎵', 
              description: 'Ambient sounds and lo-fi melodies',
              color: '#8b5cf6',
              glow: '0 0 20px rgba(139, 92, 246, 0.4)'
            },
            { 
              id: 'butterflyboard', 
              name: 'Butterfly Board', 
              icon: '🦋', 
              description: 'Floating notes and tasks in 3D space',
              color: '#ec4899',
              glow: '0 0 20px rgba(236, 72, 153, 0.4)'
            },
            { 
              id: 'portalquest', 
              name: 'Portal Quest', 
              icon: '✨', 
              description: 'Micro quests for mindfulness and creativity',
              color: '#f59e0b',
              glow: '0 0 20px rgba(245, 158, 11, 0.4)'
            },
            { 
              id: 'emotionarchive', 
              name: 'Emotion Archive', 
              icon: '🌠', 
              description: 'Visualize your mood history as constellations',
              color: '#6366f1',
              glow: '0 0 20px rgba(99, 102, 241, 0.4)'
            }
          ].map(module => (
            <motion.div 
              key={module.id}
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className="h-full backdrop-blur-md rounded-xl overflow-hidden relative group cursor-pointer"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: `${module.color}50`,
                  boxShadow: `0 0 20px ${module.color}20`
                }}
                onClick={() => handleOpenModule(module.id)}
              >
                {/* Glow effect on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: `inset 0 0 30px ${module.color}30`,
                    background: `linear-gradient(135deg, ${module.color}10, transparent)`
                  }}
                ></div>
                
                <div className="p-6 flex flex-col h-full relative z-10">
                  {/* Icon with glow */}
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-5 relative"
                    style={{
                      background: `linear-gradient(135deg, ${module.color}30, ${module.color}10)`,
                      boxShadow: `0 0 15px ${module.color}30`
                    }}
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut" 
                      }}
                      style={{
                        filter: `drop-shadow(0 0 5px ${module.color})`
                      }}
                    >
                      {module.icon}
                    </motion.div>
                  </div>
                  
                  {/* Module name with neon effect */}
                  <h3 
                    className="text-xl font-bold mb-3"
                    style={{
                      color: module.color,
                      textShadow: `0 0 5px ${module.color}, 0 0 10px ${module.color}80`
                    }}
                  >
                    {module.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/80 text-sm mb-5">{module.description}</p>
                  
                  {/* Open button */}
                  <div className="mt-auto">
                    <div 
                      className="inline-flex items-center px-4 py-2 rounded-full text-white text-sm font-medium group-hover:pl-5 transition-all duration-300"
                      style={{
                        background: `linear-gradient(90deg, ${module.color}40, ${module.color}10)`,
                        boxShadow: `0 0 10px ${module.color}20`
                      }}
                    >
                      <span>Open Module</span>
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
    );
  }

  // Lazy load module components

  
  // Module rendering function
  const renderActiveModule = () => {
    const mood = moodTypes[currentMood] || moodTypes.calm;
    
    if (!activeModule) return null;
    
    // Wrap in suspense to handle lazy loading
    return (
      <React.Suspense fallback={<div className="glass-dark p-8 rounded-xl">Loading module...</div>}>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/50 backdrop-blur-sm">
          {activeModule === 'dreamvault' && <DreamVault onClose={closeModule} mood={mood} />}
          {activeModule === 'portalquest' && <PortalQuest onClose={closeModule} mood={mood} />}
          {activeModule === 'auroraplayer' && <AuroraPlayer onClose={closeModule} mood={mood} />}
        </div>
      </React.Suspense>
    );
  };
  
  // Lazy load module components
  const DreamVaultModule = lazy(() => import('./components/modules/DreamVault'));
  const PortalQuestModule = lazy(() => import('./components/modules/PortalQuest'));
  const AuroraPlayerModule = lazy(() => import('./components/modules/AuroraPlayer'));
  const ButterflyBoardModule = lazy(() => import('./components/modules/ButterflyBoard'));
  const EmotionArchiveModule = lazy(() => import('./components/modules/EmotionArchive'));
  
  // Render the appropriate screen based on app state
  return (
    <MoodProvider>
      <div className="h-screen w-screen overflow-hidden">
        {appState === 'start' && <StartScreen />}
        {appState === 'moodSelection' && <MoodSelection />}
        {appState === 'dashboard' && (
          <>
            <Dashboard />
            <AnimatePresence>
              {activeModule && (
                <motion.div 
                  className="fixed inset-0 z-50 flex items-center justify-center p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                  <Suspense fallback={<div className="glass-dark p-8 rounded-xl">Loading module...</div>}>
                    {activeModule === 'dreamvault' && (
                      <DreamVaultModule onClose={() => setActiveModule(null)} mood={moodTypes[currentMood] || moodTypes.calm} />
                    )}
                    {activeModule === 'portalquest' && (
                      <PortalQuestModule onClose={() => setActiveModule(null)} mood={moodTypes[currentMood] || moodTypes.calm} />
                    )}
                    {activeModule === 'auroraplayer' && (
                      <AuroraPlayerModule onClose={() => setActiveModule(null)} mood={moodTypes[currentMood] || moodTypes.calm} />
                    )}
                    {activeModule === 'butterflyboard' && (
                      <ButterflyBoardModule onClose={() => setActiveModule(null)} mood={moodTypes[currentMood] || moodTypes.calm} />
                    )}
                    {activeModule === 'emotionarchive' && (
                      <EmotionArchiveModule onClose={() => setActiveModule(null)} mood={moodTypes[currentMood] || moodTypes.calm} />
                    )}
                  </Suspense>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </MoodProvider>
  );
};

export default App;
