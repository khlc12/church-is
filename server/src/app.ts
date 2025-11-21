import express from 'express';
import cors from 'cors';
import config from './config.js';
import authRoutes from './routes/auth.js';
import scheduleRoutes from './routes/schedules.js';
import announcementRoutes from './routes/announcements.js';
import donationRoutes from './routes/donations.js';
import requestRoutes from './routes/requests.js';
import recordRoutes from './routes/records.js';
import certificateRoutes from './routes/certificates.js';

const app = express();

app.use(
  cors({
    origin: config.corsOrigin === '*' ? undefined : config.corsOrigin,
    credentials: true
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/certificates', certificateRoutes);

export default app;
