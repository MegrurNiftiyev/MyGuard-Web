import { apiClient } from './apiClient';

export interface DefenseModel {
  id: string;
  name: string;
  mode: string;
  status: 'Active' | 'Inactive' | 'Training';
  isLocal: boolean;
  lastUpdate: string;
  provider: string;
  description: string;
  latency?: string;
  maxContext?: string;
}

export const adminApi = {
  async getModels(): Promise<DefenseModel[]> {
    const res = await apiClient<{ models: DefenseModel[] }>('/admin/models');
    return res.models || [];
  }
};
