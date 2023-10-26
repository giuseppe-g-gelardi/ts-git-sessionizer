import { ConfigManager } from "./config";
import { Authenticate } from "./authenticate";
import { initCli } from './cli'

(async function main() {
  const cm = new ConfigManager()
  const config = cm.getConfig()

  await Authenticate(config, cm)

  await initCli(config)
})()

// ! ********************************************************************* ! //
//                                                                           //
// ! ********************************************************************* ! //

