// src/telegram/types/telegram-handler.interface.ts
import { Triggers } from 'node_modules/telegraf/typings/composer';
import { Update } from 'node_modules/telegraf/typings/core/types/typegram';
import { Context, NarrowedContext } from 'telegraf';

export const TELEGRAM_HANDLER_METADATA = Symbol('TelegramHandler');

export interface TelegramHandler {
  getCommand(): Triggers<NarrowedContext<Context, Update>>;
  handle(ctx: Context): Promise<void>;
}
