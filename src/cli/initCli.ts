import { type UserConfig, ConfigManager } from "../config"
import { Exit } from "../exit"
import { WelcomeDialog, repoSelection, configureEditor } from './'


export async function initCli(config: UserConfig, cm: ConfigManager) {
  const welcomeDialog = await WelcomeDialog()

  if (welcomeDialog === 'open') {
    await repoSelection(config.user_profile.access_token)
  } else if (welcomeDialog === 'update') {
    await configureEditor(cm)
  } else if (welcomeDialog === 'exit') {
    Exit()
  }
}
