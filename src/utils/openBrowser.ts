import { exec } from 'child_process';

export function openBrowser(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let openCommand: string;

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
