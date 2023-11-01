# ts-git-sessionizer

### a little project to automate the creation of a sessionized git repo in your editor of choice, with tmux, or not...

the application uses github authentication and some interactive prompts to...
 - init the application 
 - - authenticates with github via device flow and saves the token to a config file
 - lets you search through your public and private repositories
 - select and clone a repo 
 - - clone with SSH or HTTP
 - - standard or bare (if you like worktrees) repository
 - cd into directory
 - start a tmux session, if that's your cup of tea
 - and finally, open the repo in your preferred editor (vscode, vim, or neovim)

TODO: 
- [ ] add filtering to repo search
- [ ] make back button
- [ ] open terminal based on OS -- process.platform === 'darwin' || 'linux' || 'win32'
- [ ] if there is error cloning a repo, try again. but only like 3 times 
- [x] open browser based on OS -- process.platform === 'darwin' || 'linux' || 'win32'
- [x] add ssh_url to gitClone options -- need to setup ssh keys to test with but it should work
- [x] remove github username from config file and ConfigManager
- [x] implement device flow auth
- [x] add functionality for worktrees "'--bare' repos" 

## To get started:
1. `git clone https://github.com/giuseppe-g-gelardi/ts-git-sessionizer.git`
2. cd ts-git-sessionizer
3. pnpm install
4. pnpm start
