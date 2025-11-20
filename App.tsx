import React, { useState, useMemo } from 'react';
import { Routine, WorkoutLog } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import RoutineList from './components/RoutineList';
import HistoryCalendar from './components/HistoryCalendar';
import ProgressionChart from './components/ProgressionChart';
import RoutineForm from './components/RoutineForm';
import WorkoutSession from './components/WorkoutSession';
import { DumbbellIcon, CalendarIcon, ChartBarIcon } from './components/icons/Icons';

type View = 'routines' | 'history' | 'progression';

export default function App() {
  const [routines, setRoutines] = useLocalStorage<Routine[]>('routines', []);
  const [logs, setLogs] = useLocalStorage<WorkoutLog[]>('logs', []);
  const [currentView, setCurrentView] = useState<View>('routines');
  const [activeWorkout, setActiveWorkout] = useState<Routine | null>(null);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSaveRoutine = (routine: Routine) => {
    const existingIndex = routines.findIndex(r => r.id === routine.id);
    if (existingIndex > -1) {
      const updatedRoutines = [...routines];
      updatedRoutines[existingIndex] = routine;
      setRoutines(updatedRoutines);
    } else {
      setRoutines([...routines, routine]);
    }
    setIsFormOpen(false);
    setEditingRoutine(null);
  };

  const handleEditRoutine = (routine: Routine) => {
    setEditingRoutine(routine);
    setIsFormOpen(true);
  };
  
  const handleDeleteRoutine = (routineId: string) => {
    if(window.confirm('Are you sure you want to delete this routine?')) {
      setRoutines(routines.filter(r => r.id !== routineId));
    }
  };

  const handleStartWorkout = (routine: Routine) => {
    setActiveWorkout(routine);
  };
  
  const handleFinishWorkout = (log: WorkoutLog) => {
    setLogs(prevLogs => [...prevLogs, log]);
    setActiveWorkout(null);
  };

  const allExercises = useMemo(() => {
    const exerciseSet = new Set<string>();
    routines.forEach(routine => {
      routine.exercises.forEach(ex => exerciseSet.add(ex.name));
    });
    return Array.from(exerciseSet);
  }, [routines]);

  const renderContent = () => {
    switch (currentView) {
      case 'history':
        return <HistoryCalendar logs={logs} />;
      case 'progression':
        return <ProgressionChart logs={logs} allExercises={allExercises} />;
      case 'routines':
      default:
        return (
          <RoutineList
            routines={routines}
            onStartWorkout={handleStartWorkout}
            onEditRoutine={handleEditRoutine}
            onDeleteRoutine={handleDeleteRoutine}
            onAddNew={() => { setEditingRoutine(null); setIsFormOpen(true); }}
          />
        );
    }
  };

  if (activeWorkout) {
    return <WorkoutSession routine={activeWorkout} onFinish={handleFinishWorkout} onCancel={() => setActiveWorkout(null)} />;
  }

  if (isFormOpen) {
    // FIX: Corrected typo from setIsFormОpen (with Cyrillic 'О') to setIsFormOpen.
    return <RoutineForm routineToEdit={editingRoutine} onSave={handleSaveRoutine} onCancel={() => { setIsFormOpen(false); setEditingRoutine(null); }} />;
  }
  
  return (
    <div className="min-h-screen bg-primary font-sans flex flex-col">
      <header className="bg-secondary p-4 shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-center text-accent tracking-wider uppercase">Gym Routinator</h1>
      </header>

      <main className="flex-grow p-4 md:p-6 mb-16">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-secondary shadow-lg flex justify-around p-2">
        <button onClick={() => setCurrentView('routines')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${currentView === 'routines' ? 'text-accent' : 'text-gray-400 hover:bg-primary'}`}>
          <DumbbellIcon />
          <span className="text-xs mt-1">Routines</span>
        </button>
        <button onClick={() => setCurrentView('history')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${currentView === 'history' ? 'text-accent' : 'text-gray-400 hover:bg-primary'}`}>
          <CalendarIcon />
          <span className="text-xs mt-1">History</span>
        </button>
        <button onClick={() => setCurrentView('progression')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${currentView === 'progression' ? 'text-accent' : 'text-gray-400 hover:bg-primary'}`}>
          <ChartBarIcon />
          <span className="text-xs mt-1">Progression</span>
        </button>
      </nav>
    </div>
  );
}