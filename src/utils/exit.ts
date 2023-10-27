
import ora from 'ora'

export function Exit() {
  const spinner = ora('Exiting...').start()

  setTimeout(() => {
    spinner.succeed('Bye! 👋');
    process.exit(0);
  }, 3000);
}
