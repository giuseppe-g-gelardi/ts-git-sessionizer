import { type UserConfig, ConfigManager } from "../ConfigManager"
import { exit } from "../utils"
import { welcomeDialog, repoSelection, configureEditor } from './'

export async function initCli(config: UserConfig, cm: ConfigManager) {
  console.clear()
  const welcome = await welcomeDialog()

  if (welcome === 'open') {
    await repoSelection(config.user_profile.access_token, cm)
  } else if (welcome === 'update') {
    await configureEditor(cm)
  } else if (welcome === 'exit') {
    exit()
  }
}
