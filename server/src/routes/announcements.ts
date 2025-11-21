import { Router } from 'express';
import prisma from '../prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
  const announcements = await prisma.announcement.findMany({
    orderBy: { date: 'desc' }
  });
  res.json(announcements);
});

router.post('/', authenticate, async (req, res) => {
  const { title, content, date, isPublic = true, imageUrl } = req.body;
  if (!title || !content || !date) {
    return res.status(400).json({ message: 'Title, content, and date are required' });
  }

  const announcement = await prisma.announcement.create({
    data: {
      title,
      content,
      date: new Date(date),
      isPublic,
      imageUrl
    }
  });
  res.status(201).json(announcement);
});

router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, content, date, isPublic, imageUrl } = req.body;

  const announcement = await prisma.announcement.update({
    where: { id },
    data: {
      title,
      content,
      date: date ? new Date(date) : undefined,
      isPublic,
      imageUrl
    }
  });
  res.json(announcement);
});

router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  await prisma.announcement.delete({ where: { id } });
  res.status(204).send();
});

export default router;
