
import React, { useState, useEffect, useRef } from 'react';
import { Routine, WorkoutLog, CompletedExercise, CompletedSet } from '../types';
import Timer from './Timer';
import WorkoutCompletion from './WorkoutCompletion';

interface WorkoutSessionProps {
  routine: Routine;
  onFinish: (log: WorkoutLog) => void;
  onCancel: () => void;
}

export default function WorkoutSession({ routine, onFinish, onCancel }: WorkoutSessionProps) {
  const startTimeRef = useRef(Date.now());
  
  const [completedExercises, setCompletedExercises] = useState<CompletedExercise[]>(() => 
    routine.exercises.map(ex => ({
      exerciseId: ex.id,
      name: ex.name,
      sets: Array.from({ length: ex.sets }, () => ({ reps: 0, weight: ex.weight, completed: false }))
    }))
  );
  
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const [timerDuration, setTimerDuration] = useState(60);
  const [isCompleting, setIsCompleting] = useState(false);
  const [finalDuration, setFinalDuration] = useState(0);

  // Update start time on mount just in case, though ref init is usually fine.
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const handleSetChange = (exIndex: number, setIndex: number, field: keyof CompletedSet, value: number | boolean) => {
    setCompletedExercises(currentExercises =>
      currentExercises.map((exercise, i) => {
        if (i !== exIndex) {
          return exercise;
        }
        return {
          ...exercise,
          sets: exercise.sets.map((set, j) => {
            if (j !== setIndex) {
              return set;
            }
            // Coalesce NaN to 0 if the input is cleared for numbers
            const newValue = (typeof value === 'number' && isNaN(value)) ? 0 : value;
            return { ...set, [field]: newValue };
          }),
        };
      })
    );
  };
  
  const handleFinishWorkout = () => {
    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setFinalDuration(duration);
    setIsCompleting(true);
  };

  const startTimer = (seconds: number) => {
    setTimerDuration(seconds);
    setIsTimerVisible(true);
  };

  if (isCompleting) {
    const workoutData: Omit<WorkoutLog, 'id' | 'postWorkoutNotes'> = {
      routineId: routine.id,
      routineName: routine.name,
      date: new Date().toISOString(),
      durationSeconds: finalDuration,
      completedExercises: completedExercises,
    };
    return <WorkoutCompletion workoutData={workoutData} onSave={onFinish} onCancel={() => setIsCompleting(false)} />;
  }

  return (
    <div className="min-h-screen bg-primary text-light p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-accent text-center">{routine.name}</h2>
      
      <div className="flex-grow space-y-4 overflow-y-auto pr-2 pb-24">
        {completedExercises.map((ex, exIndex) => (
          <div key={ex.exerciseId} className="bg-secondary p-4 rounded-lg">
            <h3 className="font-bold text-lg">{ex.name}</h3>
            {routine.exercises[exIndex]?.notes && (
              <p className="text-sm text-gray-400 mt-1 mb-3 p-2 bg-primary rounded-md italic">
                {routine.exercises[exIndex].notes}
              </p>
            )}
            <div className="mt-2 space-y-2">
              {ex.sets.map((set, setIndex) => (
                <div key={setIndex} className={`flex items-center space-x-2 text-sm p-1 rounded-md transition-colors ${set.completed ? 'bg-green-900/30' : ''}`}>
                  <div className="flex items-center justify-center w-8 h-8 shrink-0">
                     <input 
                        type="checkbox" 
                        checked={set.completed} 
                        onChange={e => handleSetChange(exIndex, setIndex, 'completed', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-500 text-accent focus:ring-accent bg-primary cursor-pointer"
                     />
                  </div>
                  <span className="w-6 text-gray-400 text-center font-mono">{setIndex + 1}</span>
                  <div className="flex-1">
                    <input type="number" value={set.weight || ''} onChange={e => handleSetChange(exIndex, setIndex, 'weight', parseFloat(e.target.value))} className="w-full bg-primary p-2 rounded-md text-center" placeholder="kg" />
                  </div>
                   <span className="text-gray-400">x</span>
                  <div className="flex-1">
                     <input type="number" value={set.reps || ''} onChange={e => handleSetChange(exIndex, setIndex, 'reps', parseInt(e.target.value))} className="w-full bg-primary p-2 rounded-md text-center" placeholder="reps" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-secondary p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] space-y-3 z-10">
        <div className="flex items-center justify-between space-x-2">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider shrink-0">Rest Timer</span>
            <div className="flex space-x-2 overflow-x-auto no-scrollbar">
                {[30, 45, 60, 90].map(time => (
                    <button 
                        key={time}
                        onClick={() => startTimer(time)} 
                        className="py-2 px-3 bg-blue-600/20 border border-blue-600 text-blue-400 rounded-md text-sm font-semibold hover:bg-blue-600 hover:text-white transition-colors whitespace-nowrap"
                    >
                        {time}s
                    </button>
                ))}
            </div>
        </div>
        <div className="flex space-x-2">
            <button onClick={onCancel} className="flex-1 py-3 px-4 bg-gray-600 rounded-md font-semibold hover:bg-gray-500">Cancel</button>
            <button onClick={handleFinishWorkout} className="flex-1 py-3 px-4 bg-accent text-primary rounded-md font-semibold hover:bg-green-300">Finish</button>
        </div>
      </div>
      
      {isTimerVisible && <Timer initialDuration={timerDuration} onClose={() => setIsTimerVisible(false)} />}
    </div>
  );
}
