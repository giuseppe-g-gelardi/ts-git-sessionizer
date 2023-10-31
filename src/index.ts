import { ConfigManager } from "./ConfigManager";
import { authenticate } from "./auth";
import { initCli } from './cli'

// import ora from 'ora'

(async function main() {
  const cm = new ConfigManager()
  const config = await cm.getConfig()

  if (config.user_profile.access_token === "") {
    await authenticate(config, cm)
  }

  await initCli(config, cm)
})()

// ! ********************************************************************* ! //
//                                                                           //
// ! ********************************************************************* ! //

