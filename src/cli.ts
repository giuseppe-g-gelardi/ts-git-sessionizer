import * as readline from 'readline';

export async function Continue() {
  console.log("continue.... this is the rest of the application!!!")

  const rl = readline.createInterface({ // test prompt
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Please enter your name: ', (answer) => {
    console.log(`You entered: ${answer}`);
    rl.close(); // Close the readline interface
  });
}
