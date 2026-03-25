import React from 'react';
import { motion } from 'framer-motion';
import { Gauge, ShieldAlert } from 'lucide-react';

export default function DrivingView({ drivingState }: { drivingState: any }) {
  const isSafeMode = drivingState.mode === 'safe_mode';

  return (
    <div className="p-6 flex flex-col items-center justify-center gap-8 h-full">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Speedometer Ring */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#1e293b"
            strokeWidth="10"
            strokeDasharray="283"
            strokeDashoffset="0"
            className="opacity-50"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={isSafeMode ? '#ef4444' : '#10b981'}
            strokeWidth="10"
            strokeDasharray="283"
            animate={{
              strokeDashoffset: 283 - (drivingState.speed / 120) * 283,
            }}
            transition={{ type: 'spring', stiffness: 50 }}
            className="origin-center -rotate-90"
          />
        </svg>

        <div className="flex flex-col items-center justify-center z-10">
          <motion.span 
            key={Math.round(drivingState.speed)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-mono font-bold text-slate-100"
          >
            {Math.round(drivingState.speed)}
          </motion.span>
          <span className="text-sm text-slate-400 font-medium uppercase tracking-widest mt-1">km/h</span>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex flex-col items-center">
          <span className="text-xs text-slate-400 uppercase tracking-wider mb-2">Steering</span>
          <div className="flex items-center gap-2">
            <motion.div 
              animate={{ rotate: drivingState.steeringAngle }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="w-8 h-8 rounded-full border-4 border-slate-600 flex items-center justify-center"
            >
              <div className="w-1 h-4 bg-slate-400 rounded-full -mt-3" />
            </motion.div>
            <span className="font-mono text-lg">{Math.round(drivingState.steeringAngle)}°</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-colors ${isSafeMode ? 'bg-red-900/30 border-red-500/50 text-red-400' : 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400'}`}>
          <span className="text-xs uppercase tracking-wider mb-1 opacity-80">Mode</span>
          <div className="flex items-center gap-2 font-bold uppercase tracking-widest">
            {isSafeMode ? <ShieldAlert className="w-4 h-4" /> : <Gauge className="w-4 h-4" />}
            {drivingState.mode.replace('_', ' ')}
          </div>
        </div>
      </div>
    </div>
  );
}
