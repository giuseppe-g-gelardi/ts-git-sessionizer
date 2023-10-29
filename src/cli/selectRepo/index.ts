import {parse} from 'url'
import axios from 'axios'

import ora from 'ora'


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


export function getRepoNameFromUrl(url: string): string {
  const parsedUrl = parse(url)
  const pathname = parsedUrl.pathname || ''
  const pathParts = pathname.replace(/^\/|\/$/g, '').split('/');
  const repoName = pathParts[pathParts.length - 1];
  return repoName
}

export async function fetchGithubRepos(token: string): Promise<Array<OptionsType>> {
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
