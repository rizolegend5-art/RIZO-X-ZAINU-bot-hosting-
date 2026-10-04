import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HostNewBot } from './components/HostNewBot';
import { MyBots } from './components/MyBots';
import { ResourceMonitor } from './components/ResourceMonitor';
import { Analytics } from './components/Analytics';
import { TerminalLogs } from './components/TerminalLogs';
import { AndroidCodeExport } from './components/AndroidCodeExport';
import { Footer } from './components/Footer';
import { INITIAL_BOTS } from './data/sampleBots';
import { BotInstance, LogEntry, SystemMetrics } from './types';
import { Zap, Smartphone, ShieldCheck, Cpu, Terminal, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'host' | 'bots' | 'monitor' | 'analytics' | 'android-code'>('bots');
  const [showHeroBanner, setShowHeroBanner] = useState(true);
  const [bots, setBots] = useState<BotInstance[]>(() => {
    const saved = localStorage.getItem('rizo_bots');
    return saved ? JSON.parse(saved) : INITIAL_BOTS;
  });

  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isPowerSavingMode, setIsPowerSavingMode] = useState<boolean>(() => {
    return localStorage.getItem('rizo_power_saving') === 'true';
  });
  const [isAutoRamCleanup, setIsAutoRamCleanup] = useState<boolean>(() => {
    return localStorage.getItem('rizo_auto_ram_cleanup') === 'true';
  });

  // Initial Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-1',
      timestamp: '16:08:01',
      type: 'system',
      text: '🤖 [RIZO X ZAINU] Native Android Bot Engine v2.4 initialized.'
    },
    {
      id: 'log-2',
      timestamp: '16:08:02',
      type: 'system',
      text: '⚡ Acquiring PARTIAL_WAKE_LOCK. CPU keep-alive active.'
    },
    {
      id: 'log-3',
      timestamp: '16:08:03',
      type: 'pip',
      text: '📦 Chaquopy Python 3.11 environment verified. Packages: pyTelegramBotAPI, python-dotenv, requests.'
    },
    {
      id: 'log-4',
      timestamp: '16:08:05',
      type: 'stdout',
      text: '[*] Initializing RIZO X ZAINU Master Bot on Android RAM...'
    },
    {
      id: 'log-5',
      timestamp: '16:08:06',
      type: 'success',
      text: '[+] Foreground Service polling started successfully. Bot is LIVE 24/7.'
    },
    {
      id: 'log-6',
      timestamp: '16:08:07',
      type: 'info',
      text: '👑 Official Admin Support: Telegram @rizohacker'
    }
  ]);

  // System Metrics
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalRamMb: 8192,
    usedRamMb: 3940,
    freeRamMb: 4252,
    botTotalRamMb: 114,
    cpuPercent: 3.8,
    storageTotalGb: 128.0,
    storageUsedGb: 54.2,
    batteryLevel: 88,
    isCharging: false,
    isBatteryOptimizedIgnored: true,
    isWakeLockActive: true,
    isForegroundServiceRunning: true,
    isPowerSavingMode: isPowerSavingMode,
    isAutoRamCleanupEnabled: isAutoRamCleanup
  });

  // Save bots to localStorage
  useEffect(() => {
    localStorage.setItem('rizo_bots', JSON.stringify(bots));
  }, [bots]);

  // Persist power saving mode
  useEffect(() => {
    localStorage.setItem('rizo_power_saving', String(isPowerSavingMode));
    setSystemMetrics(prev => ({ ...prev, isPowerSavingMode }));
  }, [isPowerSavingMode]);

  // Persist auto RAM cleanup mode
  useEffect(() => {
    localStorage.setItem('rizo_auto_ram_cleanup', String(isAutoRamCleanup));
    setSystemMetrics(prev => ({ ...prev, isAutoRamCleanupEnabled: isAutoRamCleanup }));
  }, [isAutoRamCleanup]);

  // Real-time ticking for uptime and telemetry (throttled when in power saving mode)
  useEffect(() => {
    const interval = setInterval(() => {
      setBots((prevBots) =>
        prevBots.map((bot) => {
          if (bot.status === 'running') {
            // In Power Saving mode, restrict high-CPU background operations and jitter
            const cpuJitter = isPowerSavingMode
              ? Number((Math.random() * 0.7 + 0.5).toFixed(1))
              : Number((Math.random() * 2.5 + 2.1).toFixed(1));
            const ramJitter = Math.floor(110 + Math.random() * (isPowerSavingMode ? 3 : 8));
            return {
              ...bot,
              uptimeSeconds: bot.uptimeSeconds + 1,
              cpuPercent: cpuJitter,
              ramUsageMb: ramJitter
            };
          }
          return bot;
        })
      );

      // Periodically update aggregate system metrics and check Auto RAM Cleanup threshold (<500MB)
      setSystemMetrics((prev) => {
        const running = bots.filter((b) => b.status === 'running');
        const totalBotRam = running.reduce((acc, b) => acc + b.ramUsageMb, 0);
        const cpuAvg = running.length > 0 
          ? (isPowerSavingMode 
              ? Number((Math.random() * 0.6 + 0.7).toFixed(1)) 
              : Number((Math.random() * 2.2 + 2.5).toFixed(1))) 
          : 0.4;

        // Auto RAM Cleanup Trigger check (< 500MB free RAM)
        if (isAutoRamCleanup && prev.freeRamMb < 500 && !isOptimizing) {
          setTimeout(() => {
            handleAutoRamPurge(prev.freeRamMb);
          }, 300);
        }

        return {
          ...prev,
          botTotalRamMb: totalBotRam,
          cpuPercent: cpuAvg,
          isForegroundServiceRunning: running.length > 0,
          isPowerSavingMode,
          isAutoRamCleanupEnabled: isAutoRamCleanup
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [bots, isPowerSavingMode, isAutoRamCleanup, isOptimizing]);

  // Periodic bot health polling logs in terminal - interval is 60s in Power Saving, 12s in Normal mode
  useEffect(() => {
    const pollingIntervalMs = isPowerSavingMode ? 60000 : 12000;

    const logInterval = setInterval(() => {
      const running = bots.filter((b) => b.status === 'running');
      if (running.length > 0) {
        const timeStr = new Date().toTimeString().slice(0, 8);
        const randomBot = running[Math.floor(Math.random() * running.length)];
        const sampleLogs = isPowerSavingMode
          ? [
              `[POWERSAVE /getUpdates] 200 OK (Throttled 60s cycle • CPU Restricted)`,
              `[BATTERY SAVER] Minimal wakeups active • Phone RAM: ${randomBot.ramUsageMb} MB`,
              `[KEEPALIVE] Eco mode batch check passed • WakeLock batched`,
              `[STATUS] 24/7 Running smoothly with reduced battery consumption`
            ]
          : [
              `[GET /getUpdates] 200 OK - No pending webhooks (Polling Active)`,
              `[STATUS] Phone RAM: ${randomBot.ramUsageMb} MB utilized • WakeLock held`,
              `[KEEPALIVE] Foreground Notification ID #1001 refreshed. Service sticky.`,
              `[TELEGRAM] Connection alive • Admin: @rizohacker`
            ];
        const randomText = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];

        setLogs((prev) => [
          ...prev.slice(-150),
          {
            id: `log-${Date.now()}`,
            timestamp: timeStr,
            type: isPowerSavingMode ? 'info' : 'stdout',
            text: `[${randomBot.name}] ${randomText}`,
            botId: randomBot.id
          }
        ]);
      }
    }, pollingIntervalMs);

    return () => clearInterval(logInterval);
  }, [bots, isPowerSavingMode]);

  // Helper to add log
  const addLog = (text: string, type: LogEntry['type'] = 'info', botId?: string) => {
    const timeStr = new Date().toTimeString().slice(0, 8);
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: timeStr,
        type,
        text,
        botId
      }
    ]);
  };

  // Host New Bot Handler
  const handleHostBot = (newBotData: Omit<BotInstance, 'uptimeSeconds' | 'ramUsageMb' | 'cpuPercent' | 'pid'>) => {
    const generatedPid = Math.floor(10000 + Math.random() * 9000);
    const newBot: BotInstance = {
      ...newBotData,
      status: 'installing',
      uptimeSeconds: 0,
      ramUsageMb: 85,
      cpuPercent: 12.4,
      pid: generatedPid
    };

    setBots((prev) => [newBot, ...prev]);
    setActiveTab('bots');
    setIsTerminalOpen(true);

    addLog(`🚀 [RIZO X ZAINU] Provisioning Android workspace for "${newBot.name}"...`, 'system', newBot.id);
    addLog(`📁 Writing bot.py, requirements.txt, and .env to internal storage...`, 'info', newBot.id);
    addLog(`📦 [pip] Running 'pip install -r requirements.txt' inside Chaquopy environment...`, 'pip', newBot.id);

    // Simulate pip install completion
    setTimeout(() => {
      addLog(`📦 [pip] Successfully installed: pyTelegramBotAPI, python-dotenv, requests.`, 'pip', newBot.id);
      addLog(`⚡ Starting BotForegroundService with START_STICKY & PARTIAL_WAKE_LOCK...`, 'system', newBot.id);

      setTimeout(() => {
        setBots((prev) =>
          prev.map((b) =>
            b.id === newBot.id
              ? {
                  ...b,
                  status: 'running',
                  ramUsageMb: 112,
                  cpuPercent: 3.5,
                  lastStartedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
                }
              : b
          )
        );
        addLog(`✅ [SUCCESS] "${newBot.name}" is now running 24/7 on Android Phone RAM!`, 'success', newBot.id);
        addLog(`👑 Contact Telegram Admin: @rizohacker`, 'info', newBot.id);
      }, 1500);
    }, 2000);
  };

  const handleStartBot = (botId: string) => {
    const bot = bots.find((b) => b.id === botId);
    if (!bot) return;

    addLog(`▶️ Starting 24/7 Foreground Service for "${bot.name}" (PID: ${bot.pid})...`, 'system', botId);
    setBots((prev) =>
      prev.map((b) =>
        b.id === botId
          ? {
              ...b,
              status: 'running',
              lastStartedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
            }
          : b
      )
    );
    addLog(`✅ "${bot.name}" resumed. CPU WakeLock held.`, 'success', botId);
  };

  const handleStopBot = (botId: string) => {
    const bot = bots.find((b) => b.id === botId);
    if (!bot) return;

    addLog(`⏹️ Stopping Foreground Service for "${bot.name}"...`, 'warn', botId);
    setBots((prev) =>
      prev.map((b) => (b.id === botId ? { ...b, status: 'stopped', cpuPercent: 0 } : b))
    );
    addLog(`💤 Process terminated. WakeLock released for ${bot.name}.`, 'info', botId);
  };

  const handleRestartBot = (botId: string) => {
    const bot = bots.find((b) => b.id === botId);
    if (!bot) return;

    const newPid = Math.floor(10000 + Math.random() * 9000);
    addLog(`🔄 Restarting process for "${bot.name}" (New PID: ${newPid})...`, 'system', botId);

    setBots((prev) =>
      prev.map((b) =>
        b.id === botId
          ? {
              ...b,
              status: 'installing',
              pid: newPid,
              uptimeSeconds: 0
            }
          : b
      )
    );

    setTimeout(() => {
      setBots((prev) =>
        prev.map((b) => (b.id === botId ? { ...b, status: 'running' } : b))
      );
      addLog(`✅ "${bot.name}" restarted successfully!`, 'success', botId);
    }, 1500);
  };

  const handleDeleteBot = (botId: string) => {
    const bot = bots.find((b) => b.id === botId);
    if (confirm(`Aap sach mein "${bot?.name || 'this bot'}" ko delete karna chahte hain?`)) {
      setBots((prev) => prev.filter((b) => b.id !== botId));
      addLog(`🗑️ Deleted bot "${bot?.name}" and purged files from device storage.`, 'warn');
    }
  };

  const handleUpdateFiles = (botId: string, updatedFiles: Record<string, string>) => {
    const bot = bots.find((b) => b.id === botId);
    setBots((prev) =>
      prev.map((b) => (b.id === botId ? { ...b, files: { ...b.files, ...updatedFiles } } : b))
    );
    addLog(`💾 Updated files for "${bot?.name}". Hot-reloading Python script...`, 'info', botId);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  // Interactive CLI commands inside dark terminal
  const handleExecuteCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    addLog(`rizo@android-ram:~$ ${trimmed}`, 'system');

    switch (command) {
      case 'help':
        addLog(
          `Available CLI Commands:\n  • status - Show active bots and memory\n  • top - View running processes\n  • powersave on/off - Toggle battery saving mode\n  • autoclean on/off - Toggle auto RAM cleanup (<500MB)\n  • pip list - Installed Python packages\n  • pip install <package> - Install Python module\n  • python -V - Python version\n  • kill <pid> - Stop bot process\n  • clear - Clear screen\n  • admin - Contact admin @rizohacker`,
          'info'
        );
        break;

      case 'autoclean':
        if (arg === 'on') {
          setIsAutoRamCleanup(true);
          addLog('🛡️ [AUTO RAM CLEANUP] Enabled (< 500MB threshold guard).', 'system');
        } else if (arg === 'off') {
          setIsAutoRamCleanup(false);
          addLog('⚠️ [AUTO RAM CLEANUP] Disabled. Switched to manual cleanup.', 'warn');
        } else {
          addLog(`Auto RAM Cleanup is: ${isAutoRamCleanup ? 'ON (<500MB guard)' : 'OFF'}. Type 'autoclean on' or 'autoclean off'.`, 'info');
        }
        break;

      case 'powersave':
        if (arg === 'on') {
          setIsPowerSavingMode(true);
          addLog('🔋 [POWER SAVING] Enabled. Polling set to 60s, CPU wakeups throttled.', 'system');
        } else if (arg === 'off') {
          setIsPowerSavingMode(false);
          addLog('⚡ [HIGH PERFORMANCE] Power Saving disabled. 12s polling restored.', 'info');
        } else {
          addLog(`Power Saving is currently: ${isPowerSavingMode ? 'ON (Eco 60s)' : 'OFF (High Perf 12s)'}. Type 'powersave on' or 'powersave off'.`, 'info');
        }
        break;

      case 'status':
        const active = bots.filter((b) => b.status === 'running');
        addLog(
          `[STATUS] Active Bots: ${active.length} / ${bots.length} | Bot RAM: ${systemMetrics.botTotalRamMb} MB | Phone Free RAM: ${Math.round(systemMetrics.freeRamMb)} MB | Auto RAM Clean (<500MB): ${isAutoRamCleanup ? 'ACTIVE' : 'OFF'} | Power Saving: ${isPowerSavingMode ? 'ON (Eco 60s)' : 'OFF (12s)'} | WakeLock: ${isPowerSavingMode ? 'BATCHED' : 'HELD'}`,
          'success'
        );
        break;

      case 'top':
        addLog(`PID     NAME                         CPU%   RAM    STATUS`, 'system');
        bots.forEach((b) => {
          addLog(
            `${b.pid}   ${b.name.padEnd(28)} ${b.cpuPercent}%   ${b.ramUsageMb}MB  ${b.status.toUpperCase()}`,
            b.status === 'running' ? 'stdout' : 'warn'
          );
        });
        break;

      case 'pip':
        if (parts[1] === 'list') {
          addLog(`Package               Version`, 'system');
          addLog(`-------------------- -------`, 'system');
          addLog(`pyTelegramBotAPI      4.16.1`, 'stdout');
          addLog(`python-dotenv         1.0.1`, 'stdout');
          addLog(`requests              2.31.0`, 'stdout');
          addLog(`urllib3               2.2.1`, 'stdout');
          addLog(`certifi               2024.2.2`, 'stdout');
        } else if (parts[1] === 'install') {
          const pkg = arg.replace('install', '').trim();
          addLog(`Collecting ${pkg}...`, 'pip');
          addLog(`Downloading ${pkg}-latest-py3-none-any.whl`, 'pip');
          addLog(`Installing collected package: ${pkg}`, 'pip');
          addLog(`Successfully installed ${pkg}`, 'success');
        } else {
          addLog(`Usage: pip list | pip install <package>`, 'warn');
        }
        break;

      case 'python':
      case 'python3':
        addLog(`Python 3.11.8 (main, Oct 2026) [Chaquopy Android ARM64 Runtime]`, 'stdout');
        break;

      case 'admin':
        addLog(`👑 RIZO X ZAINU Official Admin: Telegram @rizohacker (https://t.me/rizohacker)`, 'success');
        break;

      case 'hostinfo':
        addLog(`Device: Android 14 (API 34) | Kernel: 5.15-android14 | Storage: UFS 3.1`, 'info');
        addLog(`Foreground Service: Enabled | WakeLock: PARTIAL_WAKE_LOCK`, 'info');
        break;

      case 'clear':
      case 'cls':
        setLogs([]);
        break;

      case 'kill':
        const targetPid = parseInt(arg, 10);
        const botToKill = bots.find((b) => b.pid === targetPid);
        if (botToKill) {
          handleStopBot(botToKill.id);
          addLog(`Process ${targetPid} (${botToKill.name}) terminated.`, 'warn');
        } else {
          addLog(`Process with PID ${arg} not found. Type 'top' to view PIDs.`, 'stderr');
        }
        break;

      default:
        addLog(`bash: command not found: ${command}. Type 'help' for available commands.`, 'stderr');
        break;
    }
  };

  // Optimize RAM Handler
  const handleOptimizeRam = () => {
    setIsOptimizing(true);
    addLog(`🧹 Triggering garbage collection in Android Python virtual memory...`, 'system');
    setTimeout(() => {
      setBots((prev) =>
        prev.map((b) => ({
          ...b,
          ramUsageMb: Math.max(75, b.ramUsageMb - 12)
        }))
      );
      setSystemMetrics((prev) => ({
        ...prev,
        usedRamMb: Math.max(3000, prev.usedRamMb - 95),
        freeRamMb: prev.freeRamMb + 95
      }));
      setIsOptimizing(false);
      addLog(`✅ Reclaimed ~38 MB RAM. Inactive modules paged out.`, 'success');
    }, 1200);
  };

  const handleTogglePowerSaving = () => {
    setIsPowerSavingMode((prev) => {
      const next = !prev;
      if (next) {
        addLog('🔋 [POWER SAVING] Enabled. Polling interval lowered to 60s, CPU background tasks throttled to extend phone battery life.', 'system');
      } else {
        addLog('⚡ [HIGH PERFORMANCE] Power Saving disabled. Real-time 12s polling and unrestricted CPU scheduling restored.', 'info');
      }
      return next;
    });
  };

  // Auto RAM Cleanup Trigger Routine (triggered when free RAM < 500MB)
  const handleAutoRamPurge = (currentFreeRam: number) => {
    setIsOptimizing(true);
    addLog(`🚨 [AUTO RAM CLEANUP] Low RAM threshold breached (${Math.round(currentFreeRam)} MB < 500 MB limit)!`, 'warn');
    addLog(`🧹 Automatically purging inactive Python modules and flushing garbage collector...`, 'system');

    setTimeout(() => {
      const reclaimedMb = 185;
      setBots((prev) =>
        prev.map((b) => ({
          ...b,
          ramUsageMb: Math.max(70, b.ramUsageMb - 15)
        }))
      );
      setSystemMetrics((prev) => {
        const newFree = prev.freeRamMb + reclaimedMb;
        const newUsed = Math.max(2800, prev.usedRamMb - reclaimedMb);
        return {
          ...prev,
          freeRamMb: newFree,
          usedRamMb: newUsed
        };
      });
      setIsOptimizing(false);
      addLog(`✅ [AUTO RAM CLEANUP] Reclaimed ${reclaimedMb} MB RAM. System stabilized above 500MB safe buffer.`, 'success');
    }, 1500);
  };

  const handleToggleAutoRamCleanup = () => {
    setIsAutoRamCleanup((prev) => {
      const next = !prev;
      if (next) {
        addLog('🛡️ [AUTO RAM CLEANUP] Armed. System will automatically purge memory whenever free RAM drops below 500MB.', 'system');
      } else {
        addLog('⚠️ [AUTO RAM CLEANUP] Disarmed. Memory cleanup switched to manual only.', 'warn');
      }
      return next;
    });
  };

  // Simulate Low RAM (< 500MB) for testing
  const handleSimulateLowRam = () => {
    addLog('🧪 [SIMULATION] Dropping free RAM to 430 MB (< 500MB) to test Auto RAM Cleanup trigger...', 'warn');
    setSystemMetrics((prev) => ({
      ...prev,
      freeRamMb: 430,
      usedRamMb: prev.totalRamMb - 430
    }));

    if (!isAutoRamCleanup) {
      addLog('ℹ️ Auto RAM Cleanup is currently disabled. Toggle it ON to enable automatic purge.', 'info');
    }
  };

  // Simulate CPU Spike for heat map demonstration
  const handleSimulateCpuSpike = () => {
    const running = bots.filter((b) => b.status === 'running');
    if (running.length === 0) {
      addLog('⚠️ No bots are currently running to spike CPU. Start a bot first!', 'warn');
      return;
    }
    const target = running[0];
    addLog(`🔥 [CPU SPIKE] Simulating intensive message traffic on "${target.name}" (Spiking to 11.8% CPU)...`, 'warn', target.id);
    
    setBots((prev) => prev.map((b) => (b.id === target.id ? { ...b, cpuPercent: 11.8 } : b)));
    setSystemMetrics((prev) => ({ ...prev, cpuPercent: 12.6 }));

    setTimeout(() => {
      setBots((prev) => prev.map((b) => (b.id === target.id ? { ...b, cpuPercent: 3.6 } : b)));
      addLog(`✅ [CPU NORMALIZED] Traffic backlog processed. "${target.name}" CPU stabilized to 3.6%.`, 'info', target.id);
    }, 4500);
  };

  const runningBotsCount = bots.filter((b) => b.status === 'running').length;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemMetrics={systemMetrics}
        isTerminalOpen={isTerminalOpen}
        setIsTerminalOpen={setIsTerminalOpen}
        runningBotsCount={runningBotsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Futuristic Hero Engine Spotlight Banner */}
        {showHeroBanner && (
          <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 bg-gradient-to-r from-[#060a14] via-[#0b1324] to-[#060a14] shadow-2xl shadow-black/60 group">
            {/* Background Graphic with Scrim */}
            <div className="absolute inset-0 z-0">
              <img
                src="/src/assets/images/hero_hosting_engine_1791109443399.jpg"
                alt="RIZO X ZAINU Android Hosting Engine"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-right md:object-center opacity-35 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#060a14] via-[#060a14]/85 to-transparent" />
            </div>

            {/* Banner Content */}
            <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-semibold tracking-wider uppercase">Chaquopy Native Python 3.11 Runtime</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">24/7 Phone RAM Engine</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Host Telegram Bots 24/7 on Android Memory
                </h2>

                <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                  Run custom Python bots nonstop using your phone's physical RAM, background Foreground Service, and WakeLock keep-alive. Zero monthly cloud bills, zero VPS requirements.
                </p>

                {/* 4 Live Technical Invariants */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-sm">
                    <div className="text-slate-400 text-[10px] uppercase">Service State</div>
                    <div className="text-emerald-400 font-bold mt-0.5 truncate">START_STICKY</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-sm">
                    <div className="text-slate-400 text-[10px] uppercase">Active Bots</div>
                    <div className="text-cyan-400 font-bold mt-0.5 tabular-nums">{runningBotsCount} Running</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-sm">
                    <div className="text-slate-400 text-[10px] uppercase">Bot RAM Usage</div>
                    <div className="text-purple-400 font-bold mt-0.5 tabular-nums">{systemMetrics.botTotalRamMb} MB</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-sm">
                    <div className="text-slate-400 text-[10px] uppercase">RAM Guard</div>
                    <div className="text-amber-400 font-bold mt-0.5">{isAutoRamCleanup ? '<500MB Armed' : 'Manual'}</div>
                  </div>
                </div>
              </div>

              {/* Quick Action CTAs */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto flex-shrink-0">
                <button
                  onClick={() => setActiveTab('host')}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Host New Bot Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono transition-all cursor-pointer whitespace-nowrap"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isTerminalOpen ? 'Hide Terminal CLI' : 'Open Live Terminal'}</span>
                </button>

                <button
                  onClick={() => setShowHeroBanner(false)}
                  className="text-center text-[10px] text-slate-500 hover:text-slate-400 pt-1 transition-colors cursor-pointer"
                >
                  Minimize Banner
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'host' && (
          <HostNewBot
            onHostBot={handleHostBot}
            onSelectTemplate={() => {}}
          />
        )}

        {activeTab === 'bots' && (
          <MyBots
            bots={bots}
            onStartBot={handleStartBot}
            onStopBot={handleStopBot}
            onRestartBot={handleRestartBot}
            onDeleteBot={handleDeleteBot}
            onUpdateFiles={handleUpdateFiles}
            onOpenTerminalForBot={(botId) => {
              setIsTerminalOpen(true);
            }}
            onNavigateToHost={() => setActiveTab('host')}
          />
        )}

        {activeTab === 'monitor' && (
          <ResourceMonitor
            systemMetrics={systemMetrics}
            bots={bots}
            onOptimizeRam={handleOptimizeRam}
            isOptimizing={isOptimizing}
            onTogglePowerSaving={handleTogglePowerSaving}
            onToggleAutoRamCleanup={handleToggleAutoRamCleanup}
            onSimulateLowRam={handleSimulateLowRam}
            onSimulateCpuSpike={handleSimulateCpuSpike}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics
            bots={bots}
            systemMetrics={systemMetrics}
          />
        )}

        {activeTab === 'android-code' && (
          <AndroidCodeExport />
        )}
      </main>

      {/* Real-time Dark Hacker Terminal */}
      <TerminalLogs
        logs={logs}
        bots={bots}
        onClearLogs={handleClearLogs}
        onExecuteCommand={handleExecuteCommand}
        isOpen={isTerminalOpen}
        onToggleOpen={() => setIsTerminalOpen(!isTerminalOpen)}
      />

      {/* Footer with Prominent Admin Contact @rizohacker */}
      <Footer />
    </div>
  );
}
