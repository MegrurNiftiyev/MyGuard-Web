const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mygurad-backend-v2.onrender.com/api';

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

  const fullUrl = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  const method = options.method || 'GET';
  const startTime = Date.now();

  // === HTTP REQUEST INTERCEPTOR ===
  console.groupCollapsed(`[HTTP REQUEST] ${method} ${endpoint}`);
  console.log(`URL:`, fullUrl);
  console.log(`Headers:`, headers);
  if (options.body && typeof options.body === 'string') {
    try {
      console.log(`Body:`, JSON.parse(options.body));
    } catch {
      console.log(`Body:`, options.body);
    }
  } else if (options.body instanceof FormData) {
    console.log(`Body: [FormData]`);
  }
  console.groupEnd();
  // ================================

  const response = await fetch(fullUrl, {
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

  // Read response text to allow logging and parsing
  const responseText = await response.text().catch(() => '');
  let responseData: any = responseText;
  try {
    responseData = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    // Not JSON, keep as text
  }

  // === HTTP RESPONSE INTERCEPTOR ===
  const duration = Date.now() - startTime;
  console.groupCollapsed(`[HTTP RESPONSE] ${method} ${endpoint} - Status: ${response.status} [${duration}ms]`);
  console.log(`Response Data:`, responseData);
  console.groupEnd();
  // =================================

  if (!response.ok) {
    let defaultMsg = `Xəta baş verdi (${response.status})`;
    const errorData = responseData || {};
    if (response.status === 401 && endpoint.includes('/auth/login')) {
      defaultMsg = 'FİN kod və ya şifrə yanlışdır.';
    } else if (response.status === 409) {
      defaultMsg = 'Bu FİN kod və ya e-poçt ünvanı artıq başqa hesabda istifadə olunur.';
    } else if (response.status === 400) {
      defaultMsg = 'Daxil edilən məlumatlar natamam və ya yanlışdır.';
    }
    throw new Error(errorData.error || errorData.message || defaultMsg);
  }

  return responseData;
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
