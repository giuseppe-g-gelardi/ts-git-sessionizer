import { ConfigManager } from "./ConfigManager";
import { authenticate } from "./auth";
import { initCli } from './cli'

(async function main() {
  const cm = new ConfigManager()
  const config = cm.getConfig()

  await authenticate(config, cm)

  await initCli(config, cm)
})()

// ! ********************************************************************* ! //
//                                                                           //
// ! ********************************************************************* ! //
