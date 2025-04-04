import React, { useState } from 'react';
import { Clock, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

const TimeReader = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)
    
    // Add leading zero to minutes if needed
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${hours}:${formattedMinutes} ${ampm}`;
  };

  const speakTime = () => {
    const now = new Date();
    const timeString = formatTime(now);
    setCurrentTime(timeString);

    const utterance = new SpeechSynthesisUtterance(`The current time is ${timeString}`);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-slate-700 rounded-xl">
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="bg-blue-500 p-3 rounded-lg"
        >
          <Clock className="w-6 h-6" />
        </motion.div>
        <h3 className="text-2xl font-semibold">Time Reader</h3>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={speakTime}
        className="w-full bg-blue-500 hover:bg-blue-600 p-4 rounded-lg flex items-center justify-center gap-2 transition"
      >
        <Volume2 className="w-5 h-5" />
        Speak Current Time
      </motion.button>

      {currentTime && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-blue-400"
        >
          {currentTime}
        </motion.div>
      )}
    </div>
  );
};

export default TimeReader;