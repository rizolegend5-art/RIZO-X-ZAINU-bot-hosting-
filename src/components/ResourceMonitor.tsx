import React, { useState } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Battery, 
  BatteryCharging, 
  Zap, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  Smartphone, 
  ChevronRight,
  Send,
  Leaf,
  Power,
  ShieldAlert,
  SlidersHorizontal,
  Flame,
  Activity,
  Thermometer,
  TrendingUp,
  Bot as BotIcon
} from 'lucide-react';
import { SystemMetrics, BotInstance } from '../types';

interface ResourceMonitorProps {
  systemMetrics: SystemMetrics;
  bots: BotInstance[];
  onOptimizeRam: () => void;
  isOptimizing: boolean;
  onTogglePowerSaving: () => void;
  onToggleAutoRamCleanup: () => void;
  onSimulateLowRam: () => void;
  onSimulateCpuSpike?: () => void;
}

export const ResourceMonitor: React.FC<ResourceMonitorProps> = ({
  systemMetrics,
  bots,
  onOptimizeRam,
  isOptimizing,
  onTogglePowerSaving,
  onToggleAutoRamCleanup,
  onSimulateLowRam,
  onSimulateCpuSpike
}) => {
  const [selectedBrand, setSelectedBrand] = useState<'xiaomi' | 'samsung' | 'oppo' | 'stock'>('xiaomi');
  const [ramFreedMessage, setRamFreedMessage] = useState<string | null>(null);

  const ramUsedPercent = Math.round((systemMetrics.usedRamMb / systemMetrics.totalRamMb) * 100);
  const botRamPercent = Math.round((systemMetrics.botTotalRamMb / systemMetrics.totalRamMb) * 100);

  const runningBots = bots.filter(b => b.status === 'running');
  const maxCpu = runningBots.length > 0 ? Math.max(...runningBots.map(b => b.cpuPercent)) : 0;
  const peakBot = runningBots.find(b => b.cpuPercent === maxCpu && maxCpu > 0);
  const totalBotCpu = runningBots.reduce((acc, b) => acc + b.cpuPercent, 0);

  const getCpuIntensityMeta = (cpu: number, isRunning: boolean) => {
    if (!isRunning) {
      return {
        label: 'IDLE (OFFLINE)',
        badgeBg: 'bg-slate-800 text-slate-400 border-slate-700',
        cardBg: 'bg-slate-950/40 border-slate-800/60',
        barColor: 'bg-slate-700',
        textColor: 'text-slate-400',
        thermalGlow: '',
        heatLevel: 'idle'
      };
    }
    if (cpu < 2.5) {
      return {
        label: 'COOL (< 2.5%)',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        cardBg: 'bg-gradient-to-br from-emerald-950/20 via-slate-900/60 to-slate-950/70 border-emerald-500/30',
        barColor: 'bg-emerald-400',
        textColor: 'text-emerald-300',
        thermalGlow: 'shadow-sm shadow-emerald-950/30',
        heatLevel: 'cool'
      };
    }
    if (cpu < 6.0) {
      return {
        label: 'WARM (2.5 - 6%)',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        cardBg: 'bg-gradient-to-br from-amber-950/20 via-slate-900/60 to-slate-950/70 border-amber-500/40',
        barColor: 'bg-amber-400',
        textColor: 'text-amber-300',
        thermalGlow: 'shadow-sm shadow-amber-950/30',
        heatLevel: 'warm'
      };
    }
    if (cpu < 10.0) {
      return {
        label: 'HOT (6 - 10%)',
        badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
        cardBg: 'bg-gradient-to-br from-orange-950/30 via-slate-900/70 to-slate-950/80 border-orange-500/50',
        barColor: 'bg-orange-400',
        textColor: 'text-orange-300',
        thermalGlow: 'shadow-md shadow-orange-950/40',
        heatLevel: 'hot'
      };
    }
    return {
      label: 'CRITICAL (> 10%)',
      badgeBg: 'bg-rose-500/25 text-rose-300 border-rose-500/60 animate-pulse',
      cardBg: 'bg-gradient-to-br from-rose-950/40 via-slate-900/80 to-slate-950/90 border-rose-500/70',
      barColor: 'bg-rose-500',
      textColor: 'text-rose-300',
      thermalGlow: 'shadow-lg shadow-rose-950/60 ring-1 ring-rose-500/40',
      heatLevel: 'critical'
    };
  };

  const handleOptimizeClick = () => {
    onOptimizeRam();
    setRamFreedMessage('Cleared inactive Python cache and reclaimed ~38 MB RAM.');
    setTimeout(() => setRamFreedMessage(null), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0c1322] to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Cpu className="w-5 h-5" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Button 3: Real-Time Phone Resource Monitor
            </h2>
          </div>
          <p className="text-slate-300 text-sm">
            Live telemetry of your Android phone RAM, CPU load, and 24/7 background Foreground Service status.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleOptimizeClick}
            disabled={isOptimizing}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>{isOptimizing ? 'Optimizing Memory...' : 'Optimize RAM & Clean Cache'}</span>
          </button>
        </div>
      </div>

      {/* Power Saving Mode Banner & Toggle */}
      <div className={`p-5 rounded-2xl border transition-all duration-300 ${
        systemMetrics.isPowerSavingMode
          ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-teal-950/40 border-emerald-500/50 shadow-lg shadow-emerald-950/30'
          : 'bg-slate-900/80 border-slate-800 shadow-md'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className={`p-2.5 rounded-xl border transition-colors flex-shrink-0 ${
              systemMetrics.isPowerSavingMode
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              <Leaf className={`w-5 h-5 ${systemMetrics.isPowerSavingMode ? 'animate-pulse' : ''}`} />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-bold text-white text-sm md:text-base flex items-center gap-2">
                  <span>Battery & Power Saving Mode</span>
                </h3>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider ${
                  systemMetrics.isPowerSavingMode
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {systemMetrics.isPowerSavingMode ? 'Active (Eco Throttled)' : 'Disabled (High Performance)'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {systemMetrics.isPowerSavingMode
                  ? 'Log polling interval is lowered to 60s and high-CPU background operations are restricted to maximize phone battery life.'
                  : 'Real-time 12s log polling and unrestricted CPU operations are active. Turn ON to conserve phone battery during 24/7 background hosting.'}
              </p>
            </div>
          </div>

          {/* Interactive Toggle Switch */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <span className="text-xs font-mono font-medium text-slate-400">
              {systemMetrics.isPowerSavingMode ? 'Power Saving ON' : 'Power Saving OFF'}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={systemMetrics.isPowerSavingMode}
              onClick={onTogglePowerSaving}
              className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                systemMetrics.isPowerSavingMode ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                  systemMetrics.isPowerSavingMode ? 'translate-x-7' : 'translate-x-0'
                }`}
              >
                {systemMetrics.isPowerSavingMode ? (
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Power className="w-3.5 h-3.5 text-slate-400" />
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Telemetry Specs when Power Saving is ON vs OFF */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-slate-500">Polling Interval:</span>
            <span className={systemMetrics.isPowerSavingMode ? 'text-emerald-400 font-bold' : 'text-cyan-400 font-medium'}>
              {systemMetrics.isPowerSavingMode ? '60s (Throttled)' : '12s (Real-time)'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-slate-500">CPU Thread Load:</span>
            <span className={systemMetrics.isPowerSavingMode ? 'text-emerald-400 font-bold' : 'text-amber-400 font-medium'}>
              {systemMetrics.isPowerSavingMode ? 'Restricted (Low Wakeups)' : 'Unrestricted'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-slate-500">Estimated Battery Drain:</span>
            <span className={systemMetrics.isPowerSavingMode ? 'text-emerald-400 font-bold' : 'text-slate-200 font-medium'}>
              {systemMetrics.isPowerSavingMode ? '~1.2% / hr (Low)' : '~3.4% / hr (Normal)'}
            </span>
          </div>
        </div>
      </div>

      {/* Auto RAM Cleanup Guard (< 500MB Threshold) */}
      <div className={`p-5 rounded-2xl border transition-all duration-300 ${
        systemMetrics.isAutoRamCleanupEnabled
          ? 'bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-blue-950/40 border-cyan-500/50 shadow-lg shadow-cyan-950/30'
          : 'bg-slate-900/80 border-slate-800 shadow-md'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className={`p-2.5 rounded-xl border transition-colors flex-shrink-0 ${
              systemMetrics.isAutoRamCleanupEnabled
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              <ShieldAlert className={`w-5 h-5 ${systemMetrics.isAutoRamCleanupEnabled ? 'animate-pulse' : ''}`} />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-bold text-white text-sm md:text-base flex items-center gap-2">
                  <span>Auto RAM Cleanup Guard</span>
                  <span className="text-cyan-400 text-xs font-mono font-normal">(&lt; 500MB Trigger)</span>
                </h3>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider ${
                  systemMetrics.isAutoRamCleanupEnabled
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {systemMetrics.isAutoRamCleanupEnabled ? 'Armed & Monitoring' : 'Disabled (Manual Only)'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {systemMetrics.isAutoRamCleanupEnabled
                  ? 'Automatically purges inactive Python cache & triggers garbage collection whenever phone free RAM drops below 500MB to prevent Android OOM crashes.'
                  : 'Automatic background memory guard is disabled. Enable to protect against low-memory app termination when running multiple heavy bots.'}
              </p>
            </div>
          </div>

          {/* Interactive Toggle Switch & Test Button */}
          <div className="flex items-center gap-3 flex-wrap self-end sm:self-center">
            {systemMetrics.isAutoRamCleanupEnabled && (
              <button
                type="button"
                onClick={onSimulateLowRam}
                className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition-colors flex items-center gap-1.5"
                title="Test trigger by temporarily simulating free RAM below 500MB"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate &lt;500MB</span>
              </button>
            )}

            <button
              type="button"
              role="switch"
              aria-checked={systemMetrics.isAutoRamCleanupEnabled}
              onClick={onToggleAutoRamCleanup}
              className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                systemMetrics.isAutoRamCleanupEnabled ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                  systemMetrics.isAutoRamCleanupEnabled ? 'translate-x-7' : 'translate-x-0'
                }`}
              >
                {systemMetrics.isAutoRamCleanupEnabled ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <Power className="w-3.5 h-3.5 text-slate-400" />
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Live Threshold Status Bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Current Free RAM:</span>
            <span className={`font-bold ${systemMetrics.freeRamMb < 500 ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
              {Math.round(systemMetrics.freeRamMb)} MB
            </span>
            <span className="text-slate-500">/ Threshold: 500 MB</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            {systemMetrics.freeRamMb < 500 ? (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>LOW RAM DETECTED (&lt; 500MB) — AUTO PURGE ACTIVE</span>
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Memory Safe ({Math.round(systemMetrics.freeRamMb - 500)} MB above trigger limit)</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {ramFreedMessage && (
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{ramFreedMessage}</span>
        </div>
      )}

      {/* Main Hardware Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: RAM Usage */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Phone RAM</span>
            </span>
            <span className="font-mono text-cyan-400 font-bold">{ramUsedPercent}%</span>
          </div>

          <div>
            <div className="text-2xl font-black text-white font-mono">
              {(systemMetrics.usedRamMb / 1024).toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ {(systemMetrics.totalRamMb / 1024).toFixed(1)} GB</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
              Bots RAM: <strong>{systemMetrics.botTotalRamMb} MB</strong> ({botRamPercent}%)
            </div>
          </div>

          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${ramUsedPercent}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Free: {Math.round(systemMetrics.freeRamMb)} MB</span>
            <span>Allocated: {systemMetrics.botTotalRamMb} MB</span>
          </div>
        </div>

        {/* Card 2: CPU Load */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>CPU Utilization</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">{systemMetrics.cpuPercent}%</span>
          </div>

          <div>
            <div className="text-2xl font-black text-white font-mono">
              {systemMetrics.cpuPercent}% <span className="text-xs text-emerald-400 font-normal">Active</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Architecture: ARM64-v8a (Octa-Core)
            </div>
          </div>

          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(5, systemMetrics.cpuPercent))}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Governor: {systemMetrics.isPowerSavingMode ? 'Powersave' : 'Schedutil'}</span>
            <span className={systemMetrics.isPowerSavingMode ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
              {systemMetrics.isPowerSavingMode ? 'Eco Restricted' : 'Optimal'}
            </span>
          </div>
        </div>

        {/* Card 3: Storage */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <HardDrive className="w-4 h-4 text-amber-400" />
              <span>Internal Storage</span>
            </span>
            <span className="font-mono text-amber-400 font-bold">
              {Math.round((systemMetrics.storageUsedGb / systemMetrics.storageTotalGb) * 100)}%
            </span>
          </div>

          <div>
            <div className="text-2xl font-black text-white font-mono">
              {systemMetrics.storageUsedGb} <span className="text-xs text-slate-400 font-normal">/ {systemMetrics.storageTotalGb} GB</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Free: {(systemMetrics.storageTotalGb - systemMetrics.storageUsedGb).toFixed(1)} GB
            </div>
          </div>

          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${(systemMetrics.storageUsedGb / systemMetrics.storageTotalGb) * 100}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Bots Cache: 384 MB</span>
            <span>Data: UFS 3.1</span>
          </div>
        </div>

        {/* Card 4: Battery & WakeLock */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              {systemMetrics.isCharging ? (
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
              ) : (
                <Battery className={systemMetrics.isPowerSavingMode ? 'text-emerald-400' : 'text-slate-400'} />
              )}
              <span>Device Battery</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">{systemMetrics.batteryLevel}%</span>
          </div>

          <div>
            <div className="text-2xl font-black text-white font-mono flex items-center justify-between">
              <span>{systemMetrics.batteryLevel}% <span className="text-xs text-emerald-400 font-normal">{systemMetrics.isCharging ? 'Charging' : 'Discharging'}</span></span>
              {systemMetrics.isPowerSavingMode && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">ECO</span>
              )}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
              WakeLock: {systemMetrics.isPowerSavingMode ? 'Batched Periodic' : 'PARTIAL_WAKE_LOCK'}
            </div>
          </div>

          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${systemMetrics.batteryLevel}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{systemMetrics.isPowerSavingMode ? 'Drain: ~1.2%/h' : 'Optimization: Ignored'}</span>
            <span className="text-emerald-300">{systemMetrics.isPowerSavingMode ? 'Battery Saver' : '24/7 Shield'}</span>
          </div>
        </div>
      </div>

      {/* Bot CPU Intensity Heat Map */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400">
                <Flame className="w-4 h-4 animate-pulse" />
              </span>
              <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
                <span>Bot CPU Intensity Heat Map</span>
                <span className="text-xs font-mono font-normal text-slate-400">({runningBots.length} active / {bots.length} total)</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Visual thermal matrix showing CPU cycle consumption per bot process to pinpoint heavy background workloads.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {peakBot && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-orange-500/20 to-rose-500/20 border border-orange-500/40 text-orange-300 text-xs font-mono shadow-sm">
                <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Peak Consumer: <strong className="text-white font-bold">{peakBot.name}</strong> ({peakBot.cpuPercent}%)</span>
              </div>
            )}

            {onSimulateCpuSpike && (
              <button
                type="button"
                onClick={onSimulateCpuSpike}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono transition-colors"
                title="Simulate high message traffic CPU spike"
              >
                <Activity className="w-3.5 h-3.5 text-orange-400" />
                <span>Simulate Spike</span>
              </button>
            )}
          </div>
        </div>

        {/* Color-Coded Heat Scale Legend */}
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Thermal Intensity Scale:</span>
          </span>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-emerald-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Cool (&lt; 2.5%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Warm (2.5% – 6%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-orange-300">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span>Hot (6% – 10%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>Critical (&gt; 10%)</span>
            </div>
          </div>
        </div>

        {/* Heat Map Tiles Grid */}
        {bots.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-950/40 border border-slate-800/60 text-slate-400 text-xs">
            No bots hosted yet. Host a bot to view real-time per-process CPU thermal distribution.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {bots.map((bot) => {
              const isRunning = bot.status === 'running';
              const meta = getCpuIntensityMeta(bot.cpuPercent, isRunning);
              const isPeak = isRunning && bot.id === peakBot?.id && bot.cpuPercent > 0;
              const cpuShare = totalBotCpu > 0 ? Math.round((bot.cpuPercent / totalBotCpu) * 100) : 0;
              const barWidthPercent = Math.min(100, Math.max(isRunning ? 6 : 0, (bot.cpuPercent / 12) * 100));

              return (
                <div
                  key={bot.id}
                  className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${meta.cardBg} ${meta.thermalGlow} ${
                    isPeak ? 'ring-2 ring-orange-500/50 shadow-md shadow-orange-950/40' : ''
                  }`}
                >
                  {/* Subtle top indicator bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 ${meta.barColor} transition-all duration-500`}
                  ></div>

                  <div className="space-y-2.5">
                    {/* Top Row: Name and Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <BotIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <h4 className="font-bold text-white text-xs truncate">
                            {bot.name}
                          </h4>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          PID #{bot.pid} • {isRunning ? 'Running 24/7' : 'Offline'}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${meta.badgeBg}`}>
                          {meta.label}
                        </span>
                        {isPeak && (
                          <span className="px-1.5 py-0.2 rounded bg-gradient-to-r from-orange-500 to-rose-500 text-slate-950 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <Flame className="w-2.5 h-2.5 fill-slate-950" />
                            <span>PEAK</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle: Numeric CPU Value and Metric */}
                    <div className="flex items-baseline justify-between pt-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-2xl font-black font-mono tracking-tight ${meta.textColor}`}>
                          {isRunning ? `${bot.cpuPercent}%` : '0.0%'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          CPU Load
                        </span>
                      </div>

                      {isRunning && totalBotCpu > 0 && (
                        <div className="text-[11px] font-mono text-slate-300">
                          <span className="text-slate-500">Share: </span>
                          <strong className={isPeak ? 'text-orange-400 font-bold' : 'text-slate-200'}>
                            {cpuShare}%
                          </strong>
                        </div>
                      )}
                    </div>

                    {/* Thermal Intensity Visual Bar */}
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${meta.barColor}`}
                          style={{ width: `${barWidthPercent}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-slate-500">
                        <span>0%</span>
                        <span>Scale: Max 12% Core</span>
                        <span>12%+</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer of Card: RAM & Uptime */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>RAM: {bot.ramUsageMb} MB</span>
                    <span>Uptime: {Math.floor(bot.uptimeSeconds / 60)}m</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 24/7 Android Background Service Status Overview */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>24/7 Background Running & Keep-Alive System Check</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-emerald-300 font-semibold">Foreground Service</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Notification pinned; Android OS will not kill process.</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-emerald-300 font-semibold">CPU WakeLock</div>
              <div className="text-slate-400 text-[11px] mt-0.5">PARTIAL_WAKE_LOCK active when screen turns off.</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-emerald-300 font-semibold">Battery Optimization</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Unrestricted battery enabled (Doze mode bypass).</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-emerald-300 font-semibold">Native RAM Runtime</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Chaquopy Python 3.11 running in app sandbox.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Keep-Alive Phone Settings Guide */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>How to Prevent Phone from Killing the Bot (24/7 Guide)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Har phone brand ka background task killer alag hota hai. Apne brand ke hisaab se settings karein:
            </p>
          </div>

          {/* Brand Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedBrand('xiaomi')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedBrand === 'xiaomi' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Xiaomi / MIUI
            </button>
            <button
              onClick={() => setSelectedBrand('samsung')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedBrand === 'samsung' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Samsung OneUI
            </button>
            <button
              onClick={() => setSelectedBrand('oppo')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedBrand === 'oppo' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Realme / Oppo
            </button>
            <button
              onClick={() => setSelectedBrand('stock')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedBrand === 'stock' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Stock Android
            </button>
          </div>
        </div>

        {/* Step Guide Content */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5 text-xs text-slate-300">
          {selectedBrand === 'xiaomi' && (
            <ol className="list-decimal list-inside space-y-2 font-mono">
              <li>Phone Settings &rarr; Apps &rarr; Manage Apps &rarr; <strong>RIZO X ZAINU hosting bot</strong></li>
              <li><strong>Autostart:</strong> Turn ON (Allow app to start automatically)</li>
              <li><strong>Battery Saver:</strong> Select <strong>"No restrictions"</strong> (Do not restrict background activity)</li>
              <li>Recent Apps screen open karein &rarr; App card par long-press karke <strong>Lock Icon (Padlock)</strong> dabayein.</li>
            </ol>
          )}

          {selectedBrand === 'samsung' && (
            <ol className="list-decimal list-inside space-y-2 font-mono">
              <li>Settings &rarr; Apps &rarr; <strong>RIZO X ZAINU hosting bot</strong> &rarr; Battery</li>
              <li>Select <strong>"Unrestricted"</strong> (Allows app to run in background without limits)</li>
              <li>Settings &rarr; Battery and device care &rarr; Background usage limits &rarr; <strong>Never sleeping apps</strong> &rarr; App add karein.</li>
            </ol>
          )}

          {selectedBrand === 'oppo' && (
            <ol className="list-decimal list-inside space-y-2 font-mono">
              <li>Settings &rarr; App Management &rarr; <strong>RIZO X ZAINU hosting bot</strong></li>
              <li>Battery usage &rarr; Enable <strong>"Allow background activity"</strong> aur <strong>"Allow auto-launch"</strong></li>
              <li>Recent Apps screen par App ke 3-dots par click karke <strong>Lock</strong> karein.</li>
            </ol>
          )}

          {selectedBrand === 'stock' && (
            <ol className="list-decimal list-inside space-y-2 font-mono">
              <li>Settings &rarr; Apps &rarr; <strong>RIZO X ZAINU hosting bot</strong> &rarr; App battery usage</li>
              <li>Choose <strong>"Unrestricted"</strong>.</li>
              <li>Ensure "Pause app activity if unused" is turned OFF.</li>
            </ol>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-400">
          <span>Need personalized help setting up keep-alive?</span>
          <a
            href="https://t.me/rizohacker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
          >
            <span>Ask Admin @rizohacker</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
