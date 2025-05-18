import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMood } from '../../context/MoodContext';

const PortalQuest = ({ onClose, mood }) => {
  const { addXp } = useMood();
  const [currentQuest, setCurrentQuest] = useState(null);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [questProgress, setQuestProgress] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showReward, setShowReward] = useState(false);
  
  // Load completed quests from localStorage
  useEffect(() => {
    const savedQuests = localStorage.getItem('portalquest-completed');
    if (savedQuests) {
      setCompletedQuests(JSON.parse(savedQuests));
    }
  }, []);
  
  // Save completed quests to localStorage
  useEffect(() => {
    localStorage.setItem('portalquest-completed', JSON.stringify(completedQuests));
  }, [completedQuests]);
  
  // Quests based on mood
  const quests = {
    calm: [
      {
        id: 'calm-breathing',
        title: 'Deep Ocean Breathing',
        description: 'Follow the breathing pattern to find your center.',
        steps: [
          'Find a comfortable position and relax your shoulders.',
          'Breathe in deeply through your nose for 4 counts.',
          'Hold your breath for 4 counts.',
          'Exhale slowly through your mouth for 6 counts.',
          'Repeat this pattern 5 times, focusing on the rhythm.'
        ],
        type: 'breathing',
        reward: 20
      },
      {
        id: 'calm-gratitude',
        title: 'Gratitude Ripples',
        description: 'Reflect on three things you appreciate in this moment.',
        steps: [
          'Close your eyes and take a deep breath.',
          'Think of something in nature youre grateful for.',
          'Think of a person in your life you appreciate.',
          'Think of something about yourself youre thankful for.',
          'Open your eyes and carry this gratitude forward.'
        ],
        type: 'reflection',
        reward: 25
      }
    ],
    joy: [
      {
        id: 'joy-dance',
        title: 'Blossom Dance',
        description: 'Let your body express joy through movement.',
        steps: [
          'Put on your favorite upbeat song.',
          'Start by gently swaying to the rhythm.',
          'Let the movement spread from your core to your limbs.',
          'Dance freely for the duration of one song.',
          'Notice how your energy has shifted.'
        ],
        type: 'movement',
        reward: 20
      },
      {
        id: 'joy-compliments',
        title: 'Kindness Petals',
        description: 'Write three genuine compliments you could give to others.',
        steps: [
          'Think of someone you have interacted with recently.',
          'Write a specific, heartfelt compliment for them.',
          'Repeat for two more people in your life.',
          'Consider sharing these compliments if possible.',
          'Notice how giving kindness creates joy.'
        ],
        type: 'writing',
        reward: 25
      }
    ],
    focus: [
      {
        id: 'focus-pomodoro',
        title: 'Cosmic Concentration',
        description: 'Complete a focused work session using the Pomodoro technique.',
        steps: [
          'Choose one task to work on.',
          'Set a timer for 25 minutes and focus solely on that task.',
          'When the timer ends, take a 5-minute break.',
          'Notice how much you accomplished in that focused time.',
          'Reflect on what helped you maintain concentration.'
        ],
        type: 'productivity',
        reward: 30
      },
      {
        id: 'focus-mindful',
        title: 'Star Gazing',
        description: 'Practice mindful observation to sharpen your focus.',
        steps: [
          'Choose an object in your environment.',
          'Examine it closely for 3 minutes, noticing details.',
          'Describe (or write down) 5 observations about it.',
          'Consider its purpose, origin, and meaning.',
          'Reflect on how this focused attention feels.'
        ],
        type: 'mindfulness',
        reward: 25
      }
    ],
    dream: [
      {
        id: 'dream-imagination',
        title: 'Dream Weaving',
        description: 'Create a short story from random elements.',
        steps: [
          'Imagine a character with an unusual ability.',
          'Place them in an unexpected setting.',
          'Introduce a surprising challenge they must overcome.',
          'Develop how they might resolve this situation.',
          'Reflect on what this story reveals about your creativity.'
        ],
        type: 'creativity',
        reward: 35
      },
      {
        id: 'dream-visualization',
        title: 'Future Vision',
        description: 'Visualize your ideal future self in vivid detail.',
        steps: [
          'Close your eyes and take three deep breaths.',
          'Imagine yourself 5 years from now, living your ideal life.',
          'Notice the details: where you are, what youre doing, how you feel.',
          'Identify one small step you could take toward this vision.',
          'Open your eyes and carry this image with you.'
        ],
        type: 'visualization',
        reward: 30
      }
    ]
  };
  
  // Get quests for current mood
  const moodQuests = quests[mood.name.toLowerCase()] || quests.calm;
  
  // Start a quest
  const startQuest = (quest) => {
    setCurrentQuest(quest);
    setQuestProgress(0);
    setUserInput('');
  };
  
  // Advance to next step in quest
  const advanceQuest = () => {
    if (questProgress < currentQuest.steps.length - 1) {
      setQuestProgress(questProgress + 1);
      setUserInput('');
    } else {
      // Quest completed
      completeQuest();
    }
  };
  
  // Complete current quest
  const completeQuest = () => {
    // Add to completed quests if not already there
    if (!completedQuests.includes(currentQuest.id)) {
      setCompletedQuests([...completedQuests, currentQuest.id]);
      
      // Award XP
      addXp(currentQuest.reward);
      
      // Show reward animation
      setShowReward(true);
      setTimeout(() => {
        setShowReward(false);
        setCurrentQuest(null);
      }, 3000);
    } else {
      // If already completed before, just award half XP
      addXp(Math.floor(currentQuest.reward / 2));
      setCurrentQuest(null);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  return (
    <motion.div
      className={`h-full w-full bg-${mood.color}-800/30 backdrop-blur-md rounded-xl overflow-hidden border border-${mood.color}-500/30 flex flex-col`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className={`p-4 border-b border-${mood.color}-500/30 flex items-center justify-between`}>
        <div className="flex items-center">
          <span className="text-2xl mr-2">✨</span>
          <h2 className={`text-${mood.color}-100 text-xl font-bold`}>Portal Quest</h2>
        </div>
        
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white"
        >
          Close
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {showReward ? (
            <motion.div
              key="reward"
              className="h-full flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.div
                className={`text-6xl mb-4`}
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 1, repeat: 2 }}
              >
                🏆
              </motion.div>
              <h3 className={`text-${mood.color}-100 text-2xl font-bold mb-2`}>Quest Complete!</h3>
              <p className="text-white/80 text-center mb-4">
                You've earned {currentQuest?.reward} XP for your journey.
              </p>
              <motion.div
                className={`px-6 py-3 bg-${mood.color}-500/30 rounded-full text-white font-medium`}
                animate={{ 
                  boxShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 20px rgba(255,255,255,0.5)', '0 0 0px rgba(255,255,255,0)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                +{currentQuest?.reward} XP
              </motion.div>
            </motion.div>
          ) : currentQuest ? (
            <motion.div
              key="quest"
              className="h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Quest header */}
              <div className="mb-8 text-center">
                <h3 className={`text-${mood.color}-100 text-2xl font-bold mb-2`}>{currentQuest.title}</h3>
                <p className="text-white/80">{currentQuest.description}</p>
              </div>
              
              {/* Progress indicator */}
              <div className="flex justify-between mb-6">
                {currentQuest.steps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2 rounded-full ${
                      index <= questProgress 
                        ? `bg-${mood.color}-500` 
                        : 'bg-white/20'
                    }`}
                    style={{ width: `${100 / currentQuest.steps.length - 2}%` }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: index <= questProgress ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                ))}
              </div>
              
              {/* Current step */}
              <motion.div
                className={`flex-1 flex flex-col items-center justify-center p-8 bg-${mood.color}-900/30 rounded-xl border border-${mood.color}-500/30`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-4xl mb-6">
                  {currentQuest.type === 'breathing' ? '🌬️' : 
                   currentQuest.type === 'reflection' ? '💭' :
                   currentQuest.type === 'movement' ? '💃' :
                   currentQuest.type === 'writing' ? '✍️' :
                   currentQuest.type === 'productivity' ? '⏱️' :
                   currentQuest.type === 'mindfulness' ? '👁️' :
                   currentQuest.type === 'creativity' ? '🎨' :
                   currentQuest.type === 'visualization' ? '🔮' : '✨'}
                </div>
                
                <p className="text-white text-xl text-center mb-8">
                  {currentQuest.steps[questProgress]}
                </p>
                
                {/* For writing quests, show input field */}
                {(currentQuest.type === 'writing' || currentQuest.type === 'creativity') && (
                  <textarea
                    className={`w-full max-w-md h-32 p-4 rounded-lg bg-${mood.color}-800/50 border border-${mood.color}-500/30 text-white resize-none focus:outline-none focus:ring-2 focus:ring-${mood.color}-500/50 mb-6`}
                    placeholder="Write your response here..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                  />
                )}
                
                {/* For breathing exercises, show animation */}
                {currentQuest.type === 'breathing' && (
                  <motion.div
                    className={`w-24 h-24 rounded-full bg-${mood.color}-500/30 border-2 border-${mood.color}-400 mb-8 flex items-center justify-center`}
                    animate={{ 
                      scale: [1, 1.3, 1.3, 1],
                    }}
                    transition={{ 
                      duration: 10,
                      times: [0, 0.4, 0.6, 1],
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  >
                    <motion.div
                      className={`w-16 h-16 rounded-full bg-${mood.color}-500/50`}
                      animate={{ 
                        scale: [1, 1.3, 1.3, 1],
                        opacity: [0.7, 1, 1, 0.7]
                      }}
                      transition={{ 
                        duration: 10,
                        times: [0, 0.4, 0.6, 1],
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    />
                  </motion.div>
                )}
                
                <motion.button
                  className={`px-6 py-3 bg-${mood.color}-500 text-white rounded-full font-medium`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={advanceQuest}
                >
                  {questProgress < currentQuest.steps.length - 1 ? 'Continue' : 'Complete Quest'}
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="quest-list"
              className="h-full"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h3 
                className={`text-${mood.color}-100 text-xl font-bold mb-6`}
                variants={itemVariants}
              >
                Available Quests for {mood.name} Mode
              </motion.h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {moodQuests.map(quest => (
                  <motion.div
                    key={quest.id}
                    className={`p-6 bg-${mood.color}-900/30 rounded-xl border border-${mood.color}-500/30 cursor-pointer hover:bg-${mood.color}-800/40 transition-colors`}
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    onClick={() => startQuest(quest)}
                  >
                    <div className="flex items-start mb-3">
                      <div className="text-3xl mr-3">
                        {quest.type === 'breathing' ? '🌬️' : 
                         quest.type === 'reflection' ? '💭' :
                         quest.type === 'movement' ? '💃' :
                         quest.type === 'writing' ? '✍️' :
                         quest.type === 'productivity' ? '⏱️' :
                         quest.type === 'mindfulness' ? '👁️' :
                         quest.type === 'creativity' ? '🎨' :
                         quest.type === 'visualization' ? '🔮' : '✨'}
                      </div>
                      <div>
                        <h4 className={`text-${mood.color}-100 text-lg font-bold`}>{quest.title}</h4>
                        <p className="text-white/70 text-sm">{quest.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className={`px-3 py-1 rounded-full bg-${mood.color}-500/20 text-${mood.color}-200 text-xs font-medium`}>
                        {quest.type}
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-white/70 text-sm mr-1">{quest.reward} XP</span>
                        {completedQuests.includes(quest.id) && (
                          <span className="text-sm" title="Completed">✓</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Other mood quests */}
              <motion.h3 
                className={`text-${mood.color}-100 text-xl font-bold mt-10 mb-6`}
                variants={itemVariants}
              >
                Other Quests
              </motion.h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(quests)
                  .filter(([key]) => key !== mood.name.toLowerCase())
                  .flatMap(([_, questList]) => questList.slice(0, 1))
                  .map(quest => (
                    <motion.div
                      key={quest.id}
                      className={`p-6 bg-${mood.color}-900/30 rounded-xl border border-${mood.color}-500/30 cursor-pointer hover:bg-${mood.color}-800/40 transition-colors`}
                      variants={itemVariants}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      onClick={() => startQuest(quest)}
                    >
                      <div className="flex items-start mb-3">
                        <div className="text-3xl mr-3">
                          {quest.type === 'breathing' ? '🌬️' : 
                           quest.type === 'reflection' ? '💭' :
                           quest.type === 'movement' ? '💃' :
                           quest.type === 'writing' ? '✍️' :
                           quest.type === 'productivity' ? '⏱️' :
                           quest.type === 'mindfulness' ? '👁️' :
                           quest.type === 'creativity' ? '🎨' :
                           quest.type === 'visualization' ? '🔮' : '✨'}
                        </div>
                        <div>
                          <h4 className={`text-${mood.color}-100 text-lg font-bold`}>{quest.title}</h4>
                          <p className="text-white/70 text-sm">{quest.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className={`px-3 py-1 rounded-full bg-${mood.color}-500/20 text-${mood.color}-200 text-xs font-medium`}>
                          {quest.type}
                        </div>
                        
                        <div className="flex items-center">
                          <span className="text-white/70 text-sm mr-1">{quest.reward} XP</span>
                          {completedQuests.includes(quest.id) && (
                            <span className="text-sm" title="Completed">✓</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PortalQuest;
