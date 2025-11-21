import { Router } from 'express';
import prisma from '../prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
  const donations = await prisma.donation.findMany({
    orderBy: { date: 'desc' }
  });
  res.json(donations);
});

router.post('/', authenticate, async (req, res) => {
  const { donorName, amount, purpose, date, isAnonymous = false } = req.body;
  if (!donorName || !amount || !purpose || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const donation = await prisma.donation.create({
    data: {
      donorName,
      amount,
      purpose,
      date: new Date(date),
      isAnonymous
    }
  });
  res.status(201).json(donation);
});

router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { donorName, amount, purpose, date, isAnonymous } = req.body;

  const donation = await prisma.donation.update({
    where: { id },
    data: {
      donorName,
      amount,
      purpose,
      date: date ? new Date(date) : undefined,
      isAnonymous
    }
  });
  res.json(donation);
});

router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  await prisma.donation.delete({ where: { id } });
  res.status(204).send();
});

export default router;
