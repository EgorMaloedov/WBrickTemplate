export interface AppConfig {
  app: {
    port: number;
    publicUrl: string;
  };
  telegram: {
    session: string;
    apiId: number;
    apiHash: string;
    token: string;
    secretToken: string;
    botAdminId: string;
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
