import { ConfigManager, UserConfig } from "../ConfigManager";
import { createOAuthDeviceAuth } from '@octokit/auth-oauth-device';

import { openBrowser } from "../utils/openBrowser";

export async function authenticateWithGithub(cm: ConfigManager): Promise<void> {
  try {
    await deviceFlowAuth(cm)
  } catch (error) {
    console.error(error)
  }
}

async function deviceFlowAuth(cm: ConfigManager): Promise<void> {

  const auth = createOAuthDeviceAuth({
    clientType: 'oauth-app',
    clientId: "93cd064567f35e7d6d27",
    scopes: ["repo"], // "read:user"
    onVerification(verification) {
      console.info('Press enter to authenticate with GitHub')
      console.log('Enter code %s', verification.user_code)

      process.stdin.once('data', (data) => {
        if (data.toString() === '\n') {
          try {
            openBrowser(verification.verification_uri)
          } catch (error) {
            console.error("Failed to open the browser: " + error)
          }
        }
        else { console.warn('invalid input') }
      })
    }
  })

  const tokenAuthentication = await auth({ type: 'oauth', });

  const cfg = await cm.getConfig()
  await cm.writeConfig({
    ...cfg, user_profile: {
      ...cfg.user_profile,
      access_token: tokenAuthentication.token
    }
  } as UserConfig)

  console.info('Successfully authenticated with GitHub')
}

