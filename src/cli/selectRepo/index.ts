import {parse} from 'url'
import axios from 'axios'

import ora from 'ora'


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
  const spinner = ora('Fetching your repositories...').start();
  const headers = { Authorization: `token ${token}` };

  try {
    const userResponse = await axios.get('https://api.github.com/user', { headers });
    const reposUrl = userResponse.data.repos_url;
    // const reposUrl = 'https:/api.github.com/user/repos'
    // const reposUrl = `https://api.github.com/search/repositories?q=user:${userResponse.data.login.replace(/['"]+/g, '')}}`
    let allRepositories: OptionsType[] = [];
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const repoResponse = await axios.get(reposUrl, {
        headers,
        params: { page, per_page: 100, type: 'all' }, // Adjust per_page as needed
      });

      const repositories = repoResponse.data.map((r: PartialRepo) => ({
        name: r.name && `${r.name} -- ${r.private ? '(private)' : '(public)'}`,
        value: r.html_url,
        description: r.description,
      }));

      allRepositories = allRepositories.concat(repositories);

      if (repoResponse.headers.link && repoResponse.headers.link.includes('rel="next"')) {
        // If there is a "next" link in the response headers, there are more pages.
        page++;
      } else {
        hasMorePages = false; // No more pages to fetch
      }
    }

    spinner.succeed('Repositories fetched successfully!');
    return allRepositories;
  } catch (error) {
    spinner.fail('Failed to fetch repositories!');
    console.error(error);
    process.exit(1);
  }
}



// export async function fetchGithubRepos(token: string): Promise<Array<OptionsType>> {
//   const spinner = ora('Fetching your repositories...').start()
//   const headers = { Authorization: `token ${token}` }

//   try {
//     // const userResponse = await axios.get('https://api.github.com/user', { headers })
//     // const repoResponse = await axios.get(userResponse.data.repos_url, { headers })

//     const userResponse = await axios.get('https://api.github.com/user', { headers });
//     const reposUrl = userResponse.data.repos_url;
//     // const reposUrl = 'https:/api.github.com/user/repos'
//     // const reposUrl = `https://api.github.com/search/repositories?q=user:${userResponse.data.login.replace(/['"]+/g, '')}}`
//     let allRepositories: OptionsType[] = [];
//     let page = 1;
//     let hasMorePages = true;

//     const repositories = repoResponse.data.map((r: PartialRepo) => ({
//       name: r.name && `${r.name} -- ${r.private ? '(private)' : '(public)'}`,
//       value: r.html_url,
//       description: r.description,
//     }));

//     // const repository_list = repoResponse.data.map((r: PartialRepo) => ({
//     //   name: r.name + (r.private ?  ' -- (private)' : ' -- (public)'),
//     //   value: r.html_url,
//     //   description: r.description
//     }))

//     while (hasMorePages) {
//       const repoResponse = await axios.get(reposUrl, {
//         headers,
//         params: { page, per_page: 100, type: 'all' }, // Adjust per_page as needed
//       });

//     spinner.succeed('Repositories fetched successfully!')
//     return repository_list
//   } catch (error) {
//     spinner.fail('Failed to fetch repositories!')
//     console.log(error)
//     process.exit(1)
//   }
// }
