import { spawn } from "child_process";
import { ConfigManager, type UserConfig } from "../ConfigManager";
import { authenticateWithGithub } from "./authenticateWithGithub";

export async function authenticate(config: UserConfig, cm: ConfigManager): Promise<void> {
  if (config.user_profile.access_token === "") {
    const serverProcess = spawn('node', ['src/server.ts']);
    await authenticateWithGithub(cm)
    serverProcess.on('exit', (code, signal) => (code && signal))
    await cm.revalidateConfig()
  } else {
    process.stdout.write("verified\n")
  }
}


