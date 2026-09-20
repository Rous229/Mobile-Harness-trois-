import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Play,
  Square,
  Trash2,
  CornerDownLeft,
  ChevronRight,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react';
import { TerminalOutputLine } from '../types';

interface TerminalTabProps {
  lines: TerminalOutputLine[];
  isRunning: boolean;
  onRunCommand: (command: string) => void;
  onInterrupt: () => void;
  onClear: () => void;
  promptPath?: string;
}

const QUICK_COMMANDS = [
  'ls -la',
  'git status',
  'npm run dev',
  'node -v',
  'python3 --version',
  'uname -m',
  'df -h',
  'cat package.json',
];

export const TerminalTab: React.FC<TerminalTabProps> = ({
  lines,
  isRunning,
  onRunCommand,
  onInterrupt,
  onClear,
  promptPath = '/workspace/vite-react-dashboard',
}) => {
  const [inputCommand, setInputCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines, isRunning]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputCommand.trim() || isRunning) return;

    const cmd = inputCommand.trim();
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInputCommand('');
    onRunCommand(cmd);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputCommand(history[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInputCommand('');
      } else {
        setHistoryIndex(nextIndex);
        setInputCommand(history[nextIndex]);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0E14] overflow-hidden font-mono text-xs">
      {/* Terminal Header Toolbar */}
      <div className="bg-[#131821] border-b border-[#2A3240] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#69D69E]" />
          <span className="font-semibold text-white text-xs">Ubuntu 24.04 PRoot Sandbox</span>
          <span className="text-[10px] text-neutral-500 hidden sm:inline">bash (ARM64)</span>
        </div>

        <div className="flex items-center gap-2">
          {isRunning ? (
            <button
              onClick={onInterrupt}
              className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-[11px] font-semibold flex items-center gap-1 border border-red-500/30"
            >
              <Square size={12} />
              <span>Interrupt (Ctrl+C)</span>
            </button>
          ) : (
            <button
              onClick={onClear}
              className="p-1.5 rounded-lg hover:bg-[#1B222D] text-neutral-400 hover:text-white transition-colors"
              title="Clear terminal"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Quick Command Chips */}
      <div className="bg-[#0B0E14] border-b border-[#2A3240]/40 px-3 py-2 flex items-center gap-1.5 overflow-x-auto select-none">
        <span className="text-[10px] uppercase font-bold text-neutral-500 shrink-0 mr-1">Quick:</span>
        {QUICK_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            onClick={() => {
              setInputCommand(cmd);
              inputRef.current?.focus();
            }}
            className="px-2 py-0.5 rounded-md bg-[#131821] hover:bg-[#1B222D] text-neutral-300 hover:text-[#F28C52] border border-[#2A3240] text-[11px] font-mono shrink-0 transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Log Area */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex-1 overflow-y-auto p-4 space-y-3 cursor-text text-neutral-300 select-text leading-relaxed"
      >
        <div className="text-neutral-500 text-[11px]">
          Mobile Harness Linux Userspace Subsystem [Ubuntu 24.04 aarch64]<br />
          Type commands below or click quick command presets.
        </div>

        {lines.map((line) => (
          <div key={line.id} className="space-y-1">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <span className="text-[#69D69E] font-semibold">user@pocketdev</span>
              <span className="text-neutral-600">:</span>
              <span className="text-[#8EA8FF]">{line.cwd || promptPath}</span>
              <span className="text-neutral-500">$</span>
              <span className="text-white font-semibold">{line.command}</span>
            </div>

            {line.output && (
              <pre className="whitespace-pre-wrap text-neutral-300 pl-3 border-l border-[#2A3240] font-mono text-[11px]">
                {line.output}
              </pre>
            )}

            {line.exitCode !== 0 && (
              <div className="text-red-400 text-[10px] pl-3">
                Process exited with error code {line.exitCode}
              </div>
            )}
          </div>
        ))}

        {isRunning && (
          <div className="flex items-center gap-2 text-[#F28C52] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#F28C52]" />
            <span>Executing command in PRoot environment...</span>
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>

      {/* Input Prompt Bar */}
      <form onSubmit={handleSubmit} className="bg-[#131821] border-t border-[#2A3240] p-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[#69D69E] shrink-0 font-semibold">
            <span className="hidden sm:inline">user@pocketdev:</span>
            <span className="text-[#8EA8FF] truncate max-w-[120px]">{promptPath.split('/').pop()}</span>
            <span>$</span>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isRunning}
            placeholder={isRunning ? 'Process is running...' : 'Enter linux command...'}
            autoFocus
            className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder-neutral-600"
          />

          <button
            type="submit"
            disabled={!inputCommand.trim() || isRunning}
            className="px-3 py-1.5 rounded-lg bg-[#F28C52] disabled:opacity-30 hover:bg-[#D85A20] text-[#0B0E14] font-bold text-xs flex items-center gap-1 transition-colors"
          >
            <Play size={12} fill="currentColor" />
            <span className="hidden sm:inline">Run</span>
          </button>
        </div>
      </form>
    </div>
  );
};
