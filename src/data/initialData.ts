import {
  AgentKind,
  AgentMeta,
  DevStack,
  DevStackInfo,
  Project,
  ProviderKind,
  ProviderMeta,
  ProviderProfile,
  WorkspaceEntry,
  ChangeItem,
  ChatMessage,
  ProjectChat
} from '../types';

export const AGENT_DEFINITIONS: Record<AgentKind, AgentMeta> = {
  CLAUDE_CODE: {
    kind: 'CLAUDE_CODE',
    stableId: 'claude-code',
    title: 'Claude Code',
    subtitle: "Anthropic's coding agent · broad provider support",
    downloadNote: '71.8 MB',
    version: 'v0.2.29',
  },
  DEEPSEEK_HARNESS: {
    kind: 'DEEPSEEK_HARNESS',
    stableId: 'deepseek-harness',
    title: 'DeepSeek Harness',
    subtitle: 'Official DeepSeek coding agent · API-key providers',
    downloadNote: '26.5 MB',
    version: 'v1.4.0',
  },
  ANTIGRAVITY: {
    kind: 'ANTIGRAVITY',
    stableId: 'antigravity',
    title: 'Antigravity CLI',
    subtitle: "Google's official coding agent · Google account",
    downloadNote: '39.9 MB',
    version: 'v2026.09.1',
  },
};

export const PROVIDER_DEFINITIONS: Record<ProviderKind, ProviderMeta> = {
  ANTHROPIC: {
    kind: 'ANTHROPIC',
    title: 'Anthropic API',
    subtitle: 'Usage billed through Console',
    protocol: 'ANTHROPIC',
    defaultBaseUrl: 'https://api.anthropic.com',
    defaultModel: 'claude-3-7-sonnet-latest',
  },
  CLAUDE: {
    kind: 'CLAUDE',
    title: 'Claude subscription',
    subtitle: 'Pro, Max, Team or Enterprise',
    protocol: 'CLAUDE_LOGIN',
    defaultBaseUrl: '',
    defaultModel: 'default',
  },
  LLM_ROUTER: {
    kind: 'LLM_ROUTER',
    title: 'OpenRouter',
    subtitle: 'Use your OpenRouter API key',
    protocol: 'OPENROUTER',
    defaultBaseUrl: 'https://openrouter.ai/api',
    defaultModel: 'anthropic/claude-3.7-sonnet',
  },
  DEEPSEEK: {
    kind: 'DEEPSEEK',
    title: 'DeepSeek',
    subtitle: 'Use your DeepSeek API key',
    protocol: 'ANTHROPIC_GATEWAY',
    defaultBaseUrl: 'https://api.deepseek.com/anthropic',
    defaultModel: 'deepseek-chat',
  },
  KIMI: {
    kind: 'KIMI',
    title: 'Kimi',
    subtitle: 'Anthropic-compatible endpoint',
    protocol: 'ANTHROPIC_GATEWAY',
    defaultBaseUrl: 'https://api.moonshot.ai/anthropic',
    defaultModel: 'kimi-k2.6',
    experimental: true,
  },
  OPENCODE_ZEN: {
    kind: 'OPENCODE_ZEN',
    title: 'OpenCode Zen',
    subtitle: 'Models through the OpenCode Zen gateway',
    protocol: 'OPENAI_RESPONSES',
    defaultBaseUrl: 'https://opencode.ai/zen/v1',
    defaultModel: 'deepseek-v4-flash',
    fixedBaseUrl: true,
    fixedProtocol: true,
  },
  NVIDIA_NIM: {
    kind: 'NVIDIA_NIM',
    title: 'NVIDIA NIM',
    subtitle: 'OpenAI-compatible models hosted by NVIDIA',
    protocol: 'OPENAI_CHAT',
    defaultBaseUrl: 'https://integrate.api.nvidia.com/v1',
    defaultModel: 'qwen/qwen2.5-coder-32b-instruct',
    fixedBaseUrl: true,
    fixedProtocol: true,
  },
  CUSTOM: {
    kind: 'CUSTOM',
    title: 'Custom API',
    subtitle: 'Anthropic-compatible endpoint',
    protocol: 'ANTHROPIC_GATEWAY',
    defaultBaseUrl: 'https://custom-llm.internal/v1',
    defaultModel: 'custom-model',
    experimental: true,
  },
};

