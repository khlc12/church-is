import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MassSchedule, Announcement, Donation, ServiceRequest, RequestStatus, IssuedCertificate, DeliveryMethod, SacramentRecord, RequestCategory, SacramentType } from '../types';
import { MOCK_SCHEDULES, MOCK_ANNOUNCEMENTS, MOCK_DONATIONS, MOCK_REQUESTS, MOCK_ISSUED_CERTIFICATES, MOCK_RECORDS } from '../constants';

interface ParishContextType {
  schedules: MassSchedule[];
  announcements: Announcement[];
  donations: Donation[];
  requests: ServiceRequest[];
  issuedCertificates: IssuedCertificate[];
  records: SacramentRecord[];
  addSchedule: (schedule: Omit<MassSchedule, 'id'>) => void;
  updateSchedule: (schedule: MassSchedule) => void;
  deleteSchedule: (id: string) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  updateAnnouncement: (announcement: Announcement) => void;
  deleteAnnouncement: (id: string) => void;
  addDonation: (donation: Omit<Donation, 'id'>) => void;
  updateDonation: (donation: Donation) => void;
  deleteDonation: (id: string) => void;
  addRequest: (request: Omit<ServiceRequest, 'id' | 'status' | 'submissionDate'>) => void;
  updateRequest: (id: string, updates: Partial<ServiceRequest>) => void;
  deleteRequest: (id: string) => void;
  issueCertificate: (requestId: string, details: { deliveryMethod: DeliveryMethod, notes: string, issuedBy: string }) => void;
  addRecord: (record: Omit<SacramentRecord, 'id'>) => void;
  updateRecord: (record: SacramentRecord) => void;
  deleteRecord: (id: string) => void;
}

const ParishContext = createContext<ParishContextType | undefined>(undefined);

