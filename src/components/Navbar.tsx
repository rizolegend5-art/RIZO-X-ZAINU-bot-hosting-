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
  Leaf
} from 'lucide-react';
import { SystemMetrics } from '../types';

interface NavbarProps {
  activeTab: 'host' | 'bots' | 'monitor' | 'android-code';
  setActiveTab: (tab: 'host' | 'bots' | 'monitor' | 'android-code') => void;
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
    <header className="sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800">
      {/* Top Notification / System Bar */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-cyan-950/40 px-4 py-1.5 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${runningBotsCount > 0 ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${runningBotsCount > 0 ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-emerald-400 font-semibold tracking-wider">
              {runningBotsCount > 0 ? '24/7 FOREGROUND SERVICE ACTIVE' : 'ENGINE READY (STANDBY)'}
            </span>
          </div>

          <span className="text-slate-600 hidden md:inline">|</span>

          <div className="hidden sm:flex items-center gap-2 font-mono text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>RAM: <strong className="text-slate-200">{systemMetrics.botTotalRamMb} MB</strong> / {Math.round(systemMetrics.totalRamMb / 1024)} GB</span>
          </div>

          <span className="text-slate-600 hidden md:inline">|</span>

          <div className="hidden md:flex items-center gap-1.5 font-mono text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>WAKELOCK: <strong className="text-emerald-300">{systemMetrics.isPowerSavingMode ? 'BATCHED' : 'PARTIAL_WAKE_LOCK'}</strong></span>
          </div>

          {systemMetrics.isPowerSavingMode && (
            <>
              <span className="text-slate-600 hidden md:inline">|</span>
              <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono">
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
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 hover:text-sky-200 transition-colors font-medium text-xs"
          >
            <Send className="w-3 h-3 text-sky-400" />
            <span>Telegram: <strong>@rizohacker</strong></span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
          </a>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-blue-500/20 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg md:text-xl text-white tracking-wide flex items-center gap-2 font-mono">
                RIZO <span className="text-emerald-400">X</span> ZAINU
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono tracking-wider font-semibold rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 uppercase">
                Hosting Bot
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              24/7 Local Android Phone RAM & Storage Engine
            </p>
          </div>
        </div>

        {/* 3 Core Requested Buttons + APK Codebase */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs sm:text-sm">
          {/* Button 1: Host New Bot */}
          <button
            onClick={() => setActiveTab('host')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'host'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>1. Host New Bot</span>
          </button>

          {/* Button 2: My Bots & Live Files */}
          <button
            onClick={() => setActiveTab('bots')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all relative ${
              activeTab === 'bots'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>2. My Bots & Files</span>
            {runningBotsCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'bots' ? 'bg-slate-950 text-emerald-300' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                {runningBotsCount}
              </span>
            )}
          </button>

          {/* Button 3: Resource Monitor */}
          <button
            onClick={() => setActiveTab('monitor')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'monitor'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>3. Resource Monitor</span>
          </button>

          {/* Button 4: Native Android APK Code & Export */}
          <button
            onClick={() => setActiveTab('android-code')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'android-code'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                : 'text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Android APK Code</span>
            <span className="sm:hidden">APK Code</span>
          </button>
        </div>

        {/* Terminal Toggle Button */}
        <button
          onClick={() => setIsTerminalOpen(!isTerminalOpen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-xs border transition-all ${
            isTerminalOpen
              ? 'bg-slate-800 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
              : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-600 hover:text-white'
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
