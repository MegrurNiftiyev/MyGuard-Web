const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://myguard-backend-i4ll.onrender.com/api';

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('access_token');
  const userLang = localStorage.getItem('app_language') || 'az';

  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Accept-Language': userLang,
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
    // Attempt token refresh if available
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'Accept': 'application/json',
            'Accept-Language': userLang 
          },
          body: JSON.stringify({ refreshToken })
        });
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (refreshData.token) {
            localStorage.setItem('access_token', refreshData.token);
            // Retry original request with new token
            return apiClient<T>(endpoint, options);
          }
        }
      } catch (err) {
        console.warn('Auto refresh failed:', err);
      }
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

export function getAuthToken(): string | null {
  return localStorage.getItem('access_token');
}

export function setAuthTokens(token: string, refreshToken?: string): void {
  try {
    localStorage.setItem('access_token', token);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  } catch (err) {
    console.warn('Failed to set auth tokens:', err);
  }
}

export function clearAuthTokens(): void {
  try {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.clear();
    // Clear cookies
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  } catch (err) {
    console.warn('Storage purge error during logout:', err);
  }
}
