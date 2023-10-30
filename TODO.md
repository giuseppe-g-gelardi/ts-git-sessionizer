## make a back button
-- 
################################ complete ##################################
## github only sends like 20 repos at a time, 
 - need to make a way to get all of them 
 - or an options to get more/search/filter
################################ complete ################################## 
-- 
## should add ssh_url to the options and prompt the user to choose 
 - between https and ssh

## open terminal based on OS
 - process.platform === 'darwin' || 'linux' || 'win32'

################################ complete ##################################
## work on tmux integration at a later date
 - having a hard time getting the program to start a (non detached) 
   tmux session
 - and then open the editor in that session
################################ complete ##################################

get cfg
{
  "user_profile": {
    "access_token": "ASDFASDFASDFASEFASDFASDFASDFASfd",
    "github_username": "username",
  },
  "editor": {
    "name": "vim",
    "alias": "v .",
    "tmux": true
  },
  "dependencies": false
}

set up the scripty things:
git clone {url}
...
cd into repo_name
if deps, install need to figure out how to do this with each language
-- keep it npm, pnpm, yarn for now.

-> if tmux, -- tmux new -s {repo_name}
-> check alias, if not alias, use std command [need to make a list of std commands forEach editor]
-> open editor with alias or std command
-> close program at this point???

*/



