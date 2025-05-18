import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMood } from '../../context/MoodContext';

const EmotionArchive = ({ onClose, mood }) => {
  const { moodHistory, moodTypes } = useMood();
  const [viewMode, setViewMode] = useState('constellation');
  const canvasRef = useRef(null);
  
  // Prepare data for visualization
  const moodData = moodHistory.map(entry => ({
    ...entry,
    date: new Date(entry.timestamp),
    color: moodTypes[entry.type]?.color || mood.color
  }));
  
  // Group mood data by day for timeline view
  const groupedByDay = moodData.reduce((acc, entry) => {
    const dateKey = entry.date.toLocaleDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(entry);
    return acc;
  }, {});
  
  // Sort days for timeline
  const sortedDays = Object.keys(groupedByDay).sort((a, b) => {
    return new Date(b) - new Date(a);
  });
  
  // Draw constellation visualization
  useEffect(() => {
    if (viewMode === 'constellation' && canvasRef.current && moodData.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Map mood types to positions in the canvas
      const moodPositions = {
        calm: { x: canvas.width * 0.2, y: canvas.height * 0.7 },
        joy: { x: canvas.width * 0.8, y: canvas.height * 0.3 },
        focus: { x: canvas.width * 0.3, y: canvas.height * 0.2 },
        dream: { x: canvas.width * 0.7, y: canvas.height * 0.8 }
      };
      
      // Map colors to mood types
      const moodColors = {
        calm: '#5c70ff',
        joy: '#ff5cb0',
        focus: '#9747ff',
        dream: '#00d0ff'
      };
      
      // Draw connections between consecutive moods
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      // Only connect points if there are at least 2
      if (moodData.length >= 2) {
        for (let i = 0; i < moodData.length - 1; i++) {
          const current = moodData[i];
          const next = moodData[i + 1];
          
          // Get base positions for the mood types
          const currentBase = moodPositions[current.type] || { x: canvas.width / 2, y: canvas.height / 2 };
          const nextBase = moodPositions[next.type] || { x: canvas.width / 2, y: canvas.height / 2 };
          
          // Add some random variation to make it more organic
          const currentX = currentBase.x + (Math.random() * 60 - 30);
          const currentY = currentBase.y + (Math.random() * 60 - 30);
          const nextX = nextBase.x + (Math.random() * 60 - 30);
          const nextY = nextBase.y + (Math.random() * 60 - 30);
          
          // Create gradient for line
          const gradient = ctx.createLinearGradient(currentX, currentY, nextX, nextY);
          gradient.addColorStop(0, moodColors[current.type] || '#ffffff');
          gradient.addColorStop(1, moodColors[next.type] || '#ffffff');
          
          ctx.strokeStyle = gradient;
          ctx.globalAlpha = 0.4;
          ctx.beginPath();
          ctx.moveTo(currentX, currentY);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();
        }
      }
      
      // Draw stars for each mood entry
      moodData.forEach((entry, index) => {
        const basePosition = moodPositions[entry.type] || { x: canvas.width / 2, y: canvas.height / 2 };
        
        // Add some random variation
        const x = basePosition.x + (Math.random() * 60 - 30);
        const y = basePosition.y + (Math.random() * 60 - 30);
        
        // Star size based on mood level
        const size = 3 + (entry.level || 1) * 1.5;
        
        // Draw glow
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = moodColors[entry.type] || '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw star
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = moodColors[entry.type] || '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add highlight
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw label for recent entries
        if (index < 3) {
          ctx.font = '12px Arial';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText(entry.date.toLocaleDateString(), x, y + size + 15);
        }
      });
      
      // Draw mood type labels
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 1;
      
      Object.entries(moodPositions).forEach(([type, position]) => {
        ctx.fillStyle = moodColors[type] || '#ffffff';
        ctx.fillText(moodTypes[type]?.name || type, position.x, position.y - 20);
      });
    }
  }, [viewMode, moodData, moodTypes, mood.color]);
  
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
          <span className="text-2xl mr-2">🌠</span>
          <h2 className={`text-${mood.color}-100 text-xl font-bold`}>Emotion Archive</h2>
        </div>
        
        <div className="flex items-center">
          <div className="flex mr-4">
            <button
              className={`px-4 py-2 rounded-l-full text-sm font-medium ${
                viewMode === 'constellation' 
                  ? `bg-${mood.color}-500 text-white` 
                  : `bg-${mood.color}-900/50 text-white/70 hover:text-white`
              }`}
              onClick={() => setViewMode('constellation')}
            >
              Constellation
            </button>
            <button
              className={`px-4 py-2 rounded-r-full text-sm font-medium ${
                viewMode === 'timeline' 
                  ? `bg-${mood.color}-500 text-white` 
                  : `bg-${mood.color}-900/50 text-white/70 hover:text-white`
              }`}
              onClick={() => setViewMode('timeline')}
            >
              Timeline
            </button>
          </div>
          
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {moodHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/60">
            <div className="text-5xl mb-4">🌠</div>
            <p className="text-center max-w-md">
              Your Emotion Archive is empty. As you use MoodOS, your mood history will be visualized here as a beautiful constellation.
            </p>
          </div>
        ) : viewMode === 'constellation' ? (
          <div className="h-full">
            <div className="mb-4 text-white/70">
              <p>Your mood journey visualized as a constellation. Each star represents a recorded mood state.</p>
            </div>
            
            <div className="h-[500px] bg-black/40 rounded-xl overflow-hidden relative">
              <canvas ref={canvasRef} className="w-full h-full" />
              
              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
                <div className="text-white/90 text-sm font-medium mb-2">Legend</div>
                {Object.entries(moodTypes).map(([key, value]) => (
                  <div key={key} className="flex items-center mb-1 last:mb-0">
                    <div className={`w-3 h-3 rounded-full bg-${value.color}-500 mr-2`} />
                    <div className="text-white/80 text-xs">{value.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full">
            <div className="mb-4 text-white/70">
              <p>Your mood history displayed chronologically. Scroll to see your full history.</p>
            </div>
            
            <div className="space-y-6">
              {sortedDays.map(day => (
                <div key={day} className="bg-black/20 rounded-lg p-4">
                  <h3 className={`text-${mood.color}-200 font-medium mb-3`}>{day}</h3>
                  
                  <div className="space-y-3">
                    {groupedByDay[day].map((entry, index) => (
                      <motion.div
                        key={entry.timestamp}
                        className={`p-3 bg-${entry.color}-900/40 rounded-lg border-l-2 border-${entry.color}-500`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">
                            {moodTypes[entry.type]?.emoji || '✨'}
                          </div>
                          <div>
                            <div className={`text-${entry.color}-200 font-medium`}>
                              {moodTypes[entry.type]?.name || 'Unknown'}
                            </div>
                            <div className="text-white/60 text-sm">
                              {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {entry.level && ` • Intensity: ${entry.level}/10`}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EmotionArchive;
