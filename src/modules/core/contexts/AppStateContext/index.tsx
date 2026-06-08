import { useEffect, useReducer, useState, type ReactNode } from 'react';
import type { AppState, Plan } from '@/modules/core/types';
import { saveState } from '@/modules/storage/utils/saveState';
import { loadState } from '@/modules/storage/utils/loadState';
import { createContext } from 'react';
import { watch, readTextFile } from '@tauri-apps/plugin-fs';
import { appDataDir } from '@tauri-apps/api/path';

export interface AppStateContextValue {
  state: AppState;
  setUser: (name: string) => void;
  addProject: (name: string) => void;
  addPlan: (projectId: string) => void;
  updatePlanTitle: (planId: string, title: string) => void;
  updatePlanContent: (planId: string, content: string) => void;
  setActiveProject: (projectId: string) => void;
  setActivePlan: (planId: string) => void;
  deleteProject: (projectId: string) => void;
  deletePlan: (planId: string) => void;
  renameProject: (projectId: string, name: string) => void;
  markTutorialSeen: () => void;
  toggleMcpEnabled: () => void;
  setSyncProvider: (provider: any) => void;
  setWebhookUrl: (url: string) => void;
  setFirebaseConfig: (config: string) => void;
  setSupabaseConfig: (config: { url: string; anonKey: string }) => void;
}

export const AppStateContext = createContext<AppStateContextValue | null>(null);

function uuid(): string {
  return crypto.randomUUID();
}

function now(): number {
  return Date.now();
}

function makePlan(title = 'Untitled'): Plan {
  const t = now();
  return { id: uuid(), title, content: '', createdAt: t, updatedAt: t };
}

type Action =
  | { type: 'INIT_STATE'; state: AppState }
  | { type: 'SET_USER'; name: string }
  | { type: 'ADD_PROJECT'; name: string }
  | { type: 'ADD_PLAN'; projectId: string }
  | { type: 'UPDATE_PLAN_TITLE'; planId: string; title: string }
  | { type: 'UPDATE_PLAN_CONTENT'; planId: string; content: string }
  | { type: 'SET_ACTIVE_PROJECT'; projectId: string }
  | { type: 'SET_ACTIVE_PLAN'; planId: string }
  | { type: 'DELETE_PROJECT'; projectId: string }
  | { type: 'DELETE_PLAN'; planId: string }
  | { type: 'RENAME_PROJECT'; projectId: string; name: string }
  | { type: 'MARK_TUTORIAL_SEEN' }
  | { type: 'TOGGLE_MCP_ENABLED' }
  | { type: 'SET_SYNC_PROVIDER'; provider: any }
  | { type: 'SET_WEBHOOK_URL'; url: string }
  | { type: 'SET_FIREBASE_CONFIG'; config: string }
  | { type: 'SET_SUPABASE_CONFIG'; config: { url: string; anonKey: string } };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'INIT_STATE':
      return action.state;

    case 'SET_USER':
      return { ...state, user: { name: action.name } };

    case 'ADD_PROJECT': {
      const plan = makePlan();
      const project = {
        id: uuid(),
        name: action.name,
        plans: [plan],
        createdAt: now(),
      };
      return {
        ...state,
        projects: [...state.projects, project],
        activeProjectId: project.id,
        activePlanId: plan.id,
      };
    }

    case 'ADD_PLAN': {
      const plan = makePlan();
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.projectId
            ? { ...p, plans: [...p.plans, plan] }
            : p,
        ),
        activePlanId: plan.id,
      };
    }

    case 'UPDATE_PLAN_TITLE':
      return {
        ...state,
        projects: state.projects.map((p) => ({
          ...p,
          plans: p.plans.map((pl) =>
            pl.id === action.planId
              ? { ...pl, title: action.title, updatedAt: now() }
              : pl,
          ),
        })),
      };

    case 'UPDATE_PLAN_CONTENT':
      return {
        ...state,
        projects: state.projects.map((p) => ({
          ...p,
          plans: p.plans.map((pl) =>
            pl.id === action.planId
              ? { ...pl, content: action.content, updatedAt: now() }
              : pl,
          ),
        })),
      };

    case 'SET_ACTIVE_PROJECT': {
      const project = state.projects.find((p) => p.id === action.projectId);
      return {
        ...state,
        activeProjectId: action.projectId,
        activePlanId: project?.plans[0]?.id ?? null,
      };
    }

    case 'SET_ACTIVE_PLAN':
      return { ...state, activePlanId: action.planId };

    case 'DELETE_PROJECT': {
      const remaining = state.projects.filter(
        (p) => p.id !== action.projectId,
      );
      const wasActive = state.activeProjectId === action.projectId;
      return {
        ...state,
        projects: remaining,
        activeProjectId: wasActive
          ? (remaining[0]?.id ?? null)
          : state.activeProjectId,
        activePlanId: wasActive
          ? (remaining[0]?.plans[0]?.id ?? null)
          : state.activePlanId,
      };
    }

    case 'DELETE_PLAN': {
      let newActivePlanId = state.activePlanId;
      const projects = state.projects.map((p) => {
        const filtered = p.plans.filter((pl) => pl.id !== action.planId);
        if (filtered.length === p.plans.length) return p;
        if (state.activePlanId === action.planId) {
          newActivePlanId = filtered[0]?.id ?? null;
        }
        return { ...p, plans: filtered };
      });
      return { ...state, projects, activePlanId: newActivePlanId };
    }

    case 'RENAME_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.projectId ? { ...p, name: action.name } : p,
        ),
      };

    case 'MARK_TUTORIAL_SEEN':
      return { ...state, hasSeenTutorial: true };

    case 'TOGGLE_MCP_ENABLED':
      return {
        ...state,
        mcpEnabled: !state.mcpEnabled,
      };

    case 'SET_WEBHOOK_URL':
      return {
        ...state,
        webhookSyncUrl: action.url,
      };

    case 'SET_SYNC_PROVIDER':
      return {
        ...state,
        syncProvider: action.provider,
      };

    case 'SET_FIREBASE_CONFIG':
      return {
        ...state,
        firebaseConfig: action.config,
      };

    case 'SET_SUPABASE_CONFIG':
      return {
        ...state,
        supabaseConfig: action.config,
      };
    default:
      return state;
  }
}

