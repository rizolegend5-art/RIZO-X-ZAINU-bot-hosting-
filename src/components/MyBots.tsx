import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  RotateCw, 
  FileCode, 
  Trash2, 
  Terminal, 
  Clock, 
  Cpu, 
  HardDrive, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  X, 
  Plus,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { BotInstance } from '../types';

interface MyBotsProps {
  bots: BotInstance[];
  onStartBot: (botId: string) => void;
  onStopBot: (botId: string) => void;
  onRestartBot: (botId: string) => void;
  onDeleteBot: (botId: string) => void;
  onUpdateFiles: (botId: string, files: Record<string, string>) => void;
  onOpenTerminalForBot: (botId: string) => void;
  onNavigateToHost: () => void;
}

export const MyBots: React.FC<MyBotsProps> = ({
  bots,
  onStartBot,
  onStopBot,
  onRestartBot,
  onDeleteBot,
  onUpdateFiles,
  onOpenTerminalForBot,
  onNavigateToHost
}) => {
  const [editingBot, setEditingBot] = useState<BotInstance | null>(null);
  const [activeEditorTab, setActiveEditorTab] = useState<string>('bot.py');
  const [editedFiles, setEditedFiles] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const formatUptime = (seconds: number) => {
    if (seconds <= 0) return '0s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const handleOpenEditor = (bot: BotInstance) => {
    setEditingBot(bot);
    setEditedFiles({ ...bot.files });
    setActiveEditorTab('bot.py');
    setSaveSuccess(false);
  };

  const handleSaveEditor = () => {
    if (!editingBot) return;
    onUpdateFiles(editingBot.id, editedFiles);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0c1322] to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <HardDrive className="w-5 h-5" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Button 2: My Bots & Live Files
            </h2>
          </div>
          <p className="text-slate-300 text-sm">
            Active bots running natively on your phone's memory. View, edit files, and control background services.
          </p>
        </div>

        <button
          onClick={onNavigateToHost}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Host Another Bot</span>
        </button>
      </div>

      {/* Bots List */}
      {bots.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4">
          <FileCode className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">No Bots Hosted Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Aapne abhi tak koi bot host nahi kiya. Apne phone se Python files upload karke pehla bot launch karein.
          </p>
          <button
            onClick={onNavigateToHost}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Host First Bot Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bots.map((bot) => {
            const isRunning = bot.status === 'running';
            const isInstalling = bot.status === 'installing';

            return (
              <div
                key={bot.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md hover:border-slate-700/80 transition-all space-y-4"
              >
                {/* Top Row: Name, Status & Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-bold text-white tracking-wide">
                        {bot.name}
                      </h3>
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        {isRunning && (
                          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            24/7 RUNNING
                          </span>
                        )}
                        {isInstalling && (
                          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-spin"></span>
                            PIP INSTALLING...
                          </span>
                        )}
                        {bot.status === 'stopped' && (
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-semibold">
                            STOPPED
                          </span>
                        )}
                        {bot.status === 'error' && (
                          <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 font-semibold">
                            ERROR
                          </span>
                        )}
                        <span className="text-slate-500 text-xs">PID #{bot.pid}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {bot.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {isRunning ? (
                      <button
                        onClick={() => onStopBot(bot.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium transition-colors"
                        title="Stop Foreground Service"
                      >
                        <Square className="w-3.5 h-3.5 fill-rose-300" />
                        <span>Stop</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onStartBot(bot.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-colors"
                        title="Start 24/7 Foreground Service"
                      >
                        <Play className="w-3.5 h-3.5 fill-emerald-300" />
                        <span>Start</span>
                      </button>
                    )}

                    <button
                      onClick={() => onRestartBot(bot.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      title="Restart Process"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Restart</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditor(bot)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-colors"
                      title="Inspect & Edit bot.py, requirements.txt, .env"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Live Files</span>
                    </button>

                    <button
                      onClick={() => onOpenTerminalForBot(bot.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      title="View Live Terminal Logs"
                    >
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Logs</span>
                    </button>

                    <button
                      onClick={() => onDeleteBot(bot.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete Bot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Hardware Telemetry */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Uptime</div>
                      <div className="text-slate-200 font-semibold">{formatUptime(bot.uptimeSeconds)}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Phone RAM</div>
                      <div className="text-slate-200 font-semibold">{bot.ramUsageMb} MB</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">CPU Load</div>
                      <div className="text-slate-200 font-semibold">{bot.cpuPercent}%</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Service</div>
                      <div className="text-emerald-300 font-semibold">Foreground Active</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Live Files Editor Modal */}
      {editingBot && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm md:text-base">
                  Live Files Editor: <span className="text-emerald-300">{editingBot.name}</span>
                </h3>
              </div>
              <button
                onClick={() => setEditingBot(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* File Switcher Tabs */}
            <div className="px-4 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-1.5">
                {Object.keys(editedFiles).map((filename) => (
                  <button
                    key={filename}
                    onClick={() => setActiveEditorTab(filename)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                      activeEditorTab === filename
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white bg-slate-900'
                    }`}
                  >
                    {filename}
                  </button>
                ))}
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Saved & Reloaded!</span>
                </div>
              )}
            </div>

            {/* Code Content */}
            <div className="p-4 flex-1 overflow-auto bg-[#070b14]">
              <textarea
                value={editedFiles[activeEditorTab] || ''}
                onChange={(e) => setEditedFiles({ ...editedFiles, [activeEditorTab]: e.target.value })}
                rows={16}
                className="w-full h-full min-h-[320px] bg-transparent text-xs font-mono text-slate-200 focus:outline-none resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-400 font-mono">
                Storage: /data/user/0/com.rizoxzainu.hostingbot/files/bots/{editingBot.id}/{activeEditorTab}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingBot(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveEditor}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Files & Apply</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
