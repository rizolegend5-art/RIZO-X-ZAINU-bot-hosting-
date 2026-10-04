import React, { useState } from 'react';
import { 
  Upload, 
  FileCode, 
  Layers, 
  FileText, 
  Key, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  HelpCircle,
  Smartphone,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';
import { TEMPLATES } from '../data/sampleBots';
import { BotInstance } from '../types';

interface HostNewBotProps {
  onHostBot: (newBot: Omit<BotInstance, 'uptimeSeconds' | 'ramUsageMb' | 'cpuPercent' | 'pid'>) => void;
  onSelectTemplate: (templateId: string) => void;
}

export const HostNewBot: React.FC<HostNewBotProps> = ({ onHostBot }) => {
  const [botName, setBotName] = useState('Telegram Assistant');
  const [botDescription, setBotDescription] = useState('24/7 Telegram bot hosted locally on Android RAM');
  const [botToken, setBotToken] = useState('');
  const [adminHandle, setAdminHandle] = useState('@rizohacker');
  const [activeFileTab, setActiveFileTab] = useState<'bot.py' | 'requirements.txt' | '.env'>('bot.py');

  const [files, setFiles] = useState<{
    'bot.py': string;
    'requirements.txt': string;
    '.env': string;
  }>({
    'bot.py': TEMPLATES[0].files['bot.py'],
    'requirements.txt': TEMPLATES[0].files['requirements.txt'],
    '.env': TEMPLATES[0].files['.env'],
  });

  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Handle file uploads from phone's internal storage
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    let loadedCount = 0;
    const newFiles = { ...files };

    Array.from(uploadedFiles).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (file.name === 'bot.py' || file.name.endsWith('.py')) {
          newFiles['bot.py'] = content;
        } else if (file.name === 'requirements.txt') {
          newFiles['requirements.txt'] = content;
        } else if (file.name === '.env' || file.name.endsWith('.env')) {
          newFiles['.env'] = content;
          // Try to auto-parse BOT_TOKEN
          const tokenMatch = content.match(/BOT_TOKEN\s*=\s*(.+)/);
          if (tokenMatch && tokenMatch[1]) {
            setBotToken(tokenMatch[1].trim().replace(/['"]/g, ''));
          }
        }

        loadedCount++;
        if (loadedCount === uploadedFiles.length) {
          setFiles(newFiles);
          setUploadStatus(`Uploaded ${uploadedFiles.length} file(s) from phone storage successfully.`);
          setTimeout(() => setUploadStatus(null), 4000);
        }
      };
      reader.readAsText(file);
    });
  };

  const handleApplyTemplate = (template: typeof TEMPLATES[0]) => {
    setBotName(template.title);
    setBotDescription(template.description);
    setFiles({
      'bot.py': template.files['bot.py'],
      'requirements.txt': template.files['requirements.txt'],
      '.env': template.files['.env'],
    });
    setUploadStatus(`Loaded template: "${template.title}"`);
    setTimeout(() => setUploadStatus(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare .env with entered botToken if updated
    let updatedEnv = files['.env'];
    if (botToken) {
      if (updatedEnv.includes('BOT_TOKEN=')) {
        updatedEnv = updatedEnv.replace(/BOT_TOKEN=.*/, `BOT_TOKEN=${botToken}`);
      } else {
        updatedEnv = `BOT_TOKEN=${botToken}\n${updatedEnv}`;
      }
    }
    if (adminHandle) {
      if (updatedEnv.includes('ADMIN_USERNAME=')) {
        updatedEnv = updatedEnv.replace(/ADMIN_USERNAME=.*/, `ADMIN_USERNAME=${adminHandle}`);
      } else {
        updatedEnv += `\nADMIN_USERNAME=${adminHandle}`;
      }
    }

    const envMap: Record<string, string> = {};
    updatedEnv.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2 && !parts[0].startsWith('#')) {
        envMap[parts[0].trim()] = parts.slice(1).join('=').trim();
      }
    });

    const newBotData: Omit<BotInstance, 'uptimeSeconds' | 'ramUsageMb' | 'cpuPercent' | 'pid'> = {
      id: `bot-${Date.now()}`,
      name: botName.trim() || 'My Telegram Bot',
      description: botDescription.trim() || 'Local Telegram Bot on Phone RAM',
      status: 'installing',
      files: {
        ...files,
        '.env': updatedEnv,
      },
      envVars: envMap,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    onHostBot(newBotData);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Banner / Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0c1322] to-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Smartphone className="w-5 h-5" />
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Button 1: Host New Bot on Local Phone
              </h2>
            </div>
            <p className="text-slate-300 text-sm max-w-2xl">
              Apne Android phone ki internal storage se <code className="text-emerald-400 font-mono">bot.py</code>, <code className="text-emerald-400 font-mono">requirements.txt</code>, aur <code className="text-emerald-400 font-mono">.env</code> import karein. App Foreground Service ke sath 24/7 background mein run karegi.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-emerald-300 font-semibold">Foreground Service Ready</div>
              <div className="text-slate-400">RAM & Storage: Native Phone</div>
            </div>
          </div>
        </div>
      </div>

      {uploadStatus && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2 animate-fadeIn font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{uploadStatus}</span>
        </div>
      )}

      {/* Main Grid: Storage Upload & Templates + Bot Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Import from phone & templates */}
        <div className="lg:col-span-5 space-y-6">
          {/* File Picker from Phone Storage */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-100 flex items-center gap-2 text-sm">
                <FolderOpen className="w-4 h-4 text-emerald-400" />
                <span>Import Files from Phone Storage</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Internal Storage</span>
            </div>

            <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-950/40 hover:bg-slate-950/70 group">
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-400 mb-2 transition-colors" />
              <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                Select Files from Device
              </span>
              <span className="text-xs text-slate-400 mt-1 max-w-xs font-mono">
                Select bot.py, requirements.txt, or .env files
              </span>
              <input
                type="file"
                multiple
                accept=".py,.txt,.env"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="text-[12px] text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>
                Files are stored directly inside your Android app data directory: <code className="text-slate-300 font-mono text-[11px]">/data/data/com.rizoxzainu.hostingbot/files/bots/</code>
              </span>
            </div>
          </div>

          {/* Quick Starter Templates */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
            <h3 className="font-semibold text-slate-100 flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Or Choose a Quick Bot Template</span>
            </h3>
            <p className="text-xs text-slate-400">
              Pehle se test kiye gaye Python Telegram bots jinhe aap 1-click mein launch kar sakte hain:
            </p>

            <div className="space-y-2.5">
              {TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => handleApplyTemplate(tpl)}
                  className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer transition-all flex items-start justify-between gap-3 group"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">
                      {tpl.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                      {tpl.description}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 group-hover:underline whitespace-nowrap pt-0.5">
                    Use &rarr;
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Bot Configuration & Code Editor */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-5">
            <h3 className="font-semibold text-slate-100 flex items-center gap-2 text-sm">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>Configure Bot & Environment</span>
            </h3>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Bot Name
                </label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder="e.g. My Telegram Bot"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                  <span>Telegram Admin Username</span>
                </label>
                <input
                  type="text"
                  value={adminHandle}
                  onChange={(e) => setAdminHandle(e.target.value)}
                  placeholder="@rizohacker"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Telegram Bot Token (from @BotFather)</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Can also be set in .env</span>
                </label>
                <input
                  type="text"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder="123456789:AAFxXXXXXXXXXXXXXXXXXXXXXX"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Live File Viewer & Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveFileTab('bot.py')}
                    className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                      activeFileTab === 'bot.py'
                        ? 'bg-emerald-500 text-slate-950 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    bot.py
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFileTab('requirements.txt')}
                    className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                      activeFileTab === 'requirements.txt'
                        ? 'bg-emerald-500 text-slate-950 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    requirements.txt
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFileTab('.env')}
                    className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                      activeFileTab === '.env'
                        ? 'bg-emerald-500 text-slate-950 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    .env
                  </button>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {activeFileTab === 'bot.py' ? 'Python Script' : activeFileTab === 'requirements.txt' ? 'Pip Dependencies' : 'Secrets & Config'}
                </span>
              </div>

              {/* Code TextArea */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#070b14]">
                <textarea
                  value={files[activeFileTab]}
                  onChange={(e) => setFiles({ ...files, [activeFileTab]: e.target.value })}
                  rows={12}
                  className="w-full p-3.5 bg-transparent text-xs font-mono text-slate-200 focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.99] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Deploy & Run 24/7 on Phone RAM</span>
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-2 font-mono">
                Launches native Android Foreground Service with WakeLock to guarantee uninterrupted execution.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
