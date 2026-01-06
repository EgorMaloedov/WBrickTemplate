export default () => {
  const publicUrl = process.env.PUBLIC_URL?.trim() || '';

  return {
    app: {
      port: parseInt(process.env.APP_PORT || '3000', 10),
      publicUrl,
    },

    telegram: {
      apiId: Number(process.env.TELEGRAM_API_ID),
      apiHash: process.env.TELEGRAM_API_HASH,
      token: process.env.TELEGRAM_BOT_TOKEN,
      secretToken: process.env.TELEGRAM_SECRET_TOKEN,
    },

    ngrok: {
      authToken: process.env.NGROK_AUTH_TOKEN || '',
      // Более понятное имя — requireNgrok / useNgrok / forceNgrok
      requireNgrok: process.env.REQUIRE_NGROK === 'true' || false,
    },

    cache: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },

    crypto: {
      masterKey: process.env.MASTER_KEY,
      ivLength: parseInt(process.env.IV_LENGTH || '16', 10),
    },

    db: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_DATABASE,
      sync: process.env.SYNC === 'true',
    },

    // Удобный вычисляемый флаг — какой URL в итоге будет использоваться
    webhook: {
      baseUrl:
        publicUrl ||
        (process.env.REQUIRE_NGROK === 'true' ? 'ngrok-will-be-used' : ''),
    },
  };
};
