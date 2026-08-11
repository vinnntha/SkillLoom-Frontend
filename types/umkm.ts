// ==========================================
// UMKM DASHBOARD & BACKEND API TYPES
// ==========================================

import { SiswaProfile } from "./api";

export interface UmkmProfile {
  id: string;
  userId?: string;
  companyName: string;
  industryType: string;
  address?: string | null;
  phoneNumber?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUmkmProfilePayload {
  companyName?: string;
  address?: string;
  industryType?: string;
  phoneNumber?: string;
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  category: "RPL" | "TKJ" | "DKV" | "MULTIMEDIA" | "BISNIS_DIGITAL" | "AKUNTANSI" | string;
  budget: number;
  deadline: string; // ISO 8601 string
}

export interface ProjectItem {
  id: string;
  umkmId: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  status: "OPEN" | "IN_PROGRESS" | "REVIEW" | "COMPLETED" | "CANCELLED";
  adminApproved: boolean;
  createdAt: string;
  updatedAt?: string;
  umkm?: UmkmProfile;
  applications?: ApplicationItem[];
  transaction?: TransactionItem;
}

export interface ApplicationItem {
  id: string;
  projectId: string;
  siswaId: string;
  pitchMessage: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  submissionLink?: string;
  revisionNote?: string;
  reviewStatus?: "UNDER_REVIEW" | "REVISION_REQUESTED" | "APPROVED" | string;
  createdAt: string;
  updatedAt?: string;
  project?: ProjectItem;
  siswa?: SiswaProfile & {
    user?: {
      email: string;
    };
  };
}

export interface UpdateApplicationStatusPayload {
  status: "ACCEPTED" | "REJECTED";
}

export interface InitiateEscrowPayload {
  projectId: string;
  amount: number;
  paymentProof: string;
}

export interface HoldEscrowPayload {
  paymentStatus: "ESCROW_HELD";
  paymentProof?: string;
}

export interface TransactionItem {
  id: string;
  projectId: string;
  umkmId: string;
  siswaId?: string | null;
  amount: number;
  paymentStatus: "UNPAID" | "ESCROW_HELD" | "RELEASED" | "FAILED";
  paymentProof?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  project?: ProjectItem;
  umkm?: {
    companyName: string;
    industryType?: string;
  };
  siswa?: SiswaProfile;
}

export interface CreateShowcasePayload {
  projectId: string;
  title: string;
  imageUrl: string;
  testimonial: string;
  rating: number;
  isFeatured?: boolean;
}

export interface ShowcaseItem {
  id: string;
  projectId: string;
  siswaId: string;
  title: string;
  imageUrl: string;
  testimonial?: string | null;
  rating?: number | null;
  isFeatured: boolean;
  createdAt: string;
  project?: ProjectItem;
  siswa?: SiswaProfile;
}

export interface UmkmStats {
  totalEscrowHeld: number;
  totalEscrowReleased: number;
  totalSpent: number;
  activeProjectsCount: number;
  totalProjectsCount: number;
  totalApplicantsCount: number;
  pendingApplicantsCount: number;
  acceptedApplicantsCount: number;
}
