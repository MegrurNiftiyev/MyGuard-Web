import { apiClient, setAuthTokens, clearAuthTokens } from './apiClient';

export interface UserProfile {
  uid: string;
  fullName: string;
  finCode: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin' | 'auditor';
  department?: string;
  authProvider?: string;
  createdAt?: string;
}

export const OFFICIAL_DEPARTMENTS = [
  'İnformasiya Texnologiyaları və Kibertəhlükəsizlik',
  'Maliyyə və İqtisadiyyat',
  'Hüquq və Komplaens',
  'İnsan Resursları (HR)',
  'Əməliyyatlar və Logistika',
  'Strateji İnkişaf və Layihələr',
  'Ümumi Şöbə və Dəftərxana'
] as const;

export type OfficialDepartment = typeof OFFICIAL_DEPARTMENTS[number];

export interface RegisterPayload {
  fullName: string;
  finCode: string;
  email: string;
  phone?: string;
  password: string;
  department: string;
}

export interface LoginPayload {
  finCode?: string;
  email?: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  refreshToken?: string;
  user: UserProfile;
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.token) {
      setAuthTokens(res.token, res.refreshToken);
    }
    return res;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.token) {
      setAuthTokens(res.token, res.refreshToken);
    }
    return res;
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const res = await apiClient<{ user: UserProfile }>('/users/me');
      return res.user;
    } catch (err) {
      console.warn('Failed to fetch current user profile:', err);
      return null;
    }
  },

  async forgotPassword(identifier: string): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    });
  },

  async resendOtp(identifier: string): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    });
  },

  async checkOtp(identifier: string, otp: string): Promise<{ success: boolean; resetToken: string }> {
    return apiClient<{ success: boolean; resetToken: string }>('/auth/check-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier, otp }),
    });
  },

  async changePassword(identifier: string, newPassword: string, resetToken: string): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ identifier, newPassword, resetToken }),
    });
  },

  logout(): void {
    clearAuthTokens();
  }
};
