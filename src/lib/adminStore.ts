import { MemberData } from '../types/registration';
import {
  subscribeToFirestoreRegistrations,
  approveRegistrationInFirestore,
  rejectRegistrationInFirestore,
  updateRegistrationInFirestore,
  deleteRegistrationInFirestore,
  seedDemoRegistrationsInFirestore
} from './firebaseDb';

export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface AuditLog {
  id: string;
  adminName: string;
  action: 'Approve Payment' | 'Reject Payment' | 'Edit Team' | 'Delete Team' | 'Bulk Approve';
  teamName: string;
  timestamp: string;
  details?: string;
}

export interface TeamRecord {
  id: string;
  teamName: string;
  createdAt: string;
  memberCount: number;
  members: MemberData[];
  paymentStatus: PaymentStatus;
  transactionId: string;
  amount: number;
  submittedAt: string;
  screenshotUrl?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectReason?: string;
  timeline: {
    title: string;
    timestamp: string;
    completed: boolean;
  }[];
}

export interface AdminNotification {
  id: string;
  title: string;
  time: string;
  type: 'registration' | 'payment_submitted' | 'approved' | 'rejected';
  read: boolean;
}

const INITIAL_TEAMS: TeamRecord[] = [
  {
    id: 'DFR2026-0001',
    teamName: 'Binary Builders',
    createdAt: '12 Aug, 10:15 AM',
    memberCount: 5,
    paymentStatus: 'pending',
    transactionId: 'UPI/984201847201',
    amount: 1750,
    submittedAt: '12 Aug, 11:43 AM',
    screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    timeline: [
      { title: 'Registration Created', timestamp: '12 Aug, 10:15 AM', completed: true },
      { title: 'Payment Submitted', timestamp: '12 Aug, 11:43 AM', completed: true },
      { title: 'Pending Verification', timestamp: '12 Aug, 11:43 AM', completed: true },
      { title: 'Approved', timestamp: 'Pending', completed: false },
      { title: 'Confirmation Sent', timestamp: 'Pending', completed: false },
    ],
    members: [
      { id: 'm1', role: 'Leader', name: 'Sai Venkat', registerNumber: '99240041356', phone: '+91 9876543210', year: '3rd Year', department: 'CSE', section: '24S01', residenceType: 'Hosteller', hostelName: 'BH-1 (Tagore Hall)', roomNumber: '304', wardenName: 'Dr. Kumar', wardenPhone: '+91 9876500001' },
      { id: 'm2', role: 'Member 1', name: 'Ananya Sharma', registerNumber: '99240041357', phone: '+91 9876543211', year: '3rd Year', department: 'CSE', section: '24S01', residenceType: 'Day Scholar' },
      { id: 'm3', role: 'Member 2', name: 'Rohan Verma', registerNumber: '99240041358', phone: '+91 9876543212', year: '3rd Year', department: 'ECE', section: '24S02', residenceType: 'Hosteller', hostelName: 'BH-2 (Nehru Hall)', roomNumber: '112', wardenName: 'Prof. Ramesh', wardenPhone: '+91 9876500002' },
      { id: 'm4', role: 'Member 3', name: 'Priya Patel', registerNumber: '99240041359', phone: '+91 9876543213', year: '2nd Year', department: 'AI & DS', section: '24S03', residenceType: 'Day Scholar' },
      { id: 'm5', role: 'Member 4 (Optional)', isOptional: true, name: 'Karthik Raja', registerNumber: '99240041360', phone: '+91 9876543214', year: '3rd Year', department: 'CSE', section: '24S01', residenceType: 'Hosteller', hostelName: 'BH-1 (Tagore Hall)', roomNumber: '305', wardenName: 'Dr. Kumar', wardenPhone: '+91 9876500001' },
    ]
  },
  {
    id: 'DFR2026-0002',
    teamName: 'AI Titans',
    createdAt: '12 Aug, 10:17 AM',
    memberCount: 4,
    paymentStatus: 'approved',
    transactionId: 'UPI/423985721349',
    amount: 1400,
    submittedAt: '12 Aug, 10:25 AM',
    approvedBy: 'Faculty Coordinator (Admin)',
    approvedAt: '12 Aug, 10:30 AM',
    screenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    timeline: [
      { title: 'Registration Created', timestamp: '12 Aug, 10:17 AM', completed: true },
      { title: 'Payment Submitted', timestamp: '12 Aug, 10:25 AM', completed: true },
      { title: 'Pending Verification', timestamp: '12 Aug, 10:25 AM', completed: true },
      { title: 'Approved', timestamp: '12 Aug, 10:30 AM', completed: true },
      { title: 'Confirmation Sent', timestamp: '12 Aug, 10:31 AM', completed: true },
    ],
    members: [
      { id: 'm1', role: 'Leader', name: 'Vikram Seth', registerNumber: '99240041401', phone: '+91 9812345678', year: '4th Year', department: 'AI & DS', section: '23S01', residenceType: 'Day Scholar' },
      { id: 'm2', role: 'Member 1', name: 'Neha Gupta', registerNumber: '99240041402', phone: '+91 9812345679', year: '4th Year', department: 'CSE', section: '23S01', residenceType: 'Hosteller', hostelName: 'LH-1 (Ganga Hostel)', roomNumber: '201', wardenName: 'Mrs. Lakshmi', wardenPhone: '+91 9876500003' },
      { id: 'm3', role: 'Member 2', name: 'Deepak Reddy', registerNumber: '99240041403', phone: '+91 9812345680', year: '4th Year', department: 'AI & DS', section: '23S01', residenceType: 'Day Scholar' },
      { id: 'm4', role: 'Member 3', name: 'Siddharth M', registerNumber: '99240041404', phone: '+91 9812345681', year: '3rd Year', department: 'IT', section: '24S02', residenceType: 'Day Scholar' },
    ]
  },
  {
    id: 'DFR2026-0003',
    teamName: 'Cyber Knights',
    createdAt: '11 Aug, 04:20 PM',
    memberCount: 5,
    paymentStatus: 'rejected',
    transactionId: 'UPI/000099998888',
    amount: 1750,
    submittedAt: '11 Aug, 04:30 PM',
    rejectReason: 'Invalid Screenshot (Illegible transaction receipt image provided)',
    approvedBy: 'Faculty Coordinator (Admin)',
    approvedAt: '11 Aug, 05:00 PM',
    screenshotUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=600&q=80',
    timeline: [
      { title: 'Registration Created', timestamp: '11 Aug, 04:20 PM', completed: true },
      { title: 'Payment Submitted', timestamp: '11 Aug, 04:30 PM', completed: true },
      { title: 'Pending Verification', timestamp: '11 Aug, 04:30 PM', completed: true },
      { title: 'Rejected', timestamp: '11 Aug, 05:00 PM', completed: true },
      { title: 'Confirmation Sent', timestamp: 'N/A', completed: false },
    ],
    members: [
      { id: 'm1', role: 'Leader', name: 'Eshwar Prasad', registerNumber: '99240041601', phone: '+91 9543210987', year: '3rd Year', department: 'IT', section: '24S05', residenceType: 'Day Scholar' },
      { id: 'm2', role: 'Member 1', name: 'Farhan Akhtar', registerNumber: '99240041602', phone: '+91 9543210988', year: '3rd Year', department: 'IT', section: '24S05', residenceType: 'Hosteller', hostelName: 'BH-1 (Tagore Hall)', roomNumber: '210', wardenName: 'Dr. Kumar', wardenPhone: '+91 9876500001' },
      { id: 'm3', role: 'Member 2', name: 'Gauri Menon', registerNumber: '99240041603', phone: '+91 9543210989', year: '3rd Year', department: 'CSE', section: '24S01', residenceType: 'Day Scholar' },
      { id: 'm4', role: 'Member 3', name: 'Hari Krishnan', registerNumber: '99240041604', phone: '+91 9543210990', year: '3rd Year', department: 'ECE', section: '24S02', residenceType: 'Hosteller', hostelName: 'BH-2 (Nehru Hall)', roomNumber: '315', wardenName: 'Prof. Ramesh', wardenPhone: '+91 9876500002' },
      { id: 'm5', role: 'Member 4 (Optional)', isOptional: true, name: 'Ishita Roy', registerNumber: '99240041605', phone: '+91 9543210991', year: '3rd Year', department: 'IT', section: '24S05', residenceType: 'Day Scholar' },
    ]
  }
];

