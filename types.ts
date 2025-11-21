export enum SacramentType {
  BAPTISM = 'Baptism',
  CONFIRMATION = 'Confirmation',
  MARRIAGE = 'Marriage',
  FUNERAL = 'Funeral'
}

export interface SacramentRecord {
  id: string;
  name: string;
  date: string;
  type: SacramentType;
  officiant: string;
  details: string; // e.g., Parents, Witnesses
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  isPublic: boolean;
  imageUrl?: string; // Optional image for the bulletin
}

export interface MassSchedule {
  id: string; // Added ID for management
  day: string;
  time: string;
  description: string;
  location: string;
}

export interface Donation {
  id: string;
  donorName: string;
  amount: string; // String to accommodate currency symbols or "In Kind"
  purpose: string; // e.g., "Church Construction", "Fiesta"
  date: string;
  isAnonymous: boolean;
}

export enum RequestCategory {
  SACRAMENT = 'Sacrament',
  CERTIFICATE = 'Certificate'
}

export enum RequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  SCHEDULED = 'Scheduled',
  COMPLETED = 'Completed',
  REJECTED = 'Rejected'
}

export interface ServiceRequest {
  id: string;
  category: RequestCategory;
  serviceType: string; // e.g., "Baptism", "Marriage Certificate"
  requesterName: string;
  contactInfo: string; // Email or Phone
  preferredDate?: string; // Relevant for sacraments
  details: string; // Purpose or additional info
  status: RequestStatus;
  submissionDate: string;
  // New fields for status logic
  confirmedSchedule?: string; // For 'Scheduled' status
  adminNotes?: string; // For 'Approved', 'Rejected', or general notes
}

export enum DeliveryMethod {
  PICKUP = 'Pickup',
  EMAIL = 'Email',
  COURIER = 'Courier'
}

export interface IssuedCertificate {
  id: string;
  requestId: string;
  type: string;
  recipientName: string;
  requesterName: string;
  dateIssued: string;
  issuedBy: string;
  deliveryMethod: DeliveryMethod;
  notes?: string;
}

export enum UserRole {
  GUEST = 'GUEST',
  ADMIN = 'ADMIN'
}

export interface User {
  username: string;
  role: UserRole;
}