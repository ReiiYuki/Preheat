import { useState } from 'react';
import { useApp } from '@/modules/core/hooks/useAppState';
import { htmlToMarkdown } from '@/modules/markdown/utils/htmlToMarkdown';
import { downloadMarkdown } from '@/modules/markdown/utils/downloadMarkdown';
import { Tooltip } from '@base-ui/react/tooltip';
import { useTheme } from '@/modules/core/hooks/useTheme';

export function ActionButtons() {
  const { state } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  const activePlan = state.projects
    .flatMap((p) => p.plans)
    .find((plan) => plan.id === state.activePlanId) ?? null;

  if (!activePlan) return null;

  const handleDownload = () => {
    const markdown = `# ${activePlan.title || 'Untitled Plan'}\n\n${htmlToMarkdown(activePlan.content)}`;
    downloadMarkdown(activePlan.title || 'untitled', markdown);
  };

  const handleCopy = () => {
    const markdown = `# ${activePlan.title || 'Untitled Plan'}\n\n${htmlToMarkdown(activePlan.content)}`;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-8 right-8 flex gap-3">
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger 
            className="w-12 h-12 rounded-full bg-[--color-text] text-[--color-bg] border-none cursor-pointer flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-transform hover:scale-105 active:scale-95" 
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner sideOffset={8}>
              <Tooltip.Popup className="bg-[--color-text] text-[--color-bg] px-2.5 py-1 rounded-md text-xs whitespace-nowrap pointer-events-none">Toggle Theme</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger 
            className="w-12 h-12 rounded-full bg-[--color-text] text-[--color-bg] border-none cursor-pointer flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-transform hover:scale-105 active:scale-95" 
            onClick={handleCopy}
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            )}
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner sideOffset={8}>
              <Tooltip.Popup className="bg-[--color-text] text-[--color-bg] px-2.5 py-1 rounded-md text-xs whitespace-nowrap pointer-events-none">Copy Markdown</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger 
            className="w-12 h-12 rounded-full bg-[--color-text] text-[--color-bg] border-none cursor-pointer flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-transform hover:scale-105 active:scale-95" 
            onClick={handleDownload}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner sideOffset={8}>
              <Tooltip.Popup className="bg-[--color-text] text-[--color-bg] px-2.5 py-1 rounded-md text-xs whitespace-nowrap pointer-events-none">
                Download as .md
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>

      </Tooltip.Provider>
    </div>
  );
}
