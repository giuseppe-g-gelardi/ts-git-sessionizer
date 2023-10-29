import { ConfigManager } from "./ConfigManager";
import { authenticate } from "./auth";
import { initCli } from './cli'

(async function main() {
  const cm = new ConfigManager()
  const config = cm.getConfig()

  await authenticate(config, cm)

  await initCli(config, cm)
})()

// ! ********************************************************************* ! //
//                                                                           //
// ! ********************************************************************* ! //

// import dotenv from 'dotenv'

// dotenv.config()
// const token = process.env.GITHUB_TOKEN

// // (async function main() {

// //   const repos = await fetch('https://api.github.com/user/repos', {
// //     headers: {
// //       Authorization: `token ${"TOKEN lol"}`,
// //     }
// //   }).then(res => res.json())

// //   console.log(repos.length)

// // })()

// async function getAllRepositories<T>() {
//   const perPage = 100; // Number of repositories to fetch per page
//   let page = 1;
//   let allRepos: T[] = [];

//   while (true) {
//     const url = `https://api.github.com/user/repos?page=${page}&per_page=${perPage}&visibility=all`;
//     const response = await fetch(url, { headers: { Authorization: `token ${token}` } });
//     const repos = await response.json();

//     if (repos.length === 0) {
//       break; // No more repositories to fetch
//     }

//     allRepos = allRepos.concat(repos);
//     page++;
//   }
//   return allRepos;
// }

// (async function main() {
//   const allRepos = await getAllRepositories();

//   console.log(`Total number of repositories: ${allRepos.length}`);
//   console.log(`repo`, allRepos[0])

//   // if (allRepos.length > 0) {
//   //   console.log("List of repositories:");
//   //   // allRepos.forEach(repo => {});
//   // } else {
//   //   console.log("You have no repositories.");
//   // }
// })();

