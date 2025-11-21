import 'dotenv/config';

const config = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? 'changeme',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  uploadFileLimitMb: Number(process.env.UPLOAD_FILE_LIMIT_MB ?? 10),
  uploadReminderHours: Number(process.env.UPLOAD_REMINDER_HOURS ?? 48)
};

export default config;
