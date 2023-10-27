import axios from 'axios'
import express, { Request, Response } from 'express'
import dotenv from 'dotenv'

import { ConfigManager, type UserConfig } from '../ConfigManager'
import { openBrowser } from '../utils'

dotenv.config()

export async function authorizationWithGithub(cm: ConfigManager): Promise<void> {
  return new Promise((resolve, reject) => {

    const app = express()
    const port = process.env.PORT || 9000
    app.listen(port, () => console.info({ message: `OAuth server is running on http://localhost:${port}` }));
    const clientId = process.env.CLIENT_ID as string;
    const clientSecret = process.env.CLIENT_SECRET as string;

    openBrowser(`http://localhost:${port}`).then(() => {
      console.info('Browser opened successfully');
    })
      .catch((error) => {
        console.error('Failed to open the browser: ' + error);
      });

    // cli needs to send request to (localhost:9000) to authenticate with github
    app.get('/', (_req: Request, res: Response) => {
      res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}&scope=YOUR_SCOPES`); // Redirect the user to GitHub for authentication
    });

    // github will redirect to (localhost:9000/auth/callback) with a code
    app.get('/auth/callback', async (req, res) => {
      const code = req.query.code;

      if (!code) { res.status(400).send('Missing authorization code.'); return; }

      try {
        const response = await axios.post('https://github.com/login/oauth/access_token', null, {
          params: { client_id: clientId, client_secret: clientSecret, code, },
          headers: { Accept: 'application/json', },
        });
        const accessToken = response.data.access_token;

        const userResponse = await axios.get('https://api.github.com/user', {
          headers: { Authorization: `token ${accessToken}`, } // need to first get the accessToken to query for the user and subsequent details
        })
        const username = userResponse.data.login // const repos = userResponse.data.repos_url // well get the repos later

        res.send('Authorization successful. You can close this window.');

        // first get the config, 
        // then write the config with the new access token and username
        // otherwise the config will be overwritten with the default values
        const cfg = cm.getConfig()
        cm.writeConfig({
          ...cfg, user_profile: {
            ...cfg.user_profile,
            access_token: accessToken, github_username: username
          }
        } as UserConfig)
        console.info("config updated")
        resolve()
      } catch (error: unknown) {
        res.status(500).send('Error exchanging the authorization code for an access token.');
        reject(error)
      }
    });
  });
}

