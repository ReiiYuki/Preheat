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

export interface AppState {
  user: { name: string } | null;
  projects: Project[];
  activeProjectId: string | null;
  activePlanId: string | null;
  hasSeenTutorial?: boolean;
}

export type AppScreen = 'welcome' | 'create-project' | 'dashboard';
