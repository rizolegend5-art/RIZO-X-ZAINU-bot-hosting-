import React from 'react';
import { Send, ExternalLink, ShieldCheck, Heart, Terminal, Smartphone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070b14] mt-16 pt-8 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800/60">
          {/* Brand & Purpose */}
          <div className="flex items-start gap-3.5 max-w-md">
            <img
              src="/src/assets/images/app_brand_logo_1791109461737.jpg"
              alt="RIZO X ZAINU Brand Logo"
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-xl object-cover border border-emerald-500/40 shadow-md flex-shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-base">
                  RIZO <span className="text-emerald-400">X</span> ZAINU
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold">
                  HOSTING BOT v2.4
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                Host Telegram bots 24/7 directly on your Android phone's RAM and storage using Native Foreground Service & Chaquopy Python Runtime.
              </p>
            </div>
          </div>

          {/* Admin Telegram Contact Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center gap-4 shadow-lg shadow-black/20">
            <img
              src="/src/assets/images/admin_rizo_avatar_1791109495036.jpg"
              alt="Admin @rizohacker avatar"
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/40 shadow-md flex-shrink-0"
            />
            <div>
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
                <span>Official Developer & Admin</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <a
                href="https://t.me/rizohacker"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-bold text-sky-400 hover:text-sky-300 text-sm flex items-center gap-1.5 transition-colors"
              >
                <span>Telegram: @rizohacker</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="text-[11px] text-slate-500">Contact for custom bots, setup & 24/7 APK debug support</div>
            </div>
          </div>
        </div>

        {/* Bottom meta row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Foreground Service: START_STICKY & PARTIAL_WAKE_LOCK Enabled</span>
          </div>
          <div>
            Built with Android Native Engine • No Root Required
          </div>
        </div>
      </div>
    </footer>
  );
};
