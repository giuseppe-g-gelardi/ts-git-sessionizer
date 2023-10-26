
import { spawn } from 'child_process'

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

  const spinner = ora('Cloning repository...').start()
  try {
    await gitClone(answer)
    spinner.succeed('Repository cloned successfully!')
  } catch (error) {
    spinner.fail('Failed to clone repository!')
    console.log(error)
    process.exit(1)
  }
}

async function fetchGithubRepos(token: string): Promise<Array<OptionsType>> {
  const spinner = ora('Fetching your repositories...').start()

  try {
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

    spinner.succeed('Repositories fetched successfully!')
    return repository_list
  } catch (error) {
    spinner.fail('Failed to fetch repositories!')
    console.log(error)
    process.exit(1)
  }
}


async function gitClone(repo_url: string) {
  const gitProcess = spawn('git', ['clone', repo_url])

  gitProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  gitProcess.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`)
  })

  return new Promise<void>((resolve, reject) => {
    gitProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Repository cloned successfully!')
        resolve()
      } else {
        console.error(`git clone process exited with code ${code}`)
        reject()
      }
    })
  })
}
