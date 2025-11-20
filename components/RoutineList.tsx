import React from 'react';
import { Routine } from '../types';
import { PlusIcon, TrashIcon } from './icons/Icons';

interface RoutineListProps {
  routines: Routine[];
  onStartWorkout: (routine: Routine) => void;
  onEditRoutine: (routine: Routine) => void;
  onDeleteRoutine: (routineId: string) => void;
  onAddNew: () => void;
}

export default function RoutineList({ routines, onStartWorkout, onEditRoutine, onDeleteRoutine, onAddNew }: RoutineListProps) {
  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-light">Your Routines</h2>
        <button
            onClick={onAddNew}
            className="bg-accent text-primary font-bold py-2 px-4 rounded-full flex items-center shadow-lg hover:bg-green-300 transition-colors"
        >
            <PlusIcon />
            <span className="ml-2">New Routine</span>
        </button>
       </div>
      {routines.length === 0 ? (
        <div className="text-center py-10 px-4 bg-secondary rounded-lg">
          <p className="text-gray-400">No routines found.</p>
          <p className="text-gray-400">Click "New Routine" to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routines.map(routine => (
            <div key={routine.id} className="bg-secondary rounded-lg shadow-lg p-4 flex flex-col justify-between transition-transform hover:scale-105">
              <div>
                <h3 className="text-lg font-bold text-accent truncate">{routine.name}</h3>
                <ul className="mt-2 text-sm text-gray-300 list-disc list-inside">
                  {routine.exercises.slice(0, 4).map(ex => (
                    <li key={ex.id} className="truncate">{ex.name}</li>
                  ))}
                  {routine.exercises.length > 4 && <li className="text-gray-500">...and more</li>}
                </ul>
              </div>
              <div className="mt-4 flex space-x-2">
                 <button 
                  onClick={() => onStartWorkout(routine)} 
                  className="flex-1 bg-accent text-primary font-bold py-2 px-4 rounded-md hover:bg-green-300 transition-colors"
                >
                  Start
                </button>
                <button 
                  onClick={() => onEditRoutine(routine)} 
                  className="bg-gray-600 text-light py-2 px-4 rounded-md hover:bg-gray-500 transition-colors"
                >
                  Edit
                </button>
                 <button 
                  onClick={() => onDeleteRoutine(routine.id)} 
                  className="bg-red-700 text-light p-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
