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

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="settings-dialog-backdrop" />
        <Dialog.Popup className="settings-dialog-popup">
          <Dialog.Title className="settings-dialog-title">Settings</Dialog.Title>
          <div className="settings-dialog-content">
            <div className="settings-row">
              <div className="settings-info">
                <h4>Local MCP Server Sync</h4>
                <p>
                  Sync your data to the local file system for external AI agents (like Claude Desktop or Cursor) to read and edit.
                </p>
                <a href="https://github.com/ReiiYuki/Preheat/tree/master/mcp-server" target="_blank" rel="noreferrer">
                  View MCP Server Instructions
                </a>
              </div>
              <Switch.Root
                className="settings-switch"
                checked={!!state.mcpEnabled}
                onCheckedChange={toggleMcpEnabled}
              >
                <Switch.Thumb className="settings-switch-thumb" />
              </Switch.Root>
            </div>
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
