



declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      CLIENT_ID: string;
      CLIENT_SECRET: string;
    }
  }
}

