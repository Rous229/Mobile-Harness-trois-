import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Square,
  Paperclip,
  X,
  Bot,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileCode,
  Terminal,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import {
  ChatMessage,
  ChatAttachment,
  ToolRequest,
  AgentKind,
  ActivityItem
} from '../types';
import { AGENT_DEFINITIONS } from '../data/initialData';

interface ChatTabProps {
  messages: ChatMessage[];
  isTaskRunning: boolean;
  activeAgent: AgentKind;
  onSendMessage: (text: string, attachments?: ChatAttachment[]) => void;
  onStopTask: () => void;
  pendingToolRequest: ToolRequest | null;
  onApproveTool: (approvalId: string) => void;
  onRejectTool: (approvalId: string) => void;
  onOpenTerminal: (cmd?: string) => void;
  onOpenChanges: () => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  messages,
  isTaskRunning,
  activeAgent,
  onSendMessage,
  onStopTask,
  pendingToolRequest,
  onApproveTool,
  onRejectTool,
  onOpenTerminal,
  onOpenChanges,
}) => {
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [expandedWorkItems, setExpandedWorkItems] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTaskRunning, pendingToolRequest]);

  const handleSend = () => {
    if (!inputText.trim() && attachments.length === 0) return;
    onSendMessage(inputText.trim(), attachments);
    setInputText('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: ChatAttachment[] = Array.from(files).map((file) => ({
      id: `att-${Date.now()}-${Math.random()}`,
      displayName: file.name,
      relativePath: `uploads/${file.name}`,
      mimeType: file.type || 'application/octet-stream',
      sizeBytes: file.size,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    e.target.value = '';
  };

  const toggleWorkItems = (msgId: string) => {
    setExpandedWorkItems((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0E14] overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.fromUser;
          const isExpanded = expandedWorkItems[msg.id] ?? false;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-[#F28C52] text-[#0B0E14]'
                    : 'bg-[#1B222D] text-[#8EA8FF] border border-[#2A3240]'
                }`}
              >
                {isUser ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div className={`space-y-2 flex-1 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#F28C52] text-[#0B0E14] font-medium rounded-tr-sm shadow-md'
                      : 'bg-[#131821] text-[#E6EDF3] border border-[#2A3240] rounded-tl-sm shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Attachments preview */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-black/10 flex flex-wrap gap-1.5">
                      {msg.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center gap-1.5 bg-black/15 px-2.5 py-1 rounded-lg text-xs"
                        >
                          <FileCode size={13} />
                          <span className="font-mono truncate max-w-[150px]">{att.displayName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Work Items / Tool Executions dropdown for assistant */}
                {!isUser && msg.workItems && msg.workItems.length > 0 && (
                  <div className="bg-[#131821] border border-[#2A3240] rounded-xl overflow-hidden text-xs">
                    <button
                      onClick={() => toggleWorkItems(msg.id)}
                      className="w-full px-3 py-2 flex items-center justify-between text-neutral-400 hover:text-white bg-[#1B222D]/60"
                    >
                      <span className="flex items-center gap-1.5 font-semibold text-[11px] text-[#8EA8FF]">
                        <Terminal size={13} />
                        Autonomous Actions ({msg.workItems.length})
                      </span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {isExpanded && (
                      <div className="divide-y divide-[#2A3240] p-1 space-y-1">
                        {msg.workItems.map((item, idx) => (
                          <div key={idx} className="p-2 flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-[#69D69E] shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-white text-[11px]">{item.title}</p>
                              <p className="text-neutral-400 text-[10px] font-mono mt-0.5">{item.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono px-1">
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.workedMillis && msg.workedMillis > 0 && (
                    <span>· Took {(msg.workedMillis / 1000).toFixed(1)}s</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Running Agent Status */}
        {isTaskRunning && (
          <div className="flex gap-3 max-w-md mr-auto animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-[#1B222D] text-[#8EA8FF] border border-[#2A3240] flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-[#131821] border border-[#F28C52]/40 rounded-2xl rounded-tl-sm p-3.5 space-y-2 flex-1 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F28C52] flex items-center gap-1.5">
                  <Sparkles size={13} className="animate-spin" />
                  {AGENT_DEFINITIONS[activeAgent].title} is working...
                </span>
                <button
                  onClick={onStopTask}
                  className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                >
                  <Square size={11} />
                  Stop
                </button>
              </div>
              <p className="text-xs text-neutral-400">
                Running autonomous reasoning loop, inspecting project files, and drafting code modifications...
              </p>
            </div>
          </div>
        )}

        {/* Pending Tool Approval Card */}
        {pendingToolRequest && (
          <div className="bg-[#1B222D] border-2 border-[#F28C52] rounded-2xl p-4 shadow-xl max-w-lg mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <AlertTriangle size={18} className="text-[#F28C52]" />
                <span>Tool Approval Required</span>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {pendingToolRequest.risk} Risk
              </span>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">{pendingToolRequest.explanation}</p>

            {pendingToolRequest.commandPreview && (
              <div className="bg-[#0B0E14] rounded-xl p-2.5 font-mono text-[11px] text-[#69D69E] border border-[#2A3240] overflow-x-auto">
                $ {pendingToolRequest.commandPreview}
              </div>
            )}

            {pendingToolRequest.affectedPaths && pendingToolRequest.affectedPaths.length > 0 && (
              <div className="text-[11px] text-neutral-400">
                <span className="font-semibold text-white">Target files: </span>
                {pendingToolRequest.affectedPaths.join(', ')}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onRejectTool(pendingToolRequest.approvalId)}
                className="flex-1 py-2 rounded-xl bg-[#131821] hover:bg-neutral-800 text-neutral-300 text-xs font-semibold border border-[#2A3240]"
              >
                Reject
              </button>
              <button
                onClick={() => onApproveTool(pendingToolRequest.approvalId)}
                className="flex-1 py-2 rounded-xl bg-[#F28C52] hover:bg-[#D85A20] text-[#0B0E14] text-xs font-bold"
              >
                Approve Action
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Staging Bar */}
      {attachments.length > 0 && (
        <div className="bg-[#131821] border-t border-[#2A3240] px-4 py-2 flex items-center gap-2 overflow-x-auto">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-1.5 bg-[#1B222D] border border-[#2A3240] px-2.5 py-1 rounded-lg text-xs text-white shrink-0"
            >
              <FileCode size={13} className="text-[#8EA8FF]" />
              <span className="font-mono text-[11px]">{att.displayName}</span>
              <button
                onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                className="text-neutral-400 hover:text-white ml-1"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Form Bar */}
      <div className="p-3 sm:p-4 bg-[#131821] border-t border-[#2A3240]">
        <div className="flex items-end gap-2 bg-[#0B0E14] border border-[#2A3240] rounded-2xl p-2 focus-within:border-[#F28C52] transition-colors">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-[#1B222D] transition-colors shrink-0"
            title="Attach file"
          >
            <Paperclip size={18} />
          </button>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Instruct ${AGENT_DEFINITIONS[activeAgent].title} (e.g., 'Add dark mode toggle to App.tsx')...`}
            rows={1}
            className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none resize-none py-1.5 max-h-32"
          />

          {isTaskRunning ? (
            <button
              onClick={onStopTask}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors shrink-0"
              title="Stop task"
            >
              <Square size={16} />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!inputText.trim() && attachments.length === 0}
              className="p-2 bg-[#F28C52] hover:bg-[#D85A20] disabled:opacity-40 disabled:hover:bg-[#F28C52] text-[#0B0E14] rounded-xl transition-colors shrink-0 font-bold"
              title="Send prompt"
            >
              <Send size={16} />
            </button>
          )}
        </div>
        <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2 px-1">
          <span>Shift+Enter for newline · Enter to send</span>
          <div className="flex items-center gap-3">
            <button onClick={() => onOpenTerminal()} className="hover:text-neutral-300">
              Terminal
            </button>
            <button onClick={() => onOpenChanges()} className="hover:text-neutral-300">
              Diff Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
