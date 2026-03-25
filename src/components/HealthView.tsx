import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HeartPulse, Activity, Brain, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HealthView({ healthState, triggerEvent }: { healthState: any, triggerEvent: (e: string) => void }) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData((prev) => {
      const newData = [...prev, { time: new Date().toLocaleTimeString(), hr: healthState.heartRate }];
      if (newData.length > 20) newData.shift();
      return newData;
    });
  }, [healthState.heartRate]);

  const isHighStress = healthState.stressLevel === 'high' || healthState.heartRate > 100;

  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-xl border flex flex-col gap-2 transition-colors ${isHighStress ? 'bg-red-900/20 border-red-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
            <HeartPulse className={`w-4 h-4 ${isHighStress ? 'text-red-400 animate-pulse' : 'text-rose-400'}`} />
            Heart Rate
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-bold font-mono ${isHighStress ? 'text-red-400' : 'text-slate-100'}`}>
              {healthState.heartRate}
            </span>
            <span className="text-slate-500 mb-1">bpm</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-slate-800/50 border-slate-700 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
            <Brain className="w-4 h-4 text-purple-400" />
            Stress Level
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold capitalize text-slate-100">
              {healthState.stressLevel}
            </span>
          </div>
        </div>
      </div>

      <div className="h-48 w-full bg-slate-900/50 rounded-xl border border-slate-800 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis domain={[50, 150]} stroke="#64748b" fontSize={12} tickFormatter={(val) => `${val}`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
              itemStyle={{ color: '#f1f5f9' }}
            />
            <Line
              type="monotone"
              dataKey="hr"
              stroke={isHighStress ? '#ef4444' : '#f43f5e'}
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-medium text-slate-300">Fatigue Score</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${healthState.fatigueScore > 50 ? 'bg-amber-500' : 'bg-indigo-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${healthState.fatigueScore}%` }}
              transition={{ type: 'spring' }}
            />
          </div>
          <span className="text-sm font-mono text-slate-400 w-8 text-right">{healthState.fatigueScore}%</span>
        </div>
      </div>

      <button
        onClick={() => triggerEvent('high_hr')}
        className="mt-2 flex items-center justify-center gap-2 p-3 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg border border-red-900/50 transition-colors text-sm font-medium"
      >
        <AlertTriangle className="w-4 h-4" />
        Simulate High Stress / HR
      </button>
    </div>
  );
}
