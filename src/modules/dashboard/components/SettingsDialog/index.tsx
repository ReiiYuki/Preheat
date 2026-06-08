import { useState, useEffect } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { Switch } from '@base-ui/react/switch';
import { useApp } from '@/modules/core/hooks/useAppState';
import './SettingsDialog.css';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { state, toggleMcpEnabled } = useApp();

  const [showInstructions, setShowInstructions] = useState(false);
  const [autostartEnabled, setAutostartEnabled] = useState(false);
  const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

  useEffect(() => {
    if (isTauri && open) {
      import('@tauri-apps/plugin-autostart').then((autostart) => {
        autostart.isEnabled().then(setAutostartEnabled).catch(console.error);
      }).catch(console.error);
    }
  }, [isTauri, open]);

  const toggleAutostart = async (checked: boolean) => {
    if (isTauri) {
      try {
        const autostart = await import('@tauri-apps/plugin-autostart');
        if (checked) {
          await autostart.enable();
        } else {
          await autostart.disable();
        }
        setAutostartEnabled(await autostart.isEnabled());
      } catch (err) {
        console.error('Failed to toggle autostart', err);
      }
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="settings-dialog-backdrop" />
        <Dialog.Popup className="settings-dialog-popup">
          <Dialog.Title className="settings-dialog-title">Settings</Dialog.Title>
          <div className="settings-dialog-content">
            
            {isTauri && (
              <div className="settings-row mb-4">
                <div className="settings-info">
                  <h4>Launch on Startup</h4>
                  <p>
                    Automatically start Preheat when you log into your computer.
                  </p>
                </div>
                <Switch.Root
                  className="settings-switch"
                  checked={autostartEnabled}
                  onCheckedChange={toggleAutostart}
                >
                  <Switch.Thumb className="settings-switch-thumb" />
                </Switch.Root>
              </div>
            )}

            <div className="settings-row">
              <div className="settings-info">
                <h4>Local MCP Server Sync</h4>
                <p>
                  Sync your data to the local file system for external AI agents (like Claude Desktop or Cursor) to read and edit.
                </p>
                <button 
                  className="settings-link-btn"
                  onClick={() => setShowInstructions(!showInstructions)}
                >
                  {showInstructions ? 'Hide MCP Server Instructions' : 'View MCP Server Instructions'}
                </button>
              </div>
              <Switch.Root
                className="settings-switch"
                checked={!!state.mcpEnabled}
                onCheckedChange={toggleMcpEnabled}
              >
                <Switch.Thumb className="settings-switch-thumb" />
              </Switch.Root>
            </div>
            
            {showInstructions && (
              <div className="settings-instructions">
                <h5>How to configure your Agent</h5>
                <ol>
                  <li>Ensure the toggle above is <strong>turned on</strong>.</li>
                  <li>In your AI agent's config (e.g. <code>claude_desktop_config.json</code>), add the following:</li>
                </ol>
                <pre><code>{`{
  "mcpServers": {
    "preheat": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/Preheat/mcp-server/index.ts"]
    }
  }
}`}</code></pre>
                <p className="settings-instructions-note">
                  * Replace <code>/absolute/path/to/Preheat</code> with the path to the Preheat repository.
                </p>
              </div>
            )}
          </div>
          <div className="settings-dialog-actions">
            <Dialog.Close className="settings-dialog-btn settings-dialog-btn-primary">
              Done
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
