export interface Plan {
  id: string;
  title: string;
  content: string; // Tiptap JSON content serialized as string
  createdAt: number;
  updatedAt: number;
}

export interface Project {
  id: string;
  name: string;
  plans: Plan[];
  createdAt: number;
}

export type SyncProvider = 'none' | 'webhook' | 'firebase' | 'supabase';

export interface AppState {
  user: { name: string } | null;
  projects: Project[];
  activeProjectId: string | null;
  activePlanId: string | null;
  hasSeenTutorial?: boolean;
  mcpEnabled?: boolean;
  syncProvider?: SyncProvider;
  webhookSyncUrl?: string;
  firebaseConfig?: string;
  supabaseConfig?: { url: string; anonKey: string };
}
