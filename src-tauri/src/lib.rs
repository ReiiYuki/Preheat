use std::sync::Mutex;
use tauri::{AppHandle, Manager, State};
use tauri_plugin_shell::{process::CommandChild, ShellExt};

struct McpState {
    child: Mutex<Option<CommandChild>>,
}

#[tauri::command]
fn start_mcp_server(app: AppHandle, state: State<'_, McpState>) -> Result<String, String> {
    if let Ok(resource_path) = app.path().resolve("mcp-server.cjs", tauri::path::BaseDirectory::Resource) {
        if let Some(path_str) = resource_path.to_str() {
            match app.shell().command("node").args([path_str]).spawn() {
                Ok((_rx, child)) => {
                    let mut lock = state.child.lock().unwrap();
                    if let Some(old_child) = lock.take() {
                        let _ = old_child.kill();
                    }
                    *lock = Some(child);
                    return Ok("Started".into());
                }
                Err(e) => {
                    log::error!("Failed to spawn MCP server: {}", e);
                    return Err(format!("Failed to start: {}", e));
                }
            }
        }
    }
    Err("Could not resolve resource path".into())
}

#[tauri::command]
fn stop_mcp_server(state: State<'_, McpState>) -> Result<String, String> {
    let mut lock = state.child.lock().unwrap();
    if let Some(child) = lock.take() {
        let _ = child.kill();
        return Ok("Stopped".into());
    }
    Ok("Already stopped".into())
}

#[tauri::command]
fn restart_mcp_server(app: AppHandle, state: State<'_, McpState>) -> Result<String, String> {
    let _ = stop_mcp_server(state.clone());
    start_mcp_server(app, state)
}

#[tauri::command]
fn get_mcp_status(state: State<'_, McpState>) -> Result<bool, String> {
    let lock = state.child.lock().unwrap();
    Ok(lock.is_some())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_autostart::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .manage(McpState {
            child: Mutex::new(None),
        })
        .invoke_handler(tauri::generate_handler![
            start_mcp_server,
            stop_mcp_server,
            restart_mcp_server,
            get_mcp_status
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            
            // Initial spawn
            let state = app.state::<McpState>();
            let _ = start_mcp_server(app.handle().clone(), state);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
