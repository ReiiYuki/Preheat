import { useEffect, useReducer, useState, type ReactNode } from 'react';
import type { AppState, Plan } from '@/modules/core/types';
import { saveState } from '@/modules/storage/utils/saveState';
import { loadState } from '@/modules/storage/utils/loadState';
import { createContext } from 'react';

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
  | { type: 'RENAME_PROJECT'; projectId: string; name: string };

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

  useEffect(() => {
    if (isLoaded) {
      saveState(state);
    }
  }, [state, isLoaded]);

  if (!isLoaded) {
    return null;
  }

  const value: AppStateContextValue = {
    state,
    setUser: (name) => dispatch({ type: 'SET_USER', name }),
    addProject: (name) => dispatch({ type: 'ADD_PROJECT', name }),
    addPlan: (projectId) => dispatch({ type: 'ADD_PLAN', projectId }),
    updatePlanTitle: (planId, title) =>
      dispatch({ type: 'UPDATE_PLAN_TITLE', planId, title }),
    updatePlanContent: (planId, content) =>
      dispatch({ type: 'UPDATE_PLAN_CONTENT', planId, content }),
    setActiveProject: (projectId) =>
      dispatch({ type: 'SET_ACTIVE_PROJECT', projectId }),
    setActivePlan: (planId) => dispatch({ type: 'SET_ACTIVE_PLAN', planId }),
    deleteProject: (projectId) =>
      dispatch({ type: 'DELETE_PROJECT', projectId }),
    deletePlan: (planId) => dispatch({ type: 'DELETE_PLAN', planId }),
    renameProject: (projectId, name) =>
      dispatch({ type: 'RENAME_PROJECT', projectId, name }),
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
