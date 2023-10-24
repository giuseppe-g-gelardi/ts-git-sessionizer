import { ConfigManager} from "./config";
import { Authenticate } from "./authenticate";


(async function main() {
  const cm = new ConfigManager()
  const config = cm.getConfig()

  Authenticate(config, cm)
})()