const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  { id: 'n1', title: 'New Team Registration: Binary Builders (5 members)', time: '11:43 AM', type: 'registration', read: false },
  { id: 'n2', title: 'Payment Submitted: UPI/984201847201 by Sai Venkat', time: '11:43 AM', type: 'payment_submitted', read: false },
  { id: 'n3', title: 'Payment Approved: AI Titans (₹1400 verified)', time: '10:30 AM', type: 'approved', read: true },
  { id: 'n4', title: 'Payment Rejected: Cyber Knights (Invalid Screenshot)', time: '11 Aug', type: 'rejected', read: true },
];

const INITIAL_LOGS: AuditLog[] = [
  { id: 'l1', adminName: 'Faculty Coordinator', action: 'Approve Payment', teamName: 'AI Titans', timestamp: '12 Aug, 10:30 AM', details: 'Transaction UPI/423985721349 verified' },
  { id: 'l2', adminName: 'Faculty Coordinator', action: 'Reject Payment', teamName: 'Cyber Knights', timestamp: '11 Aug, 05:00 PM', details: 'Reason: Invalid Screenshot' },
];

const STORAGE_KEY_TEAMS = 'disfrutar_admin_teams';
const STORAGE_KEY_LOGS = 'disfrutar_admin_logs';
const STORAGE_KEY_NOTIFS = 'disfrutar_admin_notifs';

export function getStoredTeams(): TeamRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEAMS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse admin teams:', e);
  }
  localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(INITIAL_TEAMS));
  return INITIAL_TEAMS;
}

export function saveStoredTeams(teams: TeamRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(teams));
  } catch (e) {
    console.error('Failed to save admin teams:', e);
  }
}

export function getStoredLogs(): AuditLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse audit logs:', e);
  }
  return INITIAL_LOGS;
}

export function saveStoredLogs(logs: AuditLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save audit logs:', e);
  }
}

export function getStoredNotifs(): AdminNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse notifications:', e);
  }
  return INITIAL_NOTIFICATIONS;
}

export function saveStoredNotifs(notifs: AdminNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifs));
  } catch (e) {
    console.error('Failed to save notifications:', e);
  }
}

// Export Firebase helpers for store operations
export {
  subscribeToFirestoreRegistrations,
  approveRegistrationInFirestore,
  rejectRegistrationInFirestore,
  updateRegistrationInFirestore,
  deleteRegistrationInFirestore,
  seedDemoRegistrationsInFirestore
};
