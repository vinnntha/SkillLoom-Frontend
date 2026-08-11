import { getAuthToken } from "./auth.service";
import {
  CreateProjectPayload,
  ProjectItem,
  ApplicationItem,
  UpdateApplicationStatusPayload,
  InitiateEscrowPayload,
  HoldEscrowPayload,
  TransactionItem,
  CreateShowcasePayload,
  ShowcaseItem,
  UmkmProfile,
  UpdateUmkmProfilePayload,
  UmkmStats,
} from "@/types/umkm";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://generous-unity-production-a8c9.up.railway.app";

/**
 * Common fetch wrapper with automatic Authorization header injection and error normalization
 */
async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    let errorMsg = `Request failed with status ${response.status}`;
    if (Array.isArray(data.message)) {
      errorMsg = data.message.join(", ");
    } else if (typeof data.message === "string") {
      errorMsg = data.message;
    } else if (typeof data.error === "string") {
      errorMsg = data.error;
    }
    throw new Error(errorMsg);
  }

  return data as T;
}

export const umkmApi = {
  // ==========================================
  // PROFILE ENDPOINTS
  // ==========================================
  async getProfile(): Promise<any> {
    try {
      return await fetcher<any>("/users/me");
    } catch {
      return await fetcher<any>("/auth/me");
    }
  },

  async updateProfile(payload: UpdateUmkmProfilePayload): Promise<UmkmProfile> {
    return fetcher<UmkmProfile>("/users/profile/umkm", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  // ==========================================
  // PROJECTS ENDPOINTS
  // ==========================================
  async getMyProjects(): Promise<ProjectItem[]> {
    return fetcher<ProjectItem[]>("/projects/my");
  },

  async getProjectById(id: string): Promise<ProjectItem> {
    return fetcher<ProjectItem>(`/projects/${id}`);
  },

  async createProject(payload: CreateProjectPayload): Promise<ProjectItem> {
    return fetcher<ProjectItem>("/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getAllApprovedProjects(params?: {
    category?: string;
    search?: string;
  }): Promise<ProjectItem[]> {
    const queryParams = new URLSearchParams();
    if (params?.category && params.category !== "Semua") {
      queryParams.append("category", params.category);
    }
    if (params?.search) {
      queryParams.append("search", params.search);
    }
    const queryStr = queryParams.toString();
    return fetcher<ProjectItem[]>(`/projects${queryStr ? `?${queryStr}` : ""}`);
  },

  // ==========================================
  // APPLICATIONS / APPLICANTS ENDPOINTS
  // ==========================================
  async getApplicantsByProject(projectId: string): Promise<ApplicationItem[]> {
    return fetcher<ApplicationItem[]>(`/applications/project/${projectId}`);
  },

  async updateApplicationStatus(
    applicationId: string,
    status: "ACCEPTED" | "REJECTED"
  ): Promise<ApplicationItem> {
    return fetcher<ApplicationItem>(`/applications/${applicationId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Update revision note or review status (PATCH /applications/:id/revision)
   */
  async updateRevisionStatus(
    applicationId: string,
    payload: { reviewStatus: string; revisionNote?: string }
  ): Promise<any> {
    return fetcher<any>(`/applications/${applicationId}/revision`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  // ==========================================
  // ESCROW TRANSACTIONS ENDPOINTS
  // ==========================================
  async initiateEscrow(payload: InitiateEscrowPayload): Promise<TransactionItem> {
    return fetcher<TransactionItem>("/transactions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async holdEscrow(
    transactionId: string,
    payload: { paymentStatus: "ESCROW_HELD"; paymentProof?: string } = {
      paymentStatus: "ESCROW_HELD",
    }
  ): Promise<TransactionItem> {
    return fetcher<TransactionItem>(`/transactions/${transactionId}/hold`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async releaseEscrow(transactionId: string): Promise<TransactionItem> {
    return fetcher<TransactionItem>(`/transactions/${transactionId}/release`, {
      method: "PATCH",
    });
  },

  async getMyTransactions(): Promise<TransactionItem[]> {
    return fetcher<TransactionItem[]>("/transactions/my");
  },

  // ==========================================
  // SHOWCASES & PORTFOLIO ENDPOINTS
  // ==========================================
  async createShowcase(payload: CreateShowcasePayload): Promise<ShowcaseItem> {
    return fetcher<ShowcaseItem>("/showcases", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getShowcases(featured?: boolean): Promise<ShowcaseItem[]> {
    return fetcher<ShowcaseItem[]>(
      `/showcases${featured !== undefined ? `?featured=${featured}` : ""}`
    );
  },

  async getShowcaseById(id: string): Promise<ShowcaseItem> {
    return fetcher<ShowcaseItem>(`/showcases/${id}`);
  },

  // ==========================================
  // AGGREGATED STATS HELPER
  // ==========================================
  async getDashboardStats(): Promise<UmkmStats> {
    const [projectsRes, transactionsRes] = await Promise.allSettled([
      this.getMyProjects(),
      this.getMyTransactions(),
    ]);

    const projects = projectsRes.status === "fulfilled" && Array.isArray(projectsRes.value)
      ? projectsRes.value
      : [];

    const transactions =
      transactionsRes.status === "fulfilled" && Array.isArray(transactionsRes.value)
        ? transactionsRes.value
        : [];

    let totalEscrowHeld = 0;
    let totalEscrowReleased = 0;
    let totalSpent = 0;

    transactions.forEach((tx) => {
      const amt = Number(tx.amount || 0);
      if (tx.paymentStatus === "ESCROW_HELD") {
        totalEscrowHeld += amt;
      } else if (tx.paymentStatus === "RELEASED") {
        totalEscrowReleased += amt;
        totalSpent += amt;
      }
    });

    const activeProjects = projects.filter(
      (p) => p.status === "OPEN" || p.status === "IN_PROGRESS" || p.status === "REVIEW"
    );

    // Fetch applicant count from projects
    let totalApplicants = 0;
    let pendingApplicants = 0;
    let acceptedApplicants = 0;

    projects.forEach((p) => {
      if (Array.isArray(p.applications)) {
        totalApplicants += p.applications.length;
        pendingApplicants += p.applications.filter((a) => a.status === "PENDING").length;
        acceptedApplicants += p.applications.filter((a) => a.status === "ACCEPTED").length;
      }
    });

    return {
      totalEscrowHeld,
      totalEscrowReleased,
      totalSpent,
      activeProjectsCount: activeProjects.length,
      totalProjectsCount: projects.length,
      totalApplicantsCount: totalApplicants,
      pendingApplicantsCount: pendingApplicants,
      acceptedApplicantsCount: acceptedApplicants,
    };
  },
};

export default umkmApi;
