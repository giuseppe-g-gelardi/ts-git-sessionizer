import { ConfigManager } from "./ConfigManager";
import { openBrowser } from "./utils/openBrowser";
// import { authenticate } from "./auth/authenticate";
// import { initCli } from "./cli/initCli";

// (async function main() {
//   const cm = new ConfigManager();
//   const config = await cm.getConfig();
//
//   if (config.access_token === "") {
//     await authenticate(config, cm);
//   }
//
//   await initCli(config, cm);
// })()(
//
// ! ********************************************************************* ! //
//                                                                           //
// ! ********************************************************************* ! //

(async function main() {
  const cm = new ConfigManager();
  const config = await cm.getConfig();

  openBrowser("https://github.com/giuseppe-g-gelardi/git-sessionizer/codespaces/code_menu_contents?name=main")
  // const repos = await fetchGithubRepos(config.access_token);
  // console.log(repos);
})();

export async function fetchGithubRepos(token: string) {
  // const perPage = 100; // Number of repositories to fetch per page
  // let page = 1;
  // let allRepos: PartialRepo[] = [];
  // let moreRepos = true
  //
  const url = `https://api.github.com`;
  const response = await fetch(url, {
    headers: { Authorization: `token ${token}` },
  });

  const user = await response.json();
  console.log(user);

  // while (moreRepos) {
  //   const url = `https://api.github.com/user/repos?page=${page}&per_page=${perPage}&visibility=all`;
  //   const response = await fetch(url, { headers: { Authorization: `token ${token}` } });
  //   const repos = await response.json();
  //
  //   if (repos.length === 0) {
  //     moreRepos = false;
  //     break; // No more repositories to fetch
  //   } else {
  //     allRepos = allRepos.concat(repos);
  //     page++;
  //   }
  // }
  //
  // return allRepos.map((r: PartialRepo) => ({
  //   name: r.name && `${r.name} -- ${r.private ? '(private)' : '(public)'}`,
  //   value: {
  //     html: r.html_url,
  //     ssh: r.ssh_url,
  //   },
  //   description: r.description,
  // }));
}

/*
 * 	https://github.com/giuseppe-g-gelardi/git-sessionizer/codespaces/code_menu_contents?name=main
 */
