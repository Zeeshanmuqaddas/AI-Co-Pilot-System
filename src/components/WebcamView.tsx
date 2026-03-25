import React, { useRef, useEffect } from 'react';
import { Camera, EyeOff, Smartphone, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WebcamView({ safetyState, triggerEvent }: { safetyState: any, triggerEvent: (e: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing webcam:", err);
        });
    }
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-700">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        
        {/* Overlay based on state */}
        {safetyState.status !== 'normal' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-red-500/20 border-4 border-red-500 flex items-center justify-center"
          >
            <div className="bg-red-900/80 px-4 py-2 rounded-full text-red-100 font-bold uppercase tracking-widest animate-pulse">
              {safetyState.status === 'drowsy' ? 'Drowsiness Detected' : 'Phone Usage Detected'}
            </div>
          </motion.div>
        )}
        
        <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-slate-300 flex items-center gap-1">
          <Camera className="w-3 h-3" /> Live Feed
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button 
          onClick={() => triggerEvent('drowsy')}
          className="flex flex-col items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
        >
          <EyeOff className="w-5 h-5 text-amber-400 mb-1" />
          <span className="text-xs text-slate-300">Simulate Drowsy</span>
        </button>
        <button 
          onClick={() => triggerEvent('phone')}
          className="flex flex-col items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
        >
          <Smartphone className="w-5 h-5 text-rose-400 mb-1" />
          <span className="text-xs text-slate-300">Simulate Phone</span>
        </button>
        <button 
          onClick={() => triggerEvent('normal')}
          className="flex flex-col items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
        >
          <CheckCircle className="w-5 h-5 text-emerald-400 mb-1" />
          <span className="text-xs text-slate-300">Normal State</span>
        </button>
      </div>
    </div>
  );
}
