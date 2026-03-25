import express from 'express';
import { createServer as createViteServer } from 'vite';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  const PORT = 3000;

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Agent Simulation Logic
  let drivingState = { speed: 60, steeringAngle: 0, mode: 'autonomous' };
  let healthState = { heartRate: 75, stressLevel: 'low', fatigueScore: 10 };
  let navState = { route: 'Home to Office', eta: '25 mins', traffic: 'moderate', nextTurn: 'straight' };
  let safetyState = { status: 'normal', driverAttention: 'focused' };
  let alerts: Array<{ id: number; message: string; type: string; timestamp: Date }> = [];

  let alertIdCounter = 0;

  const addAlert = (message: string, type: string) => {
    alerts.unshift({ id: alertIdCounter++, message, type, timestamp: new Date() });
    if (alerts.length > 10) alerts.pop();
    io.emit('alerts_update', alerts);
  };

  // Coordinator Loop
  setInterval(() => {
    // Simulate Health changes
    if (safetyState.status === 'normal') {
      healthState.heartRate = 70 + Math.floor(Math.random() * 10);
      healthState.stressLevel = healthState.heartRate > 85 ? 'medium' : 'low';
      healthState.fatigueScore = Math.max(0, healthState.fatigueScore - 1);
    }

    // Simulate Driving changes
    if (drivingState.mode === 'autonomous') {
      drivingState.speed = 60 + Math.sin(Date.now() / 5000) * 5;
      drivingState.steeringAngle = Math.sin(Date.now() / 2000) * 15;
    } else if (drivingState.mode === 'safe_mode') {
      drivingState.speed = Math.max(0, drivingState.speed - 5);
      drivingState.steeringAngle = 0;
    }

    // Coordinator Decision Logic
    if (safetyState.status === 'drowsy' || safetyState.status === 'phone') {
      if (drivingState.mode !== 'safe_mode') {
        drivingState.mode = 'safe_mode';
        addAlert(`CRITICAL: ${safetyState.status === 'drowsy' ? 'Drowsiness' : 'Phone usage'} detected. Engaging Safe Mode.`, 'critical');
      }
    } else if (healthState.heartRate > 100) {
      if (drivingState.mode !== 'safe_mode') {
        drivingState.mode = 'safe_mode';
        addAlert('CRITICAL: Abnormal heart rate detected. Engaging Safe Mode.', 'critical');
      }
    } else if (drivingState.mode === 'safe_mode' && safetyState.status === 'normal' && healthState.heartRate <= 85) {
      drivingState.mode = 'autonomous';
      addAlert('Driver attentive. Resuming autonomous mode.', 'info');
    }

    // Broadcast state
    io.emit('state_update', {
      driving: drivingState,
      health: healthState,
      nav: navState,
      safety: safetyState,
    });
  }, 1000);

  io.on('connection', (socket) => {
    console.log('Client connected');
    socket.emit('state_update', { driving: drivingState, health: healthState, nav: navState, safety: safetyState });
    socket.emit('alerts_update', alerts);

    socket.on('trigger_event', (event: string) => {
      console.log('Received event from client:', event);
      if (event === 'drowsy') {
        safetyState.status = 'drowsy';
        safetyState.driverAttention = 'distracted';
        healthState.fatigueScore = 80;
        addAlert('WARNING: Driver drowsiness detected via camera.', 'warning');
      } else if (event === 'phone') {
        safetyState.status = 'phone';
        safetyState.driverAttention = 'distracted';
        addAlert('WARNING: Phone usage detected via camera.', 'warning');
      } else if (event === 'normal') {
        safetyState.status = 'normal';
        safetyState.driverAttention = 'focused';
        healthState.fatigueScore = 10;
        addAlert('Driver attention restored.', 'success');
      } else if (event === 'high_hr') {
        healthState.heartRate = 120;
        healthState.stressLevel = 'high';
        addAlert('WARNING: High stress/heart rate detected.', 'warning');
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
