import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import WebcamView from './WebcamView';
import DrivingView from './DrivingView';
import HealthView from './HealthView';
import NavigationView from './NavigationView';
import AlertsView from './AlertsView';
import { ShieldAlert, Activity, Navigation, Car, BrainCircuit } from 'lucide-react';

const socket = io();

export default function Dashboard() {
  const [state, setState] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    socket.on('state_update', (data) => {
      setState(data);
    });

    socket.on('alerts_update', (data) => {
      setAlerts(data);
    });

    return () => {
      socket.off('state_update');
      socket.off('alerts_update');
    };
  }, []);

  if (!state) {
    return <div className="flex items-center justify-center h-screen">Connecting to AI Co-Pilot...</div>;
  }

  const triggerEvent = (event: string) => {
    socket.emit('trigger_event', event);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto flex flex-col gap-6">
      <header className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold tracking-tight">AI Co-Pilot System</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium text-slate-400">System Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Vision & Health */}
        <div className="flex flex-col gap-6">
          <section className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800 flex items-center gap-2 bg-slate-900/50">
              <ShieldAlert className="w-5 h-5 text-indigo-400" />
              <h2 className="font-semibold">Safety Agent (Vision)</h2>
            </div>
            <WebcamView safetyState={state.safety} triggerEvent={triggerEvent} />
          </section>

          <section className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800 flex items-center gap-2 bg-slate-900/50">
              <Activity className="w-5 h-5 text-rose-400" />
              <h2 className="font-semibold">Health Agent</h2>
            </div>
            <HealthView healthState={state.health} triggerEvent={triggerEvent} />
          </section>
        </div>

        {/* Middle Column: Driving & Navigation */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
              <div className="p-4 border-b border-slate-800 flex items-center gap-2 bg-slate-900/50">
                <Car className="w-5 h-5 text-emerald-400" />
                <h2 className="font-semibold">Driving Agent</h2>
              </div>
              <DrivingView drivingState={state.driving} />
            </section>

            <section className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
              <div className="p-4 border-b border-slate-800 flex items-center gap-2 bg-slate-900/50">
                <Navigation className="w-5 h-5 text-amber-400" />
                <h2 className="font-semibold">Navigation Agent</h2>
              </div>
              <NavigationView navState={state.nav} />
            </section>
          </div>

          {/* Alerts Log */}
          <section className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg flex-1">
            <div className="p-4 border-b border-slate-800 flex items-center gap-2 bg-slate-900/50">
              <BrainCircuit className="w-5 h-5 text-blue-400" />
              <h2 className="font-semibold">Coordinator Agent Logs</h2>
            </div>
            <AlertsView alerts={alerts} />
          </section>
        </div>
      </div>
    </div>
  );
}
