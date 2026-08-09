import { getAuthToken } from "./auth.service";
import {
  RegisterAdminPayload,
  PendingProjectItem,
  ProjectItem,
  GetProjectsQueryParams,
  AdminOverviewMetrics,
  StudentMonitoringItem,
  EscrowHoldPayload,
  TransactionItem,
} from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://generous-unity-production-a8c9.up.railway.app";

/**
 * Helper function for Admin API requests with automatic Bearer token
 */
async function adminFetcher<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
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
    const errorMsg =
      data.message ||
      (Array.isArray(data.message) ? data.message.join(", ") : null) ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const adminService = {
  /**
   * Register new Admin/Guru Pembimbing (POST /auth/register/admin)
   */
  async registerAdmin(payload: RegisterAdminPayload): Promise<{ message: string; user: any }> {
    return adminFetcher<{ message: string; user: any }>("/auth/register/admin", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetch pending UMKM projects awaiting Admin approval (GET /projects/pending)
   */
  async getPendingProjects(): Promise<PendingProjectItem[]> {
    return adminFetcher<PendingProjectItem[]>("/projects/pending");
  },

  /**
   * Approve a pending UMKM project (PATCH /projects/:id/approve)
   */
  async approveProject(id: string): Promise<ProjectItem> {
    return adminFetcher<ProjectItem>(`/projects/${id}/approve`, {
      method: "PATCH",
    });
  },

  /**
   * Get all projects across the platform for supervision (GET /projects)
   */
  async getAllProjects(params?: GetProjectsQueryParams): Promise<ProjectItem[]> {
    const queryParams = new URLSearchParams();
    if (params?.category && params.category !== "Semua") {
      queryParams.append("category", params.category);
    }
    if (params?.search) {
      queryParams.append("search", params.search);
    }
    const queryStr = queryParams.toString();
    return adminFetcher<ProjectItem[]>(`/projects${queryStr ? `?${queryStr}` : ""}`);
  },

  /**
   * Get detailed single project info (GET /projects/:id)
   */
  async getProjectById(id: string): Promise<ProjectItem> {
    return adminFetcher<ProjectItem>(`/projects/${id}`);
  },

  /**
   * Get all transactions for admin audit
   */
  async getAllTransactions(): Promise<TransactionItem[]> {
    try {
      return await adminFetcher<TransactionItem[]>("/transactions");
    } catch {
      try {
        return await adminFetcher<TransactionItem[]>("/transactions/my");
      } catch {
        return [];
      }
    }
  },

  /**
   * Verify transaction & hold escrow (PATCH /transactions/:id/hold)
   */
  async holdEscrow(id: string, payload: EscrowHoldPayload): Promise<TransactionItem> {
    return adminFetcher<TransactionItem>(`/transactions/${id}/hold`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Release escrow funds to student (PATCH /transactions/:id/release)
   */
  async releaseEscrow(id: string): Promise<TransactionItem> {
    return adminFetcher<TransactionItem>(`/transactions/${id}/release`, {
      method: "PATCH",
    });
  },

  /**
   * Fetch overview metrics for Admin Bento Grid using live Railway backend data
   */
  async getAdminOverview(): Promise<AdminOverviewMetrics> {
    try {
      const [pendingList, allProjects, transactions] = await Promise.all([
        this.getPendingProjects().catch(() => []),
        this.getAllProjects().catch(() => []),
        this.getAllTransactions().catch(() => []),
      ]);

      const totalApproved = allProjects.length;
      const totalPending = pendingList.length;

      // Extract unique UMKMs
      const umkmSet = new Set<string>();
      allProjects.forEach((p) => {
        if (p.umkmId) umkmSet.add(p.umkmId);
        if (p.umkm?.companyName) umkmSet.add(p.umkm.companyName);
      });
      pendingList.forEach((p) => {
        if (p.umkmId) umkmSet.add(p.umkmId);
        if (p.umkm?.companyName) umkmSet.add(p.umkm.companyName);
      });

      // Calculate active students and total escrow strictly from live data
      let activeStudentsCount = 0;
      let totalEscrow = 0;

      // Calculate total escrow from transactions if available, otherwise from projects in progress
      if (transactions && transactions.length > 0) {
        totalEscrow = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
      } else {
        allProjects.forEach((proj) => {
          if (proj.status === "IN_PROGRESS" || proj.status === "COMPLETED") {
            totalEscrow += proj.budget || 0;
          }
        });
      }

      const jurusanMap: Record<string, number> = {};

      allProjects.forEach((proj) => {
        const category = proj.category || "RPL";
        jurusanMap[category] = (jurusanMap[category] || 0) + 1;

        if (proj.applications && Array.isArray(proj.applications)) {
          const acceptedApps = proj.applications.filter((app) => app.status === "ACCEPTED");
          activeStudentsCount += acceptedApps.length;
        }
      });

      const totalJurusanProjects = Object.values(jurusanMap).reduce((a, b) => a + b, 0) || 1;
      const jurusanDistribution = Object.keys(jurusanMap).map((key) => ({
        jurusan: key,
        count: jurusanMap[key],
        percentage: Math.round((jurusanMap[key] / totalJurusanProjects) * 100),
      }));

      return {
        totalSiswaAktif: activeStudentsCount,
        proyekPendingCount: totalPending,
        proyekApprovedCount: totalApproved,
        totalMitraUmkm: umkmSet.size,
        totalEscrowHeld: totalEscrow,
        jurusanDistribution,
      };
    } catch (error) {
      console.error("Error fetching admin overview metrics from Railway API:", error);
      return {
        totalSiswaAktif: 0,
        proyekPendingCount: 0,
        proyekApprovedCount: 0,
        totalMitraUmkm: 0,
        totalEscrowHeld: 0,
        jurusanDistribution: [],
      };
    }
  },

  /**
   * Get Student Monitoring Supervision List strictly from Railway backend
   */
  async getStudentMonitoringList(): Promise<StudentMonitoringItem[]> {
    try {
      const allProjects = await this.getAllProjects();
      const monitoredItems: StudentMonitoringItem[] = [];

      allProjects.forEach((proj) => {
        if (proj.applications && Array.isArray(proj.applications)) {
          proj.applications.forEach((app) => {
            if (app.siswa) {
              monitoredItems.push({
                id: app.id,
                siswaId: app.siswaId,
                fullName: app.siswa.fullName || "Siswa Vokasi",
                nisn: app.siswa.nisn || "-",
                jurusan: app.siswa.jurusan || proj.category || "RPL",
                projectTitle: proj.title,
                projectId: proj.id,
                companyName: proj.umkm?.companyName || "Mitra UMKM",
                industryType: proj.umkm?.industryType,
                budget: proj.budget,
                status: proj.status,
                paymentStatus: "ESCROW_HELD",
                deadline: proj.deadline,
                appliedDate: app.createdAt,
                pitchMessage: app.pitchMessage,
              });
            }
          });
        }
      });

      return monitoredItems;
    } catch (error) {
      console.error("Error fetching student monitoring list from Railway API:", error);
      return [];
    }
  },
};
