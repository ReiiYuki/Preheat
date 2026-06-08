import { useState, useEffect } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { Switch } from '@base-ui/react/switch';
import { useApp } from '@/modules/core/hooks/useAppState';
interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { state, toggleMcpEnabled, setSyncProvider, setWebhookUrl, setFirebaseConfig, setSupabaseConfig } = useApp();

  const CodeBlock = ({ code }: { code: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    return (
      <div className="relative group">
        <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-xl text-[13px] overflow-x-auto select-text selection:bg-[#8b5cf6]/40 font-mono leading-relaxed border border-[#2a2a2a] shadow-inner mb-2">
          <code>{code}</code>
        </pre>
        <button 
          onClick={handleCopy}
          className="absolute top-2 right-2 bg-[#2d2d2d] hover:bg-[#3d3d3d] border border-[#4d4d4d] text-white p-2 rounded-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-md active:scale-95"
          title="Copy code"
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          )}
        </button>
      </div>
    );
  };

  const [showInstructions, setShowInstructions] = useState(false);
  const [autostartEnabled, setAutostartEnabled] = useState(false);
  const [mcpPath, setMcpPath] = useState('');
  const [mcpStatus, setMcpStatus] = useState<boolean>(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

  useEffect(() => {
    if (isTauri && open) {
      import('@tauri-apps/plugin-autostart').then((autostart) => {
        autostart.isEnabled().then(setAutostartEnabled).catch(console.error);
      }).catch(console.error);

      import('@tauri-apps/api/path').then(({ resourceDir, join }) => {
        resourceDir().then(dir => join(dir, 'mcp-server.cjs')).then(setMcpPath).catch(console.error);
      }).catch(console.error);

      import('@tauri-apps/api/core').then(({ invoke }) => {
        invoke('get_mcp_status').then((status) => setMcpStatus(status as boolean)).catch(console.error);
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

  const handleToggleMcpEnabled = async (checked: boolean) => {
    toggleMcpEnabled();
    if (isTauri) {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        if (checked) {
          await invoke('start_mcp_server');
          setMcpStatus(true);
        } else {
          await invoke('stop_mcp_server');
          setMcpStatus(false);
        }
      } catch (err) {
        console.error('Failed to toggle MCP server', err);
      }
    }
  };

  const restartMcpServer = async () => {
    if (!isTauri) return;
    setIsRestarting(true);
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('restart_mcp_server');
      setMcpStatus(true);
    } catch (err) {
      console.error('Failed to restart MCP server', err);
      setMcpStatus(false);
    } finally {
      setTimeout(() => setIsRestarting(false), 500);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[100]" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[--color-bg] rounded-[24px] p-8 w-[90%] max-w-[480px] max-h-[90vh] overflow-y-auto shadow-[var(--shadow-lg)] z-[101]">
          <Dialog.Title className="text-xl font-bold mb-6 text-[--color-text]">Settings</Dialog.Title>
          <div className="mb-8 flex flex-col gap-4">
            
            <div className="flex flex-col gap-4 p-4 bg-[--color-surface] rounded-2xl">
              <div>
                <h4 className="text-base font-semibold mb-1">Cloud Synchronization</h4>
                <p className="text-sm text-[--color-text-secondary] mb-2 leading-relaxed">
                  Automatically sync your data to an external service.
                </p>
              </div>
              
              <select 
                className="w-full bg-[--color-bg] border border-[--color-border] rounded-xl px-4 py-3 text-[14px] text-[--color-text] focus:outline-none focus:border-[#8b5cf6] transition-colors appearance-none cursor-pointer hover:border-[--color-text-tertiary]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23a3a3a3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                  paddingRight: '48px'
                }}
                value={state.syncProvider || 'none'}
                onChange={(e) => setSyncProvider(e.target.value as any)}
              >
                <option value="none">None</option>
                <option value="webhook">Webhook</option>
                <option value="firebase">Firebase Realtime Database</option>
                <option value="supabase">Supabase</option>
              </select>

              {state.syncProvider === 'webhook' && (
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wider">Webhook URL</label>
                  <input 
                    type="url" 
                    placeholder="https://your-webhook.com/api/sync"
                    className="w-full bg-[--color-bg] border border-[--color-border] rounded-xl px-4 py-3 text-[14px] text-[--color-text] focus:outline-none focus:border-[#8b5cf6] transition-colors"
                    value={state.webhookSyncUrl || ''}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                  <div className="mt-2 text-xs text-[--color-text-tertiary]">
                    <details>
                      <summary className="cursor-pointer hover:text-[--color-text] transition-colors outline-none font-medium mb-2">View Example Sync Data Payload</summary>
                      <CodeBlock code={`{
  "user": { "name": "Test User" },
  "projects": [
    {
      "id": "proj_1",
      "name": "My Project",
      "createdAt": 1718300000000,
      "plans": []
    }
  ],
  "activeProjectId": "proj_1",
  "activePlanId": null,
  "syncProvider": "webhook"
}`} />
                    </details>
                  </div>
                </div>
              )}

              {state.syncProvider === 'firebase' && (
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wider">Firebase Config JSON</label>
                  <textarea 
                    placeholder={'{\n  "apiKey": "...",\n  "authDomain": "...",\n  "databaseURL": "...",\n  "projectId": "..."\n}'}
                    className="w-full bg-[--color-bg] border border-[--color-border] rounded-xl px-4 py-3 text-[13px] font-mono text-[--color-text] focus:outline-none focus:border-[#8b5cf6] transition-colors min-h-[120px] resize-y"
                    value={state.firebaseConfig || ''}
                    onChange={(e) => setFirebaseConfig(e.target.value)}
                  />
                  <p className="text-xs text-[--color-text-tertiary]">
                    Paste your Firebase Web App configuration object. Requires Realtime Database to be enabled.
                  </p>
                </div>
              )}

              {state.syncProvider === 'supabase' && (
                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wider">Supabase Project URL</label>
                    <input 
                      type="url" 
                      placeholder="https://xyzcompany.supabase.co"
                      className="w-full bg-[--color-bg] border border-[--color-border] rounded-xl px-4 py-3 text-[14px] text-[--color-text] focus:outline-none focus:border-[#8b5cf6] transition-colors"
                      value={state.supabaseConfig?.url || ''}
                      onChange={(e) => setSupabaseConfig({ ...state.supabaseConfig, url: e.target.value, anonKey: state.supabaseConfig?.anonKey || '' })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wider">Supabase Anon Key</label>
                    <input 
                      type="password" 
                      placeholder="eyJhbG..."
                      className="w-full bg-[--color-bg] border border-[--color-border] rounded-xl px-4 py-3 text-[14px] text-[--color-text] focus:outline-none focus:border-[#8b5cf6] transition-colors"
                      value={state.supabaseConfig?.anonKey || ''}
                      onChange={(e) => setSupabaseConfig({ ...state.supabaseConfig, anonKey: e.target.value, url: state.supabaseConfig?.url || '' })}
                    />
                  </div>
                  <p className="text-xs text-[--color-text-tertiary]">
                    You must create a table named <code>preheat_state</code> with columns <code>id</code> (text, primary key) and <code>state_data</code> (jsonb).
                  </p>
                </div>
              )}
            </div>
            {isTauri && (
              <div className="flex items-center justify-between gap-6 p-4 bg-[--color-surface] rounded-2xl">
                <div>
                  <h4 className="text-base font-semibold mb-1">Launch on Startup</h4>
                  <p className="text-sm text-[--color-text-secondary] mb-2 leading-relaxed">
                    Automatically start Preheat when you log into your computer.
                  </p>
                </div>
                <Switch.Root
                  className="group flex items-center w-[44px] h-[24px] rounded-full bg-[--color-border] relative border-none cursor-pointer transition-colors shrink-0 data-[checked]:![background:var(--gradient-primary)]"
                  checked={autostartEnabled}
                  onCheckedChange={toggleAutostart}
                >
                  <Switch.Thumb className="block w-[20px] h-[20px] bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform translate-x-[2px] group-data-[checked]:translate-x-[22px]" />
                </Switch.Root>
              </div>
            )}

            {isTauri && (
              <>
                <div className="flex items-center justify-between gap-6 p-4 bg-[--color-surface] rounded-2xl">
                  <div>
                    <h4 className="text-base font-semibold mb-1">Local MCP Server Sync</h4>
                    <p className="text-sm text-[--color-text-secondary] mb-2 leading-relaxed">
                      Sync your data to the local file system for external AI agents to read and edit.
                    </p>
                    <button 
                      className="bg-transparent border-none p-0 text-[13px] text-[#8b5cf6] underline cursor-pointer font-inherit"
                      onClick={() => setShowInstructions(!showInstructions)}
                    >
                      {showInstructions ? 'Hide MCP Server Instructions' : 'View MCP Server Instructions'}
                    </button>
                    {!!state.mcpEnabled && (
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1.5 bg-[#1e1e1e] border border-[#2a2a2a] px-2 py-1 rounded-md">
                          <div className={`w-2 h-2 rounded-full ${mcpStatus ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]'}`} />
                          <span className="text-[11px] text-[--color-text-secondary] uppercase tracking-wider font-semibold">
                            {mcpStatus ? 'Running' : 'Stopped'}
                          </span>
                        </div>
                        <button 
                          className={`bg-[#2d2d2d] hover:bg-[#3d3d3d] border border-[#4d4d4d] text-white px-2 py-1 rounded-md text-[11px] font-medium cursor-pointer transition-colors active:scale-95 ${isRestarting ? 'opacity-50 pointer-events-none' : ''}`}
                          onClick={restartMcpServer}
                        >
                          {isRestarting ? 'Restarting...' : 'Restart Server'}
                        </button>
                      </div>
                    )}
                  </div>
                  <Switch.Root
                    className="group flex items-center w-[44px] h-[24px] rounded-full bg-[--color-border] relative border-none cursor-pointer transition-colors shrink-0 data-[checked]:![background:var(--gradient-primary)]"
                    checked={!!state.mcpEnabled}
                    onCheckedChange={handleToggleMcpEnabled}
                  >
                    <Switch.Thumb className="block w-[20px] h-[20px] bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform translate-x-[2px] group-data-[checked]:translate-x-[22px]" />
                  </Switch.Root>
                </div>
                
                {showInstructions && (
                  <div className="mt-4 p-4 bg-[--color-surface] rounded-2xl border border-[--color-border]">
                    <h5 className="text-[15px] font-semibold mb-2 text-[--color-text]">How to configure your Agent</h5>
                    <ol className="ml-5 mb-3 text-sm text-[--color-text-secondary] leading-relaxed">
                      <li>Ensure the toggle above is <strong>turned on</strong>.</li>
                      
                      <div className="mt-4 mb-2 text-[--color-text]"><strong>For Agents supporting SSE (Server-Sent Events):</strong></div>
                      <p className="text-sm text-[--color-text-secondary] mb-3">
                        Add the following to your agent's config (e.g. <code>mcp.json</code>):
                      </p>
                      <CodeBlock code={`{
  "mcpServers": {
    "preheat": {
      "type": "sse",
      "url": "http://localhost:4710/sse"
    }
  }
}`} />

                      <div className="mt-5 mb-2 text-[--color-text]"><strong>For Agents requiring STDIO (Standard I/O):</strong></div>
                      <p className="text-sm text-[--color-text-secondary] mb-3">
                        Add the following to your agent's config:
                      </p>
                      <CodeBlock code={`{
  "mcpServers": {
    "preheat": {
      "command": "node",
      "args": [
        "${mcpPath || '<ABSOLUTE_PATH_TO_PREHEAT_MCP_SERVER_CJS>'}",
        "--stdio"
      ]
    }
  }
}`} />
                      {!mcpPath && (
                        <p className="text-[11px] text-yellow-500 mt-1 mb-3">
                          ⚠️ Please replace <code>&lt;ABSOLUTE_PATH_...&gt;</code> with the actual absolute path to the <code>mcp-server.cjs</code> file on your computer.
                        </p>
                      )}
                    </ol>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex justify-end">
            <Dialog.Close className="px-6 py-2.5 rounded-2xl text-[15px] font-medium cursor-pointer border-none transition-all active:scale-98 bg-[var(--gradient-primary)] text-white hover:opacity-90">
              Done
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
