import { rando } from '../helpers/rando'

import { select } from "@inquirer/prompts"


type EditorOptions = {
  name: string,
  value: string,
  description: string
}

const vimDescriptionOptions = [
  `Vim is a highly efficient and configurable text editor known for its modal editing system and extensive keyboard shortcuts.`,
  `Vim is like the Rubik's Cube of text editors – perplexing at first, but once you figure it out, you'll feel like a wizard.`,
  `If you're into memorizing cryptic key combinations and enjoy feeling like you're trapped in the '80s, Vim might be your text editor of choice.`
]

const neovimDescriptionOptions = [
  `Neovim is a modernized and extended version of Vim, designed to be more extensible and maintainable while retaining Vim's core features and compatibility.`,
  `Neovim is like Vim's hipster cousin – it does all the same things but claims it was doing them before they were cool.`,
  `Does your linked in say "open to work" and you spend all day watching thePrimeagen?`
  // `Neovim is like Vim, but for people who don't like Vim.`,
]

const vscodeDescriptionOptions = [
  `Visual Studio Code (VSCode) is a code editor that caters to those who enjoy a more visually cluttered and resource-intensive development environment.`,
  `Visual Studio Code (VSCode) is a code editor for people who prefer a user-friendly, feature-rich, and less keyboard-driven development experience.`,
  `Visual Studio Code (VSCode) is like Vim's younger sibling – it's not as powerful, but it's easier to use and more fun to play with.`
]

const editorOpts = [
  {
    name: 'vim',
    value: 'vim',
    description: vimDescriptionOptions[rando()]
  },
  {
    name: 'neovim',
    value: 'neovim',
    description: neovimDescriptionOptions[rando()]
  },
  {
    name: 'vscode',
    value: 'vscode',
    description: vscodeDescriptionOptions[rando()]
  }
] satisfies Array<EditorOptions>

export async function configureEditorOptions(options: Array<EditorOptions> = editorOpts): Promise<string> {
  const answer = await select({
    message: 'Select your preferred editor',
    choices: options
  })
  return answer
}

