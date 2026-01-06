export interface AppConfig {
  app: {
    port: number;
    publicUrl: string;
  };
  telegram: {
    apiId: number;
    apiHash: string;
    token: string;
    secretToken: string;
  };
  ngrok: {
    authToken: string;
    requireNgrok: boolean;
  };
  cache: {
    host: string;
    port: number;
  };
  crypto: {
    masterKey: string;
    iv_len: number;
  };
  db: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
    sync: boolean;
  };
}
