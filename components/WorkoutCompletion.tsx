
import React, { useState } from 'react';
import { WorkoutLog } from '../types';

interface WorkoutCompletionProps {
  workoutData: Omit<WorkoutLog, 'id' | 'postWorkoutNotes'>;
  onSave: (log: WorkoutLog) => void;
  onCancel: () => void;
}

const motivationalPhrases = [
  "Well done! Every rep, every set, every drop of sweat is a step towards your goal.",
  "Workout complete! You've just invested in yourself. Be proud.",
  "You crushed it! Remember this feeling of accomplishment.",
  "That's how it's done! Rest up, recover, and get ready to conquer the next one.",
  "Awesome session! You're building a stronger version of yourself, one workout at a time."
];

export default function WorkoutCompletion({ workoutData, onSave, onCancel }: WorkoutCompletionProps) {
  const [notes, setNotes] = useState('');
  const [motivation] = useState(motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]);

  const handleSave = () => {
    const finalLog: WorkoutLog = {
      id: crypto.randomUUID(),
      ...workoutData,
      postWorkoutNotes: notes,
    };
    onSave(finalLog);
  };
  
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 bg-primary bg-opacity-95 flex flex-col items-center justify-center z-50 p-4 text-center animate-fade-in">
        <div className="bg-secondary p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-1 text-accent">Workout Finished!</h2>
            <p className="text-gray-400 mb-4 text-sm">Total Time: <span className="text-light font-mono">{formatDuration(workoutData.durationSeconds)}</span></p>
            
            <p className="text-lg text-gray-300 mb-6 italic">"{motivation}"</p>

            <div className="w-full mb-6 text-left">
                <label htmlFor="workout-notes" className="block text-sm font-medium text-gray-300 mb-2">How did you feel?</label>
                <textarea
                    id="workout-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-primary p-2 rounded-md mt-1 text-sm text-light focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="e.g., Felt strong on squats, but biceps were a bit fatigued..."
                    rows={4}
                />
            </div>

            <div className="w-full flex flex-col space-y-2">
                <button onClick={handleSave} className="w-full py-3 px-4 bg-accent text-primary rounded-md font-semibold hover:bg-green-300 transition-colors">
                    Save & Complete
                </button>
                <button onClick={onCancel} className="w-full py-2 px-4 bg-gray-600 text-light rounded-md font-semibold hover:bg-gray-500 transition-colors">
                    Go Back
                </button>
            </div>
        </div>
    </div>
  );
}
