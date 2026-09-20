import React from 'react';
import {
  Code,
  Check,
  RotateCcw,
  FileCode,
  CheckCircle2,
  XCircle,
  Plus,
  Minus
} from 'lucide-react';
import { ChangeItem } from '../types';

interface ChangesTabProps {
  changes: ChangeItem[];
  onKeepAll: () => void;
  onUndoAll: () => void;
  onKeepFile: (path: string) => void;
  onUndoFile: (path: string) => void;
}

export const ChangesTab: React.FC<ChangesTabProps> = ({
  changes,
  onKeepAll,
  onUndoAll,
  onKeepFile,
  onUndoFile,
}) => {
  const totalAdditions = changes.reduce((acc, c) => acc + c.additions, 0);
  const totalDeletions = changes.reduce((acc, c) => acc + c.deletions, 0);

  if (changes.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#0B0E14]">
        <div className="w-12 h-12 rounded-2xl bg-[#131821] border border-[#2A3240] flex items-center justify-center text-neutral-500 mb-3">
          <Code size={24} />
        </div>
        <h3 className="font-semibold text-white text-sm">Working Tree Clean</h3>
        <p className="text-xs text-neutral-400 mt-1 max-w-xs">
          No uncommitted modifications or diffs pending review.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0E14] overflow-hidden">
      {/* Header Summary */}
      <div className="bg-[#131821] border-b border-[#2A3240] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            Pending Changes ({changes.length})
          </h2>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-[#69D69E] font-semibold">+{totalAdditions}</span>
            <span className="text-red-400 font-semibold">-{totalDeletions}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onUndoAll}
            className="px-3 py-1.5 rounded-xl bg-[#1B222D] hover:bg-red-500/20 text-neutral-300 hover:text-red-300 text-xs font-semibold flex items-center gap-1.5 border border-[#2A3240] transition-colors"
          >
            <RotateCcw size={13} />
            <span>Undo All</span>
          </button>
          <button
            onClick={onKeepAll}
            className="px-3 py-1.5 rounded-xl bg-[#69D69E] hover:bg-[#58c08b] text-[#0B0E14] text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Check size={13} />
            <span>Keep Changes</span>
          </button>
        </div>
      </div>

      {/* Diffs List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {changes.map((item) => (
          <div
            key={item.path}
            className="bg-[#131821] border border-[#2A3240] rounded-2xl overflow-hidden shadow-sm"
          >
            {/* File header */}
            <div className="bg-[#1B222D] px-4 py-2.5 flex items-center justify-between border-b border-[#2A3240]">
              <div className="flex items-center gap-2">
                <FileCode size={15} className="text-[#8EA8FF]" />
                <span className="font-mono text-xs font-semibold text-white">{item.path}</span>
                <span className="text-[10px] font-mono text-[#69D69E] font-bold">+{item.additions}</span>
                <span className="text-[10px] font-mono text-red-400 font-bold">-{item.deletions}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onUndoFile(item.path)}
                  className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-[#2A3240]"
                  title="Undo changes to this file"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={() => onKeepFile(item.path)}
                  className="p-1.5 text-neutral-400 hover:text-[#69D69E] rounded-lg hover:bg-[#2A3240]"
                  title="Accept changes to this file"
                >
                  <Check size={14} />
                </button>
              </div>
            </div>

            {/* Diff Lines Table */}
            <div className="font-mono text-[11px] overflow-x-auto divide-y divide-[#2A3240]/40">
              {item.diffLines.map((line, idx) => {
                const isAdd = line.type === 'ADDITION';
                const isDel = line.type === 'DELETION';

                return (
                  <div
                    key={idx}
                    className={`flex items-center leading-5 px-3 py-0.5 ${
                      isAdd
                        ? 'bg-[#69D69E]/10 text-[#69D69E]'
                        : isDel
                        ? 'bg-red-500/10 text-red-400'
                        : 'text-neutral-400'
                    }`}
                  >
                    <span className="w-8 text-right select-none text-neutral-600 pr-2 shrink-0">
                      {line.oldLine ?? ''}
                    </span>
                    <span className="w-8 text-right select-none text-neutral-600 pr-3 shrink-0">
                      {line.newLine ?? ''}
                    </span>
                    <span className="w-4 select-none font-bold shrink-0">
                      {isAdd ? '+' : isDel ? '-' : ' '}
                    </span>
                    <span className="whitespace-pre flex-1 select-text">{line.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
