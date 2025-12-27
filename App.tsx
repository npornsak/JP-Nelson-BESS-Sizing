
import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Settings, 
  Plus, 
  Trash2, 
  Info, 
  TrendingUp, 
  CheckCircle, 
  Fuel,
  LayoutDashboard,
  Copy,
  AlertTriangle,
  ChevronRight,
  HardHat,
  Battery
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { ScenarioId, LoadItem, CalculationResults } from './types';
import { SCENARIOS, MULTIPLIERS, BESS_MODELS } from './constants';
import { calculateSizing } from './services/calculationEngine';

const App: React.FC = () => {
  // --- STATE ---
  const [scenario, setScenario] = useState<ScenarioId>(ScenarioId.D);
  const [transformerKVA, setTransformerKVA] = useState(500);
  const [contractKW, setContractKW] = useState(400);
  const [baseLoad, setBaseLoad] = useState(30);
  const [dieselPrice, setDieselPrice] = useState(32);
  const [gensetSize, setGensetSize] = useState(250);
  const [loads, setLoads] = useState<LoadItem[]>([
    { id: 1, name: 'Tower Crane 1', kw: 45, multiplier: 4 },
    { id: 2, name: 'Passenger Hoist', kw: 30, multiplier: 6 },
  ]);

  // --- CALCULATIONS ---
  const results = useMemo(() => {
    return calculateSizing(
      scenario,
      transformerKVA,
      contractKW,
      baseLoad,
      loads,
      gensetSize,
      dieselPrice
    );
  }, [scenario, transformerKVA, contractKW, baseLoad, loads, gensetSize, dieselPrice]);

  // --- CHART DATA ---
  const chartData = [
    { name: 'Base Load', value: baseLoad, fill: '#64748b' },
    ...loads.map(l => ({ name: l.name, value: Number(l.kw) * l.multiplier, fill: '#ef4444' }))
  ];

  // --- HANDLERS ---
  const addLoad = () => {
    const newId = Date.now();
    setLoads([...loads, { id: newId, name: 'New Equipment', kw: 0, multiplier: 4 }]);
  };

  /**
   * Refined updateLoad to handle empty strings during typing 
   * to fix the "cannot fill data" bug where 0 prevents editing.
   */
  const updateLoad = (id: number, field: keyof LoadItem, value: any) => {
    setLoads(prevLoads => prevLoads.map(l => {
      if (l.id === id) {
        return { ...l, [field]: value };
      }
      return l;
    }));
  };

  const removeLoad = (id: number) => {
    setLoads(loads.filter(l => l.id !== id));
  };

  const copyProposal = () => {
    const text = document.getElementById('proposal-area')?.innerText;
    if (text) {
      navigator.clipboard.writeText(text);
      alert('Proposal copied to clipboard!');
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => e.target.select();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white p-5 shadow-2xl border-b-4 border-red-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-2.5 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.4)]">
              <Battery className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase italic flex items-center gap-2">
                JP NELSON <span className="text-red-500">BESS</span>
                <span className="text-xs bg-red-600 text-white not-italic px-2 py-0.5 rounded font-bold ml-2">PRO</span>
              </h1>
              <p className="text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase">Sizing & Proposal Engineering Suite</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden lg:flex items-center gap-3 mr-4">
                <HardHat className="w-5 h-5 text-slate-500" />
                <span className="text-xs font-bold text-slate-400">SINGAPORE | MALAYSIA | THAILAND</span>
             </div>
             <div className="h-8 w-px bg-slate-700 hidden md:block"></div>
             <div className="flex gap-2">
                <button className="bg-slate-800 hover:bg-slate-700 p-2 rounded border border-slate-700 transition-colors">
                   <Settings className="w-5 h-5 text-slate-400" />
                </button>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        
        {/* LEFT COLUMN: CONFIGURATION */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Step 1: Site Parameters */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="flex items-center font-bold text-slate-800 gap-2 uppercase tracking-wider text-sm">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs">1</div>
                Site Configuration
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] mb-2">Primary Operational Objective</label>
                <div className="relative">
                  <select 
                    className="w-full bg-white border-2 border-slate-100 rounded-xl p-4 text-slate-800 font-bold focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all appearance-none cursor-pointer"
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value as ScenarioId)}
                  >
                    {SCENARIOS.map(s => (
                      <option key={s.id} value={s.id}>{s.id}: {s.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronRight className="w-5 h-5 text-slate-400 rotate-90" />
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-3 text-xs text-slate-600 bg-blue-50/60 p-4 rounded-xl border border-blue-100">
                  <Info className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                  <p className="leading-relaxed font-medium">{SCENARIOS.find(s => s.id === scenario)?.desc}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scenario === ScenarioId.C ? (
                  <>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">Genset Capacity (kVA)</label>
                      <div className="relative group">
                        <input 
                          type="number" 
                          onFocus={handleFocus}
                          className="w-full border-2 border-slate-100 rounded-xl p-4 pr-12 text-slate-800 font-bold focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all group-hover:border-slate-200"
                          value={gensetSize || ''}
                          onChange={(e) => setGensetSize(e.target.value === '' ? 0 : Number(e.target.value))}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[10px] italic">kVA</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">Diesel Price (THB/L)</label>
                      <div className="relative group">
                        <input 
                          type="number" 
                          onFocus={handleFocus}
                          className="w-full border-2 border-slate-100 rounded-xl p-4 pr-12 text-slate-800 font-bold focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all group-hover:border-slate-200"
                          value={dieselPrice || ''}
                          onChange={(e) => setDieselPrice(e.target.value === '' ? 0 : Number(e.target.value))}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[10px] italic">THB</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">Transformer Rating</label>
                      <div className="relative group">
                        <input 
                          type="number" 
                          onFocus={handleFocus}
                          className="w-full border-2 border-slate-100 rounded-xl p-4 pr-12 text-slate-800 font-bold focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all group-hover:border-slate-200"
                          value={transformerKVA || ''}
                          onChange={(e) => setTransformerKVA(e.target.value === '' ? 0 : Number(e.target.value))}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[10px] italic">kVA</span>
                      </div>
                      <p className="text-[9px] text-green-600 font-bold uppercase tracking-wider pl-1">Max Sustain: {results.physicalLimit.toFixed(0)} kW</p>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">Contract kW / MCCB</label>
                      <div className="relative group">
                        <input 
                          type="number" 
                          onFocus={handleFocus}
                          className="w-full border-2 border-slate-100 rounded-xl p-4 pr-12 text-slate-800 font-bold focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all group-hover:border-slate-200"
                          value={contractKW || ''}
                          onChange={(e) => setContractKW(e.target.value === '' ? 0 : Number(e.target.value))}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[10px] italic">kW</span>
                      </div>
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">Base Load (Steady)</label>
                  <div className="relative group">
                    <input 
                      type="number" 
                      onFocus={handleFocus}
                      className="w-full border-2 border-slate-100 rounded-xl p-4 pr-12 text-slate-800 font-bold focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all group-hover:border-slate-200"
                      value={baseLoad || ''}
                      onChange={(e) => setBaseLoad(e.target.value === '' ? 0 : Number(e.target.value))}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[10px] italic">kW</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 2: Equipment Profile */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="flex items-center font-bold text-slate-800 gap-2 uppercase tracking-wider text-sm">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs">2</div>
                Heavy Equipment Profile
              </h2>
              <button 
                onClick={addLoad}
                className="flex items-center gap-2 bg-slate-900 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-black transition-all active:scale-95 shadow-lg shadow-slate-200"
              >
                <Plus className="w-4 h-4" /> ADD UNIT
              </button>
            </div>
            <div className="p-6 space-y-4">
              {loads.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No site equipment detected.</p>
                </div>
              )}
              {loads.map((load) => (
                <div key={load.id} className="group relative grid grid-cols-1 md:grid-cols-12 gap-4 p-5 bg-white rounded-xl border-2 border-slate-100 hover:border-red-100 hover:shadow-md transition-all">
                  <div className="md:col-span-5">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Description</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border-2 border-transparent rounded-lg p-3 text-sm font-bold outline-none focus:bg-white focus:border-red-500 transition-all"
                      value={load.name}
                      onChange={(e) => updateLoad(load.id, 'name', e.target.value)}
                      placeholder="e.g. Luffing Crane #1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Rated kW</label>
                    <input 
                      type="number" 
                      onFocus={handleFocus}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-lg p-3 text-sm font-bold outline-none focus:bg-white focus:border-red-500 transition-all"
                      value={load.kw || ''}
                      onChange={(e) => updateLoad(load.id, 'kw', e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Starter Type</label>
                    <select 
                      className="w-full bg-slate-50 border-2 border-transparent rounded-lg p-3 text-sm font-bold outline-none focus:bg-white focus:border-red-500 transition-all"
                      value={load.multiplier}
                      onChange={(e) => updateLoad(load.id, 'multiplier', Number(e.target.value))}
                    >
                      {MULTIPLIERS.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-4 mt-2 md:mt-0">
                    <div className="text-right">
                      <div className="text-[8px] font-black text-red-500 uppercase tracking-widest">PEAK SURGE</div>
                      <div className="text-xl font-black text-slate-800 tracking-tighter leading-none">
                        {(Number(load.kw) * load.multiplier).toFixed(0)}
                        <span className="text-[10px] ml-1">kW</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeLoad(load.id)}
                      className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-8 p-5 bg-slate-900 rounded-2xl border-l-8 border-red-600 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <TrendingUp className="w-20 h-20 text-white" />
                </div>
                <div className="flex gap-4 items-start relative z-10">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white text-xs font-black uppercase tracking-widest mb-1">Grid Impact Warning</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Tower cranes and hoists produce significant <strong>10-second spikes</strong>. 
                      Standard breakers often trip on these transient surges even if average load is within limits. 
                      JP Nelson BESS captures these spikes to prevent site-wide nuisance tripping.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 3: Sales Proposal */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="flex items-center font-bold text-slate-800 gap-2 uppercase tracking-wider text-sm">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs">3</div>
                Client Proposal Content
              </h2>
              <button 
                onClick={copyProposal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2"
              >
                <Copy className="w-4 h-4" /> COPY TEXT
              </button>
            </div>
            <div className="p-6">
              <div 
                id="proposal-area"
                className="bg-slate-50 text-slate-700 p-8 rounded-2xl font-mono text-[11px] leading-relaxed whitespace-pre-wrap border-2 border-slate-100 shadow-inner max-h-96 overflow-y-auto selection:bg-red-200"
              >
{`SUBJECT: JP NELSON BESS SYSTEM SIZING & SITE ANALYSIS

ATTN: PROJECT MANAGER / ELECTRICAL ENGINEER

BASED ON THE SITE PARAMETERS PROVIDED, JP NELSON EQUIPMENT GROUP HAS COMPLETED THE ENERGY STORAGE SIZING ANALYSIS.

[1] SITE CAPACITY ANALYSIS:
------------------------------------------------------------
- OPERATIONAL MODE: ${SCENARIOS.find(s=>s.id === scenario)?.label.toUpperCase()}
- SITE SUSTAINED LIMIT: ${results.effectiveGridLimit.toFixed(0)} kW
- CALCULATED PEAK SURGE: ${results.totalPeakLoad.toFixed(0)} kW
- POWER GAP TO BRIDGE: ${results.shortfall.toFixed(0)} kW (+20% SAFETY BUFFER APPLIED)

[2] BESS RECOMMENDATION:
------------------------------------------------------------
- RECOMMENDED UNIT: ${results.recommendedModel ? results.recommendedModel.name.toUpperCase() : 'CUSTOM MULTI-UNIT ARRAY'}
- POWER CAPABILITY: ${results.recommendedModel?.power || 'CALCULATED'} kW
- STORAGE CAPACITY: ${results.recommendedModel?.energy || 'CALCULATED'} kWh
- CELL TECHNOLOGY: SEMI-SOLID STATE LFP (ULTRA-SAFE)
- UNIT FOOTPRINT: ${results.recommendedModel?.dims || 'MODULAR'}
${results.fuelSavings ? `
[3] ECONOMIC IMPACT (HYBRID MODE):
------------------------------------------------------------
- EST. MONTHLY SAVING: ${results.fuelSavings.monthlyTHB.toLocaleString()} THB
- EST. DIESEL OFFSET: ${results.fuelSavings.dailyLiters.toFixed(0)} L / DAY
- CARBON OFFSET: SIGNIFICANT REDUCTION IN EMISSIONS & NOISE` : ''}

[4] TECHNICAL JUSTIFICATION:
------------------------------------------------------------
THE PROPOSED JP NELSON BESS WILL ACT AS A HIGH-SPEED POWER BUFFER. IT WILL DISCHARGE INSTANTANEOUSLY DURING CRANE STARTUP (SURGE PHASES) AND RECHARGE DURING THE "DWELL" TIMES FROM YOUR GRID/GENSET SUPPLY. THIS ENSURES THE SOURCE NEVER SEES THE PEAK LOAD, RESULTING IN ZERO TRIPS AND STABLE VOLTAGE.

PREPARED BY:
JP NELSON SALES ENGINEERING TEAM
WWW.JPNELSON.CO.TH`}
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: DASHBOARD */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Main Visual Dashboard */}
          <div className="bg-slate-900 rounded-[2rem] shadow-2xl p-8 relative overflow-hidden text-white border-b-8 border-red-600">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[60px] pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center gap-2">
                 <LayoutDashboard className="w-4 h-4 text-red-500" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">System Dashboard</h3>
              </div>
              <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase animate-pulse flex items-center gap-1.5 border border-green-500/20">
                 <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                 Live Calculation
              </div>
            </div>

            <div className="mb-10 relative z-10">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Peak Demand Profile</div>
              <div className="flex items-baseline gap-3">
                <span className="text-7xl font-black italic text-white leading-none tracking-tighter drop-shadow-lg">
                  {results.totalPeakLoad.toFixed(0)}
                </span>
                <span className="text-xl font-bold text-red-500 uppercase tracking-[0.2em]">kW</span>
              </div>
            </div>

            {/* Power Gauge */}
            <div className="space-y-4 mb-10 relative z-10">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Supply Limit: {results.effectiveGridLimit.toFixed(0)} kW</span>
                <span className={results.shortfall > 0 ? "text-red-500" : "text-green-500"}>
                  {results.shortfall > 0 ? `BESS REQUIRED: ${results.shortfall.toFixed(0)} kW` : 'ALL CLEAR'}
                </span>
              </div>
              <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-in-out ${results.shortfall > 0 ? 'bg-gradient-to-r from-red-600 to-orange-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-gradient-to-r from-green-600 to-emerald-400'}`}
                  style={{ width: `${Math.min(100, (results.totalPeakLoad / (results.effectiveGridLimit * 1.6)) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between px-1">
                 <div className="w-px h-1 bg-white/20"></div>
                 <div className="w-px h-1 bg-white/20"></div>
                 <div className="w-px h-1 bg-white/20"></div>
                 <div className="w-px h-1 bg-white/20"></div>
                 <div className="w-px h-1 bg-white/20"></div>
              </div>
            </div>

            {/* Load Chart */}
            <div className="h-56 w-full mt-6 bg-slate-950/40 rounded-[1.5rem] p-6 border border-white/5 relative z-10 backdrop-blur-sm">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={[0, 'auto']} />
                    <Tooltip 
                      cursor={{fill: '#ffffff05'}}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '10px', color: '#fff' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1500}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.9} />
                      ))}
                    </Bar>
                    <ReferenceLine y={results.effectiveGridLimit} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'GRID CEILING', position: 'top', fill: '#ef4444', fontSize: 8, fontWeight: '900' }} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
          </div>

          {/* Savings Card for Scenario C */}
          {scenario === ScenarioId.C && results.fuelSavings && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-xl p-8 text-white border border-slate-700 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Fuel className="w-20 h-20 text-green-500" />
              </div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Genset Hybrid Economy</h3>
                <div className="bg-green-500 text-slate-900 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">Efficiency Up</div>
              </div>
              <div className="mb-8 relative z-10">
                <div className="text-5xl font-black italic tracking-tighter text-green-400">
                  {results.fuelSavings.monthlyTHB.toLocaleString()} 
                  <span className="text-sm font-bold ml-2 uppercase opacity-60 tracking-normal not-italic">THB / MO</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-2">PROJECTED OPERATIONAL SAVINGS</p>
              </div>
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="text-[9px] font-black uppercase opacity-40 tracking-widest mb-1">Fuel Offset</div>
                  <div className="text-xl font-black italic text-white">{results.fuelSavings.dailyLiters.toFixed(0)} <span className="text-[10px]">L/DAY</span></div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="text-[9px] font-black uppercase opacity-40 tracking-widest mb-1">CO2 Reduction</div>
                  <div className="text-xl font-black italic text-green-500">74% <span className="text-[10px] text-white">EST.</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Recommended Unit Card */}
          <div className="bg-white rounded-[2rem] shadow-xl border-2 border-slate-50 p-8 relative overflow-hidden group hover:border-red-100 transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Zap className="w-32 h-32 text-slate-900" />
            </div>
            
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              Engineering Selection
            </h3>

            {results.recommendedModel ? (
              <div className="space-y-8 relative z-10">
                <div>
                  <h4 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase group-hover:text-red-600 transition-colors">
                    {results.recommendedModel.name}
                  </h4>
                  <div className="flex gap-2 mt-2">
                     <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Semi-Solid LFP</span>
                     <span className="bg-red-50 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Heavy-Duty</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-4 font-bold leading-relaxed">{results.recommendedModel.desc}</p>
                </div>

                <div className="grid grid-cols-2 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                  <div className="bg-white p-5 space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Output Power</span>
                    <span className="text-2xl font-black text-slate-800 tracking-tighter italic">{results.recommendedModel.power} <span className="text-[10px] uppercase text-slate-400">kW</span></span>
                  </div>
                  <div className="bg-white p-5 space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Energy Capacity</span>
                    <span className="text-2xl font-black text-slate-800 tracking-tighter italic">{results.recommendedModel.energy} <span className="text-[10px] uppercase text-slate-400">kWh</span></span>
                  </div>
                  <div className="bg-white p-5 space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Surge Limit</span>
                    <span className="text-2xl font-black text-red-600 tracking-tighter italic">{results.recommendedModel.surge} <span className="text-[10px] uppercase text-slate-400">kW</span></span>
                  </div>
                  <div className="bg-white p-5 space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Physical</span>
                    <span className="text-sm font-black text-slate-800 tracking-tighter uppercase">{results.recommendedModel.weight} Tons</span>
                  </div>
                </div>

                {results.fitStatus === 'multiple' && (
                  <div className="bg-yellow-50 p-5 rounded-2xl border-2 border-yellow-100 flex gap-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                    <p className="text-[10px] text-yellow-800 font-black uppercase leading-relaxed tracking-wide">
                      HIGH LOAD DETECTED: SITE PEAK EXCEEDS SINGLE UNIT OUTPUT. WE RECOMMEND MULTIPLE UNITS IN PARALLEL.
                    </p>
                  </div>
                )}
                
                {results.fitStatus === 'check_energy' && (
                  <div className="bg-blue-50 p-5 rounded-2xl border-2 border-blue-100 flex gap-4">
                    <Info className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <p className="text-[10px] text-blue-800 font-black uppercase leading-relaxed tracking-wide">
                      CAPACITY VERIFICATION: POWER SURGE IS HANDLED, BUT HIGH SUSTAINED LOADS MAY REQUIRE ADDITIONAL kWh CAPACITY.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                <Zap className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">Awaiting Analysis Data</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-100 py-10 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-slate-900 flex items-center justify-center rounded text-white font-black text-xs italic">JN</div>
             <span className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">&copy; 2024 JP NELSON EQUIPMENT GROUP</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-slate-400 hover:text-red-600 transition-colors text-[9px] font-black uppercase tracking-widest">Support Portal</a>
            <a href="#" className="text-slate-400 hover:text-red-600 transition-colors text-[9px] font-black uppercase tracking-widest">Site Survey App v2.5.2</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
