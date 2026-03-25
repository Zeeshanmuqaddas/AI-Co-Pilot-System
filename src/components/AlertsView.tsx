import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';

export default function AlertsView({ alerts }: { alerts: any[] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'critical': return <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />;
      default: return <Info className="w-5 h-5 text-blue-400 shrink-0" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-950/30 border-red-900/50';
      case 'warning': return 'bg-amber-950/30 border-amber-900/50';
      case 'success': return 'bg-emerald-950/30 border-emerald-900/50';
      default: return 'bg-blue-950/30 border-blue-900/50';
    }
  };

  return (
    <div className="p-4 h-full flex flex-col gap-3 overflow-y-auto max-h-[300px] lg:max-h-full scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pr-2">
      <AnimatePresence initial={false}>
        {alerts.length === 0 ? (
          <motion.div 
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-slate-500 gap-2"
          >
            <Info className="w-8 h-8 opacity-50" />
            <p>No recent alerts</p>
          </motion.div>
        ) : (
          alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-3 p-3 rounded-lg border ${getBg(alert.type)}`}
            >
              <div className="mt-0.5">{getIcon(alert.type)}</div>
              <div className="flex flex-col gap-1 w-full">
                <span className={`text-sm font-medium ${
                  alert.type === 'critical' ? 'text-red-200' : 
                  alert.type === 'warning' ? 'text-amber-200' : 
                  alert.type === 'success' ? 'text-emerald-200' : 'text-blue-200'
                }`}>
                  {alert.message}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
