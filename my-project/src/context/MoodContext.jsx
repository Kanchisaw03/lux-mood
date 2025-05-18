import { createContext, useState, useContext } from 'react';

// Define the mood types and their properties (simplified)
const moodTypes = {
  calm: {
    name: 'Calm',
    emoji: '😌',
    color: 'blue',
    description: 'A tranquil state of mind, like a serene lake at dawn.',
    theme: 'Blue Mist'
  },
  joy: {
    name: 'Joy',
    emoji: '😊',
    color: 'pink',
    description: 'Pure happiness, like cherry blossoms dancing in spring.',
    theme: 'Sakura'
  },
  focus: {
    name: 'Focus',
    emoji: '🧠',
    color: 'purple',
    description: 'Deep concentration, like stars aligning in perfect clarity.',
    theme: 'Cosmic'
  },
  dream: {
    name: 'Dream',
    emoji: '✨',
    color: 'cyan',
    description: 'Imagination unbound, like floating through a fantasy realm.',
    theme: 'Ethereal'
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
