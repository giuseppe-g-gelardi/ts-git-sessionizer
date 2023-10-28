

import { getRepoNameFromUrl, fetchGithubRepos } from '.'

import { spawn } from 'child_process'

import ora from 'ora'
import { select } from "@inquirer/prompts"

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
    spinner.succeed()
    await gitClone(answer)
    // await runCommand('git', ['clone', answer]) // test this
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

async function gitClone(repo_url: string): Promise<void> {
  const gitProcess = spawn('git', ['clone', repo_url])
  return new Promise<void>((resolve, reject) => {
    gitProcess.on('close', (code) => code === 0 ? resolve() : reject(`Process exited with code ${code}`))
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
  // const tmuxProcess = spawn(`tmux new -s ${sessionName}`, { shell: true, stdio: 'inherit' })
  tmuxProcess.on('error', (error) => console.error(`Error: ${error}`))

  return new Promise<void>((resolve, reject) => {
    tmuxProcess.on('close', (code) => code === 0 ? resolve() : reject(`Process exited with code ${code}`))
  })
}

async function openCodeEditorPromise(): Promise<void> {
  // const command = 'nvim .';
  // const command = `tmux send-keys -t ${repoName.replace(".", "_")} "nvim" C-m`;
  const command = `tmux send-keys -t _cli-test "nvim ." C-m`;
  // const command = `tmux send-keys -t 1 "nvim ." C-m`; 
  const terminal = spawn(command, { shell: true, stdio: 'inherit' });
  return new Promise<void>((resolve, reject) => {
    terminal.on('error', (error) => console.error(`Error: ${error}`))
    terminal.on('exit', (code) => code === 0 ? resolve() : reject(`Process exited with code ${code}`))
  })
}
// export const startTmuxS = runCommand(`tmux new -d -s _cli-test`)
// export const openNvim = runCommand(`tmux send-keys -t _cli-test "nvim ." C-m`)
// const nvimCommand = `tmux send-keys -t ${repoName.replace(".", "_")} "nvim" C-m`;

async function startTmuxAndNvim(repoName = '.cli-test') {
  
  try {
    await changeWorkingDirectory(repoName)
    await startTmuxSession(repoName)
    await openCodeEditorPromise()
    await runCommand('tmux')
    await runCommand(`tmux send-keys -t _cli-test 'cd ${repoName}' C-m`)
    await runCommand(`tmux send-keys -t _cli-test "nvim ." C-m`)
  } catch (error) {
    console.error('Error:', error);
  }
  console.debug('made after catch block in startTmuxAndNvim')
  return
}



// refactor juice
// async function sleep(ms: number) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }

// export async function runCommand(command: string): Promise<void>
export async function runCommand(command: string, args?: string[]): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const childProcess = spawn(command, args ? args : [], { stdio: 'inherit' });
    childProcess.on('error', (error) => reject(error));
    childProcess.on('close', (code) => code === 0 ? resolve() : reject(`Process exited with code ${code}`));
  });
}
