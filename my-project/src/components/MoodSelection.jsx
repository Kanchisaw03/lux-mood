import { useMood } from '../context/MoodContext';

const localMoodTypes = {
  calm: {
    name: 'Calm',
    emoji: '😌',
    color: 'blue',
    description: 'A tranquil state of mind, like a serene lake at dawn.',
    theme: 'Blue Mist',
    bg: 'bg-blue-900/40',
    border: 'border-blue-500/30',
    text: 'text-blue-200',
    badge: 'bg-blue-500/20',
  },
  joy: {
    name: 'Joy',
    emoji: '😊',
    color: 'pink',
    description: 'Pure happiness, like cherry blossoms dancing in spring.',
    theme: 'Sakura',
    bg: 'bg-pink-900/40',
    border: 'border-pink-500/30',
    text: 'text-pink-200',
    badge: 'bg-pink-500/20',
  },
  focus: {
    name: 'Focus',
    emoji: '🧠',
    color: 'purple',
    description: 'Deep concentration, like stars aligning in perfect clarity.',
    theme: 'Cosmic',
    bg: 'bg-purple-900/40',
    border: 'border-purple-500/30',
    text: 'text-purple-200',
    badge: 'bg-purple-500/20',
  },
  dream: {
    name: 'Dream',
    emoji: '✨',
    color: 'cyan',
    description: 'Imagination unbound, like floating through a fantasy realm.',
    theme: 'Ethereal',
    bg: 'bg-cyan-900/40',
    border: 'border-cyan-500/30',
    text: 'text-cyan-200',
    badge: 'bg-cyan-500/20',
  },
};

const MoodSelection = ({ onMoodSelected }) => {
  const { changeMood } = useMood();

  const handleSelectMood = (mood) => {
    changeMood(mood);
    onMoodSelected();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-blue-800 to-pink-900 px-6 py-16 overflow-y-auto">
      <div className="max-w-5xl mx-auto text-center mb-12 px-4">
        <h1 className="text-4xl font-bold text-white mb-4">Choose Your Mood Spirit</h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Select a mood that resonates with your current emotional state.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {Object.entries(localMoodTypes).map(([key, mood]) => (
          <div
            key={key}
            onClick={() => handleSelectMood(key)}
            className={`${mood.bg} ${mood.border} rounded-xl cursor-pointer hover:shadow-lg transition-shadow`}
          >
            <div className="p-6 flex flex-col items-center text-center h-full">
              <div className="text-5xl mb-4">{mood.emoji}</div>
              <h3 className={`${mood.text} text-xl font-bold mb-2`}>{mood.name}</h3>
              <p className="text-white/70 text-sm mb-4">{mood.description}</p>
              <div className={`${mood.badge} mt-auto px-4 py-2 rounded-full text-white text-sm font-medium`}>
                {mood.theme} Theme
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodSelection;


