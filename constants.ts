import { MassSchedule, SacramentRecord, SacramentType, Announcement, Donation, ServiceRequest, RequestCategory, RequestStatus, IssuedCertificate, DeliveryMethod } from './types';

export const MOCK_SCHEDULES: MassSchedule[] = [
  { id: '1', day: 'Sunday', time: '06:00 AM', description: 'Misa Pro Populo (Cebuano)', location: 'Main Church' },
  { id: '2', day: 'Sunday', time: '08:30 AM', description: 'English Mass', location: 'Main Church' },
  { id: '3', day: 'Sunday', time: '04:30 PM', description: 'Youth Mass', location: 'Main Church' },
  { id: '4', day: 'Wednesday', time: '05:30 PM', description: 'Novena to Our Lady of the Miraculous Medal', location: 'Main Church' },
  { id: '5', day: 'First Friday', time: '05:00 PM', description: 'Holy Hour & Mass', location: 'Main Church' },
];

export const MOCK_RECORDS: SacramentRecord[] = [
  { id: '1', name: 'Maria Santos', date: '2023-10-15', type: SacramentType.BAPTISM, officiant: 'Fr. Juan Dela Cruz', details: 'Parents: Jose & Ana Santos' },
  { id: '2', name: 'Pedro & Elena Reyes', date: '2023-11-02', type: SacramentType.MARRIAGE, officiant: 'Fr. Juan Dela Cruz', details: 'Witnesses: Mr. & Mrs. Gomez' },
  { id: '3', name: 'Sofia Garcia', date: '2023-05-20', type: SacramentType.CONFIRMATION, officiant: 'Bp. Ricardo Alarcon', details: 'Sponsor: Teresa Dizon' },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { 
    id: '1', 
    title: 'Parish Fiesta Preparation', 
    content: 'The committee meeting for the upcoming fiesta will be held this Saturday at 2 PM in the Parish Hall.', 
    date: '2023-11-10', 
    isPublic: true,
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: '2', 
    title: 'Call for Choir Members', 
    content: 'We are inviting young people to join the grand choir for the Christmas season.', 
    date: '2023-11-12', 
    isPublic: true 
  },
];

export const MOCK_DONATIONS: Donation[] = [
  { id: '1', donorName: 'Family of Mr. & Mrs. Reyes', amount: '₱10,000', purpose: 'Church Renovation Fund', date: '2023-10-01', isAnonymous: false },
  { id: '2', donorName: 'Anonymous', amount: '₱2,000', purpose: 'Sunday Collection', date: '2023-10-05', isAnonymous: true },
  { id: '3', donorName: 'San Miguel Corp.', amount: '50 Sacks of Cement', purpose: 'Construction Materials', date: '2023-10-15', isAnonymous: false },
];

export const MOCK_REQUESTS: ServiceRequest[] = [
  {
    id: '1',
    category: RequestCategory.CERTIFICATE,
    serviceType: 'Baptismal Certificate',
    requesterName: 'Juan Dela Cruz',
    contactInfo: 'juan@email.com',
    details: 'For local employment purposes. Baptized year 1998.',
    status: RequestStatus.PENDING,
    submissionDate: '2023-11-15'
  },
  {
    id: '2',
    category: RequestCategory.SACRAMENT,
    serviceType: 'Baptism',
    requesterName: 'Ana Smith',
    contactInfo: '09171234567',
    preferredDate: '2023-12-10',
    details: 'Child: Baby Boy Smith. We are available on Sunday mornings.',
    status: RequestStatus.SCHEDULED,
    submissionDate: '2023-11-14',
    confirmedSchedule: '2023-12-10 10:00 AM',
    adminNotes: 'Requirements submitted. Seminars attended.'
  }
];

export const MOCK_ISSUED_CERTIFICATES: IssuedCertificate[] = [
  {
    id: '101',
    requestId: '99',
    type: 'Baptismal Certificate',
    recipientName: 'Carlos Dizon',
    requesterName: 'Maria Dizon',
    dateIssued: '2023-10-20',
    issuedBy: 'Administrator',
    deliveryMethod: DeliveryMethod.PICKUP,
    notes: 'ID Presented'
  }
];

export const LOGO_URL = 'church-logo.png'; 
// Fallback URL if local image not found
export const LOGO_FALLBACK = 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80';