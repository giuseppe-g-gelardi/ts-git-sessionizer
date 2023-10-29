// import { ConfigManager } from "./ConfigManager";
// import { authenticate } from "./auth";
// import { initCli } from './cli'

// (async function main() {
//   const cm = new ConfigManager()
//   const config = cm.getConfig()

//   await authenticate(config, cm)

//   await initCli(config, cm)
// })()

// ! ********************************************************************* ! //
//                                                                           //
// ! ********************************************************************* ! //


import { spawn } from 'child_process'

(async function main() {
  try {
    await startTmuxAndNvim('.cli-test', 'regular')
  } catch (error) {
    console.error('Error:', error);
  }
})()

async function startTmuxAndNvim(repoName = '.cli-test', type: ("detached" | "regular")): Promise<void> {
  try {

    switch (type) {
      case "detached": // * open detached session
        await changeWorkingDirectory(repoName)
        await startDetachedTmuxSession(repoName)
        await openNvim(repoName)
        await runCommand('tmux')
        await runCommand(`tmux attach-session -t ${repoName.replace('.', '_')}`)
        break;
      case "regular": // * open regular session
        await changeWorkingDirectory(repoName)
        await startTmuxSession(repoName)
        await runCommand('tmux')
        await runCommand(`tmux send-keys -t ${repoName.replace('.', '_')} 'cd ${repoName} && nvim .' C-m`)
        break;
      default:
        break;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// async function startTmuxSession(sessionName: string): Promise<void> {
//   const tmuxProcess = spawn(`tmux new -s ${sessionName}`, { shell: true, stdio: 'inherit' })
//   tmuxProcess.on('error', (error) => console.error(`Error: ${error}`))

//   const nvimProcess = spawn(`tmux send-keys -t ${sessionName} 'nvim .' C-m`, { shell: true, stdio: 'inherit' })
//   nvimProcess.on('error', (error) => console.error(`Error: ${error}`))

//   return new Promise<void>((resolve, reject) => {
//     tmuxProcess.on('close', (code) => code === 0 ? resolve() : reject(`Process exited with code ${code}`))
//     nvimProcess.on('close', (code) => code === 0 ? resolve() : reject(`Process exited with code ${code}`))
//   })
// }


async function startTmuxSession(sessionName: string): Promise<void> {
  console.log(`Starting tmux session ${sessionName}`)
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


async function startDetachedTmuxSession(sessionName: string): Promise<void> {
  const tmuxProcess = spawn(`tmux new -d -s ${sessionName}`, { shell: true, stdio: 'inherit' })
  tmuxProcess.on('error', (error) => console.error(`Error: ${error}`))
  return new Promise<void>((resolve, reject) => {
    tmuxProcess.on('error', (error) => reject(error))
    tmuxProcess.on('close', (code) => code === 0 ? resolve() : reject(`Process exited with code ${code}`))
  })
}

async function openNvim(repoName: string): Promise<void> {
  const command = `tmux send-keys -t ${repoName.replace(".", "_")} "nvim ." C-m`;
  const terminal = spawn(command, { shell: true, stdio: 'inherit' });
  return new Promise<void>((resolve, reject) => {
    terminal.on('error', (error) => reject(error))
    terminal.on('exit', (code) => code === 0 ? resolve() : reject(`Process exited with code ${code}`))
  })
}

async function runCommand(command: string, args?: string[]): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const childProcess = spawn(command, args ? args : [], { stdio: 'inherit' });
    childProcess.on('error', (error) => reject(error));
    childProcess.on('close', (code) => code === 0 ? resolve() : reject(`Process exited with code ${code}`));
  });
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

