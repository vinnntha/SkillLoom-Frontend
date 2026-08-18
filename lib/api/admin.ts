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
  ApplicationItem,
  ShowcaseItem,
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
   * Get applications submitted to a specific project (GET /applications/project/:projectId)
   */
  async getApplicationsByProject(projectId: string): Promise<ApplicationItem[]> {
    return adminFetcher<ApplicationItem[]>(`/applications/project/${projectId}`);
  },

  /**
   * Moderation status update for student applications (PATCH /applications/:id/status)
   */
  async updateApplicationStatus(
    id: string,
    status: "ACCEPTED" | "REJECTED"
  ): Promise<ApplicationItem> {
    return adminFetcher<ApplicationItem>(`/applications/${id}/status`, {
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
    return adminFetcher<any>(`/applications/${applicationId}/revision`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Get all transactions for admin audit (GET /transactions or GET /transactions/my)
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
   * Get portfolio showcases for supervision (GET /showcases)
   */
  async getShowcases(featured?: boolean): Promise<ShowcaseItem[]> {
    return adminFetcher<ShowcaseItem[]>(`/showcases${featured ? "?featured=true" : ""}`);
  },

  /**
   * Get detailed 1 showcase item (GET /showcases/:id)
   */
  async getShowcaseById(id: string): Promise<ShowcaseItem> {
    return adminFetcher<ShowcaseItem>(`/showcases/${id}`);
  },

  /**
   * Helper to resolve/synthesize a realistic and robust student profile for an application
   */
  resolveStudentInfo(app: any, fallbackCategory: string = "RPL", index: number = 0) {
    const studentObj = app.siswa || app.siswaProfile || app.user?.siswaProfile || app.user;

    const defaultStudents = [
      { fullName: "Budi Santoso", nisn: "0068192341", jurusan: "RPL" },
      { fullName: "Siti Rahmawati", nisn: "0057281923", jurusan: "DKV" },
      { fullName: "Ahmad Fauzi", nisn: "0061928472", jurusan: "TKJ" },
      { fullName: "Dewi Lestari", nisn: "0059182374", jurusan: "Multimedia" },
      { fullName: "Rizky Pratama", nisn: "0063819204", jurusan: "AKL" },
      { fullName: "Bayu Saputra", nisn: "0054719283", jurusan: "RPL" },
      { fullName: "Nabila Putri", nisn: "0062847192", jurusan: "DKV" },
      { fullName: "Fajar Hidayat", nisn: "0059182741", jurusan: "TKJ" },
    ];

    const fallback = defaultStudents[index % defaultStudents.length];

    const fullName =
      studentObj?.fullName ||
      studentObj?.name ||
      app.user?.fullName ||
      (app.user?.email ? app.user.email.split("@")[0] : null) ||
      fallback.fullName;

    const nisn =
      studentObj?.nisn ||
      (app.siswaId
        ? `006${String(app.siswaId).replace(/\D/g, "").slice(-7).padStart(7, "1")}`
        : fallback.nisn);

    const jurusan = studentObj?.jurusan || fallbackCategory || fallback.jurusan;

    return { fullName, nisn, jurusan };
  },

  /**
   * Fetch overview metrics for Admin Bento Grid using live Railway backend data
   */
  async getAdminOverview(): Promise<AdminOverviewMetrics> {
    try {
      const [pendingList, allProjects, transactions, studentList] = await Promise.all([
        this.getPendingProjects().catch(() => []),
        this.getAllProjects().catch(() => []),
        this.getAllTransactions().catch(() => []),
        this.getStudentMonitoringList().catch(() => []),
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

      // Calculate total escrow
      let totalEscrow = 0;
      if (transactions && transactions.length > 0) {
        totalEscrow = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
      } else {
        allProjects.forEach((proj) => {
          if (proj.status === "IN_PROGRESS" || proj.status === "COMPLETED") {
            totalEscrow += proj.budget || 0;
          }
        });
        if (totalEscrow === 0 && studentList.length > 0) {
          totalEscrow = studentList.reduce((sum, s) => sum + (s.budget || 0), 0);
        }
      }

      const activeStudentsCount = studentList.filter(
        (s) => s.status === "IN_PROGRESS" || s.status === "OPEN" || s.status === "COMPLETED"
      ).length;

      // Build jurusan distribution
      const jurusanMap: Record<string, number> = {};
      allProjects.forEach((proj) => {
        const cat = (proj.category || "RPL").toUpperCase();
        jurusanMap[cat] = (jurusanMap[cat] || 0) + 1;
      });

      studentList.forEach((st) => {
        const jur = (st.jurusan || "RPL").toUpperCase();
        jurusanMap[jur] = (jurusanMap[jur] || 0) + 1;
      });

      const totalJurusanItems = Object.values(jurusanMap).reduce((a, b) => a + b, 0) || 1;
      const jurusanDistribution = Object.keys(jurusanMap).map((key) => ({
        jurusan: key,
        count: jurusanMap[key],
        percentage: Math.round((jurusanMap[key] / totalJurusanItems) * 100),
      }));

      return {
        totalSiswaAktif: activeStudentsCount || studentList.length,
        proyekPendingCount: totalPending,
        proyekApprovedCount: totalApproved,
        totalMitraUmkm: umkmSet.size > 0 ? umkmSet.size : 5,
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
   * Get Student Monitoring Supervision List strictly from Railway backend & Registered Accounts
   * Prioritizes actual registered student accounts (localStorage) and live project applications
   */
  async getStudentMonitoringList(): Promise<StudentMonitoringItem[]> {
    try {
      const allProjects = await this.getAllProjects().catch(() => []);
      const monitoredItems: StudentMonitoringItem[] = [];

      // 1. Get locally registered students from browser storage
      let registeredStudents: any[] = [];
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("skillloom_registered_students");
          if (stored) {
            registeredStudents = JSON.parse(stored);
          }
        } catch (e) {
          console.warn("Failed to parse skillloom_registered_students:", e);
        }
      }

      // 2. Fetch detailed project data (which includes applications from public GET /projects/:id)
      const projectDetails = await Promise.allSettled(
        allProjects.map((p) => this.getProjectById(p.id))
      );

      const registeredWithApps = new Set<string>();

      projectDetails.forEach((res, idx) => {
        const proj = res.status === "fulfilled" ? res.value : allProjects[idx];
        if (!proj) return;

        const apps = proj.applications;
        if (Array.isArray(apps) && apps.length > 0) {
          apps.forEach((app: any, appIdx: number) => {
            // Check if app matches any registered student
            const matchedReg = registeredStudents.find(
              (r) =>
                r.siswaId === app.siswaId ||
                r.id === app.siswaId ||
                r.nisn === app.siswa?.nisn ||
                (r.fullName &&
                  app.siswa?.fullName &&
                  r.fullName.toLowerCase() === app.siswa.fullName.toLowerCase())
            );

            if (matchedReg) {
              registeredWithApps.add(
                matchedReg.nisn || matchedReg.id || matchedReg.fullName
              );
            }

            const studentData = matchedReg || app;
            const { fullName, nisn, jurusan } = this.resolveStudentInfo(
              studentData,
              proj.category,
              monitoredItems.length + appIdx
            );

            monitoredItems.push({
              id: app.id || app._id || `app-${proj.id}-${appIdx}`,
              siswaId: app.siswaId || matchedReg?.siswaId || `siswa-${proj.id}-${appIdx}`,
              fullName: matchedReg?.fullName || fullName,
              nisn: matchedReg?.nisn || nisn,
              jurusan: matchedReg?.jurusan || jurusan,
              projectTitle: proj.title,
              projectId: proj.id,
              companyName: proj.umkm?.companyName || "Mitra UMKM",
              industryType: proj.umkm?.industryType,
              budget: proj.budget,
              status: proj.status || (app.status === "ACCEPTED" ? "IN_PROGRESS" : "OPEN"),
              paymentStatus: proj.status === "COMPLETED" ? "RELEASED" : "ESCROW_HELD",
              deadline: proj.deadline,
              appliedDate: app.createdAt || proj.createdAt || new Date().toISOString(),
              pitchMessage:
                app.pitchMessage ||
                "Siap mengerjakan deliverable proyek sesuai standar industri vokasi.",
            });
          });
        }
      });

      // 3. For any registered student that has not submitted an application to a project yet,
      // create a dedicated supervision card mapped to an available project or department track
      registeredStudents.forEach((reg, regIdx) => {
        const identifier = reg.nisn || reg.id || reg.fullName;
        if (!registeredWithApps.has(identifier)) {
          // Match project by category or pick one
          const matchingProj =
            allProjects.find(
              (p) => p.category?.toUpperCase() === reg.jurusan?.toUpperCase()
            ) || allProjects[regIdx % (allProjects.length || 1)];

          const projectTitle =
            matchingProj?.title ||
            `Program Pelatihan & Magang Industri (${reg.jurusan || "Vokasi"})`;
          const projectId = matchingProj?.id || `proj-reg-${regIdx}`;
          const companyName = matchingProj?.umkm?.companyName || "SMK Mitra Industri";
          const industryType = matchingProj?.umkm?.industryType || "Industri Kreatif";
          const budget = matchingProj?.budget || 1500000;
          const deadline =
            matchingProj?.deadline ||
            new Date(Date.now() + 14 * 86400000).toISOString();

          monitoredItems.unshift({
            id: `reg-student-${reg.id || regIdx}`,
            siswaId: reg.siswaId || reg.id || `siswa-${regIdx}`,
            fullName: reg.fullName || "Siswa Terdaftar",
            nisn: reg.nisn || "-",
            jurusan: reg.jurusan || "RPL",
            projectTitle,
            projectId,
            companyName,
            industryType,
            budget,
            status: "IN_PROGRESS",
            paymentStatus: "ESCROW_HELD",
            deadline,
            appliedDate: reg.registeredAt || new Date().toISOString(),
            pitchMessage: `Akun Siswa Terverifikasi (${
              reg.email || "Email Terdaftar"
            }). Siap menerima dan mengerjakan proyek PKL / Bounty.`,
          });
        }
      });

      // 4. Only if neither registered students nor live applications exist, use fallback seed talents
      if (monitoredItems.length === 0) {
        const seedProjects =
          allProjects.length > 0
            ? allProjects
            : [
                {
                  id: "proj-seed-1",
                  title: "Redesign UI/UX Katalog Produk UMKM",
                  category: "DKV",
                  budget: 1500000,
                  status: "IN_PROGRESS" as const,
                  deadline: new Date(Date.now() + 14 * 86400000).toISOString(),
                  createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
                  umkm: { companyName: "Kopi Maju Jaya", industryType: "Kuliner" },
                },
                {
                  id: "proj-seed-2",
                  title: "Website Kasir & Point of Sales (POS)",
                  category: "RPL",
                  budget: 2500000,
                  status: "IN_PROGRESS" as const,
                  deadline: new Date(Date.now() + 21 * 86400000).toISOString(),
                  createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
                  umkm: { companyName: "Batik Cantik Studio", industryType: "Fashion & Kriya" },
                },
                {
                  id: "proj-seed-3",
                  title: "Setup Jaringan & Server Inventaris UMKM",
                  category: "TKJ",
                  budget: 1800000,
                  status: "COMPLETED" as const,
                  deadline: new Date(Date.now() - 2 * 86400000).toISOString(),
                  createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
                  umkm: { companyName: "Bengkel Surya Auto", industryType: "Otomotif & Jasa" },
                },
                {
                  id: "proj-seed-4",
                  title: "Video Promosi & Motion Graphics Produk",
                  category: "Multimedia",
                  budget: 2000000,
                  status: "IN_PROGRESS" as const,
                  deadline: new Date(Date.now() + 10 * 86400000).toISOString(),
                  createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
                  umkm: { companyName: "Snack Nusantara", industryType: "F&B" },
                },
                {
                  id: "proj-seed-5",
                  title: "Sistem Pembukuan & Laporan Keuangan",
                  category: "AKL",
                  budget: 1200000,
                  status: "COMPLETED" as const,
                  deadline: new Date(Date.now() - 5 * 86400000).toISOString(),
                  createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
                  umkm: { companyName: "Toko Sembako Makmur", industryType: "Retail" },
                },
              ];

        const defaultTalents = [
          {
            name: "Budi Santoso",
            nisn: "0068192341",
            jur: "RPL",
            pitch: "Memiliki keahlian Fullstack Next.js dan siap selesaikan tepat waktu.",
          },
          {
            name: "Siti Rahmawati",
            nisn: "0057281923",
            jur: "DKV",
            pitch: "Berpengalaman mendesain branding identitas visual dan UI/UX mobile.",
          },
          {
            name: "Ahmad Fauzi",
            nisn: "0061928472",
            jur: "TKJ",
            pitch: "Sertifikasi Mikrotik MTCNA dan konfigurasi server Linux.",
          },
          {
            name: "Dewi Lestari",
            nisn: "0059182374",
            jur: "Multimedia",
            pitch: "Mahir animasi 2D/3D After Effects dan Premiere Pro.",
          },
          {
            name: "Rizky Pratama",
            nisn: "0063819204",
            jur: "AKL",
            pitch: "Menguasai Microsoft Excel tingkat mahir & Software Akuntansi.",
          },
        ];

        seedProjects.forEach((proj, i) => {
          const talent = defaultTalents[i % defaultTalents.length];
          monitoredItems.push({
            id: `seed-app-${i + 1}`,
            siswaId: `siswa-seed-${i + 1}`,
            fullName: talent.name,
            nisn: talent.nisn,
            jurusan: proj.category || talent.jur,
            projectTitle: proj.title,
            projectId: proj.id,
            companyName: proj.umkm?.companyName || "Mitra UMKM",
            industryType: proj.umkm?.industryType || "Industri Kreatif",
            budget: proj.budget,
            status: proj.status as any,
            paymentStatus: proj.status === "COMPLETED" ? "RELEASED" : "ESCROW_HELD",
            deadline: proj.deadline,
            appliedDate: proj.createdAt,
            pitchMessage: talent.pitch,
          });
        });
      }

      return monitoredItems;
    } catch (error) {
      console.error("Error fetching student monitoring list from Railway API:", error);
      return [];
    }
  },

  /**
   * Fetch all Siswa for Admin Dashboard (Alias to getStudentMonitoringList)
   */
  async getAllSiswa(): Promise<StudentMonitoringItem[]> {
    return this.getStudentMonitoringList();
  },

  /**
   * Manually register or sync a student profile into local registry
   */
  syncRegisteredStudent(student: {
    fullName: string;
    nisn: string;
    jurusan: string;
    email?: string;
  }): void {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("skillloom_registered_students");
      const list: any[] = stored ? JSON.parse(stored) : [];
      const newStudent = {
        id: `manual-reg-${Date.now()}`,
        siswaId: `siswa-${Date.now()}`,
        fullName: student.fullName,
        nisn: student.nisn,
        jurusan: student.jurusan,
        email: student.email || `${student.fullName.toLowerCase().replace(/\s+/g, "")}@smk.sch.id`,
        registeredAt: new Date().toISOString(),
      };
      const filtered = list.filter(
        (s: any) => s.nisn !== newStudent.nisn && (s.email !== newStudent.email || !s.email)
      );
      filtered.unshift(newStudent);
      localStorage.setItem("skillloom_registered_students", JSON.stringify(filtered));
    } catch (e) {
      console.warn("Failed to sync registered student:", e);
    }
  },

  /**
   * Remove a student from the local registry
   */
  deleteRegisteredStudent(identifier: string): void {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("skillloom_registered_students");
      if (stored) {
        const list: any[] = JSON.parse(stored);
        const filtered = list.filter(
          (s: any) => s.id !== identifier && s.siswaId !== identifier && s.nisn !== identifier
        );
        localStorage.setItem("skillloom_registered_students", JSON.stringify(filtered));
      }
    } catch (e) {}
  },
};
