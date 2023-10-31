import { exec } from 'child_process';

export function openBrowser(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let openCommand: string;

    // if (process.platform === 'darwin') {
    //   openCommand = `open ${url}`;
    // } else if (process.platform === 'win32') {
    //   openCommand = `start ${url}`;
    // } else {
    //   openCommand = `xdg-open ${url}`;
    // }

    switch (process.platform) {
      case 'darwin': openCommand = `open ${url}`; break;
      case 'win32': openCommand = `start ${url}`; break;
      case 'linux': openCommand = `xdg-open ${url}`; break;
      default : openCommand = `open ${url}`; break;
    }

    exec(openCommand, (error) => {
      if (error) {
        console.error(`Error opening the browser: ${error}`);
        reject(error);
      } else {
        resolve();
      }
    }
    );
  });
}






    // exec(`open ${url}`, (error) => {
    //   if (error) {
    //     console.error(`Error opening the browser: ${error}`);
    //     reject(error);
    //   } else {
    //     resolve();
    //   }
    // });
//   });
// }
