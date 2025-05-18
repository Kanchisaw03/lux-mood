import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useMood } from '../../context/MoodContext';

const ButterflyBoard = ({ onClose, mood }) => {
  const { addXp } = useMood();
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  // Load saved notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('butterflyboard-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);
  
  // Save notes to localStorage when updated
  useEffect(() => {
    localStorage.setItem('butterflyboard-notes', JSON.stringify(notes));
  }, [notes]);
  
  // Add a new note
  const addNote = () => {
    if (!newNoteText.trim()) return;
    
    const newNote = {
      id: Date.now(),
      text: newNoteText,
      color: mood.color,
      position: {
        x: Math.random() * 400 - 200,
        y: Math.random() * 200 - 100,
        z: Math.random() * 50
      },
      rotation: Math.random() * 10 - 5,
      createdAt: new Date().toISOString()
    };
    
    setNotes([...notes, newNote]);
    setNewNoteText('');
    setIsCreating(false);
    
    // Award XP for creating a note
    addXp(10);
  };
  
  // Delete a note
  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };
  
  // Note component with draggable functionality
  const Note = ({ note, onDelete }) => {
    const x = useMotionValue(note.position.x);
    const y = useMotionValue(note.position.y);
    const scale = useTransform(y, [-300, 0, 300], [0.8, 1, 0.8]);
    const rotate = useMotionValue(note.rotation);
    
    // Random butterfly type
    const butterflyType = ['🦋', '🦋', '🦋', '🧚‍♀️', '✨'][Math.floor(Math.random() * 5)];
    
    return (
      <motion.div
        className="absolute"
        style={{
          x,
          y,
          scale,
          rotate,
          zIndex: 10 + note.position.z,
        }}
        drag
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 10 }}
        whileDrag={{ scale: 1.1, zIndex: 100 }}
        whileTap={{ cursor: "grabbing" }}
      >
        <motion.div
          className={`w-48 min-h-[120px] p-4 bg-${note.color}-900/70 backdrop-blur-md rounded-lg shadow-lg border border-${note.color}-500/30 cursor-grab relative overflow-visible`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ boxShadow: `0 0 20px rgba(255, 255, 255, 0.3)` }}
        >
          {/* Butterfly decoration */}
          <motion.div
            className="absolute -top-6 -right-4 text-xl"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            {butterflyType}
          </motion.div>
          
          {/* Note content */}
          <p className="text-white whitespace-pre-wrap break-words">{note.text}</p>
          
          {/* Date and delete button */}
          <div className="flex justify-between items-center mt-3 text-xs text-white/60">
            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
            <button
              onClick={() => onDelete(note.id)}
              className="text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
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
          <span className="text-2xl mr-2">🦋</span>
          <h2 className={`text-${mood.color}-100 text-xl font-bold`}>Butterfly Board</h2>
        </div>
        
        <div className="flex items-center">
          <button
            onClick={() => setIsCreating(true)}
            className={`mr-4 px-4 py-2 bg-${mood.color}-500 text-white rounded-full text-sm font-medium flex items-center`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Note
          </button>
          
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
      
      {/* 3D space for notes */}
      <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-black/30 to-black/10">
        {/* Perspective container */}
        <div className="absolute inset-0 perspective-1000">
          {/* Center point for the 3D space */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {notes.map(note => (
              <Note 
                key={note.id} 
                note={note} 
                onDelete={deleteNote} 
              />
            ))}
          </div>
        </div>
        
        {/* Empty state */}
        {notes.length === 0 && !isCreating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60">
            <div className="text-5xl mb-4">🦋</div>
            <p className="text-center max-w-md">
              Your Butterfly Board is empty. Create notes and watch them float in 3D space.
            </p>
            <motion.button
              className={`mt-4 px-4 py-2 bg-${mood.color}-500 text-white rounded-full text-sm font-medium`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreating(true)}
            >
              Create Your First Note
            </motion.button>
          </div>
        )}
      </div>
      
      {/* New note creation panel */}
      <motion.div
        className={`absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-6 z-50`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isCreating ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: isCreating ? 'auto' : 'none' }}
      >
        <motion.div
          className={`w-full max-w-md bg-${mood.color}-900/80 backdrop-blur-md rounded-xl p-6 border border-${mood.color}-500/30 shadow-glow-${mood.color}`}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: isCreating ? 1 : 0.9, y: isCreating ? 0 : 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <h3 className={`text-${mood.color}-100 text-xl font-bold mb-4`}>Create a New Note</h3>
          
          <textarea
            className={`w-full h-32 p-4 rounded-lg bg-${mood.color}-800/50 border border-${mood.color}-500/30 text-white resize-none focus:outline-none focus:ring-2 focus:ring-${mood.color}-500/50 mb-4`}
            placeholder="Write your note here..."
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            autoFocus
          />
          
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 text-white/70 hover:text-white"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </button>
            
            <motion.button
              className={`px-4 py-2 bg-${mood.color}-500 text-white rounded-full font-medium`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addNote}
            >
              Create Note
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ButterflyBoard;
