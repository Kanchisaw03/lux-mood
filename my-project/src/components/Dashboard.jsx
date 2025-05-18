import { useState } from 'react';
import { useMood } from '../context/MoodContext';

// Define a simplified set of modules
const modules = [
  {
    id: 'dreamvault',
    name: 'DreamVault',
    icon: '📓',
    description: 'Journal your thoughts and visualize memories'
  },
  {
    id: 'auroraplayer',
    name: 'Aurora Player',
    icon: '🎵',
    description: 'Ambient sounds and lo-fi melodies'
  },
  {
    id: 'butterflyboard',
    name: 'Butterfly Board',
    icon: '🦋',
    description: 'Floating notes and tasks in 3D space'
  },
  {
    id: 'portalquest',
    name: 'Portal Quest',
    icon: '✨',
    description: 'Micro quests for mindfulness and creativity'
  },
  {
    id: 'emotionarchive',
    name: 'Emotion Archive',
    icon: '🌠',
    description: 'Visualize your mood history as constellations'
  }
];

const Dashboard = ({ onLogout, audioEnabled }) => {
  const { currentMood } = useMood();
  const [time] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [date] = useState(new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
  
  // Get current mood data (simplified)
  const mood = {
    name: currentMood || 'Calm',
    emoji: currentMood === 'joy' ? '😊' : 
           currentMood === 'focus' ? '🧠' : 
           currentMood === 'dream' ? '✨' : '😌',
    color: currentMood === 'joy' ? 'pink' : 
           currentMood === 'focus' ? 'purple' : 
           currentMood === 'dream' ? 'cyan' : 'blue',
    theme: currentMood === 'joy' ? 'Sakura' : 
           currentMood === 'focus' ? 'Cosmic' : 
           currentMood === 'dream' ? 'Ethereal' : 'Blue Mist'
  };

  return (
    <div className={`h-screen w-screen bg-gradient-to-br from-${mood.color}-900 via-${mood.color}-800 to-${mood.color}-900 overflow-hidden`}>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-black/20 backdrop-blur-md z-20 flex items-center justify-between px-6">
        {/* Logo and time */}
        <div className="flex items-center">
          <div className="text-2xl font-bold text-white mr-4">
            LUX
          </div>
          <div className="text-white/80 text-sm">
            <div>{time}</div>
            <div className="text-xs opacity-70">{date}</div>
          </div>
        </div>
        
        {/* Current mood and user stats */}
        <div className="flex items-center">
          <div className="text-white/80 text-sm text-right mr-4">
            <div className="flex items-center">
              <span className="text-xs opacity-70 mr-2">Current Mood:</span>
              <span className="font-medium">{mood.name}</span>
              <span className="ml-1">{mood.emoji}</span>
            </div>
            <div className="text-xs opacity-70">
              Level 1 • 0 XP
            </div>
          </div>
          
          {/* User avatar */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 border border-white/30">
            <span className="text-lg">{mood.emoji}</span>
          </div>
          
          {/* Logout button */}
          <button 
            onClick={onLogout}
            className="ml-4 text-white/60 hover:text-white text-sm"
          >
            Exit
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="pt-24 px-6 pb-6 h-full">
        {/* Welcome message */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to your {mood.theme} Space
          </h1>
          <p className="text-white/70 max-w-2xl">
            Your MoodOS is currently tuned to your {mood.name.toLowerCase()} state. 
            Explore the modules below to enhance your experience.
          </p>
        </div>
        
        {/* Module grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[calc(100%-6rem)] overflow-y-auto pb-8">
          {modules.map((module) => (
            <div 
              key={module.id}
              className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden cursor-pointer border border-white/20 hover:border-white/30 hover:shadow-lg transition-all"
              onClick={() => alert(`${module.name} module would open here`)}
            >
              <div className="p-6 flex flex-col h-full">
                {/* Module icon */}
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl mb-4">
                  {module.icon}
                </div>
                
                {/* Module info */}
                <h3 className="text-white text-xl font-bold mb-2">{module.name}</h3>
                <p className="text-white/70 text-sm mb-4">{module.description}</p>
                
                {/* Open button */}
                <div className="mt-auto">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium">
                    <span>Open Module</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
