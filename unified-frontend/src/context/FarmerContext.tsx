import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface Crop {
  crop: string;
  season: string;
  cultivated_area: string;
}

interface FarmerData {
  // Step 1: Personal & Demographics
  name: string;
  email?: string;
  phone?: string;
  age: string;
  gender: string;
  category: string;
  avatar_url?: string;
  // Step 2: Residence / Location
  state: string;
  district: string;
  taluka: string;
  village: string;
  pincode?: string;
  // Step 3: Farm & Land
  land_area: string;
  land_unit: string;
  ownership_type?: string;
  irrigation_availability: boolean;
  irrigation_type: string;
  soil_type: string;
  annual_income: string;
  kcc_holder?: boolean;
  aadhaar_linked_bank?: boolean;
  // Step 4: Crops
  crops: Crop[];
  // Step 5: Need
  needs: string[];
  // Generated
  farmer_id: string | null;
}

interface FarmerContextType {
  farmer: FarmerData;
  updateFarmer: (data: Partial<FarmerData>) => void;
  resetFarmer: () => void;
}

const STORAGE_KEY = 'kisaansathi_farmer_profile';

const defaultFarmer: FarmerData = {
  name: '',
  email: '',
  phone: '',
  age: '38',
  gender: 'Male',
  category: 'General',
  state: 'Maharashtra',
  district: 'Amravati',
  taluka: 'Achalpur',
  village: 'Dhamangaon',
  pincode: '444806',
  land_area: '2.5',
  land_unit: 'acres',
  ownership_type: 'Owner',
  irrigation_availability: true,
  irrigation_type: 'Drip',
  soil_type: 'Black',
  annual_income: '150000',
  kcc_holder: true,
  aadhaar_linked_bank: true,
  crops: [
    { crop: 'Cotton', season: 'Kharif', cultivated_area: '1.5' },
    { crop: 'Soybean', season: 'Kharif', cultivated_area: '1.0' }
  ],
  needs: ['financial', 'irrigation', 'farm_machinery'],
  farmer_id: 'FARMER-MH-2026',
};

const FarmerContext = createContext<FarmerContextType | undefined>(undefined);

export const FarmerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [farmer, setFarmer] = useState<FarmerData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultFarmer, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse saved farmer profile', e);
    }
    return defaultFarmer;
  });

  const updateFarmer = (data: Partial<FarmerData>) => {
    setFarmer(prev => {
      const updated = { ...prev, ...data };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save farmer profile to storage', e);
      }
      return updated;
    });
  };

  const resetFarmer = () => {
    setFarmer(defaultFarmer);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  return (
    <FarmerContext.Provider value={{ farmer, updateFarmer, resetFarmer }}>
      {children}
    </FarmerContext.Provider>
  );
};

export const useFarmer = () => {
  const context = useContext(FarmerContext);
  if (!context) throw new Error('useFarmer must be used within a FarmerProvider');
  return context;
};

export type { FarmerData, Crop };

