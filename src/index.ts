// import { ConfigManager} from "./config";
// import { Authenticate } from "./authenticate";
//
import select, { Separator } from '@inquirer/select'

import axios from 'axios'

(async function main() {
  // const cm = new ConfigManager()
  // const config = cm.getConfig()
  //
  // Authenticate(config, cm)
  console.log({
    message:
      "hey from main"
  })

  // const repos = await getRepos()
  // const repoList: Array<string> = repos.repos.map((repo: { name: string }) => repo.name)
  // const transformData = repoList.map((repo: string) => ({
  //   name: repo,
  //   value: repo,
  //   description: repo
  // }))

  // repoTestListOptions(transformData)
  const editorOptions = [
    'vim', 'neovim', 'vscode'
  ].map((editor: string) => ({
    name: editor,
    value: editor,
    description: editor
  }))
  configureEditor(editorOptions)

})()

type OptionsType = {
  name: string,
  value: string,
  description: string
}

async function repoTestListOptions(options: Array<OptionsType>): Promise<string> {
  const answer = await select({
    message: 'Select a repo',
    pageSize: 8,
    loop: true,
    choices: options,
  })
  return answer
}


// editor: {
//   name: "",
//   alias: "",
//   tmux: false,
// },
// dependencies: false,
//

async function configureEditor(options: Array<OptionsType>) {
  const editor_answer = await select({
    message: 'Select your preferred editor',
    choices: options
  })
  new Separator()
  const alias_answer = await select({
    message: 'Do you open your editor with an alias?',
    choices: [
      {
        name: 'Yes',
        value: true,
        description: 'v . - c . - nv . - nvim . - code . ??? cool chad stuff like that'
      }
    ]
  })
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
    editor: {
      name: editor_answer,
      alias: alias_answer,
      tmux: tmux_answer
    }
  }
}



async function getRepos() {
  const userResponse = await axios.get('https://api.github.com/user', { headers: { Authorization: `token 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` } })
  const repos = await axios.get(userResponse.data.repos_url, { headers: { Authorization: `token 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` } })
  return { repos: repos.data }
}

