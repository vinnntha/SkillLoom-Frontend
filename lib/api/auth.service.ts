import {
  RegisterSiswaPayload,
  LoginPayload,
  AuthResponse,
  User,
} from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.132.27.105:3001";

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
    return fetcher<AuthResponse>("/auth/register/siswa", {
      method: "POST",
      body: JSON.stringify(payload),
    });
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
