import { select } from "@inquirer/prompts"
import { input } from "@inquirer/prompts"




export async function configureAliasOptions() {
  let alias = "" as string | boolean // probably should just make it a string type and parse it to boolean if the answer is no/false
  const uses_alias = await select({
    message: 'Do you open your editor with an alias?',
    choices: [
      {
        name: 'Yes',
        value: true,
        description: `An editor alias is a shorthand or custom command used in software development to quickly invoke a specific text editor or integrated development environment (IDE) with predefined settings or options.`
      }, {
        name: 'No',
        value: false,
        description: 'No, I open with the standard command'
      }
    ]
  })
  if (uses_alias === true) {
    alias = await input({
      message: 'What is your editors alias?',
    }) // add a followup question to show what they typed and ask if its correct
  } else if (uses_alias === false) {
    alias = false
  }
  return alias
}
