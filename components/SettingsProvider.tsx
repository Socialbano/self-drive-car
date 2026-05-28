'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BUSINESS } from '@/lib/constants';
import { supabase } from '@/lib/supabase/client';

import { BusinessSettings, DEFAULT_SETTINGS, mapDatabaseSettings } from '@/lib/settings-utils';

export interface Location {
  id: string;
  name: string;
  slug: string;
  category: 'city' | 'area';
  title?: string;
  description?: string;
  street_address?: string;
  hero_image?: string;
  icon_name?: string;
  badge_text?: string;
  heading_prefix?: string;
  heading_highlight?: string;
  hero_description?: string;
  whatsapp_msg?: string;
  display_order: number;
  is_active: boolean;
}

interface SettingsContextType {
  settings: BusinessSettings;
  locations: Location[];
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ 
  children,
  initialSettings,
  initialLocations,
}: { 
  children: React.ReactNode;
  initialSettings?: BusinessSettings;
  initialLocations?: Location[];
}) {
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings || DEFAULT_SETTINGS);
  const [locations, setLocations] = useState<Location[]>(initialLocations || []);
  const [loading, setLoading] = useState(!initialSettings);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/settings?t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      
      if (data && Object.keys(data).length > 0) {
        setSettings(mapDatabaseSettings(data));
      }

      // Fetch dynamic active locations from Supabase
      const { data: locData, error: locError } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (!locError && locData) {
        setLocations(locData as Location[]);
      }
    } catch (error) {
      console.error('Error loading settings from DB:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, locations, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