export const ParishProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [schedules, setSchedules] = useState<MassSchedule[]>(MOCK_SCHEDULES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [donations, setDonations] = useState<Donation[]>(MOCK_DONATIONS);
  const [requests, setRequests] = useState<ServiceRequest[]>(MOCK_REQUESTS);
  const [issuedCertificates, setIssuedCertificates] = useState<IssuedCertificate[]>(MOCK_ISSUED_CERTIFICATES);
  const [records, setRecords] = useState<SacramentRecord[]>(MOCK_RECORDS);

  // Schedule Actions
  const addSchedule = (schedule: Omit<MassSchedule, 'id'>) => {
    const newSchedule = { ...schedule, id: Date.now().toString() };
    setSchedules([...schedules, newSchedule]);
  };

  const updateSchedule = (updatedSchedule: MassSchedule) => {
    setSchedules(schedules.map(s => s.id === updatedSchedule.id ? updatedSchedule : s));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  // Announcement Actions
  const addAnnouncement = (announcement: Omit<Announcement, 'id'>) => {
    const newAnnouncement = { ...announcement, id: Date.now().toString() };
    // Add new items to the top
    setAnnouncements([newAnnouncement, ...announcements]);
  };

  const updateAnnouncement = (updatedAnnouncement: Announcement) => {
    setAnnouncements(announcements.map(a => a.id === updatedAnnouncement.id ? updatedAnnouncement : a));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  // Donation Actions
  const addDonation = (donation: Omit<Donation, 'id'>) => {
    const newDonation = { ...donation, id: Date.now().toString() };
    setDonations([newDonation, ...donations]);
  };

  const updateDonation = (updatedDonation: Donation) => {
    setDonations(donations.map(d => d.id === updatedDonation.id ? updatedDonation : d));
  };

  const deleteDonation = (id: string) => {
    setDonations(donations.filter(d => d.id !== id));
  };

  // Sacrament Record Actions
  const addRecord = (record: Omit<SacramentRecord, 'id'>) => {
    const newRecord = { ...record, id: Date.now().toString() };
    setRecords([newRecord, ...records]);
  };

  const updateRecord = (updatedRecord: SacramentRecord) => {
    setRecords(records.map(r => r.id === updatedRecord.id ? updatedRecord : r));
  };

  const deleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };

  // Helper to map service string to SacramentType Enum
  const mapServiceToSacramentType = (service: string): SacramentType | null => {
    const s = service.toLowerCase();
    if (s.includes('baptism')) return SacramentType.BAPTISM;
    if (s.includes('confirmation')) return SacramentType.CONFIRMATION;
    if (s.includes('marriage')) return SacramentType.MARRIAGE;
    if (s.includes('funeral')) return SacramentType.FUNERAL;
    return null;
  };

  // Service Request Actions
  const addRequest = (request: Omit<ServiceRequest, 'id' | 'status' | 'submissionDate'>) => {
    const newRequest: ServiceRequest = {
      ...request,
      id: Date.now().toString(),
      status: RequestStatus.PENDING,
      submissionDate: new Date().toISOString().split('T')[0]
    };
    setRequests([newRequest, ...requests]);
  };

  const updateRequest = (id: string, updates: Partial<ServiceRequest>) => {
    // Check for auto-creation of Sacrament Record
    const existingRequest = requests.find(r => r.id === id);
    
    if (existingRequest) {
       // Merge existing with updates to check final state
       const finalState = { ...existingRequest, ...updates };

       // If status changed to COMPLETED and it is a SACRAMENT
       if (
         updates.status === RequestStatus.COMPLETED && 
         existingRequest.status !== RequestStatus.COMPLETED &&
         existingRequest.category === RequestCategory.SACRAMENT
       ) {
          const sacramentType = mapServiceToSacramentType(existingRequest.serviceType);
          
          if (sacramentType) {
            // Try to extract a date YYYY-MM-DD
            const recordDate = finalState.confirmedSchedule 
              ? finalState.confirmedSchedule.split(' ')[0] // naive split if format is 'YYYY-MM-DD HH:MM'
              : finalState.preferredDate || new Date().toISOString().split('T')[0];

            addRecord({
              name: existingRequest.requesterName, // Default to requester, admin can edit later
              type: sacramentType,
              date: recordDate.includes('-') ? recordDate : new Date().toISOString().split('T')[0],
              officiant: 'Parish Priest', // Default
              details: `Generated from Request #${id}. Details: ${existingRequest.details}`
            });
          }
       }
    }

    setRequests(requests.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRequest = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  // Issue Certificate Action
  const issueCertificate = (requestId: string, details: { deliveryMethod: DeliveryMethod, notes: string, issuedBy: string }) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    // 1. Create Issued Certificate Record
    const newCertificate: IssuedCertificate = {
      id: Date.now().toString(),
      requestId: request.id,
      type: request.serviceType,
      // For simplicity, assuming details contains recipient name or requester is recipient
      recipientName: request.details.substring(0, 50) + "...", 
      requesterName: request.requesterName,
      dateIssued: new Date().toISOString().split('T')[0],
      issuedBy: details.issuedBy,
      deliveryMethod: details.deliveryMethod,
      notes: details.notes
    };

    setIssuedCertificates([newCertificate, ...issuedCertificates]);

    // 2. Mark Request as Completed
    updateRequest(requestId, { status: RequestStatus.COMPLETED });
  };

  return (
    <ParishContext.Provider value={{
      schedules,
      announcements,
      donations,
      requests,
      issuedCertificates,
      records,
      addSchedule,
      updateSchedule,
      deleteSchedule,
      addAnnouncement,
      updateAnnouncement,
      deleteAnnouncement,
      addDonation,
      updateDonation,
      deleteDonation,
      addRequest,
      updateRequest,
      deleteRequest,
      issueCertificate,
      addRecord,
      updateRecord,
      deleteRecord
    }}>
      {children}
    </ParishContext.Provider>
  );
};

export const useParish = () => {
  const context = useContext(ParishContext);
  if (context === undefined) {
    throw new Error('useParish must be used within a ParishProvider');
  }
  return context;
};
