import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceAssistantProps {
  onNavigate: (component: string) => void;
  onEmergency: () => void;
  onTimeRead: () => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  onNavigate,
  onEmergency,
  onTimeRead
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      setRecognition(recognitionInstance);
    }
  }, []);

  const speak = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
    setFeedback(text);
  }, []);

  const handleResult = useCallback((event: SpeechRecognitionEvent) => {
    const last = event.results.length - 1;
    const command = event.results[last][0].transcript.toLowerCase().trim();
    setTranscript(command);

    // Process commands
    if (command.includes('emergency')) {
      speak('Opening emergency contacts');
      onNavigate('emergency');
    } else if (command.includes('time')) {
      speak('Reading current time');
      onTimeRead();
    } else if (command.includes('send help')) {
      speak('Sending emergency messages');
      onEmergency();
    } else if (command.includes('braille')) {
      speak('Opening Braille reader');
      onNavigate('braille');
    } else if (command.includes('navigation')) {
      speak('Opening smart navigation');
      onNavigate('navigation');
    } else if (command.includes('document') || command.includes('currency')) {
      speak('Opening document and currency reader');
      onNavigate('document');
    } else {
      speak("I didn't understand that command. Try saying 'open emergency' or 'read time'");
    }
  }, [speak, onNavigate, onEmergency, onTimeRead]);

  const toggleListening = useCallback(() => {
    if (!recognition) {
      speak('Voice recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      speak('Listening for commands');
    }
  }, [recognition, isListening, speak]);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = handleResult;
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      speak('Sorry, there was an error with voice recognition');
    };

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
    };
  }, [recognition, handleResult, speak]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <motion.div
        className="bg-slate-700 p-6 rounded-2xl shadow-xl"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex flex-col items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleListening}
            className={`p-4 rounded-full transition ${
              isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isListening ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <MicOff className="w-6 h-6" />
              </motion.div>
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </motion.button>

          <AnimatePresence mode="wait">
            {(isListening || transcript || feedback) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-center"
              >
                {isListening && (
                  <motion.div
                    className="flex items-center gap-2 text-blue-400"
                    animate={{ opacity: [0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Listening...
                  </motion.div>
                )}
                {transcript && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-gray-400 mt-2"
                  >
                    You said: "{transcript}"
                  </motion.p>
                )}
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-green-400 mt-2"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm">{feedback}</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VoiceAssistant;