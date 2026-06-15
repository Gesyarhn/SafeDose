export type RouteType = 'oral_sirup' | 'oral_tablet' | 'oral_kapsul' | 'injeksi_iv' | 'injeksi_im' | 'injeksi_sc';

export interface DrugPreparation {
  id: string;
  name: string;
  route: RouteType;
  concentrationMg?: number;
  concentrationMl?: number;
  dosePerUnitMg?: number;
  packagingUnit?: string;
  volumePerPackaging?: number;
}

export interface DrugData {
  id: string;
  name: string;
  baseDoseMgPerKg: number;
  frequencyPerDay: number;
  type: string;
  indications?: string;
  contraindications?: string[];
  interactions?: string[];
  referenceSource?: string;
  preparations: DrugPreparation[];
}

export interface EmergencyDrug {
  id: string;
  name: string;
  doseMgPerKg: number;
  maxDoseMg: number;
  minDoseMg?: number;
  concentrationMg: number;
  concentrationMl: number;
  notes: string;
  category?: string;
}

export interface PatientData {
  age: number;
  weight: number;
  gender: string;
  conditions: string[];
}

export interface ParameterData {
  indication: string;
  doseMgPerKg: number;
  frequency: number;
  preparationId: string;
}
