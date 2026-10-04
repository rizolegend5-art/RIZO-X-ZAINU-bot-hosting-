import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  Folder, 
  Github, 
  Smartphone, 
  Terminal, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../data/androidSourceFiles';

export const AndroidCodeExport: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(ANDROID_PROJECT_FILES[0].path);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const selectedFile = ANDROID_PROJECT_FILES.find((f) => f.path === selectedFilePath) || ANDROID_PROJECT_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add all files into their relative folder structure
      ANDROID_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Add Gradle Wrapper
      zip.file(
        'gradle/wrapper/gradle-wrapper.properties',
        `distributionBase=GRADLE_USER_HOME\ndistributionPath=wrapper/dists\ndistributionUrl=https\\://services.gradle.org/distributions/gradle-8.4-bin.zip\nnetworkTimeout=10000\nvalidateDistributionUrl=true\nzipStoreBase=GRADLE_USER_HOME\nzipStorePath=wrapper/dists\n`
      );

      // Add gradlew shell script
      zip.file(
        'gradlew',
        `#!/bin/sh\nexec gradle assembleDebug "$@"\n`,
        { unixPermissions: '755' }
      );

      // Add gradlew.bat for Windows
      zip.file(
        'gradlew.bat',
        `@echo off\ngradle assembleDebug %*\n`
      );

      // Add sample .gitignore
      zip.file(
        '.gitignore',
        `*.iml
.gradle
/local.properties
/.idea/caches
/.idea/libraries
/.idea/modules.xml
/.idea/workspace.xml
/.idea/navEditor.xml
/.idea/assetWizardSettings.xml
.DS_Store
/build
/captures
.externalNativeBuild
.cxx
local.properties
`
      );

      // Generate the zip blob
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'RIZO_X_ZAINU_hosting_bot_Android_Studio_Project.zip';
      a.click();
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0c1322] to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Smartphone className="w-5 h-5" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Native Android Studio Project (.APK Codebase)
            </h2>
          </div>
          <p className="text-slate-300 text-sm max-w-2xl">
            Yeh clean Kotlin + Chaquopy Native Android app ka 100% complete source code hai jise aap Android Studio mein open karke direct <strong className="text-cyan-300 font-mono">.apk</strong> build kar sakte hain ya GitHub par push kar sakte hain.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span>{isZipping ? 'Creating Project ZIP...' : 'Download Android Studio (.ZIP)'}</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Complete Android Studio Project (.ZIP) with GitHub Actions workflow downloaded! Push to GitHub to auto-build APK.</span>
        </div>
      )}

      {/* GitHub Actions Fast APK Auto-Builder Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a101d] to-slate-900 border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Github className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>GitHub Actions 1-Click Fast APK Auto-Builder</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/40 uppercase">
                  Workflow Ready
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Code GitHub par push karte hi GitHub Actions automatically Cloud mein Android SDK setup karega aur <strong className="text-emerald-400 font-mono">app-debug.apk</strong> build karke download ke liye de dega.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition-colors shadow-sm"
            >
              <span>Create New Repo on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 3 Simple Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[11px]">1</span>
              <span>Create GitHub Repo</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              GitHub.com par ja kar <strong>"New Repository"</strong> banayein (e.g. <code>rizo-hosting-bot</code>). Repository ko <strong>Public</strong> rakhein.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="text-cyan-400 font-bold flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[11px]">2</span>
              <span>Push Code</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Neeche diye gaye 4 commands run karke code push karein. Isme <code>.github/workflows/build-apk.yml</code> shamil hai.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="text-amber-400 font-bold flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[11px]">3</span>
              <span>Download Debug APK</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              GitHub repository ke <strong>"Actions"</strong> tab mein jayein. 2 minute mein build complete hoga aur <strong>RIZO-X-ZAINU-debug-apk</strong> download ho jayega!
            </p>
          </div>
        </div>

        {/* Copyable Git Commands */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Terminal Commands (Copy & Paste to Push to GitHub):</span>
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `git init\ngit add .\ngit commit -m "feat: complete RIZO X ZAINU hosting bot Android App with 24/7 Foreground Service"\ngit branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git\ngit push -u origin main`
                );
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-mono"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'All Commands Copied!' : 'Copy All Commands'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-[#040711] border border-slate-800 font-mono text-xs text-emerald-300 space-y-1.5 overflow-x-auto leading-relaxed select-all">
            <div className="text-slate-500"># 1. Initialize Git and Stage All Android + Workflow Files</div>
            <div>git init</div>
            <div>git add .</div>
            <div>git commit -m "feat: complete RIZO X ZAINU hosting bot Android App with 24/7 Foreground Service"</div>
            <div className="text-slate-500 pt-1"># 2. Set Branch to Main</div>
            <div>git branch -M main</div>
            <div className="text-slate-500 pt-1"># 3. Connect Your GitHub Repository (Replace with your actual GitHub URL)</div>
            <div className="text-cyan-300">git remote add origin https://github.com/YOUR_USERNAME/rizo-x-zainu-hosting-bot.git</div>
            <div className="text-slate-500 pt-1"># 4. Push to GitHub (Workflow triggers automatically)</div>
            <div className="text-amber-300 font-bold">git push -u origin main</div>
          </div>
        </div>
      </div>

      {/* Code Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: File Tree */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 pb-2 border-b border-slate-800">
            <span className="flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-amber-400" />
              <span>Project Files ({ANDROID_PROJECT_FILES.length})</span>
            </span>
          </div>

          <div className="space-y-1">
            {ANDROID_PROJECT_FILES.map((file) => {
              const isSelected = file.path === selectedFilePath;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-mono transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <FileCode className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <div className="truncate">
                    <div className="truncate">{file.path}</div>
                    <div className="text-[10px] text-slate-500 font-normal truncate mt-0.5">
                      {file.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 flex-wrap gap-2">
            <div>
              <h4 className="font-mono text-xs font-bold text-white flex items-center gap-2">
                <span>{selectedFile.path}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 uppercase">
                  {selectedFile.language}
                </span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {selectedFile.description}
              </p>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy File'}</span>
            </button>
          </div>

          {/* Code Body */}
          <div className="rounded-xl overflow-hidden border border-slate-800/80 bg-[#060a12] p-4 flex-1">
            <pre className="font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed max-h-[500px]">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
