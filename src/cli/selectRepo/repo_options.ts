import { select } from "@inquirer/prompts"
import { fetchGithubRepos } from "./fetchGithubRepos"

export async function selectRepoPrompt(token: string): Promise<{ html: string, ssh: string }> {
  const github_repos = await fetchGithubRepos(token)
  const answer = await select({
    message: `Select a repository -- ${github_repos.length} repositories found`,
    pageSize: 10,
    loop: true,
    choices: github_repos,
  })
  return answer
}

export async function isBareRepoPrompt(): Promise<boolean> {
  const answer = await select({
    message: 'Clone as bare repository? If you are unsure, select "No"',
    choices: [
      {
        name: 'No (recommended)',
        value: false,
        description: 'Clones the repository as a normal repository'
      },
      {
        name: 'Yes',
        value: true,
        description: 'Clones the repository as a bare repository -- great for worktrees and .dotfiles'
      },
    ]
  })
  return answer
}

export async function cloneViaSshOrHttp(): Promise<string> {
  const answer = await select({
    message: 'Clone via SSH or HTTP? If you are unsure, select "HTTP"',
    choices: [
      {
        name: 'HTTP',
        value: 'http',
        description: 'Clones the repository via HTTPS'
      },
      {
        name: 'SSH',
        value: 'ssh',
        description: 'Clones the repository via SSH -- requires an SSH key to be added to your GitHub account'
      },
    ]
  })
  return answer
}
