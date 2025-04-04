import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { Camera, Volume2, Brain, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const BrailleToSpeech = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        processImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    try {
      const worker = await createWorker('eng');
      const result = await worker.recognize(imageData);
      setRecognizedText(result.data.text);
      await worker.terminate();
      speakText(result.data.text);
    } catch (error) {
      console.error('Error processing image:', error);
    }
    setIsProcessing(false);
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-700 p-8 rounded-xl"
    >
      <div className="flex items-center gap-4 mb-6">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="bg-blue-500 p-3 rounded-lg"
        >
          <Camera className="w-6 h-6" />
        </motion.div>
        <h3 className="text-2xl font-semibold">Braille to Speech</h3>
      </div>

      <div className="space-y-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
        />
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-blue-500 hover:bg-blue-600 p-4 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <Camera className="w-5 h-5" />
          Upload Braille Image
        </motion.button>

        {image && (
          <div className="mt-4">
            <img src={image} alt="Uploaded braille" className="w-full rounded-lg" />
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center justify-center gap-2 text-blue-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing image...
          </div>
        )}

        {recognizedText && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 space-y-4"
          >
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-2">Recognized Text:</h4>
              <p className="text-white">{recognizedText}</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => speakText(recognizedText)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition"
            >
              <Volume2 className="w-5 h-5" />
              Speak Text
            </motion.button>
          </motion.div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-2 text-sm">
            <Brain className="w-4 h-4 text-blue-400" />
            <span>AI Recognition</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Volume2 className="w-4 h-4 text-blue-400" />
            <span>Text to Speech</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Camera className="w-4 h-4 text-blue-400" />
            <span>Image Processing</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BrailleToSpeech;