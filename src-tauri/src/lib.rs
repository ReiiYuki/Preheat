use tauri::Manager;
use tauri_plugin_shell::ShellExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_autostart::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            
            // Spawn the MCP Server using the bundled resource
            if let Ok(resource_path) = app.path().resolve("mcp-server.cjs", tauri::path::BaseDirectory::Resource) {
                if let Some(path_str) = resource_path.to_str() {
                    let _ = app.shell()
                        .command("node")
                        .args([path_str])
                        .spawn()
                        .map_err(|e| log::error!("Failed to spawn MCP server: {}", e));
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
