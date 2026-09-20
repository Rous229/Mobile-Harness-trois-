import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Bot,
  Settings,
  Zap,
  Sparkles,
  RefreshCw,
  Cpu
} from 'lucide-react';
import {
  AgentKind,
  AppThemeMode,
  ChangeItem,
  ChatMessage,
  ConnectionValidation,
  DevStack,
  Project,
  ProjectChat,
  ProviderKind,
  ProviderProfile,
  RootScreen,
  StartupStage,
  TerminalOutputLine,
  ToolRequest,
  WorkspaceEntry
} from './types';
import {
  AGENT_DEFINITIONS,
  INITIAL_CHANGES,
  INITIAL_CHATS,
  INITIAL_FILES,
  INITIAL_MESSAGES,
  INITIAL_PROJECTS,
  PROVIDER_DEFINITIONS,
  generateQuickChatIdentity
} from './data/initialData';
import { StartupScreens } from './components/StartupScreens';
import { ProjectsScreen } from './components/ProjectsScreen';
import { WorkspaceScreen } from './components/WorkspaceScreen';
import { AgentScreen } from './components/AgentScreen';
import { SettingsScreen } from './components/SettingsScreen';

export default function App() {
  // Navigation & Startup Stage
  const [startupStage, setStartupStage] = useState<StartupStage>(() => {
    const saved = localStorage.getItem('mh_startup_done');
    return saved === 'true' ? 'READY' : 'SETUP_REQUIRED';
  });
  const [rootScreen, setRootScreen] = useState<RootScreen>('PROJECTS');
  const [themeMode, setThemeMode] = useState<AppThemeMode>('DARK');

  // Agent & Provider State
  const [activeAgent, setActiveAgent] = useState<AgentKind>(() => {
    return (localStorage.getItem('mh_active_agent') as AgentKind) || 'CLAUDE_CODE';
  });
  const [provider, setProvider] = useState<ProviderProfile>(() => {
    const saved = localStorage.getItem('mh_provider_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      kind: 'ANTHROPIC',
      baseUrl: PROVIDER_DEFINITIONS.ANTHROPIC.defaultBaseUrl,
      model: PROVIDER_DEFINITIONS.ANTHROPIC.defaultModel,
      hasSecret: false,
      dshApi: 'anthropic',
    };
  });
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('mh_api_key') || '';
  });

  // Stacks & Toolchains
  const [selectedStacks, setSelectedStacks] = useState<DevStack[]>([
    'WEB',
    'PYTHON',
    'ANDROID',
  ]);

  // Projects State
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('mh_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_PROJECTS;
  });
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Per-workspace state
  const [chats, setChats] = useState<ProjectChat[]>(INITIAL_CHATS);
  const [currentChatId, setCurrentChatId] = useState<string>(INITIAL_CHATS[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isTaskRunning, setIsTaskRunning] = useState<boolean>(false);
  const [pendingToolRequest, setPendingToolRequest] = useState<ToolRequest | null>(null);

  // Files & Editor State
  const [files, setFiles] = useState<WorkspaceEntry[]>(INITIAL_FILES);
  const [activeFile, setActiveFile] = useState<WorkspaceEntry | null>(null);

  // Changes & Git Diffs State
  const [changes, setChanges] = useState<ChangeItem[]>(INITIAL_CHANGES);

  // Terminal State
  const [terminalLines, setTerminalLines] = useState<TerminalOutputLine[]>([
    {
      id: 'term-init-1',
      command: 'uname -a',
      output: 'Linux pocketdev-arm64 6.6.21-android #1 SMP PREEMPT aarch64 GNU/Linux (PRoot Sandbox)',
      exitCode: 0,
      cwd: '/workspace/vite-react-dashboard',
    },
    {
      id: 'term-init-2',
      command: 'node -v && git --version',
      output: 'v22.23.2\ngit version 2.43.0',
      exitCode: 0,
      cwd: '/workspace/vite-react-dashboard',
    },
  ]);
  const [isTerminalRunning, setIsTerminalRunning] = useState<boolean>(false);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('mh_active_agent', activeAgent);
  }, [activeAgent]);

  useEffect(() => {
    localStorage.setItem('mh_provider_profile', JSON.stringify(provider));
  }, [provider]);

  useEffect(() => {
    localStorage.setItem('mh_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('mh_projects', JSON.stringify(projects));
  }, [projects]);

  // Onboarding Complete Handler
  const handleCompleteStartup = () => {
    localStorage.setItem('mh_startup_done', 'true');
    setStartupStage('READY');
  };

  // Stack toggler
  const handleToggleStack = (stack: DevStack) => {
    setSelectedStacks((prev) =>
      prev.includes(stack) ? prev.filter((s) => s !== stack) : [...prev, stack]
    );
  };

  // Create Project
  const handleCreateProject = (name: string, description: string, language: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name,
      description,
      language,
      slug,
      rootPath: `/workspace/${slug}`,
      updatedAtMillis: Date.now(),
      kind: 'PROJECT',
    };
    setProjects((prev) => [newProj, ...prev]);
    setActiveProject(newProj);
  };

  // Create Quick Project
  const handleCreateQuickProject = () => {
    const usedSlugs = new Set(projects.map((p) => p.slug));
    const identity = generateQuickChatIdentity(usedSlugs);
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: identity.displayName,
      description: 'Instant autonomous project created via Quick Project bootstrap.',
      language: 'TypeScript',
      slug: identity.slug,
      rootPath: `/workspace/${identity.slug}`,
      updatedAtMillis: Date.now(),
      kind: 'QUICK_PROJECT',
    };
    setProjects((prev) => [newProj, ...prev]);
    setActiveProject(newProj);
  };

  // Delete Project
  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProject?.id === id) {
      setActiveProject(null);
    }
  };

  // Clone Git Repo
  const handleCloneRepo = (url: string, name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name,
      description: `Cloned from ${url}`,
      language: 'TypeScript',
      slug,
      rootPath: `/workspace/${slug}`,
      updatedAtMillis: Date.now(),
      kind: 'PROJECT',
    };
    setProjects((prev) => [newProj, ...prev]);
    setActiveProject(newProj);
  };

  // Chat message sender with autonomous response simulation
  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      fromUser: true,
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTaskRunning(true);

    // Simulate Agent Thinking & Tool Request
    setTimeout(() => {
      // Determine if a tool approval is appropriate
      const lower = text.toLowerCase();
      if (lower.includes('delete') || lower.includes('rm ') || lower.includes('drop') || lower.includes('install')) {
        setPendingToolRequest({
          approvalId: `appr-${Date.now()}`,
          sessionId: currentChatId,
          toolName: 'bash_executor',
          explanation: `The agent requests permission to execute a potentially destructive command in your PRoot environment based on your prompt "${text}".`,
          affectedPaths: ['src/App.tsx'],
          commandPreview: text,
          risk: 'HIGH',
        });
        setIsTaskRunning(false);
        return;
      }

      // Normal Agent Response
      const agentMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        fromUser: false,
        text: `I have analyzed your request: "${text}".\n\nI navigated your project structure, checked \`package.json\`, and drafted modifications to optimize the user interface and data flow. You can inspect the updated files in the **Files** tab or review line-by-line diffs in the **Changes** tab.`,
        createdAt: new Date().toISOString(),
        workItems: [
          { title: 'Evaluate user request', detail: `Parsed prompt: ${text.slice(0, 40)}...`, isComplete: true, isCommand: false },
          { title: 'Scan workspace AST', detail: 'Identified 5 target files for modification', isComplete: true, isCommand: false },
          { title: 'Execute verification check', detail: 'npm test: 0 failures, 4 passed', isComplete: true, isCommand: true },
        ],
        workedMillis: 2450,
      };

      setMessages((prev) => [...prev, agentMsg]);
      setIsTaskRunning(false);
    }, 1500);
  };

  // Tool Approval handlers
  const handleApproveTool = (approvalId: string) => {
    setPendingToolRequest(null);
    setIsTaskRunning(true);
    setTimeout(() => {
      const respMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        fromUser: false,
        text: 'Action approved and executed successfully. All tests compiled with exit code 0.',
        createdAt: new Date().toISOString(),
        workItems: [
          { title: 'Run approved command', detail: 'Exit code: 0 (OK)', isComplete: true, isCommand: true },
        ],
        workedMillis: 1100,
      };
      setMessages((prev) => [...prev, respMsg]);
      setIsTaskRunning(false);
    }, 1000);
  };

  const handleRejectTool = (approvalId: string) => {
    setPendingToolRequest(null);
    const respMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      fromUser: false,
      text: 'Action was canceled by user request. No files were modified.',
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, respMsg]);
  };

  // Files Tab Handlers
  const handleSaveFileContent = (path: string, content: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.path === path ? { ...f, content, sizeBytes: content.length } : f))
    );
    if (activeFile?.path === path) {
      setActiveFile({ ...activeFile, content, sizeBytes: content.length });
    }
  };

  const handleCreateFile = (path: string, isDirectory: boolean) => {
    const parts = path.split('/');
    const name = parts[parts.length - 1];
    const newEntry: WorkspaceEntry = {
      path,
      name,
      isDirectory,
      depth: parts.length - 1,
      sizeBytes: isDirectory ? 0 : 42,
      content: isDirectory ? undefined : '// Newly created workspace file\n',
    };
    setFiles((prev) => [...prev, newEntry]);
    if (!isDirectory) {
      setActiveFile(newEntry);
    }
  };

  const handleDeleteFile = (path: string) => {
    setFiles((prev) => prev.filter((f) => f.path !== path));
    if (activeFile?.path === path) {
      setActiveFile(null);
    }
  };

  // Terminal Runner
  const handleRunTerminalCommand = (command: string) => {
    setIsTerminalRunning(true);
    const cmdId = `term-${Date.now()}`;
    const cwd = activeProject?.rootPath || '/workspace';

    setTimeout(() => {
      let output = '';
      let exitCode = 0;

      const trimmed = command.trim();
      if (trimmed === 'ls' || trimmed === 'ls -la' || trimmed === 'dir') {
        output = files
          .map((f) => `${f.isDirectory ? 'drwxr-xr-x' : '-rw-r--r--'}  user  staff  ${f.sizeBytes} B  ${f.name}`)
          .join('\n');
      } else if (trimmed === 'pwd') {
        output = cwd;
      } else if (trimmed === 'git status') {
        output = `On branch main\nChanges not staged for commit:\n  modified:   src/App.tsx\n\nno changes added to commit (use "git add" to track)`;
      } else if (trimmed === 'node -v') {
        output = 'v22.23.2';
      } else if (trimmed === 'python3 --version' || trimmed === 'python --version') {
        output = 'Python 3.12.3';
      } else if (trimmed === 'uname -m' || trimmed === 'uname -a') {
        output = 'Linux pocketdev-arm64 6.6.21-android aarch64';
      } else if (trimmed === 'df -h') {
        output = 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/root        64G  4.2G   57G   7% /';
      } else if (trimmed.startsWith('cat ')) {
        const targetPath = trimmed.replace('cat ', '').trim();
        const found = files.find((f) => f.path === targetPath || f.name === targetPath);
        output = found?.content || `cat: ${targetPath}: No such file or directory`;
        exitCode = found ? 0 : 1;
      } else if (trimmed === 'npm run dev' || trimmed === 'npm start') {
        output = `> vite-react-dashboard@1.0.0 dev\n> vite\n\n  VITE v5.4.2  ready in 142 ms\n\n  ➜  Local:   http://localhost:5173/\n  ➜  Network: http://0.0.0.0:5173/`;
      } else {
        output = `Executed: ${trimmed}\nExit code 0 (PRoot bash sandbox)`;
      }

      setTerminalLines((prev) => [
        ...prev,
        {
          id: cmdId,
          command,
          output,
          exitCode,
          cwd,
        },
      ]);
      setIsTerminalRunning(false);
    }, 600);
  };

  // Git Diff Changes handlers
  const handleKeepAllChanges = () => {
    setChanges([]);
  };

  const handleUndoAllChanges = () => {
    setChanges([]);
  };

  const handleKeepFileChange = (path: string) => {
    setChanges((prev) => prev.filter((c) => c.path !== path));
  };

  const handleUndoFileChange = (path: string) => {
    setChanges((prev) => prev.filter((c) => c.path !== path));
  };

  // Connection Test
  const handleTestConnection = async (): Promise<ConnectionValidation> => {
    await new Promise((r) => setTimeout(r, 700));
    return {
      success: true,
      message: `Connection successful to ${PROVIDER_DEFINITIONS[provider.kind].title}`,
      latencyMs: 124,
      models: [
        { id: provider.model, displayName: provider.model },
        { id: 'claude-3-7-sonnet', displayName: 'Claude 3.7 Sonnet' },
        { id: 'deepseek-chat', displayName: 'DeepSeek Chat' },
      ],
    };
  };

  // If in Onboarding setup, show Startup Wizard
  if (startupStage !== 'READY') {
    return (
      <StartupScreens
        stage={startupStage}
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode(themeMode === 'DARK' ? 'LIGHT' : 'DARK')}
        onComplete={handleCompleteStartup}
        selectedStacks={selectedStacks}
        onToggleStack={handleToggleStack}
        selectedAgent={activeAgent}
        onSelectAgent={setActiveAgent}
        provider={provider}
        onUpdateProvider={setProvider}
        apiKey={apiKey}
        onUpdateApiKey={setApiKey}
      />
    );
  }

  // If a project workspace is active, render the Workspace Screen
  if (activeProject) {
    return (
      <WorkspaceScreen
        project={activeProject}
        onBack={() => setActiveProject(null)}
        activeAgent={activeAgent}
        activeModel={provider.model}
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onCreateChat={() => {
          const newChat: ProjectChat = {
            id: `chat-${Date.now()}`,
            title: `Session ${chats.length + 1}`,
            createdAtMillis: Date.now(),
            updatedAtMillis: Date.now(),
          };
          setChats((prev) => [...prev, newChat]);
          setCurrentChatId(newChat.id);
        }}
        messages={messages}
        isTaskRunning={isTaskRunning}
        onSendMessage={handleSendMessage}
        onStopTask={() => setIsTaskRunning(false)}
        pendingToolRequest={pendingToolRequest}
        onApproveTool={handleApproveTool}
        onRejectTool={handleRejectTool}
        files={files}
        activeFile={activeFile}
        onSelectFile={setActiveFile}
        onSaveFileContent={handleSaveFileContent}
        onCreateFile={handleCreateFile}
        onDeleteFile={handleDeleteFile}
        terminalLines={terminalLines}
        isTerminalRunning={isTerminalRunning}
        onRunTerminalCommand={handleRunTerminalCommand}
        onInterruptTerminal={() => setIsTerminalRunning(false)}
        onClearTerminal={() => setTerminalLines([])}
        changes={changes}
        onKeepAllChanges={handleKeepAllChanges}
        onUndoAllChanges={handleUndoAllChanges}
        onKeepFileChange={handleKeepFileChange}
        onUndoFileChange={handleUndoFileChange}
      />
    );
  }

  // Root Navigation: Projects / Agent / Settings
  return (
    <div className="flex flex-col h-screen w-screen bg-[#0B0E14] text-[#E6EDF3] overflow-hidden select-none">
      {/* Active Screen */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {rootScreen === 'PROJECTS' && (
          <ProjectsScreen
            projects={projects}
            activeAgent={activeAgent}
            onSelectProject={setActiveProject}
            onCreateProject={handleCreateProject}
            onCreateQuickProject={handleCreateQuickProject}
            onDeleteProject={handleDeleteProject}
            onCloneRepo={handleCloneRepo}
            onOpenAgentTab={() => setRootScreen('AGENT')}
          />
        )}

        {rootScreen === 'AGENT' && (
          <AgentScreen
            activeAgent={activeAgent}
            onSelectAgent={setActiveAgent}
            provider={provider}
            onUpdateProvider={setProvider}
            apiKey={apiKey}
            onSaveApiKey={setApiKey}
            onTestConnection={handleTestConnection}
          />
        )}

        {rootScreen === 'SETTINGS' && (
          <SettingsScreen
            themeMode={themeMode}
            onSetThemeMode={setThemeMode}
            selectedStacks={selectedStacks}
            onToggleStack={handleToggleStack}
            onResetSubsystem={() => {
              if (confirm('Reset PRoot Linux Subsystem? Custom packages will be re-initialized.')) {
                setStartupStage('INSTALLING');
              }
            }}
            onClearCache={() => {
              alert('PRoot temporary caches and socket links cleared.');
            }}
          />
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="bg-[#131821] border-t border-[#2A3240] px-6 py-2 flex items-center justify-around shrink-0 z-20">
        <button
          onClick={() => setRootScreen('PROJECTS')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
            rootScreen === 'PROJECTS'
              ? 'text-[#F28C52] font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <FolderGit2 size={20} />
          <span className="text-[10px] tracking-wide uppercase">Projects</span>
        </button>

        <button
          onClick={() => setRootScreen('AGENT')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
            rootScreen === 'AGENT'
              ? 'text-[#F28C52] font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Bot size={20} />
          <span className="text-[10px] tracking-wide uppercase">Agent</span>
        </button>

        <button
          onClick={() => setRootScreen('SETTINGS')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
            rootScreen === 'SETTINGS'
              ? 'text-[#F28C52] font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Settings size={20} />
          <span className="text-[10px] tracking-wide uppercase">Settings</span>
        </button>
      </nav>
    </div>
  );
}
