import React, { useState, useEffect, useRef } from 'react';

interface TimerProps {
  initialDuration: number;
  onClose: () => void;
}

export default function Timer({ initialDuration, onClose }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          // Optional: play a sound
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const setTime = (seconds: number) => {
    setTimeLeft(seconds);
  };
  
  const addTime = (seconds: number) => {
      setTimeLeft(prev => Math.max(0, prev + seconds));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60] backdrop-blur-sm">
      <div className="bg-secondary p-8 rounded-lg text-center shadow-2xl w-80 border border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-accent">Rest Timer</h3>
        <p className="text-6xl font-mono mb-8 text-white tracking-wider">{formatTime(timeLeft)}</p>
        
        <div className="grid grid-cols-4 gap-2 mb-6">
            {[30, 45, 60, 90].map(time => (
                 <button 
                    key={time}
                    onClick={() => setTime(time)} 
                    className="py-2 bg-primary border border-gray-600 text-gray-300 rounded hover:bg-gray-600 hover:text-white text-sm"
                >
                    {time}s
                </button>
            ))}
        </div>

        <div className="flex justify-center space-x-2 mb-6">
            <button onClick={() => addTime(-10)} className="flex-1 py-2 bg-gray-700 rounded hover:bg-gray-600">-10s</button>
            <button onClick={() => addTime(10)} className="flex-1 py-2 bg-gray-700 rounded hover:bg-gray-600">+10s</button>
        </div>

        <button onClick={onClose} className="w-full py-3 bg-red-600 rounded-md font-semibold hover:bg-red-500 text-white shadow-lg">
            Stop & Close
        </button>
      </div>
    </div>
  );
}