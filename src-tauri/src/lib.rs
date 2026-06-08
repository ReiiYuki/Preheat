use std::sync::Mutex;
use tauri::{
    AppHandle, Manager, RunEvent, State, WindowEvent,
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};
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
    let app = tauri::Builder::default()
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

            // Build tray menu
            let show_i = MenuItem::with_id(app, "show", "Show Preheat", true, None::<&str>)?;
            let hide_i = MenuItem::with_id(app, "hide", "Hide Preheat", true, None::<&str>)?;
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_i, &hide_i, &quit_i])?;

            // Build tray icon
            let _tray = TrayIconBuilder::with_id("main-tray")
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .tooltip("Preheat")
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "hide" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.hide();
                        }
                    }
                    "quit" => {
                        // Kill MCP server before exiting
                        let state = app.state::<McpState>();
                        let mut lock = state.child.lock().unwrap();
                        if let Some(child) = lock.take() {
                            let _ = child.kill();
                        }
                        app.exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            if window.is_visible().unwrap_or(false) {
                                let _ = window.hide();
                            } else {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                    }
                })
                .build(app)?;

            // Initial spawn of MCP server
            let state = app.state::<McpState>();
            let _ = start_mcp_server(app.handle().clone(), state);

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|app_handle, event| {
        match event {
            RunEvent::WindowEvent {
                event: WindowEvent::CloseRequested { api, .. },
                label,
                ..
            } => {
                // Prevent the window from closing; hide it instead
                api.prevent_close();
                if let Some(window) = app_handle.get_webview_window(&label) {
                    let _ = window.hide();
                }
            }
            _ => {}
        }
    });
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mcp_state_initialization() {
        let state = McpState {
            child: Mutex::new(None),
        };
        
        let lock = state.child.lock().unwrap();
        assert!(lock.is_none(), "McpState should initialize with no child process");
    }
}