export const DEV_STACKS_INFO: Record<DevStack, DevStackInfo> = {
  WEB: {
    stack: 'WEB',
    label: 'Web (JavaScript / TypeScript)',
    description: 'Websites and web apps with HTML, CSS, and JS frameworks.',
    installsSummary: 'Node.js and npm (already included)',
    accentColor: '#38BDF8',
    tag: 'HTML · CSS · JS · TS',
  },
  PYTHON: {
    stack: 'PYTHON',
    label: 'Python',
    description: 'Scripts, automation, data work, and Python backends.',
    installsSummary: 'python3, pip, venv, and build tools',
    accentColor: '#FBBF24',
    tag: 'python3 + pip + venv',
  },
  ANDROID: {
    stack: 'ANDROID',
    label: 'Android (Java / Kotlin)',
    description: 'Build Android app projects and install them directly on this phone.',
    installsSummary: 'JDK 17, ARM64 Android SDK 36, Build Tools 35, Gradle 8.14.3',
    accentColor: '#4ADE80',
    tag: 'OpenJDK build tools',
  },
  CPP: {
    stack: 'CPP',
    label: 'C / C++',
    description: 'Fast compiled programs, algorithms, and systems code.',
    installsSummary: 'gcc, g++, make, cmake, gdb',
    accentColor: '#A78BFA',
    tag: 'gcc + g++ + cmake',
  },
  PHP: {
    stack: 'PHP',
    label: 'PHP',
    description: 'Websites and apps with PHP — classic sites and Laravel projects.',
    installsSummary: 'php-cli, common extensions, and Composer',
    accentColor: '#818CF8',
    tag: 'php-cli + Composer',
  },
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Vite React Dashboard',
    description: 'Mobile developer telemetry hub with real-time process monitoring and analytics.',
    language: 'TypeScript',
    slug: 'vite-react-dashboard',
    rootPath: '/workspace/vite-react-dashboard',
    updatedAtMillis: Date.now() - 1000 * 60 * 18,
    kind: 'PROJECT',
  },
  {
    id: 'proj-2',
    name: 'Nimble Lovelace',
    description: 'Lightweight autonomous utility created with Quick Project bootstrap.',
    language: 'JavaScript',
    slug: 'nimble-lovelace',
    rootPath: '/workspace/nimble-lovelace',
    updatedAtMillis: Date.now() - 1000 * 60 * 120,
    kind: 'QUICK_PROJECT',
  },
  {
    id: 'proj-3',
    name: 'Python FastApi Microservice',
    description: 'RESTful backend API serving device benchmarks and task state.',
    language: 'Python',
    slug: 'python-fastapi-microservice',
    rootPath: '/workspace/python-fastapi-microservice',
    updatedAtMillis: Date.now() - 1000 * 60 * 60 * 24,
    kind: 'PROJECT',
  },
];

