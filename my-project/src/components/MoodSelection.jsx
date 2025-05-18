import { useMood } from '../context/MoodContext';
import { useEffect } from 'react';

// Mood types with emojis
const localMoodTypes = {
  calm: {
    name: 'Calm',
    emoji: '😌',
    color: '#3b82f6',
    description: 'A tranquil state of mind, like a serene lake at dawn.',
    theme: 'Midnight Serenity',
    bgColor: '#0f172a',
  },
  joy: {
    name: 'Joy',
    emoji: '😊',
    color: '#ec4899',
    description: 'Pure happiness, like cherry blossoms dancing in spring.',
    theme: 'Neon Sakura',
    bgColor: '#0f172a',
  },
  focus: {
    name: 'Focus',
    emoji: '🧠',
    color: '#a855f7',
    description: 'Deep concentration, like stars aligning in perfect clarity.',
    theme: 'Cosmic Nexus',
    bgColor: '#0f172a',
  },
  dream: {
    name: 'Dream',
    emoji: '✨',
    color: '#06b6d4',
    description: 'Imagination unbound, like floating through a fantasy realm.',
    theme: 'Ethereal Dreamscape',
    bgColor: '#0f172a',
  },
  mystery: {
    name: 'Mystery',
    emoji: '🌌',
    color: '#3b82f6',
    description: 'Enigmatic and profound, like the depths of the cosmos.',
    theme: 'Void Walker',
    bgColor: '#0f172a',
  },
  energy: {
    name: 'Energy',
    emoji: '⚡',
    color: '#f59e0b',
    description: 'Vibrant and electric, like lightning across the night sky.',
    theme: 'Voltage Surge',
    bgColor: '#0f172a',
  },
};

const MoodSelection = ({ onMoodSelected }) => {
  const { changeMood } = useMood();

  // Handle mood selection
  const handleSelectMood = (mood) => {
    changeMood(mood);
    onMoodSelected();
  };

  // Apply a direct fix for scrolling
  useEffect(() => {
    // Force document to be scrollable
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    
    // Add a style tag with !important rules
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      body, html {
        overflow: auto !important;
        height: auto !important;
        position: static !important;
      }
      .mood-container {
        position: relative !important;
        height: auto !important;
        min-height: 100vh !important;
        overflow-y: auto !important;
        padding-bottom: 100px !important;
      }
    `;
    document.head.appendChild(styleEl);
    
    // Force scroll to top
    window.scrollTo(0, 0);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <div className="mood-container" style={{
      background: 'linear-gradient(to bottom right, #2e1065, #111827)',
      minHeight: '100vh',
      overflowY: 'auto',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '32px' }}>
        {/* Header */}
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: '24px' }}>
          Choose Your Mood Spirit
        </h1>

        {/* Description box */}
        <div style={{ 
          maxWidth: '500px', 
          margin: '0 auto 48px auto', 
          background: 'rgba(126, 34, 206, 0.2)', 
          border: '1px solid rgba(139, 92, 246, 0.2)', 
          borderRadius: '12px', 
          padding: '16px', 
          textAlign: 'center' 
        }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Select a mood that resonates with your current emotional state. Each mood unlocks a unique experience tailored to your feelings.
          </p>
        </div>

        {/* Mood grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {Object.entries(localMoodTypes).map(([key, mood]) => (
            <div 
              key={key}
              onClick={() => handleSelectMood(key)}
              style={{
                background: '#111827',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                transition: 'transform 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                {/* Emoji icon */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
                }}>
                  <span style={{ fontSize: '4rem' }}>{mood.emoji}</span>
                </div>
                
                {/* Title */}
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  marginBottom: '8px',
                  color: mood.color
                }}>
                  {mood.name}
                </h3>
                
                {/* Description */}
                <p style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.875rem',
                  marginBottom: '16px'
                }}>
                  {mood.description}
                </p>
                
                {/* Theme badge */}
                <div style={{
                  marginTop: 'auto',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  background: `linear-gradient(to right, ${mood.color}40, ${mood.color}20)`
                }}>
                  {mood.theme} →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodSelection;


