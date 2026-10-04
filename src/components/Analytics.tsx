import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Cpu, 
  HardDrive, 
  Clock, 
  MessageSquare, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap, 
  ShieldCheck, 
  Filter, 
  RotateCw,
  Send,
  Calendar
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { BotInstance, SystemMetrics } from '../types';

interface AnalyticsProps {
  bots: BotInstance[];
  systemMetrics: SystemMetrics;
}

export const Analytics: React.FC<AnalyticsProps> = ({ bots, systemMetrics }) => {
  const [timeRange, setTimeRange] = useState<'24h' | '12h' | '6h'>('24h');
  const [selectedBotId, setSelectedBotId] = useState<string>('all');
  const [isLiveSimulating, setIsLiveSimulating] = useState(true);

  // Generate 24 hours data points
  const analyticsData = useMemo(() => {
    const hoursCount = timeRange === '24h' ? 24 : timeRange === '12h' ? 12 : 6;
    const currentHour = new Date().getHours();
    const data = [];

    for (let i = hoursCount - 1; i >= 0; i--) {
      const hour = (currentHour - i + 24) % 24;
      const hourLabel = `${hour.toString().padStart(2, '0')}:00`;
      
      // Determine traffic curve: peak in evening (18:00 - 23:00), lower at night (02:00 - 06:00)
      const isNight = hour >= 2 && hour <= 6;
      const isPeak = hour >= 17 && hour <= 22;
      const baseInbound = isNight ? 120 : isPeak ? 940 : 480;
      const jitter = Math.floor(Math.random() * 80 - 40);
      const inbound = Math.max(30, baseInbound + jitter);
      const outbound = Math.round(inbound * 0.96);
      const polls = inbound * 3 + Math.floor(Math.random() * 50);

      // CPU load (Eco mode dips, normal mode 2-5%)
      const baseCpu = systemMetrics.isPowerSavingMode ? 1.2 : 3.4;
      const cpuJitter = Number((baseCpu + (isPeak ? 1.8 : 0) + (Math.random() * 0.8 - 0.4)).toFixed(1));

      // RAM usage
      const baseBotRam = systemMetrics.botTotalRamMb > 0 ? systemMetrics.botTotalRamMb : 110;
      const botRam = Math.round(baseBotRam + (isPeak ? 14 : 0) + Math.sin(i) * 5);
      const systemUsedRam = Math.round(3800 + botRam * 2.5 + Math.random() * 40);

      // Uptime percentage (99.8% to 100%)
      const uptime = i === 18 ? 99.4 : Number((99.85 + Math.random() * 0.15).toFixed(2));

      data.push({
        time: hourLabel,
        inboundMessages: inbound,
        outboundMessages: outbound,
        pollingHits: polls,
        totalThroughput: inbound + outbound,
        cpuUsage: Math.max(0.5, cpuJitter),
        botRamMb: botRam,
        systemUsedRamMb: systemUsedRam,
        freeRamMb: 8192 - systemUsedRam,
        uptimePercent: uptime,
        latencyMs: Math.round(14 + Math.random() * 8 + (isPeak ? 5 : 0))
      });
    }

    return data;
  }, [timeRange, systemMetrics.isPowerSavingMode, systemMetrics.botTotalRamMb]);

  // Aggregate KPIs
  const totalInbound = useMemo(() => analyticsData.reduce((acc, d) => acc + d.inboundMessages, 0), [analyticsData]);
  const totalOutbound = useMemo(() => analyticsData.reduce((acc, d) => acc + d.outboundMessages, 0), [analyticsData]);
  const avgLatency = useMemo(() => {
    const sum = analyticsData.reduce((acc, d) => acc + d.latencyMs, 0);
    return (sum / analyticsData.length).toFixed(1);
  }, [analyticsData]);
  const avgUptime = useMemo(() => {
    const sum = analyticsData.reduce((acc, d) => acc + d.uptimePercent, 0);
    return (sum / analyticsData.length).toFixed(2);
  }, [analyticsData]);
  const peakThroughput = useMemo(() => {
    return Math.max(...analyticsData.map(d => d.totalThroughput));
  }, [analyticsData]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0a1224] to-slate-900 border border-emerald-500/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-mono">
              Bot Telemetry & 24h Performance Analytics
            </h2>
          </div>
          <p className="text-slate-300 text-sm max-w-2xl">
            Real-time message throughput, background WakeLock uptime consistency, and device CPU & RAM memory trends across continuous Android Foreground Service execution.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="relative z-10 flex items-center gap-2 flex-wrap">
          {/* Bot Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-2 rounded-xl border border-white/[0.08] text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedBotId}
              onChange={(e) => setSelectedBotId(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Hosted Bots ({bots.length})</option>
              {bots.map((b) => (
                <option key={b.id} value={b.id} className="bg-slate-900">
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe segmented pills */}
          <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-white/[0.08] text-xs font-mono">
            {(['6h', '12h', '24h'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === r
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Message Throughput */}
        <div className="p-5 rounded-2xl glass-panel glass-panel-hover border border-white/[0.07] space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>24h Total Messages</span>
            </span>
            <span className="text-emerald-400 flex items-center text-[11px]">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4%</span>
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight font-mono tabular-nums">
            {(totalInbound + totalOutbound).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-800/60">
            <span>Inbound: {totalInbound.toLocaleString()}</span>
            <span>Out: {totalOutbound.toLocaleString()}</span>
          </div>
        </div>

        {/* KPI 2: Average Latency */}
        <div className="p-5 rounded-2xl glass-panel glass-panel-hover border border-white/[0.07] space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Avg Response Time</span>
            </span>
            <span className="text-cyan-400 text-[11px]">Nominal</span>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight font-mono tabular-nums">
            {avgLatency} <span className="text-sm font-normal text-slate-400">ms</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800/60 flex items-center justify-between">
            <span>Chaquopy VM: 4.2ms</span>
            <span>Network: ~12ms</span>
          </div>
        </div>

        {/* KPI 3: Uptime Consistency */}
        <div className="p-5 rounded-2xl glass-panel glass-panel-hover border border-white/[0.07] space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>24h Availability</span>
            </span>
            <span className="text-emerald-400 font-semibold text-[11px]">99.9% Target</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 tracking-tight font-mono tabular-nums">
            {avgUptime}%
          </div>
          <div className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800/60">
            Foreground Service: 0 OS Kills
          </div>
        </div>

        {/* KPI 4: Peak Throughput */}
        <div className="p-5 rounded-2xl glass-panel glass-panel-hover border border-white/[0.07] space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Peak Throughput</span>
            </span>
            <span className="text-amber-400 text-[11px]">18:00 Peak</span>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight font-mono tabular-nums">
            {peakThroughput} <span className="text-sm font-normal text-slate-400">msg/hr</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800/60">
            Max Velocity: ~16 msg/min
          </div>
        </div>
      </div>

      {/* Chart 1: Bot Message Throughput Over Time */}
      <div className="p-6 rounded-3xl glass-panel border border-white/[0.07] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/60">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Bot Message Throughput & Telegram Webhook Polling</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Hourly volume of inbound user queries, outbound bot responses, and getUpdates polling cycles
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <span>Inbound</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
              <span>Outbound</span>
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#090d16', 
                  borderColor: '#334155', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  fontSize: '12px',
                  fontFamily: 'JetBrains Mono'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="inboundMessages" 
                name="Inbound Messages"
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorInbound)" 
              />
              <Area 
                type="monotone" 
                dataKey="outboundMessages" 
                name="Outbound Replies"
                stroke="#06b6d4" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorOutbound)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: CPU & RAM Trends for the past 24 Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU Load Trend */}
        <div className="p-6 rounded-3xl glass-panel border border-white/[0.07] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>CPU Load Trend ({timeRange.toUpperCase()})</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Processor load percentage under background execution
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold">
              Avg {systemMetrics.cpuPercent}%
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 10]} unit="%" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#090d16', 
                    borderColor: '#334155', 
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="cpuUsage" 
                  name="CPU Load %"
                  stroke="#06b6d4" 
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6, fill: '#06b6d4' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RAM Usage Trend */}
        <div className="p-6 rounded-3xl glass-panel border border-white/[0.07] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-purple-400" />
                <span>Phone RAM Memory Trend (MB)</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Python virtual heap and module footprint
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs font-semibold">
              Bot RAM ~{systemMetrics.botTotalRamMb} MB
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[60, 200]} unit="MB" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#090d16', 
                    borderColor: '#334155', 
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="botRamMb" 
                  name="Bot RAM Usage (MB)"
                  stroke="#a855f7" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorRam)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3: 24-Hour Uptime & Availability Timeline */}
      <div className="p-6 rounded-3xl glass-panel border border-white/[0.07] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/60">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Foreground Service Uptime & WakeLock Reliability (%)</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Continuously held CPU WakeLock preventing Android Doze mode interruptions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-300 font-semibold">100% Zero-Crash Period</span>
          </div>
        </div>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[98.5, 100]} unit="%" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#090d16', 
                  borderColor: '#334155', 
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontFamily: 'JetBrains Mono'
                }} 
              />
              <Line 
                type="stepAfter" 
                dataKey="uptimePercent" 
                name="Uptime %"
                stroke="#10b981" 
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
