import React from 'react';
import { MapPin, Clock, ArrowRight, Navigation2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NavigationView({ navState }: { navState: any }) {
  return (
    <div className="p-6 flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <MapPin className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Destination</span>
            <span className="text-lg font-medium text-slate-100">{navState.route.split(' to ')[1] || 'Unknown'}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">ETA</span>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="text-xl font-bold font-mono text-emerald-400">{navState.eta}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden relative flex flex-col items-center justify-center min-h-[160px]">
        {/* Simulated Map Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #3b82f6 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
        
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="z-10 bg-blue-600 p-4 rounded-full shadow-lg shadow-blue-500/50 border-4 border-slate-900"
        >
          <Navigation2 className="w-8 h-8 text-white" />
        </motion.div>
        
        <div className="z-10 mt-4 px-4 py-2 bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-700 flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-200">Next Turn: <span className="text-white capitalize">{navState.nextTurn}</span></span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${navState.traffic === 'heavy' ? 'bg-red-500' : navState.traffic === 'moderate' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span className="text-sm text-slate-300 capitalize">Traffic: {navState.traffic}</span>
        </div>
        <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-slate-300">Weather: Clear</span>
        </div>
      </div>
    </div>
  );
}
