
import { 
  ScenarioId, 
  LoadItem, 
  CalculationResults, 
  BessModel 
} from '../types';
import { BESS_MODELS } from '../constants';

export const calculateSizing = (
  scenario: ScenarioId,
  transformerKVA: number,
  contractKW: number,
  baseLoad: number,
  loads: LoadItem[],
  gensetSize: number,
  dieselPrice: number
): CalculationResults => {
  // 1. Grid/Supply Ceiling
  // Standard MEA/PEA Transformer limit is ~80% of nameplate kVA
  const physicalLimit = transformerKVA * 0.8;
  
  // Effective limit: for Hybrid (C) it's based on Genset (80% load rule), for others it's Grid
  const effectiveGridLimit = scenario === ScenarioId.C 
    ? gensetSize * 0.8 
    : Math.min(physicalLimit, contractKW);

  // 2. Load Calculation
  let totalPeakLoad = baseLoad;
  let totalRatedLoad = baseLoad;

  loads.forEach(load => {
    totalPeakLoad += (load.kw * load.multiplier);
    totalRatedLoad += load.kw;
  });

  // 3. Gap Analysis
  const shortfall = Math.max(0, totalPeakLoad - effectiveGridLimit);
  // Add 20% safety margin to BESS power capability
  const requiredBESSPower = shortfall > 0 ? shortfall * 1.2 : 0;

  // 4. Energy Analysis
  // Scenario C needs deeper cycles (4h), others are transient peak shaving (2.5h)
  const duration = scenario === ScenarioId.C ? 4 : 2.5;
  const diversityFactor = 0.5; // Probability factor that not all cranes peak at the exact same second
  const requiredBESSEnergy = requiredBESSPower * duration * diversityFactor;

  // 5. Fuel Savings (Scenario C)
  let fuelSavings = null;
  if (scenario === ScenarioId.C) {
    const dailyHours = 10;
    const workingDays = 26;
    // Standard genset: ~0.25 L per kVA-hr
    const estConsumption = gensetSize * 0.25 * dailyHours;
    const savingRatio = 0.74; // JP Nelson PDF specific claim
    const savedLiters = estConsumption * savingRatio;
    const monthlyTHB = savedLiters * dieselPrice * workingDays;
    
    fuelSavings = {
      dailyLiters: savedLiters,
      monthlyTHB: monthlyTHB
    };
  }

  // 6. Model Matching
  let recommendedModel: BessModel | null = null;
  let fitStatus: CalculationResults['fitStatus'] = 'none';

  if (requiredBESSPower > 0 || scenario === ScenarioId.C) {
    const sortedModels = [...BESS_MODELS].sort((a, b) => a.power - b.power);

    if (scenario === ScenarioId.C) {
      // For fuel saving, always recommend HD for its high kWh/Price ratio
      recommendedModel = BESS_MODELS.find(m => m.id === 'bess-500hd') || null;
      fitStatus = 'perfect';
    } else {
      // Find smallest unit that handles both POWER and ENERGY requirements
      const match = sortedModels.find(m => m.power >= requiredBESSPower && m.energy >= requiredBESSEnergy);
      if (match) {
        recommendedModel = match;
        fitStatus = 'perfect';
      } else {
        const biggest = sortedModels[sortedModels.length - 1];
        if (biggest.power >= requiredBESSPower) {
          recommendedModel = biggest;
          fitStatus = 'check_energy';
        } else {
          recommendedModel = biggest;
          fitStatus = 'multiple';
        }
      }
    }
  }

  return {
    physicalLimit,
    effectiveGridLimit,
    totalPeakLoad,
    totalRatedLoad,
    shortfall,
    requiredBESSPower,
    requiredBESSEnergy,
    recommendedModel,
    fitStatus,
    fuelSavings
  };
};
