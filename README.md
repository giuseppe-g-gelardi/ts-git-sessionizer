# ts-git-sessionizer

### a little project to automate the creation of a sessionized git repo in your editor of choice, with tmux. or not...

the application uses github authentication and some interactive prompts to {hopefully} ...
 - init the application 
 - - does some basic auth and saves settings to a .configrc file.
 - clone a repository
 - cd into the directory
 - start a tmux session, if that's your cup of tea
 - and finally, open the repo in your preferred editor

TODO: 
- [ ] make back button
- [x] implement device flow auth
- [ ] add ssh_url to gitClone options
- [ ] add functionality for worktrees "'--bare' repos" 

## To get started:
1. create a new oauth app in your gh developer settings 
 - make sure to enable device flow -> - [x] Enable Device Flow
2. `git clone https://github.com/giuseppe-g-gelardi/ts-git-sessionizer.git`
3. cd ts-git-sessionizer
4. pnpm install
5. add your clientid to the .env file. 
6. pnpm start

