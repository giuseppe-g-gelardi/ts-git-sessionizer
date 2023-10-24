import { exec } from 'child_process';

export function openBrowser(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(`open ${url}`, (error) => {
      if (error) {
        console.error(`Error opening the browser: ${error}`);
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
