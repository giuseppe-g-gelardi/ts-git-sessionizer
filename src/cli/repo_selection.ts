import axios from 'axios'

import ora from 'ora'
import { select } from "@inquirer/prompts"
import { gitClone } from '../helpers/git_clone'

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

// should add ssh_url to the options and prompt the user to choose 
// between https and ssh

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
