import React, { useState, useMemo } from 'react';
import { WorkoutLog } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProgressionChartProps {
  logs: WorkoutLog[];
  allExercises: string[];
}

export default function ProgressionChart({ logs, allExercises }: ProgressionChartProps) {
  const [selectedExercise, setSelectedExercise] = useState<string>(allExercises[0] || '');

  const chartData = useMemo(() => {
    if (!selectedExercise) return [];
    
    const data: { date: string; weight: number }[] = [];
    
    logs.forEach(log => {
      let maxWeight = 0;
      let exerciseFound = false;

      log.completedExercises.forEach(ex => {
        if (ex.name === selectedExercise) {
          exerciseFound = true;
          ex.sets.forEach(set => {
            if (set.weight > maxWeight) {
              maxWeight = set.weight;
            }
          });
        }
      });

      if (exerciseFound && maxWeight > 0) {
        data.push({
          date: new Date(log.date).toLocaleDateString('en-CA'), // YYYY-MM-DD for sorting
          weight: maxWeight
        });
      }
    });

    return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [logs, selectedExercise]);
  
  return (
    <div className="bg-secondary p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Progression Tracker</h2>
      <div className="mb-4">
        <label htmlFor="exercise-select" className="block text-sm font-medium text-gray-300">Select Exercise</label>
        <select
          id="exercise-select"
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          className="mt-1 block w-full bg-primary border border-gray-600 rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-accent focus:border-accent"
        >
          {allExercises.map(ex => <option key={ex} value={ex}>{ex}</option>)}
        </select>
      </div>

      {chartData.length > 1 ? (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }} />
              <Legend />
              <Line type="monotone" dataKey="weight" stroke="#4ADE80" strokeWidth={2} name={`Max Weight (kg) for ${selectedExercise}`} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-center text-gray-400 py-10">Not enough data to display a chart. Complete at least two workouts with this exercise.</p>
      )}
    </div>
  );
}
