import React, { useState } from 'react';
import {
  ArrowLeft,
  MessageSquare,
  FileCode,
  Terminal,
  GitCommit,
  Globe,
  Sparkles,
  Download,
  Smartphone,
  ChevronDown,
  Plus,
  Play
} from 'lucide-react';
import {
  Project,
  WorkspaceTab,
  AgentKind,
  ChatMessage,
  WorkspaceEntry,
  ChangeItem,
  TerminalOutputLine,
  ToolRequest,
  ProjectChat
} from '../types';
import { AGENT_DEFINITIONS } from '../data/initialData';
import { ChatTab } from './ChatTab';
import { FilesTab } from './FilesTab';
import { TerminalTab } from './TerminalTab';
import { ChangesTab } from './ChangesTab';
import { PreviewTab } from './PreviewTab';

interface WorkspaceScreenProps {
  project: Project;
  onBack: () => void;
  activeAgent: AgentKind;
  activeModel: string;
  chats: ProjectChat[];
  currentChatId: string;
  onSelectChat: (chatId: string) => void;
  onCreateChat: () => void;
  messages: ChatMessage[];
  isTaskRunning: boolean;
  onSendMessage: (text: string) => void;
  onStopTask: () => void;
  pendingToolRequest: ToolRequest | null;
  onApproveTool: (approvalId: string) => void;
  onRejectTool: (approvalId: string) => void;
  files: WorkspaceEntry[];
  activeFile: WorkspaceEntry | null;
  onSelectFile: (file: WorkspaceEntry) => void;
  onSaveFileContent: (path: string, content: string) => void;
  onCreateFile: (path: string, isDirectory: boolean) => void;
  onDeleteFile: (path: string) => void;
  terminalLines: TerminalOutputLine[];
  isTerminalRunning: boolean;
  onRunTerminalCommand: (command: string) => void;
  onInterruptTerminal: () => void;
  onClearTerminal: () => void;
  changes: ChangeItem[];
  onKeepAllChanges: () => void;
  onUndoAllChanges: () => void;
  onKeepFileChange: (path: string) => void;
  onUndoFileChange: (path: string) => void;
}

