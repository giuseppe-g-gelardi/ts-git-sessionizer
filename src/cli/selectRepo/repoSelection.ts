

import { type ConfigManager } from '../../ConfigManager'
import { getRepoNameFromUrl, fetchGithubRepos } from './fetchGithubRepos'

import { spawn } from 'child_process'

import ora from 'ora'
import { select } from "@inquirer/prompts"


export async function repoSelection(token: string, cm: ConfigManager): Promise<void> {
  const github_repos = await fetchGithubRepos(token)
  const answer = await select({
    message: `Select a repository -- ${github_repos.length} repositories found`,
    pageSize: 8,
    loop: true,
    choices: github_repos,
  })
  const repoName = getRepoNameFromUrl(answer.html)

  const bareRepo = await select({
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

  const htmlOrSsh = await select({
    message: 'Clone via SSH or HTTPS?',
    choices: [
      {
        name: 'HTTP',
        value: 'http',
        description: 'Clones the repository via HTTPS'
      },
      {
        name: 'SSH',
        value: 'ssh',
        description: 'Clones the repository via SSH'
      },
    ]
  })

  const cloneUrl = htmlOrSsh === 'http' ? answer.html : answer.ssh
  const spinner = ora('Cloning repository...\n').start()
  const cfg = await cm.getConfig()
  try {
    spinner.succeed()
    await gitClone(cloneUrl, bareRepo)
    spinner.succeed('Repository cloned successfully!')

    if (cfg.editor.name === 'neovim'
      || cfg.editor.name === 'vim'
      && cfg.editor.tmux === true) {
      await startTmuxAndNvim(repoName)
    }

    if (cfg.editor.tmux === false) {
      await cdIntoAndEdit(cfg.editor.name, repoName)
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
        await openCodeEditorPromise(editor)
      }, 100)
    }, 1000)
  }, 1000)
}

async function gitClone(repo_url: string, isBare = false): Promise<void> {
  let gitProcess = spawn('git', ['clone', repo_url])
  if (isBare) gitProcess = spawn('git', ['clone', '--bare', repo_url])
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

async function openCodeEditorPromise(editor: string): Promise<void> {
  let command: string;

  switch (editor) {
    case 'neovim': command = 'nvim .'; break;
    case 'vim': command = 'vim .'; break;
    case 'vscode': command = 'code .'; break;
    default: command = 'code .'; break;
  }

  const terminal = spawn(command, { shell: true, stdio: 'inherit' });
  return new Promise<void>((resolve, reject) => {
    terminal.on('error', (error) => console.error(`Error: ${error}`))
    terminal.on('exit', (code) => code === 0 ? resolve() : reject(`Process exited with code ${code}`))
  })
}

async function startTmuxAndNvim(repoName: string): Promise<void> {
  try {
    await changeWorkingDirectory(repoName)
    await startTmuxSession(repoName)
  } catch (error) {
    console.error('Error:', error);
  }
}

async function startTmuxSession(sessionName: string): Promise<void> {
  const session = sessionName.replace('.', '_').toLowerCase();
  // Start the tmux session
  const tmuxProcess = spawn(`tmux new -s ${session}`, { shell: true, stdio: 'inherit' });
  tmuxProcess.on('error', (error) => console.error(`Error: ${error}`));

  // Wait for a moment to allow the tmux session to initialize
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Send keys to open nvim within the tmux session
  const nvimProcess = spawn(`tmux send-keys -t ${session} 'nvim .' C-m`, { shell: true, stdio: 'inherit' });
  // const nvimProcess = spawn(`tmux send-keys -t _cli-test 'nvim .' C-m`, { shell: true, stdio: 'inherit' });
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

