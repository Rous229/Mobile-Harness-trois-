import React, { useState } from 'react';
import {
  RotateCw,
  ExternalLink,
  Smartphone,
  Monitor,
  Terminal,
  ChevronDown,
  ChevronUp,
  Globe,
  Cpu,
  HardDrive
} from 'lucide-react';

interface PreviewTabProps {
  url?: string;
}

export const PreviewTab: React.FC<PreviewTabProps> = ({
  url = 'http://localhost:5173',
}) => {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [inputUrl, setInputUrl] = useState(url);
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const consoleLogs = [
    { type: 'info', text: '[vite] connecting...', time: '10:42:01' },
    { type: 'info', text: '[vite] connected.', time: '10:42:02' },
    { type: 'log', text: 'Telemetry server listening on port 5173 (0.0.0.0)', time: '10:42:02' },
    { type: 'log', text: 'ARM64 performance counters initialized: 8 CPU threads active', time: '10:42:03' },
    { type: 'log', text: 'Mounted PRoot sandbox storage at /workspace', time: '10:42:03' },
  ];

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUrl(inputUrl);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0E14] overflow-hidden">
      {/* Browser Bar */}
      <div className="bg-[#131821] border-b border-[#2A3240] px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRefresh}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-[#1B222D] transition-colors"
            title="Reload preview"
          >
            <RotateCw size={15} />
          </button>
        </div>

        <form onSubmit={handleUrlSubmit} className="flex-1 max-w-lg">
          <div className="flex items-center gap-2 bg-[#0B0E14] border border-[#2A3240] rounded-xl px-3 py-1.5 text-xs">
            <Globe size={13} className="text-[#69D69E] shrink-0" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 bg-transparent text-white focus:outline-none font-mono text-[11px]"
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMode(!isMobileMode)}
            className={`p-1.5 rounded-lg transition-colors ${
              isMobileMode ? 'bg-[#F28C52] text-[#0B0E14]' : 'text-neutral-400 hover:text-white hover:bg-[#1B222D]'
            }`}
            title={isMobileMode ? 'Switch to responsive desktop view' : 'Switch to mobile phone view'}
          >
            {isMobileMode ? <Smartphone size={16} /> : <Monitor size={16} />}
          </button>

          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showConsole ? 'bg-[#1B222D] text-[#8EA8FF] border border-[#8EA8FF]/40' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Terminal size={14} />
            <span className="hidden sm:inline">Console</span>
          </button>
        </div>
      </div>

      {/* Preview Stage */}
      <div className="flex-1 bg-[#06080C] overflow-auto flex items-center justify-center p-2 sm:p-4 relative">
        <div
          className={`h-full transition-all duration-300 rounded-2xl overflow-hidden border border-[#2A3240] shadow-2xl bg-[#0B0E14] flex flex-col ${
            isMobileMode ? 'w-full max-w-[375px] max-h-[700px]' : 'w-full'
          }`}
        >
          {/* Simulated App inside WebView */}
          <div className="flex-1 flex flex-col p-6 text-white overflow-y-auto">
            <header className="flex items-center justify-between pb-6 border-b border-[#2A3240]">
              <div>
                <span className="text-[10px] font-bold text-[#69D69E] uppercase tracking-wider font-mono">
                  ● HTTP 200 OK · PORT 5173
                </span>
                <h1 className="text-xl font-bold text-[#F28C52] mt-1">System Monitor</h1>
                <p className="text-xs text-neutral-400">PRoot Userspace Environment</p>
              </div>
            </header>

            <main className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#131821] p-4 rounded-xl border border-[#2A3240]">
                <div className="flex items-center gap-2 text-sky-400 mb-2">
                  <Cpu size={18} />
                  <span className="font-semibold text-sm">ARM64 Cortex-A78</span>
                </div>
                <p className="text-2xl font-bold">8 Cores</p>
                <p className="text-xs text-neutral-400 mt-1">Clock: 2.84 GHz</p>
              </div>

              <div className="bg-[#131821] p-4 rounded-xl border border-[#2A3240]">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <HardDrive size={18} />
                  <span className="font-semibold text-sm">PRoot RootFS</span>
                </div>
                <p className="text-2xl font-bold">4.2 GB / 64 GB</p>
                <p className="text-xs text-neutral-400 mt-1">Ubuntu 24.04 LTS</p>
              </div>

              <div className="bg-[#131821] p-4 rounded-xl border border-[#2A3240]">
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  <Terminal size={18} />
                  <span className="font-semibold text-sm">Active Shells</span>
                </div>
                <p className="text-2xl font-bold">1 Session</p>
                <p className="text-xs text-neutral-400 mt-1">PID 1084 (bash)</p>
              </div>
            </main>

            <div className="mt-6 p-4 rounded-xl bg-[#131821] border border-[#2A3240]">
              <h3 className="font-semibold text-xs text-neutral-300 uppercase tracking-wider mb-2">
                Live Hot Module Replacement (HMR)
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Edits made in the <strong className="text-white">Files</strong> or <strong className="text-white">Chat</strong> tab update this web server in real-time. Console messages stream into the telemetry inspector below.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Console Drawer */}
      {showConsole && (
        <div className="h-44 bg-[#0B0E14] border-t border-[#2A3240] flex flex-col font-mono text-xs">
          <div className="bg-[#131821] px-4 py-1.5 flex items-center justify-between border-b border-[#2A3240]">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Console Telemetry
            </span>
            <button
              onClick={() => setShowConsole(false)}
              className="text-neutral-400 hover:text-white"
            >
              <ChevronDown size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 text-neutral-300 text-[11px]">
            {consoleLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-neutral-500 shrink-0">{log.time}</span>
                <span className={log.type === 'info' ? 'text-[#8EA8FF]' : 'text-neutral-300'}>
                  {log.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
