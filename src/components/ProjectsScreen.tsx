import React, { useState } from 'react';
import {
  Folder,
  Plus,
  Zap,
  Search,
  GitBranch,
  Clock,
  MoreVertical,
  Trash2,
  Download,
  FolderGit2,
  X,
  Code2,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { BrandMark } from './BrandMark';
import { Project, AgentKind } from '../types';
import { AGENT_DEFINITIONS } from '../data/initialData';

interface ProjectsScreenProps {
  projects: Project[];
  activeAgent: AgentKind;
  onSelectProject: (project: Project) => void;
  onCreateProject: (name: string, description: string, language: string) => void;
  onCreateQuickProject: () => void;
  onDeleteProject: (id: string) => void;
  onCloneRepo: (url: string, name: string) => void;
  onOpenAgentTab: () => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
  projects,
  activeAgent,
  onSelectProject,
  onCreateProject,
  onCreateQuickProject,
  onDeleteProject,
  onCloneRepo,
  onOpenAgentTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isCloneOpen, setIsCloneOpen] = useState(false);
  const [menuProjectId, setMenuProjectId] = useState<string | null>(null);

  // New project form state
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLanguage, setNewLanguage] = useState('TypeScript');

  // Clone repo form state
  const [cloneUrl, setCloneUrl] = useState('');
  const [cloneName, setCloneName] = useState('');

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLanguageColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'typescript':
        return '#38BDF8';
      case 'javascript':
        return '#FBBF24';
      case 'python':
        return '#34D399';
      case 'android':
      case 'kotlin':
        return '#A78BFA';
      default:
        return '#8EA8FF';
    }
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateProject(newName.trim(), newDescription.trim() || 'Custom development project', newLanguage);
    setNewName('');
    setNewDescription('');
    setIsNewProjectOpen(false);
  };

  const handleCloneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloneUrl.trim()) return;
    const derivedName = cloneName.trim() || cloneUrl.split('/').pop()?.replace('.git', '') || 'cloned-repo';
    onCloneRepo(cloneUrl.trim(), derivedName);
    setCloneUrl('');
    setCloneName('');
    setIsCloneOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0E14] overflow-y-auto">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 bg-[#0B0E14]/95 backdrop-blur-md border-b border-[#2A3240] px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandMark size={32} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-white tracking-tight text-base sm:text-lg">Mobile Harness</h1>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#F28C52]/15 text-[#F28C52] border border-[#F28C52]/30">
                  v1.0.4
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">Ubuntu 24.04 PRoot Workspace</p>
            </div>
          </div>

          <button
            onClick={onOpenAgentTab}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131821] border border-[#2A3240] hover:border-[#F28C52]/50 transition-colors text-xs"
          >
            <span className="w-2 h-2 rounded-full bg-[#69D69E]" />
            <span className="text-white font-medium">{AGENT_DEFINITIONS[activeAgent].title}</span>
            <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">Online</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Quick Actions Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onCreateQuickProject}
            className="group p-4 rounded-2xl bg-gradient-to-r from-[#F28C52]/10 to-[#8EA8FF]/10 border border-[#F28C52]/30 hover:border-[#F28C52] transition-all text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#F28C52] text-[#0B0E14] flex items-center justify-center font-bold shadow-md">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  Launch Quick Project
                  <Sparkles size={13} className="text-[#F28C52]" />
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">Instant isolated workspace with pioneer identity</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-neutral-400 group-hover:text-white transition-colors" />
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setIsNewProjectOpen(true)}
              className="flex-1 h-full min-h-[64px] p-3.5 rounded-2xl bg-[#131821] border border-[#2A3240] hover:border-neutral-500 transition-all flex items-center gap-3 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-[#1B222D] text-white flex items-center justify-center shrink-0 border border-[#2A3240]">
                <Plus size={18} />
              </div>
              <div>
                <span className="font-semibold text-xs text-white block">New Project</span>
                <span className="text-[11px] text-neutral-400">Custom template</span>
              </div>
            </button>

            <button
              onClick={() => setIsCloneOpen(true)}
              className="flex-1 h-full min-h-[64px] p-3.5 rounded-2xl bg-[#131821] border border-[#2A3240] hover:border-neutral-500 transition-all flex items-center gap-3 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-[#1B222D] text-[#8EA8FF] flex items-center justify-center shrink-0 border border-[#2A3240]">
                <FolderGit2 size={18} />
              </div>
              <div>
                <span className="font-semibold text-xs text-white block">Clone Git</span>
                <span className="text-[11px] text-neutral-400">GitHub repo</span>
              </div>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workspaces by name or language..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#131821] border border-[#2A3240] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F28C52]"
            />
          </div>
          <span className="text-xs text-neutral-400 font-mono shrink-0">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </span>
        </div>

        {/* Project List */}
        <div className="space-y-3">
          {filteredProjects.map((project) => {
            const langColor = getLanguageColor(project.language);
            const isMenuOpen = menuProjectId === project.id;

            return (
              <div
                key={project.id}
                className="relative group bg-[#131821] border border-[#2A3240] hover:border-[#8EA8FF]/40 rounded-2xl p-4 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div
                  onClick={() => onSelectProject(project)}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                    <h3 className="font-bold text-sm text-white group-hover:text-[#F28C52] transition-colors">
                      {project.name}
                    </h3>
                    {project.kind === 'QUICK_PROJECT' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#8EA8FF]/15 text-[#8EA8FF] border border-[#8EA8FF]/30">
                        Quick Launch
                      </span>
                    )}
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${langColor}15`, color: langColor, border: `1px solid ${langColor}30` }}
                    >
                      {project.language}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-1">{project.description}</p>
                  <div className="flex items-center gap-4 mt-2.5 text-[11px] text-neutral-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Folder size={12} />
                      {project.rootPath}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      Updated {Math.round((Date.now() - project.updatedAtMillis) / (1000 * 60))}m ago
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#2A3240]/50">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="px-4 py-2 rounded-xl bg-[#1B222D] hover:bg-[#F28C52] text-neutral-300 hover:text-[#0B0E14] font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Open Workspace</span>
                    <ChevronRight size={14} />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setMenuProjectId(isMenuOpen ? null : project.id)}
                      className="w-8 h-8 rounded-lg hover:bg-[#1B222D] text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 top-9 w-44 rounded-xl bg-[#1B222D] border border-[#2A3240] shadow-2xl py-1 z-20 text-xs text-neutral-300">
                        <button
                          onClick={() => {
                            setMenuProjectId(null);
                            onSelectProject(project);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-[#2A3240] flex items-center gap-2"
                        >
                          <Code2 size={14} />
                          <span>Open Workspace</span>
                        </button>
                        <button
                          onClick={() => {
                            setMenuProjectId(null);
                            alert(`Exporting archive for ${project.name} (.zip)...`);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-[#2A3240] flex items-center gap-2"
                        >
                          <Download size={14} />
                          <span>Export Archive</span>
                        </button>
                        <div className="my-1 border-t border-[#2A3240]" />
                        <button
                          onClick={() => {
                            setMenuProjectId(null);
                            onDeleteProject(project.id);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-red-500/20 text-red-400 flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          <span>Delete Project</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 bg-[#131821] rounded-2xl border border-[#2A3240] p-6">
              <Folder size={36} className="mx-auto text-neutral-500 mb-2" />
              <p className="text-sm font-semibold text-white">No projects found</p>
              <p className="text-xs text-neutral-400 mt-1">Try a different search query or launch a Quick Project.</p>
              <button
                onClick={onCreateQuickProject}
                className="mt-4 px-4 py-2 rounded-xl bg-[#F28C52] text-[#0B0E14] text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Zap size={14} />
                <span>Launch Quick Project</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* New Project Modal */}
      {isNewProjectOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131821] border border-[#2A3240] rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Create New Project</h3>
              <button onClick={() => setIsNewProjectOpen(false)} className="text-neutral-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Project Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., node-express-api"
                  required
                  className="w-full bg-[#0B0E14] border border-[#2A3240] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F28C52]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Description</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief description of the app..."
                  className="w-full bg-[#0B0E14] border border-[#2A3240] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F28C52]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Stack / Language</label>
                <select
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#2A3240] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F28C52]"
                >
                  <option value="TypeScript">TypeScript (Vite / React)</option>
                  <option value="JavaScript">JavaScript (Node.js)</option>
                  <option value="Python">Python (FastAPI / Flask)</option>
                  <option value="Android">Android (Kotlin / Gradle)</option>
                  <option value="C++">C / C++ (CMake / GCC)</option>
                  <option value="PHP">PHP (Composer)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewProjectOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#2A3240] text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#F28C52] text-[#0B0E14] text-xs font-bold hover:bg-[#D85A20]"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clone Git Repo Modal */}
      {isCloneOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131821] border border-[#2A3240] rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Clone Git Repository</h3>
              <button onClick={() => setIsCloneOpen(false)} className="text-neutral-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCloneSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Repository HTTPS URL</label>
                <input
                  type="url"
                  value={cloneUrl}
                  onChange={(e) => setCloneUrl(e.target.value)}
                  placeholder="https://github.com/username/repository.git"
                  required
                  className="w-full bg-[#0B0E14] border border-[#2A3240] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8EA8FF] font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Local Directory Name</label>
                <input
                  type="text"
                  value={cloneName}
                  onChange={(e) => setCloneName(e.target.value)}
                  placeholder="Optional (defaults to repo name)"
                  className="w-full bg-[#0B0E14] border border-[#2A3240] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8EA8FF]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCloneOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#2A3240] text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#8EA8FF] text-[#0B0E14] text-xs font-bold hover:bg-[#7292f7]"
                >
                  Clone Repository
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
