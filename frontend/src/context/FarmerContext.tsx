import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface Crop {
  crop: string;
  season: string;
  cultivated_area: string;
}

interface FarmerData {
  // Step 1: About You
  name: string;
  age: string;
  gender: string;
  category: string;
  // Step 2: Location
  state: string;
  district: string;
  taluka: string;
  village: string;
  // Step 3: Farm
  land_area: string;
  land_unit: string;
  irrigation_availability: boolean;
  irrigation_type: string;
  soil_type: string;
  annual_income: string;
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

const defaultFarmer: FarmerData = {
  name: '',
  age: '',
  gender: '',
  category: '',
  state: '',
  district: '',
  taluka: '',
  village: '',
  land_area: '',
  land_unit: 'acres',
  irrigation_availability: false,
  irrigation_type: '',
  soil_type: '',
  annual_income: '',
  crops: [{ crop: '', season: '', cultivated_area: '' }],
  needs: [],
  farmer_id: null,
};

const FarmerContext = createContext<FarmerContextType | undefined>(undefined);

export const FarmerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [farmer, setFarmer] = useState<FarmerData>(defaultFarmer);

  const updateFarmer = (data: Partial<FarmerData>) => {
    setFarmer(prev => ({ ...prev, ...data }));
  };

  const resetFarmer = () => setFarmer(defaultFarmer);

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
