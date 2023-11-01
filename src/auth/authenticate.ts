

import { ConfigManager, type UserConfig } from "../ConfigManager";
import { initCli } from "../cli/initCli";
import { authenticateWithGithub } from "./authenticateWithGithub";

export async function authenticate(config: UserConfig, cm: ConfigManager): Promise<void> {
  if (config.access_token === "") {
    await authenticateWithGithub(cm)
    await cm.revalidateConfig()
    const updatedConfig = await cm.getConfig()
    await initCli(updatedConfig, cm)
  } else {
    process.stdout.write("verified\n")
  }
}


