import { Router } from 'express';
import prisma from '../prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
  const schedules = await prisma.massSchedule.findMany({ orderBy: { createdAt: 'asc' } });
  res.json(schedules);
});

router.get('/note', async (_req, res) => {
  const note = await prisma.scheduleNote.findFirst({ orderBy: { updatedAt: 'desc' } });
  res.json(note);
});

router.post('/', authenticate, async (req, res) => {
  const { day, time, description, location } = req.body;
  if (!day || !time || !description || !location) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const schedule = await prisma.massSchedule.create({
    data: { day, time, description, location }
  });
  res.status(201).json(schedule);
});

router.put('/note', authenticate, async (req, res) => {
  const { title, body, actionLabel, actionLink } = req.body as {
    title?: string;
    body?: string;
    actionLabel?: string;
    actionLink?: string;
  };

  if (!title || !body) {
    return res.status(400).json({ message: 'Title and body are required' });
  }

  const existing = await prisma.scheduleNote.findFirst({ orderBy: { updatedAt: 'desc' } });

  let note;
  if (existing) {
    note = await prisma.scheduleNote.update({
      where: { id: existing.id },
      data: { title, body, actionLabel, actionLink }
    });
  } else {
    note = await prisma.scheduleNote.create({
      data: { title, body, actionLabel, actionLink }
    });
  }

  res.json(note);
});

router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { day, time, description, location } = req.body;

  const schedule = await prisma.massSchedule.update({
    where: { id },
    data: { day, time, description, location }
  });
  res.json(schedule);
});

router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  await prisma.massSchedule.delete({ where: { id } });
  res.status(204).send();
});

export default router;
