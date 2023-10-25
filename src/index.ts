// import { ConfigManager} from "./config";
// import { Authenticate } from "./authenticate";
//
import select, { Separator } from '@inquirer/select'
import input from '@inquirer/input'

// import axios from 'axios'
import { type Editor } from './config'

(async function main() {
  // const cm = new ConfigManager()
  // const config = cm.getConfig()
  //
  // Authenticate(config, cm)

  // const repos = await getRepos()
  // const repoList: Array<string> = repos.repos.map((repo: { name: string }) => repo.name)
  // const transformData = repoList.map((repo: string) => ({
  //   name: repo,
  //   value: repo,
  //   description: repo
  // }))

  // repoTestListOptions(transformData)
  // const editorOptions = [
  //   'vim', 'neovim', 'vscode'
  // ].map((editor: string) => ({
  //   name: editor,
  //   value: editor,
  //   description: editor
  // }))
  // const cfg = configureEditor(editorOptions)
  // process.stdout.write(JSON.stringify(cfg))

  await Welcome()

})()


async function Welcome() {

  const letsGO = await select({
    message: 'Welcome back! What would you like to do?',
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
      }
    ]
  })

  if (letsGO === 'open') {
    // const repos = await getRepos()
    // const repoList: Array<string> = repos.repos.map((repo: { name: string }) => repo.name)
    // const transformData = repoList.map((repo: string) => ({
    //   name: repo,
    //   value: repo,
    //   description: repo
    // }))
    // repoTestListOptions(transformData)
    console.info({
      message: 'hey from open'
    })
  } else if (letsGO === 'update') {
    const editorOptions = [
      'vim', 'neovim', 'vscode'
    ].map((editor: string) => ({
      name: editor,
      value: editor,
      description: editor
    }))
    const cfg = await configureEditor(editorOptions)
    console.log(cfg)
  }

}

type OptionsType = {
  name: string,
  value: string,
  description: string
}

// async function repoTestListOptions(options: Array<OptionsType>): Promise<string> {
//   const answer = await select({
//     message: 'Select a repo',
//     pageSize: 8,
//     loop: true,
//     choices: options,
//   })
//   return answer
// }


async function configureEditor(options: Array<OptionsType>): Promise<Editor> {
  let alias = "" as string | boolean // probably should just make it a string type and parse it to boolean if the answer is no/false
  const editor_answer = await select({
    message: 'Select your preferred editor',
    choices: options
  })
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

      // add a followup question to show what they typed and ask if its correct
    })
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


  console.log({
    name: editor_answer,
    alias: alias,
    tmux: tmux_answer
  })
  return {
    name: editor_answer,
    alias: alias,
    tmux: tmux_answer
  } as Editor
}



// async function getRepos() {
//   const userResponse = await axios.get('https://api.github.com/user', { headers: { Authorization: `token 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` } })
//   const repos = await axios.get(userResponse.data.repos_url, { headers: { Authorization: `token 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` } })
//   return { repos: repos.data }
// }

