
import { ConfigManager } from "../../ConfigManager"
import { configureEditorOptions, configureAliasOptions, configureTmuxOptions, initCli } from ".."

import select, { Separator } from "@inquirer/select"

export async function configureEditor(cm: ConfigManager): Promise<void> {

  const editor_answer = await configureEditorOptions(); new Separator();
  const alias = await configureAliasOptions(); new Separator();
  const tmux_answer = await configureTmuxOptions();

  const cfg = cm.getConfig()
  cm.writeConfig({
    ...cfg, editor: {
      ...cfg.editor,
      name: editor_answer,
      alias: alias,
      tmux: tmux_answer
    }
  })

  await confirmEditorOptions(editor_answer, alias, tmux_answer, cm)
}

async function confirmEditorOptions(
  editor: string, alias: string | boolean, tmux: boolean, cm: ConfigManager
): Promise<void> {


  const editorOpts = [
    {
      name: 'LGTM!',
      value: true,
      description: 'save these options'
    },
    {
      name: 'I want to change something',
      value: false,
      description: 'go back to the editor options'
    },
  ]

  const msg = JSON.stringify({
    editor: editor,
    alias: alias,
    tmux: tmux
  }, null, 2)

  const answer = await select({
    message: msg,
    choices: editorOpts
  }) as boolean

  if (!answer) {
    await configureEditor(cm)
  }


  const cfg = cm.getConfig()
  await initCli(cfg, cm)
}


