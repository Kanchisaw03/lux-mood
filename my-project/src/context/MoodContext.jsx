import { createContext, useState, useContext } from 'react';

// Define the mood types and their properties with PNG images and fallback emojis
const moodTypes = {
  calm: {
    name: 'Calm',
    emoji: '😌', // Fallback emoji
    color: 'blue',
    description: 'A tranquil state of mind, like a serene lake at dawn.',
    theme: 'Midnight Serenity'
  },
  joy: {
    name: 'Joy',
    emoji: '😊', // Fallback emoji
    color: 'pink',
    description: 'Pure happiness, like cherry blossoms dancing in spring.',
    theme: 'Neon Sakura'
  },
  focus: {
    name: 'Focus',
    emoji: '🧠', // Fallback emoji
    color: 'purple',
    description: 'Deep concentration, like stars aligning in perfect clarity.',
    theme: 'Cosmic Nexus'
  },
  dream: {
    name: 'Dream',
  
    emoji: '✨', // Fallback emoji
    color: 'cyan',
    description: 'Imagination unbound, like floating through a fantasy realm.',
    theme: 'Ethereal Dreamscape'
  },
  mystery: {
    name: 'Mystery',
    
    emoji: '🌌', // Fallback emoji
    color: 'blue',
    description: 'Enigmatic and profound, like the depths of the cosmos.',
    theme: 'Void Walker'
  },
  energy: {
    name: 'Energy',

    emoji: '⚡', // Fallback emoji
    color: 'amber',
    description: 'Vibrant and electric, like lightning across the night sky.',
    theme: 'Voltage Surge'
  }
};

// Create the context
const MoodContext = createContext();

// Create the provider component
export function MoodProvider({ children }) {
  const [currentMood, setCurrentMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);

  // Add a mood to history and update current mood
  const changeMood = (moodKey) => {
    if (!moodTypes[moodKey]) return;
    
    // Add to history with timestamp
    const newMoodEntry = {
      type: moodKey,
      timestamp: new Date().toISOString()
    };
    
    setMoodHistory([newMoodEntry, ...moodHistory]);
    setCurrentMood(moodKey);
  };

  // Simplified functions
  const addXp = () => {};
  const getUserLevel = () => 1;

  return (
    <MoodContext.Provider
      value={{
        currentMood,
        moodTypes,
        changeMood,
        moodHistory,
        addXp,
        getUserLevel
      }}
    >
      {children}
    </MoodContext.Provider>
  );
}

// Custom hook for using the mood context
export function useMood() {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
}
