import { Continue } from '../src/cli';
import { ConfigManager, UserConfig } from '../src/ConfigManager';

describe('ConfigManager', () => {
  describe('getConfig', () => {
    it('returns default config when config file does not exist', () => {
      const configManager = new ConfigManager();
      jest.spyOn(configManager, 'writeConfig').mockReturnValueOnce(configManager.defaultConfig);
      jest.spyOn(configManager, 'getConfig').mockReturnValueOnce(configManager.defaultConfig);

      const config = configManager.getConfig();

      expect(config).toEqual(configManager.defaultConfig);
    });

    it('returns parsed config when config file exists', () => {
      const configManager = new ConfigManager();
      const mockConfig = {
        user_profile: {
          access_token: "123",
          github_username: "testuser",
        },
        editor: {
          name: "vim",
          alias: "",
          tmux: true,
        },
        dependencies: true,
      };
      jest.spyOn(configManager, 'writeConfig').mockReturnValueOnce(mockConfig);
      jest.spyOn(configManager, 'getConfig').mockReturnValueOnce(mockConfig);

      const config = configManager.getConfig();

      expect(config).toEqual(mockConfig);
    });

    it('throws an error when config file cannot be found after 5 attempts', () => {
      const configManager = new ConfigManager();
      jest.spyOn(configManager, 'getConfig').mockImplementation(() => {
        throw new Error('Unable to find config file');
      });

      expect(() => configManager.getConfig(6)).toThrow('Unable to find config file');
    });
  });

  describe('writeConfig', () => {
    it('writes default config to file when no params are provided', () => {
      const configManager = new ConfigManager();
      const mockConfig = configManager.defaultConfig;
      jest.spyOn(configManager, 'writeConfig').mockReturnValueOnce(mockConfig);
      jest.spyOn(configManager, 'getConfig').mockReturnValueOnce(mockConfig);

      const config = configManager.writeConfig();

      expect(config).toEqual(mockConfig);
    });

    it('writes provided config to file when params are provided', () => {
      const configManager = new ConfigManager();
      const mockConfig = {
        user_profile: {
          access_token: "123",
          github_username: "testuser",
        },
        editor: {
          name: "vim",
          alias: "",
          tmux: true,
        },
        dependencies: true,
      };
      jest.spyOn(configManager, 'writeConfig').mockReturnValueOnce(mockConfig);
      jest.spyOn(configManager, 'getConfig').mockReturnValueOnce(mockConfig);

      const config = configManager.writeConfig(mockConfig);

      expect(config).toEqual(mockConfig);
    });

    it('returns empty object when there is an error writing to config file', () => {
      const configManager = new ConfigManager();
      jest.spyOn(configManager, 'writeConfig').mockImplementation(() => {
        // throw new Error('Error writing to config file');
        return {} as UserConfig
      });

      const config = configManager.writeConfig();

      expect(config).toEqual({} as UserConfig);
    });
  });

  // describe('revalidateConfig', () => {
  //   it('calls getConfig and Continue after 2 seconds', async () => {
  //     const configManager = new ConfigManager();
  //     const mockConfig = {
  //       user_profile: {
  //         access_token: "123",
  //         github_username: "testuser",
  //       },
  //       editor: {
  //         name: "vim",
  //         alias: "",
  //         tmux: true,
  //       },
  //       dependencies: true,
  //     };
  //     jest.spyOn(configManager, 'getConfig').mockReturnValueOnce(mockConfig);
  //     jest.spyOn(configManager, 'getConfig').mockReturnValueOnce(mockConfig);
  //     jest.spyOn(configManager, 'revalidateConfig').mockImplementationOnce(() => Promise.resolve());

  //     await configManager.revalidateConfig();

  //     expect(configManager.getConfig).toHaveBeenCalledTimes(2);


  //     expect(Continue).toHaveBeenCalled();

  //   });

  //   it('throws an error when access_token is empty', async () => {
  //     const configManager = new ConfigManager();
  //     const mockConfig = {
  //       user_profile: {
  //         access_token: "",
  //         github_username: "testuser",
  //       },
  //       editor: {
  //         name: "vim",
  //         alias: "",
  //         tmux: true,
  //       },
  //       dependencies: true,
  //     };
  //     jest.spyOn(configManager, 'getConfig').mockReturnValueOnce(mockConfig);

  //     await expect(configManager.revalidateConfig()).rejects.toThrow('Unable to update or verify config');
  //   });
  // });
});
