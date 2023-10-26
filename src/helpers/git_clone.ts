
import { spawn } from 'child_process'

import ora from "ora"

export async function gitClone(repo_url: string) {
  const gitProcess = spawn('git', ['clone', repo_url])

  gitProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  gitProcess.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`)
  })

  return new Promise<void>((resolve, reject) => {
    gitProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Repository cloned successfully!')
        resolve()
      } else {
        console.error(`git clone process exited with code ${code}`)
        reject()
      }
    })
  })
}

// export async function gitClone(repo: string) {
//   const spinner = ora('Cloning repository...').start()
//   try {
//     setTimeout(() => {
//       spinner.succeed('Repository cloned successfully!')
//       console.log('git clone', repo)
//     }, 3000)
//   } catch (error) {
//     spinner.fail('Failed to clone repository!')
//     console.log(error)
//     process.exit(1)
//   }
// }



