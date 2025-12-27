
export enum ScenarioId {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

export interface Scenario {
  id: ScenarioId;
  label: string;
  desc: string;
}

export interface Multiplier {
  label: string;
  value: number;
  desc: string;
}

export interface BessModel {
  id: string;
  name: string;
  power: number;
  energy: number;
  surge: number;
  cRate: number;
  weight: number;
  dims: string;
  tech: string;
  desc: string;
}

export interface LoadItem {
  id: number;
  name: string;
  kw: number;
  multiplier: number;
}

export interface FuelSavings {
  dailyLiters: number;
  monthlyTHB: number;
}

export interface CalculationResults {
  physicalLimit: number;
  effectiveGridLimit: number;
  totalPeakLoad: number;
  totalRatedLoad: number;
  shortfall: number;
  requiredBESSPower: number;
  requiredBESSEnergy: number;
  recommendedModel: BessModel | null;
  fitStatus: 'none' | 'perfect' | 'check_energy' | 'multiple';
  fuelSavings: FuelSavings | null;
}
