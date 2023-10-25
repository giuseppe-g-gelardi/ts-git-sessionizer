import { spawn } from "child_process";
import { ConfigManager, type UserConfig } from "./config";
import { authorizationWithGithub } from "./server";

export async function Authenticate(config: UserConfig, cm: ConfigManager): Promise<void> {
  if (config.user_profile.access_token === "") {
    const serverProcess = spawn('node', ['src/server.ts']);
    await authorizationWithGithub(cm)
    serverProcess.on('exit', (code, signal) => (code && signal))
    await cm.revalidateConfig()
  } else {
    process.stdout.write("verified\n")
  }
}


