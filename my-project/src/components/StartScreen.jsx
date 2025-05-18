import { useState } from 'react';
import { motion } from 'framer-motion';

const StartScreen = ({ onEnter, audioEnabled, toggleAudio }) => {
  const [hovering, setHovering] = useState(false);
  
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-900 via-blue-800 to-pink-900 flex items-center justify-center overflow-hidden">
      {/* Main content */}
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <h1 className="text-7xl font-bold text-white mb-2">
            LUX
          </h1>
          <div className="w-64 h-1 bg-gradient-to-r from-pink-500 via-blue-400 to-purple-500 rounded-full mx-auto" />
          <h2 className="text-white text-2xl mt-4">The MoodOS Simulator</h2>
        </div>
        
        <div className="mb-12">
          <p className="text-white/80 max-w-md mx-auto">
            A futuristic operating system that adapts to your emotional state.
            Discover a new way to interact with technology through the lens of your mood.
          </p>
        </div>
        
        <button
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={onEnter}
          className={`px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-white font-bold text-lg relative overflow-hidden ${hovering ? 'shadow-lg' : ''}`}
        >
          <span className="relative z-10">Enter MoodOS</span>
        </button>
        
        {/* Audio toggle */}
        <div className="mt-8">
          <button 
            className="text-white/60 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors"
            onClick={toggleAudio}
          >
            <span className="text-xl">
              {audioEnabled ? '🔊' : '🔇'}
            </span>
            <span>{audioEnabled ? 'Sound On' : 'Sound Off'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
