export type ProviderProtocol =
  | 'CLAUDE_LOGIN'
  | 'ANTHROPIC'
  | 'ANTHROPIC_GATEWAY'
  | 'OPENROUTER'
  | 'OPENAI_RESPONSES'
  | 'OPENAI_CHAT';

export type ProviderKind =
  | 'CLAUDE'
  | 'ANTHROPIC'
  | 'LLM_ROUTER'
  | 'DEEPSEEK'
  | 'KIMI'
  | 'OPENCODE_ZEN'
  | 'NVIDIA_NIM'
  | 'CUSTOM'
  | 'CUSTOM_OPENAI';

export interface ProviderMeta {
  kind: ProviderKind;
  title: String;
  subtitle: String;
  protocol: ProviderProtocol;
  defaultBaseUrl: string;
  defaultModel: string;
  experimental?: boolean;
  fixedBaseUrl?: boolean;
  fixedProtocol?: boolean;
}

export type AgentKind = 'CLAUDE_CODE' | 'DEEPSEEK_HARNESS' | 'ANTIGRAVITY';

export interface AgentMeta {
  kind: AgentKind;
  stableId: string;
  title: string;
  subtitle: string;
  downloadNote: string;
  version: string;
}

export interface ProviderProfile {
  kind: ProviderKind;
  baseUrl: string;
  model: string;
  hasSecret: boolean;
  dshApi: string;
}

export type ProjectKind = 'PROJECT' | 'QUICK_PROJECT';

export interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  slug: string;
  rootPath: string;
  updatedAtMillis: number;
  kind: ProjectKind;
}

export interface WorkspaceEntry {
  path: string;
  name: string;
  isDirectory: boolean;
  depth: number;
  sizeBytes: number;
  content?: string;
}

export type RiskLevel = 'SAFE' | 'REVIEW' | 'HIGH';

export type DevStack = 'WEB' | 'PYTHON' | 'ANDROID' | 'CPP' | 'PHP';

export interface DevStackInfo {
  stack: DevStack;
  label: string;
  description: string;
  installsSummary: string;
  accentColor: string;
  tag: string;
}

export interface ToolRequest {
  approvalId: string;
  sessionId: string;
  toolName: string;
  explanation: string;
  affectedPaths: string[];
  commandPreview?: string | null;
  risk: RiskLevel;
}

export interface ChatAttachment {
  id: string;
  displayName: string;
  relativePath: string;
  mimeType: string;
  sizeBytes: number;
}

export interface ActivityItem {
  title: string;
  detail: string;
  isComplete: boolean;
  isCommand: boolean;
}

export interface ChatMessage {
  id: string;
  fromUser: boolean;
  text: string;
  createdAt: string;
  attachments?: ChatAttachment[];
  workItems?: ActivityItem[];
  workedMillis?: number;
}

export interface ProjectChat {
  id: string;
  title: string;
  createdAtMillis: number;
  updatedAtMillis: number;
}

export type DiffLineType = 'CONTEXT' | 'ADDITION' | 'DELETION' | 'INFO';

export interface DiffLine {
  type: DiffLineType;
  text: string;
  oldLine?: number | null;
  newLine?: number | null;
}

export interface ChangeItem {
  path: string;
  additions: number;
  deletions: number;
  diffLines: DiffLine[];
  binary?: boolean;
  accepted?: boolean | null;
}

export interface TerminalOutputLine {
  id: string;
  command: string;
  output: string;
  exitCode: number;
  cwd?: string;
}

export type StartupStage =
  | 'CHECKING'
  | 'BACKGROUND_SETUP'
  | 'SETUP_REQUIRED'
  | 'INSTALLING'
  | 'MODEL_SETUP'
  | 'INITIALIZING'
  | 'READY'
  | 'ERROR';

export type AppThemeMode = 'SYSTEM' | 'DARK' | 'LIGHT';

export type AntigravityAuthStatus =
  | 'SIGNED_OUT'
  | 'STARTING'
  | 'AWAITING_CODE'
  | 'COMPLETING'
  | 'SIGNED_IN'
  | 'ERROR';

export interface AntigravityAuthState {
  status: AntigravityAuthStatus;
  accountEmail?: string;
  authorizationUrl?: string;
  message?: string;
}

export type RootScreen = 'PROJECTS' | 'AGENT' | 'SETTINGS';

export type WorkspaceTab = 'CHAT' | 'FILES' | 'TERMINAL' | 'CHANGES' | 'PREVIEW';

export interface DiscoveredModel {
  id: string;
  displayName?: string;
  contextWindow?: number;
}

export interface ConnectionValidation {
  success: boolean;
  message: string;
  latencyMs?: number;
  models?: DiscoveredModel[];
}
