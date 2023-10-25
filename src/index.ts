import { ConfigManager, UserConfig } from "./config";
import { Authenticate } from "./authenticate";
import { Exit } from "./exit";
import { configureEditorOptions } from "./cli/editor_options";

import select, { Separator } from '@inquirer/select'
import input from '@inquirer/input'

import axios from 'axios'
import { type Editor } from './config'

(async function main() {
  const cm = new ConfigManager()
  const config = cm.getConfig()

  await Authenticate(config, cm)

  await Welcome(config)
})()


// ! ********************************************************************* ! //
//                                                                           //
// ! ********************************************************************* ! //


async function RepoSelection(options: Array<OptionsType>): Promise<string> {
  const answer = await select({
    message: 'Select a repo',
    pageSize: 8,
    loop: true,
    choices: options,
  })
  console.log({
    message: 'hey from repoTestListOptions',
    answer: answer
  })
  return answer
}


export async function Welcome(config: UserConfig) {

  const welcomeDialog = await select({
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
  })

  if (welcomeDialog === 'open') {
    const repos = await getRepos(config.user_profile.access_token)
    await RepoSelection(repos)
    console.info({
      message: 'hey from open'
    })
  } else if (welcomeDialog === 'update') {
    const cfg = await configureEditor()
    console.log(cfg)
  } else if (welcomeDialog === 'exit') {
    Exit()
  }
}



















type OptionsType = {
  name: string,
  value: string,
  description: string
}

type PartialRepo = {
  name: string,
  html_url: string,
  description: string
}

// const editorCfg = await configureEditorOptions(editorOpts)

async function configureEditor(): Promise<Editor> {
  let alias = "" as string | boolean // probably should just make it a string type and parse it to boolean if the answer is no/false
  // const editor_answer = await select({
  //   message: 'Select your preferred editor',
  //   choices: options
  // })
const editor_answer =  await configureEditorOptions()
  new Separator()
  const uses_alias = await select({
    message: 'Do you open your editor with an alias?',
    choices: [
      {
        name: 'Yes',
        value: true,
        description: 'v . ??- c . - nv . ^^- nvim . !!- code . ??? cool chad stuff like that'
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
  new Separator()
  const tmux_answer = await select({
    message: 'Will you be using tmux?',
    choices: [{
      name: 'Yes',
      value: true,
      description: 'Yes'
    }, {
      name: 'No',
      value: false,
      description: 'No'
    }]
  })

  return {
    name: editor_answer,
    alias: alias,
    tmux: tmux_answer
  } as Editor
}





// ! ********************************************************************* ! //
//                                                                           //
// ! ********************************************************************* ! //


async function getRepos(token: string): Promise<Array<OptionsType>> {
  const userResponse = await axios.get('https://api.github.com/user', {
    headers: { Authorization: `token ${token}` }
  })
  const repoResponse = await axios.get(userResponse.data.repos_url, {
    headers: { Authorization: `token ${token}` }
  })

  const repository_list = repoResponse.data.map((r: PartialRepo) => ({
    name: r.name,
    value: r.html_url,
    description: r.description
  }))

  return repository_list
}


