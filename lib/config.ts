import fs from "fs"
import path from "path"

interface GlobalConfig {
  apiUrl: string
  // Add other config properties as needed
}

let globalConfig: GlobalConfig | null = null

export function loadGlobalConfig(): GlobalConfig {
  if (globalConfig) {
    return globalConfig
  }

  const defaultConfig: GlobalConfig = {
    apiUrl: "https://api.example.com",
    // Add other default values as needed
  }

  try {
    // First, try to load from the root directory
    const rootConfigPath = path.join(process.cwd(), "config.json")
    if (fs.existsSync(rootConfigPath)) {
      const configData = fs.readFileSync(rootConfigPath, "utf8")
      globalConfig = { ...defaultConfig, ...JSON.parse(configData) }
      return globalConfig
    }

    // If not found in root, try to load from the lib directory
    const libConfigPath = path.join(__dirname, "config.json")
    if (fs.existsSync(libConfigPath)) {
      const configData = fs.readFileSync(libConfigPath, "utf8")
      globalConfig = { ...defaultConfig, ...JSON.parse(configData) }
      return globalConfig
    }

    // If still not found, use default values
    console.warn("Config file not found. Using default values.")
    return defaultConfig
  } catch (error) {
    console.error("Failed to load global config:", error)
    return defaultConfig
  }
}

