import * as fs from 'fs';

type UserProfile = {
  access_token: string;
  github_username: string;
};

export type Editor = {
  name: string; // "vscode" | "vim" | "nvim";
  alias: string | boolean;
  tmux: boolean;
};

export interface UserConfig {
  user_profile: UserProfile;
  editor: Editor;
  dependencies: boolean;
}


export class ConfigManager {
  private configFileName = '.configrc';
  public defaultConfig: UserConfig;

  constructor(defaultConfig: UserConfig = {
    user_profile: {
      access_token: "",
      github_username: "",
    },
    editor: {
      name: "",
      alias: "",
      tmux: false,
    },
    dependencies: false,
  }) {
    this.defaultConfig = defaultConfig;
  }

  getConfig(rc_depth = 0): UserConfig {
    if (rc_depth > 5) {
      throw new Error('Unable to find config file');
    }

    try {
      const config = fs.readFileSync(this.configFileName, 'utf8');
      return JSON.parse(config) as UserConfig;
    } catch (err: unknown) {
      console.error('Error reading config file, making a new one');
      this.writeConfig();
      return this.getConfig(rc_depth + 1);
    }
  }

  writeConfig<T extends object>(params: T | null = null): UserConfig {
    try {
      if (params !== null) {
        fs.writeFileSync(this.configFileName, JSON.stringify(params, null, 2)); // -> console.log('Config file updated');
      } else {
        fs.writeFileSync(this.configFileName, JSON.stringify(this.defaultConfig, null, 2)); // -> console.log('Config file created');
      }
      return this.getConfig();
    } catch (err) {
      throw new Error("Error writing to config file")
    }
  }

  async revalidateConfig() {
    setTimeout(async () => {
      const updatedConfig = this.getConfig();
      if (updatedConfig.user_profile.access_token === "") {
        this.getConfig(); throw new Error('Unable to update or verify config');
      }
    }, 2000);
  }
}


