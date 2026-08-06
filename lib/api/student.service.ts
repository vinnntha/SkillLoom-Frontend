import { getAuthToken } from "./auth.service";
import {
  UpdateSiswaProfilePayload,
  SiswaProfile,
  ProjectItem,
  GetProjectsQueryParams,
  ApplyProjectPayload,
  ApplicationItem,
  TransactionItem,
  ShowcaseItem,
} from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://generous-unity-production-a8c9.up.railway.app";

/**
 * Common fetch wrapper with automatic Authorization header injection
 */
async function fetcher<T>(
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

export const studentService = {
  /**
   * Update Student Profile (PATCH /users/profile/siswa)
   */
  async updateProfile(payload: UpdateSiswaProfilePayload): Promise<SiswaProfile> {
    return fetcher<SiswaProfile>("/users/profile/siswa", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetch approved projects/bounties available for students (GET /projects)
   */
  async getProjects(params?: GetProjectsQueryParams): Promise<ProjectItem[]> {
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

  /**
   * Fetch single project details (GET /projects/:id)
   */
  async getProjectById(id: string): Promise<ProjectItem> {
    return fetcher<ProjectItem>(`/projects/${id}`);
  },

  /**
   * Apply for a project bounty as a Siswa (POST /applications)
   */
  async applyProject(payload: ApplyProjectPayload): Promise<ApplicationItem> {
    return fetcher<ApplicationItem>("/applications", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetch all applications submitted by the logged-in student (GET /applications/my-applications)
   */
  async getMyApplications(): Promise<ApplicationItem[]> {
    try {
      return await fetcher<ApplicationItem[]>("/applications/my-applications");
    } catch (err: any) {
      // Fallback to /applications/my if backend controller maps route under /applications/my
      return fetcher<ApplicationItem[]>("/applications/my");
    }
  },

  /**
   * Fetch student transaction and stipend payout history (GET /transactions/my)
   */
  async getMyTransactions(): Promise<TransactionItem[]> {
    return fetcher<TransactionItem[]>("/transactions/my");
  },

  /**
   * Fetch portfolio showcases (GET /showcases)
   */
  async getShowcases(featured?: boolean): Promise<ShowcaseItem[]> {
    return fetcher<ShowcaseItem[]>(`/showcases${featured ? "?featured=true" : ""}`);
  },
};
