



export function Exit() {
  const loadingChars = ['/', '-', '\\', '|'];
  let i = 0;
  let timeLeft = 3;

  const loadingInterval = setInterval(() => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);

    if (timeLeft > 1) {
      process.stdout.write(`Exiting... ${loadingChars[i]}`);
    } else {
      process.stdout.write(`Bye! 👋 ${loadingChars[i]}`);
    }

    i = (i + 1) % loadingChars.length;
    timeLeft--;
  }, 250);

  setTimeout(() => {
    clearInterval(loadingInterval);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.exit(0);
  }, 3000);
}
