import { useState, useCallback } from 'react';
import type { Lead } from '@/types';
import { getAdminLeads, updateLeadStatus, deleteLead as apiDeleteLead } from '@/lib/supabase/queries';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdminLeads();
      setLeads(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changeStatus = async (id: string, status: Lead['status']) => {
    const success = await updateLeadStatus(id, status);
    if (success) {
      setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status } : lead));
    }
    return success;
  };

  const removeLead = async (id: string) => {
    const success = await apiDeleteLead(id);
    if (success) {
      setLeads(prev => prev.filter(lead => lead.id !== id));
    }
    return success;
  };

  return {
    leads,
    isLoading,
    error,
    fetchLeads,
    changeStatus,
    removeLead
  };
}
