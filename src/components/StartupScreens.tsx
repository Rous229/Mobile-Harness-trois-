import React, { useState, useEffect } from 'react';
import {
  Shield,
  Bell,
  BatteryCharging,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Cpu,
  HardDrive,
  Download,
  Key,
  Globe,
  RefreshCw,
  Terminal,
  Sparkles,
  Bot
} from 'lucide-react';
import { BrandMark } from './BrandMark';
import {
  AgentKind,
  DevStack,
  ProviderKind,
  ProviderProfile,
  StartupStage,
  AppThemeMode
} from '../types';
import { AGENT_DEFINITIONS, DEV_STACKS_INFO, PROVIDER_DEFINITIONS } from '../data/initialData';

interface StartupScreensProps {
  stage: StartupStage;
  themeMode: AppThemeMode;
  onToggleTheme: () => void;
  onComplete: () => void;
  selectedStacks: DevStack[];
  onToggleStack: (stack: DevStack) => void;
  selectedAgent: AgentKind;
  onSelectAgent: (agent: AgentKind) => void;
  provider: ProviderProfile;
  onUpdateProvider: (provider: ProviderProfile) => void;
  apiKey: string;
  onUpdateApiKey: (key: string) => void;
}

export const StartupScreens: React.FC<StartupScreensProps> = ({
  stage,
  onToggleTheme,
  onComplete,
  selectedStacks,
  onToggleStack,
  selectedAgent,
  onSelectAgent,
  provider,
  onUpdateProvider,
  apiKey,
  onUpdateApiKey,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [backgroundStep, setBackgroundStep] = useState<number>(0);
  const [permissions, setPermissions] = useState({
    notifications: true,
    battery: true,
    taskProtection: true,
  });
  const [installProgress, setInstallProgress] = useState<number>(10);
  const [installStatus, setInstallStatus] = useState<string>('Downloading Ubuntu 24.04 core runtime...');
  const [isInstalling, setIsInstalling] = useState<boolean>(false);
  const [antigravityCode, setAntigravityCode] = useState<string>('');
  const [antigravityLoggedIn, setAntigravityLoggedIn] = useState<boolean>(false);

  // Auto-progress simulation for installation
  useEffect(() => {
    if (stage === 'INSTALLING' || isInstalling) {
      const interval = setInterval(() => {
        setInstallProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsInstalling(false);
              setCurrentStep(3); // Go to provider setup
            }, 500);
            return 100;
          }
          if (prev === 25) setInstallStatus('Extracting pocketdev-core-arm64.tar.zst userspace...');
          if (prev === 55) setInstallStatus('Configuring Node.js v22.23, npm, and Git runtime...');
          if (prev === 80) setInstallStatus(`Installing ${AGENT_DEFINITIONS[selectedAgent].title} engine...`);
          if (prev === 95) setInstallStatus('Verifying PRoot userspace sandbox...');
          return prev + 5;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [stage, isInstalling, selectedAgent]);

  // Step 0: Background Task Setup
  if (currentStep === 0) {
    const bgSteps = [
      {
        icon: Bell,
        title: 'Task notifications',
        description: 'See live progress and receive an alert when your coding agent finishes or needs your tool approval.',
        note: 'Only task progress, completion, and error alerts are generated.',
        buttonText: permissions.notifications ? 'Next Step' : 'Allow notifications',
      },
      {
        icon: BatteryCharging,
        title: 'Background reliability',
        description: 'Allow Mobile Harness to continue running tasks when you lock the phone or switch between apps.',
        note: 'You remain in control and can stop any task from its notification.',
        buttonText: permissions.battery ? 'Next Step' : 'Enable background execution',
      },
      {
        icon: Shield,
        title: 'Task protection',
        description: 'Keep the CPU active only while a visible coding task is executing, then release wake lock automatically.',
        note: 'The screen stays off. Protection is capped at 90 minutes and stops with the task.',
        buttonText: 'Enable and continue',
      },
    ];

    const activeBg = bgSteps[backgroundStep];
    const ActiveIcon = activeBg.icon;

    return (
      <div className="min-h-screen bg-[#0B0E14] text-[#E6EDF3] flex flex-col justify-between p-6 max-w-lg mx-auto">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandMark compact size={28} />
            <span className="font-bold tracking-tight text-lg text-white">Mobile Harness</span>
          </div>
          <button
            onClick={() => setCurrentStep(1)}
            className="text-xs text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg border border-[#2A3240]"
          >
            Skip
          </button>
        </header>

        <main className="my-auto py-8">
          <div className="text-xs font-bold text-[#F28C52] tracking-wider uppercase mb-1">Step 1 of 3</div>
          <h1 className="text-2xl font-bold text-white mb-2">Prepare for reliable setup</h1>
          <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
            Autonomous tasks run in a private userspace PRoot layer. Configure background execution so tasks can complete without interruptions.
          </p>

          <div className="flex gap-2 mb-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i <= backgroundStep ? 'bg-[#F28C52]' : 'bg-[#1B222D]'
                }`}
              />
            ))}
          </div>

          <div className="bg-[#131821] border border-[#2A3240] rounded-2xl p-5 shadow-lg mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F28C52]/10 flex items-center justify-center text-[#F28C52]">
                <ActiveIcon size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#F28C52] tracking-wider uppercase block">
                  STEP {backgroundStep + 1} OF 3
                </span>
                <h3 className="font-semibold text-white text-base">{activeBg.title}</h3>
              </div>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed mb-4">{activeBg.description}</p>

            <div className="flex items-start gap-2 text-xs text-neutral-400 bg-[#0B0E14] p-3 rounded-xl border border-[#2A3240]/60 mb-5">
              <Shield size={15} className="text-[#8EA8FF] shrink-0 mt-0.5" />
              <span>{activeBg.note}</span>
            </div>

            <button
              onClick={() => {
                if (backgroundStep < 2) {
                  setBackgroundStep((prev) => prev + 1);
                } else {
                  setCurrentStep(1); // Proceed to Toolchains
                }
              }}
              className="w-full h-12 rounded-xl bg-[#F28C52] hover:bg-[#D85A20] text-[#0B0E14] font-bold flex items-center justify-center gap-2 transition-colors text-sm shadow-md"
            >
              <span>{activeBg.buttonText}</span>
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#131821] border border-[#2A3240]">
              <div className="flex items-center gap-2 text-neutral-300">
                <Bell size={16} className={backgroundStep > 0 ? 'text-[#69D69E]' : 'text-neutral-500'} />
                <span>Task notifications</span>
              </div>
              {backgroundStep > 0 ? (
                <CheckCircle2 size={16} className="text-[#69D69E]" />
              ) : (
                <span className="text-[11px] text-[#F28C52] font-semibold">Active</span>
              )}
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#131821] border border-[#2A3240]">
              <div className="flex items-center gap-2 text-neutral-300">
                <BatteryCharging size={16} className={backgroundStep > 1 ? 'text-[#69D69E]' : 'text-neutral-500'} />
                <span>Background execution</span>
              </div>
              {backgroundStep > 1 ? (
                <CheckCircle2 size={16} className="text-[#69D69E]" />
              ) : (
                <span className="text-[11px] text-neutral-500">Upcoming</span>
              )}
            </div>
          </div>
        </main>

        <footer className="text-center text-xs text-neutral-500">
          Mobile Harness v1.0.4 · Ubuntu 24.04 PRoot Sandbox
        </footer>
      </div>
    );
  }

  // Step 1: System Readiness & Toolchains Selection
  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-[#E6EDF3] flex flex-col justify-between p-6 max-w-lg mx-auto">
        <header className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(0)}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <BrandMark compact size={24} />
            <span className="font-bold text-sm">Mobile Harness</span>
          </div>
          <button
            onClick={() => setCurrentStep(2)}
            className="text-xs text-[#F28C52] font-semibold hover:underline"
          >
            Next
          </button>
        </header>

        <main className="my-auto py-6 space-y-6">
          <div>
            <span className="text-xs font-bold text-[#F28C52] uppercase tracking-wider block">Step 2 of 3</span>
            <h1 className="text-2xl font-bold text-white mt-1">Select your toolchains</h1>
            <p className="text-sm text-neutral-400 mt-1 leading-relaxed">
              Choose the coding agent and language runtimes to bundle into your isolated Linux environment.
            </p>
          </div>

          {/* Device verification badge */}
          <div className="bg-[#131821] border border-[#2A3240] rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#69D69E]/10 text-[#69D69E] flex items-center justify-center">
                <Cpu size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">ARM64 Architecture Verified</p>
                <p className="text-[11px] text-neutral-400">8 Cores · 12 GB RAM · Ubuntu 24.04 Compatible</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#69D69E] bg-[#69D69E]/10 px-2 py-0.5 rounded-full">
              Ready
            </span>
          </div>

          {/* Coding Agent Engine selection */}
          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Bot size={14} className="text-[#F28C52]" />
              Coding Agent Engine
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {(Object.keys(AGENT_DEFINITIONS) as AgentKind[]).map((agentKey) => {
                const agent = AGENT_DEFINITIONS[agentKey];
                const isSelected = selectedAgent === agentKey;

                return (
                  <div
                    key={agentKey}
                    onClick={() => onSelectAgent(agentKey)}
                    className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
                      isSelected
                        ? 'bg-[#1B222D] border-[#F28C52] shadow-sm'
                        : 'bg-[#131821] border-[#2A3240] hover:border-neutral-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-[#F28C52]' : 'border-neutral-500'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-[#F28C52]" />}
                        </div>
                        <span className="font-semibold text-sm text-white">{agent.title}</span>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400 bg-[#0B0E14] px-2 py-0.5 rounded border border-[#2A3240]">
                        {agent.downloadNote}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 pl-6.5">{agent.subtitle}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Development Stacks selection */}
          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <HardDrive size={14} className="text-[#8EA8FF]" />
              Development Toolchains
            </label>
            <div className="space-y-2">
              {(Object.keys(DEV_STACKS_INFO) as DevStack[]).map((stackKey) => {
                const stack = DEV_STACKS_INFO[stackKey];
                const isSelected = selectedStacks.includes(stackKey);

                return (
                  <div
                    key={stackKey}
                    onClick={() => onToggleStack(stackKey)}
                    className={`cursor-pointer rounded-xl p-3 border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#1B222D] border-[#8EA8FF]/60'
                        : 'bg-[#131821] border-[#2A3240] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                        style={{ backgroundColor: `${stack.accentColor}20`, color: stack.accentColor }}
                      >
                        {stack.label.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{stack.label}</p>
                        <p className="text-[11px] text-neutral-400">{stack.tag}</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isSelected
                          ? 'bg-[#8EA8FF] border-[#8EA8FF] text-[#0B0E14]'
                          : 'border-neutral-600 bg-transparent'
                      }`}
                    >
                      {isSelected && <CheckCircle2 size={14} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        <footer className="pt-4">
          <button
            onClick={() => {
              setIsInstalling(true);
              setCurrentStep(2); // Go to installation
            }}
            className="w-full h-12 rounded-xl bg-[#F28C52] hover:bg-[#D85A20] text-[#0B0E14] font-bold flex items-center justify-center gap-2 transition-colors text-sm shadow-md"
          >
            <Download size={18} />
            <span>Install & Bootstrap Runtime</span>
          </button>
        </footer>
      </div>
    );
  }

  // Step 2: Runtime Installation Screen
  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-[#E6EDF3] flex flex-col justify-between p-6 max-w-lg mx-auto">
        <header className="flex items-center justify-center py-4">
          <BrandMark size={36} />
        </header>

        <main className="my-auto text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Setting Up Linux Subsystem</h2>
            <p className="text-sm text-neutral-400 max-w-xs mx-auto">
              Installing the Ubuntu 24.04 LTS userspace and configuring the {AGENT_DEFINITIONS[selectedAgent].title} engine.
            </p>
          </div>

          <div className="bg-[#131821] border border-[#2A3240] rounded-2xl p-6 shadow-xl">
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#1B222D"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#F28C52"
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * installProgress) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-300"
                />
              </svg>
              <span className="absolute text-xl font-bold text-white font-mono">{installProgress}%</span>
            </div>

            <p className="text-xs font-mono text-[#8EA8FF] mb-2">{installStatus}</p>

            <div className="w-full bg-[#0B0E14] rounded-full h-2 overflow-hidden border border-[#2A3240]">
              <div
                className="bg-gradient-to-r from-[#F28C52] to-[#8EA8FF] h-full transition-all duration-300"
                style={{ width: `${installProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-[#0B0E14] border border-[#2A3240] rounded-xl p-3 text-left font-mono text-[11px] text-neutral-400 space-y-1">
            <div className="text-[#69D69E]">✓ Host: Linux aarch64 (PRoot compatible)</div>
            <div className="text-[#69D69E]">✓ Storage: 64.2 GB available</div>
            <div className="text-[#69D69E]">✓ Unpacking rootfs: /data/data/com.jarves.mh/files/usr</div>
            {installProgress > 60 && <div className="text-[#8EA8FF]">✓ Node.js v22.23.2 installed</div>}
            {installProgress > 80 && <div className="text-[#F28C52]">✓ {AGENT_DEFINITIONS[selectedAgent].title} active</div>}
          </div>
        </main>

        <footer className="text-center text-xs text-neutral-500">
          First-time setup takes ~1 minute. Runtimes persist across sessions.
        </footer>
      </div>
    );
  }

  // Step 3: Model & Provider Connection Setup
  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E6EDF3] flex flex-col justify-between p-6 max-w-lg mx-auto">
      <header className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(1)}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-2">
          <BrandMark compact size={24} />
          <span className="font-bold text-sm">Mobile Harness</span>
        </div>
        <button
          onClick={onComplete}
          className="text-xs text-[#69D69E] font-semibold hover:underline"
        >
          Complete
        </button>
      </header>

      <main className="my-auto py-6 space-y-6">
        <div>
          <span className="text-xs font-bold text-[#F28C52] uppercase tracking-wider block">Step 3 of 3</span>
          <h1 className="text-2xl font-bold text-white mt-1">Connect AI Provider</h1>
          <p className="text-sm text-neutral-400 mt-1 leading-relaxed">
            Configure your model provider credentials. Keys are encrypted with Android Keystore AES-256 GCM.
          </p>
        </div>

        {selectedAgent === 'ANTIGRAVITY' ? (
          /* Antigravity Google Sign-in onboarding */
          <div className="bg-[#131821] border border-[#2A3240] rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#69D69E]/15 text-[#69D69E] flex items-center justify-center">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Google Account Sign-In</h3>
                <p className="text-xs text-neutral-400">Antigravity CLI authenticates directly via Google OAuth</p>
              </div>
            </div>

            {!antigravityLoggedIn ? (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-neutral-300 leading-relaxed">
                  PocketDev connects to Google’s official Antigravity CLI service. Sign in with your Google account to grant workspace agent capabilities.
                </p>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={antigravityCode}
                    onChange={(e) => setAntigravityCode(e.target.value)}
                    placeholder="Enter authorization code or token..."
                    className="w-full bg-[#0B0E14] border border-[#2A3240] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#69D69E] font-mono"
                  />
                  <button
                    onClick={() => setAntigravityLoggedIn(true)}
                    className="w-full h-11 rounded-xl bg-[#69D69E] hover:bg-[#52ba85] text-[#0B0E14] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Sparkles size={16} />
                    <span>Connect Google Account</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#69D69E]/10 border border-[#69D69E]/30 rounded-xl p-3.5 text-xs text-[#69D69E] flex items-center gap-2.5 font-semibold">
                <CheckCircle2 size={18} />
                <span>Connected as developer@google.com</span>
              </div>
            )}
          </div>
        ) : (
          /* Claude Code & DeepSeek Harness API Key setup */
          <div className="bg-[#131821] border border-[#2A3240] rounded-2xl p-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2">
                Select Model Provider
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['ANTHROPIC', 'LLM_ROUTER', 'DEEPSEEK', 'KIMI'] as ProviderKind[]).map((kind) => {
                  const meta = PROVIDER_DEFINITIONS[kind];
                  const isSelected = provider.kind === kind;

                  return (
                    <button
                      key={kind}
                      onClick={() =>
                        onUpdateProvider({
                          ...provider,
                          kind,
                          baseUrl: meta.defaultBaseUrl,
                          model: meta.defaultModel,
                        })
                      }
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#1B222D] border-[#F28C52] text-white'
                          : 'bg-[#0B0E14] border-[#2A3240] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <p className="font-semibold text-xs">{meta.title}</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5 truncate">{meta.defaultModel}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Key size={13} className="text-[#F28C52]" />
                API Secret Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => onUpdateApiKey(e.target.value)}
                placeholder={`Paste your ${PROVIDER_DEFINITIONS[provider.kind].title} key...`}
                className="w-full bg-[#0B0E14] border border-[#2A3240] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#F28C52] font-mono"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Zero telemetry. Keys stay inside the encrypted container keystore.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1.5">
                Model Identifier
              </label>
              <input
                type="text"
                value={provider.model}
                onChange={(e) => onUpdateProvider({ ...provider, model: e.target.value })}
                className="w-full bg-[#0B0E14] border border-[#2A3240] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#F28C52] font-mono"
              />
            </div>
          </div>
        )}
      </main>

      <footer className="pt-4 space-y-2">
        <button
          onClick={onComplete}
          className="w-full h-12 rounded-xl bg-[#F28C52] hover:bg-[#D85A20] text-[#0B0E14] font-bold flex items-center justify-center gap-2 transition-colors text-sm shadow-md"
        >
          <span>Launch Mobile Harness Workspace</span>
          <ChevronRight size={18} />
        </button>
        <button
          onClick={onComplete}
          className="w-full text-center text-xs text-neutral-400 hover:text-white py-1"
        >
          Configure provider later
        </button>
      </footer>
    </div>
  );
};
