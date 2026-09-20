import React, { useState } from 'react';
import {
  Folder,
  FileCode,
  FileText,
  Plus,
  Save,
  ArrowLeft,
  Trash2,
  ChevronRight,
  ChevronDown,
  Check,
  Code
} from 'lucide-react';
import { WorkspaceEntry } from '../types';

interface FilesTabProps {
  files: WorkspaceEntry[];
  activeFile: WorkspaceEntry | null;
  onSelectFile: (file: WorkspaceEntry) => void;
  onSaveFileContent: (path: string, content: string) => void;
  onCreateFile: (path: string, isDirectory: boolean) => void;
  onDeleteFile: (path: string) => void;
}

export const FilesTab: React.FC<FilesTabProps> = ({
  files,
  activeFile,
  onSelectFile,
  onSaveFileContent,
  onCreateFile,
  onDeleteFile,
}) => {
  const [editorContent, setEditorContent] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [newFilePath, setNewFilePath] = useState<string>('');
  const [isCreatingFile, setIsCreatingFile] = useState<boolean>(false);
  const [createAsFolder, setCreateAsFolder] = useState<boolean>(false);

  // Sync editor content when activeFile changes
  React.useEffect(() => {
    if (activeFile) {
      setEditorContent(activeFile.content || '');
      setIsSaved(true);
    }
  }, [activeFile]);

  const handleSave = () => {
    if (!activeFile) return;
    onSaveFileContent(activeFile.path, editorContent);
    setIsSaved(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilePath.trim()) return;
    onCreateFile(newFilePath.trim(), createAsFolder);
    setNewFilePath('');
    setIsCreatingFile(false);
  };

  // If a file is active, show the Code Editor view
  if (activeFile) {
    const lines = editorContent.split('\n');

    return (
      <div className="flex-1 flex flex-col h-full bg-[#0B0E14] overflow-hidden">
        {/* Editor Top Bar */}
        <div className="bg-[#131821] border-b border-[#2A3240] px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectFile(null as any)}
              className="p-1 rounded-lg hover:bg-[#1B222D] text-neutral-400 hover:text-white transition-colors"
              title="Back to file explorer"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex items-center gap-2">
              <FileCode size={15} className="text-[#38BDF8]" />
              <span className="font-mono text-xs font-semibold text-white">{activeFile.path}</span>
              {!isSaved && (
                <span className="w-2 h-2 rounded-full bg-[#F28C52]" title="Unsaved changes" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-500 font-mono hidden sm:inline">
              {lines.length} lines · {editorContent.length} bytes
            </span>
            <button
              onClick={handleSave}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isSaved
                  ? 'bg-[#1B222D] text-neutral-400 border border-[#2A3240]'
                  : 'bg-[#F28C52] text-[#0B0E14] font-bold hover:bg-[#D85A20]'
              }`}
            >
              {isSaved ? <Check size={14} /> : <Save size={14} />}
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Code Editor Body */}
        <div className="flex-1 flex overflow-hidden font-mono text-xs leading-relaxed bg-[#0B0E14]">
          {/* Line Numbers */}
          <div className="py-4 px-3 select-none text-right bg-[#0B0E14] text-neutral-600 border-r border-[#2A3240]/50 font-mono text-[11px]">
            {lines.map((_, i) => (
              <div key={i} className="h-5">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Text Area */}
          <textarea
            value={editorContent}
            onChange={(e) => {
              setEditorContent(e.target.value);
              setIsSaved(false);
            }}
            spellCheck={false}
            className="flex-1 p-4 bg-transparent text-neutral-200 resize-none focus:outline-none focus:ring-0 leading-5 font-mono text-xs overflow-y-auto"
          />
        </div>
      </div>
    );
  }

  // File Explorer view
  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0E14] overflow-hidden">
      {/* Explorer Header */}
      <div className="bg-[#131821] border-b border-[#2A3240] px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-300">Project Files</h2>
          <p className="text-[11px] text-neutral-500 font-mono">Workspace directory</p>
        </div>

        <button
          onClick={() => setIsCreatingFile(true)}
          className="px-3 py-1.5 rounded-xl bg-[#1B222D] hover:bg-[#F28C52] text-neutral-300 hover:text-[#0B0E14] font-semibold text-xs transition-colors flex items-center gap-1.5 border border-[#2A3240]"
        >
          <Plus size={14} />
          <span>New File</span>
        </button>
      </div>

      {/* New File Input Bar */}
      {isCreatingFile && (
        <form onSubmit={handleCreateSubmit} className="bg-[#1B222D] border-b border-[#2A3240] p-3 flex items-center gap-2">
          <input
            type="text"
            value={newFilePath}
            onChange={(e) => setNewFilePath(e.target.value)}
            placeholder="e.g., src/utils/helpers.ts"
            autoFocus
            className="flex-1 bg-[#0B0E14] border border-[#2A3240] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#F28C52] font-mono"
          />
          <label className="flex items-center gap-1.5 text-xs text-neutral-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={createAsFolder}
              onChange={(e) => setCreateAsFolder(e.target.checked)}
              className="rounded bg-[#0B0E14] border-[#2A3240] text-[#F28C52]"
            />
            <span>Folder</span>
          </label>
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#F28C52] text-[#0B0E14] font-bold text-xs rounded-xl"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setIsCreatingFile(false)}
            className="px-2.5 py-1.5 text-neutral-400 hover:text-white text-xs"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Files List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-[#2A3240]/30">
        {files.map((file) => {
          const isDir = file.isDirectory;

          return (
            <div
              key={file.path}
              onClick={() => {
                if (!isDir) onSelectFile(file);
              }}
              style={{ paddingLeft: `${file.depth * 16 + 12}px` }}
              className={`flex items-center justify-between pr-3 py-2 rounded-xl transition-colors cursor-pointer group ${
                isDir ? 'hover:bg-[#131821]/60' : 'hover:bg-[#1B222D]'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                {isDir ? (
                  <Folder size={16} className="text-[#8EA8FF] shrink-0" />
                ) : (
                  <FileCode size={16} className="text-[#F28C52] shrink-0" />
                )}
                <span className={`text-xs font-mono truncate ${isDir ? 'font-semibold text-white' : 'text-neutral-300'}`}>
                  {file.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!isDir && (
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {file.sizeBytes} B
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete ${file.name}?`)) onDeleteFile(file.path);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-neutral-500 transition-opacity"
                  title="Delete file"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
