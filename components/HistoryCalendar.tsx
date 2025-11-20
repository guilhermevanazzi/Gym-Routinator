
import React, { useState } from 'react';
import { WorkoutLog } from '../types';

interface HistoryCalendarProps {
  logs: WorkoutLog[];
}

export default function HistoryCalendar({ logs }: HistoryCalendarProps) {
  const [date, setDate] = useState(new Date());
  const [selectedLogs, setSelectedLogs] = useState<WorkoutLog[] | null>(null);

  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const logsByDate = logs.reduce((acc, log) => {
    const logDate = new Date(log.date).toDateString();
    if (!acc[logDate]) {
      acc[logDate] = [];
    }
    acc[logDate].push(log);
    return acc;
  }, {} as Record<string, WorkoutLog[]>);

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 text-center"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
      const isToday = currentDate.toDateString() === new Date().toDateString();
      const logsForDay = logsByDate[currentDate.toDateString()];
      const hasLog = !!logsForDay;

      days.push(
        <div 
            key={day} 
            className={`p-2 text-center rounded-lg transition-colors ${isToday ? 'bg-accent text-primary font-bold' : ''} ${hasLog ? 'cursor-pointer hover:bg-primary' : ''}`}
            onClick={() => hasLog && setSelectedLogs(logsForDay)}
        >
          <span>{day}</span>
          {hasLog && <div className="w-2 h-2 bg-blue-400 rounded-full mx-auto mt-1"></div>}
        </div>
      );
    }
    return days;
  };

  const changeMonth = (offset: number) => {
    setDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + offset, 1));
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };
  
  return (
    <>
      <div className="bg-secondary p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Workout History</h2>
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => changeMonth(-1)} className="px-3 py-1 bg-primary rounded-md hover:bg-gray-600">&lt;</button>
          <h3 className="text-lg font-semibold">{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
          <button onClick={() => changeMonth(1)} className="px-3 py-1 bg-primary rounded-md hover:bg-gray-600">&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-sm">
          {weekdays.map(day => <div key={day} className="font-bold text-center text-gray-400">{day}</div>)}
          {renderDays()}
        </div>
      </div>
      
      {selectedLogs && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedLogs(null)}>
          <div className="bg-secondary p-6 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-2">
                 <div>
                    <h3 className="text-xl font-bold text-accent">{selectedLogs[0].routineName}</h3>
                    <p className="text-sm text-gray-400">{new Date(selectedLogs[0].date).toLocaleString()}</p>
                 </div>
                 {selectedLogs[0].durationSeconds > 0 && (
                     <span className="bg-primary px-2 py-1 rounded text-xs text-gray-300 font-mono">
                         {formatDuration(selectedLogs[0].durationSeconds)}
                     </span>
                 )}
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 space-y-4 mt-4">
              {selectedLogs.map(log => (
                <div key={log.id}>
                    {selectedLogs.length > 1 && (
                        <div className="flex justify-between text-xs text-gray-400 mb-2 border-t border-gray-700 pt-2">
                             <span>Session at {new Date(log.date).toLocaleTimeString()}</span>
                             {log.durationSeconds > 0 && <span>Time: {formatDuration(log.durationSeconds)}</span>}
                        </div>
                    )}
                    <div className="space-y-2 mb-4">
                      {log.completedExercises.map(ex => (
                      <div key={ex.exerciseId}>
                          <p className="font-semibold">{ex.name}</p>
                          <ul className="text-xs text-gray-300 list-none pl-2">
                          {ex.sets.map((s, i) => (
                            <li key={i} className="flex items-center space-x-2 mb-1">
                                <span className={`w-2 h-2 rounded-full ${s.completed ? 'bg-accent' : 'bg-gray-600'}`}></span>
                                <span>Set {i+1}: {s.weight}kg x {s.reps} reps</span>
                            </li>
                          ))}
                          </ul>
                      </div>
                      ))}
                    </div>

                    {log.postWorkoutNotes && (
                      <div>
                      <h4 className="font-semibold mb-1 text-sm text-gray-400">Notes:</h4>
                      <p className="text-sm bg-primary p-3 rounded-md italic">{log.postWorkoutNotes}</p>
                      </div>
                    )}
                </div>
              ))}
            </div>
            
            <button onClick={() => setSelectedLogs(null)} className="w-full mt-4 py-2 bg-gray-600 rounded-md font-semibold hover:bg-gray-500 shrink-0">Close</button>
          </div>
        </div>
      )}
    </>
  );
}
