import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMood } from '../../context/MoodContext';

const DreamVault = ({ onClose, mood }) => {
  const { addXp } = useMood();
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [activeTab, setActiveTab] = useState('write');
  const [visualMode, setVisualMode] = useState('bubbles');
  
  // Load saved entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('dreamvault-entries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);
  
  // Save entries to localStorage when updated
  useEffect(() => {
    localStorage.setItem('dreamvault-entries', JSON.stringify(entries));
  }, [entries]);
  
  // Handle saving a new entry
  const handleSaveEntry = () => {
    if (!newEntry.trim()) return;
    
    const entry = {
      id: Date.now(),
      text: newEntry,
      date: new Date().toISOString(),
      mood: mood.name,
      color: mood.accent || mood.color
    };
    
    setEntries([entry, ...entries]);
    setNewEntry('');
    
    // Award XP for creating an entry
    addXp(15);
  };
  
  // Delete an entry
  const handleDeleteEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 }
    },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };
  
  // Generate a random position for floating bubbles
  const getRandomPosition = (index, total) => {
    // Use index to distribute bubbles in a more organized way
    const angle = (index / total) * Math.PI * 2;
    const radius = 150 + (index % 3) * 50;
    const x = 250 + Math.cos(angle) * radius;
    const y = 250 + Math.sin(angle) * radius;
    
    return { x, y };
  };
  
  return (
    <motion.div
      className="h-full w-full overflow-hidden glass-dark"
      style={{
        borderRadius: '1rem',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: `${mood.accent}50`,
        boxShadow: `0 0 20px ${mood.accent}30, inset 0 0 30px ${mood.accent}10`
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Header */}
      <motion.div 
        className="p-4 flex items-center justify-between"
        style={{
          borderBottom: `1px solid ${mood.accent}30`,
          background: `linear-gradient(90deg, rgba(0,0,0,0.3), ${mood.accent}10, rgba(0,0,0,0.3))`,
          backdropFilter: 'blur(10px)'
        }}
        variants={itemVariants}
      >
        <div className="flex items-center">
          <div className="text-3xl mr-3">📓</div>
          <div>
            <h2 
              className="text-xl font-bold"
              style={{
                color: mood.accent,
                textShadow: `0 0 5px ${mood.accent}, 0 0 10px ${mood.accent}80`
              }}
            >
              DreamVault
            </h2>
            <div className="text-xs text-white/60">
              {entries.length} {entries.length === 1 ? 'memory' : 'memories'} stored
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 rounded-full text-sm font-medium"
            style={{
              backgroundColor: activeTab === 'write' ? `${mood.accent}30` : 'rgba(0,0,0,0.3)',
              color: activeTab === 'write' ? '#fff' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${activeTab === 'write' ? mood.accent : 'rgba(255,255,255,0.1)'}`,
            }}
            onClick={() => setActiveTab('write')}
          >
            <span className="flex items-center">
              <span className="mr-1">✍️</span> Write
            </span>
          </button>
          
          <button
            className="px-4 py-2 rounded-full text-sm font-medium"
            style={{
              backgroundColor: activeTab === 'visualize' ? `${mood.accent}30` : 'rgba(0,0,0,0.3)',
              color: activeTab === 'visualize' ? '#fff' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${activeTab === 'visualize' ? mood.accent : 'rgba(255,255,255,0.1)'}`,
            }}
            onClick={() => setActiveTab('visualize')}
          >
            <span className="flex items-center">
              <span className="mr-1">🔮</span> Visualize
            </span>
          </button>
          
          <button
            onClick={onClose}
            className="ml-2 px-3 py-1 rounded-full text-white/60 hover:text-white border border-white/10 bg-black/30"
          >
            <span className="text-sm">✕</span>
          </button>
        </div>
      </motion.div>
      
      {/* Content */}
      <div className="p-6 h-[calc(100%-4rem)] overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'write' ? (
            <motion.div 
              key="write"
              className="h-full flex flex-col"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* New entry form */}
              <div className="mb-8 glass-dark rounded-xl p-5">
                <label className="block text-sm font-medium mb-3 flex items-center">
                  Capture your thoughts and dreams...
                </label>
                
                <textarea
                  className="w-full h-40 p-4 rounded-lg text-white resize-none focus:outline-none"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    border: `1px solid ${mood.accent}30`,
                  }}
                  placeholder="What's on your mind today?"
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                />
                
                <div className="flex justify-between items-center mt-3">
                  <div className="text-white/50 text-xs">
                    {newEntry.length} characters
                  </div>
                  
                  <button
                    className="px-5 py-2 rounded-full font-medium text-white"
                    style={{
                      backgroundColor: mood.accent + '90',
                    }}
                    onClick={handleSaveEntry}
                    disabled={!newEntry.trim()}
                  >
                    <span className="flex items-center">
                      <span className="mr-2">💾</span> Save Memory
                    </span>
                  </button>
                </div>
              </div>
              
              {/* Previous entries */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">
                  Your Memory Collection
                </h3>
                
                {entries.length > 0 && (
                  <div className="text-white/60 text-sm">
                    {entries.length} {entries.length === 1 ? 'memory' : 'memories'}
                  </div>
                )}
              </div>
              
              {entries.length === 0 ? (
                <div className="text-center py-12 glass-dark rounded-xl">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-white/70 max-w-md mx-auto">
                    No memories stored yet. Start writing to create your first memory.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 overflow-y-auto pr-2">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-xl overflow-hidden relative group"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${entry.color || mood.accent}40`,
                      }}
                    >
                      <div className="p-4 relative z-10">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <div 
                              className="w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: entry.color || mood.accent }}
                            />
                            <div className="text-white/70 text-sm">
                              {new Date(entry.date).toLocaleDateString()} • {entry.mood}
                            </div>
                          </div>
                          
                          <button
                            className="text-white/40 hover:text-white/90 p-1"
                            onClick={() => handleDeleteEntry(entry.id)}
                          >
                            ✕
                          </button>
                        </div>
                        
                        <p className="text-white/90 whitespace-pre-wrap leading-relaxed">
                          {entry.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="visualize"
              className="h-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Visualization controls */}
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-medium">Memory Visualization</h3>
                
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      visualMode === 'bubbles' 
                        ? `bg-${mood.accent}30 text-white` 
                        : 'text-white/60 hover:text-white'
                    }`}
                    onClick={() => setVisualMode('bubbles')}
                  >
                    Bubbles
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      visualMode === 'timeline' 
                        ? `bg-${mood.accent}30 text-white` 
                        : 'text-white/60 hover:text-white'
                    }`}
                    onClick={() => setVisualMode('timeline')}
                  >
                    Timeline
                  </button>
                </div>
              </div>
              
              {entries.length === 0 ? (
                <div className="text-white/60 text-center py-16 glass-dark rounded-xl">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-white/70 max-w-md mx-auto">
                    No memories to visualize yet. Create some entries first.
                  </p>
                </div>
              ) : visualMode === 'bubbles' ? (
                <div className="relative h-[500px] bg-black/20 rounded-lg overflow-hidden">
                  {entries.map((entry, index) => {
                    // Generate pseudo-random positions
                    const size = 40 + (entry.text.length / 20);
                    const maxSize = Math.min(size, 120);
                    const position = getRandomPosition(index, entries.length);
                    
                    return (
                      <div
                        key={entry.id}
                        className="absolute rounded-full flex items-center justify-center cursor-pointer"
                        style={{
                          width: `${maxSize}px`,
                          height: `${maxSize}px`,
                          left: `${position.x}px`,
                          top: `${position.y}px`,
                          backgroundColor: `${entry.color || mood.accent}40`,
                          border: `1px solid ${entry.color || mood.accent}`,
                          boxShadow: `0 0 15px ${entry.color || mood.accent}50`,
                          transform: `rotate(${Math.random() * 10 - 5}deg)`,
                          transition: 'all 0.3s ease',
                        }}
                        title={entry.text.substring(0, 50) + (entry.text.length > 50 ? '...' : '')}
                      >
                        <div className="text-xs text-white text-center p-2 overflow-hidden">
                          {entry.text.substring(0, 20)}
                          {entry.text.length > 20 && '...'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="relative glass-dark rounded-lg p-6">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/20" />
                  
                  <div className="space-y-8 relative">
                    {entries.map((entry, index) => (
                      <div key={entry.id} className="flex relative">
                        <div 
                          className="w-4 h-4 rounded-full absolute -left-6 mt-1"
                          style={{ 
                            backgroundColor: entry.color || mood.accent,
                            boxShadow: `0 0 10px ${entry.color || mood.accent}`
                          }}
                        />
                        <div className="ml-4">
                          <div className="text-sm text-white/70 mb-1">
                            {new Date(entry.date).toLocaleDateString(undefined, { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${entry.color || mood.accent}40` }}>
                              {entry.mood}
                            </span>
                          </div>
                          <div 
                            className="p-4 rounded-lg"
                            style={{
                              backgroundColor: 'rgba(0,0,0,0.3)',
                              border: `1px solid ${entry.color || mood.accent}40`,
                            }}
                          >
                            <p className="text-white/90 whitespace-pre-wrap">
                              {entry.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DreamVault;
