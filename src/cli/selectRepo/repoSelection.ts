
import { spawn } from 'child_process'
import { parse } from 'url'

import ora from 'ora'
import axios from 'axios'
import { select } from "@inquirer/prompts"


type PartialRepo = {
  name: string,
  html_url: string,
  description: string
}

type OptionsType = {
  name: string,
  value: string,
  description: string
}

export async function repoSelection(token: string): Promise<void> {
  const github_repos = await fetchGithubRepos(token)
  const answer = await select({
    message: 'Select a repository',
    pageSize: 8,
    loop: true,
    choices: github_repos,
  })
  const repoName = getRepoNameFromUrl(answer)
  // const spinner = ora('Cloning repository...\n').start()

  // const repoUrl = answer

  const spinner = ora().start()
  try {

    // setTimeout(() => {
    //   spinner.text = 'Cloning repository...'
    // }, 2000)
    await gitClone(answer)
    spinner.succeed('Repository cloned successfully!')



  } catch (error) {
    spinner.fail('Failed to clone repository!')
    console.log(error)
    process.exit(1)
  }

  setTimeout(async () => {
    await changeWorkingDirectory(repoName)
    await openCodeEditor()
  }, 2000)
}

function getRepoNameFromUrl(url: string): string {
  const parsedUrl = parse(url)
  const pathname = parsedUrl.pathname || ''
  const pathParts = pathname.replace(/^\/|\/$/g, '').split('/');
  const repoName = pathParts[pathParts.length - 1];
  return repoName
}

async function fetchGithubRepos(token: string): Promise<Array<OptionsType>> {
  const spinner = ora('Fetching your repositories...').start()
  const headers = { Authorization: `token ${token}` }

  try {
    const userResponse = await axios.get('https://api.github.com/user', { headers })
    const repoResponse = await axios.get(userResponse.data.repos_url, { headers })

    const repository_list = repoResponse.data.map((r: PartialRepo) => ({
      name: r.name,
      value: r.html_url,
      description: r.description
    }))

    spinner.succeed('Repositories fetched successfully!')
    return repository_list
  } catch (error) {
    spinner.fail('Failed to fetch repositories!')
    console.log(error)
    process.exit(1)
  }
}


async function gitClone(repo_url: string): Promise<void> {
  const gitProcess = spawn('git', ['clone', repo_url])

  // gitProcess.stdout.on('data', (data) => console.log(`stdout: ${data}`))
  // gitProcess.stderr.on('data', (data) => console.log(`stderr: ${data}`))

  return new Promise<void>((resolve, reject) => {
    gitProcess.on('close', (code) => {
      if (code === 0) {
        // console.log('Repository cloned successfully!')
        resolve()
      } else {
        console.error(`git clone process exited with code ${code}`)
        reject()
      }
    })
  })
}

async function changeWorkingDirectory(dir: string): Promise<void> {

  console.info(`Changing working directory to ${dir}`)

  return new Promise<void>((resolve, reject) => {
    try {
      process.chdir(dir)
      console.log(`Changed working directory to ${dir}`)
      resolve()
    } catch (error) {
      console.log(error)
      reject()
    }
  })
}

async function openCodeEditor(): Promise<void> {
  // const command = 'code .';
  // const cmd = `tmux new -s ${dirname}` // dirname should be the name of the repo
  const command = 'nvim .';
  const terminal = spawn(command, { shell: true, stdio: 'inherit' });
  terminal.on('error', (error) => console.error(`Error: ${error}`))

  terminal.on('exit', (code) => {
    if (code === 0) {
      console.log('Command executed successfully!');
      process.exit(0)
    } else {
      console.error(`Command exited with code ${code}`);
    }
  })
}


