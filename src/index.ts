import { ConfigManager } from "./ConfigManager";
import { authenticate } from "./auth/authenticate";
import { initCli } from "./cli/initCli";


(async function main() {
  const cm = new ConfigManager()
  const config = await cm.getConfig()

  if (config.access_token === "") {
    await authenticate(config, cm)
  }

  await initCli(config, cm)
})()

// ! ********************************************************************* ! //
//                                                                           //
// ! ********************************************************************* ! //

