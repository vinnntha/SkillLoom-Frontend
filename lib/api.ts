const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://generous-unity-production-a8c9.up.railway.app";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const cookieToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  if (cookieToken) return cookieToken;
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
  }
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

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

  return data;
}

export const api = {
  // ==========================================
  // AUTH ENDPOINTS
  // ==========================================
  auth: {
    login: (payload: { email: string; password: string }) =>
      request<{ message: string; access_token: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    registerSiswa: async (payload: {
      email: string;
      password: string;
      fullName: string;
      nisn: string;
      jurusan: string;
    }) => {
      const res = await request<{ message: string; user: any }>("/auth/register/siswa", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("skillloom_registered_students");
          const list: any[] = stored ? JSON.parse(stored) : [];
          const studentProfile: any = res.user?.siswaProfile || {
            fullName: payload.fullName,
            nisn: payload.nisn,
            jurusan: payload.jurusan,
          };
          const newStudent = {
            id: res.user?.id || `reg-${Date.now()}`,
            siswaId: studentProfile.id || res.user?.id || `siswa-${Date.now()}`,
            fullName: studentProfile.fullName || payload.fullName,
            nisn: studentProfile.nisn || payload.nisn,
            jurusan: studentProfile.jurusan || payload.jurusan,
            email: payload.email,
            registeredAt: res.user?.createdAt || new Date().toISOString(),
          };
          const filtered = list.filter(
            (s: any) => s.nisn !== newStudent.nisn && s.email !== newStudent.email
          );
          filtered.push(newStudent);
          localStorage.setItem("skillloom_registered_students", JSON.stringify(filtered));
        } catch (e) {
          console.warn("Failed to cache registered student:", e);
        }
      }

      return res;
    },

    registerUmkm: (payload: {
      email: string;
      password: string;
      companyName: string;
      industryType: string;
      phoneNumber: string;
    }) =>
      request<{ message: string; user: any }>("/auth/register/umkm", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    registerAdmin: (payload: {
      email: string;
      password: string;
      schoolName: string;
      position: string;
    }) =>
      request<{ message: string; user: any }>("/auth/register/admin", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    googleLogin: (payload: { token?: string; idToken?: string; credential?: string; role?: string }) =>
      request<{ message: string; access_token: string; user: any }>("/auth/google", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },

  // ==========================================
  // USERS & PROFILE ENDPOINTS
  // ==========================================
  users: {
    getMe: async () => {
      try {
        return await request<any>("/auth/me");
      } catch (err: any) {
        try {
          return await request<any>("/users/me");
        } catch {
          throw err;
        }
      }
    },

    updateSiswaProfile: (payload: {
      bio?: string;
      bankName?: string;
      accountNumber?: string;
    }) =>
      request<any>("/users/profile/siswa", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),

    updateUmkmProfile: (payload: {
      companyName?: string;
      address?: string;
    }) =>
      request<any>("/users/profile/umkm", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
  },

  // ==========================================
  // PROJECTS ENDPOINTS
  // ==========================================
  projects: {
    getAll: (params?: { category?: string; search?: string }) => {
      const queryParams = new URLSearchParams();
      if (params?.category && params.category !== "Semua") {
        queryParams.append("category", params.category);
      }
      if (params?.search) {
        queryParams.append("search", params.search);
      }
      const queryStr = queryParams.toString();
      return request<any[]>(`/projects${queryStr ? `?${queryStr}` : ""}`);
    },

    getById: (id: string) => request<any>(`/projects/${id}`),

    create: (payload: {
      title: string;
      description: string;
      category: string;
      budget: number;
      deadline: string;
    }) =>
      request<any>("/projects", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    getMyProjects: () => request<any[]>("/projects/my"),

    getPending: () => request<any[]>("/projects/pending"),

    approve: (id: string) =>
      request<any>(`/projects/${id}/approve`, {
        method: "PATCH",
      }),
  },

  // ==========================================
  // APPLICATIONS ENDPOINTS
  // ==========================================
  applications: {
    apply: async (payload: { projectId: string; pitchMessage: string }) => {
      const res = await request<any>("/applications", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("skillloom_registered_applications");
          const list: any[] = stored ? JSON.parse(stored) : [];
          list.push({
            id: res?.id || res?._id || `app-${Date.now()}`,
            projectId: payload.projectId,
            siswaId: res?.siswaId || res?.siswa?.id,
            siswa: res?.siswa,
            pitchMessage: payload.pitchMessage,
            appliedAt: new Date().toISOString(),
          });
          localStorage.setItem("skillloom_registered_applications", JSON.stringify(list));
        } catch (e) {}
      }

      return res;
    },

    getMyApplications: async () => {
      try {
        return await request<any[]>("/applications/my-applications");
      } catch (err: any) {
        return await request<any[]>("/applications/my");
      }
    },

    getByProject: (projectId: string) =>
      request<any[]>(`/applications/project/${projectId}`),

    updateStatus: (id: string, status: "ACCEPTED" | "REJECTED") =>
      request<any>(`/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),

    submitDeliverable: (id: string, payload: { submissionLink: string }) =>
      request<any>(`/applications/${id}/submit`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    updateRevision: (
      id: string,
      payload: { reviewStatus: string; revisionNote?: string }
    ) =>
      request<any>(`/applications/${id}/revision`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
  },

  // ==========================================
  // TRANSACTIONS ENDPOINTS
  // ==========================================
  transactions: {
    initiate: (payload: {
      projectId: string;
      amount: number;
      paymentProof: string;
    }) =>
      request<any>("/transactions", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    hold: (id: string, payload: { paymentStatus: string; paymentProof?: string }) =>
      request<any>(`/transactions/${id}/hold`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),

    release: (id: string) =>
      request<any>(`/transactions/${id}/release`, {
        method: "PATCH",
      }),

    getMyTransactions: () => request<any[]>("/transactions/my"),
  },

  // ==========================================
  // SHOWCASES ENDPOINTS
  // ==========================================
  showcases: {
    create: (payload: {
      projectId: string;
      title: string;
      imageUrl: string;
      testimonial: string;
      rating: number;
      isFeatured?: boolean;
    }) =>
      request<any>("/showcases", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    getAll: (featured?: boolean) =>
      request<any[]>(`/showcases${featured ? "?featured=true" : ""}`),

    getById: (id: string) => request<any>(`/showcases/${id}`),
  },

  // ==========================================
  // ADMIN ENDPOINTS
  // ==========================================
  admin: {
    getPending: () => request<any[]>("/projects/pending"),
    approve: (id: string) =>
      request<any>(`/projects/${id}/approve`, {
        method: "PATCH",
      }),
    holdEscrow: (id: string, payload: { paymentStatus: string; paymentProof?: string }) =>
      request<any>(`/transactions/${id}/hold`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    releaseEscrow: (id: string) =>
      request<any>(`/transactions/${id}/release`, {
        method: "PATCH",
      }),
    getAllSiswa: async () => {
      const { adminService } = await import("./api/admin");
      return adminService.getAllSiswa();
    },
    getStudentMonitoringList: async () => {
      const { adminService } = await import("./api/admin");
      return adminService.getStudentMonitoringList();
    },
    getAdminOverview: async () => {
      const { adminService } = await import("./api/admin");
      return adminService.getAdminOverview();
    },
  },
};

