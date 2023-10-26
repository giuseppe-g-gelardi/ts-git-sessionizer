
import { ConfigManager, type Editor } from "../config"
import { configureEditorOptions, configureAliasOptions, configureTmuxOptions } from "./"

import { Separator } from "@inquirer/select"

export async function configureEditor(cm: ConfigManager): Promise<Editor> {

  const editor_answer = await configureEditorOptions()
  new Separator()
  const alias = await configureAliasOptions()
  new Separator()
  const tmux_answer = await configureTmuxOptions()

  const cfg = cm.getConfig()
  cm.writeConfig({
    ...cfg, editor: {
      ...cfg.editor,
      name: editor_answer,
      alias: alias,
      tmux: tmux_answer
    }
  })

  return {
    name: editor_answer,
    alias: alias,
    tmux: tmux_answer
  } as Editor
}
