
import { ScenarioId, Scenario, Multiplier, BessModel } from './types';

export const SCENARIOS: Scenario[] = [
  { id: ScenarioId.A, label: 'Peak Shaving (Cost Saving)', desc: 'Reduce MEA Demand Charges by capping grid usage.' },
  { id: ScenarioId.B, label: 'Power Stability', desc: 'Prevent voltage dips and nuisance trips on sensitive sites.' },
  { id: ScenarioId.C, label: 'Generator Hybrid', desc: 'Reduce Diesel Consumption (Up to 74% Saving based on JP Nelson trials).' },
  { id: ScenarioId.D, label: 'Grid Augmentation', desc: 'The Transformer is physically too small for the site peak load.' },
];

export const MULTIPLIERS: Multiplier[] = [
  { label: 'VFD / Inverter (New Crane)', value: 4, desc: '4x Rated Power' },
  { label: 'Soft Starter (New Hoist)', value: 6, desc: '6x Rated Power' },
  { label: 'Star-Delta / DOL (Old Equipment)', value: 10, desc: '10x Rated Power' },
];

export const BESS_MODELS: BessModel[] = [
  { 
    id: 'bess-300', 
    name: 'JP Nelson BESS-300', 
    power: 300, 
    energy: 176.6, 
    surge: 519, 
    cRate: 1.7,
    weight: 5.2,
    dims: '2.34m x 2.00m x 2.20m',
    tech: 'Semi-Solid State LFP',
    desc: 'Compact unit for smaller sites.'
  },
  { 
    id: 'bess-500', 
    name: 'JP Nelson BESS-500', 
    power: 500, 
    energy: 353.2, 
    surge: 864, 
    cRate: 1.4,
    weight: 5.5,
    dims: '2.34m x 2.00m x 2.20m',
    tech: 'Semi-Solid State LFP',
    desc: 'Standard solution for Tower Cranes.'
  },
  { 
    id: 'bess-500hd', 
    name: 'JP Nelson BESS-500/HD', 
    power: 500, 
    energy: 529.8, 
    surge: 864, 
    cRate: 0.9,
    weight: 8.0,
    dims: '3.00m x 2.20m x 2.25m',
    tech: 'Semi-Solid State LFP',
    desc: 'High Capacity optimized for Diesel Saving.'
  },
];
