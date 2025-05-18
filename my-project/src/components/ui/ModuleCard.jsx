import { motion } from 'framer-motion';

const ModuleCard = ({ module, mood, onClick, delay = 0 }) => {
  return (
    <motion.div
      className={`bg-${mood.color}-800/40 backdrop-blur-md rounded-xl overflow-hidden cursor-pointer border border-${mood.color}-500/30 h-full`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ 
        y: -10,
        boxShadow: `0 10px 30px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 255, 255, 0.1)`,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Module icon */}
        <div className={`w-16 h-16 rounded-full bg-${mood.color}-500/20 flex items-center justify-center text-3xl mb-4`}>
          {module.icon}
        </div>
        
        {/* Module info */}
        <h3 className={`text-${mood.color}-100 text-xl font-bold mb-2`}>{module.name}</h3>
        <p className="text-white/70 text-sm mb-4">{module.description}</p>
        
        {/* Open button */}
        <div className="mt-auto">
          <div className={`inline-flex items-center px-4 py-2 rounded-full bg-${mood.color}-500/20 text-${mood.color}-200 text-sm font-medium`}>
            <span>Open Module</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModuleCard;
