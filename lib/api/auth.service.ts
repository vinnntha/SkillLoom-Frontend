import {
  RegisterSiswaPayload,
  LoginPayload,
  AuthResponse,
  User,
} from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://generous-unity-production-a8c9.up.railway.app";

/**
 * Get JWT token from localStorage or Cookies (Client-side & Next.js App Router fallback)
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  // Try retrieving from cookie first
  const cookieToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (cookieToken) return cookieToken;

  // Fallback to localStorage
  return localStorage.getItem("token");
}

/**
 * Store JWT token in both localStorage and Cookie for Next.js middleware & App Router compatibility
 */
export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;

  localStorage.setItem("token", token);
  document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
}

/**
 * Remove JWT token on logout
 */
export function removeAuthToken(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

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

export const authService = {
  /**
   * Register a new Siswa account (POST /auth/register/siswa)
   */
  async registerSiswa(payload: RegisterSiswaPayload): Promise<AuthResponse> {
    const res = await fetcher<AuthResponse>("/auth/register/siswa", {
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

  /**
   * Login user (POST /auth/login)
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await fetcher<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res.access_token) {
      setAuthToken(res.access_token);
    }

    return res;
  },

  /**
   * Google Login (POST /auth/google)
   */
  async googleLogin(payload: { idToken?: string; credential?: string; role?: string }): Promise<AuthResponse> {
    const res = await fetcher<AuthResponse>("/auth/google", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res.access_token) {
      setAuthToken(res.access_token);
    }

    return res;
  },

  /**
   * Fetch current authenticated user profile (GET /auth/me)
   */
  async getMe(): Promise<User> {
    try {
      const res = await fetcher<any>("/auth/me");
      return res.user || res;
    } catch (err: any) {
      try {
        const res = await fetcher<any>("/users/me");
        return res.user || res;
      } catch {
        throw err;
      }
    }
  },

  /**
   * Logout user
   */
  logout(): void {
    removeAuthToken();
  },
};
