import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Trash2, 
  Copy, 
  Download, 
  Play, 
  Pause, 
  ChevronUp, 
  ChevronDown, 
  Send, 
  Check, 
  Filter,
  Maximize2,
  Minimize2,
  AlertOctagon,
  Search,
  X
} from 'lucide-react';
import { LogEntry, BotInstance } from '../types';

interface TerminalLogsProps {
  logs: LogEntry[];
  bots: BotInstance[];
  onClearLogs: () => void;
  onExecuteCommand: (command: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

type LogTypeFilter = 'all' | 'stderr' | 'system' | 'stdout' | 'pip' | 'warn';

export const TerminalLogs: React.FC<TerminalLogsProps> = ({
  logs,
  bots,
  onClearLogs,
  onExecuteCommand,
  isOpen,
  onToggleOpen
}) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const [filterBotId, setFilterBotId] = useState<string>('all');
  const [logTypeFilter, setLogTypeFilter] = useState<LogTypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [commandInput, setCommandInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Compute counts per log type
  const counts = {
    all: logs.length,
    stderr: logs.filter(l => l.type === 'stderr').length,
    system: logs.filter(l => l.type === 'system').length,
    stdout: logs.filter(l => l.type === 'stdout' || l.type === 'success').length,
    pip: logs.filter(l => l.type === 'pip').length,
    warn: logs.filter(l => l.type === 'warn').length,
  };

  const filteredLogs = logs.filter((log) => {
    // 1. Bot ID filter
    if (filterBotId !== 'all' && log.botId !== filterBotId) {
      return false;
    }

    // 2. Log Type filter
    if (logTypeFilter === 'stderr') {
      if (log.type !== 'stderr') return false;
    } else if (logTypeFilter === 'system') {
      if (log.type !== 'system') return false;
    } else if (logTypeFilter === 'stdout') {
      if (log.type !== 'stdout' && log.type !== 'success') return false;
    } else if (logTypeFilter === 'pip') {
      if (log.type !== 'pip') return false;
    } else if (logTypeFilter === 'warn') {
      if (log.type !== 'warn') return false;
    }

    // 3. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return log.text.toLowerCase().includes(q) || log.timestamp.includes(q) || log.type.includes(q);
    }

    return true;
  });

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  const handleCopyLogs = () => {
    const text = filteredLogs.map((l) => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLogs = () => {
    const text = filteredLogs.map((l) => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rizo_zainu_${logTypeFilter}_logs_${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    // Handle quick local filter commands
    const trimmed = commandInput.trim().toLowerCase();
    if (trimmed === 'filter errors' || trimmed === 'filter error') {
      setLogTypeFilter('stderr');
      setCommandInput('');
      return;
    } else if (trimmed === 'filter system') {
      setLogTypeFilter('system');
      setCommandInput('');
      return;
    } else if (trimmed === 'filter stdout') {
      setLogTypeFilter('stdout');
      setCommandInput('');
      return;
    } else if (trimmed === 'filter all') {
      setLogTypeFilter('all');
      setCommandInput('');
      return;
    }

    onExecuteCommand(commandInput.trim());
    setCommandInput('');
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={onToggleOpen}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-slate-200 hover:text-white shadow-xl shadow-black/40 font-mono text-xs transition-all cursor-pointer"
        >
          <TerminalIcon className="w-4 h-4 text-emerald-400" />
          <span>Open Terminal ({logs.length})</span>
          {counts.stderr > 0 && (
            <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
              {counts.stderr} Err
            </span>
          )}
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-[#060a12]/98 border-t border-slate-800 shadow-2xl transition-all duration-300 flex flex-col font-mono ${
        isExpanded ? 'h-[80vh]' : 'h-[410px]'
      }`}
    >
      {/* Terminal Top Title Bar */}
      <div className="px-4 py-2 bg-slate-950 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 cursor-pointer" onClick={onToggleOpen}></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 cursor-pointer"></span>
          </div>

          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <TerminalIcon className="w-4 h-4 text-emerald-400" />
            <span>RIZO X ZAINU Terminal Engine</span>
            <span className="text-slate-500 text-[11px] hidden sm:inline">| Python 3.11 Runtime</span>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Filter by Bot */}
          {bots.length > 0 && (
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800 text-[11px]">
              <Filter className="w-3 h-3 text-slate-400" />
              <select
                value={filterBotId}
                onChange={(e) => setFilterBotId(e.target.value)}
                className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900">All Bots</option>
                {bots.map((b) => (
                  <option key={b.id} value={b.id} className="bg-slate-900">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Auto Scroll Toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded transition-colors ${
              autoScroll ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'
            }`}
            title={autoScroll ? 'Auto-scroll Enabled' : 'Auto-scroll Paused'}
          >
            {autoScroll ? <Play className="w-3.5 h-3.5 fill-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Copy Logs */}
          <button
            onClick={handleCopyLogs}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Copy Filtered Logs to Clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Download Logs */}
          <button
            onClick={handleDownloadLogs}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Download Filtered Logs (.log)"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Clear Logs */}
          <button
            onClick={onClearLogs}
            className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Clear Terminal Output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Expand / Minimize */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
            title={isExpanded ? 'Restore Size' : 'Expand Height'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Close */}
          <button
            onClick={onToggleOpen}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Minimize Terminal"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Log Type Filter Bar & Search Sub-Header */}
      <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Log Type Segmented Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0">
          <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline flex-shrink-0">
            Type:
          </span>

          {/* All */}
          <button
            type="button"
            onClick={() => setLogTypeFilter('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              logTypeFilter === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>All</span>
            <span className={`px-1 py-0.2 rounded text-[10px] ${logTypeFilter === 'all' ? 'bg-slate-950/20 text-slate-950 font-bold' : 'text-slate-500'}`}>
              {counts.all}
            </span>
          </button>

          {/* Errors / Stderr */}
          <button
            type="button"
            onClick={() => setLogTypeFilter('stderr')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              logTypeFilter === 'stderr'
                ? 'bg-rose-500 text-white font-bold shadow-sm shadow-rose-950/40'
                : 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/30'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${counts.stderr > 0 ? 'bg-rose-400 animate-pulse' : 'bg-slate-600'}`}></span>
            <span>Errors</span>
            <span className={`px-1 py-0.2 rounded text-[10px] font-bold ${logTypeFilter === 'stderr' ? 'bg-rose-950 text-rose-200' : 'text-rose-400/80 bg-rose-500/10'}`}>
              {counts.stderr}
            </span>
          </button>

          {/* System */}
          <button
            type="button"
            onClick={() => setLogTypeFilter('system')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              logTypeFilter === 'system'
                ? 'bg-blue-500 text-white font-bold shadow-sm shadow-blue-950/40'
                : 'text-blue-400 hover:text-blue-300 hover:bg-blue-950/30'
            }`}
          >
            <span>System</span>
            <span className={`px-1 py-0.2 rounded text-[10px] ${logTypeFilter === 'system' ? 'bg-blue-950 text-blue-200' : 'text-blue-400/80'}`}>
              {counts.system}
            </span>
          </button>

          {/* Stdout */}
          <button
            type="button"
            onClick={() => setLogTypeFilter('stdout')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              logTypeFilter === 'stdout'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-teal-400 hover:text-teal-300 hover:bg-teal-950/30'
            }`}
          >
            <span>Stdout</span>
            <span className={`px-1 py-0.2 rounded text-[10px] ${logTypeFilter === 'stdout' ? 'bg-slate-950/20 text-slate-950 font-bold' : 'text-teal-400/80'}`}>
              {counts.stdout}
            </span>
          </button>

          {/* Pip */}
          <button
            type="button"
            onClick={() => setLogTypeFilter('pip')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              logTypeFilter === 'pip'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30'
            }`}
          >
            <span>Pip</span>
            <span className={`px-1 py-0.2 rounded text-[10px] ${logTypeFilter === 'pip' ? 'bg-slate-950/20 text-slate-950 font-bold' : 'text-cyan-400/80'}`}>
              {counts.pip}
            </span>
          </button>

          {/* Warn */}
          {counts.warn > 0 && (
            <button
              type="button"
              onClick={() => setLogTypeFilter('warn')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                logTypeFilter === 'warn'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/30'
              }`}
            >
              <span>Warn</span>
              <span className={`px-1 py-0.2 rounded text-[10px] ${logTypeFilter === 'warn' ? 'bg-slate-950/20 text-slate-950 font-bold' : 'text-amber-400/80'}`}>
                {counts.warn}
              </span>
            </button>
          )}
        </div>

        {/* Quick Search Input */}
        <div className="relative flex items-center w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search filtered logs..."
            className="w-full pl-8 pr-7 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-700 font-mono"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Output Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 text-xs select-text leading-relaxed"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-slate-500 italic py-6 text-center space-y-2">
            <div>No logs found matching filter: <strong className="text-slate-300 uppercase">{logTypeFilter}</strong> {searchQuery && <span>with query "{searchQuery}"</span>}</div>
            {logTypeFilter !== 'all' && (
              <button
                onClick={() => { setLogTypeFilter('all'); setSearchQuery(''); }}
                className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-mono transition-colors"
              >
                Reset to All Logs
              </button>
            )}
          </div>
        ) : (
          filteredLogs.map((log) => {
            let textColor = 'text-slate-300';
            if (log.type === 'stderr') textColor = 'text-rose-400 font-medium';
            if (log.type === 'stdout') textColor = 'text-emerald-300';
            if (log.type === 'pip') textColor = 'text-cyan-300';
            if (log.type === 'system') textColor = 'text-blue-400 font-semibold';
            if (log.type === 'success') textColor = 'text-emerald-400 font-semibold';
            if (log.type === 'warn') textColor = 'text-amber-400';

            return (
              <div key={log.id} className="flex items-start gap-2.5 hover:bg-slate-900/40 px-1 py-0.5 rounded">
                <span className="text-slate-600 select-none text-[11px] whitespace-nowrap">
                  [{log.timestamp}]
                </span>
                <span className={`select-none font-bold text-[10px] uppercase w-14 whitespace-nowrap ${
                  log.type === 'stderr' ? 'text-rose-400' :
                  log.type === 'system' ? 'text-blue-400' :
                  log.type === 'pip' ? 'text-cyan-400' :
                  log.type === 'warn' ? 'text-amber-400' : 'text-slate-500'
                }`}>
                  {log.type}
                </span>
                <span className={`flex-1 break-all ${textColor}`}>
                  {log.text}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Command Chips */}
      <div className="px-3 py-1.5 bg-[#070b14] border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
        <span className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold mr-1">Quick:</span>
        {[
          { label: 'status', cmd: 'status' },
          { label: 'top', cmd: 'top' },
          { label: 'pip list', cmd: 'pip list' },
          { label: 'powersave on', cmd: 'powersave on' },
          { label: 'autoclean on', cmd: 'autoclean on' },
          { label: 'clear', cmd: 'clear' }
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onExecuteCommand(item.cmd)}
            className="px-2 py-0.5 rounded bg-slate-900 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-colors whitespace-nowrap cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Terminal Interactive Input Bar */}
      <form onSubmit={handleCommandSubmit} className="p-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center gap-2">
        <span className="text-emerald-400 font-bold select-none text-xs pl-2 font-mono">
          rizo@android-ram:~$
        </span>
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder="Type command ('status', 'top', 'powersave on', 'autoclean on', 'help')..."
          className="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder-slate-600 font-mono"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 rounded text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer font-mono"
        >
          <span>Run</span>
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
};

