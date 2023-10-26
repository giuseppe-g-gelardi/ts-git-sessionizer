
import { select } from "@inquirer/prompts"


type WelcomeDialogOptions = "open" | "update" | "exit"

export async function welcomeDialog(): Promise<WelcomeDialogOptions> {
  return await select({
    message: 'Welcome! What would you like to do?',
    choices: [
      {
        name: 'Open a repo', // -> lets get started
        value: 'open',
        description: 'Open one of my repos'
      },
      {
        name: 'Update my config',
        value: 'update',
        description: 'Update my configuration options'
      },
      {
        name: 'Exit',
        value: 'exit',
        description: 'Exit the program'
      }
    ]
  }) as WelcomeDialogOptions
}
