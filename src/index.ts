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

import { spawn } from 'child_process';

async function changeWorkingDirectory(dir: string): Promise<void> {
  console.info(`Current working directory is ${process.cwd()}`)
  console.info(`Changing working directory to ${dir}`);
  return new Promise<void>((resolve, reject) => {
    try {
      const childProcess = spawn('cd', [dir], { shell: true, stdio: 'inherit' });

      childProcess.on('exit', (code) => {
        if (code === 0) {
          console.log(`Changed working directory to ${dir}`);
          resolve();
          // console.log(__dirname, process.cwd(), dir)
        } else {
          console.error(`Failed to change working directory to ${dir}`);
          reject();
        }
      });
    } catch (error) {
      console.error(error);
      reject();
    }
  });
}

(async function main() {
  console.log('Current working directory is: ', process.cwd())
  try {
    process.chdir(`tests`)
    console.log('updated working directory is: ', process.cwd())
    // process.chdir(`${__dirname}/test`)
  } catch (error) {
    console.error("error occured while " + "changing directory: " + error);

  }
  // try {
  //   // await changeWorkingDirectory('tests');
  // } catch (error) {
  //   console.error('Error:', error);
  // }
})();




// (async function testMain() {
//   console.log(__dirname)
//   const newDir = await changeWorkingDirectory('test')
//   return newDir
// })()


// async function changeWorkingDirectory(dir: string): Promise<void> {

//   console.info(`Changing working directory to ${dir}`)

//   return new Promise<void>((resolve, reject) => {
//     try {
//       process.chdir(`${__dirname}/${dir}`)
//       // process.chdir(dir)
//       console.log(`Changed working directory to ${dir}`)
//       resolve()
//     } catch (error) {
//       console.log(error)
//       reject()
//     }
//   })
// }

