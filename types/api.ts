// ==========================================
// GENERIC API RESPONSE WRAPPER
// ==========================================
export interface ApiResponse<T = any> {
  statusCode?: number;
  message: string;
  data?: T;
  [key: string]: any;
}

// ==========================================
// AUTHENTICATION TYPES
// ==========================================
export interface RegisterSiswaPayload {
  email: string;
  password: string;
  fullName: string;
  nisn: string;
  jurusan: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SiswaProfile {
  id: string;
  userId: string;
  fullName: string;
  nisn: string;
  jurusan: string;
  bio?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
}

export interface User {
  id: string;
  email: string;
  role: "SISWA" | "UMKM" | "ADMIN" | string;
  isVerified: boolean;
  siswaProfile?: SiswaProfile | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  access_token?: string;
  user: User;
}

// ==========================================
// STUDENT DASHBOARD & BOUNTY TYPES
// ==========================================
export interface UpdateSiswaProfilePayload {
  bio?: string;
  bankName?: string;
  accountNumber?: string;
}

export interface ProjectItem {
  id: string;
  umkmId: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  adminApproved: boolean;
  createdAt: string;
  umkm?: {
    companyName: string;
    industryType: string;
    phoneNumber?: string;
    address?: string;
  };
  applications?: ApplicationItem[];
}

export interface GetProjectsQueryParams {
  category?: string;
  search?: string;
}

export interface ApplyProjectPayload {
  projectId: string;
  pitchMessage: string;
}

export interface ApplicationItem {
  id: string;
  projectId: string;
  siswaId: string;
  pitchMessage: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  project?: ProjectItem;
  siswa?: SiswaProfile;
}

export interface TransactionItem {
  id: string;
  projectId: string;
  umkmId: string;
  siswaId: string;
  amount: number;
  paymentStatus: "UNPAID" | "ESCROW_HELD" | "RELEASED" | "FAILED";
  paymentProof?: string | null;
  paidAt?: string | null;
  createdAt: string;
  project?: ProjectItem;
  umkm?: {
    companyName: string;
  };
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
}

export * from "./admin";

