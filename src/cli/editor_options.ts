import { select } from "@inquirer/prompts"


type EditorOptions = {
  name: string,
  value: string,
  description: string
}

const editorOpts = [
  {
    name: 'vim',
    value: 'vim',
    description: 'Vim is a highly efficient and configurable text editor known for its modal editing system and extensive keyboard shortcuts.'
  },
  {
    name: 'neovim',
    value: 'neovim',
    description: `Neovim is a modernized and extended version of Vim, designed to be more extensible and maintainable while retaining Vim's core features and compatibility.`
  },
  {
    name: 'vscode',
    value: 'vscode',
    // description: `Visual Studio Code (VSCode) is a code editor for people who prefer a user-friendly, feature-rich, and less keyboard-driven development experience.`
    description: `Visual Studio Code (VSCode) is a code editor that caters to those who enjoy a more visually cluttered and resource-intensive development environment.`
  // hehe
  }
] satisfies Array<EditorOptions>

export async function configureEditorOptions(options: Array<EditorOptions> = editorOpts): Promise<string> {
  const answer = await select({
    message: 'Select your preferred editor',
    choices: options
  })
  return answer
}
