import { exit } from "process"
import { type UserConfig, ConfigManager } from "../ConfigManager"
import { configureEditor } from "./configureEditor/configureEditor"
import { repoSelection } from "./selectRepo/repoSelection"
import { welcomeDialog } from "./welcomeDialog"

export async function initCli(config: UserConfig, cm: ConfigManager) {
  console.clear()
  const welcome = await welcomeDialog()

  if (welcome === 'open') {
    await repoSelection(config.access_token, cm)
  } else if (welcome === 'update') {
    await configureEditor(cm)
  } else if (welcome === 'exit') {
    exit()
  }
}
