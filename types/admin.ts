import { ProjectItem, ApplicationItem, SiswaProfile } from "./api";

// ==========================================
// ADMIN AUTH & PROFILE TYPES
// ==========================================
export interface RegisterAdminPayload {
  email: string;
  password: string;
  schoolName: string;
  position: string;
}

export interface AdminProfile {
  id: string;
  userId: string;
  schoolName: string;
  position: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// ADMIN PROJECT MODERATION & APPROVAL TYPES
// ==========================================
export interface PendingProjectItem extends ProjectItem {
  umkm: {
    id?: string;
    companyName: string;
    industryType: string;
    phoneNumber?: string;
    address?: string;
  };
  applications?: ApplicationItem[];
}

export interface ApproveProjectResponse {
  message: string;
  project: ProjectItem;
}

// ==========================================
// ADMIN OVERVIEW METRICS & BENTO DATA
// ==========================================
export interface AdminOverviewMetrics {
  totalSiswaAktif: number;
  proyekPendingCount: number;
  proyekApprovedCount: number;
  totalMitraUmkm: number;
  totalEscrowHeld: number;
  jurusanDistribution: {
    jurusan: string;
    count: number;
    percentage: number;
  }[];
}

// ==========================================
// STUDENT MONITORING / SUPERVISION TYPES
// ==========================================
export interface StudentMonitoringItem {
  id: string;
  siswaId: string;
  fullName: string;
  nisn: string;
  jurusan: string;
  projectTitle: string;
  projectId: string;
  companyName: string;
  industryType?: string;
  budget: number;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  paymentStatus: "UNPAID" | "ESCROW_HELD" | "RELEASED" | "FAILED";
  deadline: string;
  appliedDate: string;
  pitchMessage?: string;
}

// ==========================================
// ESCROW & TRANSACTION VERIFICATION
// ==========================================
export interface EscrowHoldPayload {
  paymentStatus: "ESCROW_HELD";
  paymentProof?: string;
}

export interface EscrowReleasePayload {
  paymentStatus: "RELEASED";
}
