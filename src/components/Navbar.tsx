import React from 'react';
import { 
  Bot, 
  Cpu, 
  HardDrive, 
  Terminal, 
  ShieldCheck, 
  Smartphone, 
  Send, 
  ExternalLink,
  Zap,
  Play,
  Leaf,
  BarChart3
} from 'lucide-react';
import { SystemMetrics } from '../types';

interface NavbarProps {
  activeTab: 'host' | 'bots' | 'monitor' | 'analytics' | 'android-code';
  setActiveTab: (tab: 'host' | 'bots' | 'monitor' | 'analytics' | 'android-code') => void;
  systemMetrics: SystemMetrics;
  isTerminalOpen: boolean;
  setIsTerminalOpen: (open: boolean) => void;
  runningBotsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  systemMetrics,
  isTerminalOpen,
  setIsTerminalOpen,
  runningBotsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-xl shadow-black/40">
      {/* Top Notification / System Bar */}
      <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900/70 to-cyan-950/30 px-4 py-1.5 border-b border-white/[0.05] text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${runningBotsCount > 0 ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${runningBotsCount > 0 ? 'bg-emerald-400 ring-2 ring-emerald-950' : 'bg-amber-400 ring-2 ring-amber-950'}`}></span>
            </span>
            <span className="text-emerald-400 font-semibold tracking-wider text-[11px]">
              {runningBotsCount > 0 ? '24/7 FOREGROUND SERVICE ACTIVE' : 'ENGINE STANDBY'}
            </span>
          </div>

          <span className="text-slate-700 hidden md:inline">/</span>

          <div className="hidden sm:flex items-center gap-1.5 font-mono text-slate-400 text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>RAM: <strong className="text-slate-200 tabular-nums">{systemMetrics.botTotalRamMb} MB</strong> / {Math.round(systemMetrics.totalRamMb / 1024)} GB</span>
          </div>

          <span className="text-slate-700 hidden md:inline">/</span>

          <div className="hidden md:flex items-center gap-1.5 font-mono text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>WAKELOCK: <strong className="text-emerald-300">{systemMetrics.isPowerSavingMode ? 'BATCHED' : 'PARTIAL_WAKE_LOCK'}</strong></span>
          </div>

          {systemMetrics.isPowerSavingMode && (
            <>
              <span className="text-slate-700 hidden md:inline">/</span>
              <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                <Leaf className="w-3 h-3 text-emerald-400" />
                <span>ECO POWER SAVING ACTIVE</span>
              </div>
            </>
          )}
        </div>

        {/* Admin Telegram Contact */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs hidden lg:inline">Admin Support:</span>
          <a
            href="https://t.me/rizohacker"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 hover:text-sky-200 transition-all font-medium text-xs shadow-sm hover:shadow-sky-500/20"
          >
            <img
              src="/src/assets/images/admin_rizo_avatar_1791109495036.jpg"
              alt="Admin @rizohacker avatar"
              referrerPolicy="no-referrer"
              className="w-4 h-4 rounded-full object-cover ring-1 ring-sky-400/50"
            />
            <span>Telegram: <strong>@rizohacker</strong></span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
          </a>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Name */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('bots')}>
          <div className="relative">
            <img
              src="/src/assets/images/app_brand_logo_1791109461737.jpg"
              alt="RIZO X ZAINU Logo"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform"
            />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg md:text-xl text-white tracking-tight flex items-center gap-1.5 font-mono">
                RIZO <span className="text-emerald-400">X</span> ZAINU
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono tracking-wider font-semibold rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 uppercase">
                Hosting Bot
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              24/7 Local Android Phone RAM & Storage Engine
            </p>
          </div>
        </div>

        {/* 3 Core Requested Buttons + APK Codebase */}
        <nav className="flex items-center gap-1.5 p-1.5 bg-slate-950/70 backdrop-blur-md rounded-2xl border border-white/[0.08] text-xs sm:text-sm shadow-inner">
          {/* Button 1: Host New Bot */}
          <button
            onClick={() => setActiveTab('host')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
              activeTab === 'host'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>1. Host New Bot</span>
          </button>

          {/* Button 2: My Bots & Live Files */}
          <button
            onClick={() => setActiveTab('bots')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all relative cursor-pointer ${
              activeTab === 'bots'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>2. My Bots & Files</span>
            {runningBotsCount > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'bots' ? 'bg-slate-950 text-emerald-300' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                {runningBotsCount}
              </span>
            )}
          </button>

          {/* Button 3: Resource Monitor */}
          <button
            onClick={() => setActiveTab('monitor')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
              activeTab === 'monitor'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>3. Monitor</span>
          </button>

          {/* Button 4: Analytics */}
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>4. Analytics</span>
          </button>

          {/* Button 5: Native Android APK Code & Export */}
          <button
            onClick={() => setActiveTab('android-code')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
              activeTab === 'android-code'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 scale-[1.02]'
                : 'text-cyan-400 hover:text-cyan-300 hover:bg-white/[0.06]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">5. APK Code</span>
            <span className="sm:hidden">APK</span>
          </button>
        </nav>

        {/* Terminal Toggle Button */}
        <button
          onClick={() => setIsTerminalOpen(!isTerminalOpen)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs border transition-all cursor-pointer ${
            isTerminalOpen
              ? 'bg-slate-900 text-emerald-400 border-emerald-500/50 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-950/60 text-slate-300 border-white/[0.08] hover:border-emerald-500/40 hover:text-white'
          }`}
          title="Toggle Terminal Logs Console"
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Terminal Logs</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      </div>
    </header>
  );
};
