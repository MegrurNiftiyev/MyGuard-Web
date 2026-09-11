import { apiClient } from './apiClient';

export interface PlatformSettings {
  ocrThreshold?: number;
  sensitivity?: 'Low' | 'Medium' | 'High';
  confidentialMode?: boolean;
  allowExternalAi?: boolean;
  [key: string]: any;
}

export const settingsApi = {
  async getSettings(): Promise<PlatformSettings> {
    try {
      return await apiClient<PlatformSettings>('/settings');
    } catch (err) {
      console.warn('API getSettings fallback:', err);
      return {};
    }
  },

  async updateSettings(settings: PlatformSettings): Promise<{ success: boolean; settings?: PlatformSettings }> {
    try {
      return await apiClient<{ success: boolean; settings?: PlatformSettings }>('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
    } catch (err) {
      console.warn('API updateSettings fallback:', err);
      return { success: true, settings };
    }
  }
};
