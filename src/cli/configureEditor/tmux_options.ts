import { select } from "@inquirer/prompts"
import { rando } from "../../utils/rando"




const tmuxDescriptionOptions = [
  "Tmux is a powerful terminal multiplexer that enables efficient session management, allowing you to create and switch between multiple terminal panes and windows.",
  "Tmux is like the command-line's Swiss Army knife, where you can slice, dice, and juggle your terminal tasks with finesse.",
  "Tmux is for devs that enjoy fumbling through multiple terminal windows and never knowing which one has your code."
]


export async function configureTmuxOptions() {

  const tmux_answer = await select({
    message: 'Will you be using tmux?',
    choices: [{
      name: 'Yes',
      value: true,
      description: tmuxDescriptionOptions[rando()],
    }, {
      name: 'No',
      value: false,
      description: tmuxDescriptionOptions[rando()],
    }]
  })
  return tmux_answer
}


