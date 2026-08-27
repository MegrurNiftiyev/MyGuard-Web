import { apiClient } from './apiClient';

export interface AgentSecurityAction {
  id: string;
  agent: string;
  action: string;
  file: string;
  destination: string;
  sensitivity: 'Low' | 'Medium' | 'High' | 'Critical';
  decision: 'ALLOWED' | 'BLOCKED' | 'PENDING';
  timestamp: string;
  reason?: string;
}

export const securityApi = {
  async getActions(): Promise<AgentSecurityAction[]> {
    const res = await apiClient<{ actions: AgentSecurityAction[] }>('/security/actions');
    return res.actions || [];
  },

  async updateDecision(id: string, decision: 'ALLOWED' | 'BLOCKED'): Promise<AgentSecurityAction> {
    const res = await apiClient<{ success: boolean; action: AgentSecurityAction }>(`/security/actions/${id}/decision`, {
      method: 'PATCH',
      body: JSON.stringify({ decision }),
    });
    return res.action;
  }
};
