import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Volume2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Obstacle {
  id: number;
  distance: number;
  direction: string;
}

const SmartNavigation = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<GeolocationCoordinates | null>(null);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [navigationInstructions, setNavigationInstructions] = useState('');

  useEffect(() => {
    let watchId: number;
    
    if (isNavigating) {
      // Start GPS tracking
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation(position.coords);
          simulateObstacleDetection();
        },
        (error) => console.error('Error getting location:', error),
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isNavigating]);

  const simulateObstacleDetection = () => {
    // Simulate obstacle detection (in a real app, this would use sensors/camera)
    const simulatedObstacles = [
      { id: 1, distance: Math.random() * 5 + 1, direction: 'ahead' },
      { id: 2, distance: Math.random() * 3 + 1, direction: 'right' },
    ].filter(() => Math.random() > 0.5);

    setObstacles(simulatedObstacles);

    // Generate and speak navigation instructions
    if (simulatedObstacles.length > 0) {
      const instructions = simulatedObstacles
        .map(obs => `Obstacle ${obs.direction}, ${obs.distance.toFixed(1)} meters`)
        .join('. ');
      setNavigationInstructions(instructions);
      speakText(instructions);
    }
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2;
    window.speechSynthesis.speak(utterance);
  };

  const toggleNavigation = () => {
    setIsNavigating(!isNavigating);
    if (!isNavigating) {
      speakText('Starting navigation assistance');
    } else {
      speakText('Navigation stopped');
      setObstacles([]);
      setNavigationInstructions('');
    }
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
          <Navigation className="w-6 h-6" />
        </motion.div>
        <h3 className="text-2xl font-semibold">Smart Navigation</h3>
      </div>

      <div className="space-y-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleNavigation}
          className={`w-full p-4 rounded-lg flex items-center justify-center gap-2 transition ${
            isNavigating ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          <Navigation className="w-5 h-5" />
          {isNavigating ? 'Stop Navigation' : 'Start Navigation'}
        </motion.button>

        {isNavigating && currentLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Current Location</span>
              </div>
              <p className="text-sm">
                Lat: {currentLocation.latitude.toFixed(6)}<br />
                Long: {currentLocation.longitude.toFixed(6)}
              </p>
            </div>

            {obstacles.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 text-yellow-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Detected Obstacles</span>
                </div>
                {obstacles.map(obstacle => (
                  <div
                    key={obstacle.id}
                    className="bg-slate-800 p-3 rounded-lg flex items-center justify-between"
                  >
                    <span>{obstacle.direction}</span>
                    <span className="text-blue-400">{obstacle.distance.toFixed(1)}m</span>
                  </div>
                ))}
              </motion.div>
            )}

            {navigationInstructions && (
              <div className="bg-blue-900/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-400">Navigation Instructions</span>
                </div>
                <p>{navigationInstructions}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SmartNavigation;