

import { ConfigManager, type UserConfig } from "../ConfigManager";
import { authenticateWithGithub } from ".";
import { initCli } from "../cli";

export async function authenticate(config: UserConfig, cm: ConfigManager): Promise<void> {
  if (config.user_profile.access_token === "") {
    await authenticateWithGithub(cm)
    await cm.revalidateConfig()
    const updatedConfig = await cm.getConfig()
    await initCli(updatedConfig, cm)
  } else {
    process.stdout.write("verified\n")
  }
}