export const WorkspaceScreen: React.FC<WorkspaceScreenProps> = ({
  project,
  onBack,
  activeAgent,
  activeModel,
  chats,
  currentChatId,
  onSelectChat,
  onCreateChat,
  messages,
  isTaskRunning,
  onSendMessage,
  onStopTask,
  pendingToolRequest,
  onApproveTool,
  onRejectTool,
  files,
  activeFile,
  onSelectFile,
  onSaveFileContent,
  onCreateFile,
  onDeleteFile,
  terminalLines,
  isTerminalRunning,
  onRunTerminalCommand,
  onInterruptTerminal,
  onClearTerminal,
  changes,
  onKeepAllChanges,
  onUndoAllChanges,
  onKeepFileChange,
  onUndoFileChange,
}) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('CHAT');
  const [isChatDropdownOpen, setIsChatDropdownOpen] = useState(false);

  const currentChat = chats.find((c) => c.id === currentChatId) || chats[0];
  const totalChanges = changes.length;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0E14] overflow-hidden">
      {/* Workspace Top App Bar */}
      <header className="bg-[#131821] border-b border-[#2A3240] px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl hover:bg-[#1B222D] text-neutral-400 hover:text-white transition-colors"
            title="Back to all projects"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 truncate">
              <h2 className="font-bold text-white text-sm sm:text-base truncate">{project.name}</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#1B222D] text-neutral-400 border border-[#2A3240] hidden sm:inline">
                {project.language}
              </span>
            </div>

            {/* Chat Sessions Selector */}
            <div className="relative inline-block mt-0.5">
              <button
                onClick={() => setIsChatDropdownOpen(!isChatDropdownOpen)}
                className="flex items-center gap-1 text-[11px] text-[#8EA8FF] hover:text-white font-medium"
              >
                <span>Session: {currentChat?.title || 'Default'}</span>
                <ChevronDown size={12} />
              </button>

              {isChatDropdownOpen && (
                <div className="absolute left-0 top-6 w-48 rounded-xl bg-[#1B222D] border border-[#2A3240] shadow-2xl py-1 z-30 text-xs">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-neutral-500 border-b border-[#2A3240]">
                    Chat Sessions
                  </div>
                  {chats.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectChat(c.id);
                        setIsChatDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-[#2A3240] flex items-center justify-between ${
                        c.id === currentChatId ? 'text-[#F28C52] font-semibold' : 'text-neutral-300'
                      }`}
                    >
                      <span className="truncate">{c.title}</span>
                    </button>
                  ))}
                  <div className="border-t border-[#2A3240] my-1" />
                  <button
                    onClick={() => {
                      setIsChatDropdownOpen(false);
                      onCreateChat();
                    }}
                    className="w-full text-left px-3 py-2 text-[#8EA8FF] hover:bg-[#2A3240] flex items-center gap-1.5"
                  >
                    <Plus size={13} />
                    <span>New Session</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Header Badges & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-[#0B0E14] border border-[#2A3240] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#69D69E]" />
            <span className="text-neutral-300">{AGENT_DEFINITIONS[activeAgent].title}</span>
            <span className="text-neutral-500 font-mono text-[11px]">({activeModel})</span>
          </div>

          <button
            onClick={() => setActiveTab('TERMINAL')}
            className="p-2 rounded-xl bg-[#1B222D] hover:bg-[#2A3240] text-neutral-300 hover:text-white transition-colors"
            title="Open terminal"
          >
            <Terminal size={16} />
          </button>

          <button
            onClick={() => alert(`Generating standalone Android APK / zip build for ${project.name}...`)}
            className="px-3 py-1.5 rounded-xl bg-[#F28C52] hover:bg-[#D85A20] text-[#0B0E14] font-bold text-xs flex items-center gap-1.5 transition-colors"
            title="Build and Export"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </header>

      {/* Tabs Bar */}
      <nav className="bg-[#131821] border-b border-[#2A3240] px-3 flex items-center gap-1 overflow-x-auto select-none shrink-0">
        <button
          onClick={() => setActiveTab('CHAT')}
          className={`px-3 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
            activeTab === 'CHAT'
              ? 'border-[#F28C52] text-[#F28C52]'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <MessageSquare size={14} />
          <span>Chat</span>
          {pendingToolRequest && (
            <span className="w-2 h-2 rounded-full bg-[#F28C52] animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('FILES')}
          className={`px-3 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
            activeTab === 'FILES'
              ? 'border-[#F28C52] text-[#F28C52]'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <FileCode size={14} />
          <span>Files</span>
          <span className="text-[10px] font-mono text-neutral-500 bg-[#0B0E14] px-1.5 py-0.5 rounded">
            {files.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('TERMINAL')}
          className={`px-3 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
            activeTab === 'TERMINAL'
              ? 'border-[#F28C52] text-[#F28C52]'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Terminal size={14} />
          <span>Terminal</span>
          {isTerminalRunning && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#69D69E] animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('CHANGES')}
          className={`px-3 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
            activeTab === 'CHANGES'
              ? 'border-[#F28C52] text-[#F28C52]'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <GitCommit size={14} />
          <span>Changes</span>
          {totalChanges > 0 && (
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#69D69E]/20 text-[#69D69E]">
              {totalChanges}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('PREVIEW')}
          className={`px-3 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
            activeTab === 'PREVIEW'
              ? 'border-[#F28C52] text-[#F28C52]'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Globe size={14} />
          <span>Preview</span>
          <span className="text-[10px] text-[#69D69E] font-mono hidden sm:inline">5173</span>
        </button>
      </nav>

      {/* Main Workspace Stage */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'CHAT' && (
          <ChatTab
            messages={messages}
            isTaskRunning={isTaskRunning}
            activeAgent={activeAgent}
            onSendMessage={onSendMessage}
            onStopTask={onStopTask}
            pendingToolRequest={pendingToolRequest}
            onApproveTool={onApproveTool}
            onRejectTool={onRejectTool}
            onOpenTerminal={() => setActiveTab('TERMINAL')}
            onOpenChanges={() => setActiveTab('CHANGES')}
          />
        )}

        {activeTab === 'FILES' && (
          <FilesTab
            files={files}
            activeFile={activeFile}
            onSelectFile={onSelectFile}
            onSaveFileContent={onSaveFileContent}
            onCreateFile={onCreateFile}
            onDeleteFile={onDeleteFile}
          />
        )}

        {activeTab === 'TERMINAL' && (
          <TerminalTab
            lines={terminalLines}
            isRunning={isTerminalRunning}
            onRunCommand={onRunTerminalCommand}
            onInterrupt={onInterruptTerminal}
            onClear={onClearTerminal}
            promptPath={project.rootPath}
          />
        )}

        {activeTab === 'CHANGES' && (
          <ChangesTab
            changes={changes}
            onKeepAll={onKeepAllChanges}
            onUndoAll={onUndoAllChanges}
            onKeepFile={onKeepFileChange}
            onUndoFile={onUndoFileChange}
          />
        )}

        {activeTab === 'PREVIEW' && (
          <PreviewTab url="http://localhost:5173" />
        )}
      </div>
    </div>
  );
};
