import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/modules/core/hooks/useAppState';
import { Dialog } from '@base-ui/react/dialog';
import { Logo } from '@/modules/core/components/Logo';
import { TutorialDialog } from '../TutorialDialog';
import { SettingsDialog } from '../SettingsDialog';
import './Sidebar.css';

export function Sidebar() {
  const {
    state,
    addProject,
    addPlan,
    setActiveProject,
    setActivePlan,
    deleteProject,
    deletePlan,
    renameProject,
  } = useApp();

  const [renamingProjectId, setRenamingProjectId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; isProject: boolean } | null>(null);

  const [isTutorialOpen, setIsTutorialOpen] = useState(!state.hasSeenTutorial);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (renamingProjectId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingProjectId]);

  const startRename = (project: { id: string; name: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingProjectId(project.id);
    setRenameValue(project.name);
  };

  const submitRename = () => {
    if (renamingProjectId && renameValue.trim()) {
      renameProject(renamingProjectId, renameValue.trim());
    }
    setRenamingProjectId(null);
    setRenameValue('');
  };

  const confirmDelete = (id: string, isProject: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToDelete({ id, isProject });
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.isProject) {
        deleteProject(itemToDelete.id);
      } else {
        deletePlan(itemToDelete.id);
      }
    }
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="w-[260px] h-screen bg-[--color-surface] border-r border-[--color-border] flex flex-col shrink-0 overflow-y-auto">
      <div className="flex items-center gap-3 px-5 pt-6 pb-2">
        <Logo className="w-10 h-10 object-contain drop-shadow-sm" style={{ color: 'var(--color-text)' }} />
        <span className="font-bold text-lg tracking-wide text-[--color-text]">Preheat</span>
      </div>
      <div className="font-semibold text-xs text-[--color-text-tertiary] px-5 pb-3 uppercase tracking-wider">
        Hi, {state.user?.name || 'Guest'}
      </div>

      <div className="mt-2">
        <div className="text-xs text-[--color-text-tertiary] px-5 py-2 uppercase tracking-wider font-medium">Projects</div>
        {state.projects.map(project => {
          const isActive = project.id === state.activeProjectId;
          return (
            <div key={project.id}>
              <div 
                className={`sidebar-item group cursor-pointer text-sm text-[--color-text] transition-all flex items-center justify-between relative hover:bg-[--color-hover] ${isActive ? 'sidebar-item-active' : ''}`}
                onClick={() => setActiveProject(project.id)}
              >
                {renamingProjectId === project.id ? (
                  <input
                    ref={renameInputRef}
                    className="flex-1 min-w-0 border border-[--color-accent] rounded px-1 py-[1px] text-sm font-inherit outline-none bg-[--color-bg] text-[--color-text]"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={submitRename}
                    onKeyDown={(e) => e.key === 'Enter' && submitRename()}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span 
                    className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                    onDoubleClick={(e) => startRename(project, e)}
                  >
                    {project.name}
                  </span>
                )}
                {state.projects.length > 1 && (
                  <button 
                    className="opacity-0 bg-transparent border-none cursor-pointer text-[--color-text-tertiary] text-xs px-1 py-0.5 rounded transition-all shrink-0 leading-none group-hover:opacity-100 hover:text-[--color-text]"
                    onClick={(e) => confirmDelete(project.id, true, e)}
                    title="Delete Project"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {isActive && (
                <div className="mt-1 mb-2">
                  {project.plans.map(plan => (
                    <div 
                      key={plan.id}
                      className={`sidebar-plan-item group text-[13px] text-[--color-text-secondary] cursor-pointer transition-all flex items-center justify-between relative hover:bg-[--color-hover] ${plan.id === state.activePlanId ? 'sidebar-plan-item-active' : ''}`}
                      onClick={() => setActivePlan(plan.id)}
                    >
                      <span className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                        {plan.title || 'Untitled Plan'}
                      </span>
                      {project.plans.length > 1 && (
                        <button 
                          className="opacity-0 bg-transparent border-none cursor-pointer text-[--color-text-tertiary] text-xs px-1 py-0.5 rounded transition-all shrink-0 leading-none group-hover:opacity-100 hover:text-[--color-text]"
                          onClick={(e) => confirmDelete(plan.id, false, e)}
                          title="Delete Plan"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    className="bg-transparent border-none cursor-pointer px-5 py-1.5 text-[13px] text-[--color-text-tertiary] text-left w-full transition-colors font-inherit hover:text-[--color-text-secondary] pl-10 mt-1"
                    onClick={() => addPlan(project.id)}
                  >
                    + New Plan
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-auto py-3 border-t border-[--color-border]">
        <button 
          className="bg-transparent border-none cursor-pointer px-5 py-2 text-[13px] text-[--color-text-tertiary] text-left w-full transition-colors font-inherit hover:text-[--color-text-secondary]"
          onClick={() => addProject('New Project')}
        >
          + New Project
        </button>
        <div className="sidebar-footer">
          <button
            className="bg-transparent border-none cursor-pointer px-5 py-1.5 text-[13px] text-[--color-text-tertiary] text-left w-full transition-colors font-inherit hover:text-[--color-text-secondary]"
            onClick={() => setSettingsOpen(true)}
          >
            ⚙ Settings
          </button>
          <button 
            className="bg-transparent border-none cursor-pointer px-5 py-1.5 text-[13px] text-[--color-text-tertiary] text-left w-full transition-colors font-inherit hover:text-[--color-text-secondary]"
            onClick={() => setIsTutorialOpen(true)}
          >
            ? Instructions
          </button>
        </div>
      </div>

      <Dialog.Root open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-[100]" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[--color-bg] rounded-[24px] p-8 min-w-[320px] shadow-lg z-[101]">
            <Dialog.Title className="text-lg font-bold mb-2 text-[--color-text]">
              Delete {itemToDelete?.isProject ? 'Project' : 'Plan'}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-[--color-text-secondary] mb-4">
              Are you sure you want to delete this {itemToDelete?.isProject ? 'project' : 'plan'}? This action cannot be undone.
            </Dialog.Description>
            <div className="flex gap-2 justify-end">
              <Dialog.Close className="px-5 py-2 rounded-[16px] text-[13px] font-inherit cursor-pointer border border-[--color-border] bg-[--color-bg] text-[--color-text] transition-colors hover:bg-[--color-surface]">
                Cancel
              </Dialog.Close>
              <button 
                className="px-5 py-2 rounded-[16px] text-[13px] font-inherit cursor-pointer border-none bg-red-500 text-white transition-opacity hover:opacity-90"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      <TutorialDialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
