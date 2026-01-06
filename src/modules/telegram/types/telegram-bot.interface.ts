import { TelegramBot } from 'typescript-telegram-bot-api';

export interface TelegramUpdateHandler {
  register(bot: TelegramBot): void;
}
