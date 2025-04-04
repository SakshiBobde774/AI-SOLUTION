import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { Banknote, FileText, Languages, Loader2, Volume2, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CurrencyDocumentReader = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [documentType, setDocumentType] = useState<'currency' | 'document'>('currency');
  const [selectedLanguage, setSelectedLanguage] = useState('eng');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { code: 'eng', name: 'English' },
    { code: 'spa', name: 'Spanish' },
    { code: 'fra', name: 'French' },
    { code: 'deu', name: 'German' },
    { code: 'chi_sim', name: 'Chinese (Simplified)' },
    { code: 'jpn', name: 'Japanese' }
  ];

  const currencyPatterns = {
    USD: {
      symbols: ['$', 'USD', 'DOLLAR', 'DOLLARS'],
      denominations: ['ONE', '1', 'FIVE', '5', 'TEN', '10', 'TWENTY', '20', 'FIFTY', '50', 'HUNDRED', '100'],
      keywords: ['FEDERAL RESERVE', 'THIS NOTE IS LEGAL TENDER', 'TREASURY', 'UNITED STATES']
    },
    EUR: {
      symbols: ['€', 'EUR', 'EURO', 'EUROS'],
      denominations: ['5', '10', '20', '50', '100', '200', '500'],
      keywords: ['EUROPEAN CENTRAL BANK', 'BCE ECB EZB EKP']
    },
    GBP: {
      symbols: ['£', 'GBP', 'POUND', 'POUNDS'],
      denominations: ['5', '10', '20', '50'],
      keywords: ['BANK OF ENGLAND', 'I PROMISE TO PAY']
    }
  };

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

  const detectCurrency = (text: string): { currency: string; denomination: string; confidence: number } | null => {
    const normalizedText = text.toUpperCase();
    
    for (const [currency, patterns] of Object.entries(currencyPatterns)) {
      let matches = 0;
      let denominationFound = '';
      
      // Check for currency symbols and keywords
      patterns.symbols.forEach(symbol => {
        if (normalizedText.includes(symbol)) matches += 2;
      });
      
      patterns.keywords.forEach(keyword => {
        if (normalizedText.includes(keyword)) matches += 3;
      });
      
      // Check for denominations
      patterns.denominations.forEach(denom => {
        if (normalizedText.includes(denom)) {
          matches += 2;
          denominationFound = denom;
        }
      });
      
      // Calculate confidence score (basic implementation)
      const confidence = (matches / (patterns.symbols.length + patterns.keywords.length + 1)) * 100;
      
      if (confidence > 30 && denominationFound) {
        return {
          currency,
          denomination: denominationFound,
          confidence
        };
      }
    }
    
    return null;
  };

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setRecognizedText('');
    try {
      const worker = await createWorker(selectedLanguage);
      
      // Configure worker for better OCR results
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$€£¥',
        tessedit_pageseg_mode: '1',
        tessedit_ocr_engine_mode: '2',
        preserve_interword_spaces: '1'
      });

      const result = await worker.recognize(imageData);
      let processedText = result.data.text;
      
      if (documentType === 'currency') {
        const currencyResult = detectCurrency(processedText);
        
        if (currencyResult) {
          const { currency, denomination, confidence } = currencyResult;
          processedText = `Detected ${currency} note\nDenomination: ${denomination}\nConfidence: ${confidence.toFixed(1)}%\n\nRaw text:\n${processedText}`;
        } else {
          processedText = `Could not confidently detect currency. Please ensure the image is clear and well-lit.\n\nRaw text:\n${processedText}`;
        }
      }
      
      setRecognizedText(processedText);
      speakText(processedText.split('\n')[0]); // Only speak the first line for currency results
      await worker.terminate();
    } catch (error) {
      console.error('Error processing image:', error);
      setRecognizedText('Error processing image. Please try again.');
    }
    setIsProcessing(false);
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage.substring(0, 2);
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
          {documentType === 'currency' ? (
            <Banknote className="w-6 h-6" />
          ) : (
            <FileText className="w-6 h-6" />
          )}
        </motion.div>
        <h3 className="text-2xl font-semibold">Currency & Document Reader</h3>
      </div>

      <div className="space-y-6">
        <div className="flex gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDocumentType('currency')}
            className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition ${
              documentType === 'currency' ? 'bg-blue-500' : 'bg-slate-600'
            }`}
          >
            <Banknote className="w-5 h-5" />
            Currency
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDocumentType('document')}
            className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition ${
              documentType === 'document' ? 'bg-blue-500' : 'bg-slate-600'
            }`}
          >
            <FileText className="w-5 h-5" />
            Document
          </motion.button>
        </div>

        <motion.div
          initial={false}
          animate={{ height: showAdvanced ? 'auto' : '0' }}
          className="overflow-hidden"
        >
          <div className="bg-slate-800 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Languages className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Select Language</span>
            </div>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full bg-slate-600 hover:bg-slate-500 p-2 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <Settings className="w-4 h-4" />
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </motion.button>

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
          {documentType === 'currency' ? (
            <Banknote className="w-5 h-5" />
          ) : (
            <FileText className="w-5 h-5" />
          )}
          Upload {documentType === 'currency' ? 'Currency Note' : 'Document'}
        </motion.button>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {image && (
              <motion.div
                key="image"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4"
              >
                <img src={image} alt="Uploaded content" className="w-full rounded-lg" />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isProcessing && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 text-blue-400 mt-4"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing {documentType}...
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {recognizedText && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4 space-y-4"
              >
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-400 mb-2">Recognized Text:</h4>
                  <p className="text-white whitespace-pre-wrap">{recognizedText}</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => speakText(recognizedText)}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition"
                >
                  <Volume2 className="w-5 h-5" />
                  Read Aloud
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrencyDocumentReader;