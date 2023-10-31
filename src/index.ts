// import { ConfigManager } from "./ConfigManager";
// import { authenticate } from "./auth";
// import { initCli } from './cli'
//
// (async function main() {
//   const cm = new ConfigManager()
//   const config = cm.getConfig()
//
//   await authenticate(config, cm)
//
//   await initCli(config, cm)
// })()

// ! ********************************************************************* ! //
//                                                                           //
// ! ********************************************************************* ! //
//

import dotenv from 'dotenv'

import { createOAuthDeviceAuth } from '@octokit/auth-oauth-device';
import { openBrowser } from './utils';


(async function main() {
  await deviceFlowAuth()
})();

async function deviceFlowAuth() {
  dotenv.config()

  const auth = createOAuthDeviceAuth({
    clientType: 'oauth-app',
    clientId: process.env.CLIENT_ID as string,
    scopes: ["repo", "read:user"],
    onVerification(verification) {
      console.info('Press enter to authenticate with GitHub')
      console.log('Enter code %s', verification.user_code)

      process.stdin.once('data', (data) => {
        if (data.toString() === '\n') { openBrowser(verification.verification_uri) }
        else { console.warn('invalid input') }
      })
    }
  })

  const tokenAuthentication = await auth({ type: 'oauth', });
  console.log(tokenAuthentication)

}

