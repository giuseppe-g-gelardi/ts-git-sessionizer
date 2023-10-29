import { parse } from 'url'

import ora from 'ora'

import dotenv from 'dotenv'
dotenv.config()


type PartialRepo = {
  name: string,
  html_url: string,
  description: string
  private: boolean
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
  const spinner = ora('Fetching repositories...').start()
  const perPage = 100; // Number of repositories to fetch per page
  let page = 1;
  let allRepos: PartialRepo[] = [];
  let moreRepos = true

  while (moreRepos) {
    const url = `https://api.github.com/user/repos?page=${page}&per_page=${perPage}&visibility=all`;
    const response = await fetch(url, { headers: { Authorization: `token ${token}` } });
    const repos = await response.json();

    if (repos.length === 0) {
      moreRepos = false;
      break; // No more repositories to fetch
    } else {
      allRepos = allRepos.concat(repos);
      page++;
    }
  }

  spinner.succeed(`Fetched ${allRepos.length} repositories!`)
  return allRepos.map((r: PartialRepo) => ({
    name: r.name && `${r.name} -- ${r.private ? '(private)' : '(public)'}`,
    value: r.html_url,
    description: r.description,
  }));
}
