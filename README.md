# ts-git-sessionizer

### a little project to automate the creation of a sessionized git repo in your editor of choice, with tmux. or not...

the application uses github authentication and some interactive prompts to {hopefully} ...
 - init the application 
 - - does some basic auth and saves settings to a .configrc file.
 - clone a repository
 - cd into the directory
 - start a tmux session, if that's your cup of tea
 - and finally, open the repo in your preferred editor

## To get started:
1. create a new oauth app in your gh developer settings 
 - homepage url: http://localhost:{port} 
 - auth callback url: http://localhost:{port}/auth/callback
 - make sure to save the client id and generate a client secret, you will need that soon
2. `git clone https://github.com/giuseppe-g-gelardi/ts-git-sessionizer.git`
3. cd ts-git-sessionizer
4. pnpm install
5. add your clientid, client secret and your preferred port to the .env file. 
 - a .env.example file is included. 
6. pnpm start
