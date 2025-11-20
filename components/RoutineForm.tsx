import React, { useState } from 'react';
import { Routine, Exercise } from '../types';
import { PlusIcon, TrashIcon } from './icons/Icons';

interface RoutineFormProps {
  routineToEdit?: Routine | null;
  onSave: (routine: Routine) => void;
  onCancel: () => void;
}

export default function RoutineForm({ routineToEdit, onSave, onCancel }: RoutineFormProps) {
  const [name, setName] = useState(routineToEdit?.name || '');
  const [exercises, setExercises] = useState<Exercise[]>(routineToEdit?.exercises || []);

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
    const newExercises = [...exercises];
    (newExercises[index] as any)[field] = value;
    setExercises(newExercises);
  };

  const addExercise = () => {
    setExercises([...exercises, { id: crypto.randomUUID(), name: '', sets: 3, reps: '8-12', weight: 10, notes: '' }]);
  };

  const removeExercise = (index: number) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '' || exercises.length === 0) {
      alert('Please provide a routine name and at least one exercise.');
      return;
    }
    onSave({
      id: routineToEdit?.id || crypto.randomUUID(),
      name,
      exercises
    });
  };

  return (
    <div className="min-h-screen bg-primary text-light p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-accent text-center">{routineToEdit ? 'Edit Routine' : 'Create Routine'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col">
        <div>
          <label htmlFor="routineName" className="block text-sm font-medium text-gray-300">Routine Name</label>
          <input
            id="routineName"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1 block w-full bg-secondary border border-gray-600 rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-accent focus:border-accent"
            placeholder="e.g., Chest Day"
            required
          />
        </div>

        <div className="space-y-4 flex-grow overflow-y-auto pr-2">
          <h3 className="text-lg font-semibold">Exercises</h3>
          {exercises.map((ex, index) => (
            <div key={index} className="p-4 bg-secondary rounded-lg space-y-3 relative">
              <button type="button" onClick={() => removeExercise(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-400">
                <TrashIcon />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 <div>
                    <label className="text-xs text-gray-400">Exercise Name</label>
                    <input type="text" value={ex.name} onChange={e => handleExerciseChange(index, 'name', e.target.value)} className="w-full bg-primary p-2 rounded-md" placeholder="e.g., Bench Press" required />
                </div>
                 <div>
                    <label className="text-xs text-gray-400">Reps</label>
                    <input type="text" value={ex.reps} onChange={e => handleExerciseChange(index, 'reps', e.target.value)} className="w-full bg-primary p-2 rounded-md" placeholder="e.g., 8-12" required />
                 </div>
                 <div>
                    <label className="text-xs text-gray-400">Sets</label>
                    <input type="number" value={ex.sets} onChange={e => handleExerciseChange(index, 'sets', parseInt(e.target.value))} className="w-full bg-primary p-2 rounded-md" required min="1"/>
                 </div>
                  <div>
                    <label className="text-xs text-gray-400">Weight (kg)</label>
                    <input type="number" value={ex.weight} onChange={e => handleExerciseChange(index, 'weight', parseFloat(e.target.value))} className="w-full bg-primary p-2 rounded-md" required min="0" step="0.5"/>
                  </div>
              </div>
               <div className="mt-2">
                <label className="text-xs text-gray-400">Notes</label>
                <textarea
                    value={ex.notes || ''}
                    onChange={e => handleExerciseChange(index, 'notes', e.target.value)}
                    className="w-full bg-primary p-2 rounded-md mt-1 text-sm"
                    placeholder="e.g., Focus on form, slow negatives..."
                    rows={2}
                />
              </div>
            </div>
          ))}
        </div>
        
        <button type="button" onClick={addExercise} className="w-full flex items-center justify-center py-2 px-4 border-2 border-dashed border-gray-600 text-gray-400 rounded-md hover:bg-secondary hover:text-accent">
          <PlusIcon />
          <span className="ml-2">Add Exercise</span>
        </button>

        <div className="flex space-x-4 sticky bottom-4">
          <button type="button" onClick={onCancel} className="flex-1 py-3 px-4 bg-gray-600 rounded-md font-semibold hover:bg-gray-500">Cancel</button>
          <button type="submit" className="flex-1 py-3 px-4 bg-accent text-primary rounded-md font-semibold hover:bg-green-300">Save Routine</button>
        </div>
      </form>
    </div>
  );
}