"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api, getToken, setToken, removeToken } from "@/lib/api";

export type RoleType = "siswa" | "umkm" | "admin" | "SISWA" | "UMKM" | "ADMIN" | null;

export interface User {
  id: string;
  email: string;
  name: string;
  role: RoleType;
  siswaProfile?: {
    id: string;
    fullName: string;
    nisn: string;
    jurusan: string;
    bio?: string;
    bankName?: string;
    accountNumber?: string;
  } | null;
  umkmProfile?: {
    id: string;
    companyName: string;
    industryType: string;
    address?: string;
    phoneNumber: string;
  } | null;
  adminProfile?: {
    id: string;
    schoolName: string;
    position: string;
  } | null;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginSuccess: (access_token: string, userRaw: any) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getSavedUser(): any {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem("user");
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

function normalizeUser(userRaw: any): User | null {
  if (!userRaw) return null;

  const roleNormalized = (userRaw.role || "siswa").toLowerCase() as RoleType;
  let name = userRaw.email?.split("@")[0] || "User";

  if (userRaw.siswaProfile?.fullName) {
    name = userRaw.siswaProfile.fullName;
  } else if (userRaw.umkmProfile?.companyName) {
    name = userRaw.umkmProfile.companyName;
  } else if (userRaw.adminProfile?.schoolName) {
    name = userRaw.adminProfile.schoolName;
  } else if (userRaw.fullName) {
    name = userRaw.fullName;
  }

  return {
    id: userRaw.id || userRaw._id || userRaw.sub || "",
    email: userRaw.email,
    name,
    role: roleNormalized,
    siswaProfile: userRaw.siswaProfile || null,
    umkmProfile: userRaw.umkmProfile || null,
    adminProfile: userRaw.adminProfile || null,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokenState, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const savedToken = getToken();
    if (!savedToken) {
      setUser(null);
      setTokenState(null);
      setIsLoading(false);
      return;
    }

    setTokenState(savedToken);
    const cachedUser = getSavedUser();

    try {
      const res = await api.users.getMe();
      const userObj = res.user || res;
      // Merge cached profile details if me endpoint returns token payload
      const mergedUserObj = {
        ...cachedUser,
        ...userObj,
        siswaProfile: userObj.siswaProfile || cachedUser?.siswaProfile || null,
        umkmProfile: userObj.umkmProfile || cachedUser?.umkmProfile || null,
        adminProfile: userObj.adminProfile || cachedUser?.adminProfile || null,
      };

      const normUser = normalizeUser(mergedUserObj);
      setUser(normUser);
    } catch (err) {
      console.warn("Could not fetch current user profile from server:", err);
      // Fallback to cached user if token exists
      if (cachedUser) {
        setUser(normalizeUser(cachedUser));
      } else {
        removeToken();
        setTokenState(null);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const loginSuccess = (access_token: string, userRaw: any) => {
    setToken(access_token);
    setTokenState(access_token);
    if (userRaw && typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userRaw));
    }
    const normUser = normalizeUser(userRaw);
    setUser(normUser);
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token: tokenState,
        isAuthenticated: !!user,
        isLoading,
        loginSuccess,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
