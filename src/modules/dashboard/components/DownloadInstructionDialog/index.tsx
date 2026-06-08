import { Dialog } from '@base-ui/react/dialog';

interface DownloadInstructionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: 'mac' | 'windows' | 'linux' | null;
}

export function DownloadInstructionDialog({ open, onOpenChange, platform }: DownloadInstructionDialogProps) {
  if (!platform) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-[100]" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[--color-bg] rounded-[24px] p-8 min-w-[400px] max-w-[500px] shadow-lg z-[101]">
          <Dialog.Title className="text-xl font-bold mb-4 text-[--color-text]">
            Installation Instructions
          </Dialog.Title>
          <div className="text-[14px] text-[--color-text-secondary] flex flex-col gap-4 mb-6">
            <p>Your download will begin shortly.</p>
            
            {platform === 'mac' && (
              <div className="bg-[--color-surface] p-4 rounded-xl border border-yellow-500/30">
                <h3 className="font-semibold text-yellow-500 mb-2">⚠️ "App cannot be opened" Error</h3>
                <p className="mb-2">Because Preheat is open-source, macOS Gatekeeper may block the app. To open it:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Open <strong>Finder</strong> and go to <strong>Applications</strong>.</li>
                  <li><strong>Right-click</strong> (or Control+Click) on the Preheat app.</li>
                  <li>Click <strong>Open</strong> from the menu.</li>
                  <li>Click the <strong>Open</strong> button in the warning dialog.</li>
                </ol>
              </div>
            )}

            {platform === 'windows' && (
              <div className="bg-[--color-surface] p-4 rounded-xl border border-yellow-500/30">
                <h3 className="font-semibold text-yellow-500 mb-2">⚠️ "Windows protected your PC"</h3>
                <p className="mb-2">Microsoft SmartScreen might show a warning since this is a new app. To install:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Click <strong>More info</strong> on the blue dialog.</li>
                  <li>Click the <strong>Run anyway</strong> button.</li>
                </ol>
              </div>
            )}

            {platform === 'linux' && (
              <div className="bg-[--color-surface] p-4 rounded-xl border border-blue-500/30">
                <h3 className="font-semibold text-blue-500 mb-2">ℹ️ AppImage Setup</h3>
                <p className="mb-2">To run the downloaded AppImage:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Right-click the file and go to <strong>Properties</strong>.</li>
                  <li>Under Permissions, check <strong>Allow executing file as program</strong>.</li>
                  <li>Double-click to run! (Or run <code>chmod +x filename</code> in terminal).</li>
                </ol>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Dialog.Close className="px-5 py-2 rounded-[16px] text-[13px] font-inherit cursor-pointer border-none bg-[var(--color-primary)] text-white transition-opacity hover:opacity-90 font-medium shadow-sm">
              Got it
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
