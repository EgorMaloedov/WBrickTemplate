import * as Joi from 'joi';

export const validationSchema = Joi.object({
  APP_PORT: Joi.number().port().default(3000),
  PUBLIC_URL: Joi.string().default(''),

  // TELEGRAM
  TELEGRAM_API_ID: Joi.number().required(),

  TELEGRAM_API_HASH: Joi.string().required(),

  TELEGRAM_BOT_TOKEN: Joi.string().required(),

  TELEGRAM_SECRET_TOKEN: Joi.string().required(),

  TELEGRAM_SESSION_STRING: Joi.string().allow('').default(''),

  TELEGRAM_BOT_ADMIN_ID: Joi.string().required(),
  // NGROK
  NGROK_AUTH_TOKEN: Joi.string().required(),

  REQUIRE_NGROK: Joi.boolean().truthy('true').falsy('false').default(false),

  // REDIS
  REDIS_HOST: Joi.string().hostname().required(),

  REDIS_PORT: Joi.number().port().default(6379),

  // CRYPTO
  MASTER_KEY: Joi.string().min(16).required(),

  IV_LENGTH: Joi.number().integer().positive().required(),

  // DATABASE
  DB_HOST: Joi.string().hostname().required(),

  DB_PORT: Joi.number().port().default(5432),

  DB_USERNAME: Joi.string().required(),

  DB_PASSWORD: Joi.string().required(),

  DB_DATABASE: Joi.string().required(),

  SYNC: Joi.boolean().truthy('true').falsy('false').default(false),
});
