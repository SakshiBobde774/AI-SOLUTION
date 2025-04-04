import React, { useRef } from 'react';
import { Eye, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import BrailleToSpeech from './components/BrailleToSpeech';
import SmartNavigation from './components/SmartNavigation';
import CurrencyDocumentReader from './components/CurrencyDocumentReader';
import TimeReader from './components/TimeReader';
import EmergencyContact from './components/EmergencyContact';
import VoiceAssistant from './components/VoiceAssistant';

function App() {
  const emergencyRef = useRef<HTMLDivElement>(null);
  const brailleRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (component: string) => {
    const refs = {
      emergency: emergencyRef,
      braille: brailleRef,
      navigation: navigationRef,
      document: documentRef,
      time: timeRef
    };

    const ref = refs[component as keyof typeof refs];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleEmergency = () => {
    // Trigger emergency button click
    const emergencyButton = emergencyRef.current?.querySelector('button:last-of-type');
    if (emergencyButton) {
      emergencyButton.click();
    }
  };

  const handleTimeRead = () => {
    // Trigger time reader button click
    const timeButton = timeRef.current?.querySelector('button');
    if (timeButton) {
      timeButton.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16">
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-16"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <Eye className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold">VisionAI</span>
          </motion.div>
          <div className="flex gap-6">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="hover:text-blue-400 transition"
            >
              Features
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="hover:text-blue-400 transition"
            >
              How it Works
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="hover:text-blue-400 transition"
            >
              Contact
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
            >
              Try Demo
            </motion.button>
          </div>
        </motion.nav>

        <div className="flex items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1"
          >
            <h1 className="text-5xl font-bold mb-6">
              AI-Powered Accessibility Solutions
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Transform the way you interact with the world using our advanced AI solutions for 
              Braille reading, navigation assistance, and document recognition.
            </p>
            <div className="flex gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg flex items-center gap-2 transition"
              >
                Get Started <ChevronRight className="w-5 h-5" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-gray-500 hover:border-blue-400 px-6 py-3 rounded-lg flex items-center gap-2 transition"
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1"
          >
            <motion.img 
              whileHover={{ scale: 1.05 }}
              src="https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&q=80"
              alt="Person using assistive technology"
              className="rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-slate-800 py-20">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-16"
          >
            Our Solutions
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div ref={brailleRef}>
              <BrailleToSpeech />
            </div>
            <div ref={navigationRef}>
              <SmartNavigation />
            </div>
            <div ref={documentRef}>
              <CurrencyDocumentReader />
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div ref={timeRef}>
              <TimeReader />
            </div>
            <div ref={emergencyRef}>
              <EmergencyContact />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Join thousands of users who are already benefiting from our AI-powered accessibility solutions.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Request Demo
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-blue-400" />
              <span className="font-bold">VisionAI</span>
            </div>
            <p className="text-gray-400">© 2025 VisionAI. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>

      <VoiceAssistant
        onNavigate={handleNavigate}
        onEmergency={handleEmergency}
        onTimeRead={handleTimeRead}
      />
    </div>
  );
}

export default App;