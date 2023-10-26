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


async function fetchGithubRepos(token: string): Promise<Array<OptionsType>> {
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

export async function repoSelection(token: string): Promise<string> {
  const github_repos = await fetchGithubRepos(token)
  const answer = await select({
    message: 'Select a repository',
    pageSize: 8,
    loop: true,
    choices: github_repos,
  })
  return answer
}
