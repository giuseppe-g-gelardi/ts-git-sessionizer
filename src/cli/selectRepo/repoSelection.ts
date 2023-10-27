
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
  const spinner = ora('Cloning repository...\n').start()

  try {
    setTimeout(() => {
      spinner.succeed()
      console.log(`Cloning ${repoName}...`)
    }, 2000)
    // await gitClone(answer)
    spinner.succeed('Repository cloned successfully!')

    await startTmuxAndNvim(repoName)

    // await cdIntoAndEdit("nvim", repoName)
  } catch (error) {
    spinner.fail('Failed to clone repository!')
    console.log(error)
    process.exit(1)
  }
}

// this is a monstrosity but it works
async function cdIntoAndEdit(editor: string, repoName: string): Promise<void> {
  const spinner = ora('Changing working directory...\n').start()
  spinner.start(`Opening ${repoName} in ${editor}...`)
  setTimeout(async () => {
    spinner.succeed()
    spinner.start(`Changing working directory to ${repoName}...`)
    setTimeout(async () => {
      spinner.succeed()
      await changeWorkingDirectory(repoName)
      // spinner.start(`opening editor`)
      // setTimeout(async () => {
      //   spinner.succeed()
      //   await openCodeEditorPromise()
      // }, 100)
      spinner.start(`starting tmux session`)
      setTimeout(async () => {
        spinner.succeed()
        await startTmuxSession(repoName)
        spinner.start(`opening editor`)
        setTimeout(async () => {
          spinner.succeed()
          await openCodeEditorPromise()
        }, 100)
      }, 100)
    }, 1000)
  }, 1000)

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
  return new Promise<void>((resolve, reject) => {
    gitProcess.on('close', (code) => code === 0 ? resolve() : reject(`Process exited with code ${code}`))
    // gitProcess.on('close', (code) => {
    //   if (code === 0) {
    //     // console.log('Repository cloned successfully!')
    //     resolve()
    //   } else {
    //     console.error(`git clone process exited with code ${code}`)
    //     reject()
    //   }
    // })
  })
}

async function changeWorkingDirectory(dir: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      process.chdir(dir)
      resolve()
    } catch (error) {
      console.log(error)
      reject()
    }
  })
}


// !
async function startTmuxSession(sessionName: string): Promise<void> {
  // const tmuxProcess = spawn('tmux', ['new', '-s', sessionName])
  const tmuxProcess = spawn(`tmux new -d -s ${sessionName}`, { shell: true, stdio: 'inherit' })
  tmuxProcess.on('error', (error) => console.error(`Error: ${error}`))
  // tmuxProcess.stdout.on('data', (data) => console.log(`stdout: ${data}`))
  // tmuxProcess.stderr.on('data', (data) => console.log(`stderr: ${data}`))

  return new Promise<void>((resolve, reject) => {
    tmuxProcess.on('close', (code) => {
      if (code === 0) {
        // console.log('tmux session started successfully!')
        resolve()
      } else {
        // console.error(`tmux session exited with code ${code}`)
        reject()
      }
    })
  })
}
// !

async function openCodeEditor(): Promise<void> {
  // const command = 'code .';
  const command = 'nvim .';
  // const command = `tmux send-keys -t _tmux_conf.0 'nvim .' C-m`;
  const terminal = spawn(command, { shell: true, stdio: 'inherit' });
  terminal.on('error', (error) => console.error(`Error: ${error}`))

  terminal.on('exit', (code) => {
    if (code === 0) {
      // console.log('Command executed successfully!');
      process.exit(0)
    } else {
      // console.error(`Command exited with code ${code}`);
    }
  })
}

async function openCodeEditorPromise(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    // const command = 'nvim .';
    // const command = `tmux send-keys -t ${repoName.replace(".", "_")} "nvim" C-m`;
    const command = `tmux send-keys -t _tmux_conf "nvim ." C-m`;
    const terminal = spawn(command, { shell: true, stdio: 'inherit' });
    terminal.on('error', (error) => console.error(`Error: ${error}`))

    terminal.on('exit', (code) => {
      if (code === 0) {
        // console.log('Command executed successfully!');
        resolve()
      } else {
        // console.error(`Command exited with code ${code}`);
        reject()
      }
    })
  })
}

// export async function runCommand(command: string): Promise<void>
export async function runCommand(command: string, args?: string[]): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const childProcess = spawn(command, args ? args : [], { stdio: 'inherit' });
    childProcess.on('error', (error) => reject(error));
    childProcess.on('close', (code) => code === 0 ? resolve() : reject(`Process exited with code ${code}`));
  });
}


async function switchClient() {
  const command = `tmux send-keys -t _tmux_conf "switch-client -t _tmux_conf" C-m`;
  const terminal = spawn(command, { shell: true, stdio: 'inherit' });
  terminal.on('error', (error) => console.error(`Error: ${error}`))
  terminal.on('exit', (code) => code === 0 ? process.exit(0) : console.error(`${code}`))
}

async function startTmuxAndNvim(repoName = '.tmux.conf') {
  // const tmuxCommand = `tmux new-session -s ${repoName} -d`;
  // const nvimCommand = `tmux send-keys -t ${repoName.replace(".", "_")} "nvim" C-m`;

  try {
    // Start the tmux session // await runCommand('bash', ['-c', tmuxCommand]);
    await startTmuxSession(repoName)

    await sleep(1000); 

    await openCodeEditorPromise()

    await sleep(1000)

    // const command = `tmux send-keys -t _tmux_conf "nvim ." C-m`;
    await runCommand('tmux')
    await sleep(1000)
await switchClient()

  } catch (error) {
    console.error('Error:', error);
  }
}

// async function runCommand(command: string, args: string[]): Promise<void> {
//   return new Promise<void>((resolve, reject) => {
//     const childProcess = spawn(command, args);

//     childProcess.on('error', (error) => {
//       reject(error);
//     });

//     childProcess.on('close', (code) => {
//       if (code === 0) {
//         resolve();
//       } else {
//         reject(`Process exited with code ${code}`);
//       }
//     });
//   });
// }

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

