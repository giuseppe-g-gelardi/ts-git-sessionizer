

import { type ConfigManager } from '../../ConfigManager'
import { getRepoNameFromUrl, fetchGithubRepos } from '.'

import { spawn } from 'child_process'

import ora from 'ora'
import { select } from "@inquirer/prompts"

export async function repoSelection(token: string, cm: ConfigManager): Promise<void> {
  const github_repos = await fetchGithubRepos(token)
  const answer = await select({
    message: 'Select a repository',
    pageSize: 8,
    loop: true,
    choices: github_repos,
  })
  const repoName = getRepoNameFromUrl(answer)
  const spinner = ora('Cloning repository...\n').start()
  const cfg = cm.getConfig()

  try {
    spinner.succeed()
    await gitClone(answer)
    spinner.succeed('Repository cloned successfully!')

    if (cfg.editor.name === 'neovim' && cfg.editor.tmux === true) {
      await startTmuxAndNvim(repoName)
    }

    if (cfg.editor.name === 'neovim' && cfg.editor.tmux === false) {
      await cdIntoAndEdit("nvim", repoName)
    }


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
      spinner.start(`opening editor`)
      setTimeout(async () => {
        spinner.succeed()
        await openCodeEditorPromise()
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


async function openCodeEditorPromise(): Promise<void> {
  const command = 'nvim .';
  // const command = `tmux send-keys -t ${repoName.replace(".", "_")} "nvim" C-m`;
  // const command = `tmux send-keys -t _cli-test "nvim ." C-m`;
  // const command = `tmux send-keys -t 1 "nvim ." C-m`; 
  const terminal = spawn(command, { shell: true, stdio: 'inherit' });
  return new Promise<void>((resolve, reject) => {
    terminal.on('error', (error) => console.error(`Error: ${error}`))
    terminal.on('exit', (code) => code === 0 ? resolve() : reject(`Process exited with code ${code}`))
  })
}

// 

async function startTmuxAndNvim(repoName: string): Promise<void> {
  try {
    await changeWorkingDirectory(repoName)
    await startTmuxSession(repoName)
  } catch (error) {
    console.error('Error:', error);
  }
}

async function startTmuxSession(sessionName: string): Promise<void> {
  // Start the tmux session
  const tmuxProcess = spawn(`tmux new -s ${sessionName}`, { shell: true, stdio: 'inherit' });
  tmuxProcess.on('error', (error) => console.error(`Error: ${error}`));

  // Wait for a moment to allow the tmux session to initialize
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Send keys to open nvim within the tmux session
  // const nvimProcess = spawn(`tmux send-keys -t ${sessionName} 'nvim .' C-m`, { shell: true, stdio: 'inherit' });
  const nvimProcess = spawn(`tmux send-keys -t _cli-test 'nvim .' C-m`, { shell: true, stdio: 'inherit' });
  nvimProcess.on('error', (error) => console.error(`Error: ${error}`));

  return new Promise<void>((resolve, reject) => {
    tmuxProcess.on('close', (code) => {
      // The tmux process should be the one to determine success or failure
      if (code === 0) {
        resolve();
      } else {
        reject(`tmux process exited with code ${code}`);
      }
    });
    nvimProcess.on('close', (code) => {
      // The nvim process closing doesn't determine the overall success or failure
      // It's the tmux process that matters
      if (code !== 0) {
        console.error(`nvim process exited with code ${code}`);
      }
    });
  });
}



// * refactor juice
// // export async function runCommand(command: string): Promise<void>
// export async function runCommand(command: string, args?: string[]): Promise<void> {
//   return new Promise<void>((resolve, reject) => {
//     const childProcess = spawn(command, args ? args : [], { stdio: 'inherit' });
//     childProcess.on('error', (error) => reject(error));
//     childProcess.on('close', (code) => code === 0 ? resolve() : reject(`Process exited with code ${code}`));
//   });
// }
