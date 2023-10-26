
import { type Editor } from "../config"
import { configureEditorOptions, configureAliasOptions, configureTmuxOptions } from "./"

import { Separator } from "@inquirer/select"

export async function configureEditor(): Promise<Editor> {

  const editor_answer = await configureEditorOptions()
  new Separator()
  const alias = await configureAliasOptions()
  new Separator()
  const tmux_answer = await configureTmuxOptions()

  return {
    name: editor_answer,
    alias: alias,
    tmux: tmux_answer
  } as Editor
}