const DEFAULT_STATE: AppState = {
  user: null,
  projects: [],
  activeProjectId: null,
  activePlanId: null,
};

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [state, dispatch] = useReducer(
    reducer,
    DEFAULT_STATE
  );

  useEffect(() => {
    loadState().then((loadedState) => {
      if (loadedState) {
        dispatch({ type: 'INIT_STATE', state: loadedState });
      }
      setIsLoaded(true);
    });
  }, []);

  // Set up Tauri file watcher to sync from MCP server or external changes
  useEffect(() => {
    if (!window.__TAURI__ || !state.mcpEnabled) return;

    let unwatch: (() => void) | undefined;
    let timeoutId: any;

    const setupWatcher = async () => {
      try {
        const dir = await appDataDir();
        const filePath = `${dir}/state.json`;
        
        unwatch = await watch(filePath, async () => {
          // Debounce read to avoid multiple rapid events
          clearTimeout(timeoutId);
          timeoutId = setTimeout(async () => {
            try {
              const content = await readTextFile(filePath);
              const newState = JSON.parse(content);
              dispatch({ type: 'INIT_STATE', state: newState });
            } catch (err) {
              console.error('Failed to read external state change:', err);
            }
          }, 100);
        });
      } catch (err) {
        console.error('Failed to setup file watcher:', err);
      }
    };

    setupWatcher();

    return () => {
      clearTimeout(timeoutId);
      if (unwatch) unwatch();
    };
  }, [state.mcpEnabled]);

  useEffect(() => {
    if (isLoaded) {
      saveState(state);
    }
  }, [state, isLoaded]);

  if (!isLoaded) {
    return null;
  }


  const setUser = (name: string) => dispatch({ type: 'SET_USER', name });
  const addProject = (name: string) => dispatch({ type: 'ADD_PROJECT', name });
  const addPlan = (projectId: string) => dispatch({ type: 'ADD_PLAN', projectId });
  const updatePlanTitle = (planId: string, title: string) => dispatch({ type: 'UPDATE_PLAN_TITLE', planId, title });
  const updatePlanContent = (planId: string, content: string) => dispatch({ type: 'UPDATE_PLAN_CONTENT', planId, content });
  const setActiveProject = (projectId: string) => dispatch({ type: 'SET_ACTIVE_PROJECT', projectId });
  const setActivePlan = (planId: string) => dispatch({ type: 'SET_ACTIVE_PLAN', planId });
  const deleteProject = (projectId: string) => dispatch({ type: 'DELETE_PROJECT', projectId });
  const deletePlan = (planId: string) => dispatch({ type: 'DELETE_PLAN', planId });
  const renameProject = (projectId: string, name: string) => dispatch({ type: 'RENAME_PROJECT', projectId, name });
  const markTutorialSeen = () => dispatch({ type: 'MARK_TUTORIAL_SEEN' });
  const toggleMcpEnabled = () => dispatch({ type: 'TOGGLE_MCP_ENABLED' });
  const setSyncProvider = (provider: any) => dispatch({ type: 'SET_SYNC_PROVIDER', provider });
  const setWebhookUrl = (url: string) => dispatch({ type: 'SET_WEBHOOK_URL', url });
  const setFirebaseConfig = (config: string) => dispatch({ type: 'SET_FIREBASE_CONFIG', config });
  const setSupabaseConfig = (config: { url: string; anonKey: string }) => dispatch({ type: 'SET_SUPABASE_CONFIG', config });

  return (
    <AppStateContext.Provider
      value={{
        state,
        setUser,
        addProject,
        deleteProject,
        renameProject,
        setActiveProject,
        addPlan,
        updatePlanTitle,
        updatePlanContent,
        deletePlan,
        setActivePlan,
        markTutorialSeen,
        toggleMcpEnabled,
        setSyncProvider,
        setWebhookUrl,
        setFirebaseConfig,
        setSupabaseConfig,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}
