import bcrypt from 'bcrypt';
import { PrismaClient, RequestCategory, RequestStatus, SacramentType, CertificateStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminPassword,
      role: 'ADMIN'
    }
  });

  await prisma.issuedCertificate.deleteMany();
  await prisma.sacramentRecord.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.massSchedule.deleteMany();

  await prisma.massSchedule.createMany({
    data: [
      { day: 'Sunday', time: '06:00 AM', description: 'Misa Pro Populo (Cebuano)', location: 'Main Church' },
      { day: 'Sunday', time: '08:30 AM', description: 'English Mass', location: 'Main Church' },
      { day: 'Sunday', time: '04:30 PM', description: 'Youth Mass', location: 'Main Church' },
      { day: 'Wednesday', time: '05:30 PM', description: 'Novena to Our Lady of the Miraculous Medal', location: 'Main Church' },
      { day: 'First Friday', time: '05:00 PM', description: 'Holy Hour & Mass', location: 'Main Church' }
    ]
  });

  await prisma.announcement.createMany({
    data: [
      {
        title: 'Parish Fiesta Preparation',
        content: 'The committee meeting for the upcoming fiesta will be held this Saturday at 2 PM in the Parish Hall.',
        date: new Date('2023-11-10'),
        isPublic: true,
        imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Call for Choir Members',
        content: 'We are inviting young people to join the grand choir for the Christmas season.',
        date: new Date('2023-11-12'),
        isPublic: true
      }
    ]
  });

  await prisma.donation.createMany({
    data: [
      { donorName: 'Family of Mr. & Mrs. Reyes', amount: '₱10,000', purpose: 'Church Renovation Fund', date: new Date('2023-10-01'), isAnonymous: false },
      { donorName: 'Anonymous', amount: '₱2,000', purpose: 'Sunday Collection', date: new Date('2023-10-05'), isAnonymous: true },
      { donorName: 'San Miguel Corp.', amount: '50 Sacks of Cement', purpose: 'Construction Materials', date: new Date('2023-10-15'), isAnonymous: false }
    ]
  });

  const certificateRequest = await prisma.serviceRequest.create({
    data: {
      category: RequestCategory.CERTIFICATE,
      serviceType: 'Baptismal Certificate',
      requesterName: 'Juan Dela Cruz',
      contactInfo: 'juan@email.com',
      details: 'For local employment purposes. Baptized year 1998.',
      status: RequestStatus.PENDING
    }
  });

  await prisma.serviceRequest.create({
    data: {
      category: RequestCategory.SACRAMENT,
      serviceType: 'Baptism',
      requesterName: 'Ana Smith',
      contactInfo: '09171234567',
      preferredDate: '2023-12-10',
      details: 'Child: Baby Boy Smith. We are available on Sunday mornings.',
      status: RequestStatus.SCHEDULED,
      confirmedSchedule: '2023-12-10 10:00 AM',
      adminNotes: 'Requirements submitted. Seminars attended.'
    }
  });

  await prisma.sacramentRecord.createMany({
    data: [
      {
        name: 'Maria Santos',
        date: new Date('2023-10-15'),
        type: SacramentType.BAPTISM,
        officiant: 'Fr. Juan Dela Cruz',
        details: 'Parents: Jose & Ana Santos'
      },
      {
        name: 'Pedro & Elena Reyes',
        date: new Date('2023-11-02'),
        type: SacramentType.MARRIAGE,
        officiant: 'Fr. Juan Dela Cruz',
        details: 'Witnesses: Mr. & Mrs. Gomez'
      },
      {
        name: 'Sofia Garcia',
        date: new Date('2023-05-20'),
        type: SacramentType.CONFIRMATION,
        officiant: 'Bp. Ricardo Alarcon',
        details: 'Sponsor: Teresa Dizon',
        isArchived: true,
        archivedAt: new Date('2024-01-05'),
        archivedBy: 'Administrator',
        archiveReason: 'Merged into diocesan register'
      }
    ]
  });

  const uploadedRequest = await prisma.serviceRequest.create({
    data: {
      category: RequestCategory.CERTIFICATE,
      serviceType: 'Marriage Certificate',
      requesterName: 'Elena Cruz',
      contactInfo: 'elena@example.com',
      details: 'For embassy requirements',
      status: RequestStatus.COMPLETED
    }
  });

  await prisma.issuedCertificate.createMany({
    data: [
      {
        requestId: certificateRequest.id,
        type: 'Baptismal Certificate',
        recipientName: 'Carlos Dizon',
        requesterName: 'Maria Dizon',
        issuedBy: 'Administrator',
        deliveryMethod: 'PICKUP',
        notes: 'ID Presented',
        status: CertificateStatus.PENDING_UPLOAD
      },
      {
        requestId: uploadedRequest.id,
        type: 'Marriage Certificate',
        recipientName: 'Elena Cruz',
        requesterName: 'Elena Cruz',
        issuedBy: 'Administrator',
        deliveryMethod: 'EMAIL',
        notes: 'Sent via email',
        status: CertificateStatus.UPLOADED,
        fileData: Buffer.from('Sample certificate file for demonstration.'),
        fileName: 'sample-certificate.txt',
        fileMimeType: 'text/plain',
        fileSize: Buffer.byteLength('Sample certificate file for demonstration.'),
        uploadedAt: new Date(),
        uploadedBy: 'Administrator'
      }
    ]
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  await prisma.scheduleNote.deleteMany();
  await prisma.scheduleNote.create({
    data: {
      title: 'Confession Schedule',
      body: 'The Sacrament of Reconciliation is available every Wednesday after the Novena Mass or by appointment at the Parish Office.',
      actionLabel: 'Contact Office for Appointment',
      actionLink: 'mailto:parishoffice@example.com'
    }
  });
