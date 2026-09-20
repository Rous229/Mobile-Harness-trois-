import React, { useState } from 'react';
import {
  Bot,
  Key,
  Shield,
  CheckCircle2,
  Sparkles,
  Zap,
  RefreshCw,
  Globe,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import {
  AgentKind,
  ProviderKind,
  ProviderProfile,
  ConnectionValidation
} from '../types';
import { AGENT_DEFINITIONS, PROVIDER_DEFINITIONS } from '../data/initialData';

interface AgentScreenProps {
  activeAgent: AgentKind;
  onSelectAgent: (agent: AgentKind) => void;
  provider: ProviderProfile;
  onUpdateProvider: (profile: ProviderProfile) => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  onTestConnection: () => Promise<ConnectionValidation>;
}

export const AgentScreen: React.FC<AgentScreenProps> = ({
  activeAgent,
  onSelectAgent,
  provider,
  onUpdateProvider,
  apiKey,
  onSaveApiKey,
  onTestConnection,
}) => {
  const [showKey, setShowKey] = useState(false);
  const [keyInput, setKeyInput] = useState(apiKey);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionValidation | null>(null);

  const activeAgentMeta = AGENT_DEFINITIONS[activeAgent];
  const activeProviderMeta = PROVIDER_DEFINITIONS[provider.kind];

  const handleKeySave = () => {
    onSaveApiKey(keyInput.trim());
    onUpdateProvider({ ...provider, hasSecret: !!keyInput.trim() });
  };

  const handlePing = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const res = await onTestConnection();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Connection test failed',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0E14] overflow-y-auto">
      {/* Top Header */}
      <header className="bg-[#131821] border-b border-[#2A3240] px-4 py-3 sm:px-6 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-white tracking-tight text-base sm:text-lg">Agent & Providers</h1>
            <p className="text-[11px] text-neutral-400">Autonomous coding engine and credentials vault</p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B0E14] border border-[#2A3240] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#69D69E]" />
            <span className="text-white font-medium">{activeAgentMeta.title}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Active Engine Hero Card */}
        <div className="bg-gradient-to-br from-[#131821] to-[#1B222D] border border-[#2A3240] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#F28C52]/15 text-[#F28C52] border border-[#F28C52]/30 flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">{activeAgentMeta.title}</h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0B0E14] text-neutral-400 border border-[#2A3240]">
                    {activeAgentMeta.version}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">{activeAgentMeta.subtitle}</p>
              </div>
            </div>

            <button
              onClick={handlePing}
              disabled={testingConnection}
              className="px-3 py-1.5 rounded-xl bg-[#0B0E14] hover:bg-[#1B222D] text-neutral-300 hover:text-white border border-[#2A3240] text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <RefreshCw size={13} className={testingConnection ? 'animate-spin text-[#F28C52]' : ''} />
              <span>{testingConnection ? 'Pinging...' : 'Test Connection'}</span>
            </button>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                testResult.success
                  ? 'bg-[#69D69E]/10 border-[#69D69E]/30 text-[#69D69E]'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <div className="flex-1">
                <span className="font-semibold">{testResult.message}</span>
                {testResult.latencyMs && (
                  <span className="font-mono text-[11px] ml-2">({testResult.latencyMs} ms)</span>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-[#2A3240]/60 font-mono text-xs">
            <div>
              <span className="text-neutral-500 text-[10px] block uppercase">Provider</span>
              <span className="text-white font-semibold">{activeProviderMeta.title}</span>
            </div>
            <div>
              <span className="text-neutral-500 text-[10px] block uppercase">Active Model</span>
              <span className="text-white font-semibold truncate block">{provider.model}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-neutral-500 text-[10px] block uppercase">Security Vault</span>
              <span className="text-[#69D69E] font-semibold flex items-center gap-1">
                <Shield size={12} />
                AES-256 GCM
              </span>
            </div>
          </div>
        </div>

        {/* Coding Engine Selector */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Zap size={14} className="text-[#F28C52]" />
            Select Autonomous Coding Agent
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(Object.keys(AGENT_DEFINITIONS) as AgentKind[]).map((agentKey) => {
              const agent = AGENT_DEFINITIONS[agentKey];
              const isSelected = activeAgent === agentKey;

              return (
                <div
                  key={agentKey}
                  onClick={() => onSelectAgent(agentKey)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#131821] border-[#F28C52] shadow-sm'
                      : 'bg-[#0B0E14] border-[#2A3240] hover:border-neutral-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-sm text-white">{agent.title}</h4>
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#F28C52]' : 'border-neutral-600'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#F28C52]" />}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">{agent.subtitle}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-[#2A3240]/40 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                    <span>{agent.downloadNote}</span>
                    <span>{agent.version}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Antigravity CLI Google Account Authentication (if active) */}
        {activeAgent === 'ANTIGRAVITY' && (
          <section className="bg-[#131821] border border-[#2A3240] rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#69D69E]/15 text-[#69D69E] flex items-center justify-center">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Antigravity CLI Account</h3>
                <p className="text-xs text-neutral-400">Authenticates directly with Google account</p>
              </div>
            </div>

            <div className="bg-[#0B0E14] border border-[#2A3240] rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#F28C52] text-[#0B0E14] font-bold flex items-center justify-center text-xs">
                  G
                </div>
                <div>
                  <p className="font-semibold text-white">developer@google.com</p>
                  <p className="text-[11px] text-[#69D69E]">Active Session</p>
                </div>
              </div>
              <button
                onClick={() => alert('Antigravity session refreshed')}
                className="px-3 py-1.5 rounded-lg bg-[#1B222D] hover:bg-[#2A3240] text-xs font-semibold text-neutral-300"
              >
                Reconnect
              </button>
            </div>
          </section>
        )}

        {/* Provider Profile Configuration (Anthropic / OpenRouter / DeepSeek / etc.) */}
        <section className="bg-[#131821] border border-[#2A3240] rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Model Provider Profile
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">Select backend protocol and API endpoints</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#8EA8FF]/15 text-[#8EA8FF] border border-[#8EA8FF]/30">
              {activeProviderMeta.protocol}
            </span>
          </div>

          {/* Provider Kind Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(PROVIDER_DEFINITIONS) as ProviderKind[]).map((kind) => {
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
                  <p className="text-[10px] text-neutral-500 mt-0.5 truncate">{meta.subtitle}</p>
                </button>
              );
            })}
          </div>

          {/* Base URL Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-300">Provider Base URL</label>
              {!activeProviderMeta.fixedBaseUrl && (
                <button
                  onClick={() => onUpdateProvider({ ...provider, baseUrl: activeProviderMeta.defaultBaseUrl })}
                  className="text-[11px] text-[#F28C52] hover:underline"
                >
                  Reset Default
                </button>
              )}
            </div>
            <input
              type="text"
              value={provider.baseUrl}
              disabled={activeProviderMeta.fixedBaseUrl}
              onChange={(e) => onUpdateProvider({ ...provider, baseUrl: e.target.value })}
              className="w-full bg-[#0B0E14] border border-[#2A3240] disabled:opacity-60 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#F28C52] font-mono"
            />
          </div>

          {/* Model Identifier Input */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
              Target Model Identifier
            </label>
            <input
              type="text"
              value={provider.model}
              onChange={(e) => onUpdateProvider({ ...provider, model: e.target.value })}
              className="w-full bg-[#0B0E14] border border-[#2A3240] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#F28C52] font-mono"
            />
          </div>

          {/* Keystore API Key Input */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5 flex items-center gap-1.5">
              <Lock size={13} className="text-[#F28C52]" />
              API Secret Key (Keystore Vault)
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder={`Paste ${activeProviderMeta.title} API key...`}
                className="w-full bg-[#0B0E14] border border-[#2A3240] rounded-xl pl-3.5 pr-20 py-2 text-xs text-white focus:outline-none focus:border-[#F28C52] font-mono"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 text-neutral-400 hover:text-white"
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  type="button"
                  onClick={handleKeySave}
                  className="px-2.5 py-1 bg-[#F28C52] hover:bg-[#D85A20] text-[#0B0E14] font-bold text-[11px] rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Encrypted locally. Keys are injected directly into agent subprocess execution.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};
