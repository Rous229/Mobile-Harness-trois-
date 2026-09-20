import React from 'react';
import {
  Moon,
  Sun,
  HardDrive,
  Cpu,
  Trash2,
  ExternalLink,
  Shield,
  RotateCcw,
  CheckCircle2,
  Download,
  BookOpen
} from 'lucide-react';
import { AppThemeMode, DevStack } from '../types';
import { DEV_STACKS_INFO } from '../data/initialData';

interface SettingsScreenProps {
  themeMode: AppThemeMode;
  onSetThemeMode: (mode: AppThemeMode) => void;
  selectedStacks: DevStack[];
  onToggleStack: (stack: DevStack) => void;
  onResetSubsystem: () => void;
  onClearCache: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  themeMode,
  onSetThemeMode,
  selectedStacks,
  onToggleStack,
  onResetSubsystem,
  onClearCache,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0E14] overflow-y-auto">
      {/* Top Header */}
      <header className="bg-[#131821] border-b border-[#2A3240] px-4 py-3 sm:px-6 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-white tracking-tight text-base sm:text-lg">Settings & Runtime</h1>
            <p className="text-[11px] text-neutral-400">Environment configurations and PRoot diagnostics</p>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#69D69E]/15 text-[#69D69E] border border-[#69D69E]/30">
            Subsystem Healthy
          </span>
        </div>
      </header>

      {/* Settings Sections */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Appearance Section */}
        <section className="bg-[#131821] border border-[#2A3240] rounded-2xl p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            Theme & Appearance
          </h3>

          <div className="grid grid-cols-3 gap-2">
            {(['DARK', 'LIGHT', 'SYSTEM'] as AppThemeMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onSetThemeMode(mode)}
                className={`py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  themeMode === mode
                    ? 'bg-[#1B222D] border-[#F28C52] text-white'
                    : 'bg-[#0B0E14] border-[#2A3240] text-neutral-400 hover:text-white'
                }`}
              >
                {mode === 'DARK' && <Moon size={14} />}
                {mode === 'LIGHT' && <Sun size={14} />}
                {mode === 'SYSTEM' && <Cpu size={14} />}
                <span>{mode.charAt(0) + mode.slice(1).toLowerCase()}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Toolchains Management */}
        <section className="bg-[#131821] border border-[#2A3240] rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Development Toolchains
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Installed compilers, interpreters, and SDKs in Ubuntu userspace
            </p>
          </div>

          <div className="space-y-2">
            {(Object.keys(DEV_STACKS_INFO) as DevStack[]).map((stackKey) => {
              const stack = DEV_STACKS_INFO[stackKey];
              const isInstalled = selectedStacks.includes(stackKey);

              return (
                <div
                  key={stackKey}
                  className="bg-[#0B0E14] border border-[#2A3240] rounded-xl p-3.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                      style={{ backgroundColor: `${stack.accentColor}20`, color: stack.accentColor }}
                    >
                      {stack.label.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{stack.label}</p>
                      <p className="text-[11px] text-neutral-400">{stack.installsSummary}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleStack(stackKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isInstalled
                        ? 'bg-[#69D69E]/15 text-[#69D69E] border border-[#69D69E]/30 hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/30'
                        : 'bg-[#1B222D] text-neutral-300 hover:bg-[#F28C52] hover:text-[#0B0E14]'
                    }`}
                  >
                    {isInstalled ? 'Installed' : 'Install'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* PRoot Subsystem Diagnostics & Storage */}
        <section className="bg-[#131821] border border-[#2A3240] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              PRoot Subsystem Diagnostics
            </h3>
            <span className="text-[11px] font-mono text-[#8EA8FF]">Ubuntu 24.04 LTS (aarch64)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#0B0E14] p-3 rounded-xl border border-[#2A3240]">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">Virtual Memory</span>
              <span className="text-sm font-bold text-white font-mono mt-0.5 block">512 MB / 12 GB</span>
            </div>
            <div className="bg-[#0B0E14] p-3 rounded-xl border border-[#2A3240]">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">RootFS Storage</span>
              <span className="text-sm font-bold text-white font-mono mt-0.5 block">4.2 GB used</span>
            </div>
            <div className="bg-[#0B0E14] p-3 rounded-xl border border-[#2A3240] col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">Node.js Engine</span>
              <span className="text-sm font-bold text-[#69D69E] font-mono mt-0.5 block">v22.23.2</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={onClearCache}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#1B222D] hover:bg-[#2A3240] text-xs font-semibold text-neutral-300 flex items-center justify-center gap-2 border border-[#2A3240] transition-colors"
            >
              <Trash2 size={14} />
              <span>Clear Subprocess Cache</span>
            </button>
            <button
              onClick={onResetSubsystem}
              className="flex-1 py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-400 flex items-center justify-center gap-2 border border-red-500/30 transition-colors"
            >
              <RotateCcw size={14} />
              <span>Reset PRoot Environment</span>
            </button>
          </div>
        </section>

        {/* Open Source Info */}
        <section className="bg-[#131821] border border-[#2A3240] rounded-2xl p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            About Mobile Harness
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Mobile Harness is an autonomous AI developer environment running native terminal execution, coding agents (Claude Code, DeepSeek Harness, Antigravity CLI), and live web previews.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
            <span>Version: v1.0.4</span>
            <span>·</span>
            <span>Licenses: MIT / BSD-3 / GPL-2</span>
            <span>·</span>
            <span className="text-[#F28C52]">PRoot Sandbox</span>
          </div>
        </section>
      </main>
    </div>
  );
};