export const INITIAL_FILES: WorkspaceEntry[] = [
  {
    path: 'package.json',
    name: 'package.json',
    isDirectory: false,
    depth: 0,
    sizeBytes: 1240,
    content: `{
  "name": "vite-react-dashboard",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^1.16.0"
  }
}`,
  },
  {
    path: 'src',
    name: 'src',
    isDirectory: true,
    depth: 0,
    sizeBytes: 0,
  },
  {
    path: 'src/App.tsx',
    name: 'App.tsx',
    isDirectory: false,
    depth: 1,
    sizeBytes: 3420,
    content: `import React, { useState } from 'react';
import { Cpu, HardDrive, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('metrics');

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-6">
      <header className="flex items-center justify-between pb-6 border-b border-[#2A3240]">
        <div>
          <h1 className="text-xl font-bold text-[#F28C52]">System Monitor</h1>
          <p className="text-xs text-neutral-400">PRoot Userspace Environment</p>
        </div>
      </header>
      <main className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </div>
  );
}`,
  },
  {
    path: 'src/main.tsx',
    name: 'main.tsx',
    isDirectory: false,
    depth: 1,
    sizeBytes: 420,
    content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    isDirectory: false,
    depth: 0,
    sizeBytes: 850,
    content: `# Vite React Dashboard

Autonomous web project running inside Mobile Harness ARM64 Linux subsystem.
- Run \`npm run dev\` in the Terminal tab to start the live preview.
- Inspect and propose file modifications in the Chat tab.`,
  },
];

export const INITIAL_CHANGES: ChangeItem[] = [
  {
    path: 'src/App.tsx',
    additions: 12,
    deletions: 3,
    diffLines: [
      { type: 'CONTEXT', text: 'export default function App() {', oldLine: 3, newLine: 3 },
      { type: 'DELETION', text: '-  const [activeTab, setActiveTab] = useState("overview");', oldLine: 4, newLine: null },
      { type: 'ADDITION', text: '+  const [activeTab, setActiveTab] = useState("metrics");', oldLine: null, newLine: 4 },
      { type: 'ADDITION', text: '+  const [refreshInterval, setRefreshInterval] = useState(1000);', oldLine: null, newLine: 5 },
      { type: 'CONTEXT', text: '   return (', oldLine: 5, newLine: 6 },
      { type: 'CONTEXT', text: '     <div className="min-h-screen bg-[#0B0E14] text-white p-6">', oldLine: 6, newLine: 7 },
      { type: 'ADDITION', text: '+      {/* Updated live metrics cards with Lucide icons */}', oldLine: null, newLine: 8 },
    ],
    accepted: null,
  },
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    fromUser: false,
    text: "Hello! I am Claude Code running in your local Mobile Harness Ubuntu workspace. I have inspected `src/App.tsx` and updated the real-time hardware telemetry dashboard with ARM64 CPU diagnostics and filesystem stats. You can review the proposed changes in the **Changes** tab, run commands in the **Terminal**, or inspect files in **Files**.",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    workItems: [
      { title: 'Read project manifest', detail: 'package.json validated with Vite React dependencies', isComplete: true, isCommand: false },
      { title: 'Inspect App.tsx', detail: 'Parsed component tree and diagnostic hooks', isComplete: true, isCommand: false },
      { title: 'Build preview bundle', detail: 'npm run build: exit code 0', isComplete: true, isCommand: true },
    ],
    workedMillis: 3420,
  },
];

export const INITIAL_CHATS: ProjectChat[] = [
  {
    id: 'chat-1',
    title: 'Initial Dashboard Setup',
    createdAtMillis: Date.now() - 1000 * 60 * 60,
    updatedAtMillis: Date.now() - 1000 * 60 * 15,
  },
];

export function generateQuickChatIdentity(usedSlugs: Set<string>): { displayName: string; slug: string } {
  const adjectives = ['bright', 'calm', 'clever', 'curious', 'gentle', 'nimble', 'quiet', 'swift', 'wise', 'bold'];
  const pioneers = ['turing', 'lovelace', 'hopper', 'tesla', 'curie', 'ramanujan', 'bose', 'kalam', 'faraday', 'darwin'];

  for (let i = 0; i < 20; i++) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const pio = pioneers[Math.floor(Math.random() * pioneers.length)];
    const base = `${adj}-${pio}`;
    if (!usedSlugs.has(base)) {
      const displayName = base.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return { displayName, slug: base };
    }
  }

  const randomSuffix = Math.floor(Math.random() * 900) + 100;
  const base = `swift-coder-${randomSuffix}`;
  return {
    displayName: base.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    slug: base,
  };
}
